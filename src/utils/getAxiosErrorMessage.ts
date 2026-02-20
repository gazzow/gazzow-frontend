import axios from "axios";

export const getAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data;

    // 1️⃣ Validation error first
    if (response?.errors?.length) {
      return response.errors[0].message;
    }

    // 2️⃣ Backend general message
    if (response?.message) {
      return response.message;
    }

    // 3️⃣ Network error
    if (error.request) {
      return "Network error. Please check your connection.";
    }
  }

  return "Something went wrong. Please try again.";
};
