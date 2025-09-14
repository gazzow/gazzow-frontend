"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormClearErrors,
} from "react-hook-form";

type Fields = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

type AuthFormProps = {
  title: string;
  subTitle?: string;
  fields: Fields[];
  submitButtonLabel: string;
  onSubmit: (data: Record<string, string>) => void;
  divider?: React.ReactNode;
  OAuthButtons?: React.ReactNode;
  footer?: React.ReactNode;
  resErrors: Record<string, string>;
  errors: FieldErrors;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSubmit: UseFormHandleSubmit<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clearErrors?: UseFormClearErrors<any>;
  isSubmitting?: boolean;
};

export default function AuthForm({
  title,
  subTitle,
  fields,
  submitButtonLabel,
  onSubmit,
  divider,
  OAuthButtons,
  footer,
  resErrors,
  errors,
  handleSubmit,
  register,
  clearErrors,
  isSubmitting = false,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleShowPassword = (fieldName: string) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Clear server errors when user starts typing
  useEffect(() => {
    if (Object.keys(resErrors).length > 0 && clearErrors) {
      const timer = setTimeout(() => {
        Object.keys(resErrors).forEach(field => {
          clearErrors(field);
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [resErrors, clearErrors]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-white dark:bg-primary text-white px-4">
      <div className="w-full max-w-md bg-secondary/30 border-2 border-border-primary p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
        {subTitle && (
          <h3 className="text-md text-center text-text-secondary mb-6">
            {subTitle}
          </h3>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {fields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm mb-1">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              {field.type === "password" ? (
                <div className="relative">
                  <input
                    id={field.name}
                    {...register(field.name)}
                    type={showPassword[field.name] ? "text" : "password"}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 pr-12 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary transition-colors"
                    aria-invalid={!!(errors[field.name] || resErrors[field.name])}
                    aria-describedby={
                      errors[field.name] || resErrors[field.name]
                        ? `${field.name}-error`
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleShowPassword(field.name)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
                    aria-label={showPassword[field.name] ? "Hide password" : "Show password"}
                  >
                    {showPassword[field.name] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="w-full px-4 py-2 rounded-lg bg-primary border border-gray-600 focus:outline-none focus:ring-2 focus:ring-btn-primary transition-colors"
                  aria-invalid={!!(errors[field.name] || resErrors[field.name])}
                  aria-describedby={
                    errors[field.name] || resErrors[field.name]
                      ? `${field.name}-error`
                      : undefined
                  }
                />
              )}

              {/* Show client-side validation errors first, then server errors */}
              {(errors[field.name] || resErrors[field.name]) && (
                <p 
                  id={`${field.name}-error`}
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {(errors[field.name]?.message as string) || resErrors[field.name]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-2 bg-btn-primary text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-opacity"
          >
            {isSubmitting ? "Loading..." : submitButtonLabel}
          </button>
        </form>

        {divider && <div className="mt-6">{divider}</div>}
        {OAuthButtons && <div className="mt-4">{OAuthButtons}</div>}
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </section>
  );
}