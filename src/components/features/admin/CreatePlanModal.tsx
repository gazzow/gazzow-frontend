"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreatePlanFormValues,
  createPlanSchema,
} from "@/validators/create-plan";
import { PlanDuration, PlanType } from "@/types/plan";

interface CreatePlanModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanFormValues) => Promise<void>;
}

export default function CreatePlanModal({
  open,
  onClose,
  onSubmit,
}: CreatePlanModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {},
  });

  const handleFormSubmit = async (data: CreatePlanFormValues) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-black/40">
      <div
        className="
    w-full max-w-md
    rounded-xl
    bg-white dark:bg-secondary
    border border-gray-200 dark:border-border-primary
    p-6 shadow-xl
    transition-colors duration-300
  "
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Create Subscription Plan
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="eg: Base Plan"
              className="
          w-full rounded-md p-2
          bg-white dark:bg-secondary/40
          border border-gray-300 dark:border-border-primary
          text-gray-800 dark:text-white
          focus:outline-none focus:ring-1 focus:ring-btn-primary
        "
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Plan Type
            </label>
            <select
              {...register("type")}
              className="
          w-full rounded-md p-2
          bg-white dark:bg-secondary/40
          border border-gray-300 dark:border-border-primary
          text-gray-800 dark:text-white
        "
            >
              {Object.values(PlanType).map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-white dark:bg-secondary"
                >
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-xs text-red-500 mt-1">{errors.type.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Duration
            </label>
            <select
              {...register("duration")}
              className="
          w-full rounded-md p-2
          bg-white dark:bg-secondary/40
          border border-gray-300 dark:border-border-primary
          text-gray-800 dark:text-white
        "
            >
              {Object.values(PlanDuration).map((duration) => (
                <option
                  key={duration}
                  value={duration}
                  className="bg-white dark:bg-secondary"
                >
                  {duration.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-xs text-red-500 mt-1">
                {errors.duration.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g. 999"
              className="
          w-full rounded-md p-2
          bg-white dark:bg-secondary/40
          border border-gray-300 dark:border-border-primary
          text-gray-800 dark:text-white
          focus:outline-none focus:ring-1 focus:ring-btn-primary
        "
            />
            {errors.price && (
              <p className="text-xs text-red-500 mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Commission */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
              Commission Rate (%)
            </label>
            <input
              type="number"
              {...register("commissionRate", { valueAsNumber: true })}
              placeholder="e.g. 10"
              className="
          w-full rounded-md p-2
          bg-white dark:bg-secondary/40
          border border-gray-300 dark:border-border-primary
          text-gray-800 dark:text-white
          focus:outline-none focus:ring-1 focus:ring-btn-primary
        "
            />
            {errors.commissionRate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.commissionRate.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="
          rounded-md px-3 py-1 text-sm
          bg-gray-200 dark:bg-secondary/40
          text-gray-700 dark:text-gray-300
          hover:bg-gray-300 dark:hover:bg-secondary/60 cursor-pointer
        "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="
          rounded-md px-3 py-1 text-sm
          bg-btn-primary text-white
          hover:bg-btn-primary-hover
          disabled:opacity-50 cursor-pointer
        "
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
