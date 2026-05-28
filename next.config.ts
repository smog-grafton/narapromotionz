import type { NextConfig } from "next";

const localLaravelPatterns = [8000, 8001].flatMap((port) => [
  {
    protocol: "http" as const,
    hostname: "127.0.0.1",
    port: String(port),
    pathname: "/storage/**",
  },
  {
    protocol: "http" as const,
    hostname: "127.0.0.1",
    port: String(port),
    pathname: "/assets/**",
  },
  {
    protocol: "http" as const,
    hostname: "localhost",
    port: String(port),
    pathname: "/storage/**",
  },
  {
    protocol: "http" as const,
    hostname: "localhost",
    port: String(port),
    pathname: "/assets/**",
  },
]);

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP:
      process.env.NEXT_IMAGE_ALLOW_LOCAL_IP === "true" || process.env.NODE_ENV !== "production",
    unoptimized:
      process.env.NEXT_IMAGE_UNOPTIMIZED === "true" || process.env.NODE_ENV !== "production",
    remotePatterns: [
      ...localLaravelPatterns,
      {
        protocol: "https",
        hostname: "portal.narapromotionz.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "portal.narapromotionz.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "www.narapromotionz.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "www.narapromotionz.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "narapromotionz.com",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "narapromotionz.com",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
