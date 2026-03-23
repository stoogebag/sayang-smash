import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./_components/header";
import { QuizResultsProvider } from "./_components/quiz-results-context";

import "~/app/styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://trivtriv.com"
      : "http://localhost:3000",
  ),
  title: "trivtriv",
  description: "Test your knowledge with interactive quizzes",
  icons: [{ url: "/icon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "trivtriv",
    description: "Test your knowledge with interactive quizzes",
    url: "https://trivtriv.com",
    siteName: "trivtriv",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-screen">
      <body
        className={cn(
          "bg-background text-foreground flex h-screen flex-col font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider>
          <TRPCReactProvider>
            <QuizResultsProvider>
              <Header />
              <div className="flex-1 overflow-hidden">{props.children}</div>
            </QuizResultsProvider>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
