export const projectTabPermissions: Record<string, string[]> = {
  viewer: ["Overview"],
  contributor: ["Overview", "Tasks", "Team Chat", "Meetings", "Payments"],
  creator: [
    "Overview",
    "Applications",
    "Tasks",
    "Team Chat",
    "Meetings",
    "Payments",
  ],
};
