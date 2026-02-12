import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const systemPrompt = `
You are a UI planner.
Return ONLY valid JSON.
No explanation.
Only JSON.
Use this schema:

{
  "type": "div",
  "props": {
    "className": "string"
  },
  "children": []
}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  return Response.json({
    result: completion.choices[0].message.content,
  });
}
