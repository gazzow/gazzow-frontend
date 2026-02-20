"use client";

import { useCallback, useEffect, useState } from "react";
import { SectionTabs } from "@/components/features/SectionTabs";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { contributorService } from "@/services/user/contributor.service";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import {
  ApplicationStatus,
  IApplicationWithPopulatedProject,
} from "@/types/application";
import ProposalCard from "@/components/features/ProposalCard";
import { handleApiError } from "@/utils/handleApiError";

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

  const fetchProposals = useCallback(async () => {
    try {
      const res = await contributorService.listContributorProposals({
        status: ApplicationStatus.PENDING,
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
      handleApiError(error);
    }
  }, [setTotal, skip, limit]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  return (
    <div
      className="max-w-7xl w-full flex flex-col space-y-6
                text-black dark:text-white transition-colors"
    >
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            Contributions
          </h1>
          <p className="text-gray-600 dark:text-text-secondary">
            Discover and manage projects that match your expertise
          </p>
        </div>
      </div>

      {/* Section Tab */}
      <SectionTabs tabs={tabs} />

      {/* Proposal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {applications.length > 0 ? (
          applications.map((p, index) => <ProposalCard {...p} key={index} />)
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No proposal found</p>
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
