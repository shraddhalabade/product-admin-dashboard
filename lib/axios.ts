import axios from "axios";

const api = axios.create({
  baseURL: "https://dummyjson.com",
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `API Error ${error.response.status}:`,
        error.response.data?.message || "Request failed"
      );
    } else if (error.request) {
      console.error("Network error: No response received.");
    } else {
      console.error("Request error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;