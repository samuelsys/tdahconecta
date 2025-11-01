module.exports = {
   eslint: {
    ignoreDuringBuilds: true, // ⟵ ignora erros do ESLint no build (Vercel inclusive)
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'resources.saudi-pro-league.pulselive.com' },
      { protocol: 'https', hostname: 'www.spl.com.sa' },
      { protocol: 'https', hostname: 'spl.com.sa' }
    ]
  },
  reactStrictMode: true
};