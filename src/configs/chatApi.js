import axios from "axios";
import { API_BASE_URL } from "./serverConfig";

/**
 * Chat API instance - No authentication required
 * Separate from main API to avoid automatic auth headers
 */
const chatApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging (no auth)
chatApi.interceptors.request.use(
  function (config) {
    console.log("[CHAT API] Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  function (error) {
    console.error("❌ [CHAT API] Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging
chatApi.interceptors.response.use(
  function (response) {
    console.log("✅ [CHAT API] Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  function (error) {
    console.error("❌ [CHAT API] Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      message: error.message,
      code: error.code,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default chatApi;
