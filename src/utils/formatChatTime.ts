export function formatChatTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  // Today → show time
  if (isSameDay(date, now)) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Yesterday
  if (isSameDay(date, yesterday)) {
    return `Yesterday ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Last 7 days → show weekday
  if (date > oneWeekAgo) {
    return date.toLocaleDateString([], { weekday: "long" });
  }

  // Older → show full date
  return date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
