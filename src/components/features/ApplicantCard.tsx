"use client";

import { ApplicationStatus } from "@/types/application";
import { IUser } from "@/types/user";
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
    <div className=" bg-secondary/30 text-white rounded-2xl p-3 flex flex-col justify-between  gap-2 shadow-md border border-border-primary">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Image
            src={applicant.imageUrl || ""}
            alt={"Applicant Profile"}
            width={44}
            height={18}
            className="rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold leading-tight">{applicant.name}</h3>
            <p className="text-gray-400 text-sm">{applicant.developerRole}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {/* <div className="flex gap-2 flex-wrap mt-3">
        {applicant.techStacks?.map((skill, i) => (
          <span
            key={i}
            className="text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700"
          >
            {skill}
          </span>
        ))}
        ...
      </div> */}

      {/* Proposal */}
      <div className="grow">
        {proposal && (
          <p title={proposal} className="text-sm">
            {proposal.length > 75 ? proposal.slice(0, 82) + "..." : proposal}
          </p>
        )}
      </div>

      {/* Expected Rate  & Experience*/}
      <div className="flex items-center justify-between">
        <p>{applicant.experience}</p>
        <p className="text-gray-300 text-sm">
          <span className="text-white font-medium">${expectedRate}</span> / Hour
        </p>
      </div>
      {/* Footer */}
      <div className="flex justify-end items-center gap-2">
        <button
          onClick={handleReject}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
        >
          <X size={14} /> Reject
        </button>
        <button
          onClick={handleAccept}
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 text-xs rounded-md transition-colors cursor-pointer"
        >
          <Check size={14} /> Accept
        </button>
      </div>
    </div>
  );
}
