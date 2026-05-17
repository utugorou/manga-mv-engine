import type { NextConfig } from "next";

const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const repoName = "manga-mv-engine";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isGithubPagesBuild
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
