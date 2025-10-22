import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⟵ ignora erros do ESLint no build (Vercel inclusive)
  },
};

export default nextConfig;
