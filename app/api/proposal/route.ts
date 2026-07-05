import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { openRouterKey, model = "nvidia/nemotron-3-super-120b-a12b:free", title, rawText, companyName, jobType, country, profile, format = "DM" } = await req.json();

    if (!openRouterKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 400 });
    }

    const formatContext = format === "Email" ? "a cold email" : format === "Comment" ? "a public comment replying to this post" : "a direct message (DM) on Reddit or Twitter";

    const senderLink = profile?.portfolio || profile?.github || "";

    const formatGuide = format === "Email" ? `
FORMAT: Cold Email

PSYCHOLOGY: The recipient gets dozens of cold emails. They skim the subject line and first sentence. If either feels generic, they delete it. Your subject line must reference THEIR specific problem or role — not you. Your opening line must show you actually read their post and understand what they need. The rest proves you can deliver.

LENGTH: 4-6 sentences. Subject line + 2 short paragraphs + signature. No more.

APPROACH:
- Open with a subject line that names their specific need (not "Experienced Developer Available")
- First sentence: reference their exact problem or requirement — prove you read the post
- Second sentence: your directly relevant experience — be specific (years, technologies, outcomes)
- Third sentence: one concrete thing you could do for them or a result you've achieved
- Close with a low-pressure next step like "Happy to jump on a quick call if this sounds relevant."

SIGNATURE:
Best,
${profile?.fullName || "A Freelancer"}
${senderLink ? senderLink : ""}${profile?.linkedin ? `\nLinkedIn: ${profile.linkedin}` : ""}${profile?.github && profile?.portfolio ? `\nGitHub: ${profile.github}` : ""}
` 
    : format === "Comment" ? `
FORMAT: Public Reddit Comment

PSYCHOLOGY: You are one of hundreds of comments. Nobody reads long comments. The poster will scan for someone who clearly has the skills and is available — that's it. In public, overpitching makes you look desperate. Underpitching makes you forgettable. The sweet spot is confident brevity: "I do this exact thing, I'm available, DM me."

LENGTH: 2-3 sentences. Absolute maximum. Think of it as a tweet, not a cover letter.

APPROACH:
- First sentence: state your relevant skill or experience that directly matches what they need. Be specific — name the technologies or domain.
- Second sentence: say you're available/interested if it makes sense.
- End with: "Feel free to DM me if you want to chat."
- That's it. No greetings, no sign-off, no name, no links. Your Reddit profile speaks for itself.

THINGS TO NEVER DO:
- Never open with "Hey", "Hi", or any greeting
- Never comment on the salary or pay rate
- Never write more than 3 sentences
- Never include your name, portfolio, or any links
` 
    : `
FORMAT: Private Direct Message (DM)

PSYCHOLOGY: A DM is intimate — it lands in their personal inbox. If it reads like a template, they'll ignore it. If it reads like a friend-of-a-friend reaching out, they'll respond. The key is to sound like you stumbled on their post and genuinely thought "oh, I could actually help with this" — not like you're mass-messaging 50 people.

LENGTH: 3-5 sentences max. Short enough to read in 10 seconds.

APPROACH:
- Open casually referencing their specific post or problem (e.g., "Hey — saw your post about needing a ColdFusion dev")
- Mention your directly relevant experience in ONE sentence. Be concrete — name technologies, domains, or types of projects.
- If they posted a job, say you're interested. If they posted a problem, say what you'd do to fix it.
- Close naturally. Don't beg. Don't be formal.

SIGNATURE:
Cheers,
${profile?.fullName || "A Freelancer"}
${senderLink}
`;

    const prompt = `
You are writing outreach as a freelancer. The user below has filled in their profile and you are writing on their behalf.

CORE PHILOSOPHY:
- Write like a real human, not an AI. No corporate buzzwords. No filler phrases. Every sentence must earn its place.
- Mirror the energy of the post. If it's casual, be casual. If it's formal/corporate, be slightly more polished — but never stiff.
- Show, don't tell. "I've built 3 ColdFusion apps for government clients" beats "I have extensive experience in web development."
- Never use these words: delve, synergy, realm, testament, navigate, leverage, utilize, facilitate.
- Never use markdown formatting like [text](url). Write plain text only.

${formatGuide}

THE POST YOU'RE RESPONDING TO:
Title: ${title}
Post Content: ${rawText}
Company: ${companyName || "Not mentioned"}
Job Type: ${jobType || "Not mentioned"}
Location: ${country || "Not mentioned"}

YOUR PROFILE (write as this person):
Name: ${profile?.fullName || "A Freelancer"}
Portfolio: ${profile?.portfolio || "Not provided"}
GitHub: ${profile?.github || "Not provided"}
LinkedIn: ${profile?.linkedin || "Not provided"}

Write the message now. No preamble, no explanation — just the message itself.
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

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
        messages: [{ role: "user", content: prompt }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Failed to generate proposal");

    const data = await response.json();
    return NextResponse.json({ proposal: data.choices[0].message.content });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: "Generation timed out. Please try a faster model." }, { status: 504 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
