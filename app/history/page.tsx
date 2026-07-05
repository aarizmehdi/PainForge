"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [history, setHistory] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchHistory() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "history"),
          orderBy("createdAt", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setFetching(false);
      }
    }
    fetchHistory();
  }, [user]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading || !user) return <div className="p-8 text-center text-primary font-bold">Loading...</div>;

  return (
    <div className="flex min-h-screen p-8 bg-background">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Outreach History</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="border-primary/20 hover:bg-primary/10 text-foreground">
            Back to Dashboard
          </Button>
        </div>

        {fetching ? (
          <div className="text-center p-12 border-2 border-dashed border-primary/20 rounded-xl text-muted-foreground animate-pulse">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-primary/20 rounded-xl text-muted-foreground">
            No proposals generated yet. Go to the dashboard to start scanning!
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((item) => (
              <Card key={item.id} className="border-primary/20 shadow-lg shadow-primary/5 bg-card">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Unknown Date'}
                    </span>
                    <Button variant="link" onClick={() => window.open(item.redditUrl, "_blank")} className="text-muted-foreground hover:text-primary h-auto p-0 text-xs">
                      View Original Post
                    </Button>
                  </div>
                  <CardTitle className="text-xl text-primary">{item.redditTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 border border-primary/20 rounded-md relative group">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold text-secondary uppercase tracking-wider">Sent Proposal</h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-primary/20"
                        onClick={() => handleCopy(item.proposal, item.id)}
                      >
                        {copiedId === item.id ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{item.proposal}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
