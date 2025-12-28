/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["filli.carvist.org", "185.48.182.25"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "carv.ist",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
