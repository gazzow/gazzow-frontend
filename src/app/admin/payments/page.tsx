"use client";

import Pagination from "@/components/features/Pagination";
import { usePagination } from "@/hook/usePaginationOptions";
import { adminPaymentService } from "@/services/admin/admin-payment.service";
import { IPayment, PaymentStatus, PaymentType } from "@/types/payment";
import axios from "axios";
import { DollarSign } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PaymentManagement() {
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
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col p-4 border border-border-primary rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-white">Payment Management</h1>
        <p className="text-text-muted text-sm">
          Track all platform transactions, payouts, and refunds.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg border border-border-primary mb-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-text-primary">
              <th className="p-3">User</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Platform Fee</th>
              <th className="p-3">Net Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Reference Id</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-400">
                  No payments found
                </td>
              </tr>
            )}

            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border border-border-primary hover:bg-secondary/30 transition"
              >
                {/* User */}
                <td className="p-3 text-white">
                  {payment.userId.slice(0, 8)}...
                </td>

                {/* Type */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getTypeBadge(
                      payment.type
                    )}`}
                  >
                    {payment.type.replace("_", " ")}
                  </span>
                </td>

                {/* Gross */}
                <td>
                  <div className="p-3 text-white flex items-center">
                    <DollarSign size={14} />
                    <span>{payment.totalAmount?.toLocaleString() || 0}</span>
                  </div>
                </td>

                {/* Platform Fee */}
                <td>
                  <div className="p-3 text-white flex items-center">
                    <DollarSign size={14} />
                    <span>{payment.platformFee?.toLocaleString() || 0}</span>
                  </div>
                </td>

                {/* Net */}
                <td>
                  <div className="p-3 text-white flex items-center">
                    <DollarSign size={14} />
                    <span>{payment.netAmount?.toLocaleString() || 0}</span>
                  </div>
                </td>
                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(
                      payment.status
                    )}`}
                  >
                    {payment.status}
                  </span>
                </td>

                {/* Created */}
                <td className="p-3 text-white">
                  {new Date(payment.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                </td>

                {/* Reference */}
                <td className="p-3 text-white">
                  {payment.stripeTransferId ||
                    payment.stripePaymentIntentId ||
                    "N/A"}
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
    </div>
  );
}
