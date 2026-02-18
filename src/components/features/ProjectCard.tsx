"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import {
  Calendar,
  DollarSign,
  FileText,
  Star,
  User,
  Users2,
} from "lucide-react";
import ApplyModal from "./ApplyModal";
import { toast } from "react-toastify";
import axios from "axios";
import { favoriteService } from "@/services/user/favorite.service";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentService } from "@/services/user/payment-service";
import Image from "next/image";
import { Contributor } from "@/types/project";

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
  creator: {
    name: string;
    imageUrl: string;
  };
  rating?: number;
  contributors: Contributor[];
  applicationCount: number;
  contributorsCount?: number;
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
  creator,
  contributors,
  applicationCount,
  contributorsCount,
  isContributor,
  isFavorite,
  onFavoriteToggle,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const handleProjectCardClick = () => {
    router.push(PROJECT_ROUTES.DETAILS(id));
  };

  const handleApplyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await paymentService.checkOnboardingStatus();
      if (res.success && res.data.isOnboarded) {
        setIsOpen(true);
      } else {
        toast.warn(
          <p className="text-sm">
            Please complete your Stripe setup in your Profile before applying to
            projects. This is required to receive payments.
          </p>,
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
    <div
      onClick={handleProjectCardClick}
      className="flex flex-col space-y-3 p-4 rounded-md border transition-all
                bg-white dark:bg-secondary/30
                border-gray-200 dark:border-gray-800
                hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer"
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
              <Star size={18} color="orange" fill="orange" />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              {creator?.imageUrl ? (
                <Image
                  fill
                  src={creator.imageUrl}
                  alt={creator.name || "Creator"}
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white">
                  <User size={16} />
                </div>
              )}
            </div>

            <div>
              <span className="text-sm">{creator?.name || "Unknown"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Applications count */}
          {isContributor ? (
            <div className="flex gap-2 items-center  text-gray-200">
              <Users2 size={18} />
              <p>{contributorsCount || contributors.length}</p>
            </div>
          ) : (
            <div className="flex gap-2 items-center text-gray-500   dark:text-gray-200">
              <FileText size={18} />
              <p>{applicationCount}</p>
            </div>
          )}

          {!isContributor && (
            <button
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded cursor-pointer transition"
              onClick={(e) => handleApplyClick(e)}
            >
              Apply
            </button>
          )}
        </div>

        {isOpen && (
          <ApplyModal
            key={id}
            projectId={id}
            closeModal={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
