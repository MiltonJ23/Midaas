export type CreateAnnouncementNotificationDto = {
	target: "all_tenants" | "tenants" | "building";
	properties_id?: string;
	notification_channel: "email" | "push_notification";
	notification_title: string;
	notification_message: string;
	attachment?: File;
};