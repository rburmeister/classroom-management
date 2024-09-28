/** @type {import('next').NextConfig} */
const nextConfig = {
  //reactStrictMode: false, // Disable Strict Mode
  productionBrowserSourceMaps: true,
  webpack(config, { dev }) {
    if (dev) {
      config.devtool = 'source-map'; // Enable source maps for development
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: 'media.graphassets.com',
      },
      {
        hostname: 'govcms.s3.us-west-2.amazonaws.com',
      },
      {
        hostname: 'govcms.s3.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
