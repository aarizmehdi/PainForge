"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [subreddits, setSubreddits] = useState("");
  const [selectedModel, setSelectedModel] = useState("nvidia/nemotron-3-super-120b-a12b:free");
  
  // Profile fields
  const [fullName, setFullName] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  
  const [models, setModels] = useState<any[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          if (data.selectedModel) setSelectedModel(data.selectedModel);
          if (data.fullName) setFullName(data.fullName);
          if (data.github) setGithub(data.github);
          if (data.linkedin) setLinkedin(data.linkedin);
          if (data.portfolio) setPortfolio(data.portfolio);
        }
      }
    }
    loadSettings();
  }, [user]);

  const fetchModels = async () => {
    setFetchingModels(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/models");
      if (!res.ok) throw new Error("Failed to fetch models from OpenRouter");
      const data = await res.json();
      
      let fetchedModels = data.data || [];
      
      // Filter out obvious image/vision models if possible, keep text
      fetchedModels = fetchedModels.filter((m: any) => {
        const name = m.name.toLowerCase();
        const id = m.id.toLowerCase();
        if (name.includes("vision") || id.includes("vision") || name.includes("image") || id.includes("image")) {
          // Keep it if it's multimodal but mostly we want pure text generators for proposals
          return false;
        }
        return true;
      });

      // Sort: Free on top, then alphabetical
      fetchedModels.sort((a: any, b: any) => {
        const aFree = a.pricing?.prompt === "0" && a.pricing?.completion === "0";
        const bFree = b.pricing?.prompt === "0" && b.pricing?.completion === "0";
        if (aFree && !bFree) return -1;
        if (!aFree && bFree) return 1;
        return a.name.localeCompare(b.name);
      });

      setModels(fetchedModels);
      if (!selectedModel) {
        setSelectedModel("nvidia/nemotron-3-super-120b-a12b:free");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load models. Using fallback.");
    } finally {
      setFetchingModels(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    // Close dropdown if clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const subList = subreddits.split(",").map((s) => s.trim()).filter((s) => s);
      await setDoc(doc(db, "users", user.uid), {
        openRouterKey,
        subreddits: subList,
        selectedModel: selectedModel || "nvidia/nemotron-3-super-120b-a12b:free",
        fullName,
        github,
        linkedin,
        portfolio,
        updatedAt: new Date()
      }, { merge: true });
      toast.success("Settings saved successfully!");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Filtered models for the searchable dropdown
  const filteredModels = models.filter((m) => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedModelName = models.find(m => m.id === selectedModel)?.name || selectedModel;

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex min-h-screen p-8 bg-background">
      <div className="max-w-2xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Settings</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="border-primary/20 hover:bg-primary/10 text-foreground">
            Back to Dashboard
          </Button>
        </div>
        <Card className="border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Configuration</CardTitle>
            <CardDescription>
              Set up your API keys, target subreddits, and preferred AI model.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <Label htmlFor="openrouter">OpenRouter API Key</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleVerifyKey} disabled={verifying || !openRouterKey}>
                    {verifying ? "Verifying..." : "Verify Key"}
                  </Button>
                </div>
                <Input
                  id="openrouter"
                  type="password"
                  autoComplete="new-password"
                  placeholder="sk-or-v1-..."
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  className="border-primary/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2 relative" ref={dropdownRef}>
                <div className="flex justify-between items-end mb-2">
                  <Label>AI Model</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={fetchModels} disabled={fetchingModels}>
                    {fetchingModels ? "Loading..." : "Refresh Models"}
                  </Button>
                </div>
                
                <div 
                  className="flex items-center justify-between h-10 w-full rounded-md border border-primary/20 bg-background px-3 py-2 text-sm cursor-pointer hover:border-primary/50"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="truncate">{selectedModelName}</span>
                  <span className="opacity-50">▼</span>
                </div>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-primary/20 rounded-md shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-primary/20">
                      <Input 
                        placeholder="Search models..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredModels.length === 0 ? (
                        <div className="p-3 text-sm text-muted-foreground text-center">No models found.</div>
                      ) : (
                        filteredModels.map((m) => {
                          const isFree = m.pricing?.prompt === "0" && m.pricing?.completion === "0";
                          return (
                            <div 
                              key={m.id}
                              className={`flex justify-between items-center px-3 py-2 text-sm cursor-pointer hover:bg-primary/10 ${selectedModel === m.id ? 'bg-primary/20 font-medium' : ''}`}
                              onClick={() => {
                                setSelectedModel(m.id);
                                setDropdownOpen(false);
                                setSearchQuery("");
                              }}
                            >
                              <div className="flex flex-col">
                                <span>{m.name}</span>
                                <span className="text-xs text-muted-foreground opacity-70">{m.id}</span>
                              </div>
                              {isFree && (
                                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Free</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Choose the model you want to use. Free models are listed first.
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
              </div>

              <div className="pt-4 border-t border-primary/10">
                <h3 className="text-lg font-bold text-primary mb-4">Personal Profile (For AI Outreach)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL <span className="text-xs text-secondary/80">(Highly Recommended)</span></Label>
                    <Input
                      id="portfolio"
                      placeholder="https://mywebsite.com"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL <span className="text-xs text-secondary/80">(Highly Recommended)</span></Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/johndoe"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL <span className="text-xs text-muted-foreground">(Useful)</span></Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/johndoe"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="border-primary/20 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full font-bold">
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
