"use client";

import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import api from "@/lib/axios/api";
import { subscriptionManagementService } from "@/services/admin/subscription-management.service";
import { ISubscription } from "@/types/subscription";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

  const {
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination({ limit: 6 });

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await subscriptionManagementService.listSubscriptions();
      console.log("plans data: ", res.data);
      if (res.success) {
        setSubscriptions(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Project management error: ", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const result = await api.put(`/admin/subscriptions/${subscriptionId}`);
      const res = result.data;

      if (res.success) {
        // toast(res.message);
        fetchSubscriptions();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Subscription cancel error: ", error);
      }
    }
  };

  return (
   <div
  className="
  p-6
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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Subscription Management
      </h1>
      <p className="text-gray-500 dark:text-text-muted text-sm">
        Manage and monitor all subscriptions.
      </p>
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
        <tr className="text-left text-gray-600 dark:text-gray-300">
          <th className="p-3">User Id</th>
          <th className="p-3">Plan</th>
          <th className="p-3">Duration</th>
          <th className="p-3">Price</th>
          <th className="p-3">Commission</th>
          <th className="p-3">Status</th>
          <th className="p-3">Started</th>
          <th className="p-3">Ends</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {subscriptions.length === 0 && (
          <tr>
            <td colSpan={9} className="text-center py-6 text-gray-400">
              No subscription found
            </td>
          </tr>
        )}

        {subscriptions.map((subscription) => {
          const { activePlan } = subscription;

          return (
            <tr
              key={subscription.id}
              className="
              border-t border-gray-200 dark:border-border-primary
              hover:bg-gray-50 dark:hover:bg-secondary/30
              transition-colors
            "
            >
              {/* User Id */}
              <td className="p-3 font-medium text-gray-900 dark:text-white">
                {subscription.userId.slice(0, 8)}…
              </td>

              {/* Plan */}
              <td className="p-3 capitalize">{activePlan.type}</td>

              {/* Duration */}
              <td className="p-3 capitalize">{activePlan.duration}</td>

              {/* Price */}
              <td className="p-3">₹{activePlan.price}</td>

              {/* Commission */}
              <td className="p-3">
                {activePlan.features.commissionRate}%
              </td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    subscription.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : subscription.status === "expired"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {subscription.status}
                </span>
              </td>

              {/* Start */}
              <td className="p-3">
                {new Date(subscription.startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </td>

              {/* End */}
              <td className="p-3">
                {new Date(subscription.endDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </td>

              {/* Actions */}
              <td className="p-3 flex gap-2">
                {subscription.status === "active" ? (
                  <button
                    className="
                    px-3 py-1 rounded-md text-xs font-medium
                    bg-red-500 text-white
                    hover:bg-red-600 transition
                  "
                    onClick={() => cancelSubscription(subscription.id)}
                  >
                    Cancel
                  </button>
                ) : (
                  <span className="text-xs text-gray-400">
                    No actions
                  </span>
                )}
              </td>
            </tr>
          );
        })}
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
</div>

  );
}
