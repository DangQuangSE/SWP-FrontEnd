# Chat Unread Count Feature

## Tổng quan
Tính năng đếm tin nhắn chưa đọc trong chat dashboard cho phép staff xem số lượng tin nhắn chưa đọc trong mỗi session chat.

## API Endpoint
```
GET /api/chat/sessions/{sessionId}/unread-count?readerName={readerName}
```

### Parameters
- `sessionId` (path): ID của chat session
- `readerName` (query): Tên của người đọc (staff name)

### Response
```json
1
```
Response trả về là một số nguyên đại diện cho số lượng tin nhắn chưa đọc.

## Implementation

### 1. API Service Method
Đã thêm method `getUnreadCount` vào `chatAPI.js`:

```javascript
async getUnreadCount(sessionId, readerName) {
  try {
    const response = await this.api.get(
      `/chat/sessions/${sessionId}/unread-count`,
      {
        params: { readerName },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting unread count for session ${sessionId}:`, error);
    throw error;
  }
}
```

### 2. Frontend Integration
Đã cập nhật `StaffChatInterface.jsx` để:

1. **Fetch unread counts**: Thêm function `fetchUnreadCountsForSessions` để lấy unread count cho tất cả sessions
2. **Update load functions**: Cập nhật `loadAllSessions` và `loadSessionsForTab` để gọi API unread count
3. **Display badges**: UI đã có sẵn logic hiển thị badge với unread count

### 3. Key Functions

#### fetchUnreadCountsForSessions
```javascript
const fetchUnreadCountsForSessions = async (sessions, staffName) => {
  // Fetch unread counts for all sessions in parallel
  const unreadCountPromises = sessions.map(async (session) => {
    try {
      const unreadCount = await chatAPIService.getUnreadCount(session.sessionId, staffName);
      return {
        sessionId: session.sessionId,
        unreadCount: unreadCount || 0
      };
    } catch (error) {
      return {
        sessionId: session.sessionId,
        unreadCount: 0
      };
    }
  });

  const unreadCounts = await Promise.all(unreadCountPromises);
  
  // Map unread counts back to sessions
  return sessions.map(session => {
    const unreadData = unreadCounts.find(uc => uc.sessionId === session.sessionId);
    return {
      ...session,
      unreadCount: unreadData ? unreadData.unreadCount : 0
    };
  });
};
```

## UI Display

### Tab Badges
Tabs hiển thị tổng số sessions có tin nhắn chưa đọc:
```jsx
<Badge
  count={activeSessions.filter((s) => s.unreadCount > 0).length}
  size="small"
/>
```

### Session Cards
Mỗi session card hiển thị badge với số lượng tin nhắn chưa đọc:
```jsx
{session.unreadCount > 0 && (
  <Badge
    count={session.unreadCount}
    style={{
      position: "absolute",
      top: "-2px",
      right: "-2px",
      minWidth: "18px",
      height: "18px",
      lineHeight: "18px",
      fontSize: "11px",
    }}
  />
)}
```

## Testing

### 1. Test Files
- `testUnreadCount.js`: Test functions để kiểm tra API
- `UnreadCountDemo.jsx`: Demo component để test UI

### 2. Test Functions
```javascript
// Test single session
await testUnreadCountAPI();

// Test multiple sessions
await testMultipleSessionsUnreadCount();
```

### 3. Manual Testing
1. Mở chat dashboard
2. Chuyển đến tab "đang hoạt động"
3. Kiểm tra badge hiển thị số tin nhắn chưa đọc
4. Click refresh để cập nhật unread count

## Configuration

### Staff Name
Hiện tại sử dụng hardcoded staff name: `"Nhân viên hỗ trợ"`

Có thể cập nhật để lấy từ user context:
```javascript
const staffName = useContext(UserContext)?.name || "Nhân viên hỗ trợ";
```

## Error Handling
- API errors được catch và log
- Fallback về unreadCount = 0 nếu có lỗi
- UI vẫn hoạt động bình thường khi API lỗi

## Performance Considerations
- Sử dụng Promise.all để fetch unread counts parallel
- Cache unread counts trong component state
- Chỉ fetch khi cần thiết (tab change, refresh)

## Future Improvements
1. Real-time updates qua WebSocket
2. Caching unread counts
3. Batch API để lấy multiple unread counts trong 1 request
4. User-specific staff names
5. Mark as read functionality integration
