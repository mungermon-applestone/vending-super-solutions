
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const Offline: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial connection status
    setIsOffline(!navigator.onLine);

    // Set up event listeners for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

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
