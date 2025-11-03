import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_SERVER_API_URL,
  baseURL: "https://umc-web.kyeoungwoon.kr/",

  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
});
