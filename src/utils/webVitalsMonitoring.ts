
import { type Metric } from 'web-vitals';

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

// Function to send metrics to an analytics endpoint
export function sendToAnalytics(metric: Metric): void {
  // Here you would typically send to your analytics service
  // This is a placeholder implementation
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta
  });
  
  // Only log in development, in production we'd send to an actual endpoint
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${metric.name}:`, metric.value);
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

// Helper to classify performance score
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
