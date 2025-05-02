// src/hooks/reviews.js
import * as rvAPI from "../../api/reviews";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useReviews,
  useItem: useReview,
  useCreate: useCreateReview,
  useUpdate: useUpdateReview,
  useDelete: useDeleteReview,
} = createResourceHooks("reviews", {
  fetchAll: rvAPI.fetchReviews,
  fetchOne: rvAPI.fetchReview,
  create: rvAPI.createReview,
  update: rvAPI.updateReview,
  remove: rvAPI.deleteReview,
});
