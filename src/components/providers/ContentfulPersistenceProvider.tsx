
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { testContentfulConnection, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured, isPreviewEnvironment } from '@/config/cms';

/**
 * Provider component that monitors and maintains the Contentful connection
 * throughout the application lifecycle.
 */
const ContentfulPersistenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPreview = isPreviewEnvironment();
  
  // Store the refreshContentful function in window for access from config
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window._refreshContentfulAfterConfig = async () => {
        console.log('[ContentfulPersistenceProvider] Refreshing Contentful client after config update');
        try {
          await refreshContentfulClient();
          console.log('[ContentfulPersistenceProvider] Successfully refreshed client');
          return Promise.resolve();
        } catch (error) {
          console.error('[ContentfulPersistenceProvider] Error refreshing client:', error);
          return Promise.reject(error);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        window._refreshContentfulAfterConfig = undefined;
      }
    };
  }, []);
  
  // Force refresh on first load
  useEffect(() => {
    const refreshOnLoad = async () => {
      console.log('[ContentfulPersistenceProvider] Initial refresh of Contentful client');
      try {
        await refreshContentfulClient();
      } catch (error) {
        console.error('[ContentfulPersistenceProvider] Initial refresh error:', error);
        
        // If refresh fails, try again after a delay (helps with race conditions)
        setTimeout(async () => {
          try {
            console.log('[ContentfulPersistenceProvider] Retry refresh after initial failure');
            await refreshContentfulClient();
          } catch (retryError) {
            console.error('[ContentfulPersistenceProvider] Retry refresh also failed:', retryError);
          }
        }, 2000);
      }
    };
    
    refreshOnLoad();
  }, []);
  
  // Periodic heartbeat check (every 60 seconds)
  useEffect(() => {
    console.log('[ContentfulPersistenceProvider] Setting up connection heartbeat');
    
    // Check connection on route changes
    const checkConnection = async () => {
      try {
        const result = await testContentfulConnection(true); // silent mode
        
        if (!result.success) {
          console.log('[ContentfulPersistenceProvider] Heartbeat detected connection issue, refreshing client');
          await refreshContentfulClient();
        }
      } catch (error) {
        console.error('[ContentfulPersistenceProvider] Heartbeat error:', error);
      }
    };
    
    // Initial check
    checkConnection();
    
    // Setup interval for periodic checks
    const heartbeatInterval = setInterval(() => {
      console.log('[ContentfulPersistenceProvider] Running heartbeat check');
      checkConnection();
    }, 60000); // 1 minute
    
    return () => clearInterval(heartbeatInterval);
  }, []);

  // Check connection on route changes
  useEffect(() => {
    const handleRouteChange = async () => {
      try {
        console.log('[ContentfulPersistenceProvider] Checking connection after route change');
        const result = await testContentfulConnection(true); // silent mode
        
        if (!result.success) {
          console.log('[ContentfulPersistenceProvider] Route change check found connection issue, refreshing');
          await refreshContentfulClient();
        }
      } catch (error) {
        console.error('[ContentfulPersistenceProvider] Route change check error:', error);
      }
    };
    
    // Check connection when route changes
    handleRouteChange();
  }, [location.pathname]);

  // The provider doesn't render anything additional
  return <>{children}</>;
};

export default ContentfulPersistenceProvider;
