import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키 안쓰면 fals
});

export const unwrapData = (res) => {
  if (res?.data?.data !== undefined) return res.data.data;
  return res.data;
};