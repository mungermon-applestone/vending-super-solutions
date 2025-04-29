
import React, { useEffect, useState } from 'react';
import { refreshContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
import { forceContentfulProvider } from '@/services/cms/cmsInit';
import { isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ContentfulInitializerProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ContentfulInitializer: React.FC<ContentfulInitializerProps> = ({ 
  children, 
  fallback 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isPreview = isPreviewEnvironment();
  
  useEffect(() => {
    // Function to initialize Contentful
    const initializeContentful = async () => {
      setIsLoading(true);
      try {
        console.log('[ContentfulInitializer] Starting initialization');
        
        // For preview environments, always use the hardcoded credentials
        if (isPreview) {
          console.log('[ContentfulInitializer] Preview environment detected, using hardcoded credentials');
          forceContentfulProvider();
          
          // Test the connection to verify credentials work
          const testResult = await testContentfulConnection();
          if (testResult.success) {
            console.log('[ContentfulInitializer] Preview credentials verified successfully');
            setIsInitialized(true);
            window._contentfulInitialized = true;
          } else {
            throw new Error(`Preview credentials failed: ${testResult.message}`);
          }
        } 
        // For non-preview environments, check configuration
        else if (isContentfulConfigured()) {
          console.log('[ContentfulInitializer] Non-preview environment with config detected');
          forceContentfulProvider();
          
          // Test the connection
          const testResult = await testContentfulConnection();
          if (testResult.success) {
            console.log('[ContentfulInitializer] Credentials verified successfully');
            setIsInitialized(true);
            window._contentfulInitialized = true;
          } else {
            throw new Error(`Credentials failed: ${testResult.message}`);
          }
        } 
        // If no configuration in non-preview environment
        else {
          console.log('[ContentfulInitializer] No Contentful configuration found in non-preview environment');
          forceContentfulProvider(); // Force provider with null config for fallbacks
          setIsInitialized(true); // Still initialized but will use fallbacks
        }
      } catch (error) {
        console.error('[ContentfulInitializer] Initialization error:', error);
        setError(error instanceof Error ? error : new Error('Unknown initialization error'));
        
        // Even with error, force provider to use fallbacks
        forceContentfulProvider();
        setIsInitialized(true); // Still initialized but will use fallbacks
      } finally {
        setIsLoading(false);
        console.log('[ContentfulInitializer] Initialization completed');
      }
    };
    
    // Run the initialization
    initializeContentful();
  }, [isPreview]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span>Initializing content...</span>
      </div>
    );
  }
  
  // Show error state
  if (error && !isInitialized) {
    return fallback || (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-medium">Content System Error</h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
      </div>
    );
  }
  
  // Render children when initialized
  return isInitialized ? <>{children}</> : null;
};

export default ContentfulInitializer;
