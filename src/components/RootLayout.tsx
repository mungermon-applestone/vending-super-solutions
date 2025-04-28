
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { forceContentfulProvider, initCMS } from '@/services/cms/cmsInit';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';

const RootLayout = () => {
  // Initialize CMS at the root level to ensure it's available throughout the app
  useEffect(() => {
    const setupCMS = async () => {
      try {
        if (isContentfulConfigured()) {
          console.log('[RootLayout] Initializing CMS');
          await initCMS();
          console.log('[RootLayout] CMS initialized successfully');
        } else {
          console.log('[RootLayout] Contentful not configured, forcing provider anyway');
          forceContentfulProvider();
          
          // Only show a toast in non-development environments
          if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
            toast.warning('Contentful is not configured. Some content may use fallbacks.', {
              duration: 5000,
              id: 'contentful-not-configured'
            });
          }
        }
      } catch (error) {
        console.error('[RootLayout] Error initializing CMS:', error);
        toast.error('Failed to initialize content system. Using fallback content.', { 
          duration: 5000,
          id: 'cms-init-error'
        });
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
