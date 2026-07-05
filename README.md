<div align="center">
  <img src="https://img.icons8.com/color/96/000000/hammer.png" alt="PainForge Logo" width="80" height="80">
  <h1 align="center">PainForge</h1>
  <p align="center">
    <strong>Catch Real Pain. Forge Real Clients.</strong>
    <br />
    An open-source AI context engine that finds high-intent clients on forums and generates hyper-personalized proposals instantly.
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#how-to-use-painforge">How to Use</a> •
    <a href="#installation--local-setup">Installation</a> •
    <a href="#architected-by">Built By</a>
  </p>
</div>

<hr />

## 🎯 The Problem
Freelancers spend hours mindlessly scrolling forums or competing in crowded bidding wars against thousands of others. When they finally find a post from someone complaining about a problem they can fix, their pitch sounds like a generic robot. They get ignored.

## ⚡ The Solution
**PainForge** connects directly to Reddit's RSS feeds to find people actively complaining about pain points your skills can solve. It then uses advanced AI to instantly generate a **hyper-personalized, human-sounding pitch** directly addressing their exact problem, complete with your portfolio and links. 

It completely removes the friction of outreach while maximizing the psychology of cold messaging.

---

## ✨ Features

- **Reddit RSS Integration:** Scrape subreddits in real-time without needing Reddit API keys or dealing with rate limits.
- **AI Scoring Engine:** Every post is read by AI and scored from 1-10 based on buying intent and urgency. Low-intent posts are automatically filtered out.
- **Pain Point Extraction:** The AI extracts exact pain points, company names, job types, and locations from raw Reddit text.
- **Format-Aware Generation:**
  - **Cold Email:** Professional, 4-sentence structure with subject lines.
  - **Reddit Comment:** Tweet-length, aggressive brevity. No links or signatures to prevent bans.
  - **Direct Message (DM):** Intimate, casual, and highly personalized.
- **Built-in CRM:** Track all generated proposals, links, and Reddit URLs directly in your dashboard.
- **BYOK (Bring Your Own Key):** Powered by OpenRouter. Plug in your own API key to use any model.

---

## 🛠️ How to Use PainForge

Using PainForge effectively requires targeting the right communities and configuring the AI engine.

### 1. Setup Your Profile
Sign up and enter your Name, Portfolio, and GitHub links. This teaches the AI who you are so it can seamlessly inject your credentials into proposals without sounding robotic.

### 2. Connect OpenRouter (BYOK)
PainForge uses a Bring-Your-Own-Key architecture for zero-exposure security. 
1. Create a free account at [OpenRouter.ai](https://openrouter.ai/).
2. Generate an API Key.
3. Paste it securely into the PainForge dashboard. 
*Note: We default to free models like Nvidia Nemotron, meaning you can generate unlimited proposals for $0.*

### 3. Target the Right Subreddits
Don't target subreddits filled with other freelancers (like `r/freelance`). Target subreddits where your ideal clients hang out and complain about their businesses. 
**Great Subreddits for Web Developers / SaaS Builders:**
- `SaaS`
- `startups`
- `smallbusiness`
- `Entrepreneur`
- `webdev` (Look for "help me" posts)

### 4. Scan & Generate
Click **Scan**. The AI analyzes the latest posts from your target subreddits, scores them based on buying intent, and writes your pitch.

---

## 🚀 Installation & Local Setup

PainForge is built on **Next.js 15 (App Router)**, **TailwindCSS**, and **Firebase**.

### 1. Clone the Repository
```bash
git clone https://github.com/aarizmehdi/PainForge.git
cd PainForge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
PainForge relies on Firebase Authentication and Firestore for saving user profiles, settings, and history.
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password & Google).
3. Enable **Firestore Database**.
4. Create a `.env.local` file in the root directory and add your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` and create an account!

---

## 🔒 Enterprise-Grade Security
1. **Decentralized Execution (BYOK):** Leverage your own LLM API credentials. Requests are authenticated at the edge.
2. **Cryptographic Isolation:** Sensitive credentials are symmetrically encrypted at rest within isolated cloud environments.
3. **Open-Source Verifiability:** The entire codebase is completely open source for independent security audits.

---

## 👨‍💻 Architected By

PainForge was architected and engineered by **Aariz Mehdi**. 

I built PainForge because the best clients aren't found fighting for scraps on freelance marketplaces—they are found actively complaining about their problems on forums. I needed a tool that did more than just blindly scrape data. PainForge is built as a context engine designed to actually understand the **psychology of outreach** and generate proposals that sound like a real human offering a real solution.

- **Portfolio:** [aarizm.dev](https://aarizm.dev)
- **GitHub:** [@aarizmehdi](https://github.com/aarizmehdi)

### License
MIT License. Feel free to fork, modify, and build upon this! If you build something cool, let me know.build something cool, let me know.
