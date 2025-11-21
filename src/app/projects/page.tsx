"use client";

import ProjectCard from "@/components/features/ProjectCard";
import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  IProject,
  ProjectExperience,
  ProjectFilters,
} from "../../types/project";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import ProjectTabs from "@/components/features/ProjectTabs";
import { useDebounce } from "@/hook/useDebounce";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";

const tabs = [
  { name: "Browse Projects", href: PROJECT_ROUTES.BROWSE },
  { name: "My Projects", href: PROJECT_ROUTES.MY_PROJECTS },
];

export default function ProjectList() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
    experience: "",
    budgetOrder: "asc",
  });
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
    limit: 6,
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

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, debouncedSearch, filters]);

  return (
    <div className="max-w-7xl w-full flex flex-col shadow-lg space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-primary dark:text-white font-semibold text-2xl">
            Projects
          </h1>
          <p className="text-primary dark:text-text-secondary">
            Discover and manage projects that match your expertise
          </p>
        </div>
        <div>
          <Link href={PROJECT_ROUTES.CREATE}>
            <button className="flex items-center gap-2 bg-btn-primary py-1 px-2 rounded cursor-pointer">
              <Plus size={18} />
              <span>Post Project</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Project Tab */}
      <ProjectTabs tabs={tabs} />

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:min-w-80 px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* 🧠 Experience Filter */}
        <select
          value={filters.experience}
          onChange={(e) => updateFilter("experience", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option className="bg-secondary" value="">
            Experience Level
          </option>
          {Object.values(ProjectExperience).map((exp) => (
            <option key={exp} value={exp} className="bg-secondary">
              {exp.replace(/\b\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        {/* 🧩 Skills Multi-Select */}

        {/* 💰 Budget Sorting */}
        <select
          value={filters.budgetOrder}
          onChange={(e) => updateFilter("budgetOrder", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option className="bg-secondary">Budget Sort</option>
          <option value="asc" className="bg-secondary">
            Low → High
          </option>
          <option value="desc" className="bg-secondary">
            High → Low
          </option>
        </select>

        {/* ⏳ Duration Sorting */}
        {/* <select
          value={filters.durationSort}
          onChange={(e) => updateFilter("durationSort", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="" className="bg-secondary">
            Duration
          </option>
          <option value="short" className="bg-secondary">
            Shortest First
          </option>
          <option value="long" className="bg-secondary">
            Longest First
          </option>
        </select> */}

        {/* 🕓 Duration Unit */}
        {/* <select
          value={filters.durationUnit}
          onChange={(e) => updateFilter("durationUnit", e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="" className="bg-secondary">
            Duration Unit
          </option>
          {Object.values(ProjectDurationUnit).map((unit) => (
            <option key={unit} value={unit} className="bg-secondary">
              {unit.replace(/\b\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select> */}
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.length > 0 ? (
          projects.map((p) => <ProjectCard key={p.id} {...p} />)
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
