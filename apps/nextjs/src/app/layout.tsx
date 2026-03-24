import type { Metadata, Viewport } from "next";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./_components/header";

import "@acme/tailwind-config/theme";
import "./_components/concept-a-styles.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://sayang-smash.com"
      : "http://localhost:3000",
  ),
  title: "Sayang Smash",
  description: "Create and log your workouts. Share with friends.",
  icons: [{ url: "/icon.svg", type: "image/svg+xml" }],
  openGraph: {
    title: "Sayang Smash",
    description: "Create and log your workouts. Share with friends.",
    url: "https://sayang-smash.com",
    siteName: "Sayang Smash",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#0f0f0f" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground font-body flex h-screen flex-col antialiased">
        <TRPCReactProvider>
          <Header />
          <div className="flex-1 overflow-hidden">{props.children}</div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
