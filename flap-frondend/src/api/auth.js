import { api } from "./client";

export const login = (payload) => api.post("/auth/login", payload);
// 나중에 필요하면 추가
export const logout = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");
export const refresh = () => api.post("/auth/refresh");
