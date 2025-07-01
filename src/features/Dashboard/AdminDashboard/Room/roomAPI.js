import api from "../../../../configs/api";

/**
 * API functions for Room management
 */

// Lấy tất cả phòng
export const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms");
    console.log(" Fetch rooms response:", response.data);
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error(" Lỗi lấy danh sách phòng:", error);
    console.error(" Error response:", error.response?.data);
    throw error;
  }
};

// Tạo phòng mới
export const addRoom = async (roomData) => {
  try {
    console.log(" Creating room with data:", roomData);
    const response = await api.post("/rooms", roomData);
    console.log(" Add room response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi tạo phòng:", error);
    console.error(" Error response:", error.response?.data);
    console.error(" Error status:", error.response?.status);
    throw error;
  }
};

// Cập nhật phòng
export const updateRoom = async (id, roomData) => {
  try {
    console.log(" Updating room with data:", roomData);
    const response = await api.put(`/rooms/${id}`, roomData);
    console.log(" Update room response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi cập nhật phòng:", error);
    console.error(" Error response:", error.response?.data);
    console.error(" Error status:", error.response?.status);
    throw error;
  }
};

// Xóa phòng
export const deleteRoom = async (id) => {
  try {
    console.log(" Deleting room:", id);
    const response = await api.delete(`/rooms/${id}`);
    console.log(" Delete room response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi xóa phòng:", error);
    console.error(" Error response:", error.response?.data);
    console.error(" Error status:", error.response?.status);
    throw error;
  }
};

// Lấy chi tiết phòng theo ID
export const fetchRoomById = async (id) => {
  try {
    console.log(" Fetching room by ID:", id);
    const response = await api.get(`/rooms/${id}`);
    console.log(" Fetch room by ID response:", response.data);
    return response.data;
  } catch (error) {
    console.error(" Lỗi lấy chi tiết phòng:", error);
    console.error(" Error response:", error.response?.data);
    throw error;
  }
};

// Thêm bác sĩ vào phòng
export const addConsultantToRoom = async (roomId, consultantData) => {
  try {
    console.log("🔄 Adding consultant to room:", { roomId, consultantData });
    const response = await api.post(
      `/rooms/${roomId}/consultants`,
      consultantData
    );
    console.log("✅ Add consultant to room response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi thêm bác sĩ vào phòng:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

// Lấy danh sách bác sĩ trong phòng
export const fetchRoomConsultants = async (roomId) => {
  try {
    console.log("🔄 Fetching consultants for room:", roomId);
    const response = await api.get(`/rooms/${roomId}/consultants`);
    console.log("✅ Fetch room consultants response:", response.data);
    console.log("📊 Number of consultants found:", response.data?.length || 0);

    // Đảm bảo trả về array
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data) {
      return [response.data];
    } else {
      return [];
    }
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bác sĩ trong phòng:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Room ID:", roomId);

    // Nếu là 404 (không tìm thấy), trả về array rỗng thay vì throw error
    if (error.response?.status === 404) {
      console.log("📝 Room has no consultants yet, returning empty array");
      return [];
    }

    throw error;
  }
};

// Xóa bác sĩ khỏi phòng (sử dụng assignmentId)
export const removeConsultantFromRoom = async (roomId, assignmentId) => {
  try {
    console.log("🔄 Removing consultant from room:", { roomId, assignmentId });
    const response = await api.delete(
      `/rooms/${roomId}/consultants/${assignmentId}`
    );
    console.log("✅ Remove consultant from room response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi xóa bác sĩ khỏi phòng:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};
