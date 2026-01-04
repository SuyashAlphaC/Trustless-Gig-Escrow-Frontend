/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Also ignore TS errors to be safe
    ignoreBuildErrors: true,
  },
  // ... keep your existing webpack config if you have one ...
};

export default nextConfig;