<div align="center">
  <img src="app/icon.svg" alt="PainForge Logo" width="140" height="140">
  
  # PainForge
  
  **Catch Real Pain. Forge Real Clients.**
  
  *An open-source AI context engine that finds high-intent clients on forums and generates hyper-personalized proposals instantly.*

  <p align="center">
    <a href="https://github.com/aarizmehdi/PainForge/blob/master/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge&color=E30613" alt="License: MIT">
    </a>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&color=09090b" alt="Tailwind">
    <img src="https://img.shields.io/badge/Firebase-v12-FFCA28?style=for-the-badge&logo=firebase&color=121214" alt="Firebase">
  </p>

  <p align="center">
    <a href="#-the-problem">The Problem</a> •
    <a href="#-the-solution">The Solution</a> •
    <a href="#%EF%B8%8F-features--architecture">Architecture</a> •
    <a href="#-how-to-use-painforge">How to Use</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-license--contributing">Contributing</a>
  </p>
</div>

<br/>

---

## 🎯 The Problem vs. The Solution

<table>
<tr>
<td width="50%" valign="top">
  
### ❌ The Old Way (Saturated)
Freelancers spend hours mindlessly scrolling forums or competing in crowded bidding wars against thousands of others in saturated freelance marketplaces. When they finally find a post from someone complaining about a problem they can fix, their pitch sounds like a generic robot. **They get ignored.**
</td>
<td width="50%" valign="top">

### ✅ The PainForge Way
PainForge connects directly to RSS feeds to find people actively complaining about pain points your skills can solve. It then uses advanced AI to instantly generate a **hyper-personalized, human-sounding pitch** directly addressing their exact problem, complete with your portfolio and links.
</td>
</tr>
</table>

---

## ⚙️ Features & Architecture

<details>
<summary><strong>1️⃣ Real-Time Reddit RSS Engine</strong></summary>
<br/>
PainForge bypasses the official Reddit API limitations by utilizing direct <code>.rss</code> feeds. This ensures zero rate-limiting, no API key requirements, and instant access to the latest posts from any subreddit globally.
</details>

<details>
<summary><strong>2️⃣ Advanced AI Scoring (1-10)</strong></summary>
<br/>
Every post is read by the AI and assigned a "Pain Score" from 1 to 10. 
<ul>
  <li><strong>Score 8-10:</strong> Immediate buying intent. Someone urgently needs a problem solved.</li>
  <li><strong>Score 1-4:</strong> Low intent. (e.g., Job seekers, other freelancers, generic complaints). These are aggressively filtered out so you only see high-value leads.</li>
</ul>
</details>

<details>
<summary><strong>3️⃣ Format-Aware Proposal Generation</strong></summary>
<br/>
The prompt engine understands the psychology of different outreach platforms:
<ul>
  <li><strong>Reddit Comments:</strong> Tweet-length brevity. Aggressively trims fluff. Zero links to prevent shadowbans.</li>
  <li><strong>Direct Messages (DM):</strong> Intimate, casual. Speaks like a peer texting a friend.</li>
  <li><strong>Cold Email:</strong> Professional, structured 4-sentence formats with high-converting subject lines.</li>
</ul>
</details>

<details>
<summary><strong>4️⃣ Bring-Your-Own-Key (BYOK) Security</strong></summary>
<br/>
PainForge is built on OpenRouter.ai, allowing you to use <strong>any</strong> LLM model (Llama 3, Claude 3.5, GPT-4o, or free models like Nvidia Nemotron). Your API keys are encrypted at rest in Firebase and authenticated directly at the edge. Zero proxy-logging.
</details>

---

## 🛠️ How to Use PainForge

Using PainForge effectively requires targeting the right communities and configuring the AI engine. Here is the step-by-step workflow:

### Step 1: Setup Your Profile
Sign up and enter your Name, Portfolio, and GitHub links. The AI ingests this context so it can seamlessly inject your credentials into proposals without sounding robotic.

### Step 2: Connect OpenRouter (BYOK)
PainForge requires an OpenRouter API key to power its reasoning engine.
1. Create a free account at [OpenRouter.ai](https://openrouter.ai/).
2. Generate an API Key.
3. Paste it securely into the PainForge **Settings** dashboard.
> **Pro Tip:** By default, PainForge uses `nvidia/nemotron-3-super-120b-a12b:free`. This means you can generate unlimited proposals for **$0**.

### Step 3: Target the Right Subreddits
The secret to lead generation is looking where clients complain, not where freelancers hang out. **Do not** target subreddits like `r/freelance`. 
Instead, target niche business subreddits.

**🔥 High-Value Subreddit Examples:**
- `SaaS`
- `startups`
- `smallbusiness`
- `Entrepreneur`
- `marketing`
- `webdev` *(Look for non-technical founders asking for help)*

### Step 4: Scan & Generate
Go to the Dashboard, type in your target subreddit, and click **Scan**. 
1. The AI pulls the latest 30 posts.
2. It scores them based on buying intent.
3. It instantly writes a custom pitch for the highest-scoring leads.
4. Click **Copy** and send your pitch!

---

## 🚀 Installation

PainForge is built on **Next.js 16**, **TailwindCSS v4**, and **Firebase v12**.

<details>
<summary><strong>Click to view Local Setup Instructions</strong></summary>

### 1. Clone & Install
```bash
git clone https://github.com/aarizmehdi/PainForge.git
cd PainForge
npm install
```

### 2. Setup Firebase
PainForge relies on Firebase Auth and Firestore.
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database**.
4. Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to start forging leads.
</details>

---

## 👨‍💻 Architected By

PainForge was architected and engineered by **Aariz Mehdi**. 

> *"I built PainForge because the best clients aren't found fighting for scraps on freelance marketplaces—they are found actively complaining about their problems on forums. I needed a tool that did more than just blindly scrape data. PainForge is built as a context engine designed to actually understand the psychology of outreach and generate proposals that sound like a real human offering a real solution."*

- **Portfolio:** [aarizm.dev](https://aarizm.dev)
- **GitHub:** [@aarizmehdi](https://github.com/aarizmehdi)

---

## 📜 License & Contributing

<details>
<summary><strong>Open Source License</strong></summary>
<br/>
This project is licensed under the <strong>MIT License</strong>. See the <a href="LICENSE">LICENSE</a> file for details.
You are free to fork, modify, and build upon this platform. If you build something amazing, let me know!
</details>

<details>
<summary><strong>Contributing</strong></summary>
<br/>
Contributions are welcome! Please open an issue or submit a pull request for any bugs, UI improvements, or additional integrations (like adding HackerNews RSS support!).
</details>
