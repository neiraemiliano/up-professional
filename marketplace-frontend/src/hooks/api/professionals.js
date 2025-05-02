// src/hooks/professionals.js
import * as profAPI from "../../api/professionals";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useProfessionals,
  useItem: useProfessional,
  useCreate: useCreateProfessional,
  useUpdate: useUpdateProfessional,
  useDelete: useDeleteProfessional,
} = createResourceHooks("professionals", {
  fetchAll: profAPI.fetchProfessionals,
  fetchOne: profAPI.fetchProfessional,
  create: profAPI.createProfessional,
  update: profAPI.updateProfessional,
  remove: profAPI.deleteProfessional,
});
