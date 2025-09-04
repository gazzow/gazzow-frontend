"use client"

import OtpVerification from "@/components/OtpVerification";
import { useAppSelector } from "@/store/store";

export default function VerifyOtp() {
  const email = useAppSelector((state) => state.auth.user?.email) || "";

  return (
    <OtpVerification
      email={email}
      mode="forgot-password"
      key={"forgot-password"}
    ></OtpVerification>
  );
}
