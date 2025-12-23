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
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-black/50 ">
      <div className="w-full max-w-md rounded-lg bg-secondary p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Create Subscription Plan
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-border-primary rounded-md bg-secondary p-2 text-white"
              placeholder="eg: Base Plan"
            />
            {errors.type && (
              <p className="text-xs text-red-500">{errors.name?.message}</p>
            )}
          </div>

          {/* Plan Type */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Plan Type
            </label>
            <select
              {...register("type")}
              className="w-full border border-border-primary rounded-md bg-secondary p-2 text-white"
            >
              {Object.values(PlanType).map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration</label>
            <select
              {...register("duration")}
              className="w-full border border-border-primary rounded-md bg-secondary p-2 text-white"
            >
              {Object.values(PlanDuration).map((duration) => (
                <option key={duration} value={duration}>
                  {duration.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-xs text-red-500">{errors.duration.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Price</label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-border-primary rounded-md bg-secondary p-2 text-white"
              placeholder="e.g. 999"
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Commission Rate */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Commission Rate (%)
            </label>
            <input
              type="number"
              {...register("commissionRate", {
                valueAsNumber: true,
              })}
              className="w-full border border-border-primary rounded-md bg-secondary p-2 text-white"
              placeholder="e.g. 10"
            />
            {errors.commissionRate && (
              <p className="text-xs text-red-500">
                {errors.commissionRate.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-btn-primary px-2 py-1 text-sm text-white hover:bg-btn-primary-hover disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
