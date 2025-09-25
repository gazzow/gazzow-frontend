import { Github } from "lucide-react";

export function GithubAuthButton() {
  return (
    <button className="flex-1 flex items-center justify-center gap-4 py-2 bg-black text-white rounded-lg font-medium border border-gray-700 hover:opacity-90 transition">
      <Github size={18} />
      <span>GitHub</span>
    </button>
  );
}
