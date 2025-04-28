
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { forceContentfulProvider, initCMS } from '@/services/cms/cmsInit';
import { isContentfulConfigured } from '@/config/cms';

const RootLayout = () => {
  // Initialize CMS at the root level to ensure it's available throughout the app
  useEffect(() => {
    const setupCMS = async () => {
      try {
        if (isContentfulConfigured()) {
          console.log('[RootLayout] Initializing CMS');
          await initCMS();
        } else {
          console.log('[RootLayout] Contentful not configured, forcing provider anyway');
          forceContentfulProvider();
        }
      } catch (error) {
        console.error('[RootLayout] Error initializing CMS:', error);
      }
    };
    
    setupCMS();
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RootLayout;
