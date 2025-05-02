// src/hooks/locations.js
import * as locAPI from "../../api/locations";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useLocations,
  useItem: useLocation,
  useCreate: useCreateLocation,
  useUpdate: useUpdateLocation,
  useDelete: useDeleteLocation,
} = createResourceHooks("locations", {
  fetchAll: locAPI.fetchLocations,
  fetchOne: locAPI.fetchLocation,
  create: locAPI.createLocation,
  update: locAPI.updateLocation,
  remove: locAPI.deleteLocation,
});
