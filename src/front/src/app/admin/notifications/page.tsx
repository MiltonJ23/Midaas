"use client";

import NotificationCard from "@/components/molecules/notification-card";
import Notification from "@/entities/notifications/notification";
import useNotifications from "@/hooks/useNotifications";
import { useNotificationsStore } from "@/store/notifications";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { twMerge } from "tailwind-merge";
import { useState, useMemo } from "react";
import { useAuthStore } from "@/store/auth";
import { useModalStore } from "@/store/modal";
import { notificationProvider } from "@/api/notifications";

export default function NotificationPage() {
  useNotifications();
  const { notifications, deleteAllNotifications } = useNotificationsStore();
  const { user } = useAuthStore();
  const { toggle } = useModalStore();

  const [viewMode, setViewMode] = useState("received"); // "received" or "sent"
  const [search, setSearch] = useState("");

  // Check if user is an owner (adjust based on your user object)
  const isOwner = user?.profileType === "owner";

  const sortNotifications = (notifications: Notification[]) => {
    return notifications?.sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  // Filter notifications based on view mode and search
  const filteredNotifications = useMemo(() => {
    let filtered = notifications;

    if (viewMode === "sent") {
      filtered = filtered.filter((n) => n.senderId === user?.id && !n.read);
    } else {
      filtered = filtered.filter((n) => n.recipientId === user?.id && !n.read);
    }

    if (search) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.message.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return sortNotifications(filtered);
  }, [notifications, search, viewMode, user]);

  console.log("Rendering notifications", notifications);

  const renderEmptyState = () => (
    <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-slate-50 rounded-lg border border-slate-200">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-gray-400 mb-4"
      >
        <path
          d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h3 className="text-lg text-slate-700 font-medium mb-1">
        Aucune notification pour le moment!
      </h3>
      <p className="text-sm text-slate-500 text-center mb-4">
        Les notifications apparaîtront ici une fois envoyées ou reçues.
      </p>
      <button
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        onClick={() => window.location.reload()}
      >
        Actualiser
      </button>
    </div>
  );

  return (
    <section className="mt-4">
      <h2 className="py-4 font-bold font-lg">Notifications</h2>

      {/* Tabs for Sent/Received and Delete All
      <div className="flex items-center gap-4 mb-4">
        <Button
          className={twMerge(
            "w-auto h-10 rounded-lg",
            viewMode === "received"
              ? "bg-primary"
              : "text-primary bg-primary/10 hover:bg-primary/5",
          )}
          onClick={() => setViewMode("received")}
        >
          Reçu
        </Button>
        <Button
          className={twMerge(
            "w-auto h-10 rounded-lg",
            viewMode === "sent"
              ? "bg-primary"
              : "text-primary bg-primary/10 hover:bg-primary/5",
          )}
          onClick={() => setViewMode("sent")}
        >
          Envoyé
        </Button>
        <Button
          className="w-auto h-10 rounded-lg bg-[#FF3B30] text-white hover:bg-[#FF3B30]/80 ml-auto"
          onClick={() =>
            toggle({
              name: ModalNames.CONFIRM_ACTION,
              data: {
                title: "Supprimer toutes les notifications",
                description:
                  "Êtes-vous sûr de vouloir supprimer toutes les notifications affichées ? Cette action est irréversible.",
                itemName: "toutes les notifications",
                onConfirm: async () => {
                  try {
                    notificationProvider.deleteAllNotifications();
                    await deleteAllNotifications();
                  } catch (e) {}
                },
              },
            })
          }
          disabled={filteredNotifications.length === 0}
        >
          Supprimer tout
        </Button>
      </div> */}

      {/* Search Bar */}
      <div className="flex items-center justify-end gap-4 mb-4">
        <div className="relative flex items-center">
          <Input
            className="h-10 bg-background pl-10"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-gray-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Notifications Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotifications.length === 0
          ? renderEmptyState()
          : filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} data={notification} />
            ))}
      </section>
    </section>
  );
}
