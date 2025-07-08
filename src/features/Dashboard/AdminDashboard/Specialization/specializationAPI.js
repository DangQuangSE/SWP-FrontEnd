import api from "../../../../configs/api";

/**
 * API functions for Specializations management
 */

// Lấy danh sách specializations
export const fetchSpecializations = async () => {
  try {
    const response = await api.get("/specializations");
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Lỗi lấy danh sách specializations:", error);
    return [];
  }
};

// Thêm specialization mới
export const addSpecialization = async (specialization) => {
  try {
    console.log(" Adding specialization:", specialization);
    const response = await api.post("/specializations", specialization);
    console.log("Specialization added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi thêm specialization:", error);
    console.error("Error details:", error.response?.data);
    console.error("Status:", error.response?.status);
    console.error("Request data:", specialization);
    throw error;
  }
};

// Cập nhật specialization
export const updateSpecialization = async (id, specialization) => {
  try {
    const response = await api.put(`/specializations/${id}`, specialization);
    return response.data;
  } catch (error) {
    console.error("Lỗi sửa specialization:", error);
    throw error;
  }
};

// Xóa specialization
export const deleteSpecialization = async (id) => {
  try {
    await api.delete(`/specializations/${id}`);
  } catch (error) {
    console.error("Lỗi xóa specialization:", error);
    throw error;
  }
};
