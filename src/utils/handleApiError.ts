import { getAxiosErrorMessage } from "./getAxiosErrorMessage";
import { toast } from "react-toastify";

export const handleApiError = (error: unknown) => {
  const message = getAxiosErrorMessage(error);
  toast.error(message);
};
