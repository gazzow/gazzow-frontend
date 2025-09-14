"use client";

import AuthForm from "@/components/AuthForm";
import axiosAdmin from "@/lib/axios/axios-admin";
import { setAdmin } from "@/store/slices/adminSlice";
import { useAppDispatch } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";

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

export default function AdminLoginPage() {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data: Record<string, string>) => {
    console.log("form data:, ", data);
    try {
      const res = await axiosAdmin.post("/admin/auth/login", data);
      console.log("Login response data: ", res.data);
      if (res.data.success) { 
        dispatch(setAdmin(res.data.admin))
        router.replace('/admin/dashboard');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error: ", error);
      }
    }
  };

  return (
    <AuthForm
      title="Admin Login"
      fields={fields}
      onSubmit={handleSubmit}
      submitButtonLabel="Login"
    />
  );
}
