import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const groqKey = process.env.GROQ_API_KEY;
    const serperKey = process.env.SERPER_API_KEY;

    if (!groqKey || !serperKey) {
      return NextResponse.json({ error: "API Keys are missing in Vercel settings." }, { status: 500 });
    }

    // Step 1: Search Google via Serper for latest info
    const searchRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: message }),
    });
    const searchData = await searchRes.json();
    
    // Get snippets from search results
    const snippets = searchData.organic?.slice(0, 3).map((s: any) => s.snippet).join("\n") || "No recent info found.";

    // Step 2: Use Groq to summarize and answer based on search results
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are Vyron AI, the official assistant for Vyron Coin. 
            Use the following latest search results to answer the user's question accurately. 
            If the info is about current events (like politics or news), rely ONLY on the search results provided below.
            
            Latest Search Context:
            ${snippets}
            
            Answer in a friendly and professional way in the language of the user (English or Bengali).` 
          },
          { role: "user", content: message }
        ],
      }),
    });

    const groqData = await groqRes.json();
    const answer = groqData.choices?.[0]?.message?.content || "I couldn't process that.";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
