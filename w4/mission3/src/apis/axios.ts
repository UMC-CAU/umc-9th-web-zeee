import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://umc-web.kyeoungwoon.kr/",
});

// 요청할 때마다 최신 토큰을 헤더에 붙임
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
