"use client";

import AuthForm from "@/components/AuthForm";
import { setAdmin } from "@/store/slices/adminSlice";
import { useAppDispatch } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validators/auth-login";
import z from "zod";
import { adminAuthService } from "@/services/admin/auth-login";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import Link from "next/link";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";

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

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    console.log("form data:, ", formData);
    try {
      const response = await adminAuthService.login(formData);
      console.log("Login response data: ", response.data);
      if (response.success) {
        dispatch(setAdmin(response.data));
        router.replace(ADMIN_ROUTES.DASHBOARD);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error response: ", error.response);
        toast.error(error.response?.data.message);
        const issues = error.response?.data?.errors;

        if (issues && Array.isArray(issues)) {
          const formErrors: Record<string, string> = {};
          issues.forEach((issue: z.core.$ZodIssue) => {
            const field = issue.path[0]?.toString();
            formErrors[field] = issue.message;
          });

          setResErrors(formErrors);
        }

        if (Array.isArray(issues)) {
          const formErrors: Record<string, string> = {};
          issues.forEach((issue) => {
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
      footer={
        <div className="text-center text-gray-300 text-sm">
          <Link className="text-blue-300" href={AUTH_ROUTES.LOGIN}>
            &larr; Back to User login
          </Link>
        </div>
      }
    />
  );
}
