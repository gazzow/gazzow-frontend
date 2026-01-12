import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { ProjectStatus } from "@/types/project";
import { Calendar, Users, DollarSign } from "lucide-react";
import Link from "next/link";

interface CreatedProjectCardProps {
  id: string;
  title: string;
  budgetMin: number;
  budgetMax: number;
  durationMin: number;
  durationMax: number;
  durationUnit: string;
  applicants: number;
  progress: number;
  contributors: number;
  status: ProjectStatus;
}

export default function CreatedProjectCard({
  id,
  title,
  budgetMin,
  budgetMax,
  durationMin,
  durationMax,
  durationUnit,
  applicants,
  progress,
  contributors,
  status,
}: CreatedProjectCardProps) {
  const statusColor =
    status === ProjectStatus.OPEN
      ? "text-blue-800 bg-blue-100"
      : status === ProjectStatus.COMPLETED
      ? "text-green-800 bg-green-100"
      : "text-yellow-800 bg-yellow-100";

  return (
    <div className="bg-white dark:bg-secondary/30 text-gray-100 p-4 rounded-2xl shadow-lg border border-gray-800 hover:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between md:flex-row gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span
          className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded-full ${statusColor}`}
        >
          {status.replace(/\b\w/, (c) => c.toUpperCase())}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-1">
        <span className="flex items-center gap-1">
          <DollarSign size={14} />
          {budgetMin.toLocaleString()} - {budgetMax.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {durationMin}-{durationMax} {durationUnit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-purple-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <span>
            Contributors: <span className="text-gray-200">{contributors}</span>
          </span>
          <span className="flex items-center gap-1">
            <Users size={14} /> {applicants} applicants
          </span>
        </div>
        <Link
          href={PROJECT_ROUTES.DETAILS(id)}
          className="px-2 py-1 text-sm text-white rounded-md bg-purple-600 hover:bg-purple-700 transition"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}
