"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  return (
    <div
      className="w-full flex items-center justify-center p-6
                text-black dark:text-neutral-100 transition-colors"
    >
      <div className="w-full max-w-md text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-green-600/10 text-green-600 dark:text-green-500 rounded-full p-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>

        {/* Description */}
        <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">
          Your subscription has been activated successfully. You now have access
          to all features included in your plan.
        </p>

        {/* Buttons */}
        <div className="flex flex-col space-y-4 mt-6">
          <Link href={USER_ROUTES.PRICING}>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium transition cursor-pointer">
              Go to pricing
            </button>
          </Link>

          <button
            className="w-full border border-gray-300 dark:border-neutral-600
                         hover:border-gray-400 dark:hover:border-neutral-400
                         text-gray-700 dark:text-neutral-300
                         py-3 rounded-lg text-sm transition cursor-pointer"
            onClick={() => router.push(USER_ROUTES.HOME)}
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
