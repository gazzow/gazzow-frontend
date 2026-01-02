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
  isFavorite: boolean;
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

  const handleApplyClick = async () => {
    try {
      const res = await userService.getUser();
      if (res.success && res.data.stripeAccountId) {
        setIsOpen(true);
      } else {
        toast.info(
          "Please complete your Stripe setup in Settings before applying for jobs. You need to be able to receive payments to work on paid projects."
        );
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error fetching user data: ", e.response?.data);
      }
    }
  };

  const markAsFavorite = async (projectId: string) => {
    if (isFavorite) {
      // Remove From Favorites
      console.log("removing from favorite");
      try {
        const res = await favoriteService.removeFromFavorite(projectId);
        if (res.success) {
          toast.success(res.message);
          onFavoriteToggle();
        } else {
          toast.warn(res.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error while remove from favorite: ", error);
          toast.error(
            error.response?.data.message ||
              "Remove from favorite Failed. Try again"
          );
        }
      }
    } else {
      // Add From Favorites
      console.log("Add As favorite");
      try {
        const res = await favoriteService.markAsFavorite(projectId);
        if (res.success) {
          toast.success(res.message);
          onFavoriteToggle();
        } else {
          toast.warn(res.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error while marking as favorite: ", error);
          toast.error(
            error.response?.data.message || "Mark As favorite Failed. Try again"
          );
        }
      }
    }
  };

  return (
    <div className="flex flex-col space-y-3 bg-secondary/30 p-4 rounded-md border border-gray-800 hover:border-gray-600 transition-all">
      <div className="flex justify-between">
        <h3 className="flex-1 text-white text-lg font-semibold">
          {title.replace(/\b\w/g, (c) => c.toUpperCase())}
        </h3>
        <button className="cursor-pointer" onClick={() => markAsFavorite(id)}>
          {isFavorite ? (
            <Star size={18} color="yellow" fill="yellow" />
          ) : (
            <Star size={18} />
          )}
        </button>
      </div>
      <p className="text-gray-400 text-sm line-clamp-1">{description}</p>

      <div className="flex flex-wrap gap-2">
        {requiredSkills.length > 4
          ? requiredSkills.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700"
              >
                {tech}
              </span>
            ))
          : requiredSkills.map((tech) => (
              <span
                key={tech}
                className="text-xs bg-gray-800 px-2 py-0.5 rounded-full border border-gray-700"
              >
                {tech}
              </span>
            ))}
      </div>

      <div className="flex items-center text-sm text-gray-400 gap-4 ">
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
            {!isContributor && (
              <button
                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded cursor-pointer transition ease-in"
                onClick={handleApplyClick}
              >
                Apply
              </button>
            )}
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
