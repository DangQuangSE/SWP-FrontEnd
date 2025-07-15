# Customer Chat Widget - Unread Count Feature

## Tổng quan
Tính năng hiển thị số tin nhắn chưa đọc trên button chat của customer, giống như Messenger, WhatsApp và các ứng dụng chat khác.

## Tính năng chính

### ✅ **Realtime Unread Count**
- Tự động tăng khi có tin nhắn mới từ staff (qua WebSocket)
- Chỉ tăng khi widget đang đóng
- Chỉ đếm tin nhắn từ staff (không đếm tin nhắn của customer)

### ✅ **Professional UI**
- Badge đỏ với animation pulse giống Messenger
- Tự động ẩn khi count = 0
- Responsive design với shadow effects
- Smooth transitions và hover effects

### ✅ **Persistence**
- Lưu unread count vào localStorage
- Khôi phục count khi reload trang
- Sync với server khi có session

### ✅ **Smart Logic**
- Auto reset khi mở widget
- Fetch từ server khi establish session
- Error handling với fallback values

## Implementation Details

### 1. **API Integration**
```javascript
// customerChatAPI.js - New method
async getUnreadCount(sessionId, customerName) {
  const response = await this.api.get(
    `/chat/sessions/${sessionId}/unread-count`,
    { params: { readerName: customerName } }
  );
  return response.data || 0;
}
```

### 2. **State Management**
```javascript
// CustomerChatWidget.jsx
const [unreadCount, setUnreadCount] = useState(() => {
  // Load from localStorage on init
  const saved = localStorage.getItem("chat_unread_count");
  return saved ? parseInt(saved, 10) : 0;
});

// Update with persistence
const updateUnreadCount = useCallback((newCount) => {
  setUnreadCount(newCount);
  localStorage.setItem("chat_unread_count", newCount.toString());
}, []);
```

### 3. **WebSocket Integration**
```javascript
// Increment on new staff message (widget closed)
if (!isOpen && data.senderType === "STAFF") {
  setUnreadCount((prev) => {
    const newCount = prev + 1;
    localStorage.setItem("chat_unread_count", newCount.toString());
    return newCount;
  });
}
```

### 4. **UI Component**
```jsx
<Badge 
  count={unreadCount} 
  offset={[-8, 8]}
  style={{
    backgroundColor: "#ff4d4f",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    minWidth: "20px",
    height: "20px",
    lineHeight: "20px",
    borderRadius: "10px",
    border: "2px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
  }}
  showZero={false}
>
  <Button ... />
</Badge>
```

## CSS Styling

### Badge Animation
```css
.chat-widget-button .ant-badge-count {
  background: #ff4d4f !important;
  animation: pulse 2s infinite !important;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

## Workflow

### 1. **Khởi tạo**
- Load unread count từ localStorage
- Hiển thị badge nếu count > 0

### 2. **Khi có tin nhắn mới**
- WebSocket nhận message từ staff
- Kiểm tra widget đang đóng
- Tăng unread count + save localStorage
- Badge tự động cập nhật với animation

### 3. **Khi mở widget**
- Reset unread count về 0
- Save vào localStorage
- Badge tự động ẩn

### 4. **Khi có session**
- Fetch unread count từ server
- Sync với localStorage
- Cập nhật UI

## Testing

### Demo Component
```javascript
import CustomerUnreadCountDemo from './CustomerUnreadCountDemo';

// Test các tính năng:
// - Create demo session
// - Fetch unread count từ API
// - Simulate new message
// - Simulate read messages
// - LocalStorage persistence
```

### Manual Testing
1. Mở trang có CustomerChatWidget
2. Để widget đóng
3. Gửi tin nhắn từ staff dashboard
4. Kiểm tra badge hiển thị số tin nhắn chưa đọc
5. Click mở widget → badge biến mất
6. Reload trang → badge vẫn hiển thị đúng

## Browser Support
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Mobile browsers
- ✅ localStorage support required

## Performance
- Lightweight implementation
- Efficient WebSocket handling
- Minimal re-renders với useCallback
- CSS animations với GPU acceleration

## Future Enhancements
1. **Server-side read receipts**
2. **Multiple session support**
3. **Sound notifications**
4. **Desktop notifications**
5. **Message preview in badge tooltip**

## Troubleshooting

### Badge không hiển thị
- Kiểm tra unreadCount state
- Kiểm tra localStorage value
- Kiểm tra CSS styling

### Không tăng khi có tin nhắn mới
- Kiểm tra WebSocket connection
- Kiểm tra message.senderType === "STAFF"
- Kiểm tra widget isOpen state

### Không persist sau reload
- Kiểm tra localStorage support
- Kiểm tra saveUnreadCount function
- Kiểm tra initial state loading
