// src/hooks/categories.js
import * as catAPI from "../../api/categories";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useCategories,
  useItem: useCategory,
  useCreate: useCreateCategory,
  useUpdate: useUpdateCategory,
  useDelete: useDeleteCategory,
} = createResourceHooks("categories", {
  fetchAll: catAPI.fetchCategories,
  fetchOne: catAPI.fetchCategory,
  create: catAPI.createCategory,
  update: catAPI.updateCategory,
  remove: catAPI.deleteCategory,
});
