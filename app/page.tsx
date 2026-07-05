import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-8">
      <main className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">
          PAINFORGE
        </h1>
        <p className="text-2xl font-medium text-foreground/80 max-w-2xl mx-auto">
          Catch Real Pain. Forge Real Clients.
        </p>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          The open-source tool that scans niche subreddits for real business pain points, uses AI to classify them, and generates high-quality outreach proposals.
        </p>
        <div className="flex justify-center gap-4 pt-8">
          <Link href="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl font-bold">
              Start Forging
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank">
            <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10 text-lg px-8 py-6 rounded-xl">
              View Source
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
