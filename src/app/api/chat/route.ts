import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Serper API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: message }),
    });

    const data = await response.json();
    
    // Extract a simple answer from snippets
    let answer = "I couldn't find a specific answer for that. Try asking something else!";
    if (data.answerBox && data.answerBox.answer) {
      answer = data.answerBox.answer;
    } else if (data.organic && data.organic.length > 0) {
      answer = data.organic[0].snippet;
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
