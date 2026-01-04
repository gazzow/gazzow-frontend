"use client";

import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-4  p-4 border border-border-primary rounded-lg mb-6">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold text-white">
              Subscription Management
            </h1>
          </div>
          <p className="text-text-muted text-sm">
            Manage and monitor all subscriptions.
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto shadow rounded-lg border border-border-primary mb-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-text-primary">
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
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No subscription found
                </td>
              </tr>
            )}

            {subscriptions.map((subscription) => {
              const { activePlan } = subscription;

              return (
                <tr
                  key={subscription.id}
                  className="border border-border-primary hover:bg-secondary/30 transition"
                >
                  {/* User Id */}
                  <td className="p-3 text-white font-medium capitalize">
                    {subscription.userId.slice(0, 8)}…
                  </td>

                  {/* Plan Type */}
                  <td className="p-3 text-white font-medium capitalize">
                    {activePlan.type}
                  </td>

                  {/* Duration */}
                  <td className="p-3 text-white capitalize">
                    {activePlan.duration}
                  </td>

                  {/* Price */}
                  <td className="p-3 text-white">₹{activePlan.price}</td>

                  {/* Commission */}
                  <td className="p-3 text-white">
                    {activePlan.features.commissionRate}%
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                        subscription.status === "active"
                          ? "bg-green-600"
                          : subscription.status === "expired"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {subscription.status}
                    </span>
                  </td>

                  {/* Start Date */}
                  <td className="p-3 text-white">
                    {new Date(subscription.startDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }
                    )}
                  </td>

                  {/* End Date */}
                  <td className="p-3 text-white">
                    {new Date(subscription.endDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      }
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    {subscription.status === "active" && (
                      <button
                        className="px-3 py-1 rounded-md bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition"
                        onClick={() => {
                          // cancelSubscription(subscription.id)
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    {subscription.status !== "active" && (
                      <span className="text-xs text-gray-400">No actions</span>
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
