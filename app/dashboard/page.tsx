"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [selectedModel, setSelectedModel] = useState("nvidia/nemotron-3-super-120b-a12b:free");
  const [profile, setProfile] = useState<any>({});
  const [subreddits, setSubreddits] = useState<string[]>([]);
  const [activeSubreddit, setActiveSubreddit] = useState("");
  const [fetching, setFetching] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSub, setNewSub] = useState("");
  const [addingSubLoading, setAddingSubLoading] = useState(false);
  const [generatedProposals, setGeneratedProposals] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [proposalFormats, setProposalFormats] = useState<Record<string, string>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
          if (!data.openRouterKey || !data.subreddits || data.subreddits.length === 0) {
            router.push("/onboarding");
            return;
          }

          if (data.openRouterKey) setOpenRouterKey(data.openRouterKey);
          if (data.selectedModel) setSelectedModel(data.selectedModel);
          setProfile({
            fullName: data.fullName || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            portfolio: data.portfolio || ""
          });
          if (data.subreddits && data.subreddits.length > 0) {
            setSubreddits(data.subreddits);
            setActiveSubreddit(data.subreddits[0]);
          }
        } else {
          // Document doesn't exist, must be new Google Auth user
          router.push("/onboarding");
        }
      }
    }
    loadSettings();
  }, [user, router]);

  const handleScan = async () => {
    if (!openRouterKey) {
      toast.error("Please configure OpenRouter API key in settings.");
      router.push("/settings");
      return;
    }
    if (!activeSubreddit) return;

    setFetching(true);
    setOpportunities([]); // Clear previous results
    
    try {
      const response = await fetch("/api/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subreddit: activeSubreddit,
          openRouterKey,
          model: selectedModel,
          limit: 25 // Fetch up to 25 items from RSS feed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch opportunities.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setOpportunities(data.posts || []);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while scanning.");
    } finally {
      setFetching(false);
    }
  };

  const handleGenerateProposal = async (opp: any) => {
    if (!openRouterKey) {
      toast.error("Please configure OpenRouter API key in settings.");
      return;
    }
    
    const selectedFormat = proposalFormats[opp.id] || "DM";
    setGeneratingFor(opp.id);
    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openRouterKey,
          model: selectedModel,
          title: opp.title,
          rawText: opp.text,
          companyName: opp.analysis.companyName,
          jobType: opp.analysis.jobType,
          country: opp.analysis.country,
          profile,
          format: selectedFormat
        })
      });

      if (!response.ok) throw new Error("Failed to generate proposal.");
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setGeneratedProposals(prev => ({ ...prev, [opp.id]: data.proposal }));

      // Save to history and enforce max 10 entries
      if (user) {
        const { addDoc, collection, query, orderBy, getDocs, deleteDoc, doc: docRef } = await import("firebase/firestore");
        const historyCol = collection(db, "users", user.uid, "history");
        
        await addDoc(historyCol, {
          redditTitle: opp.title,
          redditUrl: opp.url,
          subreddit: opp.subreddit,
          proposal: data.proposal,
          createdAt: new Date()
        });

        // Delete oldest entries if more than 10
        const allHistory = await getDocs(query(historyCol, orderBy("createdAt", "desc")));
        if (allHistory.size > 10) {
          const docsToDelete = allHistory.docs.slice(10);
          await Promise.all(docsToDelete.map(d => deleteDoc(d.ref)));
        }
      }
      toast.success("Proposal generated and saved to history!");
    } catch (err: any) {
      toast.error(err.message || "Failed to generate.");
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const handleAddSubreddit = async () => {
    if (!newSub) return;
    const cleanSub = newSub.trim().replace(/^r\//i, "");
    
    if (subreddits.includes(cleanSub)) {
      toast.error("Subreddit already in your list.");
      return;
    }

    setAddingSubLoading(true);
    try {
      const newSubs = [...subreddits, cleanSub];
      if (user) {
        await setDoc(doc(db, "users", user.uid), { subreddits: newSubs }, { merge: true });
      }
      setSubreddits(newSubs);
      setNewSub("");
      setIsAddingSub(false);
      toast.success(`r/${cleanSub} added!`);
      if (!activeSubreddit) setActiveSubreddit(cleanSub);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAddingSubLoading(false);
    }
  };

  const handleRemoveSubreddit = async (subToRemove: string) => {
    const newSubs = subreddits.filter(s => s !== subToRemove);
    try {
      if (user) {
        await setDoc(doc(db, "users", user.uid), { subreddits: newSubs }, { merge: true });
      }
      setSubreddits(newSubs);
      toast.success(`r/${subToRemove} removed.`);
      if (activeSubreddit === subToRemove) {
        setActiveSubreddit(newSubs.length > 0 ? newSubs[0] : "");
      }
    } catch (err: any) {
      toast.error("Failed to remove subreddit.");
    }
  };

  if (loading || !user) return <div className="p-8 text-center text-primary font-bold">Loading...</div>;

  return (
    <div className="flex min-h-screen p-8 bg-background">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Opportunities</h1>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push("/history")} className="border-primary/20 hover:bg-primary/10 text-foreground">History</Button>
            <Button variant="outline" onClick={() => router.push("/settings")} className="border-primary/20 hover:bg-primary/10 text-foreground">Settings</Button>
            <Button variant="outline" onClick={handleSignOut} className="border-primary/20 hover:bg-destructive/10 text-destructive">Sign Out</Button>
            <Button onClick={handleScan} disabled={fetching || !activeSubreddit} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {fetching ? "Scanning (~3s)..." : "Scan Subreddit"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {subreddits.length > 0 ? (
            <div className="flex flex-wrap gap-2 items-center">
              {subreddits.map(sub => (
                <div key={sub} className="group relative flex items-center">
                  <Button 
                    variant={activeSubreddit === sub ? "default" : "outline"}
                    onClick={() => setActiveSubreddit(sub)}
                    className={activeSubreddit === sub ? "bg-secondary text-secondary-foreground" : "border-primary/20 text-foreground"}
                  >
                    r/{sub}
                  </Button>
                  <button 
                    onClick={() => handleRemoveSubreddit(sub)} 
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-[10px] items-center justify-center hidden group-hover:flex shadow-sm hover:scale-110 transition-transform z-10"
                    title="Remove subreddit"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {!isAddingSub ? (
                <Button variant="outline" size="sm" onClick={() => setIsAddingSub(true)} className="border-dashed border-primary/40 text-muted-foreground hover:text-primary">
                  + Add
                </Button>
              ) : (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                  <Input 
                    placeholder="freelance" 
                    value={newSub} 
                    onChange={e => setNewSub(e.target.value)} 
                    className="w-32 h-9 border-primary/30"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubreddit();
                      if (e.key === "Escape") setIsAddingSub(false);
                    }}
                  />
                  <Button size="sm" onClick={handleAddSubreddit} disabled={addingSubLoading} className="h-9">
                    {addingSubLoading ? "..." : "Add"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingSub(false)} className="h-9">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 p-4 bg-card rounded-md border border-border">
              <p className="text-muted-foreground">No subreddits configured. Let's add your first one!</p>
              {!isAddingSub ? (
                <Button onClick={() => setIsAddingSub(true)}>+ Add Subreddit</Button>
              ) : (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                  <Input 
                    placeholder="freelance" 
                    value={newSub} 
                    onChange={e => setNewSub(e.target.value)} 
                    className="w-48 h-10 border-primary/30"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubreddit();
                      if (e.key === "Escape") setIsAddingSub(false);
                    }}
                  />
                  <Button onClick={handleAddSubreddit} disabled={addingSubLoading}>
                    {addingSubLoading ? "..." : "Add"}
                  </Button>
                  <Button variant="ghost" onClick={() => setIsAddingSub(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {fetching && opportunities.length === 0 && (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-primary/20 shadow-lg shadow-primary/5 bg-card animate-pulse">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-4 w-32 bg-primary/20 rounded"></div>
                      <div className="h-5 w-20 bg-secondary/20 rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-primary/20 rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-5/6 bg-muted rounded"></div>
                      <div className="h-4 w-4/6 bg-muted rounded"></div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-border pt-4">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-10 w-36 bg-secondary/20 rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}

          {!fetching && opportunities.map(opp => (
            <Card key={opp.id} className="border-primary/20 shadow-lg shadow-primary/5 bg-card">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">r/{opp.subreddit} • Score: {opp.analysis.score}/10</span>
                  <span className="text-xs font-bold bg-secondary/20 text-secondary px-2 py-1 rounded">{opp.analysis.category}</span>
                </div>
                <CardTitle className="text-xl text-primary">{opp.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {opp.analysis.companyName && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full border border-border">🏢 {opp.analysis.companyName}</span>
                  )}
                  {opp.analysis.jobType && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full border border-border">💼 {opp.analysis.jobType}</span>
                  )}
                  {opp.analysis.country && (
                    <span className="text-xs px-2 py-1 bg-muted rounded-full border border-border">🌍 {opp.analysis.country}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {opp.analysis.summary && (
                  <div className="mb-4">
                    <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap border-l-2 border-secondary/40 pl-3">
                      {opp.analysis.summary}
                    </p>
                  </div>
                )}
                {generatedProposals[opp.id] && (
                  <div className="mt-4 p-4 bg-muted/50 border border-primary/20 rounded-md relative group">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Generated Proposal</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-primary/20"
                        onClick={() => handleCopy(generatedProposals[opp.id], opp.id)}
                      >
                        {copiedId === opp.id ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{generatedProposals[opp.id]}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-border pt-4">
                <Button variant="link" onClick={() => window.open(opp.url, "_blank")} className="text-muted-foreground hover:text-primary px-0">View on Reddit</Button>
                <div className="flex space-x-2">
                  <select 
                    className="text-sm border border-primary/20 bg-background text-foreground rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                    value={proposalFormats[opp.id] || "DM"}
                    onChange={(e) => setProposalFormats(prev => ({...prev, [opp.id]: e.target.value}))}
                  >
                    <option value="DM">Direct Message</option>
                    <option value="Comment">Public Comment</option>
                    <option value="Email">Cold Email</option>
                  </select>
                  <Button 
                    onClick={() => handleGenerateProposal(opp)} 
                    disabled={generatingFor === opp.id}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold"
                  >
                    {generatingFor === opp.id ? "Forging..." : "Generate"}
                  </Button>
                </div>
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
