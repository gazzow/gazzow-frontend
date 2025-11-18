"use client";

import { useState, useCallback } from "react";

interface UsePaginationOptions {
  limit?: number;
  initialPage?: number;
}

export function usePagination({
  limit = 6,
  initialPage = 1,
}: UsePaginationOptions = {}) {
  // state
  const [page, setPage] = useState<number>(initialPage);
  const [total, setTotal] = useState<number>(0);

  // derived values
  const skip = (page - 1) * limit;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // handlers
  const nextPage = useCallback(() => {
    if (hasNextPage) setPage((prev) => prev + 1);
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) setPage((prev) => prev - 1);
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setPage(pageNumber);
      }
    },
    [totalPages]
  );

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    // values
    page,
    skip,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,

    // setters
    setTotal,
    setPage,

    // functions
    nextPage,
    prevPage,
    goToPage,
    reset,
  };
}
