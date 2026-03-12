import { api } from "./client";

export const createReservation = (payload) => api.post("/reservations", payload);
export const getMyReservations = () => api.get("/reservations/me");
export const getReservation = (id) => api.get(`/reservations/${id}`);
export const updateReservation = (id, payload) => api.put(`/reservations/${id}`, payload);
export const cancelReservation = (id) => api.put(`/reservations/${id}/cancel`);
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);
export const getReservedSlots = (courtId, date) =>
    api.get(`/reservations/reserved-slots?courtId=${courtId}&date=${date}`);