import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // 쿠키 안쓰면 false/삭제 가능
});