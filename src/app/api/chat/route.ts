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
    
    // Switching to the more robust gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"
    });

    const SYSTEM_PROMPT = "You are Vyron AI, the official assistant for Vyron Coin. You are a helpful and futuristic AI. Answer the user's questions about crypto and Vyron Coin professionally.";
    
    // Combining system prompt with user message for better context
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${message}\nAI:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const answer = response.text();

    if (!answer) {
      throw new Error("Empty response from AI");
    }

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    // Return a more user-friendly error message
    return NextResponse.json({ 
      error: "AI is currently unavailable. Please make sure the API key is correct and try again." 
    }, { status: 500 });
  }
}
