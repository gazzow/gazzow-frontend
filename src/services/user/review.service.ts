import { REVIEW_API } from "@/constants/apis/review-api";
import api from "@/lib/axios/api";

export const reviewService = {
  async addReview(taskId: string, rating: number, review: string) {
    const res = await api.post(REVIEW_API.ADD_REVIEW, {
      taskId,
      rating,
      review,
    });
    console.log("add review response: ", res);
    return res.data;
  },
  async listReviews() {
    const res = await api.get(REVIEW_API.LIST_REVIEWS);
    console.log("list review response: ", res);
    return res.data;
  },
};
