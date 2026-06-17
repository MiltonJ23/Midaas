import Notification, {
  INotification,
} from "@/entities/notifications/notification";
import instance from "..";
import { CreateAnnouncementNotificationDto } from "./dto";
import { withErrorHandling } from "@/api/api-wrapper-utility";

export const notificationProvider = {
  getNotificationsList: async () => {
    return await withErrorHandling<{
      message: string;
      notifications: Notification[];
    }>(
      async () => {
        const response = await instance.get("/notifications/all");

        if (response.status === 200) {
          const notifications = response.data.Data.map(
            (notification: any) =>
              new Notification({
                id: notification.id,
                senderId: notification.sender.id,
                recipientId: notification.recipient.id,
                notificationType: notification.notification_type,
                title: notification.title,
                message: notification.message,
                timestamp: notification.timestamp,
                read: notification.is_read,
              }),
          );

          return {
            status: response.status,
            data: {
              message: "Liste des notifications récupérée avec succès",
              notifications,
            },
          };
        }

        return response;
      },
      "Impossible de récupérer la liste des notifications. Veuillez vérifier votre connexion et réessayer plus tard.",
      "Liste des notifications récupérée avec succès",
    );
  },

  getNewNotifications: async (lastCheckTimestamp?: string) => {
    return await withErrorHandling<Notification[]>(
      async () => {
        const url = lastCheckTimestamp
          ? `/notifications/all?since=${lastCheckTimestamp}`
          : "/notifications/all";

        //https://backend.mymidaas.com/api/notifications/all

        const response = await instance.get(url);

        if (response.status === 200) {
          const notifications = response.data.Data.map(
            (notification: any) =>
              new Notification({
                id: notification.id,
                senderId: notification.sender.id,
                recipientId: notification.recipient.id,
                notificationType: notification.notification_type,
                title: notification.title,
                message: notification.message,
                timestamp: notification.timestamp,
                read: notification.is_read,
              }),
          );

          console.log("Converted notif", notifications);

          return {
            status: response.status,
            data: notifications,
          };
        }

        return {
          status: response.status,
          data: [],
        };
      },
      "Erreur lors de la récupération des nouvelles notifications",
      "Nouvelles notifications récupérées avec succès",
    );
  },

  markAsRead: async (notificationId: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.put("/notifications/mark-as-read/", {
          notificationId,
        });

        if (response.status === 200) {
          return {
            status: response.status,
            data: {
              message:
                response.data?.message || "Notification marquée comme lue",
            },
          };
        }

        return response;
      },
      "Impossible de marquer la notification comme lue",
      "Notification marquée comme lue",
    );
  },

  markAllAsRead: async () => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.patch("/notifications/read-all/");

        if (response.status === 200) {
          return {
            status: response.status,
            data: {
              message:
                response.data?.message ||
                "Toutes les notifications ont été marquées comme lues",
            },
          };
        }

        return response;
      },
      "Impossible de marquer toutes les notifications comme lues",
      "Toutes les notifications ont été marquées comme lues",
    );
  },

  deleteNotification: async (id: string) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete(`/notifications/${id}/delete/`);

        if (response.status === 200 || response.status === 204) {
          return {
            status: response.status,
            data: {
              message: "Notification supprimée avec succès",
            },
          };
        }

        return response;
      },
      "Impossible de supprimer la notification",
      "Notification supprimée avec succès",
    );
  },

  deleteAllNotifications: async () => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const response = await instance.delete("/notifications/delete/all/");

        if (response.status === 200 || response.status === 204) {
          return {
            status: response.status,
            data: {
              message:
                "Toutes les notifications ont été supprimées avec succès",
            },
          };
        }

        return response;
      },
      "Impossible de supprimer toutes les notifications",
      "Toutes les notifications ont été supprimées avec succès",
    );
  },

  publishAnnouncementNotification: async (
    payload: CreateAnnouncementNotificationDto,
  ) => {
    return await withErrorHandling<{ message: string }>(
      async () => {
        const formData = new FormData();

        for (const [key, value] of Object.entries(payload)) {
          if (key === "attachment" && !value) continue;
          formData.append(key, value);
        }

        const response = await instance.post(
          "/properties/real-estate-entities/announcements/send/",
          formData,
        );

        if (response.status === 200 || response.status === 201) {
          return {
            status: response.status,
            data: {
              message:
                response.data?.message || "Communiqué publié avec succès",
            },
          };
        }
        if (response.status === 402) {
          return {
            status: response.status,
            data: {
              message:
                response.data?.message || "Communiqué publié avec succès",
            },
          };
        }

        return response;
      },
      "Impossible de publier le communiqué",
      "Communiqué publié avec succès",
    );
  },

  createNotification: async ({
    userId,
    type,
    title,
    message,
    data,
  }: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: Record<string, any>;
  }) => {
    return await withErrorHandling<{
      message: string;
      notification?: Notification;
    }>(
      async () => {
        const response = await instance.post("/notifications/create/", {
          recipientId: userId,
          notification_type: type,
          title,
          message,
          data,
        });

        if (response.status === 201 || response.status === 200) {
          return {
            status: response.status,
            data: {
              message:
                response.data?.message || "Notification créée avec succès",
              notification: response.data?.notification
                ? new Notification(response.data.notification)
                : undefined,
            },
          };
        }

        return response;
      },
      "Impossible de créer la notification",
      "Notification créée avec succès",
    );
  },
};
