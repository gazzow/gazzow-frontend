import { useEffect, useRef } from "react";

type ConfirmModalProps = {
  label: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ label, onClose, onConfirm }: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseDownEvent = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as HTMLElement)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDownEvent);

    return () =>
      document.removeEventListener("mousedown", handleMouseDownEvent);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="w-full max-w-md bg-white dark:bg-primary border border-gray-200 dark:border-border-primary p-6 rounded-2xl shadow-xl"
        ref={modalRef}
      >
        <p className="font-semibold text-lg">
          {`Are you sure you want to delete this ${label}?`}
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-secondary dark:hover:bg-secondary/80 cursor-pointer"
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
