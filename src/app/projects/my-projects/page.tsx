"use client";
import CreatedProjectCard from "@/components/features/CreatedProjectCard";
import Pagination from "@/components/features/Pagination";
import { SectionTabs } from "@/components/features/SectionTabs";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useDebounce } from "@/hook/useDebounce";
import { usePagination } from "@/hook/usePaginationOptions";
import { projectService } from "@/services/user/project-service";
import { IProject, ProjectStatus } from "@/types/project";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type ProjectFilters = {
  status?: string;
  budgetOrder?: "asc" | "desc" | "";
};

const tabs = [
  { name: "Browse Projects", href: PROJECT_ROUTES.BROWSE },
  { name: "My Projects", href: PROJECT_ROUTES.MY_PROJECTS },
];

// Return project progress percentage
const ProjectProgress = (status: ProjectStatus): number => {
  switch (status) {
    case ProjectStatus.OPEN: {
      return 0;
    }
    case ProjectStatus.IN_PROGRESS: {
      return 75;
    }
    case ProjectStatus.COMPLETED: {
      return 100;
    }
    default: {
      return 0;
    }
  }
};

export default function MyProject() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    status: "",
    budgetOrder: "",
  });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const {
    page,
    totalPages,
    setTotal,
    skip,
    limit,
    hasNextPage,
    hasPrevPage,
    prevPage,
    nextPage,
  } = usePagination({
    limit: 6,
  });

  const updateFilter = (key: keyof ProjectFilters, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const fetchProjects = useCallback(async () => {
    try {
      const res = await projectService.myProjects({
        search: debouncedSearch,
        ...filters,
        limit,
        skip,
      });
      if (res.success) {
        console.log("res data: ", res.data);
        setProjects(res.data);
        setTotal(res.meta.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [setTotal, filters, debouncedSearch, skip, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
          <Link href={PROJECT_ROUTES.CREATE}>
            <button className="flex items-center gap-2 text-white bg-btn-primary py-1 px-2 rounded cursor-pointer">
              <Plus size={18} />
              Post Project
            </button>
          </Link>
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
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Status</option>
          {Object.values(ProjectStatus).map((status, index) => (
            <option key={index} value={status}>
              {status
                .replaceAll("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Budget Sorting */}
        <select
          value={filters.budgetOrder}
          onChange={(e) => updateFilter("budgetOrder", e.target.value)}
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Latest</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length > 0 ? (
          projects.map((p) => (
            <CreatedProjectCard
              key={p.id}
              id={p.id}
              title={p.title}
              budgetMin={p.budgetMin}
              budgetMax={p.budgetMax}
              durationMin={p.durationMin}
              durationMax={p.durationMax}
              durationUnit={p.durationUnit}
              applicants={12}
              progress={ProjectProgress(p.status)}
              contributors={p.contributors.length}
              status={p.status}
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
