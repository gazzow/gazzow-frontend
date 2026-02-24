"use client";

import { NotificationToast } from "@/components/ui/NotificationToast";
import { useAppSelector } from "@/store/store";
import {
  ProjectNotificationPayload,
  SOCKET_EVENTS,
} from "@/types/socket-event";
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
  const { id } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id === null) return;

    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    const onConnect = () => {
      console.log(`Socket connected 🚀 [id: ${socket.id}]`);
      setConnected(true);
      socket.emit(SOCKET_EVENTS.USER_ONLINE, { id });
    };

    const onDisconnect = () => setConnected(false);

    socket.on(SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);

    return () => {
      socket.off(SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
    };
  }, [id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const teamHandler = (data: ProjectNotificationPayload) => {
      toast(<NotificationToast {...data} />);
    };

    const projectHandler = (data: ProjectNotificationPayload) => {
      toast(<NotificationToast {...data} />);
    };

    socket.on(SOCKET_EVENTS.TEAM_MESSAGE_NOTIFICATION, teamHandler);
    socket.on(SOCKET_EVENTS.PROJECT_MESSAGE, projectHandler);

    return () => {
      socket.off(SOCKET_EVENTS.TEAM_MESSAGE_NOTIFICATION, teamHandler);
      socket.off(SOCKET_EVENTS.PROJECT_MESSAGE, projectHandler);
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
