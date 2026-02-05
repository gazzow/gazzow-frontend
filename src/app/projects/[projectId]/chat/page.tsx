"use client";

import { SectionTabs } from "@/components/features/SectionTabs";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useSocket } from "@/providers/SocketProvider";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import { useAppSelector } from "@/store/store";
import { IProject } from "@/types/project";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { teamChatService } from "@/services/user/team-chat.service";
import { SOCKET_EVENTS } from "@/types/socket-event";
import { MessageCard } from "@/components/features/Chat/MessageCard";
import { HttpStatusCode } from "@/constants/status-codes";
import {
  DeletedMessageSocketPayload,
  IMessage,
  MessageDeleteType,
} from "@/types/message";

const tabRoutes = [
  { name: "Overview", path: "" },
  { name: "Applications", path: "/applications" },
  { name: "Contributors", path: "/contributors" },
  { name: "Tasks", path: "/tasks" },
  { name: "Team Chat", path: "/chat" },
  // { name: "Payments", path: "/payments" },
];

export default function ProjectChat() {
  const [project, setProject] = useState<IProject | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>("");
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(
    null,
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { projectId } = useParams<{ projectId: string }>();
  const userId = useAppSelector((state) => state.user.id)!;

  const router = useRouter();
  const currentRole = useRole(project);

  const socket = useSocket();

  const visibleTabs = useMemo(() => {
    if (!projectId) return [];
    return tabRoutes
      .filter((tab) => projectTabPermissions[currentRole].includes(tab.name))
      .map((tab) => ({
        name: tab.name,
        href: `/projects/${projectId}${tab.path}`,
      }));
  }, [projectId, currentRole]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        console.log("projectId: ", projectId);

        const res = await projectService.getProject(projectId);
        if (res.success) {
          console.log("res data: ", res.data);
          setProject(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchProject();
  }, [projectId]);

  const onBackClick = () => {
    router.replace(PROJECT_ROUTES.MY_PROJECTS);
  };

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  const fetchTeamMessages = useCallback(async () => {
    console.log("fetching team messages");
    try {
      const res = await teamChatService.listMessages(projectId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [projectId]);

  useEffect(() => {
    fetchTeamMessages();
  }, [fetchTeamMessages]);

  const loadMoreMessages = () => {};

  useEffect(() => {
    if (!socket) return;

    socket.emit(SOCKET_EVENTS.JOIN_PROJECT, { projectId });
    console.log("team chat joined✅");

    socket.on(SOCKET_EVENTS.TEAM_MESSAGE, (msg) => {
      console.log("New message from team chat to be updated");
      setMessages((prev) => [...prev, msg]);
    });

    socket.on(
      SOCKET_EVENTS.TEAM_MESSAGE_DELETED,
      (data: DeletedMessageSocketPayload) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== data.messageId) return m;
           
            if (data.type === "FOR_EVERYONE" && userId !== m.senderId) {

              return {
                ...m,
                isDeletedForEveryone: true,
              };
            }
            return m;
          }),
        );
      },
    );

    return () => {
      socket.off(SOCKET_EVENTS.JOIN_PROJECT);
      socket.off(SOCKET_EVENTS.TEAM_MESSAGE);
    };
  }, [socket, projectId, userId]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      userId,
      projectId,
      content: text,
    });

    setText("");
  };

  const handleDelete = async (messageId: string, type: MessageDeleteType) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;

        if (type === "FOR_EVERYONE" && userId && userId === m.senderId) {

          return {
            ...m,
            isDeletedForEveryone: true,
          };
        } else if (type === "FOR_EVERYONE" && userId && userId !== m.senderId) {
          return m;
        }

        return {
          ...m,
          deletedFor: m.deletedFor.includes(userId)
            ? m.deletedFor
            : [...m.deletedFor, userId],
        };
      }),
    );

    try {
      const res = await teamChatService.deleteMessage(messageId, type);
      toast.success(res.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.CONFLICT) {
          toast.info(
            error.response?.data.message ||
              "Having some issues. Please try later",
          );
          return;
        }
        toast.error(
          error.response?.data.message ||
            "Internal Server Error. Please try again",
        );
      }
    }
  };

  if (!projectId) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl w-full shadow-lg space-y-6 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full">
          <button onClick={onBackClick} className="cursor-pointer">
            <ArrowLeft />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold ">
              {project?.title}
            </h1>
            {project?.createdAt && (
              <p className="text-sm text-gray-400">
                Posted {new Date(project?.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SectionTabs tabs={visibleTabs} />

      {/* Team Chat */}
      <section className="flex flex-col flex-1 min-h-[450px] border border-border-primary rounded-xl bg-secondary/30 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-primary flex items-center justify-between">
          <h2 className="font-semibold text-lg">Team Chat</h2>
          <span className="text-xs text-muted-foreground">
            {messages.length} messages
          </span>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-border-primary/50"
        >
          {/* Load more */}
          {messages.length > 15 && (
            <div className="flex justify-center">
              <button
                onClick={loadMoreMessages}
                className="text-xs text-muted-foreground hover:text-white border border-border-primary px-3 py-1 rounded-full"
              >
                Load older messages
              </button>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMine = msg.senderId === userId;
            const prev = messages[i - 1];
            const showAvatar =
              !prev ||
              prev.senderId !== msg.senderId ||
              prev.deletedFor.includes(userId);

            // Render nothing when message is deleted for user
            if (msg.deletedFor.includes(userId)) return null;

            return (
              <MessageCard
                isMine={isMine}
                showAvatar={showAvatar}
                isMenuOpen={activeMenuMessageId === msg.id}
                onOpenMenu={() => setActiveMenuMessageId(msg.id)}
                onCloseMenu={() => setActiveMenuMessageId(null)}
                message={msg}
                key={i}
                onDelete={handleDelete}
              ></MessageCard>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border-primary flex gap-2 bg-secondary/40">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 bg-background border border-border-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-btn-primary text-white px-5 rounded-lg hover:bg-btn-primary-hover disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
