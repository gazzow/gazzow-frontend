import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import Link from "next/link";

export default function ProjectDetail() {
  return (
    <div className="flex flex-col">
      <Link href={PROJECT_ROUTES.BROWSE} className=" text-blue-400">
        Project Page
      </Link>
      <h1>Project Detail page</h1>
    </div>
  );
}
