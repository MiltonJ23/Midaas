"use client";

import { notificationProvider } from "@/api/notifications";
import { useAuthStore } from "@/store/auth";
import { useNotificationsStore } from "@/store/notifications";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import notificationService from "@/services/notification-service";
import Notification, {
  INotification,
} from "@/entities/notifications/notification";
import { wsURL } from "@/api";

export default function useNotifications() {
  const { user } = useAuthStore();
  const { loadData, loaded, addNotification } = useNotificationsStore();
  const [loading, setLoading] = useState(false);

  // Request notification permission when the component mounts
  useEffect(() => {
    if (notificationService.isSupported()) {
      notificationService.requestPermission();
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (!user) return;
    if (loading || loaded) return;

    (async () => {
      setLoading(true);
      try {
        const { data, error } =
          await notificationProvider.getNotificationsList();

        if (data) {
          loadData({ notifications: data.notifications, userId: user?.id }); // Pass notifications and userId
        } else {
          toast.error(error || "Erreur lors du chargement des notifications");
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
        toast.error("Erreur lors du chargement des notifications");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, loadData, loaded, loading]);

  //TODO: Set up WebSocket connection for real-time notifications


  return { loading };
}
