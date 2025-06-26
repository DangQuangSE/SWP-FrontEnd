import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", 
});

const upload = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dycwhc7sn/image/upload", 
});

api.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
export { upload };
