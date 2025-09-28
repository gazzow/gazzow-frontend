"use client"; // if using Next.js 13 app directory

import { useAppDispatch, useAppSelector } from "@/store/store";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setOnboardingStatus, setUser } from "@/store/slices/userSlice";
import { clearAuthEmail } from "@/store/slices/authSlice";
import axios from "axios";
import { authService } from "@/services/auth/auth-service";

export default function VerifyOtp() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [expiryTimer, setExpiryTimer] = useState(299); // 5 min in seconds
  const [reSendTimer, setReSendTimer] = useState(59); // 3 min in seconds

  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.user?.email);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setExpiryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setReSendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (expiryTimer === 0) {
      router.replace("/signup");
    }
  }, [expiryTimer, router]);

  const handleSubmit = async () => {
    console.log("Email:", email, "OTP:", otp);

    try {
      if (!email || !otp) {
        console.log("Email or Otp required!");
        return;
      }
      const res = await authService.verifyUser(email, otp);
      toast.success(res.data.message);
      console.log("res data: ", res.data);

      dispatch(setUser(res.data));
      dispatch(setOnboardingStatus(true));
      dispatch(clearAuthEmail());

      // re-routing
      toast.info(
        "User registered! Re-routing to onboarding to finish profile setup"
      );
      router.replace("/onboarding");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("verification error: ", error);
        toast.error(error.response?.data.message || "something went wrong");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
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

        <div className="flex  flex-col mt-4 text-center text-gray-300 text-sm">
          <p>Code expires in {formatTime(expiryTimer)}</p>
          {reSendTimer === 0 ? (
            <button className="mb-6 text-red-400 cursor-pointer underline">
              Resend Otp
            </button>
          ) : (
            <p className="mb-6">
              Resend available in {formatTime(reSendTimer)}
            </p>
          )}
          <Link className="text-blue-300" href={"/login"}>
            &larr; Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
