import { ApplicationState, ApplicationStatus } from "@/types/application";

export const getApplicationState = (
  status: ApplicationStatus,
): ApplicationState => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        disabled: true,
        backgroundColor: "bg-orange-500/60 hover:bg-orange-500/30",
      };
    case "accepted":
      return {
        label: "Joined",
        disabled: true,
        backgroundColor: "bg-green-500/60 hover:bg-green-500/30",
      };
    case "rejected":
      return {
        label: "Rejected",
        disabled: true,
        backgroundColor: "bg-red-500/60 hover:bg-red-500/30",
      };
    default:
      return {
        label: "Apply to contribute",
        disabled: false,
        backgroundColor: "bg-btn-primary hover:bg-btn-primary-hover",
      };
  }
};
