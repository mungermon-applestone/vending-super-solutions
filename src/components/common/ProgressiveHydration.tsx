
import React, { useEffect, useState, ReactNode } from 'react';

interface ProgressiveHydrationProps {
  /**
   * Content to be progressively hydrated
   */
  children: ReactNode;
  
  /**
   * Priority level affects when the component will hydrate
   */
  priority?: 'critical' | 'visible' | 'idle';
  
  /**
   * Whether to skip hydration until explicitly triggered
   */
  skipHydration?: boolean;
  
  /**
   * ID for tracking the hydration status
   */
  id?: string;
}

/**
 * ProgressiveHydration component defers hydration of non-critical UI
 * to improve initial load performance
 */
export const ProgressiveHydration: React.FC<ProgressiveHydrationProps> = ({
  children,
  priority = 'visible',
  skipHydration = false,
  id = 'progressive-hydration'
}) => {
  const [hydrated, setHydrated] = useState(priority === 'critical');

  useEffect(() => {
    if (skipHydration || hydrated) return;
    
    // Mark performance timing for this hydration
    if ('performance' in window) {
      performance.mark(`hydration-start-${id}`);
    }
    
    const triggerHydration = () => {
      setHydrated(true);
      if ('performance' in window) {
        performance.mark(`hydration-end-${id}`);
        performance.measure(`hydration-${id}`, `hydration-start-${id}`, `hydration-end-${id}`);
      }
    };
    
    if (priority === 'critical') {
      // Critical components hydrate immediately
      triggerHydration();
    } else if (priority === 'visible') {
      // Visible components hydrate when they enter the viewport
      const observer = new IntersectionObserver((entries) => {
        if (entries.some(entry => entry.isIntersecting)) {
          triggerHydration();
          observer.disconnect();
        }
      }, { rootMargin: '100px' });
      
      // Get the DOM node using a ref
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
      
      return () => {
        observer.disconnect();
      };
    } else {
      // Idle priority components hydrate during browser idle time
      if ('requestIdleCallback' in window) {
        const idleId = (window as any).requestIdleCallback(triggerHydration);
        return () => (window as any).cancelIdleCallback(idleId);
      } else {
        const timeoutId = setTimeout(triggerHydration, 2000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [priority, skipHydration, hydrated, id]);

  return (
    <div id={id} data-hydrated={hydrated}>
      {children}
    </div>
  );
};

export default ProgressiveHydration;
