"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [activeSubreddit, setActiveSubreddit] = useState("");
  const [fetching, setFetching] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);

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
          if (data.subreddits && data.subreddits.length > 0) {
            setSubreddits(data.subreddits);
            setActiveSubreddit(data.subreddits[0]);
          }
        }
      }
    }
    loadSettings();
  }, [user]);

  const handleScan = async () => {
    if (!openRouterKey) {
      alert("Please configure OpenRouter API key in settings.");
      router.push("/settings");
      return;
    }
    if (!activeSubreddit) return;

    setFetching(true);
    // In a full implementation, you would post to /api/reddit here
    // with the openRouterKey and Reddit API credentials.
    alert("MVP Note: Hooking up the actual Reddit fetch in production.");
    
    // Mock response to show UI
    setTimeout(() => {
      setOpportunities([
        {
          id: "1",
          title: "Looking for a web dev to build a custom marketplace",
          subreddit: activeSubreddit,
          score: 9,
          category: "Hiring Intent",
          keyPainPoints: ["Needs a custom marketplace", "Tired of existing templates breaking", "Willing to pay for custom dev"],
          url: "https://reddit.com"
        }
      ]);
      setFetching(false);
    }, 1500);
  };

  if (loading || !user) return <div className="p-8 text-center text-primary font-bold">Loading...</div>;

  return (
    <div className="flex min-h-screen p-8 bg-background">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Opportunities</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push("/settings")} className="border-primary/20 hover:bg-primary/10 text-foreground">Settings</Button>
            <Button onClick={handleScan} disabled={fetching || !activeSubreddit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {fetching ? "Scanning..." : "Scan Subreddit"}
            </Button>
          </div>
        </div>

        {subreddits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {subreddits.map(sub => (
              <Button 
                key={sub} 
                variant={activeSubreddit === sub ? "default" : "outline"}
                onClick={() => setActiveSubreddit(sub)}
                className={activeSubreddit === sub ? "bg-secondary text-secondary-foreground" : "border-primary/20 text-foreground"}
              >
                r/{sub}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground bg-card p-4 rounded-md border border-border">No subreddits configured. Go to Settings.</p>
        )}

        <div className="grid gap-6">
          {opportunities.map(opp => (
            <Card key={opp.id} className="border-primary/20 shadow-lg shadow-primary/5 bg-card">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">r/{opp.subreddit} • Score: {opp.score}/10</span>
                  <span className="text-xs font-bold bg-secondary/20 text-secondary px-2 py-1 rounded">{opp.category}</span>
                </div>
                <CardTitle className="text-xl text-primary">{opp.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {opp.keyPainPoints.map((point: string, i: number) => (
                    <li key={i} className="text-sm text-foreground/90">{point}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border pt-4">
                <Button variant="link" onClick={() => window.open(opp.url, "_blank")} className="text-muted-foreground hover:text-primary">View on Reddit</Button>
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">Generate Proposal</Button>
              </CardFooter>
            </Card>
          ))}
          {opportunities.length === 0 && !fetching && (
            <div className="text-center p-12 border-2 border-dashed border-primary/20 rounded-xl text-muted-foreground">
              Ready to catch real pain. Select a subreddit and click Scan to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
