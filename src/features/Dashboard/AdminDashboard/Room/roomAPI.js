import api from "../../../../configs/api";

/**
 * API functions for Room management
 */

// Lấy tất cả phòng
export const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms");
    console.log("✅ Fetch rooms response:", response.data);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách phòng:", error);
    console.error("❌ Error response:", error.response?.data);
    throw error;
  }
};

// Tạo phòng mới
export const addRoom = async (roomData) => {
  try {
    console.log("🚀 Creating room with data:", roomData);
    const response = await api.post("/rooms", roomData);
    console.log("✅ Add room response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi tạo phòng:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
};

// Cập nhật phòng
export const updateRoom = async (id, roomData) => {
  try {
    console.log("🚀 Updating room with data:", roomData);
    const response = await api.put(`/rooms/${id}`, roomData);
    console.log("✅ Update room response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi cập nhật phòng:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
};

// Xóa phòng
export const deleteRoom = async (id) => {
  try {
    console.log("🚀 Deleting room:", id);
    const response = await api.delete(`/rooms/${id}`);
    console.log("✅ Delete room response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi xóa phòng:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
};

// Lấy chi tiết phòng theo ID
export const fetchRoomById = async (id) => {
  try {
    console.log("🚀 Fetching room by ID:", id);
    const response = await api.get(`/rooms/${id}`);
    console.log("✅ Fetch room by ID response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết phòng:", error);
    console.error("❌ Error response:", error.response?.data);
    throw error;
  }
};
