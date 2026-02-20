"use client";

import CreatePlanModal from "@/components/features/admin/CreatePlanModal";
import EditPlanModal from "@/components/features/admin/EditPlanModal";
import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { planService } from "@/services/admin/plan-service";
import { IPlan } from "@/types/plan";
import { handleApiError } from "@/utils/handleApiError";
import { CreatePlanFormValues } from "@/validators/create-plan";
import { Edit } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PlanManagement() {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [openPlanModal, setOpenPlanModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);

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
    setSelectedPlanId(null);
  };

  const handleStatusUpdate = (plan: IPlan) => {
    setConfirmModal(true);
    setSelectedPlan(plan);
  };

  const handleConfirmButton = async () => {
    if (!selectedPlan) return;
    try {
      const res = await planService.updateStatus(
        selectedPlan.id,
        selectedPlan.isActive ? false : true,
      );
      if (res.success) {
        fetchPlans();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setConfirmModal(false);
      setSelectedPlan(null);
    }
  };

  const fetchPlans = useCallback(async () => {
    try {
      const res = await planService.listPlans();
      if (res.success) {
        setPlans(res.data);
      }
    } catch (error) {
      handleApiError(error);
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
      handleApiError(error);
    }
  };

  return (
    <div
      className="
  p-6 min-h-screen
  bg-gray-50 dark:bg-transparent
  text-gray-800 dark:text-white
  transition-colors duration-300
"
    >
      {/* Header */}
      <div
        className="
    flex flex-col gap-4 p-5 rounded-xl mb-6
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    shadow-sm dark:shadow-none
  "
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Plan Management
            </h1>
            <p className="text-gray-500 dark:text-text-muted text-sm">
              Manage and monitor all subscription plans.
            </p>
          </div>

          <button
            className="
        px-3 py-1.5
        bg-btn-primary text-white
        rounded-md font-medium
        hover:bg-btn-primary-hover
        transition cursor-pointer
      "
            onClick={handleOpenModal}
          >
            Create Plan
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="
    overflow-x-auto
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    rounded-xl shadow-sm dark:shadow-none
    mb-4
  "
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-center text-gray-600 dark:text-gray-300">
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
                <td colSpan={9} className="py-6 text-gray-400">
                  No plans found
                </td>
              </tr>
            )}

            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="
            border-t border-gray-200 dark:border-border-primary
            hover:bg-gray-50 dark:hover:bg-secondary/30
            transition-colors
          "
              >
                <td className="p-3 font-medium capitalize text-gray-900 dark:text-white">
                  {plan.name}
                </td>

                <td className="p-3 capitalize">{plan.type}</td>

                <td className="p-3 capitalize">{plan.duration}</td>

                <td className="p-3">₹{plan.price}</td>

                <td className="p-3">{plan.features.commissionRate}%</td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                ${
                  plan.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
                  >
                    {plan.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(plan.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                <td className="p-3">
                  {new Date(plan.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                {/* Actions */}
                <td className="p-3 flex justify-center gap-2">
                  <button
                    className="
                flex gap-1 items-center cursor-pointer
                px-3 py-1 rounded-md text-xs font-medium
                bg-gray-100 dark:bg-secondary/40
                text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-secondary/60
                transition
              "
                    onClick={() => handleOpenEditModal(plan.id)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>

                  <button
                    className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer
                ${
                  plan.isActive
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                    onClick={() => handleStatusUpdate(plan)}
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

      {/* Modals */}
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

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div
            className="
        w-full max-w-md
        bg-white dark:bg-secondary
        border border-gray-200 dark:border-border-primary
        p-6 rounded-2xl shadow-xl
      "
          >
            <p className="font-semibold text-lg text-gray-800 dark:text-white">
              {selectedPlan?.isActive
                ? "This plan will be made unavailable to new users. Do you want to continue?"
                : "This plan will become available to users again. Do you want to continue?"}
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(false)}
                className="
            px-4 py-2 rounded-lg cursor-pointer
            bg-gray-200 dark:bg-slate-600
            text-gray-700 dark:text-gray-300
            hover:bg-gray-300 dark:hover:bg-slate-700
          "
              >
                Cancel
              </button>

              <button
                className=" cursor-pointer
            px-4 py-2 rounded-lg
            bg-red-500 hover:bg-red-600
            text-white
          "
                onClick={handleConfirmButton}
              >
                {selectedPlan?.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
