
/**
 * Utilities for critical CSS management and optimization
 */

/**
 * Extract and inject critical CSS for faster initial page render
 */
export function extractCriticalCSS() {
  if (typeof window === 'undefined') return;
  
  // Critical styles for immediate rendering of above-the-fold content
  const criticalCSS = `
    /* Critical layout styles */
    body { display: block; margin: 0; font-family: 'Inter', sans-serif; }
    #root { display: flex; flex-direction: column; min-height: 100vh; }
    
    /* Critical component styles */
    .header-container { position: sticky; top: 0; z-index: 30; width: 100%; background-color: white; }
    .hero-section { overflow: hidden; position: relative; }
    .hero-image-container { display: flex; align-items: center; justify-content: center; }
    .hero-image { width: 100%; height: 100%; object-fit: contain; }
    
    /* Image and lazy-loading related critical styles */
    .image-container { position: relative; overflow: hidden; }
    .image-aspect-container { position: relative; height: 0; overflow: hidden; }
    .image-aspect-container img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    img { opacity: 1; transition: opacity 0.3s; }
    img.loading, .fade-in { opacity: 0; }
    
    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after { 
        animation-duration: 0.01ms !important; 
        animation-iteration-count: 1 !important; 
        transition-duration: 0.01ms !important; 
      }
    }
  `;

  // Create and insert style element
  const style = document.createElement('style');
  style.setAttribute('data-critical', 'true');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
  
  // Remove critical CSS after full CSS has loaded
  const removeInjectedStyles = () => {
    setTimeout(() => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 1000); // Wait a second after load to ensure smooth transition
  };
  
  // Use either onload or requestIdleCallback to schedule removal
  if (document.readyState === 'complete') {
    removeInjectedStyles();
  } else {
    window.addEventListener('load', removeInjectedStyles);
  }
}

/**
 * Setup dynamic loading of non-critical CSS
 */
export function setupDeferredCSS() {
  // List of non-critical stylesheets to load after page load
  const deferredStylesheets = [
    // Example: '/path/to/non-critical.css'
  ];
  
  if (typeof window === 'undefined' || deferredStylesheets.length === 0) return;
  
  // Function to load a stylesheet
  const loadStylesheet = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };
  
  // Load stylesheets when browser is idle
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      deferredStylesheets.forEach(loadStylesheet);
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    // Fix: Explicitly handle the window type to avoid 'never' type error
    if (typeof window !== 'undefined') {  // Redundant but helps TypeScript understand
      window.addEventListener('load', () => {
        setTimeout(() => {
          deferredStylesheets.forEach(loadStylesheet);
        }, 200);
      });
    }
  }
}

/**
 * Initialize critical CSS optimizations
 */
export function initializeCriticalCSS() {
  extractCriticalCSS();
  setupDeferredCSS();
}
