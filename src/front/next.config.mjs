import withPWAInit from "@ducanh2912/next-pwa";

//@ts-check
const withPWA = withPWAInit({
  dest: "public",
  disable: true,
  aggressiveFrontEndNavCaching: false,
  register: process.env.NODE_ENV === "production", // Only register in production
  //   skipWaiting: process.env.NODE_ENV === 'production', // Only skip waiting in production
});

export default withPWA({
  reactStrictMode: false,

  eslint: {
    // ⚠ Ignore ESLint errors during builds - this is to eqse dockerization
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ⚠ Ignore Typescript errors during builds - this is to eqse dockerization
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "backend.mymidaas.com",
      },
      {
        protocol: "http",
        hostname: "backend.mymidaas.com",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/dashboard",
        permanent: true,
      },
    ];
  },
});
