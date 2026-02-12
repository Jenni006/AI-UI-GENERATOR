import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, previousSchema } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    // -------------------------
    // PLANNER - incremental edit
    // -------------------------
    const plannerPrompt = `
You are a UI Planner AI.

Rules:
- Use ONLY these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- Choose layout: vertical or horizontal
- Output STRICT JSON only
- No explanations or extra text

IMPORTANT PROP RULES:
- Button must use: { "label": "Button Text" }
- Input must use: { "placeholder": "Text" }

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

    const rawPlan = plannerResponse.choices[0]?.message?.content;

    if (!rawPlan) {
      return NextResponse.json({ error: "Planner failed" }, { status: 500 });
    }

    const cleaned = rawPlan.replace(/```json|```/g, "").trim();
    const plan = JSON.parse(cleaned);

    // -------------------------
    // GENERATOR
    // -------------------------
    const generatorPrompt = `
You are a React UI Code Generator.

Rules:
- Use ONLY these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- Do NOT create new components
- Do NOT use inline styles
- Do NOT use Tailwind
- Output ONLY valid React JSX
- No explanations

Given this UI schema:

${JSON.stringify(plan, null, 2)}

Generate React JSX that renders this UI.
`;

    const generatorResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "system", content: generatorPrompt }],
    });

    const generatedCode = generatorResponse.choices[0]?.message?.content || "";

    // -------------------------
    // EXPLAINER
    // -------------------------
    const explainerPrompt = `
You are a UI Design Explainer.

User Request:
${prompt}

Generated Schema:
${JSON.stringify(plan, null, 2)}

Rules:
- Return plain text only
- Do NOT use markdown
- Do NOT use *, **, _, # or any formatting symbols
- No bullet points or headings
- No code
- Keep it short and clear
- Maximum 6 sentences

Explain:
- Why this layout was selected
- Why each component was used
- Keep it short and clear
`;

    const explainerResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0,
      messages: [{ role: "system", content: explainerPrompt }],
    });

    const explanation = explainerResponse.choices[0]?.message?.content || "";

    // -------------------------
    // RETURN ALL
    // -------------------------
    return NextResponse.json({
      schema: plan,
      code: generatedCode,
      explanation,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
