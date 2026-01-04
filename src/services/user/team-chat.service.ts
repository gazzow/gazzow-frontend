import { TEAM_CHAT_API } from "@/constants/apis/team-chat";
import api from "@/lib/axios/api";

export const teamChatService = {
  async listMessages(projectId: string) {
    const res = await api.get(TEAM_CHAT_API.LIST_TEAM_CHAT(projectId));
    console.log("List team chats response: ", res);
    return res.data;
  },
};
