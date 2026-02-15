"use client";

import { StripeConnectionStatus } from "@/types/stripe";

type StatusBadgeProps = {
  status: StripeConnectionStatus;
  text: string;
};

export function StatusBadge({ status, text}: StatusBadgeProps) {
  const styles = {
    connected: {
      dot: "bg-green-500",
      text: "text-green-700 dark:text-green-300",
      bg: "bg-green-500/10",
    },
    pending: {
      dot: "bg-yellow-500",
      text: "text-yellow-700 dark:text-yellow-300",
      bg: "bg-yellow-500/10",
    },
    not_connected: {
      dot: "bg-red-500",
      text: "text-red-700 dark:text-red-300",
      bg: "bg-red-500/10",
    },
  };

  const style = styles[status as keyof typeof styles];
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      <span
        className={`text-xs font-medium ${style.text} ${style.bg} px-2 py-1 rounded-full`}
      >
        {text}
      </span>
    </div>
  );
}
