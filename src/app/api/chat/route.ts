import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing in Vercel settings" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Using a more standard way to initialize the model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro" // Using gemini-pro as it's more widely compatible
    });

    const SYSTEM_PROMPT = "You are Vyron AI, the official assistant for Vyron Coin. Be helpful and futuristic.";
    
    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nUser: ${message}`);
    const response = await result.response;
    const answer = response.text();

    if (!answer) {
      throw new Error("Empty response from Gemini");
    }

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
