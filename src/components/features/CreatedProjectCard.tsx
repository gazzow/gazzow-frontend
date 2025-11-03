import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { Calendar, Users, DollarSign, Circle } from "lucide-react";
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
  status: "Active" | "Completed" | "Paused";
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
    status === "Active"
      ? "text-green-400"
      : status === "Completed"
      ? "text-blue-400"
      : "text-yellow-400";

  return (
    <div className="bg-[#111418] text-gray-100 p-5 rounded-2xl shadow-lg border border-gray-800 hover:border-gray-700 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <span
          className={`text-xs flex items-center gap-1 px-2 py-1 rounded-md ${statusColor} bg-opacity-10`}
        >
          <Circle size={8} className={statusColor} />
          {status}
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
          className="px-3 py-1.5 text-sm text-white rounded-md bg-purple-600 hover:bg-purple-700 transition"
        >
          Manage
        </Link>
      </div>
    </div>
  );
}
