"use client";

import { useNotification } from "@/hook/useNotification";
import { useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { notification, requestPermission } = useNotification();
  const user = useAppSelector((state) => state.user);

  // Request Permission
  useEffect(() => {
    if (user.id === null) return;
    console.log("requesting permission auth user: ", user.id);
    requestPermission();
  }, [requestPermission, user]);

  // Global notification handler
  useEffect(() => {
    if (!notification) return;

    // console.log("=== NOTIFICATION RECEIVED IN PROVIDER ===");
    // console.log("Full payload:", JSON.stringify(notification, null, 2));
    // console.log("===========================================");

    // console.log("Global notification received:", notification);

    const title = notification.notification?.title || notification.data?.title;
    const body = notification.notification?.body || notification.data?.body;

    if (!title && !body) {
      console.warn("No title or body found in notification");
      return;
    }

    // Show toast notification globally
    toast(
      <div className="flex flex-col gap-1">
        {title && <div className="font-semibold">{title}</div>}
        {body && <div className="text-sm">{body}</div>}
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    );

    // if (Notification.permission === "granted" ) {
    //   const browserNotification = new Notification(title || "New Message", {
    //     body: body || "",
    //     // icon: "/firebase-logo.png",
    //     data: notification.data,
    //   });

    //   browserNotification.onclick = () => {
    //     window.focus();
    //     browserNotification.close();
    //   };
    // }
  }, [notification]);

  return <>{children}</>;
}
