import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Let next/image fetch & optimize images from Google Drive + Drive thumbnails
    remotePatterns: [
      { protocol: "https", hostname: "drive.google.com" }, // uc?export=view&id=...
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Drive thumbnails
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
    ],
    // Serve modern formats when possible
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes:  [64, 96, 128, 160, 192, 224, 256, 320, 384],
  },
};

export default nextConfig;
