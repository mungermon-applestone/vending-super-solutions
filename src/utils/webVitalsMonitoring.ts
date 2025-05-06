
import { type Metric } from 'web-vitals';

// Function to collect and report Core Web Vitals
export function reportWebVitals(onPerfEntry?: (metric: Metric) => void): void {
  // Only run in production, avoid overhead during development
  if (import.meta.env.PROD && onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry); // Cumulative Layout Shift
      onFID(onPerfEntry); // First Input Delay
      onFCP(onPerfEntry); // First Contentful Paint
      onLCP(onPerfEntry); // Largest Contentful Paint
      onTTFB(onPerfEntry); // Time to First Byte
      
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
    // Example:
    // navigator.sendBeacon('/analytics', body);
  }
}
