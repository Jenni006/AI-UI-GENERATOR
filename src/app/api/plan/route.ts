import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Whitelisted components
const WHITELIST = ["Button", "Card", "Input", "Table", "Modal", "Sidebar", "Navbar", "Chart"];

// Basic schema validation
function validateSchema(schema: any): boolean {
  if (!schema || !schema.components || !Array.isArray(schema.components)) return false;

  function validateComponent(comp: any): boolean {
    if (!WHITELIST.includes(comp.type)) return false;
    if (comp.children && !Array.isArray(comp.children)) return false;
    return comp.children ? comp.children.every(validateComponent) : true;
  }

  return schema.components.every(validateComponent);
}

// Safely extract JSON from AI output
function extractJSON(raw: string): any | null {
  const match = raw.match(/\{[\s\S]*\}/); // first { ... } block
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, previousSchema } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    // Planner: generate UI schema
    const plannerPrompt = `
You are a UI Planner AI.

Rules:
- Use ONLY these components: ${WHITELIST.join(", ")}
- Choose layout: vertical or horizontal
- Output STRICT JSON only, no explanations

IMPORTANT PROP RULES:
- Button: { "label": "Button Text" }
- Input: { "placeholder": "Text" }

Instructions:
- Modify the existing schema minimally based on the user request
- Do NOT remove components unless explicitly requested
- Keep all other components unchanged

Previous Schema:
${previousSchema ? JSON.stringify(previousSchema, null, 2) : "{}"}

User request:
${prompt}

Return format:
{
  "layout": "vertical | horizontal",
  "components": [
    {
      "type": "ComponentName",
      "props": {},
      "children": []
    }
  ]
}
`;
    const plannerResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "system", content: plannerPrompt }],
    });

    const rawPlan = plannerResponse.choices[0]?.message?.content || "";
    console.log("PLANNER RAW OUTPUT:", rawPlan);

    const plan = extractJSON(rawPlan);
    if (!plan) return NextResponse.json({ error: "Failed to parse planner JSON" }, { status: 500 });

    // Validate schema
    if (!validateSchema(plan)) return NextResponse.json({ error: "Invalid schema structure" }, { status: 400 });

    // Generator: convert schema to JSX
    const generatorPrompt = `
You are a React UI Code Generator.

Rules:
- Use ONLY these components: ${WHITELIST.join(", ")}
- Do NOT create new components
- Do NOT use inline styles
- Do NOT use Tailwind
- Output ONLY valid React JSX, no explanations

Given this UI schema:
${JSON.stringify(plan, null, 2)}

Generate React JSX that renders this UI.
`;

    const generatorResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "system", content: generatorPrompt }],
      // streaming
    });

    let generatedCode = generatorResponse.choices[0]?.message?.content || "";

    generatedCode = generatedCode.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "");
    }).trim();

    // Explainer: why changes were made

    const explainerPrompt = `
You are a UI Design Explainer.

User Request:
${prompt}

Rules:
- Return plain text only
- Do NOT use markdown, code, or symbols
- Maximum 6 sentences
- Explain why layout and components were selected
`;

    const explainerResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "system", content: explainerPrompt }],
    });

    const explanation = explainerResponse.choices[0]?.message?.content || "";

    // Return response

    return NextResponse.json({
      schema: plan,
      code: generatedCode,
      explanation,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
