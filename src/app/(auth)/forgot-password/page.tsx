"use client";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { authService } from "@/services/auth/auth-service";
import { setUserEmail } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import {
  forgotInput,
  forgotPasswordSchema,
} from "@/validators/auth-forgot-password";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotInput>({ resolver: zodResolver(forgotPasswordSchema) });

  const handleForgotSubmit = async (data: forgotInput) => {
    console.log("email: ", data.email);
    dispatch(setUserEmail({ email: data.email }));

    try {
      const res = await authService.forgotPassword(data.email);

      console.log("response: ", res);
      toast.success(res.message);

      if (res.success) {
        router.replace(AUTH_ROUTES.VERIFY_OTP);
        localStorage.setItem("otp-expiry", res.data.otpExpiresAt.toString());
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("forgot error: ", error);
        toast.error(error.response?.data.message || "Internal server error");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-primary px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-secondary border border-gray-200 dark:border-border-primary p-6 sm:p-8 rounded-2xl shadow-md sm:shadow-xl transition-all">
        {/* Heading */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Reset Password
          </h1>
          <p className="text-sm mt-2 text-gray-500 dark:text-gray-300 max-w-xs">
            Enter your email address and we’ll send you a verification code
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleForgotSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="email"
              placeholder="you@example.com"
              className="
            w-full px-4 py-2.5 rounded-lg
            bg-gray-50 dark:bg-primary
            border border-gray-300 dark:border-gray-600
            text-gray-800 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-btn-primary
            transition
          "
              {...register("email")}
            />

            {errors.email && (
              <p
                id="email-error"
                className="text-red-500 text-sm mt-1"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="
          bg-btn-primary 
          hover:bg-btn-primary-hover
          text-white
          py-2.5
          rounded-lg
          font-semibold
          transition cursor-pointer
          disabled:opacity-50
        "
          >
            Send OTP
          </button>
        </form>

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
