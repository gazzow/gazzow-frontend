import { NOTIFICATION_API } from "@/constants/apis/notification-api";
import api from "@/lib/axios/api";

export const notificationService = {
  async listNotifications() {
    const res = await api.get(NOTIFICATION_API.LIST_NOTIFICATIONS);
    console.log("list notification response: ", res);
    return res.data;
  },
  async markAsRead(notificationId: string) {
    const res = await api.patch(NOTIFICATION_API.MARK_AS_READ(notificationId));
    console.log("Mark As Read response: ", res);
    return res.data;
  },
  async deleteToken() {
    const res = await api.post(NOTIFICATION_API.DELETE_TOKEN, {
      deviceType: "web",
    });
    console.log("Mark As Read response: ", res);
    return res.data;
  },
};
