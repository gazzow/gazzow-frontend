"use client";

import AuthForm from "@/components/AuthForm";
import Link from "next/link";



const fields = [
  {
    name: "username",
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
  
  const handleSubmit = (data: Record<string, string>) => {
    console.log("form data", data);
  };


  return (
    <AuthForm
      title="Gazzow Signup"
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
