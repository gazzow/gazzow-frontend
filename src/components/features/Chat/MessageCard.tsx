"use client";

import { IMessage, MessageDeleteType } from "@/types/message";
import { formatChatTime } from "@/utils/formatChatTime";
import { EllipsisVertical, Trash, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type MessageCardProps = {
  message: IMessage;
  onDelete: (messageId: string, type: MessageDeleteType) => void;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  isMine: boolean;
  showAvatar: boolean;
};

export const MessageCard = ({
  message,
  onDelete,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
  isMine,
  showAvatar,
}: MessageCardProps) => {
  const [showDeleteOption, setShowDeleteOption] = useState<boolean>(false);

  const handleShowDeleteOptionClick = (e: React.MouseEvent) => {
    console.log("Handle show Delete options button Triggers");
    e.stopPropagation();
    onCloseMenu();
    setShowDeleteOption(true);
  };

  const handleDelete = async (e: React.MouseEvent, type: MessageDeleteType) => {
    e.stopPropagation();
    onDelete(message.id, type);
    setShowDeleteOption(false);
  };

  return (
    <div className={` flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={` flex gap-2 max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar shows only when sender changes */}
        {showAvatar ? (
          <Image
            width={36}
            height={36}
            src={message.senderImageUrl}
            alt={message.senderName}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9" onClick={() => console.log("sealing click")} />
        )}

        {/* Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 shadow-sm ${
            isMine
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-white text-black rounded-tl-sm"
          }`}
        >
          {/* Name row */}
          {showAvatar && (
            <div className={`flex text-xs font-medium mb-1 `}>
              <div
                className={`flex gap-2 w-full justify-between  ${isMine ? "" : "flex-row-reverse"}`}
              >
                <span>{message.senderName}</span>
                {message.isCreator && (
                  <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[10px]">
                    Creator
                  </span>
                )}

                <EllipsisVertical
                  size={14}
                  onClick={onOpenMenu}
                  className="cursor-pointer"
                ></EllipsisVertical>
              </div>
            </div>
          )}

          {/* Menu Options */}
          {isMenuOpen && (
            <div
              className={`absolute flex flex-col bg-teal-200 ${isMine ? "right-0 top-0" : "left-0 top-0"} rounded z-30`}
            >
              <button
                className="flex items-center gap-2 px-4 py-1 text-black  hover:bg-red-500 hover:text-white cursor-pointer"
                onClick={handleShowDeleteOptionClick}
              >
                <Trash size={12}></Trash>
                Delete
              </button>
              <button
                className="flex items-center gap-2 px-4 py-1 text-black  hover:bg-slate-500 hover:text-white cursor-pointer"
                onClick={onCloseMenu}
              >
                {" "}
                <X size={12}></X>
                Cancel
              </button>
            </div>
          )}

          {/* Show Delete Options */}
          {showDeleteOption && (
            <div className="absolute flex flex-col bg-teal-500  left-0 top-0 rounded z-30">
              {isMine && !message.isDeletedForEveryone && (
                <button
                  className="flex items-center gap-2 px-4 py-1 text-black hover:bg-blue-300 hover:text-blue-900 cursor-pointer"
                  onClick={(e) => handleDelete(e, "FOR_EVERYONE")}
                >
                  Delete for everyone
                </button>
              )}
              <button
                className="flex items-center gap-2 px-4 py-1 text-black  hover:bg-red-500 hover:text-white cursor-pointer"
                onClick={(e) => handleDelete(e, "FOR_ME")}
              >
                Delete for me
              </button>
              <button
                className="flex items-center gap-2 px-4 py-1 text-black  hover:bg-slate-500 hover:text-white cursor-pointer"
                onClick={() => setShowDeleteOption(false)}
              >
                {" "}
                <X size={12}></X>
                Cancel
              </button>
            </div>
          )}
          <div className={`flex gap-2 ${isMine ? "" : "flex-row-reverse"}`}>
            {message.isDeletedForEveryone ? (
              <p className="flex-1 text-sm leading-relaxed break-words italic">
                {isMine
                  ? "You deleted this message"
                  : "This message was deleted"}
              </p>
            ) : (
              <p className="flex-1 text-sm leading-relaxed break-words max-w-2xl">
                {message.content}
              </p>
            )}
            {!showAvatar && (
              <EllipsisVertical
                size={14}
                onClick={onOpenMenu}
                className="cursor-pointer mt-1"
              ></EllipsisVertical>
            )}
          </div>

          <div className="flex justify-between mt-1 gap-6">
            {message.isEdited && !message.isDeletedForEveryone && (
              <span className="text-teal-400 text-xs font-medium">Edited</span>
            )}
            <span className="text-xs opacity-60">
              {formatChatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
