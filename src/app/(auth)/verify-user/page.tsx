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
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [expiry, setExpiry] = useState<number | null>(null);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.user?.email);

  useEffect(() => {
    const stored = Number(localStorage.getItem("otp-expiry"));
    if (stored) setExpiry(stored);
  }, []);

  useEffect(() => {
    if (!expiry) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [expiry]);

  const handleResendOtp = async () => {
    try {
      const res = await authService.resendOtp(email!, "register");
      if (res.success) {
        const newExpiry: number = res.data.otpExpiresAt;
        localStorage.setItem("otp-expiry", newExpiry.toString());
        setExpiry(newExpiry);
      }
      toast.success(res.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("resend otp error: ", error);
        toast.error(error.response?.data.message || "Internal server error");
      }
    }
  };

  const handleSubmit = async () => {
    console.log("Email:", email, "OTP:", otp);

    try {
      if (!email || !otp) {
        console.log("Email or Otp required!");
        return;
      }
      const res = await authService.verifyUser(email, otp);

      if (res.success) {
        localStorage.removeItem("otp-expiry");
        setExpiry(null);
      }
      toast.success(res.data.message);

      dispatch(setUser(res.data));
      dispatch(setOnboardingStatus(true));
      dispatch(clearAuthEmail());

      router.replace(USER_ROUTES.ONBOARDING);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("verification error: ", error);
        toast.error(error.response?.data.message || "something went wrong");
      }
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

        <div className="flex  flex-col mt-4 text-center text-gray-300 text-sm">
          <p>
            {" "}
            Code expires in {Math.floor(timer / 60)}:
            {(timer % 60).toString().padStart(2, "0")}
          </p>
          {timer <= 0 && (
            <button
              onClick={handleResendOtp}
              className="mb-6 text-red-400 cursor-pointer underline"
            >
              Resend Otp
            </button>
          )}
          <Link className="text-blue-300" href={AUTH_ROUTES.LOGIN}>
            &larr; Back to login
          </Link>
        </div>
      </div>
    </section>
  );
}
