
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
  // Enhanced environment variable configuration
  env: {
    // Support all naming conventions for maximum compatibility
    CONTENTFUL_SPACE_ID: "p8y13tvmv0uj",
    CONTENTFUL_DELIVERY_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
    CONTENTFUL_ENVIRONMENT: "master",
    
    // Next.js public variables (accessible in browser)
    NEXT_PUBLIC_CONTENTFUL_SPACE_ID: "p8y13tvmv0uj",
    NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
    NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT: "master",
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
    CONTENTFUL_SPACE_ID: "p8y13tvmv0uj",
    CONTENTFUL_DELIVERY_TOKEN: "fyVJxmu9K8jX3kcWHa0yEFIsvdzY5U-gkOcxU0JNxtU",
    CONTENTFUL_ENVIRONMENT: "master",
  }
}

module.exports = nextConfig
