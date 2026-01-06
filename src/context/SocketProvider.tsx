"use client";

import { NotificationToast } from "@/components/ui/NotificationToast";
import { useAppSelector } from "@/store/store";
import { SOCKET_EVENTS } from "@/types/socket-event";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const userId = useAppSelector((state) => state.user.id);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("Socket connected 🚀", socket.id);
      setConnected(true);
    });

    socket.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

    // Notification
    socket.on(SOCKET_EVENTS.TEAM_MESSAGE_NOTIFICATION, (data) => {
      console.log("team notification data: ", data);
      toast(<NotificationToast {...data} />);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => setConnected(false));

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.USER_ONLINE);
      socket.off(SOCKET_EVENTS.TEAM_MESSAGE_NOTIFICATION);
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
