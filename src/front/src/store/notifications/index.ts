import { create } from "zustand";
import Notification from "@/entities/notifications/notification";

type State = {
    notifications: Notification[];
    loaded: boolean;
    unreadCount: number;
    userId: string; // Added userId to track current user
};

type Actions = {
    loadData: ({
        notifications,
        userId,
    }: {
        notifications: Notification[];
        userId: string;
    }) => void;
    
    deleteNotification: (id: string) => void;
    deleteAllNotifications: () => void;
    
    addNotification: (notification: Notification) => void;
    
    markAsRead: (id: string) => void;
    
    markAllAsRead: () => void;
    
    decrementUnreadCount: () => void;
};

export const useNotificationsStore = create<State & Actions>((set, get) => {
    return {
        notifications: [],
        loaded: false,
        unreadCount: 0,
        userId: "", // Initialize userId

        // ACTIONS
        loadData({ notifications, userId }) {
            // Calculate unread count only for received unread notifications
            const unreadCount = notifications.filter(n => n.recipientId === userId && !n.read).length;
            set({ notifications, loaded: true, unreadCount, userId });
        },

        deleteNotification(id) {
            const { notifications, unreadCount, userId } = get();
            const notificationToDelete = notifications.find(n => n.id === id);

            // If we're deleting an unread received notification, decrement the counter
            const newUnreadCount = (notificationToDelete && notificationToDelete.recipientId === userId && !notificationToDelete.read)
            ? unreadCount - 1
            : unreadCount;

            set({
            notifications: notifications.filter((notification) => notification.id !== id),
            unreadCount: newUnreadCount < 0 ? 0 : newUnreadCount
            });
        },

        deleteAllNotifications() {
            set({
            notifications: [],
            unreadCount: 0
            });
        },
        
        addNotification(notification) {
            const { notifications, unreadCount, userId } = get();
            
            // Check if notification already exists to prevent duplicates
            const existingNotification = notifications.find(n => n.id === notification.id);
            if (existingNotification) {
                return; // Skip adding duplicate
            }
            
            // Only increment unread count if notification is received and unread
            const newUnreadCount = (notification.recipientId === userId && !notification.read) ? unreadCount + 1 : unreadCount;
            
            set({
                notifications: [notification, ...notifications],
                unreadCount: newUnreadCount
            });
        },
        
        markAsRead(id) {
            const { notifications, unreadCount, userId } = get();
            const updatedNotifications = notifications.map(notification => 
                notification.id === id ? { ...notification, read: true } : notification
            );
            
            // Find if the notification was previously unread and received
            const wasUnreadReceived = notifications.find(n => n.id === id && n.recipientId === userId && !n.read);
            
            set({
                notifications: updatedNotifications as Notification[],
                unreadCount: wasUnreadReceived ? unreadCount - 1 : unreadCount
            });
        },
        
        markAllAsRead() {
            const { notifications, userId } = get();
            const updatedNotifications = notifications.map(notification => 
                notification.recipientId === userId ? { ...notification, read: true } : notification
            );
            
            set({
                notifications: updatedNotifications as Notification[],
                unreadCount: 0 // Reset since all received are marked read
            });
        },
        
        decrementUnreadCount() {
            const { unreadCount } = get();
            set({ unreadCount: Math.max(0, unreadCount - 1) });
        }
    };
});