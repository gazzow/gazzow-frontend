"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, Calendar, FileText, PenLine } from "lucide-react";
import ApplyModal from "./ApplyModal";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { ApplicationStatus } from "@/types/application";

type PendingProposalCardProps = {
  id: string;
  proposal?: string;
  expectedRate: number;
  status: ApplicationStatus;
  createdAt: string;
  projectId: {
    id?: string;
    title?: string;
    description?: string;
    budgetMin?: number;
    budgetMax?: number;
    durationMin?: number;
    durationMax?: number;
    durationUnit?: string;
  };
};

export default function ProposalCard({
  id,
  proposal,
  expectedRate,
  status,
  createdAt,
  projectId,
}: PendingProposalCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusColor = {
    [ApplicationStatus.PENDING]:
      "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    [ApplicationStatus.REJECTED]:
      "bg-red-500/20 text-red-400 border border-red-500/30",
    [ApplicationStatus.ACCEPTED]:
      "bg-green-500/20 text-green-400 border border-green-500/30",
  };

  return (
    <div
      className="rounded-xl p-5 shadow-lg backdrop-blur-md transition-all hover:shadow-xl
             bg-white dark:bg-secondary/30
             border border-gray-200 dark:border-gray-800
             hover:border-gray-400 dark:hover:border-gray-700
             text-black dark:text-white"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-wide">
            {projectId.title || "Untitled Project"}
          </h3>
          <p className="text-gray-600 dark:text-gray-500 text-sm mt-1 line-clamp-2">
            {projectId.description || "No description available."}
          </p>
        </div>

        <span
          className={`text-[11px] px-3 py-1 rounded-xl font-medium ${statusColor[status]}`}
        >
          {status}
        </span>
      </div>

      {/* Divider */}
      <div className="border-b border-gray-200 dark:border-gray-800/50 my-3" />

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-400">
        {/* Budget Amount */}
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-gray-500" />
          {projectId.budgetMin} - {projectId.budgetMax} USD
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          {projectId.durationMin}-{projectId.durationMax}{" "}
          {projectId.durationUnit}
        </div>

        {/* Proposal */}
        <div className="flex items-center gap-2 col-span-2">
          <FileText size={16} className="text-gray-500" />
          <span className="truncate">
            Proposal:{" "}
            <span className="text-gray-800 dark:text-gray-300">
              {proposal || "—"}
            </span>
          </span>
        </div>

        {/* Expected Rate */}
        <div className="flex items-center gap-2 col-span-2">
          <DollarSign size={16} className="text-gray-500" />
          <p>
            Expected Rate:{" "}
            <span className="text-gray-800 dark:text-gray-300">
              ${expectedRate} / hr
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5">
        <div className="text-xs text-gray-600 dark:text-gray-500">
          Applied:{" "}
          <span className="text-gray-800 dark:text-gray-300">
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex gap-2">
          {projectId.id && (
            <Link
              href={PROJECT_ROUTES.DETAILS(projectId.id)}
              className="text-sm px-2 py-1 rounded-md border transition
                     bg-gray-100 dark:bg-secondary/20
                     border-gray-300 dark:border-gray-700
                     text-black dark:text-gray-200
                     hover:border-gray-400 dark:hover:border-gray-500"
            >
              View
            </Link>
          )}

          {status === ApplicationStatus.PENDING && (
            <button className="flex items-center gap-1 text-sm px-2 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white transition">
              <PenLine size={14} />
              Edit
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <ApplyModal projectId={id} closeModal={() => setIsOpen(false)} />
      )}
    </div>
  );
}
