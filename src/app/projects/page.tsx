"use client";

import ProjectCard from "@/components/features/ProjectCard";
import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  IAggregatedProject,
  ProjectExperience,
  ProjectFilters,
} from "../../types/project";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { SectionTabs } from "@/components/features/SectionTabs";
import { useDebounce } from "@/hook/useDebounce";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { useRouter } from "next/navigation";
import { paymentService } from "@/services/user/payment-service";

const tabs = [
  { name: "Browse Projects", href: PROJECT_ROUTES.BROWSE },
  { name: "My Projects", href: PROJECT_ROUTES.MY_PROJECTS },
];

export default function ProjectList() {
  const [projects, setProjects] = useState<IAggregatedProject[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    experience: "",
    budgetOrder: "asc",
  });
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const {
    skip,
    limit,
    page,
    totalPages,
    setTotal,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
  } = usePagination({
    limit: 12,
  });

  const updateFilter = (key: keyof ProjectFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const fetchProjects = useCallback(async () => {
    try {
      const res = await projectService.listProjects({
        search: debouncedSearch,
        ...filters,
        skip,
        limit,
      });
      if (res.success) {
        console.log("res data: ", res.data);
        console.log("res meta: ", res.meta);
        setProjects(res.data);
        setTotal(res.meta.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [debouncedSearch, filters, setTotal, skip, limit]);

  const onFavoriteToggle = () => {
    fetchProjects();
  };

  const handlePostProjectClick = async () => {
    try {
      const res = await paymentService.checkOnboardingStatus();
      if (res.success && res.data.isOnboarded) {
        router.push(PROJECT_ROUTES.CREATE);
      } else {
        toast.warn(
          <p className="text-sm">
            Please complete your Stripe setup in your Profile before posting a
            project. Payment configuration is required to manage project funding
            and transactions.
          </p>,
        );
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error fetching user data: ", e.response?.data);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, debouncedSearch, filters]);

  return (
    <div
      className="max-w-7xl w-full flex flex-col space-y-6
                text-black dark:text-white transition-colors"
    >
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Projects
          </h1>
          <p className="text-gray-600 dark:text-text-secondary">
            Discover and manage projects that match your expertise
          </p>
        </div>

        <div>
          <button
            onClick={handlePostProjectClick}
            className="flex items-center gap-2 bg-btn-primary py-1 px-2 rounded cursor-pointer text-white"
          >
            <Plus size={18} />
            <span>Post Project</span>
          </button>
        </div>
      </div>

      {/* Project Tab */}
      <SectionTabs tabs={tabs} />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:min-w-80 px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary/30
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* Experience Filter */}
        <select
          value={filters.experience}
          onChange={(e) => updateFilter("experience", e.target.value)}
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary/30
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option className="dark:bg-secondary" value="">
            Experience Level
          </option>
          {Object.values(ProjectExperience).map((exp) => (
            <option className="dark:bg-secondary" key={exp} value={exp}>
              {exp.replace(/\b\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Budget Sorting */}
        <select
          value={filters.budgetOrder}
          onChange={(e) => updateFilter("budgetOrder", e.target.value)}
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary/30
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option className="dark:bg-secondary">Budget Sort</option>
          <option className="dark:bg-secondary" value="asc">
            Low → High
          </option>
          <option className="dark:bg-secondary" value="desc">
            High → Low
          </option>
        </select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              {...p}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No project found</p>
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
