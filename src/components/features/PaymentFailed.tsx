"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useRouter, useSearchParams } from "next/navigation";

export default function FailedPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  const onDashboardClick = () => {
    router.push(USER_ROUTES.HOME);
  };

  const onGoToProjectsClick = () => {
    if (taskId) {
      router.push(PROJECT_ROUTES.DETAILS(taskId));
    } else {
      router.push(PROJECT_ROUTES.BROWSE);
    }
  };
  return (
    <div className="text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Failed Icon */}
        <div className="flex justify-center">
          <div className="bg-red-600/10 text-red-500 rounded-full p-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Payment Failed</h1>

        {/* Description */}
        <p className="text-neutral-400 text-sm leading-relaxed">
          Something went wrong or payment was cancelled. You can try again
          anytime.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mt-6">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-sm font-medium transition cursor-pointer
          "
            onClick={onGoToProjectsClick}
          >
            Try Again
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
