"use client";

import api from "@/lib/axios/api";
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
      const res = await api.post("/auth/forgot-password", {
        email: data.email,
      });

      console.log("response: ", res);

      if (res.data.success) {
        router.replace("/forgot-password/verify-otp");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("forgot error: ", error);
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-primary px-4">
      <div className="w-full max-w-md bg-secondary/30 border-2 border-border-primary p-8 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Reset Password</h1>
          <p className="text-sm mt-2 text-gray-300 text-center">
            Enter your email address and we&apos;ll send you a verification code
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleForgotSubmit)}
          className="flex flex-col gap-4"
        >
          <div>
            <input
              type="text"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary"
              {...register("email")}
            />
            {errors.email && (
              <p
                id={`email-error`}
                className="text-red-400 text-sm mt-1"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-btn-primary-hover hover:opacity-90 cursor-pointer py-2 rounded-md font-semibold"
          >
            Send Otp
          </button>
        </form>

        <div className="mt-4 text-center text-gray-300 text-sm">
          <Link className="text-blue-300" href={"/login"}>
            &larr; Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
