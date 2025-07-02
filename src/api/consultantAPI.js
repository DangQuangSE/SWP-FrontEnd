import api, { upload } from "../configs/api";

export const fetchBlogs = (page = 0, size = 10) => {
  // Try different parameters to get all blogs including drafts
  return api.get(`/blog?page=${page}&size=${size}`);
};

export const fetchAllBlogs = (page = 0, size = 10) => {
  // Try with different parameters to get all status blogs
  return api.get(`/blog?page=${page}&size=${size}&includeAll=true&status=ALL`);
};

export const fetchMyBlogs = (page = 0, size = 10) => {
  // Try different endpoints for consultant's own blogs
  return api.get(`/blog/my-blogs?page=${page}&size=${size}`);
};

export const fetchBlogsByAuthor = (authorId, page = 0, size = 10) => {
  // Try to get blogs by author ID
  return api.get(`/blog/author/${authorId}?page=${page}&size=${size}`);
};

export const fetchBlogDetail = (id) => {
  return api.get(`/blog/${id}`);
};

export const fetchBlogsByTag = (tagId, page = 0, size = 10) => {
  return api.get(`/blog/by-tag/${tagId}?page=${page}&size=${size}`);
};

export const fetchTagById = (tagId) => {
  return api.get(`/tags/${tagId}`);
};

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset");
  return upload.post("", formData);
};

export const fetchConsultantSchedule = (userId) => {
  const today = new Date().toISOString().slice(0, 10);
  const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  // Ví dụ truyền thêm from/to
  return api.get(
    `/schedules/view?consultant_id=${userId}&from=2025-06-01&to=2025-07-30`
  );
};

export const createBlog = (blogData) => {
  const formData = new FormData();

  // Required fields
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);
  formData.append("status", blogData.status || "DRAFT");

  // Optional image file
  if (blogData.imgFile) {
    formData.append("image", blogData.imgFile);
  }

  // Tags - backend expects tag names, not IDs
  if (blogData.tagNames && blogData.tagNames.length > 0) {
    blogData.tagNames.forEach((tagName) => {
      formData.append("tags", tagName);
    });
  }

  return api.post("/blog", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Toggle this to enable/disable simulation mode
const LIKE_API_SIMULATION_MODE = false;

export const likeBlog = async (id) => {
  console.log(` likeBlog API call for blog ID: ${id}`);
  const token = localStorage.getItem("token");
  console.log(` Token available:`, !!token);
  console.log(` API endpoint: POST /blog/${id}/like`);

  if (LIKE_API_SIMULATION_MODE) {
    // Simulation mode for testing UI
    console.log(` SIMULATION MODE: Simulating successful like for testing`);
    console.log(
      ` To use real API, set LIKE_API_SIMULATION_MODE = false in consultantAPI.js`
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(` Simulated like success for blog ${id}`);
        resolve({
          data: {
            success: true,
            message: `Blog ${id} liked successfully (simulated)`,
            blogId: id,
          },
        });
      }, 500);
    });
  }

  // Check if user is logged in
  if (!token) {
    console.warn(
      ` No authentication token found. User needs to login to like blogs.`
    );
    throw new Error(`Bạn cần đăng nhập để thích bài viết`);
  }

  // REAL API CALL with authentication
  try {
    console.log(` Attempting authenticated API call...`);

    const response = await api.post(
      `/blog/${id}/like`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(` Like API call success:`, response);
    return response;
  } catch (error) {
    console.error(` likeBlog API error:`, error);
    console.error(` Error response:`, error.response?.data);
    console.error(` Error status:`, error.response?.status);
    console.error(` Error message:`, error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error(`Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.`);
    } else if (error.response?.status === 403) {
      throw new Error(`Bạn không có quyền thích bài viết này.`);
    } else if (error.response?.status === 404) {
      throw new Error(`Bài viết không tồn tại.`);
    } else {
      throw new Error(`Không thể thích bài viết. Vui lòng thử lại sau.`);
    }
  }
};

export const cancelSchedule = (scheduleData) => {
  return api.post("/schedules/cancel", scheduleData);
};

export const registerSchedule = (requestBody) => {
  return api.post("/schedules/register", requestBody);
};

// Get consultant schedules with date range
export const getConsultantSchedules = (consultantId, from, to) => {
  const params = new URLSearchParams();
  params.append("consultant_id", consultantId);
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  return api.get(`/schedules/view?${params.toString()}`);
};

export const deleteBlog = async (blogId) => {
  console.log(` deleteBlog API call for blog ID: ${blogId}`);
  const token = localStorage.getItem("token");
  console.log(` Token available:`, !!token);
  console.log(` API endpoint: DELETE /blog/${blogId}`);

  // Check if user is logged in
  if (!token) {
    console.warn(
      ` No authentication token found. User needs to login to delete blogs.`
    );
    throw new Error(`Bạn cần đăng nhập để xóa bài viết`);
  }

  try {
    console.log(` Attempting to delete blog ${blogId}...`);

    const response = await api.delete(`/blog/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(` Delete blog API success:`, response);
    return response;
  } catch (error) {
    console.error(` deleteBlog API error:`, error);
    console.error(` Error response:`, error.response?.data);
    console.error(` Error status:`, error.response?.status);
    console.error(` Error message:`, error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error(`Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.`);
    } else if (error.response?.status === 403) {
      throw new Error(`Bạn không có quyền xóa bài viết này.`);
    } else if (error.response?.status === 404) {
      throw new Error(`Bài viết không tồn tại hoặc đã bị xóa.`);
    } else {
      throw new Error(`Không thể xóa bài viết. Vui lòng thử lại sau.`);
    }
  }
};

export const fetchAvailableSlots = (serviceId, from, to) => {
  const params = { service_id: serviceId, from, to };
  return api.get("/schedules/slot-free-service", { params });
};
