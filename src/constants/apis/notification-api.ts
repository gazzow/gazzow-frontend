export const NOTIFICATION_API = {
  LIST_NOTIFICATIONS: "/notifications",
  DELETE_TOKEN: "/notifications/delete-token",
  MARK_AS_READ: (notificationId: string) => `/notifications/${notificationId}`,
};
