/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  allowedDevOrigins: ["upright-planoblastic-wilbur.ngrok-free.dev"],
  images: {
    qualities: [75, 100],
  },

  output: 'standalone',
};

export default nextConfig;
