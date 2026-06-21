import Notification from "@/entities/notifications/notification";
import { Badge } from "../atoms/badge";
import { displayRelativeDate } from "@/lib/format";
import { notificationProvider } from "@/api/notifications";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNotificationsStore } from "@/store/notifications";
import { useModalStore } from "@/store/modal"; // Import for modal
import { ModalNames } from "@/store/modal"; // Assuming ModalNames includes 'CONFIRM_DELETE'
import { useAuthStore } from "@/store/auth"; // Add this to get user ID

type Props = {
  data: Notification;
};

export default function NotificationCard({ data }: Props) {
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useAuthStore(); // Get current user
  const { markAsRead, deleteNotification } = useNotificationsStore();
  const { toggle } = useModalStore();

  const handleMarkAsRead = async () => {
    if (data.read) return; // Already read

    setIsMarkingRead(true);
    try {
      const { data: responseData } = await notificationProvider.markAsRead(
        data.id,
      );
      if (responseData) {
        toast.success("Notification marquée comme lue");
        markAsRead(data.id); // Update store
      } else {
        toast.error("Impossible de marquer la notification comme lue");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsMarkingRead(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const { data: responseData } =
        await notificationProvider.deleteNotification(data.id);
      if (responseData) {
        toast.success(responseData.message);
        deleteNotification(data.id); // Update store
      } else {
        toast.error("Impossible de supprimer la notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = () => {
    toggle({
      name: ModalNames.CONFIRM_ACTION,
      data: {
        title: "Supprimer la notification",
        description: `Êtes-vous sûr de vouloir supprimer cette notification ? Cette action est irréversible.`,
        itemName: "cette notification",
        onConfirm: handleDeleteConfirm,
        isLoading: isDeleting,
      },
    });
  };

  // Check if the user is the recipient (for mark as read)
  const isRecipient = user && data.recipientId === user.id;

  return (
    <article
      className={`w-full rounded-md p-4 bg-background ${
        !data.read ? "border-l-4 border-blue-500" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-primary"
            >
              <path d="M12.0001 2.3999C8.02368 2.3999 4.80013 5.62345 4.80013 9.5999V13.9028L3.9516 14.7514C3.60841 15.0946 3.50574 15.6107 3.69148 16.0591C3.87721 16.5075 4.31478 16.7999 4.80013 16.7999H19.2001C19.6855 16.7999 20.1231 16.5075 20.3088 16.0591C20.4945 15.6107 20.3919 15.0946 20.0487 14.7514L19.2001 13.9028V9.5999C19.2001 5.62345 15.9766 2.3999 12.0001 2.3999Z" />
              <path d="M12.0001 21.5999C10.0119 21.5999 8.4001 19.9881 8.4001 17.9999H15.6001C15.6001 19.9881 13.9883 21.5999 12.0001 21.5999Z" />
            </svg>
            {!data.read && isRecipient && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span> // Unread indicator only for received
            )}
          </div>

          <span className="text-lg text-primary font-bold">
            {data.notificationType}
          </span>
        </div>

        <span className="text-[12px] text-black/60">
          {displayRelativeDate(data.timestamp)}
        </span>
      </div>

      <div>
        <p className="text-[14px] mt-4">{data.message}</p>

        <div className="mt-4 w-full flex items-center justify-end gap-2">
          {isRecipient && !data.read && (
            <Badge
              onClick={isMarkingRead ? undefined : handleMarkAsRead}
              className={`cursor-pointer bg-blue-500 hover:bg-blue-600${
                isMarkingRead ? " opacity-50 pointer-events-none" : ""
              }`}
            >
              {isMarkingRead ? "Marquage..." : "MARQUER COMME LU"}
            </Badge>
          )}
          <Badge
            onClick={openDeleteModal}
            className="cursor-pointer bg-[#FF3B30] hover:bg-[#FF3B30]/80"
          >
            SUPPRIMER
          </Badge>
        </div>
      </div>
    </article>
  );
}
