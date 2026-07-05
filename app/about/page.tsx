import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Target, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About PainForge | Open Source Lead Generation for Freelancers",
  description: "PainForge is an open-source, AI-powered tool built by Aariz Mehdi to help freelancers find high-intent clients on Reddit and generate hyper-personalized proposals instantly.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-8 space-y-16">
        
        {/* Header Section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight text-primary">
            Catch Real Pain. <br />
            <span className="text-secondary">Forge Real Clients.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            PainForge is a <span className="text-foreground font-medium">free, open-source lead generation engine</span> built specifically for freelancers, agencies, and consultants who are tired of fighting in <span className="text-foreground font-medium">saturated freelance marketplaces</span>.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground font-bold px-8">
                Start Forging Leads
              </Button>
            </Link>
            <a href="https://github.com/aarizmehdi/PainForge" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-primary/20 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> View Source
              </Button>
            </a>
          </div>
        </section>

        {/* The Problem & Solution */}
        <section className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">The Problem</h2>
            <p className="text-muted-foreground leading-relaxed">
              Freelancers spend hours mindlessly scrolling forums or competing in crowded bidding wars against thousands of others. When they finally find a post from someone complaining about a problem they can fix, their pitch sounds like a generic robot. They get ignored.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-secondary">The Solution</h2>
            <p className="text-muted-foreground leading-relaxed">
              PainForge connects directly to Reddit to find people actively complaining about pain points your skills can solve. It then uses advanced AI to instantly generate a <strong>hyper-personalized, human-sounding pitch</strong> directly addressing their exact problem, complete with your portfolio and links.
            </p>
          </div>
        </section>

        {/* How to Use */}
        <section className="space-y-12 pt-12 border-t border-border/20">
          <h2 className="text-[34px] font-extrabold text-center tracking-tight text-foreground">How to Use PainForge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            <Card className="border-border/10 bg-black/20 backdrop-blur-md shadow-xl hover:bg-black/30 transition-all h-full">
              <CardContent className="p-8 space-y-5 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-xl border border-primary/20 shadow-inner shrink-0">1</div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">Setup Your Profile</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">Sign up and enter your Name, Portfolio, and GitHub. This teaches the AI who you are.</p>
              </CardContent>
            </Card>
            <Card className="border-border/10 bg-black/20 backdrop-blur-md shadow-xl hover:bg-black/30 transition-all h-full">
              <CardContent className="p-8 space-y-5 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-xl border border-primary/20 shadow-inner shrink-0">2</div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">Connect OpenRouter</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">Bring your own key (BYOK). Connect your OpenRouter API key securely to enable the AI reasoning engine.</p>
              </CardContent>
            </Card>
            <Card className="border-border/10 bg-black/20 backdrop-blur-md shadow-xl hover:bg-black/30 transition-all h-full">
              <CardContent className="p-8 space-y-5 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-xl border border-primary/20 shadow-inner shrink-0">3</div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">Target Subreddits</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">Add subreddits where your ideal clients hang out (e.g. <code className="bg-white/5 px-1.5 py-0.5 rounded text-white/80">startups</code>, <code className="bg-white/5 px-1.5 py-0.5 rounded text-white/80">SaaS</code>).</p>
              </CardContent>
            </Card>
            <Card className="border-border/10 bg-black/20 backdrop-blur-md shadow-xl hover:bg-black/30 transition-all h-full">
              <CardContent className="p-8 space-y-5 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-xl border border-primary/20 shadow-inner shrink-0">4</div>
                <h3 className="font-bold text-xl tracking-tight text-foreground">Scan & Generate</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed flex-1">Click Scan. The AI analyzes the latest posts, scores them on buying intent, and writes your pitch.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="bg-primary/5 border border-primary/20 rounded-2xl p-10 space-y-6">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10 text-primary" />
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Enterprise-Grade Security</h2>
          </div>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              PainForge is engineered with a security-first architecture, ensuring that your data, API credentials, and lead generation pipelines remain strictly confidential.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div><strong className="text-foreground">Decentralized Execution (BYOK):</strong> Leverage your own LLM API credentials. Requests are authenticated at the edge, ensuring zero proxy-logging or intermediate interception.</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div><strong className="text-foreground">Cryptographic Isolation:</strong> Sensitive credentials are symmetrically encrypted at rest within isolated cloud environments. Tokens are never exposed to the client bundle, strictly bypassing persistent local storage.</div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div><strong className="text-foreground">Open-Source Verifiability:</strong> Transparency is the ultimate security layer. The platform architecture is entirely open-source, allowing for independent security audits and self-hosted deployments.</div>
              </li>
            </ul>
          </div>
        </section>

        {/* Creator Info */}
        <section className="flex flex-col md:flex-row items-center gap-8 pt-12 mt-12 border-t border-border/20">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Architected by Aariz Mehdi</h2>
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <p>
                I built PainForge because the best clients aren't found fighting for scraps on freelance marketplaces—they are found actively complaining about their problems on forums. 
              </p>
              <p>
                I needed a tool that did more than just blindly scrape data. PainForge is built as a context engine designed to actually understand the <strong className="text-foreground">psychology of outreach</strong> and generate proposals that sound like a real human offering a real solution.
              </p>
              <p className="text-base pt-2">
                Check out my portfolio to see more of my work, or follow the GitHub repo to contribute to the project!
              </p>
            </div>
            <div className="pt-2">
              <a href="https://aarizm.dev" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                Visit aarizm.dev <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
