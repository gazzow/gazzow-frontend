"use client";

import { AUTH_API } from "@/constants/apis/auth-api";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { authService } from "@/services/auth/auth-service";
import { handleApiError } from "@/utils/handleApiError";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IGetEndPoint {
  register: string;
  forgotPassword: string;
}

type Mode = keyof IGetEndPoint;

interface OtpVerificationProps {
  email: string;
  mode: Mode;
}

const getEndPoint: IGetEndPoint = {
  register: AUTH_API.VERIFY_USER,
  forgotPassword: AUTH_API.VERIFY_OTP,
};

export default function OtpVerification({ email, mode }: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [expiry, setExpiry] = useState<number | null>(null);

  const router = useRouter();

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

  const endpoint: string = getEndPoint[mode];

  const handleResendOtp = async () => {
    try {
      const res = await authService.resendOtp(email, "reset");
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

      const res = await authService.verifyOtp(endpoint, email, otp);

      if (res.success) {
        localStorage.removeItem("otp-expiry");
        setExpiry(null);
      }

      toast.success(res.message);
      if (mode === "register") {
        router.replace(USER_ROUTES.HOME);
      } else {
        router.replace(AUTH_ROUTES.RESET_PASSWORD);
      }
    } catch (error) {
      handleApiError(error);
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
              Resend OTP
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
