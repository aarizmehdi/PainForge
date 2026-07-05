import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sub = url.searchParams.get("sub");

  if (!sub || !/^[A-Za-z0-9_]{3,21}$/.test(sub)) {
    return NextResponse.json({ valid: false, message: "Invalid subreddit format." }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.reddit.com/r/${sub}/about.json`, {
      headers: { 'User-Agent': 'PainForge/1.0 (Contact: local)' },
      // Important to prevent caching old 404s
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      // Reddit sometimes returns 200 but it's a search page if it doesn't exist, though usually it's 404.
      // If it exists, kind should be "t5"
      if (data.kind === "t5") {
        return NextResponse.json({ valid: true });
      }
    }
    
    return NextResponse.json({ valid: false, message: "Subreddit does not exist or is private." }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ valid: false, message: "Failed to verify subreddit." }, { status: 500 });
  }
}
