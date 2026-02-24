"use client"; // if using Next.js 13 app directory

import { useAppDispatch, useAppSelector } from "@/store/store";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { setOnboardingStatus, setUser } from "@/store/slices/userSlice";
import { clearAuthEmail } from "@/store/slices/authSlice";
import { authService } from "@/services/auth/auth-service";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { handleApiError } from "@/utils/handleApiError";

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
      handleApiError(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!email?.trim()) {
        toast.error("Email is required. Please try again later");
        return;
      }

      if (!otp?.trim()) {
        toast.error("OTP is required");
        return;
      }

      if (otp.length !== 6) {
        toast.error("OTP must be 6 digits");
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
      handleApiError(error);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-primary px-4 sm:px-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-secondary border border-gray-200 dark:border-border-primary p-6 sm:p-8 rounded-2xl shadow-md sm:shadow-xl transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="bg-gray-100 dark:bg-primary p-4 rounded-full mb-4">
            <Shield
              size={24}
              className="text-gray-600 dark:text-text-primary"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-text-primary">
            Verify Your Email
          </h1>

          <p className="text-sm mt-2 text-gray-500 dark:text-text-secondary">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="
          w-full px-4 py-2.5
          rounded-lg
          bg-gray-50 dark:bg-primary
          text-gray-800 dark:text-text-primary
          border border-gray-300 dark:border-border-primary
          placeholder:text-gray-400 dark:placeholder:text-text-muted
          focus:outline-none
          focus:ring-2 focus:ring-btn-primary
          focus:border-btn-primary
          transition-all
        "
          />

          <button
            onClick={handleSubmit}
            className="
          bg-btn-primary
          hover:bg-btn-primary-hover
          text-white
          py-2.5
          rounded-lg
          font-medium
          transition-all
        "
          >
            Verify OTP
          </button>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center mt-6 text-sm text-gray-500 dark:text-text-secondary">
          {/* Timer */}
          <p className="mb-2">
            Code expires in{" "}
            <span className="font-medium text-gray-700 dark:text-text-primary">
              {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </span>
          </p>

          {/* Resend */}
          {timer <= 0 && (
            <button
              onClick={handleResendOtp}
              className="text-red-500 hover:underline mb-4 transition"
            >
              Resend OTP
            </button>
          )}

          {/* Back */}
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
