import api from "../configs/api";

/**
 * Config API functions for system configuration management
 */

// Tạo cấu hình mới
export const createConfig = (configData) => {
  const params = new URLSearchParams();
  params.append("name", configData.name);
  params.append("value", configData.value);

  return api.post("/config", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// Lấy tất cả cấu hình
export const fetchAllConfigs = () => {
  return api.get("/config");
};

// Cập nhật cấu hình theo ID
export const updateConfig = (id, configData) => {
  const params = new URLSearchParams();
  params.append("value", configData.value);

  return api.put(`/config/${id}`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// Xóa cấu hình theo ID
export const deleteConfig = (id) => {
  return api.delete(`/config/${id}`);
};

// Lấy cấu hình theo ID
export const fetchConfigById = (id) => {
  return api.get(`/config/${id}`);
};
