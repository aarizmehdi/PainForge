import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PainForge | AI Lead Generation Engine for Freelancers",
    template: "%s | PainForge",
  },
  description: "PainForge is an open-source AI context engine that finds high-intent clients on forums and generates hyper-personalized proposals instantly. Built for freelancers and agencies.",
  keywords: ["lead generation", "freelance clients", "AI outreach", "Reddit scraper", "OpenRouter", "client acquisition", "PainForge"],
  authors: [{ name: "Aariz Mehdi", url: "https://aarizm.dev" }],
  creator: "Aariz Mehdi",
  metadataBase: new URL("https://pain-forge.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pain-forge.vercel.app",
    title: "PainForge | Catch Real Pain. Forge Real Clients.",
    description: "An open-source AI context engine that finds high-intent clients on forums and generates hyper-personalized proposals instantly.",
    siteName: "PainForge",
  },
  twitter: {
    card: "summary_large_image",
    title: "PainForge | AI Lead Generation",
    description: "Find high-intent clients on Reddit and generate hyper-personalized proposals instantly.",
    creator: "@aarizmehdi",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
