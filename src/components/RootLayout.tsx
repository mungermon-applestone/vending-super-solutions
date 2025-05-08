
import React, { useEffect, Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import ContentfulPersistenceProvider from './providers/ContentfulPersistenceProvider';
import ContentfulInitializer from './contentful/ContentfulInitializer';
import { isPreviewEnvironment, logContentfulConfig } from '@/config/cms';
import { Offline } from '@/components/common';
import SiteMetadata from './seo/SiteMetadata';
import { Spinner } from '@/components/ui/spinner';
import { createDynamicComponent } from '@/utils/dynamicLoader';
import CookieBanner from './common/CookieBanner';
import { trackPageView } from '@/utils/analytics';

/**
 * RootLayout Component
 * 
 * IMPORTANT REGRESSION PREVENTION NOTES:
 * - This component is the main layout wrapper for the entire application
 * - Maintains critical layout structure with Header, Outlet (for routes), and Footer
 * - Initializes analytics tracking and performance monitoring
 * - Handles Contentful CMS integration and preview environment detection
 * - Implements performance optimization techniques (lazy loading, Suspense)
 * 
 * Structure:
 * - Header (fixed navigation)
 * - Main content area (flexible height, renders current route)
 * - Footer (consistent across all pages)
 * - Various providers and utility components
 */

// Lazy load non-critical components
const PreviewEnvironmentDetector = createDynamicComponent(
  () => import(/* webpackChunkName: "preview-detector" */ './contentful/PreviewEnvironmentDetector'),
  { priority: 'low' }
);

const RootLayout = () => {
  const isPreview = isPreviewEnvironment();
  const location = useLocation();
  
  // Log contentful configuration on mount for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Schedule this operation after main render
      const timer = setTimeout(() => {
        logContentfulConfig();
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Monitor time to interactive
  useEffect(() => {
    if ('performance' in window) {
      // Mark when the layout is mounted
      performance.mark('root-layout-mount');
      
      // Wait a moment for interactivity
      const timeout = setTimeout(() => {
        performance.mark('time-to-interactive');
        performance.measure('TTI', 'navigationStart', 'time-to-interactive');
        
        try {
          const ttiMeasure = performance.getEntriesByName('TTI', 'measure')[0];
          console.log('[Performance] Time to Interactive:', ttiMeasure.duration.toFixed(2) + 'ms');
        } catch (e) {
          // Ignore errors
        }
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  /**
   * Track route changes for analytics
   * 
   * CRITICAL: This effect must be maintained to ensure proper analytics tracking
   * of page views throughout the application.
   */
  useEffect(() => {
    if ('performance' in window) {
      performance.mark(`route-${location.pathname}`);
    }
    
    // Track page view in Google Analytics
    trackPageView(location.pathname, document.title);
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ContentfulInitializer
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-gray-50 p-4">
            <div className="container mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <h2 className="text-yellow-800 font-medium text-lg">Content System Initializing</h2>
                <p className="text-yellow-700 mt-1">
                  The content management system is currently initializing. 
                  This page will automatically refresh when ready.
                </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ContentfulPersistenceProvider>
        {/* Site-wide metadata and structured data */}
        <SiteMetadata />
        
        <div className="flex min-h-screen flex-col">
          <Header />
          
          {/* Offline indicator */}
          <Offline />
          
          {/* Show the preview environment detector if needed */}
          {isPreview && (
            <div className="container mx-auto px-4 pt-4">
              <Suspense fallback={<div className="h-10 bg-gray-100 animate-pulse rounded-md" />}>
                <PreviewEnvironmentDetector />
              </Suspense>
            </div>
          )}
          
          {/* Main content with layout shift optimization */}
          <main 
            className="flex-1 bg-gray-50"
            style={{ 
              contentVisibility: 'auto', 
              containIntrinsicSize: '0 800px' 
            }}
          >
            <Suspense fallback={
              <div className="animate-pulse p-4">
                <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
              </div>
            }>
              <Outlet />
            </Suspense>
          </main>

          {/* Footer */}
          <Footer />
          
          {/* Cookie Banner */}
          <CookieBanner />
        </div>
      </ContentfulPersistenceProvider>
    </ContentfulInitializer>
  );
};

export default RootLayout;
