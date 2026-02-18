import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center
dark:bg-primary
transition-colors animate-fadeIn"
    >
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        <Loader
          size={28}
          className="animate-spin
      text-btn-primary"
        />

        <p
          className="text-sm sm:text-base
    text-gray-600 dark:text-gray-400"
        >
          Loading content...
        </p>
      </div>
    </div>
  );
}
