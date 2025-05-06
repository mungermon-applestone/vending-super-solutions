
/**
 * Utility for dynamic component imports with improved loading patterns
 */
import React, { lazy, ComponentType, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

/**
 * Options for dynamic imports
 */
interface DynamicImportOptions {
  /**
   * Specify an ID for the component to help with performance tracking
   */
  id?: string;
  
  /**
   * Priority of the component (affects preloading behavior)
   */
  priority?: 'high' | 'medium' | 'low';
  
  /**
   * Custom loading component
   */
  fallback?: React.ReactNode;

  /**
   * Whether to enable performance monitoring for this component
   */
  monitor?: boolean;
}

/**
 * Creates a dynamically imported component with configurable loading behavior
 */
export function createDynamicComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
) {
  const { 
    id = 'dynamic-component', 
    priority = 'medium',
    fallback = <div className="flex justify-center items-center p-4"><Spinner size="md" /></div>,
    monitor = true
  } = options;
  
  // Create the lazy component
  const LazyComponent = lazy(importFn);
  
  // Preload high priority components after main content loads
  if (priority === 'high' && typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      // Use requestIdleCallback if available, otherwise use setTimeout
      const requestIdleCallback = 
        (window as any).requestIdleCallback || 
        ((cb: Function) => setTimeout(cb, 1));
      
      requestIdleCallback(() => {
        importFn().catch(err => console.error(`Error preloading component: ${id}`, err));
      });
    });
  }
  
  // Return a wrapper component that handles suspense
  return function DynamicComponent(props: any) {
    // Monitor component load time if monitoring is enabled
    React.useEffect(() => {
      if (monitor && 'performance' in window) {
        const markId = `dynamic-${id}-mounted`;
        performance.mark(markId);
        
        return () => {
          try {
            performance.measure(`dynamic-${id}-lifecycle`, markId);
          } catch (e) {
            // Ignore measurement errors
          }
        };
      }
    }, []);
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
