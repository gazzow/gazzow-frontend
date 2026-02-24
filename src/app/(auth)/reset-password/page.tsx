"use client";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { authService } from "@/services/auth/auth-service";
import { useAppSelector } from "@/store/store";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const email = useAppSelector((state) => state.auth.user?.email) || "";

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleClick = async () => {
    console.log("password: ", password);
    console.log("confirm password: ", password);

    try {
      const res = await authService.resetPassword(email, password);
      toast.success(res.message);
      router.replace(AUTH_ROUTES.LOGIN);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error in reset-password: ", error);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-primary px-4 sm:px-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-secondary border border-gray-200 dark:border-border-primary p-6 sm:p-8 rounded-2xl shadow-md sm:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-text-primary">
            Reset Password
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {/* New Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-text-secondary">
              New Password
            </label>

            <div
              className="
          flex items-center px-4 py-2.5 rounded-lg
          bg-gray-50 dark:bg-primary
          border border-gray-300 dark:border-border-primary
          focus-within:ring-2 focus-within:ring-btn-primary
          transition-all
        "
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-800 dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-text-muted"
                value={password}
                onChange={handlePasswordChange}
              />

              <button
                type="button"
                onClick={handleShowPassword}
                className="text-gray-400 dark:text-text-muted hover:text-btn-primary transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-text-secondary">
              Confirm Password
            </label>

            <div
              className="
          flex items-center px-4 py-2.5 rounded-lg
          bg-gray-50 dark:bg-primary
          border border-gray-300 dark:border-border-primary
          focus-within:ring-2 focus-within:ring-btn-primary
          transition-all
        "
            >
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none text-gray-800 dark:text-text-primary placeholder:text-gray-400 dark:placeholder:text-text-muted"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />

              <button
                type="button"
                onClick={handleShowConfirmPassword}
                className="text-gray-400 dark:text-text-muted hover:text-btn-primary transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleClick}
            className="
          bg-btn-primary
          hover:bg-btn-primary-hover
          text-white
          py-2.5
          rounded-lg
          font-medium cursor-pointer
          transition-all
        "
          >
            Reset Password
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <Link
            className="text-blue-600 dark:text-blue-400 hover:underline"
            href={AUTH_ROUTES.LOGIN}
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
