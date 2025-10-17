import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { Github } from "lucide-react";
import Link from "next/link";

export function GithubAuthButton() {
  return (
    <button className="flex-1 flex items-center justify-center gap-4 py-2 bg-black text-white rounded-lg font-medium border border-gray-700 hover:opacity-90 transition">
      <Github size={18} />
      <Link href={ADMIN_ROUTES.LOGIN}>
        <span>Admin</span>
      </Link>
    </button>
  );
}
