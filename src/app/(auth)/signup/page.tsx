"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/store";
import { setUserEmail } from "@/store/slices/authSlice";
import { SignupInput, signupSchema } from "@/validators/auth-signup";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authService } from "@/services/auth/auth-service";
import { GoogleAuthButton } from "@/components/ui/GoogleAuthButton";
import { GithubAuthButton } from "@/components/ui/GithubAuthButton";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { handleApiError } from "@/utils/handleApiError";

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
      if (formData.password !== formData.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match!",
        });
        return;
      }

      const data = await authService.signup(formData);
      if (data.success) {
        dispatch(setUserEmail({ email: formData.email }));
        router.push(AUTH_ROUTES.VERIFY_USER);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AuthForm
      title="Create Account"
      subTitle="Join the community of passionate developers"
      submitButtonLabel="Signup"
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
          Already have an account?
          <Link
            href="/login"
            className="
      ml-2 font-medium
      text-indigo-600 dark:text-indigo-400
      hover:text-indigo-700 dark:hover:text-indigo-300
      transition-colors duration-200
    "
          >
            Log in
          </Link>
        </p>
      }
      errors={errors}
      handleSubmit={handleSubmit}
      register={register}
    ></AuthForm>
  );
}
