import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { openRouterKey, title, keyPainPoints } = await req.json();

    if (!openRouterKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
    }

    const prompt = `
You are an expert freelance copywriter. 
Write a short, highly personalized, non-spammy outreach message to the author of this Reddit post. 
Your goal is to offer help with their specific pain points without being overly salesy. 

Post Title: ${title}
Pain Points: ${keyPainPoints.join(", ")}

Keep it under 150 words. Be conversational, empathetic, and professional.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PainForge",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) throw new Error("Failed to generate proposal");

    const data = await response.json();
    return NextResponse.json({ proposal: data.choices[0].message.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
