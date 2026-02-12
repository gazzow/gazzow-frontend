"use client";

import Image from "next/image";

export function GoogleAuthButton() {
  return (
    <button
      type="button"
      onClick={() =>
        window.location.assign(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
      }
      className="
    w-full sm:flex-1
    flex items-center justify-center gap-3
    py-2.5 px-4
    rounded-lg
    bg-white 
    border border-gray-300 dark:border-gray-700
    shadow-sm
    dark:hover:shadow-md
    hover:bg-gray-50
    transition-all duration-200
    cursor-pointer
  "
    >
      <Image
        src="/icons/google.png"
        alt="Google logo"
        width={20}
        height={20}
        className="w-5 h-5"
      />
      <span className="font-medium  dark:text-gray-800 ">
        Continue with Google
      </span>
    </button>
  );
}
