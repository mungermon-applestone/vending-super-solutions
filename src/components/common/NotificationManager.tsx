
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  areNotificationsSupported, 
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  getCurrentPushSubscription,
  showServiceWorkerNotification
} from '@/utils/notificationService';

// This should be provided by your backend service
// For testing purposes only - in production, use an actual VAPID key
const DEMO_PUBLIC_VAPID_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

interface NotificationManagerProps {
  small?: boolean;
  className?: string;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ 
  small = false,
  className = '' 
}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if notifications are supported and get current permission
  useEffect(() => {
    const supported = areNotificationsSupported();
    setIsSupported(supported);
    
    if (supported) {
      const currentPermission = getNotificationPermission();
      setPermission(currentPermission);
      
      // Check if already subscribed
      checkSubscriptionStatus();
    }
  }, []);

  // Check if the user is already subscribed to push notifications
  const checkSubscriptionStatus = async () => {
    try {
      const subscription = await getCurrentPushSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Handle subscription toggle
  const handleToggleSubscription = async () => {
    setIsLoading(true);
    
    try {
      if (!isSubscribed) {
        // Request permission if not already granted
        if (permission !== 'granted') {
          const newPermission = await requestNotificationPermission();
          setPermission(newPermission);
          
          if (newPermission !== 'granted') {
            toast.error('Permission denied for notifications');
            setIsLoading(false);
            return;
          }
        }
        
        // Subscribe to push notifications
        const subscription = await subscribeToPushNotifications(DEMO_PUBLIC_VAPID_KEY);
        setIsSubscribed(!!subscription);
        
        if (subscription) {
          // In a real application, you would send this subscription object to your server
          console.log('Push subscription successful:', subscription.toJSON());
          
          // Show a welcome notification
          setTimeout(() => {
            showServiceWorkerNotification('Welcome to Notifications!', {
              body: 'You will now receive updates from Vending Solutions',
              data: { url: '/products' }
            });
          }, 1000);
        }
      } else {
        // Unsubscribe from push notifications
        const result = await unsubscribeFromPushNotifications();
        setIsSubscribed(!result);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast.error('Failed to manage notification subscription');
    }
    
    setIsLoading(false);
  };

  // If notifications are not supported, show nothing or a simple message
  if (!isSupported) {
    if (small) return null;
    
    return (
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        <AlertCircle className="w-4 h-4 mr-1" />
        <span>Notifications not supported</span>
      </div>
    );
  }

  // Render a button or icon based on the size prop
  if (small) {
    return (
      <button
        onClick={handleToggleSubscription}
        disabled={isLoading || permission === 'denied'}
        className={`relative p-2 rounded-full hover:bg-gray-100 transition-colors ${className}`}
        title={isSubscribed ? 'Disable notifications' : 'Enable notifications'}
        aria-label={isSubscribed ? 'Disable notifications' : 'Enable notifications'}
      >
        {isSubscribed ? (
          <Bell className="w-5 h-5 text-blue-600" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-500" />
        )}
        
        {isLoading && (
          <span className="absolute top-0 right-0 h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleToggleSubscription}
      disabled={isLoading || permission === 'denied'}
      variant={isSubscribed ? "default" : "outline"}
      size="sm"
      className={className}
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="h-4 w-4 mr-2 border-2 border-blue-600 border-t-transparent animate-spin rounded-full"></span>
          Processing...
        </span>
      ) : isSubscribed ? (
        <span className="flex items-center">
          <Bell className="w-4 h-4 mr-2" />
          Notifications On
        </span>
      ) : (
        <span className="flex items-center">
          <BellOff className="w-4 h-4 mr-2" />
          Enable Notifications
        </span>
      )}
    </Button>
  );
};

export default NotificationManager;
