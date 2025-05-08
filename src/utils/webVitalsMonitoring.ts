
import { type Metric } from 'web-vitals';
import { trackWebVital } from './analytics';

/**
 * Web Vitals Monitoring System
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This module is critical for performance monitoring
 * - Always maintain integration with analytics tracking
 * - Only run reporting in production to avoid development overhead
 * - Preserve the classification thresholds for consistent reporting
 */

// Function to collect and report Core Web Vitals
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void): void {
  // Only run in production, avoid overhead during development
  if (import.meta.env.PROD && onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(onPerfEntry); // Cumulative Layout Shift
      onFID(onPerfEntry); // First Input Delay
      onFCP(onPerfEntry); // First Contentful Paint
      onLCP(onPerfEntry); // Largest Contentful Paint
      onTTFB(onPerfEntry); // Time to First Byte
      onINP(onPerfEntry); // Interaction to Next Paint (new metric)
      
      console.log('[webVitals] Monitoring initialized');
    });
  }
}

// Custom handler to log metrics to console (useful for testing)
export function logWebVitals(): void {
  reportWebVitals(metric => {
    console.log(`[WebVitals] ${metric.name}:`, metric);
  });
}

/**
 * Send metrics to analytics tracking
 * 
 * @param metric - The web vital metric to track
 */
export function sendToAnalytics(metric: Metric): void {
  // Track the web vital metric using our analytics utility
  trackWebVital({
    name: metric.name,
    id: metric.id,
    value: metric.value
  });
  
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta,
    navigationType: getNavigationType()
  });
  
  // Only log in development, in production we'd send to an actual endpoint
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${metric.name}:`, metric.value, 
      'Rating:', classifyPerformanceScore(metric.value, metric.name));
  } else {
    // In production, we would send this data to an analytics endpoint
    // Using the sendBeacon API for better performance during page unload
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/vitals', body);
      } else {
        fetch('/api/vitals', {
          body,
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (err) {
      console.error('[Analytics] Failed to send metrics:', err);
    }
  }
}

/**
 * Classify performance score based on Core Web Vitals thresholds
 * 
 * IMPORTANT: These thresholds are based on Google's recommendations
 * and should not be modified without careful consideration
 * 
 * @param value - The metric value
 * @param metric - The metric name
 * @returns Classification as 'good', 'needs-improvement', or 'poor'
 */
export function classifyPerformanceScore(value: number, metric: string): 'good' | 'needs-improvement' | 'poor' {
  // Thresholds based on Core Web Vitals
  const thresholds: Record<string, [number, number]> = {
    CLS: [0.1, 0.25],    // Cumulative Layout Shift
    FID: [100, 300],     // First Input Delay (ms)
    LCP: [2500, 4000],   // Largest Contentful Paint (ms)
    FCP: [1800, 3000],   // First Contentful Paint (ms)
    TTFB: [800, 1800],   // Time to First Byte (ms)
    INP: [200, 500]      // Interaction to Next Paint (ms)
  };
  
  const [good, poor] = thresholds[metric] || [0, 0];
  
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

// Get the navigation type (navigate, reload, back_forward, prerender)
function getNavigationType(): string {
  const navigation = (window as any).performance?.getEntriesByType?.('navigation')[0];
  return navigation?.type || 'navigate';
}

/**
 * Capture First Input Delay for additional monitoring
 * This is separate from web-vitals to ensure we catch every first interaction
 */
export function captureFirstInputDelay(): void {
  let firstInput = false;
  
  function onFirstInput(event: Event): void {
    if (firstInput) return;
    firstInput = true;
    
    const delay = Date.now() - (event as any).timeStamp;
    console.log('[FID] First Input Delay:', delay);
    
    // Remove the event listeners
    document.removeEventListener('click', onFirstInput);
    document.removeEventListener('keydown', onFirstInput);
    document.removeEventListener('touchstart', onFirstInput);
  }
  
  // Add event listeners
  document.addEventListener('click', onFirstInput);
  document.addEventListener('keydown', onFirstInput);
  document.addEventListener('touchstart', onFirstInput);
}

/**
 * Initialize all performance monitoring
 * Call this function at the application entry point
 */
export function initPerformanceMonitoring(): void {
  if (import.meta.env.PROD) {
    reportWebVitals(sendToAnalytics);
    captureFirstInputDelay();
  } else {
    logWebVitals();
  }
}
