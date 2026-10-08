import axios from "axios";

export const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else delete config.headers.Authorization;
  return config;
});

export const getReq = async (endpoint, config = {}) => (await apiClient.get(endpoint, config)).data;
export const postReq = async (endpoint, data, config = {}) => (await apiClient.post(endpoint, data, config)).data;
export const putReq = async (endpoint, data, config = {}) => (await apiClient.put(endpoint, data, config)).data;
export const deleteReq = async (endpoint, config = {}) => (await apiClient.delete(endpoint, config)).data;

export const getApiError = (error, fallback = "Произошла ошибка. Попробуйте ещё раз.") => {
  const data = error?.response?.data;
  if (typeof data === "string" && data) return data;
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    const first = Object.values(data).flat?.()[0];
    if (first) return String(first);
  }
  return fallback;
};

export default apiClient;
