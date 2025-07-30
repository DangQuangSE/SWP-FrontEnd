import api from "../configs/api";

/**
 * Tag API functions - No role restrictions
 * These APIs can be used by any authenticated user
 */

// Fetch all tags
export const fetchTags = () => {
  return api.get("/tags");
};

// Create a new tag
export const createTag = (tag) => {
  return api.post("/tags", tag);
};

// Update an existing tag
export const updateTag = (id, tag) => {
  return api.put(`/tags/${id}`, tag);
};

// Delete a tag
export const deleteTag = (id) => {
  return api.delete(`/tags/${id}`);
};

// Fetch a single tag by ID
export const fetchTagById = (id) => {
  return api.get(`/tags/${id}`);
};

// Fetch blogs by multiple tags
export const fetchBlogsByMultipleTags = (tagIds, page = 0, size = 10) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  // Add each tag ID as a separate parameter
  tagIds.forEach((tagId) => {
    params.append("tags", tagId);
  });

  return api.get(`/blog/by-tags?${params.toString()}`);
};

// Fetch blogs by single tag (existing functionality)
export const fetchBlogsByTag = (tagId, page = 0, size = 10) => {
  return api.get(`/blog/by-tag/${tagId}?page=${page}&size=${size}`);
};
