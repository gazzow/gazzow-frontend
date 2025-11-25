"use client";

import ProjectCard from "@/components/features/ProjectCard";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IProject, ProjectFilters } from "../../types/project";
import { SectionTabs } from "@/components/features/SectionTabs";
import { useDebounce } from "@/hook/useDebounce";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { contributorService } from "@/services/user/contributor-service";
import { ContributorRoutes } from "@/constants/routes/contributor-routes";

const tabs = [
  { name: "Active", href: ContributorRoutes.ACTIVE },
  { name: "Pending", href: ContributorRoutes.PENDING },
  { name: "Completed", href: ContributorRoutes.COMPLETED },
  { name: "Rejected", href: ContributorRoutes.REJECTED },
];

export default function ProjectList() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [filters, setFilters] = useState<ProjectFilters>({
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
      const res = await contributorService.listContributorProjects({
        search: debouncedSearch,
        budgetOrder: filters.budgetOrder,
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
  }, [setTotal, debouncedSearch, filters, skip, limit]);

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
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard key={p.id} {...p} isContributor={true} />
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
