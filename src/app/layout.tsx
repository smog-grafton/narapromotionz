import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LiveNowBanner } from "@/components/live/LiveNowBanner";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nara Promotionz | Boxing Events, News, Tickets and Live Streams",
  description:
    "Nara Promotionz is a premium Ugandan boxing promotions platform for live events, PPV streaming, boxer profiles, tickets, videos, and boxing news.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full bg-black text-white antialiased">
        <AuthProvider>
          <SiteHeader />
          <LiveNowBanner />
          <main>{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
