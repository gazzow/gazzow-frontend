"use client";

import { useSocket } from "@/context/SocketProvider";
import { notificationService } from "@/services/user/notification.service";
import { useAppSelector } from "@/store/store";
import { INotification } from "@/types/notification";
import { SOCKET_EVENTS } from "@/types/socket-event";
import axios from "axios";
import { Check, CheckCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function NotificationPage() {
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const hasFetched = useRef(false);
  const socket = useSocket();
  const id = useAppSelector((state) => state.user.id);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationService.listNotifications();
      console.log("notification data: ", res.data);
      if (res.success) {
        setNotifications(res.data);
        // toast.success(res.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("lists notifications error: ", error);
      }
    }
  }, []);

  const onMarkAsRead = async (notificationId: string) => {
    try {
      const res = await notificationService.markAsRead(notificationId);
      console.log("mark as read data: ", res.data);
      if (res.success) {
        toast.success(res.message);
        socket?.emit(SOCKET_EVENTS.UPDATE_NOTIFICATION_COUNT, { userId: id });
        fetchNotifications();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Mark as read notification error: ", error);
      }
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (tab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [tab, notifications]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-sm text-gray-400">
            Stay updated with your projects and activities
          </p>
        </div>

        {unreadCount && unreadCount > 0 && (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-btn-primary text-white"
          >
            <CheckCheck size={16} />
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-neutral-800 mb-6">
        {["all", "unread"].map((key) => (
          <button
            key={key}
            onClick={() => {}}
            className={`
              pb-3 text-sm capitalize
              ${
                tab === key
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-white"
              }
             `}
          >
            {key}
            {key === "unread" &&
              unreadCount &&
              unreadCount > 0 &&
              ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered && filtered.length === 0 && (
          <p className="text-center text-gray-500 py-12">No notifications</p>
        )}

        {filtered &&
          filtered.map((n) => (
            <div
              key={n.id}
              className={` 
              flex justify-between items-start p-4 rounded-xl border"
              ${
                n.isRead
                  ? "bg-secondary/20 border-neutral-800"
                  : "bg-secondary/60 border-purple-500/40"
              }
              `}
            >
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-purple-500 opacity-80" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {n.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{n.body}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => onMarkAsRead(n.id)}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 cursor-hover"
                >
                  <Check size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
