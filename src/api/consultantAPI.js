import api, { upload } from "../configs/api";

export const fetchBlogs = (page = 0, size = 10) => {
  return api.get(`/blog?page=${page}&size=${size}`);
};

export const fetchBlogDetail = (id) => {
  return api.get(`/blog/${id}`);
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
  formData.append("title", blogData.title);
  formData.append("content", blogData.content);
  formData.append("status", blogData.status || "PUBLISHED");
  // Nếu có file ảnh, thêm vào formData
  if (blogData.imgFile) {
    formData.append("image", blogData.imgFile);
  }
  // Nếu có tags
  if (blogData.tags) {
    blogData.tags.forEach((tag) => formData.append("tags", tag));
  }
  return api.post("/blog", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const likeBlog = (id) => {
  return api.post(`/blog/${id}/like`);
};

export const cancelSchedule = (scheduleData) => {
  return api.post("/schedules/cancel", scheduleData);
};

export const registerSchedule = (requestBody) => {
  return api.post("/schedules/register", requestBody);
};

export const deleteBlog = (blogId) => {
  // This is a placeholder. The actual API endpoint is needed.
  return Promise.reject(
    new Error(`API for deleting blog ${blogId} is not implemented.`)
  );
};

export const fetchAvailableSlots = (serviceId, from, to) => {
  const params = { service_id: serviceId, from, to };
  return api.get("/schedules/slot-free-service", { params });
};
