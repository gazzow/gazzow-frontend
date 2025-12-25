// services/notificationService.ts
import type { SaveTokenRequest, TokenApiResponse } from "@/types/fcm.types";
import api from "@/lib/axios/api";

interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}

class NotificationService {
  /**
   * Save FCM token to backend
   */
  async saveFCMToken(
    token: string,
    userId: string,
    deviceType: "web" | "ios" | "android" = "web"
  ) {
    try {
      const requestData: SaveTokenRequest = {
        fcmToken: token,
        userId: userId,
        deviceType: deviceType,
      };

      const response = await api.post(
        `/notifications/register-token`,
        requestData
      );

      return response.data;
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
