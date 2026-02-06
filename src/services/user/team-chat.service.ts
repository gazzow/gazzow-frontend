import { TEAM_CHAT_API } from "@/constants/apis/team-chat";
import api from "@/lib/axios/api";
import { MessageDeleteType } from "@/types/message";

export const teamChatService = {
  async listMessages(projectId: string) {
    const res = await api.get(TEAM_CHAT_API.LIST_TEAM_CHAT(projectId));
    console.log("List team chats response: ", res);
    return res.data;
  },
  async deleteMessage(messageId: string, type: MessageDeleteType) {
    const res = await api.patch(TEAM_CHAT_API.DELETE_MESSAGE(messageId), {
      type,
    });
    console.log("Delete Message response: ", res);
    return res.data;
  },
};
