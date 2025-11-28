"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SectionTabs } from "@/components/features/SectionTabs";
import { useDebounce } from "@/hook/useDebounce";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { contributorService } from "@/services/user/contributor-service";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import {
  ApplicationStatus,
  IApplicationWithPopulatedProject,
} from "@/types/application";
import { ProjectFilters } from "@/types/project";
import ProposalCard from "@/components/features/ProposalCard";

const tabs = [
  { name: "Active", href: CONTRIBUTOR_ROUTES.ACTIVE },
  { name: "Pending", href: CONTRIBUTOR_ROUTES.PENDING },
  { name: "Rejected", href: CONTRIBUTOR_ROUTES.REJECTED },
  { name: "Completed", href: CONTRIBUTOR_ROUTES.COMPLETED },
];

export default function ListPendingProposalPage() {
  const [applications, setApplications] = useState<
    IApplicationWithPopulatedProject[]
  >([]);
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

  const fetchProposals = useCallback(async () => {
    try {
      const res = await contributorService.listContributorProposals({
        search: debouncedSearch,
        status: ApplicationStatus.REJECTED,
        skip,
        limit,
      });

      if (res.success) {
        console.log("res data: ", res.data);
        console.log("res meta: ", res.meta);
        setApplications(res.data);
        setTotal(res.meta.total);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [setTotal, debouncedSearch, skip, limit]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

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
      {/* <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:min-w-80 px-3 py-2 rounded-lg border border-border-primary text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

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
      </div> */}

      {/* Proposal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {applications.length > 0 ? (
          applications.map((p, index) => <ProposalCard {...p} key={index} />)
        ) : (
          <p>No proposal found</p>
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
