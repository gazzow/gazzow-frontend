"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mail, Calendar, MoreVertical } from "lucide-react";
import Image from "next/image";
import { getDisplayName } from "@/utils/getDisplayName";
import { ContributorStatus } from "@/types/contributor";

interface ContributorProps {
  contributor: {
    id: string;
    userId: string;
    name: string;
    email: string;
    status: ContributorStatus;
    imageUrl: string;
    expectedRate: number;
    developerRole: string;
    invitedAt?: string;
    createdAt: string;
    updatedAt: string;
  };
  onStatusChange: (id: string, newStatus: ContributorStatus) => void;
}

const ContributorCard: React.FC<ContributorProps> = ({
  contributor,
  onStatusChange,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-secondary/30 border border-white/10 rounded-xl p-4 w-full max-w-xs shadow-md hover:shadow-lg transition-all duration-300">
      {/* Top Row */}
      <div
        className="flex items-start justify-between mb-3 relative"
        ref={dropdownRef}
      >
        <div className="flex items-center gap-3">
          {contributor.imageUrl ? (
            <Image
              src={contributor.imageUrl}
              alt={contributor.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold text-white">
              {contributor.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold text-white">
              {getDisplayName(contributor.name)}
            </h2>
            <p className="text-gray-400 text-sm">{contributor.developerRole}</p>
          </div>
        </div>

        {/* Dropdown Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1.5 rounded-md hover:bg-white/10 transition text-white/70 hover:text-white"
        >
          <MoreVertical size={18} />
        </button>

        {/* Dropdown Menu */}
        {open && (
          <div className="absolute top-10 right-0 mt-1 w-36 bg-secondary border border-white/10 rounded-md shadow-lg z-20">
            {Object.values(ContributorStatus).map((status) => (
              <button
                key={status}
                onClick={() => {
                  const newStatus =
                    ContributorStatus.ACTIVE === status
                      ? ContributorStatus.ACTIVE
                      : ContributorStatus.IN_ACTIVE === status
                      ? ContributorStatus.IN_ACTIVE
                      : ContributorStatus.REMOVED;
                  onStatusChange?.(contributor.userId, newStatus);
                  setOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition cursor-pointer ${
                  contributor.status === status
                    ? "text-blue-300"
                    : "text-white/70"
                }`}
              >
                {status
                  .replace("_", " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status + Rate */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-0.5 text-xs font-medium rounded-full ${
            contributor.status === ContributorStatus.ACTIVE
              ? "bg-green-500/20 text-green-400"
              : contributor.status === ContributorStatus.IN_ACTIVE
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {contributor.status
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
        <p className="text-sm text-white">
          <span className="text-white/70">$</span>{" "}
          <span className="font-semibold">{contributor.expectedRate}</span>
          <span className="text-white/70">/hr</span>
        </p>
      </div>

      {/* Email & Joined Date */}
      <div className="border-t border-white/10 pt-3 text-sm text-white/80 space-y-2">
        <div className="flex items-center gap-2"></div>
        <p className="text-sm text-white/70 flex items-center gap-1">
          <Mail className="w-4 h-4 text-white/60" />
          {contributor.email}
        </p>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/60" />
          <p>
            Joined{" "}
            {new Date(contributor.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContributorCard;
