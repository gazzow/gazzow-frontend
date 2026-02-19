import axios from "axios";

export const getAxiosErrorMessage = (error: unknown): string => {

  if (axios.isAxiosError(error)) {

    // Backend message
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Validation error fallback
    if (error.response?.data?.errors?.[0]?.message) {
      return error.response.data.errors[0].message;
    }

    // Network error
    if (error.request) {
      return "Network error. Please check your connection.";
    }
  }

  return "Something went wrong. Please try again.";
};
