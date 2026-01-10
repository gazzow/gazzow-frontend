"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import { Crown } from "lucide-react";
import { useRouter } from "next/navigation";

export function PricingButton() {
  const router = useRouter();
  const handleOnClick = () => {
    router.replace(USER_ROUTES.PRICING);
  };
  return (
    <button
      onClick={handleOnClick}
      className=" w-full flex items-center justify-center gap-2 px-2 py-2 rounded-md bg-btn-premium hover:shadow hover:shadow-btn-premium-hover transition cursor-pointer"
    >
      <Crown size={20} />
      <span className="rounded-lg text-sm font-medium  transition">
        Premium
      </span>
    </button>
  );
}
