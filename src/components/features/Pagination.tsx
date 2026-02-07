"use client";

interface PaginationProp {
  page: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: () => void;
  nextPage: () => void;
}

export default function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  nextPage,
  prevPage,
}: PaginationProp) {
  return (
    <div
      className="flex justify-between items-center mt-auto text-sm
                text-gray-700 dark:text-text-secondary transition-colors"
    >
      <p>
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          disabled={!hasPrevPage}
          onClick={prevPage}
          className={`px-2 py-1 border rounded-md transition-colors
        border-gray-300 dark:border-border-primary
        text-black dark:text-white
        ${hasPrevPage ? "hover:bg-gray-200 dark:hover:bg-secondary" : "cursor-not-allowed opacity-60"}
      `}
        >
          Previous
        </button>

        <button
          disabled={!hasNextPage}
          onClick={nextPage}
          className={`px-2 py-1 border rounded-md transition-colors
        border-gray-300 dark:border-border-primary
        text-black dark:text-white
        ${hasNextPage ? "hover:bg-gray-200 dark:hover:bg-secondary" : "cursor-not-allowed opacity-60"}
      `}
        >
          Next
        </button>
      </div>
    </div>
  );
}
