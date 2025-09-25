import { Loader } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center space-y-4">
        <Loader size={32} className="animate-spin text-white" />
        <p className="text-gray-300">Loading profile...</p>
      </div>
    </div>
  );
}
