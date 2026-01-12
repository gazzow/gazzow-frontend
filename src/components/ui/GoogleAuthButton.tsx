"use client";

import { Chromium } from "lucide-react";

export function GoogleAuthButton() {
  return (
    <button
      onClick={() =>
        (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
      } // ✅ call login() on click
      className="flex-1 flex items-center justify-center gap-4 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
    >
      <Chromium size={18} />
      <span>Google</span>
    </button>
  );
}
