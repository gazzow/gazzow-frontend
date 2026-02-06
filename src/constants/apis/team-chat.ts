export const TEAM_CHAT_API = {
    LIST_TEAM_CHAT: (projectId: string) => `/team-chat/${projectId}`,
    DELETE_MESSAGE: (messageId: string) => `/team-chat/${messageId}/delete`
}