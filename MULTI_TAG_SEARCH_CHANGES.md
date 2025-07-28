# Multi-Tag Search Implementation

## Summary
Đã cập nhật tính năng tìm kiếm blog từ single tag sang multi-tag search với dropdown Select component.

## Changes Made

### 1. Updated Tag API
- **File**: `src/api/tagAPI.js`
- **New Functions**:
  - `fetchBlogsByMultipleTags(tagIds, page, size)` - Tìm blog theo nhiều tag
  - `fetchBlogsByTag(tagId, page, size)` - Tìm blog theo 1 tag (existing)

### 2. Updated Public Blog Page
- **File**: `src/features/bloglist/allBlog.jsx`
- **Changes**:
  - Thay đổi từ `selectedTag` sang `selectedTags` (array)
  - Thay thế tag buttons bằng multi-select dropdown
  - Logic tìm kiếm hỗ trợ multiple tags
  - Fallback về single tag API nếu multi-tag API không hoạt động

### 3. Updated Admin Dashboard
- **File**: `src/features/Dashboard/AdminDashboard/Blog/BlogManagement.jsx`
- **Changes**:
  - State: `selectedTag` → `selectedTags`
  - Handler: `handleFilterByTag` → `handleFilterByTags`
  - UI: Single select → Multi-select dropdown
  - Logic: Hỗ trợ cả single và multiple tag search

### 4. Updated Consultant Dashboard
- **File**: `src/features/Dashboard/ConsultantDashboard/WriteBlogs/WriteBlogs.jsx`
- **Changes**:
  - State: `selectedTag` → `selectedTags`
  - Handler: `handleFilterByTag` → `handleFilterByTags`
  - UI: Single select → Multi-select dropdown
  - Logic: Hỗ trợ cả single và multiple tag search

### 5. Updated Consultant API
- **File**: `src/api/consultantAPI.js`
- **Changes**: Export thêm `fetchBlogsByMultipleTags` và `fetchBlogsByTag`

## API Endpoints

### New Multi-Tag Search API
```
GET /blog/by-tags?tags=1&tags=2&tags=3&page=0&size=10
```

### Existing Single Tag API (still supported)
```
GET /blog/by-tag/{tagId}?page=0&size=10
```

## UI Changes

### Before (Tag Buttons)
```jsx
<button className="blog-tag-filter-btn" onClick={() => handleFilterTag(tag.id)}>
  {tag.name}
</button>
```

### After (Multi-Select Dropdown)
```jsx
<Select
  mode="multiple"
  allowClear
  placeholder="Chọn một hoặc nhiều chủ đề"
  value={selectedTags}
  onChange={handleTagsChange}
  options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
  maxTagCount="responsive"
/>
```

## Features

### 1. Multi-Tag Selection
- User có thể chọn nhiều tag cùng lúc
- Dropdown hiển thị tất cả tag available
- Clear all tags để xem tất cả blog

### 2. Responsive Design
- `maxTagCount="responsive"` để hiển thị tag phù hợp với màn hình
- `minWidth: 200-300px` cho dropdown

### 3. Fallback Logic
- Nếu multi-tag API không hoạt động, fallback về single tag API
- Graceful error handling

### 4. Backward Compatibility
- Vẫn hỗ trợ single tag search
- Existing API endpoints vẫn hoạt động

## Usage Examples

### Frontend Usage
```javascript
// Search by multiple tags
const blogs = await fetchBlogsByMultipleTags([1, 2, 3], 0, 10);

// Search by single tag (existing)
const blogs = await fetchBlogsByTag(1, 0, 10);

// Component state
const [selectedTags, setSelectedTags] = useState([]);

// Handler
const handleTagsChange = (tagIds) => {
  setSelectedTags(tagIds || []);
};
```

### Backend Requirements
Backend cần implement endpoint `/blog/by-tags` với parameters:
- `tags`: Array of tag IDs (multiple values)
- `page`: Page number (optional, default 0)
- `size`: Page size (optional, default 10)

## Benefits
1. **Better UX**: User có thể tìm blog theo nhiều chủ đề cùng lúc
2. **More Flexible**: Không giới hạn chỉ 1 tag
3. **Cleaner UI**: Dropdown thay vì nhiều buttons
4. **Responsive**: Tự động điều chỉnh theo màn hình
5. **Backward Compatible**: Không phá vỡ existing functionality

## Notes
- Backend cần implement `/blog/by-tags` endpoint
- Frontend có fallback logic nếu multi-tag API chưa sẵn sàng
- UI responsive và user-friendly
- Maintain existing single tag functionality
