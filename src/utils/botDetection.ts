
/**
 * Utilities for bot detection and optimization
 */

// List of common bot user agents for detection
const BOT_USER_AGENTS = [
  'bot',
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
];

/**
 * Detects if the current request is from a bot
 */
export function isBot(): boolean {
  if (typeof navigator === 'undefined') {
    return false; // Server-side rendering
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => userAgent.includes(bot));
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
    .animate-fade-in, .animate-scale-in, 
    .animate-slide-in-right, .animate-fade-out, 
    .animate-scale-out, .animate-slide-out-right {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    
    .skeleton, .animate-pulse {
      animation: none !important;
      background-color: #f3f4f6 !important;
    }
  `;
  document.head.appendChild(styleElement);
  
  // Automatically expand all content that might be hidden
  document.querySelectorAll('[aria-expanded="false"]').forEach(el => {
    el.setAttribute('aria-expanded', 'true');
  });
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
