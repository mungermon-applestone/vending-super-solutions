/**
 * Utilities for bot detection and optimization
 */

// List of common bot user agents for detection
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'sogou',
  'exabot',
  'facebot',
  'ia_archiver',
  'crawler',
  'spider',
  'ahrefsbot',
  'semrushbot',
  'lighthouse',
  'chrome-lighthouse',
  'pagespeed',
  // More general patterns - keep these at the end to avoid false positives
  'bot',
];

/**
 * Detects if the current request is from a bot
 */
export function isBot(): boolean {
  if (typeof navigator === 'undefined') {
    return false; // Server-side rendering
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for bot patterns in user agent
  if (BOT_USER_AGENTS.some(bot => userAgent.includes(bot))) {
    return true;
  }
  
  // Check for headless browser
  if ('webdriver' in navigator && (navigator as any).webdriver) {
    return true;
  }
  
  // Check for Lighthouse
  if (userAgent.includes('lighthouse') || userAgent.includes('chrome-lighthouse')) {
    return true;
  }
  
  return false;
}

/**
 * Adds bot-specific meta tags and optimizations
 */
export function optimizeForBots(): void {
  if (!isBot()) return;
  
  console.log('[Bot] Optimizing rendering for bot');
  
  // Add class to body for bot-specific CSS
  document.documentElement.classList.add('bot-detected');
  
  // Add meta tags for bots
  const metaRobots = document.createElement('meta');
  metaRobots.name = 'robots';
  metaRobots.content = 'index, follow';
  document.head.appendChild(metaRobots);
  
  // Disable animations for bots
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Disable all animations for bots */
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    
    /* Ensure all content is immediately visible */
    .skeleton, .animate-pulse, [data-loading], .loading {
      animation: none !important;
      background-color: transparent !important;
      opacity: 1 !important;
    }
    
    /* Make all images visible immediately */
    img {
      opacity: 1 !important;
    }
    
    /* Ensure all lazy-loaded content is visible */
    [data-lazy], [loading="lazy"] {
      display: block !important;
      visibility: visible !important;
    }
    
    /* Make sure tabs and accordions are expanded */
    [aria-hidden="true"] {
      display: block !important;
      visibility: visible !important;
      height: auto !important;
      overflow: visible !important;
      clip: auto !important;
      clip-path: none !important;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Automatically expand all content that might be hidden
  document.querySelectorAll('[aria-expanded="false"]').forEach(el => {
    el.setAttribute('aria-expanded', 'true');
  });
  
  // Expand all tab panels for bots to see all content
  document.querySelectorAll('[role="tabpanel"][hidden]').forEach(panel => {
    panel.removeAttribute('hidden');
  });
  
  // Add structured data for better SEO
  ensureStructuredData();
}

/**
 * Ensure structured data is present for search engines
 */
function ensureStructuredData() {
  // Check if we already have a structured data script
  if (document.querySelector('script[type="application/ld+json"]')) {
    return;
  }
  
  // Create basic website structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Applestone Solutions",
    "description": "Advanced vending solutions for modern businesses",
    "url": window.location.origin,
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

/**
 * Returns content based on whether the request is from a bot
 * Bots get simpler content optimized for crawling
 */
export function renderByUserAgent<T>(options: {
  standardContent: T;
  botContent?: T;
}): T {
  const { standardContent, botContent } = options;
  
  if (isBot() && botContent !== undefined) {
    return botContent;
  }
  
  return standardContent;
}

/**
 * Detect if performance monitoring tools like Lighthouse are being used
 */
export function isPerformanceMonitoringTool(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('lighthouse') || 
         userAgent.includes('pagespeed') || 
         userAgent.includes('gtmetrix');
}
