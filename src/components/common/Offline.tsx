
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { checkOfflineStatus } from '@/utils/serviceWorkerRegistration';

interface OfflineProps {
  onOfflineStatusChange?: (isOffline: boolean) => void;
}

const Offline: React.FC<OfflineProps> = ({ onOfflineStatusChange }) => {
  const [isOffline, setIsOffline] = useState(checkOfflineStatus());
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowBanner(true);
      if (onOfflineStatusChange) onOfflineStatusChange(false);
      
      // Hide the "online" banner after 3 seconds
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
      if (onOfflineStatusChange) onOfflineStatusChange(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Update current status on mount
    setIsOffline(checkOfflineStatus());
    if (checkOfflineStatus()) {
      setShowBanner(true);
      if (onOfflineStatusChange) onOfflineStatusChange(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOfflineStatusChange]);

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed top-16 right-0 left-0 z-50 py-2 px-4 text-sm text-white transition-all ${
        isOffline ? 'bg-amber-600' : 'bg-green-600'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isOffline ? (
            <>
              <WifiOff size={16} />
              <span>You're offline. Some content may not be available.</span>
            </>
          ) : (
            <>
              <Wifi size={16} />
              <span>You're back online!</span>
            </>
          )}
        </div>
        {isOffline && (
          <button 
            onClick={() => setShowBanner(false)}
            className="text-white hover:underline focus:outline-none"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};

export default Offline;
