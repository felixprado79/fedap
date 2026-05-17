/**
 * client.ts  —  Axios instance pre-configured for the Sublix API
 *
 * All API calls go through this instance so headers, base URL,
 * and auth tokens are handled in one place.
 */

import axios from "axios";
import { API_URL } from "@/constants";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor — attach JWT token if present ─────────────────────────
apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ── Response interceptor — handle 401 globally ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem("access_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
