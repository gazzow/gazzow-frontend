"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/store";
import { setUserEmail } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { SignupInput, signupSchema } from "@/validators/auth-signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authService } from "@/services/auth/auth-service";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { GithubAuthButton } from "@/components/ui/GithubAuthButton";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import axios from "axios";

const fields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "John Doe",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "••••••••",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [resErrors, setResErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const handleRegisterSubmit = async (formData: Record<string, string>) => {
    try {
      console.log("form data: ", formData);

      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match!",
        });
        return;
      }

      const data = await authService.signup(formData);
      console.log("res data: ", data);
      if (data.success) {
        toast.success("Re-routing to verify otp");
        dispatch(setUserEmail({ email: formData.email }));
        router.replace(AUTH_ROUTES.VERIFY_USER);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error while api call", error);
        toast.error(error.response?.data.message || "Error while signup");
      }
    }
  };

  return (
    <AuthForm
      title="Create Account"
      subTitle="Join the community of passionate developers"
      submitButtonLabel="signup"
      fields={fields}
      onSubmit={handleRegisterSubmit}
      divider={
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-600" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-600" />
        </div>
      }
      OAuthButtons={
        <div className="flex gap-4">
          <GoogleAuthButton />
          <GithubAuthButton />
        </div>
      }
      footer={
        <p className="text-sm text-center text-text-secondary mt-6">
          Already have an account?
          <Link
            href="/login"
            className="text-text-primary hover:underline ml-2"
          >
            Login
          </Link>
        </p>
      }
      errors={errors}
      resErrors={resErrors}
      handleSubmit={handleSubmit}
      register={register}
    ></AuthForm>
  );
}
