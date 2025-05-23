
import React, { useEffect, useState } from 'react';
import { refreshContentfulClient, testContentfulConnection } from '@/services/cms/utils/contentfulClient';
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
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  useEffect(() => {
    let isMounted = true;
    
    // Function to initialize Contentful
    const initializeContentful = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        console.log('[ContentfulInitializer] Starting initialization');
        
        // Check if Contentful is already configured
        if (!isContentfulConfigured()) {
          console.log('[ContentfulInitializer] Contentful not configured, checking hardcoded values');
          // Try to use hardcoded values from env-config.js
          if (typeof window !== 'undefined' && window.env && window.env.VITE_CONTENTFUL_SPACE_ID) {
            console.log('[ContentfulInitializer] Found hardcoded values in window.env');
          } else {
            console.warn('[ContentfulInitializer] No Contentful credentials found in environment');
            throw new Error('Contentful is not configured and no fallback credentials are available');
          }
        }
        
        // Test the connection
        const testResult = await testContentfulConnection();
        console.log('[ContentfulInitializer] Connection test result:', testResult);
        
        if (!testResult.success) {
          console.warn('[ContentfulInitializer] Connection test failed, but will try to continue:', testResult.message);
          
          // Try refreshing the client once more
          await refreshContentfulClient();
          
          // Try the test again
          const retryTest = await testContentfulConnection();
          if (!retryTest.success) {
            throw new Error(`Connection test failed: ${retryTest.message}`);
          }
        }
        
        // Mark as initialized regardless of test result to attempt showing content
        if (isMounted) {
          setIsInitialized(true);
          window._contentfulInitialized = true;
          window._contentfulInitializedSource = testResult.success ? 'successful-connection' : 'fallback-after-warning';
          console.log('[ContentfulInitializer] Marked as initialized, will attempt to show content');
        }
      } catch (error) {
        console.error('[ContentfulInitializer] Initialization error:', error);
        if (isMounted) {
          setError(error instanceof Error ? error : new Error('Unknown initialization error'));
          
          // If we still have retries left, try again
          if (retryCount < MAX_RETRIES) {
            console.log(`[ContentfulInitializer] Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
            setRetryCount(prev => prev + 1);
            
            // Use timeout to avoid immediate retry
            setTimeout(() => {
              if (isMounted) {
                initializeContentful();
              }
            }, 1000 * Math.pow(2, retryCount)); // Exponential backoff
            return;
          }
          
          // In preview environments or after all retries, still force provider to use fallbacks
          if (isPreview || retryCount >= MAX_RETRIES) {
            setIsInitialized(true); // Still initialized but will use fallbacks
            window._contentfulInitializedSource = 'fallback-after-error';
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setInitAttempted(true);
          console.log('[ContentfulInitializer] Initialization completed');
        }
      }
    };
    
    // Add a small delay to prevent blocking the main thread during initial page load
    const timer = setTimeout(() => {
      initializeContentful();
    }, 10);
    
    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isPreview, retryCount]);
  
  // Always attempt to show content unless we're in a loading state
  const shouldShowChildren = isInitialized || initAttempted;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span>Initializing content{retryCount > 0 ? ` (Retry ${retryCount}/${MAX_RETRIES})` : ''}...</span>
      </div>
    );
  }
  
  // Show error state - but only if we have a fallback and didn't mark as initialized
  if (error && fallback && !shouldShowChildren) {
    return fallback;
  }
  
  // Render children when initialized or attempted initialization
  return shouldShowChildren ? <>{children}</> : null;
};

export default ContentfulInitializer;
