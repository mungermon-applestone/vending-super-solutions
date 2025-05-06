
import React, { useState, useEffect } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Component that detects offline status and displays a notification banner
 * Uses both the browser's online/offline events and active pinging
 */
const Offline: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let pingInterval: number | undefined;
    
    // Function to check connectivity by pinging a small endpoint
    const checkConnectivity = async () => {
      try {
        // Use a tiny endpoint that's likely to be cached by the service worker
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/ping', { 
          method: 'HEAD',
          signal: controller.signal,
          // Add cache busting to avoid getting cached responses
          headers: { 'pragma': 'no-cache' }
        });
        
        clearTimeout(timeoutId);
        
        // If we got a response, we're online
        if (response.ok) {
          if (isOffline) {
            setIsOffline(false);
            toast.success("You're back online!");
          }
        } else {
          if (!isOffline) {
            setIsOffline(true);
            toast.error("You appear to be offline. Some features may be unavailable.");
          }
        }
      } catch (error) {
        // If there's an error, we're probably offline
        if (!isOffline) {
          setIsOffline(true);
          toast.error("You appear to be offline. Some features may be unavailable.");
        }
      }
    };
    
    // Handle browser online/offline events
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("You are currently offline. Some features may be unavailable.");
      document.documentElement.classList.add('is-offline');
    };
    
    const handleOnline = () => {
      // Double check with an active ping to confirm we're really online
      checkConnectivity();
      document.documentElement.classList.remove('is-offline');
    };
    
    // Register event listeners
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    
    // Check initial connection state
    checkConnectivity();
    
    // Setup periodic checks (every 30 seconds)
    pingInterval = window.setInterval(checkConnectivity, 30000);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (pingInterval) clearInterval(pingInterval);
    };
  }, [isOffline]);
  
  // Only show banner if offline
  if (!isOffline) return null;
  
  return (
    <div className="bg-amber-50 border-b border-amber-200 py-2 px-4 flex items-center justify-center space-x-2 transition-all">
      <WifiOff size={16} className="text-amber-700" />
      <p className="text-sm text-amber-800 font-medium">
        You are offline. Some features may be unavailable.
      </p>
    </div>
  );
};

export default Offline;
