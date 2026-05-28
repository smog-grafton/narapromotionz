export type SiteBrand = {
  id: "naratv" | "narapromotionz";
  hostnames: string[];
  displayName: string;
  headerLogo: string;
  mobileLogo: string;
  footerLogo: string;
  faviconPath: string;
  defaultTitle: string;
  defaultDescription: string;
};

const BRANDS: SiteBrand[] = [
  {
    id: "naratv",
    hostnames: ["naratv.live", "www.naratv.live"],
    displayName: "NaraTV Live",
    headerLogo: "/assets/images/logo-naratv.png",
    mobileLogo: "/assets/images/logo-naratv.png",
    footerLogo: "/assets/images/naratvwhite.png",
    faviconPath: "/favicon.ico",
    defaultTitle: "NaraTV Live | Boxing Events, News, Tickets and Live Streams",
    defaultDescription:
      "NaraTV Live brings Ugandan boxing events, live streams, fight-night tickets, videos, and official updates in one place.",
  },
  {
    id: "narapromotionz",
    hostnames: ["narapromotionz.com", "www.narapromotionz.com"],
    displayName: "Nara Promotionz",
    headerLogo: "/assets/images/logo.svg",
    mobileLogo: "/assets/images/logo-2.svg",
    footerLogo: "/assets/images/logo-2.svg",
    faviconPath: "/faviconnarapromo.ico",
    defaultTitle: "Nara Promotionz | Boxing Events, News, Tickets and Live Streams",
    defaultDescription:
      "Nara Promotionz is a premium Ugandan boxing promotions platform for live events, PPV streaming, boxer profiles, tickets, videos, and boxing news.",
  },
];

function normalizeHost(host?: string | null): string {
  return (host ?? "").trim().toLowerCase().split(":")[0];
}

export function getBrandFromHost(host?: string | null): SiteBrand {
  const normalized = normalizeHost(host);

  if (!normalized) {
    return BRANDS[1];
  }

  return BRANDS.find((brand) => brand.hostnames.includes(normalized)) ?? BRANDS[1];
}

export function getConfiguredBrand(): SiteBrand {
  const configuredHost = (() => {
    try {
      return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").hostname;
    } catch {
      return "";
    }
  })();

  return getBrandFromHost(configuredHost);
}
