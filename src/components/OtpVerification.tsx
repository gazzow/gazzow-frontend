"use client";

import axiosAuth from "@/lib/axios/axios-auth";
import { formatTime } from "@/utils/auth/formatTime";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OtpVerificationProps {
  email: string;
  mode: string;
}

export default function OtpVerification({ email, mode }: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [expiryTimer, setExpiryTimer] = useState(300); // 5 min in seconds
  const [reSendTimer, setReSendTimer] = useState(180); // 3 min in seconds

  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (expiryTimer >= 0) {
        setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }
      if (reSendTimer >= 0) {
        setReSendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTimer,reSendTimer]);

  const endpoint =
    mode === "register"
      ? "/verify-otp"
      : "/forgot-password/verify-otp";

  const handleSubmit = async () => {
    console.log("Email:", email, "OTP:", otp);

    try {
      const res = await axiosAuth.post(endpoint, { email, otp });
      toast.success(res.data.message);
      console.log("res data: ", res.data);
      setTimeout(() => {
        // re-routing
        toast.info("sign in! re-routing to home");
        if (mode === "register") {
          router.replace("/home");
        } else {
          router.replace("/reset-password");
        }
      }, 3000);
    } catch (error) {
      console.log("verification error: ", error);
      toast.error(`verification error: ${error}`);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-primary px-4">
      <div className="w-full max-w-md bg-secondary/30 border-2 border-border-primary p-8 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <Shield size={24}></Shield>
          </div>
          <h1 className="text-3xl font-bold text-center">Verify Your Email</h1>
          <p className="text-sm mt-2 text-gray-300">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-btn-primary hover:bg-btn-primary-hover cursor-pointer py-2 rounded-md font-semibold"
          >
            Verify OTP
          </button>
        </div>

        <div className="mt-4 text-center text-gray-300 text-sm">
          <p>Code expires in {formatTime(expiryTimer)}</p>
          <p className="mb-6">Resend available in {formatTime(reSendTimer)}</p>
          <Link className="text-blue-300" href={"/login"}>
            &larr; Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
