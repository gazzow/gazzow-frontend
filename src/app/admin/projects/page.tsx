"use client";

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
        console.log("User management error: ", error);
      }
    }
  }, [debouncedSearch, filterStatus, limit, sortOption, skip, setTotal]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (page !== 1) {
      prevPage();
    }
  }, [debouncedSearch, filterStatus, sortOption, page, prevPage]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">
              Projects Management
            </h1>
            <button className="px-2 py-1 bg-gray-200 text-black text-md font-semibold rounded-md transition cursor-pointer">
              Export
            </button>
          </div>
          <p className="text-text-muted text-sm">
            Manage and monitor all projects posted by creators.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:min-w-80 px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
            }}
            className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all" className="bg-secondary">
              All Status
            </option>
            {Object.values(ProjectStatus).map((val, index) => {
              return (
                <option key={index} value={val} className="bg-secondary">
                  {val
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              );
            })}
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option className="bg-secondary" value="newest">
              Newest First
            </option>
            <option className="bg-secondary" value="oldest">
              Oldest First
            </option>
            <option className="bg-secondary" value="title-asc">
              Title A → Z
            </option>
            <option className="bg-secondary" value="title-desc">
              Title Z → A
            </option>
          </select>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto shadow rounded-lg border border-border-primary">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-text-primary">
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
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No projects found
                </td>
              </tr>
            )}
            {projects?.map((project) => (
              <tr
                key={project.id}
                className="border border-border-primary hover:bg-secondary/30 transition"
              >
                <td className="p-3">
                  <span className="text-white font-medium">
                    {project.title}
                  </span>
                  <p className="text-gray-400">
                    {project.description.length > 45
                      ? project.description.slice(0, 45) + "..."
                      : project.description}
                  </p>
                </td>
                <td className="p-3">
                  <span
                    className={`flex text-xs font-semibold rounded-full text-white`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="p-3 text-white">
                  {project.contributors.length}
                </td>

                <td className="p-3 text-white">
                  {`${project.budgetMin}-${project.budgetMax}`}
                </td>

                <td className="p-3 text-white">
                  {`${project.durationMin}-${project.durationMax} ${project.durationUnit}`}
                </td>
                <td className="p-3 text-white">{project.visibility}</td>
                <td className="p-3 text-white">
                  {new Date(project.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>
                <td className="p-3">
                  <Link
                    href={ADMIN_ROUTES.PROJECT_DETAILS(project.id)}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition cursor-pointer"
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
      <div className="flex justify-between items-center mt-4 text-sm text-text-secondary">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={!hasPrevPage}
            onClick={prevPage}
            className="px-3 py-1 border rounded-md text-white hover:bg-secondary"
          >
            Previous
          </button>
          <button
            disabled={!hasNextPage}
            onClick={nextPage}
            className="px-3 py-1 border rounded-md text-white hover:bg-secondary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
