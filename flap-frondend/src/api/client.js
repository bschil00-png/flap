import axios from "axios";
import { clearLoginUser, saveLoginUser } from "../utils/authStorage";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onRefreshed() {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
}

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const requestUrl = originalRequest?.url || "";

        if (!status) {
            return Promise.reject(error);
        }

        // refresh 요청 자체 실패
        if (requestUrl.includes("/auth/refresh")) {
            clearLoginUser();
            return Promise.reject(error);
        }

        // 401, 403 둘 다 refresh 시도
        if ((status === 401 || status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh(async () => {
                        try {
                            resolve(api(originalRequest));
                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            }

            isRefreshing = true;

            try {
                // accessToken 쿠키 재발급
                await api.post("/auth/refresh");

                // 사용자 정보 다시 조회해서 localStorage 갱신
                const meResponse = await api.get("/auth/me");
                saveLoginUser(meResponse.data);

                isRefreshing = false;
                onRefreshed();

                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                clearLoginUser();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const unwrapData = (res) => {
    if (res?.data?.data !== undefined) return res.data.data;
    return res.data;
};