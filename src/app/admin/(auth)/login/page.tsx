"use client";

import AuthForm from "@/components/AuthForm";
import { setAdmin } from "@/store/slices/adminSlice";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/validators/auth-login";
import { adminAuthService } from "@/services/admin/admin-auth.service";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import Link from "next/link";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { handleApiError } from "@/utils/handleApiError";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema), // 👈 Zod validation
  });

  const handleLoginSubmit = async (formData: Record<string, string>) => {
    try {
      const response = await adminAuthService.login(formData);
      if (response.success) {
        dispatch(setAdmin(response.data));
        router.replace(ADMIN_ROUTES.DASHBOARD);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AuthForm
      title="Admin Login"
      fields={fields}
      onSubmit={handleLoginSubmit}
      submitButtonLabel="Login"
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
