
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
  
  // Periodic heartbeat check (every 2 minutes)
  useEffect(() => {
    // Only run heartbeats if Contentful is configured
    if (!isContentfulConfigured() && !isPreview) return;
    
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
    }, 120000); // 2 minutes
    
    return () => clearInterval(heartbeatInterval);
  }, [isPreview]);

  // Check connection on route changes (but only every 30 seconds max)
  useEffect(() => {
    const lastCheckedRef = { time: Date.now() };
    
    const handleRouteChange = async () => {
      // Skip if checked recently (within 30 seconds)
      const now = Date.now();
      if (now - lastCheckedRef.time < 30000) return;
      
      lastCheckedRef.time = now;
      
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
    if (isContentfulConfigured() || isPreview) {
      handleRouteChange();
    }
  }, [location.pathname, isPreview]);

  // The provider doesn't render anything additional
  return <>{children}</>;
};

export default ContentfulPersistenceProvider;
