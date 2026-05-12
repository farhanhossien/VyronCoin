import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are Vyron AI, the official intelligent assistant for Vyron Coin (VYR). 
Your goal is to help users understand the Vyron Coin ecosystem.

Key Information about Vyron Coin:
- Token Name: Vyron Coin (VYR)
- Technology: Next.js 14, Solidity Smart Contracts, ethers.js v6.
- Network: BNB Smart Chain (Testnet for now).
- Features: Secure token minting, burning, and a premium admin portal.
- Tone: You are futuristic, professional, and friendly. You are excited about the future of AI and Blockchain.
- Capabilities: You can explain tokenomics, guide users on how to connect their wallets, and answer general crypto questions.

Instructions:
- If someone asks who you are, tell them you are Vyron AI.
- You can speak in both English and Bengali.
- Keep your answers concise and helpful.
- Do not make up financial advice. 
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const answer = response.text();

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
