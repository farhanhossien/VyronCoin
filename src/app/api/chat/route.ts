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
    const snippets = searchData.organic?.slice(0, 3).map((s: any) => s.snippet).join("\n") || "No recent info found.";

    const SYSTEM_PROMPT = `
You are Vyron AI, the official assistant for VYRON — a premium builder system. 

About VYRON:
VYRON is a system designed to attract builders, train them through discipline, organize them into teams, and build real projects/startups together.

The VYRON Master Plan (10 Phases):
1. Attention (Daily content on focus and discipline).
2. Community (Structured Discord server with daily missions).
3. User Growth (First 100 free, then paid entry).
4. System (Daily missions, streak tracking).
5. Team System (Teams of 5-8 active members).
6. Project System (Community ideas + VYRON Core high-value projects).
7. Ownership Model (VYRON stake + Team rewards).
8. Selection (Top performers join core team).
9. Product System (Building startups like Meditation/Focus apps).
10. Future (Building the VYRON App).

Core Team Members:
- Quaidshirzad: Founder / CEO (System builder, database, approvals).
- Kunal: Head of Content & Marketing (Growth and daily content).
- Tejas: CPO / Tech Lead (Leading development, meditation app).
- Farhan: AI & Innovation (Supporting features, logic, and new ideas).
- Prince: Web Developer (Building website and application system).

How to Join:
Users must apply via the official website. The Founder verifies applications. Only serious builders are accepted into the Discord.

Latest Search Info (Use this for real-time questions):
${snippets}

Your Tone: Futuristic, professional, and highly disciplined. You represent the "Builder Mindset". Answer in English or Bengali as requested.`;

    // Step 2: Use Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
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
