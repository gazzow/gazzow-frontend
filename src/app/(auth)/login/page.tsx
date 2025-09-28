"use client";

import AuthForm from "@/components/AuthForm";
import { GithubAuthButton } from "@/components/ui/GithubAuthButton";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { authService } from "@/services/auth/auth-service";
import { setUserProfile } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import { LoginInput, loginSchema } from "@/validators/auth-login";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const fields = [
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
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [resErrors, setResErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    console.log("form data:, ", formData);

    try {
      const res = await authService.login({ ...formData });
      dispatch(setUserProfile(res.data));

      if (res.success) {
        toast.success(res.message);
        router.replace("/home");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("login error: ", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Something went wrong!");
      } else {
        console.log("unexpected error: ", error);
      }
    }
  };

  return (
    <AuthForm
      title="Welcome Back"
      subTitle="Sign in to connect with coders around the world"
      fields={fields}
      onSubmit={handleLoginSubmit}
      submitButtonLabel="Login"
      divider={
        <div className="mb-4">
          <div className="my-4 flex justify-between">
            <div className="flex gap-2">
              <input type="checkbox" />
              <p className="text-text-secondary text-md">Remember me</p>
            </div>
            <Link
              href={"/forgot-password"}
              className="text-text-secondary text-md"
            >
              Forgot password
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex-grow h-px bg-gray-600" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-600" />
          </div>
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
          Don&apos;t have an account&#x3F;
          <Link
            href="/signup"
            className="text-text-primary hover:underline ml-2"
          >
            Signup
          </Link>
        </p>
      }
      errors={errors}
      resErrors={resErrors}
      handleSubmit={handleSubmit}
      register={register}
      clearErrors={clearErrors}
    />
  );
}
