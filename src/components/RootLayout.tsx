
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
  const [initializationError, setInitializationError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);

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
          setInitializationError(null);
          
          // Set a global flag that can be checked by other components
          window._contentfulInitialized = true;
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
          
          // Set the global flag even when forcing the provider
          window._contentfulInitialized = true;
        }
      } catch (error) {
        console.error('[RootLayout] Error initializing CMS:', error);
        setInitializationError(error instanceof Error ? error : new Error('Unknown error initializing CMS'));
        
        // If we had an issue initializing, try again for up to 3 attempts
        if (initAttempts < 2) {
          console.log(`[RootLayout] Retrying CMS initialization (attempt ${initAttempts + 1}/3)`);
          setInitAttempts(prev => prev + 1);
          setTimeout(() => setupCMS(), 1500); // Retry after a delay
          return;
        }
        
        // After 3 attempts, give up and continue with the app using fallbacks
        toast.error('Failed to initialize content system. Using fallback content.', { 
          duration: 5000,
          id: 'cms-init-error'
        });
        
        // Even if there's an error, we still need to continue with the app
        setContentfulInitialized(true);
        
        // Force the provider to ensure the app can continue
        forceContentfulProvider();
        window._contentfulInitialized = 'error';
      } finally {
        setInitializing(false);
      }
    };
    
    setupCMS();
  }, [initAttempts]);
  
  // Show a brief loading state while Contentful initializes
  if (initializing && !contentfulInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Initializing content system...</p>
        {initAttempts > 0 && (
          <p className="text-sm text-gray-400 mt-2">Attempt {initAttempts + 1}/3</p>
        )}
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
      
      {/* Debug panel in development mode */}
      {process.env.NODE_ENV === 'development' && initializationError && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 p-4 rounded shadow-lg max-w-md z-50">
          <h4 className="text-red-800 font-semibold">CMS Initialization Error</h4>
          <p className="text-red-700 text-sm">{initializationError.message}</p>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
            {initializationError.stack}
          </pre>
        </div>
      )}
    </div>
  );
};

// Add the missing TypeScript definition for the global _contentfulInitialized flag
declare global {
  interface Window {
    _contentfulInitialized?: boolean | string;
  }
}

export default RootLayout;
