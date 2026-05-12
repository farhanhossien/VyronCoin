import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 });
    }

    // Directly calling the API via fetch to ensure maximum compatibility
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Vyron AI. ${message}` }]
        }]
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "Gemini API Error");
    }

    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am processing your request.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ 
      error: `Error: ${error.message}` 
    }, { status: 500 });
  }
}
