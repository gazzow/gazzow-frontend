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

  const replaceRoute = () => {
    router.replace("/verify-otp");
  };

  const handleRegisterSubmit = async (formData: Record<string, string>) => {
    try {
      console.log("form data: ", formData);

      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match!",
        });
      }

      const data = await authService.signup(formData);
      console.log("res data: ", data);
      if (data.success) {
        toast.success("Re-routing to verify otp");
        dispatch(setUserEmail({ email: formData.email }));
        replaceRoute();
      }
    } catch (error) {
      console.log("error while api call", error);
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
          <button className="flex-1 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90 transition">
            Google
          </button>
          <button className="flex-1 py-2 bg-black text-white rounded-lg font-medium border border-gray-700 hover:opacity-90 transition">
            GitHub
          </button>
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
