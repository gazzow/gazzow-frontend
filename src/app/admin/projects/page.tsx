"use client";

import Pagination from "@/components/features/Pagination";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { useDebounce } from "@/hook/useDebounce";
import { usePagination } from "@/hook/usePaginationOptions";
import { projectManagementService } from "@/services/admin/project-management";
import { IProject, ProjectStatus } from "@/types/project";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<IProject[]>([]);

  const {
    page,
    skip,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotal,
    goToPage,
  } = usePagination({ limit: 6 });

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const getSortParams = (sortOption: string) => {
    switch (sortOption) {
      case "newest":
        return { sortField: "createdAt", sortOrder: "desc" };
      case "oldest":
        return { sortField: "createdAt", sortOrder: "asc" };
      case "title-asc":
        return { sortField: "title", sortOrder: "asc" };
      case "title-desc":
        return { sortField: "title", sortOrder: "desc" };
      default:
        return { sortField: "createdAt", sortOrder: "desc" };
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      const { sortField, sortOrder } = getSortParams(sortOption);
      const res = await projectManagementService.listProjects({
        skip,
        limit,
        search: debouncedSearch || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        sortField,
        sortOrder,
      });
      console.log("Projects list data: ", res.data);
      if (res.success) {
        setProjects(res.data);
        setTotal(res.meta.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Project management error: ", error);
      }
    }
  }, [debouncedSearch, filterStatus, limit, setTotal, skip, sortOption]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    goToPage(1);
  }, [debouncedSearch, filterStatus, sortOption, goToPage]);

  return (
    <div
      className="
  p-6
  bg-gray-50 dark:bg-transparent
  text-gray-800 dark:text-white
  transition-colors duration-300
"
    >
      {/* Header */}
      <div
        className="
    flex flex-col gap-4 p-5 rounded-xl mb-6
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    shadow-sm dark:shadow-none
  "
      >
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projects Management
            </h1>
          </div>

          <p className="text-gray-500 dark:text-text-muted text-sm">
            Manage and monitor all projects posted by creators.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
        md:min-w-80 px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
        focus:outline-none focus:ring-1 focus:ring-btn-primary
      "
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="
        px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
      "
          >
            <option value="all" className="bg-white dark:bg-secondary">
              All Status
            </option>
            {Object.values(ProjectStatus).map((val, index) => (
              <option
                key={index}
                value={val}
                className="bg-white dark:bg-secondary"
              >
                {val.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="
        px-3 py-2 rounded-lg
        bg-white dark:bg-secondary/40
        border border-gray-300 dark:border-border-primary
        text-gray-800 dark:text-white
      "
          >
            <option className="bg-white dark:bg-secondary" value="newest">
              Newest First
            </option>
            <option className="bg-white dark:bg-secondary" value="oldest">
              Oldest First
            </option>
            <option className="bg-white dark:bg-secondary" value="title-asc">
              Title A → Z
            </option>
            <option className="bg-white dark:bg-secondary" value="title-desc">
              Title Z → A
            </option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    rounded-xl mb-4
    shadow-sm dark:shadow-none
    
  "
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Contributors</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Visibility</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No projects found
                </td>
              </tr>
            )}

            {projects?.map((project) => (
              <tr
                key={project.id}
                className="
            border-t border-gray-200 dark:border-border-primary
            hover:bg-gray-50 dark:hover:bg-secondary/30
            transition-colors
          "
              >
                <td className="p-3">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {project.title}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {project.description.length > 45
                      ? project.description.slice(0, 45) + "..."
                      : project.description}
                  </p>
                </td>

                <td className="p-3 text-gray-700 dark:text-gray-300">
                  {project.status.replace("_", " ")}
                </td>

                <td className="p-3">{project.contributors.length}</td>

                <td className="p-3">
                  {`${project.budgetMin}-${project.budgetMax}`}
                </td>

                <td className="p-3">
                  {`${project.durationMin}-${project.durationMax} ${project.durationUnit}`}
                </td>

                <td className="p-3">{project.visibility}</td>

                <td className="p-3">
                  {new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                <td className="p-3">
                  <Link
                    href={ADMIN_ROUTES.PROJECT_DETAILS(project.id)}
                    className="
                px-3 py-1 rounded-md text-xs font-medium
                bg-gray-100 dark:bg-secondary/40
                text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-secondary/60
                transition cursor-pointer
              "
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        nextPage={nextPage}
        page={page}
        prevPage={prevPage}
        totalPages={totalPages}
      />
    </div>
  );
}
