
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { forceContentfulProvider, initCMS } from '@/services/cms/cmsInit';
import { isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const RootLayout = () => {
  const [contentfulInitialized, setContentfulInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<Error | null>(null);
  const [initAttempts, setInitAttempts] = useState(0);
  const location = useLocation();
  const isPreview = isPreviewEnvironment();

  // Handle environment variables loaded event
  useEffect(() => {
    const handleEnvConfigLoaded = () => {
      console.log('[RootLayout] Environment config loaded event received, reinitializing CMS');
      setupCMS();
    };
    
    // Listen for the environment config loaded event
    window.addEventListener('env-config-loaded', handleEnvConfigLoaded);
    
    return () => {
      window.removeEventListener('env-config-loaded', handleEnvConfigLoaded);
    };
  }, []);
  
  // Initialize CMS at the root level to ensure it's available throughout the app
  useEffect(() => {
    setupCMS();
  }, [initAttempts]);
  
  // Reinitialize when route changes to admin/environment-variables
  useEffect(() => {
    if (contentfulInitialized && location.pathname.includes('/admin/environment-variables')) {
      console.log('[RootLayout] Detected navigation to environment variables page');
    }
  }, [location, contentfulInitialized]);
  
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
        
        // Only show a toast in preview environments when not on admin pages
        if (isPreview && !location.pathname.includes('/admin')) {
          toast.warning('Contentful is not configured. Configure environment variables in admin settings.', {
            duration: 5000,
            id: 'contentful-not-configured',
            action: {
              label: 'Configure',
              onClick: () => window.location.href = '/admin/environment-variables'
            }
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
      if (isPreview) {
        toast.error('Failed to initialize content system. Please configure environment variables.', { 
          duration: 8000,
          id: 'cms-init-error',
          action: {
            label: 'Configure',
            onClick: () => window.location.href = '/admin/environment-variables'
          }
        });
      } else {
        toast.error('Failed to initialize content system. Using fallback content.', { 
          duration: 5000,
          id: 'cms-init-error'
        });
      }
      
      // Even if there's an error, we still need to continue with the app
      setContentfulInitialized(true);
      
      // Force the provider to ensure the app can continue
      forceContentfulProvider();
      window._contentfulInitialized = 'error';
    } finally {
      setInitializing(false);
    }
  };
  
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
    env?: Record<string, string>;
  }
}

export default RootLayout;
