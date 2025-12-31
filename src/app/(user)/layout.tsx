"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { useNotification } from "@/hook/useNotification";
import { notificationService } from "@/services/notification";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authEndpoints: string[] = Object.values(AUTH_ROUTES) || [];
  const isAuth = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);
  console.log("user id: ", user.id);

  const { fcmToken } = useNotification();

  useEffect(() => {
    console.log("FCM token:", fcmToken);
    console.log("User ID:", user?.id);

    if (!fcmToken || !user?.id) return;

    console.log("Calling backend to save FCM token...");

    const syncToken = async () => {
      try {
        const res = await notificationService.saveFCMToken(
          fcmToken,
          user.id!,
          "web"
        );
        console.log("response token: ", res);
        if (res.success) {
          toast.success(res.message);
        }
        console.log("FCM token saved");
      } catch (err) {
        console.error("Backend error:", err);
      }
    };

    syncToken();
  }, [fcmToken, user?.id]);

  // Show notification toast when received

  return (
    <div className="flex bg-primary">
      {!user.isOnboarding && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {!user.isOnboarding && <Sidebar />}

        <main className="flex-1 text-white">{children}</main>
      </div>
    </div>
  );
}
