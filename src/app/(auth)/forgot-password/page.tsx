"use client";

import axiosUser from "@/lib/axios/axios-user";
import { setUserEmail } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ResetPassword() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");

  const handleClick = async () => {
    if (!email) return;

    console.log("email: ", email);
    dispatch(setUserEmail({email}))


    try {
      const res = await axiosUser.post("/auth/forgot-password", { email });
      
      console.log("response: ", res);

      if (res.data.success) {
        setTimeout(() => {
          router.replace("/forgot-password/verify-otp");
        }, 1000);
      }

    } catch (error) {
      if(axios.isAxiosError(error)){
        console.log('forgot error: ', error)
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="you@gmail.com"
            className="w-full px-4 py-2 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary"
            value={email}
            onChange={handleChange}
          />

          <button
            onClick={handleClick}
            className="bg-btn-primary-hover hover:opacity-90 cursor-pointer py-2 rounded-md font-semibold"
          >
            Send Otp
          </button>
        </div>

        <div className="mt-4 text-center text-gray-300 text-sm">
          <Link className="text-blue-300" href={"/login"}>
            &larr; Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
