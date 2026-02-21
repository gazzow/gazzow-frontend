"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useSocket } from "@/providers/SocketProvider";
import { SOCKET_EVENTS } from "@/types/socket-event";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "@/services/user/notification.service";
import { handleApiError } from "@/utils/handleApiError";

export function NotificationBellIcon() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const socket = useSocket();
  const hasFetchedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENTS.NOTIFICATION_COUNT, (data) => {
      setNotificationCount(data.count);
    });

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_COUNT);
    };
  }, [socket]);

  const fetchUnReadCount = useCallback(async () => {
    if (hasFetchedRef.current) return;
    try {
      const res = await notificationService.fetchUnreadCount();
      if (res.success) {
        setNotificationCount(res.data.count);
        hasFetchedRef.current = true;
      }
    } catch (error) {
      handleApiError(error);
    }
  }, []);

  useEffect(() => {
    fetchUnReadCount();
  }, [fetchUnReadCount]);

  const onNotificationClick = () => {
    router.push(USER_ROUTES.NOTIFICATIONS);
  };
  return (
    <button
      onClick={onNotificationClick}
      className="
    relative p-2 rounded-xl cursor-pointer
    transition-all duration-200 ease-in-out

    bg-slate-100 hover:bg-slate-200
    dark:bg-slate-800 dark:hover:bg-slate-700

    text-slate-700 dark:text-slate-200
    shadow-sm hover:shadow-md
  "
    >
      <Bell className="w-5 h-5 md:w-[22px] md:h-[22px]" />

      {notificationCount > 0 && (
        <span
          className="
        absolute -top-1 -right-1
        min-w-[18px] h-[18px]
        px-1.5 flex items-center justify-center
        text-[10px] font-semibold
        text-white
        bg-red-500
        rounded-full
        ring-2 ring-white dark:ring-slate-900
      "
        >
          {notificationCount}
        </span>
      )}
    </button>
  );
}
