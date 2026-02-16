"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PlanDuration, PlanType } from "@/types/plan";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  EditPlanFormValues,
  editPlanSchema,
} from "@/validators/admin/edit-plan";
import { planService } from "@/services/admin/plan-service";
import {} from "@/components/layout/LoadingSpinner";

type EditPlanProps = {
  open: boolean;
  planId: string | null;
  onClose: () => void;
};

export default function EditPlanModal({
  open,
  planId,
  onClose,
}: EditPlanProps) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditPlanFormValues>({
    resolver: zodResolver(editPlanSchema),
  });

  const getPlan = useCallback(async () => {
    if (!planId) return;
    setLoading(true);
    try {
      const res = await planService.getPlan(planId);

      if (res.success) {
        reset({
          name: res.data.name,
          type: res.data.type,
          duration: res.data.duration,
          price: res.data.price,
          commissionRate: res.data.features?.commissionRate,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        toast.error("Failed to load plan");
      }
    } finally {
      setLoading(false);
    }
  }, [planId, reset]);

  useEffect(() => {
    if (open && planId) getPlan();
  }, [open, getPlan, planId]);

  // 🔹 Submit Update
  const onSubmit = async (data: EditPlanFormValues) => {
    if (!planId) return;
    setSubmitting(true);
    try {
      const res = await planService.updatePlan(planId, data);

      if (res.success) {
        toast.success("Plan updated successfully");
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Failed to update plan. Please try again later",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-primary p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Edit Subscription Plan
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-border-primary rounded-md bg-secondary/30 p-2 text-white"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Plan Type
              </label>
              <select
                {...register("type")}
                className="w-full border border-border-primary rounded-md bg-secondary/30 p-2 text-gray-300"
              >
                {Object.values(PlanType).map((type) => (
                  <option key={type} value={type} className="bg-secondary">
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Duration
              </label>
              <select
                {...register("duration")}
                className="w-full border border-border-primary rounded-md bg-secondary/30 p-2 text-gray-300"
              >
                {Object.values(PlanDuration).map((d) => (
                  <option key={d} value={d} className="bg-secondary">
                    {d.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full border border-border-primary rounded-md bg-secondary/30 p-2 text-white"
              />
            </div>

            {/* Commission */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                {...register("commissionRate", { valueAsNumber: true })}
                className="w-full border border-border-primary rounded-md bg-secondary/30 p-2 text-white"
              />
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
                {submitting ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
