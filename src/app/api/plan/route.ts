import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are a UI planning agent.

Your job:
Convert user intent into STRICT JSON.

Rules:
- Use ONLY these components:
  Button
  Card
  Input
  Table
  Modal
  Sidebar
  Navbar
  Chart

- DO NOT invent new components
- DO NOT add styling
- DO NOT explain anything
- Return ONLY valid JSON
- No markdown
- No backticks

JSON structure format:

{
  "layout": "vertical" | "horizontal",
  "components": [
    {
      "type": "ComponentName",
      "props": {
        "title": "optional",
        "label": "optional",
        "placeholder": "optional",
        "children": []
      }
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0, // IMPORTANT for determinism
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "Empty response from LLM" },
        { status: 500 }
      );
    }

    // Try parsing JSON safely
    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON returned from LLM", raw: content },
        { status: 500 }
      );
    }

    // Basic component whitelist validation
    const allowedComponents = [
      "Button",
      "Card",
      "Input",
      "Table",
      "Modal",
      "Sidebar",
      "Navbar",
      "Chart",
    ];

    const isValid = parsed.components?.every((comp: any) =>
      allowedComponents.includes(comp.type)
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid component detected" },
        { status: 400 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Planner Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

