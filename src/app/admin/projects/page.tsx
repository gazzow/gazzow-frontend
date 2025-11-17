"use client";

import { projectManagementService } from "@/services/admin/project-management";
import { IProject, ProjectStatus } from "@/types/project";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function ProjectManagement() {
  const [projects, setProjects] = useState<IProject[]>([]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [search, setSearch] = useState("");

  // const getSortParams = (sortOption: string) => {
  //   switch (sortOption) {
  //     case "newest":
  //       return { sortField: "createdAt", sortOrder: "desc" };
  //     case "oldest":
  //       return { sortField: "createdAt", sortOrder: "asc" };
  //     case "name-asc":
  //       return { sortField: "name", sortOrder: "asc" };
  //     case "name-desc":
  //       return { sortField: "name", sortOrder: "desc" };
  //     default:
  //       return { sortField: "createdAt", sortOrder: "desc" };
  //   }
  // };

  const fetchProjects = useCallback(async () => {
    try {
      const res = await projectManagementService.listProjects();
      console.log("Projects list data: ", res.data);
      if (res.success) {
        setProjects(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("User management error: ", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:min-w-80 px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
            }}
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            {Object.values(ProjectStatus).map((val, index) => {
              return (
                <option key={index} value={val}>
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
            className="px-3 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title A → Z</option>
            <option value="title-desc">Title Z → A</option>
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
                  <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 transition cursor-pointer">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    </div>
  );
}
