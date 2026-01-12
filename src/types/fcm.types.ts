// types/fcm.types.ts
// Centralized TypeScript types for Firebase Cloud Messaging

import { MessagePayload } from 'firebase/messaging';

/**
 * Notification data - custom key-value pairs sent with notification
 */
export interface NotificationData {
  [key: string]: string;
}

/**
 * Notification content structure
 */
export interface NotificationContent {
  title?: string;
  body?: string;
  image?: string;
  icon?: string;
}

/**
 * Complete message payload received from FCM
 * Note: We don't extend MessagePayload to avoid type conflicts with optional fields
 */
export interface ForegroundMessagePayload {
  notification?: NotificationContent;
  data?: NotificationData;
  from: string;
  collapseKey?: string;
  messageId?: string;
  fcmMessageId?: string;
}

/**
 * FCM Token information
 */
export interface FCMToken {
  token: string;
  userId: string;
  deviceType: 'web' | 'ios' | 'android';
  createdAt: Date;
  isActive: boolean;
}

/**
 * Notification permission status
 */
export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

/**
 * Service Worker registration state
 */
export type ServiceWorkerState = 'installing' | 'installed' | 'activating' | 'activated' | 'redundant';

/**
 * Browser notification options (extends native NotificationOptions)
 */
export interface CustomNotificationOptions extends NotificationOptions {
  data?: NotificationData;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Hook return type for useNotification
 */
export interface UseNotificationReturn {
  notification: ForegroundMessagePayload | null;
  fcmToken: string | null;
  isLoading: boolean;
  permissionStatus: NotificationPermissionStatus;
  requestPermission: () => Promise<string | null>;
  clearNotification: () => void;
}

/**
 * API request to save FCM token
 */
export interface SaveTokenRequest {
  fcmToken: string;
  userId: string;
  deviceType: 'web' | 'ios' | 'android';
}

/**
 * API response for token operations
 */
export interface TokenApiResponse {
  success: boolean;
  message: string;
  data?: FCMToken;
  error?: string;
}

/**
 * Send notification request
 */
export interface SendNotificationRequest {
  userId?: string;
  userIds?: string[];
  fcmTokens?: string[];
  topic?: string;
  notification: {
    title: string;
    body: string;
    imageUrl?: string;
    url?: string;
    data?: NotificationData;
  };
  priority?: 'high' | 'normal';
}

/**
 * Send notification response
 */
export interface SendNotificationResponse {
  success: boolean;
  message: string;
  successCount?: number;
  failureCount?: number;
  messageId?: string;
  error?: string;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  userId: string;
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  notificationCategories: {
    messages: boolean;
    updates: boolean;
    promotions: boolean;
    reminders: boolean;
  };
}

/**
 * Preferences API response
 */
export interface PreferencesApiResponse {
  success: boolean;
  message?: string;
  data?: NotificationPreferences;
  error?: string;
}

/**
 * Error types for FCM operations
 */
export enum FCMErrorCode {
  PERMISSION_DENIED = 'permission-denied',
  TOKEN_RETRIEVAL_FAILED = 'token-retrieval-failed',
  SERVICE_WORKER_FAILED = 'service-worker-failed',
  MESSAGING_NOT_SUPPORTED = 'messaging-not-supported',
  VAPID_KEY_MISSING = 'vapid-key-missing',
  NETWORK_ERROR = 'network-error',
  UNKNOWN_ERROR = 'unknown-error',
}

/**
 * Custom FCM Error
 */
export class FCMError extends Error {
  code: FCMErrorCode;
  
  constructor(code: FCMErrorCode, message: string) {
    super(message);
    this.name = 'FCMError';
    this.code = code;
  }
}

/**
 * Service Worker Message Event data
 */
export interface ServiceWorkerMessageData {
  type: 'NOTIFICATION_RECEIVED' | 'TOKEN_REFRESHED' | 'ERROR';
  payload?: ForegroundMessagePayload;
  token?: string;
  error?: string;
}