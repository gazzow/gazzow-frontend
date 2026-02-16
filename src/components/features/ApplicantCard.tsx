"use client";

import { ApplicationStatus } from "@/types/application";
import { IUser } from "@/types/user";
import { getDisplayName } from "@/utils/getDisplayName";
import { Check, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ApplicantCardProps {
  id: string;
  applicantId: string;
  applicant: Partial<IUser>;
  expectedRate: number;
  proposal?: string;
  updateStatus: (applicationId: string, status: ApplicationStatus) => void;
}

export default function ApplicantCard({
  id,
  applicant,
  expectedRate,
  proposal,
  updateStatus,
}: ApplicantCardProps) {
  const handleReject = () => {
    updateStatus(id, ApplicationStatus.REJECTED);
  };
  const handleAccept = () => {
    updateStatus(id, ApplicationStatus.ACCEPTED);
  };

  return (
    <div
      className="
  bg-white dark:bg-secondary/30
  text-gray-900 dark:text-white
  rounded-2xl p-3
  flex flex-col justify-between gap-2
  shadow-md
  border border-gray-200 dark:border-border-primary
"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3 min-w-0">
          {applicant.imageUrl && applicant.name ? (
            <Image
              src={applicant.imageUrl}
              alt={applicant.name}
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-gray-200 dark:border-white/10"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm sm:text-lg font-semibold">
              {applicant.name && applicant.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold truncate">
              {applicant.name && getDisplayName(applicant.name)}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {applicant.developerRole}
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {applicant.techStacks &&
          applicant.techStacks.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="
          text-[10px] sm:text-xs px-2 py-0.5 rounded-full border
          bg-gray-200 dark:bg-gray-800
          text-gray-800 dark:text-gray-200
          border-gray-300 dark:border-gray-700
        "
            >
              {tech}
            </span>
          ))}

        {applicant.techStacks && applicant.techStacks.length > 3 && (
          <span
            className="
        text-[10px] sm:text-xs px-2 py-0.5 rounded-full border
        bg-gray-200 dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        border-gray-300 dark:border-gray-700
        font-medium
      "
          >
            +{applicant.techStacks.length - 3} more
          </span>
        )}
      </div>

      {/* Proposal */}
      <div className="grow">
        {proposal && (
          <p
            title={proposal}
            className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-snug line-clamp-3"
          >
            {proposal}
          </p>
        )}
      </div>

      {/* Expected Rate & Experience */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
          {applicant.experience}
        </span>

        <span className="text-[11px] sm:text-xs px-2 py-1 rounded-md bg-primary/20 text-primary dark:text-text-primary font-medium">
          ${expectedRate}/hr
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={handleReject}
          className="w-full sm:w-auto flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
        >
          <X size={14} /> Reject
        </button>

        <button
          onClick={handleAccept}
          className="w-full sm:w-auto flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
        >
          <Check size={14} /> Accept
        </button>
      </div>
    </div>
  );
}
