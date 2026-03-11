import axios from "axios";
import { getAccessToken, clearLoginUser } from "../utils/authStorage";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      clearLoginUser();
    }
    return Promise.reject(error);
  },
);

export const unwrapData = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  return res.data;
};