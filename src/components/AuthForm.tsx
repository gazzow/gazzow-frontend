"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
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
  errors,
  handleSubmit,
  register,
  isSubmitting = false,
}: AuthFormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleShowPassword = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <section
      className="
    min-h-screen flex items-center justify-center
    bg-gray-100 dark:bg-primary
    px-4 sm:px-6 lg:px-8
    transition-colors duration-300
  "
    >
      <div
        className="
      w-full max-w-md sm:max-w-lg lg:max-w-xl
      bg-white dark:bg-secondary
      border border-gray-200 dark:border-border-primary
      p-6 sm:p-8
      rounded-2xl
      shadow-md sm:shadow-xl
      transition-all duration-300
    "
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center text-gray-800 dark:text-text-primary">
          {title}
        </h1>

        {subTitle && (
          <h3 className="text-sm sm:text-base text-center text-gray-500 dark:text-text-secondary mt-2 mb-6 leading-relaxed">
            {subTitle}
          </h3>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {fields.map((field) => (
            <div key={field.name}>
              {/* Label */}
              <label
                htmlFor={field.name}
                className="block text-sm font-medium tracking-wide text-gray-600 dark:text-text-secondary mb-1"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Input */}
              {field.type === "password" ? (
                <div className="relative">
                  <input
                    id={field.name}
                    {...register(field.name)}
                    type={showPassword[field.name] ? "text" : "password"}
                    placeholder={field.placeholder}
                    className="
                  w-full px-4 py-2.5 pr-12
                  rounded-lg
                  bg-gray-50 dark:bg-primary
                  text-gray-800 dark:text-text-primary text-[15px]
                  border border-gray-300 dark:border-border-primary
                  placeholder:text-gray-400 dark:placeholder:text-text-muted
                  focus:outline-none
                  focus:ring-2 focus:ring-btn-primary
                  focus:border-btn-primary
                  transition-all duration-200
                "
                    aria-invalid={!!errors[field.name]}
                    aria-describedby={
                      errors[field.name] ? `${field.name}-error` : undefined
                    }
                  />

                  <button
                    type="button"
                    onClick={() => handleShowPassword(field.name)}
                    className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 dark:text-text-muted
                  hover:text-btn-primary
                  transition cursor-pointer
                "
                  >
                    {showPassword[field.name] ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className="
                w-full px-4 py-2.5
                rounded-lg
                bg-gray-50 dark:bg-primary
                text-gray-800 dark:text-text-primary text-[15px]
                border border-gray-300 dark:border-border-primary
                placeholder:text-gray-400 dark:placeholder:text-text-muted
                focus:outline-none
                focus:ring-2 focus:ring-btn-primary
                focus:border-btn-primary
                transition-all duration-200
              "
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={
                    errors[field.name] ? `${field.name}-error` : undefined
                  }
                />
              )}

              {/* Errors */}
              {errors[field.name] && (
                <p
                  id={`${field.name}-error`}
                  className="text-red-500 text-sm mt-1"
                  role="alert"
                >
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
          w-full mt-4 py-2.5
          rounded-lg
          bg-btn-primary
          hover:bg-btn-primary-hover
          text-white
          font-medium tracking-wide text-sm
          transition-all duration-200 cursor-pointer
          disabled:opacity-50  disabled:cursor-not-allowed
        "
          >
            {isSubmitting ? "Loading..." : submitButtonLabel}
          </button>
        </form>

        {divider && <div className="mt-6">{divider}</div>}
        {OAuthButtons && <div className="mt-4">{OAuthButtons}</div>}
        {footer && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-text-muted">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
