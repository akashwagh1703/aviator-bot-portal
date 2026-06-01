/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["msedge-tts", "ws", "bufferutil", "utf-8-validate"],
};

export default nextConfig;
