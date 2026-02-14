"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { Calendar, DollarSign, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ApplyModal from "./ApplyModal";
import { toast } from "react-toastify";
import axios from "axios";
import { userService } from "@/services/user/user-service";
import { favoriteService } from "@/services/user/favorite.service";

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
  isContributor?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle: () => void;
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
  isContributor,
  isFavorite,
  onFavoriteToggle,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await userService.getUser();
      if (res.success && res.data.stripeAccountId) {
        setIsOpen(true);
      } else {
        toast.warn(
          "Please complete your Stripe setup in Settings before applying for jobs.",
        );
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error fetching user data: ", e.response?.data);
      }
    }
  };

  const markAsFavorite = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    e.preventDefault();

    console.log(
      "marking as favorite, projectId: ",
      projectId,
      " isFavorite: ",
      isFavorite,
    );
    if (isFavorite) {
      // Remove From Favorites
      console.log("removing from favorite");
      try {
        const res = await favoriteService.removeFromFavorite(projectId);
        if (res.success) {
          onFavoriteToggle();
        } else {
          toast.warn(res.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error while remove from favorite: ", error);
          toast.error(
            error.response?.data.message ||
              "Remove from favorite Failed. Try again",
          );
        }
      }
    } else {
      try {
        const res = await favoriteService.markAsFavorite(projectId);
        if (res.success) {
          onFavoriteToggle();
        } else {
          toast.warn(res.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error while marking as favorite: ", error);
          toast.error(
            error.response?.data.message ||
              "Mark As favorite Failed. Try again",
          );
        }
      }
    }
  };

  return (
    <Link
      href={PROJECT_ROUTES.DETAILS(id)}
      className="flex flex-col space-y-3 p-4 rounded-md border transition-all
                bg-white dark:bg-secondary/30
                border-gray-200 dark:border-gray-800
                hover:border-gray-400 dark:hover:border-gray-600"
    >
      <div className="flex justify-between">
        <h3 className="flex-1 text-black dark:text-white text-lg font-semibold">
          {title.replace(/\b\w/g, (c) => c.toUpperCase())}
        </h3>

        {isFavorite !== undefined && (
          <button
            className="cursor-pointer"
            onClick={(e) => markAsFavorite(e, id)}
          >
            {isFavorite ? (
              <Star size={18} color="yellow" fill="yellow" />
            ) : (
              <Star size={18} className="text-black dark:text-white" />
            )}
          </button>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {/* Show first 3 skills */}
        {requiredSkills.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="
        text-xs px-2 py-0.5 rounded-full border
        bg-gray-200 dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        border-gray-300 dark:border-gray-700
      "
          >
            {tech}
          </span>
        ))}

        {/* Show +More Badge */}
        {requiredSkills.length > 3 && (
          <span
            className="
       text-xs px-2 py-0.5 rounded-full border
        bg-gray-200 dark:bg-gray-800
        text-gray-800 dark:text-gray-200
        border-gray-300 dark:border-gray-700
        font-medium
      "
          >
            +{requiredSkills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-8">
        <div className="flex items-center gap-1">
          <DollarSign size={14} /> {budgetMin} - {budgetMax}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} /> {durationMin}-{durationMax} {durationUnit}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
          <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-black dark:text-white font-semibold">
            M
          </div>
          <div>
            <div className="text-sm">Muhammed Abbas</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isContributor && (
            <button
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded cursor-pointer transition"
              onClick={(e) => handleApplyClick(e)}
            >
              Apply
            </button>
          )}

          {isOpen && (
            <ApplyModal key={id} projectId={id} closeModal={setIsOpen} />
          )}
        </div>
      </div>
    </Link>
  );
}
