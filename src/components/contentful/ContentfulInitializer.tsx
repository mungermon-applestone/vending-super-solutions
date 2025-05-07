
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
    let isMounted = true;
    
    // Function to initialize Contentful
    const initializeContentful = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        console.log('[ContentfulInitializer] Starting initialization');
        
        // Force provider initialization
        forceContentfulProvider();
        
        // Test the connection
        const testResult = await testContentfulConnection();
        console.log('[ContentfulInitializer] Connection test result:', testResult);
        
        if (!testResult.success) {
          console.warn('[ContentfulInitializer] Connection test failed, but will try to continue:', testResult.message);
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
          
          // In preview environments, still force provider to use fallbacks
          if (isPreview) {
            forceContentfulProvider();
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
  }, [isPreview]);
  
  // Enhanced display strategy:
  // Always attempt to show content unless we're in a loading state
  const shouldShowChildren = isInitialized || initAttempted;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
        <span>Initializing content...</span>
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
