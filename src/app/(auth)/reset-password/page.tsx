"use client";

import axiosAuth from "@/lib/axios-auth";
import { setUserEmail } from "@/store/slices/authSlice";
import { useAppSelector } from "@/store/store";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
      const res = await axiosAuth.put("/reset-password", { email, password });
      console.log("response in reset-password: ", res);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error in reset-password: ", error);
      }
    }

    setTimeout(() => {
      router.replace("/login");
    }, 1000);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-primary px-4">
      <div className="w-full max-w-md bg-secondary/30 border-2 border-border-primary p-8 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Reset Password</h1>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor={"New Password"} className="block text-sm mb-1">
              New Password
            </label>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary border border-gray-600 focus-within:ring-2 focus-within:ring-btn-primary">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full outline-none"
                value={password}
                onChange={handlePasswordChange}
              />
              <div onClick={handleShowPassword} className="cursor-pointer">
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor={"New Password"} className="block text-sm mb-1">
              Confirm Password
            </label>
            <div className="flex items-center justify-center px-4 py-2 rounded-lg bg-primary border border-gray-600 focus-within:ring-2 focus-within:ring-btn-primary">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full outline-none"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              <div
                onClick={handleShowConfirmPassword}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </div>
          </div>

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
