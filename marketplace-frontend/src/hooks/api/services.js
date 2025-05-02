// src/hooks/services.js
import * as svcAPI from "../../api/services";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useServices,
  useItem: useService,
  useCreate: useCreateService,
  useUpdate: useUpdateService,
  useDelete: useDeleteService,
} = createResourceHooks("services", {
  fetchAll: svcAPI.fetchServices,
  fetchOne: svcAPI.fetchService,
  create: svcAPI.createService,
  update: svcAPI.updateService,
  remove: svcAPI.deleteService,
});
