import type { Metadata } from "next";
import { headers } from "next/headers";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LiveNowBanner } from "@/components/live/LiveNowBanner";
import { getBrandFromHost } from "@/lib/brand";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const brand = getBrandFromHost(host);
  const fallbackSiteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
  const resolvedSiteUrl = host ? `https://${host.split(",")[0].trim()}` : fallbackSiteUrl;

  return {
    metadataBase: new URL(resolvedSiteUrl),
    title: brand.defaultTitle,
    description: brand.defaultDescription,
    icons: {
      icon: brand.faviconPath,
      shortcut: brand.faviconPath,
      apple: brand.faviconPath,
    },
    openGraph: {
      title: brand.defaultTitle,
      description: brand.defaultDescription,
      url: resolvedSiteUrl,
      siteName: brand.displayName,
    },
    twitter: {
      card: "summary_large_image",
      title: brand.defaultTitle,
      description: brand.defaultDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const brand = getBrandFromHost(host);

  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="min-h-full bg-black text-white antialiased">
        <AuthProvider>
          <SiteHeader initialBrand={brand} />
          <LiveNowBanner />
          <main>{children}</main>
          <SiteFooter brand={brand} />
        </AuthProvider>
      </body>
    </html>
  );
}
