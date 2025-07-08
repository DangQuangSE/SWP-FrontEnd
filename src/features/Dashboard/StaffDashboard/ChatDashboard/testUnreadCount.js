/**
 * Test file để kiểm tra API unread count
 * Chạy file này để test API /chat/sessions/{sessionId}/unread-count
 */

import chatAPIService from './chatAPI.js';

// Test function để kiểm tra API unread count
const testUnreadCountAPI = async () => {
  console.log("🧪 [TEST] Starting unread count API test...");
  
  try {
    // Test với session ID mẫu
    const testSessionId = "chat_ea2c5354"; // Thay bằng session ID thực tế
    const testReaderName = "Nhân viên hỗ trợ";
    
    console.log("🔍 [TEST] Testing with:", {
      sessionId: testSessionId,
      readerName: testReaderName
    });
    
    // Gọi API unread count
    const unreadCount = await chatAPIService.getUnreadCount(testSessionId, testReaderName);
    
    console.log("✅ [TEST] API Response:", unreadCount);
    console.log("📊 [TEST] Unread count type:", typeof unreadCount);
    console.log("📊 [TEST] Unread count value:", unreadCount);
    
    // Kiểm tra response format
    if (typeof unreadCount === 'number') {
      console.log("✅ [TEST] Response format is correct (number)");
    } else {
      console.log("⚠️ [TEST] Response format might be incorrect:", typeof unreadCount);
    }
    
  } catch (error) {
    console.error("❌ [TEST] API Error:", error);
    console.error("❌ [TEST] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
};

// Test function để kiểm tra multiple sessions
const testMultipleSessionsUnreadCount = async () => {
  console.log("🧪 [TEST] Testing multiple sessions unread count...");
  
  try {
    // Lấy danh sách active sessions trước
    const activeSessions = await chatAPIService.getChatSessions("ACTIVE");
    console.log("📋 [TEST] Active sessions:", activeSessions.length);
    
    if (activeSessions.length === 0) {
      console.log("⚠️ [TEST] No active sessions found for testing");
      return;
    }
    
    // Test unread count cho từng session
    const testReaderName = "Nhân viên hỗ trợ";
    
    for (const session of activeSessions.slice(0, 3)) { // Test tối đa 3 sessions
      console.log(`🔍 [TEST] Testing session: ${session.sessionId}`);
      
      try {
        const unreadCount = await chatAPIService.getUnreadCount(session.sessionId, testReaderName);
        console.log(`✅ [TEST] Session ${session.sessionId} unread count:`, unreadCount);
      } catch (error) {
        console.error(`❌ [TEST] Error for session ${session.sessionId}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ [TEST] Error getting sessions:", error);
  }
};

// Export test functions
export {
  testUnreadCountAPI,
  testMultipleSessionsUnreadCount
};

// Chạy test nếu file được import trực tiếp
if (typeof window !== 'undefined') {
  console.log("🧪 [TEST] Unread Count API Test Module Loaded");
  console.log("🧪 [TEST] Available functions:");
  console.log("  - testUnreadCountAPI()");
  console.log("  - testMultipleSessionsUnreadCount()");
  console.log("🧪 [TEST] Run these functions in browser console to test");
}
