import { api } from "./client";

export const createReservation = (payload) => api.post("/reservations", payload);
export const getReservation = (id) => api.get(`/reservations/${id}`);
export const getReservations = () => api.get("/reservations");
export const getReservationsByMemberId = (memberId) =>
  api.get(`/reservations/member/${memberId}`);
export const updateReservation = (id, payload) =>
  api.put(`/reservations/${id}`, payload);

// 백엔드에 delete가 있으면 사용
export const deleteReservation = (id) => api.delete(`/reservations/${id}`);