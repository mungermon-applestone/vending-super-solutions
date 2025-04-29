
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { testContentfulConnection, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { isContentfulConfigured } from '@/config/cms';

/**
 * Provider component that monitors and maintains the Contentful connection
 * throughout the application lifecycle.
 */
const ContentfulPersistenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [checkCount, setCheckCount] = useState(0);

  // Check connection validity after route changes
  useEffect(() => {
    const checkConnection = async () => {
      // Skip check if it was performed recently (within 30 seconds)
      const now = Date.now();
      if (now - lastChecked < 30000) return;

      // Skip if Contentful isn't configured
      if (!isContentfulConfigured()) return;

      console.log('[ContentfulPersistenceProvider] Checking Contentful connection after route change');
      setLastChecked(now);
      
      try {
        const result = await testContentfulConnection();
        
        if (!result.success) {
          console.log('[ContentfulPersistenceProvider] Connection test failed, refreshing client');
          silentlyRefreshClient();
        } else {
          // Update global flag to indicate Contentful is working
          window._contentfulInitialized = true;
          console.log('[ContentfulPersistenceProvider] Connection valid');
        }
      } catch (error) {
        console.error('[ContentfulPersistenceProvider] Error checking connection:', error);
        silentlyRefreshClient();
      }
    };

    checkConnection();
  }, [location.pathname, lastChecked]);

  // Periodic heartbeat check (every 2 minutes)
  useEffect(() => {
    if (!isContentfulConfigured()) return;

    const heartbeatInterval = setInterval(() => {
      console.log('[ContentfulPersistenceProvider] Running heartbeat check');
      setCheckCount(prev => prev + 1);
      
      testContentfulConnection()
        .then(result => {
          if (!result.success) {
            console.log('[ContentfulPersistenceProvider] Heartbeat detected invalid connection');
            silentlyRefreshClient();
          }
        })
        .catch(() => {
          silentlyRefreshClient();
        });
    }, 120000); // 2 minutes

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Handler for silently refreshing the client without UI disruption
  const silentlyRefreshClient = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refreshContentfulClient();
      const result = await testContentfulConnection();
      
      if (result.success) {
        console.log('[ContentfulPersistenceProvider] Client refreshed successfully');
        window._contentfulInitialized = true;
      } else {
        console.warn('[ContentfulPersistenceProvider] Client refresh did not resolve connection issues');
      }
    } catch (error) {
      console.error('[ContentfulPersistenceProvider] Error refreshing client:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // The provider doesn't render anything additional
  return <>{children}</>;
};

export default ContentfulPersistenceProvider;
