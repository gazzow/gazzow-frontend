import { NOTIFICATION_API } from "@/constants/apis/notification-api";
import api from "@/lib/axios/api";

export const notificationService = {
  async listNotifications() {
    const res = await api.get(NOTIFICATION_API.LIST_NOTIFICATIONS);
    console.log("list notification response: ", res);
    return res.data;
  },
  async fetchUnreadCount() {
    const res = await api.get(NOTIFICATION_API.UNREAD_COUNT);
    console.log("Fetch unread count response: ", res);
    return res.data;
  },
  async markAsRead(notificationId: string) {
    const res = await api.patch(NOTIFICATION_API.MARK_AS_READ(notificationId));
    console.log("Mark As Read response: ", res);
    return res.data;
  },
  async markAllAsRead() {
    const res = await api.patch(NOTIFICATION_API.MARK_ALL_AS_READ);
    console.log("Mark ALL As Read response: ", res);
    return res.data;
  },
};
