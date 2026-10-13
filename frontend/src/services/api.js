import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicAuthRequest = /\/auth\/(login|register)$/.test(
      error.config?.url || ""
    );
    if (error.response?.status === 401 && !isPublicAuthRequest) {
      localStorage.removeItem("userInfo");
    }
    return Promise.reject(error);
  }
);

export default api;