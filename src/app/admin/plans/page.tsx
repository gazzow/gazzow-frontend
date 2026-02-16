"use client";

import CreatePlanModal from "@/components/features/admin/CreatePlanModal";
import EditPlanModal from "@/components/features/admin/EditPlanModal";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { planService } from "@/services/admin/plan-service";
import { IPlan } from "@/types/plan";
import { CreatePlanFormValues } from "@/validators/create-plan";
import axios from "axios";
import { Edit } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PlanManagement() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [openPlanModal, setOpenPlanModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const {
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination({ limit: 6 });

  const handleOpenModal = () => {
    setOpenPlanModal(true);
  };

  const handleCloseModal = () => {
    setOpenPlanModal(false);
  };

  const handleOpenEditModal = (planId: string) => {
    setOpenEditModal(true);
    setSelectedPlanId(planId);
  };

  const handleCloseEditModal = () => {
    fetchPlans();
    setOpenEditModal(false);
  };

  const fetchPlans = useCallback(async () => {
    try {
      const res = await planService.listPlans();
      console.log("plans data: ", res.data);
      if (res.success) {
        setPlans(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Project management error: ", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  const handleCreatePlan = async (data: CreatePlanFormValues) => {
    const payload: Partial<IPlan> = {
      name: data.name,
      type: data.type,
      price: data.price,
      duration: data.duration,
      features: {
        commissionRate: data.commissionRate,
      },
    };
    try {
      const res = await planService.createPlan(payload);
      if (res.success) {
        fetchPlans();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          toast.error(
            error.response?.data.message ||
              "Unable to create plan. Please try again later",
          ),
        );
      }
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">Plan Management</h1>
            <button
              className="px-2 py-1 bg-btn-primary text-white text-md font-semibold rounded-md transition cursor-pointer"
              onClick={handleOpenModal}
            >
              Create Plan
            </button>
          </div>
          <p className="text-text-muted text-sm">
            Manage and monitor all subscription plans.
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto shadow rounded-lg border border-border-primary mb-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-center text-text-primary">
              <th className="p-3">Plan Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
              <th className="p-3">Commission</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Edited</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {plans.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No plans found
                </td>
              </tr>
            )}

            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border border-border-primary hover:bg-secondary/30 transition"
              >
                {/* Plan Name */}
                <td className="p-3 text-white font-medium capitalize">
                  {plan.name}
                </td>

                {/* Plan Type */}
                <td className="p-3 text-white font-medium capitalize">
                  {plan.type}
                </td>

                {/* Duration */}
                <td className="p-3 text-white capitalize">{plan.duration}</td>

                {/* Price */}
                <td className="p-3 text-white">₹{plan.price}</td>

                {/* Commission */}
                <td className="p-3 text-white">
                  {plan.features.commissionRate}%
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                      plan.isActive ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* Created At */}
                <td className="p-3 text-white">
                  {new Date(plan.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                {/* Created At */}
                <td className="p-3 text-white">
                  {new Date(plan.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                {/* Actions */}
                <td className="p-3 flex gap-2">
                  <button
                    className="flex gap-2 items-center justify-center px-3 py-1 rounded-md bg-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-300 cursor-pointer transition"
                    onClick={() => handleOpenEditModal(plan.id)}
                  >
                    <Edit size={14}></Edit>
                    <span>Edit</span>
                  </button>

                  <button
                    className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition ${
                      plan.isActive
                        ? "bg-red-600 text-white hover:bg-red-500"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {plan.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        nextPage={nextPage}
        page={page}
        prevPage={prevPage}
        totalPages={totalPages}
      />

      {openPlanModal && (
        <CreatePlanModal
          open={openPlanModal}
          onClose={handleCloseModal}
          onSubmit={handleCreatePlan}
        />
      )}

      {openEditModal && (
        <EditPlanModal
          open={openEditModal}
          planId={selectedPlanId}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
