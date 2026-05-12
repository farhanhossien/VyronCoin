import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Groq API Key is missing in Vercel settings." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are Vyron AI, the official assistant for Vyron Coin. You are helpful, professional, and knowledgeable about blockchain and Vyron Coin. You speak both English and Bengali." },
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Groq API Error");
    }

    const answer = data.choices?.[0]?.message?.content || "I am processing your request.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
