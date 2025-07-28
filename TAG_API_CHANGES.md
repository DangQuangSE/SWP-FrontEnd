# Tag API Changes - Removed Role Restrictions

## Summary
Đã bỏ việc xét quyền role cho các API liên quan đến tag. Bây giờ tất cả user đã đăng nhập đều có thể tạo, sửa, xóa tag.

## Changes Made

### 1. Created New Tag API File
- **File**: `src/api/tagAPI.js`
- **Purpose**: Chứa các API function cho tag không có giới hạn role
- **Functions**:
  - `fetchTags()` - Lấy danh sách tag
  - `createTag(tag)` - Tạo tag mới
  - `updateTag(id, tag)` - Cập nhật tag
  - `deleteTag(id)` - Xóa tag
  - `fetchTagById(id)` - Lấy tag theo ID

### 2. Updated Admin API File
- **File**: `src/api/Adminapi.js`
- **Changes**: Thêm các public tag functions (không có prefix "admin")
- **Backward Compatibility**: Giữ lại các admin functions để tương thích ngược

### 3. Updated Components

#### BlogManagement.jsx (Admin Dashboard)
- **File**: `src/features/Dashboard/AdminDashboard/Blog/BlogManagement.jsx`
- **Changes**:
  - Import từ `tagAPI.js` thay vì gọi trực tiếp axios
  - Sử dụng `fetchTags()`, `createTag()`, `updateTag()`, `deleteTag()`
  - Bỏ việc gọi trực tiếp API endpoint

#### WriteBlogs.jsx (Consultant Dashboard)
- **File**: `src/features/Dashboard/ConsultantDashboard/WriteBlogs/WriteBlogs.jsx`
- **Changes**:
  - Import từ `tagAPI.js` thay vì gọi trực tiếp axios
  - Sử dụng `fetchTags()`, `createTag()`, `updateTag()`, `deleteTag()`
  - Bỏ việc gọi trực tiếp API endpoint

#### consultantAPI.js
- **File**: `src/api/consultantAPI.js`
- **Changes**: Export các tag functions từ `tagAPI.js` để tương thích

## Authentication
- **Token**: Vẫn gửi Bearer token trong header Authorization
- **Backend**: Backend vẫn cần verify token để xác thực user
- **Role Check**: Không còn kiểm tra role cụ thể cho tag operations

## Benefits
1. **Simplified Access**: Mọi user đăng nhập đều có thể quản lý tag
2. **Consistent API**: Sử dụng cùng một bộ API functions cho tất cả components
3. **Better Maintainability**: Tập trung logic tag vào một file duy nhất
4. **Backward Compatibility**: Không phá vỡ code hiện tại

## Usage Example
```javascript
import { fetchTags, createTag, updateTag, deleteTag } from "../../../../api/tagAPI";

// Fetch all tags
const tags = await fetchTags();

// Create new tag
const newTag = await createTag({ name: "New Tag", description: "Description" });

// Update tag
await updateTag(tagId, { name: "Updated Tag" });

// Delete tag
await deleteTag(tagId);
```

## Notes
- Backend cần được cập nhật để bỏ role restriction cho tag endpoints
- Frontend vẫn gửi authentication token
- Các admin functions cũ vẫn tồn tại trong `Adminapi.js` để tương thích ngược
