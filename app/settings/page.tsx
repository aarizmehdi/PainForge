"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadSettings() {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.openRouterKey) setOpenRouterKey(data.openRouterKey);
          if (data.subreddits) setSubreddits(data.subreddits.join(", "));
        }
      }
    }
    loadSettings();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const subList = subreddits.split(",").map((s) => s.trim()).filter((s) => s);
      await setDoc(doc(db, "users", user.uid), {
        openRouterKey,
        subreddits: subList,
        updatedAt: new Date()
      }, { merge: true });
      setMessage("Settings saved successfully!");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen p-8 bg-background">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Settings</h1>
        <Card className="border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Configuration</CardTitle>
            <CardDescription>
              Set up your API keys and target subreddits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="openrouter">OpenRouter API Key</Label>
                <Input
                  id="openrouter"
                  type="password"
                  placeholder="sk-or-v1-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Your key is stored securely in Firestore and only used for your requests.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subreddits">Target Subreddits</Label>
                <Input
                  id="subreddits"
                  type="text"
                  placeholder="freelance, webdev, startups"
                  value={subreddits}
                  onChange={(e) => setSubreddits(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary"
                />
                <p className="text-sm text-muted-foreground">
                  Comma-separated list of subreddits to monitor.
                </p>
              </div>
              
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {saving ? "Saving..." : "Save Settings"}
              </Button>
              {message && <p className="text-sm text-secondary mt-4 font-medium">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
