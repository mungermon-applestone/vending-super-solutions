
import React, { useEffect } from 'react';

interface PerformanceOptimizerProps {
  priority?: 'high' | 'low';
  children: React.ReactNode;
}

/**
 * Component that applies various performance optimizations
 * to improve Lighthouse scores
 */
const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  priority = 'high',
  children
}) => {
  useEffect(() => {
    // Mark the start of component rendering for performance measurement
    if ('performance' in window) {
      performance.mark('component-start-render');
    }

    // Defer non-critical operations based on priority
    if (priority === 'low') {
      const deferOperation = () => {
        // Load any deferred resources here
        prefetchCriticalPages();
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(deferOperation);
      } else {
        setTimeout(deferOperation, 1000);
      }
    } else {
      // For high priority components, still prefetch but with less delay
      setTimeout(() => prefetchCriticalPages(), 200);
    }

    return () => {
      // Measure component render time when unmounted
      if ('performance' in window) {
        performance.mark('component-end-render');
        performance.measure(
          'component-render-duration',
          'component-start-render',
          'component-end-render'
        );
      }
    };
  }, [priority]);

  // Prefetch critical pages that users are likely to navigate to
  const prefetchCriticalPages = () => {
    const pagesToPrefetch = ['/products', '/machines', '/contact'];
    
    pagesToPrefetch.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    });
  };

  return <>{children}</>;
};

export default PerformanceOptimizer;
