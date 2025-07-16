import axios from "axios";

// Centralized server configuration
export const SERVER_CONFIG = {
  HOST: "14.225.192.15",
  PORT: "8085",
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}`;
  },
  get API_URL() {
    return `${this.BASE_URL}/api`;
  },
  get WS_URL() {
    return `${this.BASE_URL}/ws/chat`;
  },
};

const api = axios.create({
  baseURL: SERVER_CONFIG.API_URL,
});

const upload = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dycwhc7sn/image/upload",
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    console.log("API Request:", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor để log responses
api.interceptors.response.use(
  function (response) {
    console.log("API Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  function (error) {
    console.error("API Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      code: error.code,
    });
    return Promise.reject(error);
  }
);

export default api;
export { upload };
