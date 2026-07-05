import { NextResponse } from "next/server";
import Parser from "rss-parser";

async function classifyWithAI(openRouterKey: string, model: string, postTitle: string, postBody: string) {
  const prompt = `
You are an elite freelance lead researcher for the "PainForge" application. 
Your job is to analyze the following Reddit post and determine if it represents a real business pain point that a freelancer could solve, or if the user is actively looking to hire.

Classify it into one of these categories:
- Hiring Intent (Actively looking to hire)
- High Pain (Has a severe problem they need solved)
- Wish/Need (Wants something built or solved)
- Workaround (Complaining about a problem)
- Low Value / Job Seeker (Looking for a job or offering services)

CRITICAL SCORING RULES:
- Score from 1-10 (10 being highest opportunity).
- Give a high score (8-10) ONLY to people actively looking to hire or people with severe, urgent pain points.
- Give a low score (1-3) to people who are looking for a job, offering their services ("I will build this for you"), or posts that are irrelevant. We ONLY want leads we can pitch to.

Write a clear, detailed, and professional summary paragraph (minimum 3 to 4 lines, but can be up to 10+ lines if there is a lot of context) that explains exactly what the user is looking for and what the core pain points are. Do not use bullet points; write a detailed continuous paragraph.
Also extract the following details if they are mentioned or heavily implied (if not mentioned, return null):
- companyName
- jobType (e.g., Remote, Hybrid, Onsite, Contract)
- country (e.g., USA, UK, India, etc.)

Post Title: ${postTitle}
Post Body: ${postBody}

Return your analysis in valid JSON format:
{
  "category": "...",
  "score": 8,
  "summary": "This user is looking for a freelance developer to help them build a...",
  "companyName": "TechCorp",
  "jobType": "Remote",
  "country": "USA",
  "confidence": 9
}
`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PainForge",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter Error:", errorText);
      throw new Error("Failed to communicate with OpenRouter: " + errorText);
    }

    const data = await response.json();
    try {
      let content = data.choices[0].message.content;
      // Safely extract JSON in case the AI wraps it in markdown blocks like ```json ... ```
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      return JSON.parse(content);
    } catch (e) {
      console.error("JSON parsing error:", data?.choices?.[0]?.message?.content || data);
      return { category: "Low Value", score: 0, summary: "", confidence: 0 };
    }
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error("OpenRouter fetch failed or timed out:", err.message);
    return { category: "Low Value", score: 0, summary: "", confidence: 0 };
  }
}

export async function POST(req: Request) {
  try {
    const { subreddit, limit = 30, openRouterKey, model = "nvidia/nemotron-3-super-120b-a12b:free" } = await req.json();

    if (!subreddit || !openRouterKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const parser = new Parser();
    const feed = await parser.parseURL(`https://www.reddit.com/r/${subreddit}/.rss`);

    const postsToAnalyze = feed.items.slice(0, limit);

    // Process all posts in parallel
    const analysisPromises = postsToAnalyze.map(async (post) => {
      if (!post.title && !post.contentSnippet) return null;

      try {
        const analysis = await classifyWithAI(openRouterKey, model, post.title || "No Title", post.contentSnippet || "");
        if (analysis.score >= 5) {
          return {
            id: post.id || post.guid || Math.random().toString(),
            title: post.title,
            subreddit: subreddit,
            author: post.author || "Unknown",
            url: post.link,
            text: (post.contentSnippet || "").substring(0, 300) + ((post.contentSnippet || "").length > 300 ? "..." : ""),
            created_utc: post.isoDate ? new Date(post.isoDate).getTime() / 1000 : Date.now() / 1000,
            analysis
          };
        }
      } catch (err) {
        console.error("Error analyzing post:", err);
      }
      return null;
    });

    const results = await Promise.all(analysisPromises);
    const analyzedPosts = results
      .filter((post) => post !== null)
      .sort((a, b) => b.analysis.score - a.analysis.score);

    return NextResponse.json({ posts: analyzedPosts });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
