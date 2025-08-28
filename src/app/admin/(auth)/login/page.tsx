"use client";

import AuthForm from "@/components/AuthForm";

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
  const handleSubmit = (data: Record<string, string>) => {
    console.log("form data:, ", data);
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
