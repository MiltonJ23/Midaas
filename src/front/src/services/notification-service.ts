/**
 * A service to handle browser notifications
 */
export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = "default";

  private constructor() {
    // Private constructor for singleton
    this.checkPermission();
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if browser notifications are supported
   */
  public isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window;
  }

  /**
   * Check current permission status
   */
  private checkPermission(): void {
    if (this.isSupported()) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request permission to show notifications
   * @returns Promise<boolean> - Whether permission was granted
   */
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn("Browser notifications not supported");
      return false;
    }

    if (this.permission === "granted") {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  public async retryPermission(): Promise<boolean> {
    return this.requestPermission();
  }

  /**
   * Show a browser notification
   * @param title - Notification title
   * @param options - Notification options
   * @returns The notification object if successful, null otherwise
   */
  public async showNotification(
    title: string,
    options: NotificationOptions = {},
  ): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn("Browser notifications not supported");
      return null;
    }

    // If permission is not granted, request it
    if (this.permission !== "granted") {
      const granted = await this.requestPermission();
      if (!granted) {
        console.warn("Notification permission not granted");
        return null;
      }
    }

    // Ensure we have a default icon
    const defaultOptions: NotificationOptions = {
      icon: "public/static/logo.png", // Update with your app's icon
      badge: "public/static/logo.png", // Optional badge icon
      ...options,
    };

    try {
      const notification = new Notification(title, defaultOptions);

      // Add click handler to focus the window and navigate to notifications page
      notification.onclick = () => {
        window.focus();
        if (options.data?.url) {
          window.location.href = options.data.url;
        } else {
          window.location.href = "/admin/notifications";
        }
      };

      return notification;
    } catch (error) {
      console.error("Error showing notification:", error);
      return null;
    }
  }
}

export default NotificationService.getInstance();
