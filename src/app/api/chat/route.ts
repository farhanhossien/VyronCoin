import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is missing in Vercel environment variables." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const SYSTEM_PROMPT = "You are Vyron AI, the official assistant for Vyron Coin. Be helpful.";
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message}`);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    // Returning the actual error message to the frontend for debugging
    return NextResponse.json({ 
      error: `Gemini Error: ${error.message || "Unknown error occurred"}` 
    }, { status: 500 });
  }
}
