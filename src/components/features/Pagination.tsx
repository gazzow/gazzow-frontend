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
    <div className="flex justify-between items-center mt-auto text-sm text-text-secondary">
      <p>
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={!hasPrevPage}
          onClick={prevPage}
          className={`px-2 py-1 border border-border-primary rounded-md text-white ${
            hasPrevPage ? " hover:bg-secondary" : "cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <button
          disabled={!hasNextPage}
          onClick={nextPage}
          className={`px-2 py-1 border border-border-primary rounded-md text-white  ${
            hasNextPage ? " hover:bg-secondary" : "cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
