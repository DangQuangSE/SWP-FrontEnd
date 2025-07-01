import api from "../configs/api";

// Blog Management
export const adminFetchBlogs = (page = 0, size = 10) => {
  return api.get(`/blog?page=${page}&size=${size}`);
};

export const adminFetchMyBlogs = (page = 0, size = 10) => {
  return api.get(`/blog/my-blogs?page=${page}&size=${size}`);
};

export const adminDeleteBlog = (blogId) => {
  return api.delete(`/blog/${blogId}`);
};

export const adminUpdateBlog = (blogId, data) => {
  return api.put(`/blog/${blogId}`, data);
};

// User Management
export const adminFetchUsers = () => {
  return api.get("/auth/users");
};

export const adminAddUser = (user) => {
  return api.post("/auth/users", user);
};

export const adminUpdateUser = (id, user) => {
  return api.put(`/auth/users/${id}`, user);
};

export const adminDeleteUser = (id) => {
  return api.delete(`/auth/users/${id}`);
};

// Tag Management
export const adminFetchTags = () => {
  return api.get("/tags");
};

export const adminAddTag = (tag) => {
  return api.post("/tags", tag);
};

export const adminUpdateTag = (id, tag) => {
  return api.put(`/tags/${id}`, tag);
};

export const adminDeleteTag = (id) => {
  return api.delete(`/tags/${id}`);
};
