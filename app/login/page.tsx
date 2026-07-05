"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { setDoc, doc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        
        // Initialize profile with empty fields, to be filled in onboarding
        await setDoc(doc(db, "users", userCredential.user.uid), {
          fullName,
          portfolio: "",
          github: "",
          openRouterKey: "",
          subreddits: [],
          selectedModel: "nvidia/nemotron-3-super-120b-a12b:free",
          updatedAt: new Date()
        }, { merge: true });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      toast.success(isSignUp ? "Account created successfully!" : "Signed in successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (err.code === "auth/invalid-credential") {
        toast.error("Incorrect email or password. Please try again.");
      } else {
        toast.error(err.message || "An error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Absolute Logo for all screens */}
      <div className="absolute top-8 left-8 lg:top-12 lg:left-16 flex items-center gap-2.5 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
        <span className="text-2xl font-extrabold tracking-tight text-foreground">
          PainForge.
        </span>
      </div>

      {/* Dynamic Background matching website theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[100px]" />
      </div>

      <div className="w-full flex z-10 h-full">
        {/* Left side - branding */}
        <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 xl:p-24 relative border-r border-border/10 bg-black/20">
          
          <style>{`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes spin-slow-reverse {
              from { transform: rotate(360deg); }
              to { transform: rotate(0deg); }
            }
          `}</style>

          {/* Fibonacci / Golden Ratio Background Element */}
          <div className="absolute right-[-10%] top-[15%] w-[890px] h-[890px] opacity-20 pointer-events-none text-primary mix-blend-screen">
            <svg className="w-full h-full" viewBox="0 0 890 890" fill="none" stroke="currentColor" strokeWidth="1">
              <g style={{ animation: 'spin-slow 89s linear infinite', transformOrigin: 'center' }}>
                <circle cx="445" cy="445" r="34" className="opacity-40" />
                <circle cx="445" cy="445" r="55" className="opacity-50" />
                <circle cx="445" cy="445" r="89" className="opacity-60" />
                <circle cx="445" cy="445" r="144" strokeDasharray="4 8" className="opacity-50" />
                <circle cx="445" cy="445" r="233" className="opacity-40" />
                <circle cx="445" cy="445" r="377" strokeDasharray="1 4" className="opacity-30" />
                <path d="M445 411 A34 34 0 0 1 479 445 A55 55 0 0 1 424 500 A89 89 0 0 1 335 411 A144 144 0 0 1 479 267 A233 233 0 0 1 712 500 A377 377 0 0 1 335 877" stroke="currentColor" strokeWidth="1.5" className="opacity-80" />
              </g>
              <line x1="445" y1="0" x2="445" y2="890" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
              <line x1="0" y1="445" x2="890" y2="445" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mt-12">
            
            <h1 className="text-[55px] font-medium tracking-tight text-foreground mb-[34px] leading-[1.1]">
              Catch Real Pain.<br />
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80 drop-shadow-[0_0_21px_rgba(227,6,19,0.2)]">
                Forge Real Clients.
              </span>
            </h1>
            <p className="text-[21px] text-muted-foreground max-w-[550px] leading-[1.618] font-light">
              Don't hunt for clients. Find the exact moment they experience <span className="text-foreground font-medium border-b border-primary/40">pain</span>, and pitch the <span className="text-primary font-medium">perfect solution</span>.
            </p>
          </div>
          
          {/* Decorative Grid / Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Right side - form */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-[330px] bg-card/40 backdrop-blur-xl p-5 rounded-2xl border border-border/40 shadow-2xl relative">
            
            {/* Subtle glow behind the card */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-1 mb-6 relative z-10 pt-2 lg:pt-0">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                {isSignUp ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                {isSignUp ? "Sign up to start finding clients" : "Sign in to continue to PainForge"}
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              <Button variant="outline" type="button" onClick={handleGoogleLogin} className="w-full h-9 border-border/40 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-100 transition-all rounded-lg font-semibold text-sm shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16px" height="16px" className="mr-2">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/40" />
                </div>
                <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-widest">
                  <span className="bg-transparent px-2 text-muted-foreground/50">Or email</span>
                </div>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-2.5">
                {isSignUp && (
                  <div className="space-y-1">
                    <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-9 rounded-lg border border-border/30 bg-black/40 text-zinc-200 placeholder:text-zinc-600 focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 px-3 text-sm transition-all shadow-inner"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 rounded-lg border border-border/30 bg-black/40 text-zinc-200 placeholder:text-zinc-600 focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 px-3 text-sm transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-9 rounded-lg border border-border/30 bg-black/40 text-zinc-200 placeholder:text-zinc-600 focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 px-3 text-sm transition-all shadow-inner"
                  />
                </div>
                {isSignUp && (
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-9 rounded-lg border border-border/30 bg-black/40 text-zinc-200 placeholder:text-zinc-600 focus-visible:bg-black/60 focus-visible:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary/50 px-3 text-sm transition-all shadow-inner"
                    />
                  </div>
                )}
                
                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all shadow-md shadow-primary/20 text-sm">
                    {loading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                  </Button>
                </div>
              </form>
              
              <div className="text-center pt-1">
                <button 
                  type="button" 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
