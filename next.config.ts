import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mfuilrbyyfktorlnjjct.supabase.co",
        pathname: "**"
      }
    ]
  }
};

export default nextConfig;
