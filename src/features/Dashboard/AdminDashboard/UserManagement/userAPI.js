import api from "../../../../configs/api";

/**
 * API functions for User management
 */

// Lấy danh sách tất cả users từ tất cả các role
export const fetchUsers = async () => {
  try {
    const roles = ["CUSTOMER", "STAFF", "CONSULTANT"];
    const allUsers = [];

    // Gọi API cho từng role
    for (const role of roles) {
      try {
        const response = await api.get(`/admin/users?role=${role}`);
        const users = Array.isArray(response.data)
          ? response.data
          : [response.data];
        allUsers.push(...users);
        console.log(` Fetched ${users.length} users with role ${role}`);
      } catch (roleError) {
        console.warn(
          ` Không thể lấy users với role ${role}:`,
          roleError.message
        );
      }
    }

    console.log(` Total fetched users: ${allUsers.length}`);
    return allUsers;
  } catch (error) {
    console.error(" Lỗi lấy danh sách users:", error);
    console.error("Error details:", error.response?.data);
    return [];
  }
};

// Thêm user mới
export const addUser = async (user) => {
  try {
    const response = await api.post("/admin/user", user);
    return response.data;
  } catch (error) {
    console.error("Lỗi thêm user:", error);
    throw error;
  }
};

// Cập nhật user
export const updateUser = async (id, user) => {
  try {
    const response = await api.put(`/admin/user/${id}`, user);
    return response.data;
  } catch (error) {
    console.error("Lỗi sửa user:", error);
    throw error;
  }
};

// Xóa user
export const deleteUser = async (id) => {
  try {
    await api.delete(`/admin/user/${id}`);
  } catch (error) {
    console.error("Lỗi xóa user:", error);
    throw error;
  }
};
