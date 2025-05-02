// src/hooks/bookings.js
import * as bkAPI from "../../api/bookings";
import { createResourceHooks } from "./baseResourceHooks";

export const {
  useList: useBookings,
  useItem: useBooking,
  useCreate: useCreateBooking,
  useUpdate: useUpdateBooking,
  useDelete: useDeleteBooking,
} = createResourceHooks("bookings", {
  fetchAll: bkAPI.fetchBookings,
  fetchOne: bkAPI.fetchBooking,
  create: bkAPI.createBooking,
  update: bkAPI.updateBooking,
  remove: bkAPI.deleteBooking,
});
