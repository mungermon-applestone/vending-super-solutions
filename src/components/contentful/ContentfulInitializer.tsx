
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
  const [initAttempted, setInitAttempted] = useState(false);
  
  useEffect(() => {
    // Function to initialize Contentful
    const initializeContentful = async () => {
      setIsLoading(true);
      try {
        console.log('[ContentfulInitializer] Starting initialization');
        
        // For non-preview environments (production), always use server-side environment variables
        // Skip checking localStorage for production environments to avoid credential issues
        if (!isPreview) {
          console.log('[ContentfulInitializer] Production environment detected, using server-side credentials only');
          
          // Force provider initialization with server-side variables only
          forceContentfulProvider();
          
          // Test the connection - but continue even if it fails
          // This helps avoid showing error states in production when server-side credentials exist
          try {
            const testResult = await testContentfulConnection();
            if (testResult.success) {
              console.log('[ContentfulInitializer] Production credentials verified successfully');
            } else {
              console.warn('[ContentfulInitializer] Production credentials test failed, but continuing');
            }
          } catch (testError) {
            console.warn('[ContentfulInitializer] Error testing production credentials, but continuing:', testError);
          }
          
          // Mark as initialized regardless of test result
          // In production, we always show content even if credentials test fails
          setIsInitialized(true);
          window._contentfulInitialized = true;
          window._contentfulInitializedSource = 'production-env';
        } 
        // For preview environments or development, try multiple credential sources
        else {
          console.log('[ContentfulInitializer] Preview/development environment detected');
          forceContentfulProvider();
          
          // Test the connection to verify credentials work
          const testResult = await testContentfulConnection();
          if (testResult.success) {
            console.log('[ContentfulInitializer] Preview credentials verified successfully');
            setIsInitialized(true);
            window._contentfulInitialized = true;
            window._contentfulInitializedSource = 'preview-env';
          } else {
            throw new Error(`Preview credentials failed: ${testResult.message}`);
          }
        }
      } catch (error) {
        console.error('[ContentfulInitializer] Initialization error:', error);
        setError(error instanceof Error ? error : new Error('Unknown initialization error'));
        
        // In preview environments, still force provider to use fallbacks
        if (isPreview) {
          forceContentfulProvider();
          setIsInitialized(true); // Still initialized but will use fallbacks
          window._contentfulInitializedSource = 'fallback-after-error';
        }
      } finally {
        setIsLoading(false);
        setInitAttempted(true);
        console.log('[ContentfulInitializer] Initialization completed');
      }
    };
    
    // Run the initialization
    initializeContentful();
  }, [isPreview]);
  
  // Enhanced error handling strategy:
  // In production environments, we prioritize showing content even with errors
  const shouldShowChildren = isInitialized || (!isPreview && initAttempted);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span>Initializing content...</span>
      </div>
    );
  }
  
  // Show error state - only in preview/development environments
  if (error && !shouldShowChildren) {
    return fallback || (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md">
        <h3 className="text-red-800 font-medium">Content System Error</h3>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
      </div>
    );
  }
  
  // Render children when initialized or in production (regardless of initialization)
  return shouldShowChildren ? <>{children}</> : null;
};

export default ContentfulInitializer;
