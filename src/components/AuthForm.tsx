"use client";

import React, { useState } from "react";

type Fields = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type AuthFormProps = {
  title: string;
  fields: Fields[];
  submitButtonLabel: string;
  onSubmit: (data: Record<string, string>) => void;
  divider?: React.ReactNode;
  OAuthButtons?: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthForm({
  title,
  fields,
  submitButtonLabel,
  onSubmit,
  divider,
  OAuthButtons,
  footer,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //Basic validation
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });

    setErrors(newErrors);

    if (Object.keys(errors).length == 0) {
      onSubmit(formData);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-primary  text-white px-4">
      <div className="w-full max-w-md bg-secondary/30 border-2 border-border-primary p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm mb-1">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary"
              />
              {errors[field.name] && (
                <p className="text-red-400 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full mt-2 py-2 bg-btn-primary text-white hover:opacity-90 rounded-lg cursor-pointer transition"
          >
            {submitButtonLabel}
          </button>
        </form>

        {divider ?? divider}

        {OAuthButtons ?? OAuthButtons}

        {footer ?? footer}
      </div>
    </section>
  );
}
