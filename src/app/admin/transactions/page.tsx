"use client";

import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { adminPaymentService } from "@/services/admin/admin-payment.service";
import { IPayment, PaymentStatus, PaymentType } from "@/types/payment";
import axios from "axios";
import { DollarSign } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function TransactionManagement() {
  const [payments, setPayments] = useState<IPayment[]>([]);

  const {
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination({ limit: 8 });

  const fetchPayments = useCallback(async () => {
    try {
      const res = await adminPaymentService.listPayments();
      if (res.success) {
        setPayments(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Payment fetch error", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.SUCCESS:
        return "bg-green-600";
      case PaymentStatus.PENDING:
        return "bg-yellow-600";
      case PaymentStatus.FAILED:
        return "bg-red-600";
      case PaymentStatus.REFUNDED:
        return "bg-gray-600";
    }
  };

  const getTypeBadge = (type: PaymentType) => {
    switch (type) {
      case PaymentType.SUBSCRIPTION:
        return "bg-blue-600";
      case PaymentType.TASK_PAYMENT:
        return "bg-purple-600";
      case PaymentType.PLATFORM_FEE:
        return "bg-orange-600";
      case PaymentType.PAYOUT:
        return "bg-teal-600";
      case PaymentType.REFUND:
        return "bg-red-500";
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
    flex flex-col p-5 mb-6
    bg-white dark:bg-secondary/20
    border border-gray-200 dark:border-border-primary
    rounded-xl shadow-sm dark:shadow-none
  "
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Transactions
        </h1>
        <p className="text-gray-500 dark:text-text-muted text-sm">
          Track all platform transactions, payouts, and refunds.
        </p>
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
              <th className="p-3">User</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Platform Fee</th>
              <th className="p-3">Net Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Reference Id</th>
              {/* <th className="p-3">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  No payments found
                </td>
              </tr>
            )}

            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="
            border-t border-gray-200 dark:border-border-primary
            hover:bg-gray-50 dark:hover:bg-secondary/30
            transition-colors
          "
              >
                {/* User */}
                <td className="p-3 font-medium text-gray-900 dark:text-white">
                  {payment.userId.slice(0, 8)}...
                </td>

                {/* Type */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getTypeBadge(
                      payment.type,
                    )}`}
                  >
                    {payment.type.replace("_", " ")}
                  </span>
                </td>

                {/* Gross */}
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>{payment.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </td>

                {/* Platform Fee */}
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>{payment.platformFee?.toLocaleString() || 0}</span>
                  </div>
                </td>

                {/* Net */}
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>{payment.netAmount?.toLocaleString() || 0}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>

                {/* Created */}
                <td className="p-3">
                  {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                {/* Reference */}
                <td className="p-3">
                  {payment.stripeTransferId ||
                    payment.stripePaymentIntentId ||
                    "N/A"}
                </td>
                {/* Actions */}
                {/* <td className="p-3">
                  <button
                    className="text-center
                px-3 py-1 rounded-md text-xs font-medium
                bg-gray-100 dark:bg-slate-700
                text-gray-700 dark:text-gray-300
                hover:bg-gray-200 dark:hover:bg-slate-800
                transition cursor-pointer
              "
                  >
                    View
                  </button>
                </td> */}
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
    </div>
  );
}
