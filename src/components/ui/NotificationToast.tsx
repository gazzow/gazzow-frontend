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
      href={PROJECT_ROUTES.DETAILS(projectId)+"/chat"}
      className="flex gap-3 items-start"
    >
      {/* {avatar && (
        <img
          src={avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
      )} */}

      <div>
        <p className="font-semibold text-lg text-white">{title}</p>
        <p className="text-sm text-white mt-1">{message}</p>
      </div>
    </Link>
  );
};
