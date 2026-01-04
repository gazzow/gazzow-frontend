import { useEffect, useRef, useState } from "react";
import { MessagePayload, onMessage } from "firebase/messaging";
import {
  messaging,
  requestNotificationPermission,
} from "@/lib/notification/firebase.config";
import { NotificationPermissionStatus } from "@/types/fcm.types";

interface NotificationData {
  [key: string]: string;
}

interface NotificationContent {
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
}

interface ForegroundMessagePayload extends MessagePayload {
  notification?: NotificationContent;
  data?: NotificationData;
}

interface UseNotificationReturn {
  notification: ForegroundMessagePayload | null;
  fcmToken: string | null;
  isLoading: boolean;
  permissionStatus: NotificationPermissionStatus;
  requestPermission: () => Promise<string | null>;
  clearNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] =
    useState<ForegroundMessagePayload | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>("default");

  // Prevent multiple listener registrations
  const listenerRegistered = useRef(false);

  // Check initial permission status
  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(
        Notification.permission as NotificationPermissionStatus
      );
    }
  }, []);

  // Request notification permission and get token
  const requestPermission = async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setFcmToken(token);
        setPermissionStatus("granted");
        console.log("storing token in local storage");
        // localStorage.setItem("fcmToken", token);
        return token;
      }
      setPermissionStatus("denied");
      return null;
    } catch (error) {
      console.error("Error requesting permission:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for foreground messages - SINGLE LISTENER ONLY

  useEffect(() => {
    if (!messaging) {
      console.log("Messaging not initialized");
      return;
    }

    // Prevent multiple registrations
    if (listenerRegistered.current) {
      console.log("Listener already registered, skipping");
      return;
    }

    console.log("Setting up foreground message listener...");
    listenerRegistered.current = true;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔔 Foreground message received:", payload);

      // Update state to trigger NotificationProvider
      setNotification(payload);

      // Show browser notification
      if (Notification.permission === "granted") {
        const notificationTitle =
          payload.notification?.title || payload.data?.title || "New Message";

        const notificationBody =
          payload.notification?.body || payload.data?.body || "";

        const notificationOptions: NotificationOptions = {
          body: notificationBody,
          image: payload.notification?.image,
          data: payload.data,
          tag: payload.data?.tag || "default-notification",
          requireInteraction: false,
        };

        const browserNotification = new Notification(
          notificationTitle,
          notificationOptions
        );

        browserNotification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          browserNotification.close();

          if (payload.data?.url) {
            window.location.href = payload.data.url;
          }
        };
      }
    });

    return () => {
      console.log("Cleaning up message listener");
      listenerRegistered.current = false;
      unsubscribe();
    };
  }, []); // Empty dependency array - runs only once

  // Load token from localStorage on mount

  useEffect(() => {
    const savedToken = localStorage.getItem("fcmToken");
    if (savedToken) {
      setFcmToken(savedToken);
    }
  }, []);

  // Clear notification
  const clearNotification = (): void => {
    setNotification(null);
  };

  return {
    notification,
    fcmToken,
    isLoading,
    permissionStatus,
    requestPermission,
    clearNotification,
  };
};
