"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const onDashboardClick = () => {
    router.push(USER_ROUTES.HOME);
  };

  const onGoToProjectsClick = () => {
    if (projectId) {
      router.push(PROJECT_ROUTES.TASKS(projectId));
    } else {
      router.push(PROJECT_ROUTES.BROWSE);
    }
  };

  return (
    <div className=" text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-600/10 text-green-500 rounded-full p-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>

        {/* Description */}
        <p className="text-neutral-400 text-sm leading-relaxed">
          Your payment is completed. You can now continue working on your task.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mt-6">
          <button
            className="w-full bg-green-600 hover:bg-green-700 
          text-white py-3 rounded-lg text-sm font-medium transition cursor-pointer"
            onClick={onGoToProjectsClick}
          >
            Go to Tasks
          </button>

          <button
            className="w-full border border-neutral-600 hover:border-neutral-400 text-neutral-300 py-3 rounded-lg text-sm transition cursor-pointer"
            onClick={onDashboardClick}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
