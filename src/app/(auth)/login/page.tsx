"use client";

import AuthForm from "@/components/AuthForm";
import axiosAuth from "@/lib/axios/axios-auth";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import axios from "axios";
import { Chromium, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const handleSubmit = async (data: Record<string, string>) => {
    console.log("form data:, ", data);

    try {
      const res = await axiosAuth.post("/login", data);
      console.log(`response: ${JSON.stringify(res.data)}`);
      // store user data to user slice in redux

      dispatch(setUser(res.data.user));
      if (res.data?.success) {
        toast.success(res.data.message);
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
      onSubmit={handleSubmit}
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
          <button className="flex-1 flex items-center justify-center gap-4 py-2 bg-white text-black rounded-lg font-medium hover:opacity-90 transition">
            <Chromium size={18} />
            <span>Google</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-4 py-2 bg-black text-white rounded-lg font-medium border border-gray-700 hover:opacity-90 transition">
            <Github size={18} />
            <span>GitHub</span>
          </button>
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
    />
  );
}
