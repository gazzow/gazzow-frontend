"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ApplyModal from "./ApplyModal";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budgetMin: number;
  budgetMax: number;
  durationMin: number;
  durationMax: number;
  durationUnit: string;
  creator?: string;
  rating?: number;
  applicants?: number;
}

export default function ProjectCard({
  id,
  title,
  description,
  requiredSkills,
  budgetMin,
  budgetMax,
  durationMin,
  durationMax,
  durationUnit,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col bg-secondary/30 p-5 rounded-md border border-gray-800 hover:border-gray-600 transition-all">
      <h3 className="flex-1 text-white text-lg font-semibold mb-2">{title.replace(/\b\w/g, (c) => c.toUpperCase())}</h3>
      <p className="flex-1 text-gray-400 text-sm mb-3">
        {description.length > 75
          ? description.slice(0, 75) + "..."
          : description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {requiredSkills.map((tech) => (
          <span
            key={tech}
            className="text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center text-sm text-gray-400 gap-4 mb-3">
        <div className="flex items-center gap-1">
          <DollarSign size={14} /> {budgetMin} - {budgetMax}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} /> {durationMin}-{durationMax} {durationUnit}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <div className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-white font-semibold">
            S
          </div>
          <div>
            <div className="text-sm">Sarah Chen</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Link
              href={PROJECT_ROUTES.DETAILS(id)}
              className="px-2 py-1 bg-secondary/30  border border-border-primary  text-white text-sm rounded hover:bg-secondary cursor-pointer transition ease-in"
            >
              View More
            </Link>
            <button
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded cursor-pointer transition ease-in"
              onClick={() => setIsOpen(true)}
            >
              Apply
            </button>
          </div>
          {isOpen && (
            <ApplyModal
              key={id}
              projectId={id}
              closeModal={setIsOpen}
            ></ApplyModal>
          )}
        </div>
      </div>
    </div>
  );
}
