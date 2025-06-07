import axios from "axios";

const api = axios.create({
<<<<<<< Updated upstream:SWP-FE/src/configs/axios.js
  baseURL: "http://14.225.198.16:8080/api/",
=======
  baseURL: "http://14.225.198.16:8081/api/",
>>>>>>> Stashed changes:src/configs/axios.js
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
