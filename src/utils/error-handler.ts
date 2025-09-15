import axios from "axios";
import { z } from "zod";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;

    return {
      message: errorData?.message || "An error occurred",
      fieldErrors: extractFieldErrors(errorData?.errors),
    };
  }

  return {
    message: "An unexpected error occurred",
    fieldErrors: {},
  };
};

const extractFieldErrors = (errors: unknown): Record<string, string> => {
  const formErrors: Record<string, string> = {};

  if (Array.isArray(errors)) {
    (errors as z.core.$ZodIssue[]).forEach((issue) => {
      const field = issue.path[0]?.toString();
      if (field) {
        formErrors[field] = issue.message;
      }
    });
  }

  return formErrors;
};
