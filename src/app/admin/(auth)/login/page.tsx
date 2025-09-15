"use client";

import AuthForm from "@/components/AuthForm";
import axiosAdmin from "@/lib/axios/axios-admin";
import { setAdmin } from "@/store/slices/adminSlice";
import { useAppDispatch } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validators/auth-login";

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

  const [resErrors, setResErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // 👈 Zod validation
  });

  const handleLoginSubmit = async (data: Record<string, string>) => {
    console.log("form data:, ", data);
    try {
      const res = await axiosAdmin.post("/admin/auth/login", data);
      console.log("Login response data: ", res.data);
      if (res.data.success) {
        dispatch(setAdmin(res.data.admin));
        router.replace("/admin/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error response: ", error.response);
        toast.error(error.response?.data.message);
        const issues = error.response?.data?.errors;
        if (Array.isArray(issues)) {
          const formErrors: Record<string, string> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          issues.forEach((issue: any) => {
            const field = issue.path[0];
            formErrors[field] = issue?.message;
          });

          console.log("formErrors: ", formErrors);
          // Pass down to AuthForm
          setResErrors(formErrors);
        }
      }
    }
  };

  return (
    <AuthForm
      title="Admin Login"
      fields={fields}
      onSubmit={handleLoginSubmit}
      submitButtonLabel="Login"
      resErrors={resErrors}
      errors={errors}
      register={register}   
      handleSubmit={handleSubmit}

    />
  );
}
