export enum ERROR_MESSAGES {
  GENERIC = "Something went wrong. Please try again.",
  LOGIN_FAILED = "Invalid username or password.",
  NETWORK = "Network error. Check your connection.",
  SESSION_EXPIRED = "Session expired. Please login again.",
  FORBIDDEN = "You don’t have permission for this action.",
  NOT_FOUND = "The requested resource was not found.",
  INTERNAL_SERVER_ERROR = "Server error. Please try again later.",
}

export enum SUCCESS_MESSAGES {
  LOGIN_SUCCESS = "Logged in successfully!",
  PROFILE_UPDATED = "Profile updated successfully.",
}
