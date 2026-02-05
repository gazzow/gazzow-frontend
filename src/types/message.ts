export interface IMessage {
  id: string;
  projectId: string;
  senderId: string;
  senderName: string;
  senderImageUrl: string;
  isCreator: boolean;
  content: string;
  deletedFor: string[];
  isDeletedForEveryone: boolean;
  deletedAt: Date;
  isEdited: boolean;
  editedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageDeleteType = "FOR_ME" | "FOR_EVERYONE";

export type DeletedMessageSocketPayload= {
  messageId: string;
  userId: string;
  type: MessageDeleteType;
};
