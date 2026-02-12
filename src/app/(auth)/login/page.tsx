"use client";

import AuthForm from "@/components/AuthForm";
import { GithubAuthButton } from "@/components/ui/GithubAuthButton";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { USER_ROUTES } from "@/constants/routes/user-routes";
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
        router.replace(USER_ROUTES.HOME);
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
        <div className="mb-6">
          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-5">
            {/* Remember Me */}
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="
          w-4 h-4
          rounded
          border-gray-300 dark:border-gray-600
          text-indigo-600
          focus:ring-indigo-500
          bg-white dark:bg-gray-800
        "
              />
              <span
                className="
        text-sm sm:text-base
        text-gray-600 dark:text-gray-400
        group-hover:text-gray-800 dark:group-hover:text-gray-200
        transition-colors
      "
              >
                Remember me
              </span>
            </label>

            {/* Forgot Password */}
            <Link
              href="/forgot-password"
              className="
        text-sm sm:text-base
        text-indigo-600 dark:text-indigo-400
        hover:text-indigo-700 dark:hover:text-indigo-300
        hover:underline
        transition-colors
      "
            >
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              OR
            </span>
            <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      }
      OAuthButtons={
        <div className="flex flex-col gap-4">
          <GoogleAuthButton />
          <GithubAuthButton />
        </div>
      }
      footer={
        <p
          className="
  mt-6 text-center 
  text-sm sm:text-base
  text-gray-600 dark:text-gray-400
"
        >
          Don&apos;t have an account?
          <Link
            href="/signup"
            className="
      ml-2 font-medium
      text-indigo-600 dark:text-indigo-400
      hover:text-indigo-700 dark:hover:text-indigo-300
      transition-colors duration-200
    "
          >
            Sign up
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
