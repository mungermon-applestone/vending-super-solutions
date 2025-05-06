
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.ctfassets.net',  // Contentful images
      'downloads.ctfassets.net', // Contentful downloads
      'images.unsplash.com',   // Unsplash
      'placehold.co',          // Placeholders
      'picsum.photos',         // Placeholder photos
    ],
  },
  env: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  },
  // Add async rewrites to handle routing conflicts
  async rewrites() {
    return [
      // Rewrite any product URLs that might be handled by React Router to Next.js
      {
        source: '/products/:slug*',
        destination: '/products/:slug*'
      },
    ];
  },
}

module.exports = nextConfig
