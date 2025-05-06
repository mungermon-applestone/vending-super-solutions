
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import ContentfulPersistenceProvider from './providers/ContentfulPersistenceProvider';
import ContentfulInitializer from './contentful/ContentfulInitializer';
import PreviewEnvironmentDetector from './contentful/PreviewEnvironmentDetector';
import { isPreviewEnvironment } from '@/config/cms';
import { Offline } from '@/components/common';

const RootLayout = () => {
  const isPreview = isPreviewEnvironment();
  
  // Log contentful configuration on mount for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[RootLayout] Contentful configuration:', {
        hasSpaceId: !!(window.env && window.env.VITE_CONTENTFUL_SPACE_ID),
        hasToken: !!(window.env && window.env.VITE_CONTENTFUL_DELIVERY_TOKEN),
        source: window._contentfulInitializedSource
      });
    }
  }, []);

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
        <div className="flex min-h-screen flex-col">
          <Header />
          
          {/* Offline indicator */}
          <Offline />
          
          {/* Show the preview environment detector if needed */}
          {isPreview && (
            <div className="container mx-auto px-4 pt-4">
              <PreviewEnvironmentDetector />
            </div>
          )}
          
          {/* Main content */}
          <main className="flex-1 bg-gray-50">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </ContentfulPersistenceProvider>
    </ContentfulInitializer>
  );
};

export default RootLayout;
