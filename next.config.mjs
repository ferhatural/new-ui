/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["filli.carvist.org"],
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
