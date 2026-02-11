import { PROJECT_ROUTES } from "@/constants/routes/project-routes";

import Link from "next/link";

interface NotificationToastProps {
  projectId: string;
  title: string;
  message: string;
}

export const NotificationToast = ({
  projectId,
  title,
  message,
}: NotificationToastProps) => {
  console.log("Notification Payload data: ", projectId);
  return (
    <Link
      href={PROJECT_ROUTES.DETAILS(projectId)}
      className="
    group flex gap-3 items-start
    transition-all duration-200 ease-in-out bg-white hover:shadow-md
    dark:bg-primary focus:outline-none focus:ring-2 focus:ring-blue-500
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
