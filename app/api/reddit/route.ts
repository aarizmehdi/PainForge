import { NextResponse } from "next/server";
import snoowrap from "snoowrap";

async function classifyWithAI(openRouterKey: string, postTitle: string, postBody: string) {
  const prompt = `
You are an elite freelance lead researcher for the "PainForge" application. 
Your job is to analyze the following Reddit post and determine if it represents a real business pain point that a freelancer could solve.

Classify it into one of these categories:
- High Pain
- Wish/Need
- Workaround
- Hiring Intent
- Low Value

Score the pain from 1-10 (10 being highest pain/opportunity).
Extract the key pain points in a concise bulleted list.

Post Title: ${postTitle}
Post Body: ${postBody}

Return your analysis in valid JSON format:
{
  "category": "...",
  "score": 8,
  "keyPainPoints": ["...", "..."],
  "confidence": 9
}
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openRouterKey}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "PainForge",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-pro",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with OpenRouter");
  }

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch (e) {
    return { category: "Low Value", score: 0, keyPainPoints: [], confidence: 0 };
  }
}

export async function POST(req: Request) {
  try {
    const { subreddit, limit = 10, openRouterKey, redditCredentials } = await req.json();

    if (!subreddit || !openRouterKey || !redditCredentials) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const r = new snoowrap({
      userAgent: 'PainForge:v1.0 (by /u/PainForge)',
      clientId: redditCredentials.clientId,
      clientSecret: redditCredentials.clientSecret,
      username: redditCredentials.username,
      password: redditCredentials.password
    });

    const posts = await r.getSubreddit(subreddit).getNew({ limit });
    
    const analyzedPosts = [];
    
    for (const post of posts) {
      // Avoid analyzing empty or deleted posts
      if (post.selftext === "[removed]" || post.selftext === "[deleted]") continue;
      
      const analysis = await classifyWithAI(openRouterKey, post.title, post.selftext);
      
      if (analysis.score >= 5) {
        analyzedPosts.push({
          id: post.id,
          title: post.title,
          subreddit: post.subreddit.display_name,
          author: post.author.name,
          url: post.url,
          text: post.selftext.substring(0, 300) + (post.selftext.length > 300 ? "..." : ""),
          created_utc: post.created_utc,
          analysis
        });
      }
    }

    return NextResponse.json({ posts: analyzedPosts });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
