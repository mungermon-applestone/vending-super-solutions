
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { forceContentfulProvider, initCMS } from '@/services/cms/cmsInit';
import { isContentfulConfigured } from '@/config/cms';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const RootLayout = () => {
  const [contentfulInitialized, setContentfulInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Initialize CMS at the root level to ensure it's available throughout the app
  useEffect(() => {
    const setupCMS = async () => {
      try {
        if (isContentfulConfigured()) {
          console.log('[RootLayout] Initializing CMS');
          setInitializing(true);
          await initCMS();
          console.log('[RootLayout] CMS initialized successfully');
          setContentfulInitialized(true);
        } else {
          console.log('[RootLayout] Contentful not configured, forcing provider anyway');
          forceContentfulProvider();
          setContentfulInitialized(true);
          
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
        // Even if there's an error, we still need to continue with the app
        setContentfulInitialized(true);
      } finally {
        setInitializing(false);
      }
    };
    
    setupCMS();
  }, []);
  
  // Show a brief loading state while Contentful initializes
  if (initializing && !contentfulInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Initializing content system...</p>
      </div>
    );
  }
  
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
