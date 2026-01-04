// lib/firebase.config.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;

// Only initialize messaging on client side
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app, messaging };

// Request permission and get FCM token
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  console.log("requesting permission");
  try {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      // console.log("This browser does not support notifications");
      return null;
    }

    // Check if permission is already granted
    if (Notification.permission === "granted") {
      // console.log("permission already granted");
      const token = await getFCMToken();
      // console.log("Fetched token: ", token);
      return token;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // console.log("Notification permission granted");
      const token = await getFCMToken();
      // console.log("Fetched token: ", token);
      return token;
    } else {
      // console.log("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined") return null;

    if (!("serviceWorker" in navigator)) {
      console.error("Service workers are not supported");
      return null;
    }

    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      // console.log("Service Worker registered:", registration);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;

      // console.log("Service Worker is ready");

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  };

// Get FCM token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.error("Messaging not initialized");
      return null;
    }

    // Register and wait for service worker
    const swRegistration = await registerServiceWorker();

    if (!swRegistration) {
      console.error("Service worker registration failed");
      return null;
    }

    // Additional check: ensure service worker is active
    if (!swRegistration.active) {
      // console.log("Waiting for service worker to activate...");
      await new Promise((resolve) => {
        if (swRegistration.installing) {
          swRegistration.installing.addEventListener("statechange", (e) => {
            if ((e.target as ServiceWorker).state === "activated") {
              resolve(true);
            }
          });
        } else if (swRegistration.waiting) {
          swRegistration.waiting.addEventListener("statechange", (e) => {
            if ((e.target as ServiceWorker).state === "activated") {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      });
    }

    //  console.log("Service Worker is active, getting token...");


    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      // console.log("FCM Token:", token);
      return token;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      // console.error("Messaging not initialized");
      return;
    }

    onMessage(messaging, (payload) => {
      // console.log(
      //   "Message received in foreground [onMessageListener]:",
      //   payload
      // );
      resolve(payload);
    });
  });
