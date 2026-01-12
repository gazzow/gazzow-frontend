"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useSocket } from "@/context/SocketProvider";
import api from "@/lib/axios/api";
import { SOCKET_EVENTS } from "@/types/socket-event";
import axios from "axios";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export function NotificationBellIcon() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const socket = useSocket();

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
    try {
      const res = await api.get("/notifications/unread-count");
      if (res.data.success) {
        setNotificationCount(res.data.data.count);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch unread notification count"
        );
      }
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
      className="relative p-2 bg-secondary/70 rounded-xl cursor-pointer hover:bg-secondary transition ease-in-out duration-200 text-text-secondary "
    >
      <Bell size={24} />
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
