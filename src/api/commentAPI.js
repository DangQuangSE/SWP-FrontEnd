import api from "../configs/api";

// API để lấy tóm tắt thống kê blog (chỉ lấy commentCount)
export const fetchBlogSummary = async () => {
  try {
    const response = await api.get("/blog/summary");
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Không tìm thấy thống kê blog.`);
    } else if (error.response?.status === 500) {
      throw new Error(`Lỗi server khi lấy thống kê blog.`);
    } else {
      throw new Error(`Không thể lấy thống kê blog. Vui lòng thử lại sau.`);
    }
  }
};
