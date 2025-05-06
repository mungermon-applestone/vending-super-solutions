
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
    // Support all naming conventions for maximum compatibility
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID,
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
    NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
    
    // Legacy variables (kept for backward compatibility)
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
  },
  // Enhanced rewrites to ensure all product routes go to Next.js
  async rewrites() {
    return [
      {
        source: '/products/:slug*',
        destination: '/products/:slug*',
      }
    ];
  },
  // Add publicRuntimeConfig to expose environment variables to the browser
  publicRuntimeConfig: {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID,
    CONTENTFUL_DELIVERY_TOKEN: process.env.CONTENTFUL_DELIVERY_TOKEN || process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
  }
}

module.exports = nextConfig
