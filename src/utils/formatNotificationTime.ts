export function formatNotificationTime(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const now = new Date();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Today → show time
  if (isSameDay(date, now)) {
    return formatTime(date);
  }

  // Yesterday
  if (isSameDay(date, yesterday)) {
    return `Yesterday ${formatTime(date)}`;
  }

  // Older → show full date (NO comma version)
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find(p => p.type === type)?.value || "";

  return `${get("month")} ${get("day")} ${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}