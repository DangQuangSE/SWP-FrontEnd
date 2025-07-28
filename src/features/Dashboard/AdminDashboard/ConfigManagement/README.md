# Config Management Module

## Tổng quan
Module Quản lý Cấu hình chung (Config Management) cho phép admin quản lý các cấu hình hệ thống như giới hạn booking, thời gian timeout, và các tham số khác.

## Tính năng
- ✅ Xem danh sách tất cả cấu hình
- ✅ Thêm cấu hình mới
- ✅ Sửa cấu hình hiện có
- ✅ Xóa cấu hình
- ✅ Làm mới danh sách
- ✅ Phân trang và tìm kiếm
- ✅ Responsive design

## API Endpoints

### 1. Tạo cấu hình mới
```
POST /api/config
Content-Type: application/json

Request Body:
{
  "name": "MAX_BOOKING",
  "value": 6
}

Response:
{
  "id": 4,
  "name": "MAX_BOOKING", 
  "value": 6
}
```

### 2. Lấy tất cả cấu hình
```
GET /api/config

Response:
[
  {
    "id": 3,
    "name": "MAX_BOOKING",
    "value": 6
  },
  {
    "id": 4,
    "name": "MIN_BOOKING",
    "value": 1
  }
]
```

### 3. Cập nhật cấu hình
```
PUT /api/config/{id}
Content-Type: application/json

Request Body:
{
  "value": 8
}

Response:
{
  "id": 3,
  "name": "MAX_BOOKING",
  "value": 8
}
```

### 4. Xóa cấu hình
```
DELETE /api/config/{id}

Response: 200 OK
```

## Cấu trúc Files

```
ConfigManagement/
├── ConfigManagement.jsx     # Component chính
├── ConfigManagement.css     # Styles
├── ConfigManagement.test.jsx # Unit tests
└── README.md               # Documentation
```

## Sử dụng

### Import và sử dụng component
```jsx
import ConfigManagement from './ConfigManagement/ConfigManagement';

function AdminDashboard() {
  return (
    <div>
      <ConfigManagement />
    </div>
  );
}
```

### Các props (không có props bắt buộc)
Component này không nhận props và tự quản lý state nội bộ.

## Validation Rules

### Tên cấu hình (name)
- Bắt buộc
- Tối thiểu 2 ký tự
- Nên sử dụng format UPPER_CASE với underscore

### Giá trị (value)
- Bắt buộc
- Phải là số nguyên
- Không được âm (>= 0)

## Error Handling

Component xử lý các lỗi sau:
- Lỗi kết nối API
- Lỗi validation form
- Lỗi server (500, 404, etc.)
- Timeout requests

Tất cả lỗi đều hiển thị thông báo user-friendly qua Ant Design message.

## Testing

Chạy tests:
```bash
npm test ConfigManagement.test.jsx
```

Test coverage bao gồm:
- Render component
- Load data từ API
- Create/Edit/Delete operations
- Error handling
- User interactions

## Styling

Component sử dụng:
- Ant Design components
- Custom CSS classes (ConfigManagement.css)
- Responsive design
- Modern UI với gradients và shadows

## Performance

- Lazy loading cho large datasets
- Debounced search (nếu có)
- Optimized re-renders với React.memo
- Efficient API calls với proper loading states

## Security

- Authentication required (JWT token)
- Authorization check cho admin role
- Input sanitization
- XSS protection

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Troubleshooting

### Lỗi thường gặp:

1. **API không response**
   - Kiểm tra server đang chạy
   - Verify API endpoints
   - Check network connectivity

2. **Validation errors**
   - Đảm bảo input đúng format
   - Check required fields

3. **Permission denied**
   - Verify user có admin role
   - Check JWT token validity

### Debug mode
Bật console logs để debug:
```javascript
localStorage.setItem('debug', 'true');
```

## Changelog

### v1.0.0 (2024-01-XX)
- Initial release
- Basic CRUD operations
- Responsive UI
- Unit tests
- Documentation
