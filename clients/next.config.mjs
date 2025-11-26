/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      "i.ibb.co",
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com"
    ],
  },
};

export default nextConfig;
