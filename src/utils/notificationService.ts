
import { toast } from 'sonner';

// Check if the browser supports notifications
export function areNotificationsSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Check the current permission status
export function getNotificationPermission(): NotificationPermission | null {
  if (!areNotificationsSupported()) {
    return null;
  }
  return Notification.permission;
}

// Request permission to display notifications
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!areNotificationsSupported()) {
    toast.error('Notifications are not supported in this browser');
    return 'denied';
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    toast.error('Failed to request notification permission');
    return 'denied';
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
  applicationServerKey: string
): Promise<PushSubscription | null> {
  if (!areNotificationsSupported()) {
    toast.error('Push notifications are not supported in your browser');
    return null;
  }
  
  try {
    // Check if service worker is registered
    if (!window._swRegistration) {
      toast.error('Service worker not registered');
      return null;
    }
    
    // Convert the application server key to the format required by the Push API
    const applicationServerKeyArray = urlB64ToUint8Array(applicationServerKey);
    
    // Get an existing subscription if there is one
    const existingSubscription = await window._swRegistration.pushManager.getSubscription();
    
    if (existingSubscription) {
      // Already subscribed
      return existingSubscription;
    }
    
    // Create a new subscription
    const subscription = await window._swRegistration.pushManager.subscribe({
      userVisibleOnly: true, // Must be true for Chrome
      applicationServerKey: applicationServerKeyArray
    });
    
    console.log('Push notification subscription successful:', subscription);
    toast.success('Successfully subscribed to notifications');
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    
    if (error instanceof Error && error.message.includes('permission')) {
      toast.error('Permission denied for notifications');
    } else {
      toast.error('Failed to subscribe to push notifications');
    }
    
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!window._swRegistration) {
    return false;
  }
  
  try {
    const subscription = await window._swRegistration.pushManager.getSubscription();
    
    if (!subscription) {
      // Not subscribed
      return true;
    }
    
    const result = await subscription.unsubscribe();
    
    if (result) {
      toast.success('Successfully unsubscribed from notifications');
    }
    
    return result;
  } catch (error) {
    console.error('Failed to unsubscribe from push notifications:', error);
    toast.error('Failed to unsubscribe from push notifications');
    return false;
  }
}

// Get the current push notification subscription
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!window._swRegistration) {
    return null;
  }
  
  try {
    return await window._swRegistration.pushManager.getSubscription();
  } catch (error) {
    console.error('Failed to get current push subscription:', error);
    return null;
  }
}

// Helper function to convert a base64 string to a Uint8Array
function urlB64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}

// Display a test notification using the Notification API
export function showTestNotification(title: string, options: CustomNotificationOptions = {}): void {
  if (!areNotificationsSupported()) {
    toast.error('Notifications are not supported in this browser');
    return;
  }
  
  if (Notification.permission !== 'granted') {
    toast.error('Notification permission not granted');
    return;
  }
  
  const defaultOptions: CustomNotificationOptions = {
    body: 'This is a test notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    vibrate: [100, 50, 100],
    tag: 'test-notification'
  };
  
  try {
    new Notification(title, { ...defaultOptions, ...options });
  } catch (error) {
    console.error('Failed to show test notification:', error);
    toast.error('Failed to show notification');
  }
}

// Show a notification using the Service Worker
export async function showServiceWorkerNotification(
  title: string, 
  options: CustomNotificationOptions = {}
): Promise<boolean> {
  if (!window._swRegistration) {
    toast.error('Service worker not registered');
    return false;
  }
  
  const defaultOptions: CustomNotificationOptions = {
    body: 'Notification from Vending Solutions',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    vibrate: [100, 50, 100],
    tag: 'service-worker-notification'
  };
  
  try {
    await window._swRegistration.showNotification(title, { ...defaultOptions, ...options });
    return true;
  } catch (error) {
    console.error('Failed to show notification through service worker:', error);
    toast.error('Failed to show notification');
    return false;
  }
}
