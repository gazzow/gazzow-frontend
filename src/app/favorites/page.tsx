"use client";

import Pagination from "@/components/features/Pagination";
import ProjectCard from "@/components/features/ProjectCard";
import { usePagination } from "@/hook/usePaginationOptions";
import { favoriteService } from "@/services/user/favorite.service";
import { IPopulatedFavorite } from "@/types/favorite";
import { ProjectExperience } from "@/types/project";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<IPopulatedFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    skip,
    limit,
    page,
    totalPages,
    hasPrevPage,
    hasNextPage,
    nextPage,
    prevPage,
    setTotal,
  } = usePagination({ limit: 12 });

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await favoriteService.listFavorites(skip, limit);
      if (res.success) {
        setFavorites(res.data);
        setTotal(res.meta.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to load favorites",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [setTotal, limit, skip]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const onFavoriteToggle = () => {
    fetchFavorites();
  };

  return (
    <div
      className="max-w-7xl w-full flex flex-col space-y-6
                text-black dark:text-white transition-colors"
    >
      <div className="flex justify-between mb-5">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Favorites
          </h1>
          <p className="text-gray-600 dark:text-text-secondary">
            Manage and revisit the projects you’ve marked as important for your
            career.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by title or description"
          className="md:min-w-80 px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* Experience Filter */}
        <select
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">Experience Level</option>
          {Object.values(ProjectExperience).map((exp) => (
            <option key={exp} value={exp}>
              {exp.replace(/\b\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        {/* Budget Sorting */}
        <select
          className="px-3 py-2 rounded-lg border
                 bg-gray-100 dark:bg-secondary
                 text-black dark:text-white
                 border-gray-300 dark:border-border-primary
                 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option>Budget Sort</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">
            Loading favorites...
          </p>
        ) : favorites.length > 0 ? (
          favorites.map((favorite) => (
            <ProjectCard
              key={favorite.project.id}
              {...favorite.project}
              isFavorite={true}
              isContributor={true}
              onFavoriteToggle={onFavoriteToggle}
            />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No favorites yet</p>
        )}
      </div>

      {favorites.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}
