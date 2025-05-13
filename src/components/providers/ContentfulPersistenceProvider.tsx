
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { resetContentfulClient, refreshContentfulClient } from '@/services/cms/utils/contentfulClient';
import { toast } from 'sonner';

interface ContentfulPersistenceContextType {
  refreshData: () => Promise<void>;
  isRefreshingData: boolean;
  lastRefreshTime: Date | null;
}

const ContentfulPersistenceContext = createContext<ContentfulPersistenceContextType | undefined>(undefined);

export const useContentfulPersistence = () => {
  const context = useContext(ContentfulPersistenceContext);
  if (!context) {
    throw new Error('useContentfulPersistence must be used within a ContentfulPersistenceProvider');
  }
  return context;
};

interface ContentfulPersistenceProviderProps {
  children: ReactNode;
  refreshInterval?: number; // in minutes
}

export const ContentfulPersistenceProvider: React.FC<ContentfulPersistenceProviderProps> = ({
  children,
  refreshInterval = 30, // default to 30 minutes
}) => {
  const [isRefreshingData, setIsRefreshingData] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // Function to handle the data refresh
  const refreshData = async () => {
    setIsRefreshingData(true);
    try {
      console.log('[ContentfulPersistence] Refreshing Contentful client and data');
      
      // Reset the contentful client to force a fresh connection
      resetContentfulClient();
      
      // Create a new client
      await refreshContentfulClient();
      
      // Update the last refresh time
      const now = new Date();
      setLastRefreshTime(now);
      localStorage.setItem('contentful_last_refresh', now.toISOString());
      
      toast.success('Content refreshed successfully');
    } catch (error) {
      console.error('[ContentfulPersistence] Error refreshing data:', error);
      toast.error('Failed to refresh content', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRefreshingData(false);
    }
  };

  // Check if we need to refresh on mount
  useEffect(() => {
    const checkAndRefresh = async () => {
      const storedRefreshTime = localStorage.getItem('contentful_last_refresh');
      
      if (storedRefreshTime) {
        const lastRefresh = new Date(storedRefreshTime);
        setLastRefreshTime(lastRefresh);
        
        // If it's been more than refreshInterval minutes, refresh the data
        const now = new Date();
        const minutesSinceLastRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60);
        
        if (minutesSinceLastRefresh > refreshInterval) {
          console.log(`[ContentfulPersistence] It's been ${minutesSinceLastRefresh.toFixed(1)} minutes since the last refresh, refreshing now`);
          await refreshData();
        } else {
          console.log(`[ContentfulPersistence] Last refresh was ${minutesSinceLastRefresh.toFixed(1)} minutes ago, no need to refresh yet`);
        }
      } else {
        // First time load, set the initial refresh time
        const now = new Date();
        setLastRefreshTime(now);
        localStorage.setItem('contentful_last_refresh', now.toISOString());
      }
    };
    
    checkAndRefresh();
    
    // Set up an interval to check if we need to refresh
    const intervalId = setInterval(async () => {
      const storedRefreshTime = localStorage.getItem('contentful_last_refresh');
      if (storedRefreshTime) {
        const lastRefresh = new Date(storedRefreshTime);
        const now = new Date();
        const minutesSinceLastRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60);
        
        if (minutesSinceLastRefresh > refreshInterval) {
          console.log(`[ContentfulPersistence] Automatic refresh triggered after ${minutesSinceLastRefresh.toFixed(1)} minutes`);
          await refreshData();
        }
      }
    }, refreshInterval * 60 * 1000); // Convert minutes to milliseconds
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // This is our context value
  const value: ContentfulPersistenceContextType = {
    refreshData,
    isRefreshingData,
    lastRefreshTime
  };

  return (
    <ContentfulPersistenceContext.Provider value={value}>
      {children}
    </ContentfulPersistenceContext.Provider>
  );
};
