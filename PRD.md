# PAINFORGE – FULL BUILD PROMPT
**Project Name:** PainForge  
**Tagline:** Catch Real Pain. Forge Real Clients.  
**Version:** 1.0  
**Goal:** Build a complete, production-ready, open-source Subreddit Pain-Point Interceptor tool.

## 1. Project Overview
PainForge is a free, open-source tool that scans niche subreddits for real business pain points, uses AI to classify them, and generates high-quality, non-spammy outreach proposals for freelancers.

It consists of:
- A web dashboard (Next.js)
- Backend logic for Reddit monitoring
- AI analysis engine (OpenRouter BYOK)
- Beautiful UI with bold, energetic design

## 2. Design Philosophy (Very Important)
Use the **League of Launchers** style you liked:
- Primary colors: Bold Red (#E30613 or #DC143C), Bright Yellow (#FFED00 or #FFD700), Black, Off-white
- High contrast, motivational, startup energy
- Card-based layout
- Bold sans-serif typography (Inter or Satoshi)
- Diagonal accents where appropriate

### Fibonacci / Golden Ratio Color & Layout Theory
- Use Golden Ratio (1.618) for proportions: sidebar vs content, button sizes, spacing, typography scale.
- Color harmony: Red (energy/action) as primary CTA, Yellow (optimism/launch) for highlights, Black for backgrounds.
- Layout: Apply Fibonacci spiral mentally — important elements (digest cards) get more visual weight following golden ratio.

Dark mode by default with high energy feel.

## 3. Tech Stack (Modern 2026 Best Practices)
- **Frontend**: Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (Auth, Postgres, Storage) – use free tier
- **Reddit**: PRAW library (official API) + fallback if needed
- **AI**: OpenRouter SDK with user-provided API key + fallback chain (Groq → Ollama → OpenAI)
- **Scheduling**: Vercel Cron Jobs for daily digests
- **Styling**: Tailwind with custom golden-ratio spacing scale
- **Deployment**: Vercel + GitHub

## 4. Core Features (Build in this order)

### Phase 1: Foundation
- Authentication (Supabase)
- User settings page for OpenRouter API key (securely stored)
- Subreddit selection (default list + custom)

### Phase 2: Core Engine
- Function to fetch recent posts from chosen subreddits using PRAW
- AI Prompt System (very important – make it excellent):
  - Analyze title + body + top comments
  - Classify: High Pain, Wish/Need, Workaround, Hiring Intent, Low Value
  - Score 1-10 + confidence
  - Extract key pain points and context

### Phase 3: User Experience
- Dashboard: Today's Top Opportunities (cards)
- Each card shows: Post title, subreddit, pain score, excerpt, "Generate Proposal" button
- Proposal generator: Creates personalized, helpful outreach message
- History page with search/filter
- Daily email digest option (optional)

### Phase 4: Polish
- Responsive design (mobile + desktop)
- Dark mode with red/yellow accents
- Export to CSV
- Clear privacy & responsible use disclaimers
- Beautiful landing page / marketing site

## 5. AI Prompts (Make these world-class)
Create a system prompt that makes the AI act as an expert freelance lead researcher. It should be highly accurate at detecting real business problems.

## 6. Project Structure
Create a clean, scalable Next.js project with:
- app/ (App Router)
- components/
- lib/ (supabase, praw, openrouter)
- prompts/
- types/

## 7. Additional Requirements
- Fully open-source (MIT license)
- Excellent README.md with installation, setup, and usage instructions
- Responsive, fast, beautiful UI matching League of Launchers energy
- Error handling and rate limit protection
- Golden ratio aware spacing and layout

## 8. Success Criteria
- The tool should feel premium and motivating
- Clean, maintainable, well-commented code
- Ready to deploy on Vercel
- Users can start catching real leads within 5 minutes of setup

Start building this project now. Begin with project initialization, then the design system, then authentication, then the core Reddit + AI engine. Think step by step and show progress.

You are an elite full-stack engineer. Make this the best open-source pain point tool ever built.