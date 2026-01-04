import api from "@/lib/axios/api";

export const teamChatService = {
  async listMessages(projectId: string) {
    const res = await api.get(`/team-chat/${projectId}`);
    console.log("List team chats response: ", res);
    return res.data;
  },
};
