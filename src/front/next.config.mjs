import withPWAInit from "@ducanh2912/next-pwa";

//@ts-check
const withPWA = withPWAInit({
  dest: "public",
  disable: true,
  aggressiveFrontEndNavCaching: false,
  register: process.env.NODE_ENV === "production",
});

export default withPWA({
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "backend.mymidaas.com" },
      { protocol: "http", hostname: "backend.mymidaas.com" },
    ],
  },

  // Force output to the standard directory
  distDir: ".next",

  async redirects() {
    return [];
  },
});
