import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: { unoptimized: true },
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath: "/strategic-road-map",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
