import { PROJECT_ROUTES } from "@/constants/routes/project-routes";

import Link from "next/link";

interface NotificationToastProps {
  projectId: string;
  taskId?: string;
  title: string;
  message: string;
}

export const NotificationToast = ({
  projectId,
  taskId,
  title,
  message,
}: NotificationToastProps) => {
  const navigateTo = taskId
    ? PROJECT_ROUTES.TASKS(projectId)
    : PROJECT_ROUTES.DETAILS(projectId);
  return (
    <Link
      href={navigateTo}
      className="
    group flex gap-3 items-start
    transition-all duration-200 ease-in-out bg-white
    dark:bg-primary focus:outline-none
  "
    >
      <div className="flex flex-col">
        <p
          className="
        font-semibold text-base tracking-wide
        text-gray-900
        dark:text-gray-100
        transition-colors
      "
        >
          {title}
        </p>

        <p
          className="
        text-sm mt-1
        text-gray-600
        dark:text-gray-400
        line-clamp-2
      "
        >
          {message}
        </p>
      </div>
    </Link>
  );
};
