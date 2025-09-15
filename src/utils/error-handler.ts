import axios from "axios";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;

    return {
      message: errorData?.message || "An error occurred",
      fieldErrors: extractFieldErrors(errorData?.errors || []),
    };
  }

  return {
    message: "An unexpected error occurred",
    fieldErrors: {},
  };
};

const extractFieldErrors = (errors: unknown[]): Record<string, string> => {
  const formErrors: Record<string, string> = {};

  if (Array.isArray(errors)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors.forEach((issue: any) => {
      const field = issue?.path?.[0];
      if (field) {
        formErrors[field] = issue.message;
      }
    });
  }

  return formErrors;
};
