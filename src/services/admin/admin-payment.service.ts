import api from "@/lib/axios/api";

export const adminPaymentService = {
  async listPayments() {
    const res = await api.get("/admin/payments");
    console.log("List admin payments response ", res);
    return res.data;
  },
};
