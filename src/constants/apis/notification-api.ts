
export const NOTIFICATION_API = {
  LIST_NOTIFICATIONS: "/notifications",
  MARK_AS_READ: (notificationId: string) => `/notifications/${notificationId}`,
};
