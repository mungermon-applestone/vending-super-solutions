
import React, { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';
import OfflineFallback from './OfflineFallback';

interface OfflineProps {
  fullscreenFallback?: boolean;
}

const Offline: React.FC<OfflineProps> = ({ fullscreenFallback = false }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showFullscreenFallback, setShowFullscreenFallback] = useState(false);

  useEffect(() => {
    // Check initial connection status
    const initialOfflineStatus = !navigator.onLine;
    setIsOffline(initialOfflineStatus);
    
    // Set initial load to false after a short delay
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      if (initialOfflineStatus && fullscreenFallback) {
        setShowFullscreenFallback(true);
      }
    }, 1000);

    // Set up event listeners for online/offline events
    const handleOnline = () => {
      setIsOffline(false);
      setShowFullscreenFallback(false);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      if (!isInitialLoad && fullscreenFallback) {
        setShowFullscreenFallback(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners
    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fullscreenFallback, isInitialLoad]);

  // Show fullscreen fallback if requested and offline
  if (showFullscreenFallback) {
    return <OfflineFallback onRetry={() => setShowFullscreenFallback(false)} />;
  }

  // Show nothing if online
  if (!isOffline) return null;

  // Show banner for offline state
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
        <span className="text-yellow-800 font-medium">
          You are currently offline. Some content may not be available.
        </span>
      </div>
    </div>
  );
};

export default Offline;
