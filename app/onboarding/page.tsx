"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchExisting() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.portfolio) setPortfolio(data.portfolio);
          if (data.github) setGithub(data.github);
          if (data.openRouterKey) setOpenRouterKey(data.openRouterKey);
          if (data.subreddits && data.subreddits.length > 0) {
            setSubreddits(data.subreddits.join(", "));
          }
        }
      }
    }
    fetchExisting();
  }, [user]);

  const handleVerifyKey = async () => {
    if (!openRouterKey) return;
    setVerifying(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: { "Authorization": `Bearer ${openRouterKey}` }
      });
      if (res.ok) {
        toast.success("API Key verified successfully!");
      } else {
        toast.error("Invalid API Key.");
      }
    } catch (err) {
      toast.error("Failed to verify API Key.");
    } finally {
      setVerifying(false);
    }
  };

  const handleCompleteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!openRouterKey) {
      toast.error("OpenRouter API Key is required to use AI features.");
      return;
    }
    if (!subreddits) {
      toast.error("Please add at least one subreddit.");
      return;
    }

    setSaving(true);
    try {
      const subList = subreddits.split(",").map(s => s.trim()).filter(s => s.length > 0);
      
      await setDoc(doc(db, "users", user.uid), {
        portfolio,
        github,
        openRouterKey,
        subreddits: subList,
        updatedAt: new Date()
      }, { merge: true });

      toast.success("Setup complete! Welcome to PainForge.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to save setup.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 py-12">
      <Card className="w-full max-w-2xl border-primary/20 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-black tracking-tight text-primary">
            Complete Your Setup
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground max-w-md mx-auto">
            You're almost there! We just need a few details to forge the perfect proposals for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCompleteSetup} className="space-y-8">
            
            {/* AI Configuration Section */}
            <div className="space-y-4 p-6 bg-card/50 border border-border rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">1</div>
                <h3 className="font-bold text-lg">AI Brain</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openRouterKey">OpenRouter API Key <span className="text-destructive">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="openRouterKey"
                    type="password"
                    autoComplete="new-password"
                    placeholder="sk-or-v1-..."
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary flex-1"
                  />
                  <Button type="button" variant="outline" onClick={handleVerifyKey} disabled={verifying || !openRouterKey} className="border-primary/20">
                    {verifying ? "..." : "Verify"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Required to power the AI. Get your free key at OpenRouter.ai</p>
              </div>
            </div>

            {/* Targeting Section */}
            <div className="space-y-4 p-6 bg-card/50 border border-border rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
                <h3 className="font-bold text-lg">Target Audience</h3>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subreddits">Subreddits to Scan <span className="text-destructive">*</span></Label>
                <Input
                  id="subreddits"
                  placeholder="freelance, webdev, startups, SaaS"
                  value={subreddits}
                  onChange={(e) => setSubreddits(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary"
                />
                <p className="text-xs text-muted-foreground">Comma separated list of subreddits where your ideal clients hang out.</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="space-y-4 p-6 bg-card/50 border border-border rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent-foreground font-bold">3</div>
                <h3 className="font-bold text-lg">Portfolio & Credibility</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio URL</Label>
                  <Input
                    id="portfolio"
                    placeholder="https://yourwebsite.com"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    placeholder="https://github.com/username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="border-primary/20 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">We feed these links to the AI so it can naturally insert them into your proposals.</p>
            </div>

            <Button type="submit" disabled={saving} className="w-full h-12 text-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              {saving ? "Forging Setup..." : "Complete Setup & Go to Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
