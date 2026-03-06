import { api } from "./client";

export const createMember = (payload) => api.post("/members", payload);
export const getMember = (id) => api.get(`/members/${id}`);
export const getMembers = () => api.get("/members");
export const updateMember = (id, payload) => api.put(`/members/${id}`, payload);
export const deleteMember = (id) => api.delete(`/members/${id}`);



