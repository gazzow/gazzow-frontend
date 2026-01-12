"use client";

import ProjectCard from "@/components/features/ProjectCard";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { SectionTabs } from "@/components/features/SectionTabs";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { contributorService } from "@/services/user/contributor.service";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import { IProject } from "@/types/project";
import { useAppSelector } from "@/store/store";

const tabs = [
  { name: "Active", href: CONTRIBUTOR_ROUTES.ACTIVE },
  { name: "Pending", href: CONTRIBUTOR_ROUTES.PENDING },
  { name: "Rejected", href: CONTRIBUTOR_ROUTES.REJECTED },
  { name: "Completed", href: CONTRIBUTOR_ROUTES.COMPLETED },
];

export default function ProjectList() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const userId = useAppSelector((state) => state.user.id);

  const { page, totalPages, hasNextPage, hasPrevPage, prevPage, nextPage } =
    usePagination({
      limit: 6,
    });

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await contributorService.listCompletedContributions({
        userId,
      });

      if (res.success) {
        console.log("res data: ", res.data);
        setProjects(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="max-w-7xl w-full flex flex-col shadow-lg space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-primary dark:text-white font-semibold text-2xl">
            Contributions
          </h1>
          <p className="text-primary dark:text-text-secondary">
            Discover and manage projects that match your expertise
          </p>
        </div>
      </div>

      {/* Section Tab */}
      <SectionTabs tabs={tabs} />

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              {...p}
              onFavoriteToggle={() => fetchProjects()}
              isContributor={true}
            />
          ))
        ) : (
          <p>No project found</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  );
}
