"use client";

import AuthForm from "@/components/AuthForm";
import axiosAuth from "@/lib/axios/axios-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/store";
import { setUserEmail } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

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
];

export default function SignupPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const replaceRoute = () => {
    router.push("/verify-otp");
  };

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      console.log("data: ", data);

      const res = await axiosAuth.post("/register", data);
      if (res.data.success) {
        toast.success('storing email and re-routing to verify otp')
        // storing email in auth redux for verification
        dispatch(setUserEmail({ email: data.email }));
        replaceRoute();
      }
      console.log("res data: ", res);
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
      onSubmit={handleSubmit}
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
    ></AuthForm>
  );
}
