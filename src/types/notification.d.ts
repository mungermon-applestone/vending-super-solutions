
/**
 * Extended notification options for browser notifications
 */
interface CustomNotificationOptions extends NotificationOptions {
  vibrate?: number[] | undefined;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}
