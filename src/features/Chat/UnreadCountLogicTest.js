/**
 * Test file để verify logic unread count API
 * Kiểm tra xem readerName được truyền đúng chưa
 */

import chatAPIService from '../Dashboard/StaffDashboard/ChatDashboard/chatAPI.js';
import { customerChatAPI } from './customerChatAPI.js';

/**
 * Test logic unread count cho cả staff và customer
 */
const testUnreadCountLogic = async () => {
  console.log("🧪 [TEST] Starting unread count logic test...");
  
  // Test data
  const testSessionId = "chat_ea2c5354"; // Thay bằng session ID thực tế
  const testCustomerName = "Nguyễn Văn A"; // Tên customer trong session
  const staffReaderName = "Nhân viên hỗ trợ"; // Staff reader name
  
  console.log("📋 [TEST] Test parameters:", {
    sessionId: testSessionId,
    customerName: testCustomerName,
    staffReaderName: staffReaderName
  });
  
  try {
    console.log("\n=== CUSTOMER PERSPECTIVE ===");
    console.log("🔍 [TEST] Customer calls API with customerName as readerName");
    console.log("📊 [TEST] This should count messages FROM staff (not from customer)");
    
    const customerUnreadCount = await customerChatAPI.getUnreadCount(
      testSessionId, 
      testCustomerName
    );
    
    console.log("✅ [TEST] Customer unread count:", customerUnreadCount);
    console.log("📝 [TEST] This represents messages from staff that customer hasn't read");
    
    console.log("\n=== STAFF PERSPECTIVE ===");
    console.log("🔍 [TEST] Staff calls API with 'Nhân viên hỗ trợ' as readerName");
    console.log("📊 [TEST] This should count messages FROM customer (not from staff)");
    
    const staffUnreadCount = await chatAPIService.getUnreadCount(
      testSessionId, 
      staffReaderName
    );
    
    console.log("✅ [TEST] Staff unread count:", staffUnreadCount);
    console.log("📝 [TEST] This represents messages from customer that staff hasn't read");
    
    console.log("\n=== LOGIC VERIFICATION ===");
    console.log("🔍 [TEST] Verifying API logic...");
    
    // Test với customer name khác để verify
    console.log("🧪 [TEST] Testing with different customer name...");
    const testWithDifferentCustomer = await customerChatAPI.getUnreadCount(
      testSessionId, 
      "Different Customer"
    );
    
    console.log("📊 [TEST] Unread count with different customer name:", testWithDifferentCustomer);
    
    console.log("\n=== EXPECTED BEHAVIOR ===");
    console.log("✅ Customer API (readerName = customerName):");
    console.log("   → Should count messages where senderName != customerName");
    console.log("   → Typically counts staff messages");
    console.log("");
    console.log("✅ Staff API (readerName = 'Nhân viên hỗ trợ'):");
    console.log("   → Should count messages where senderName != 'Nhân viên hỗ trợ'");
    console.log("   → Typically counts customer messages");
    console.log("");
    console.log("⚠️  If staff uses customerName as readerName:");
    console.log("   → Would count staff messages (WRONG for staff perspective)");
    console.log("");
    console.log("⚠️  If customer uses 'Nhân viên hỗ trợ' as readerName:");
    console.log("   → Would count customer messages (WRONG for customer perspective)");
    
  } catch (error) {
    console.error("❌ [TEST] Error during test:", error);
    console.error("❌ [TEST] Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
};

/**
 * Test với multiple sessions để verify logic
 */
const testMultipleSessionsLogic = async () => {
  console.log("\n🧪 [TEST] Testing multiple sessions logic...");
  
  try {
    // Lấy danh sách active sessions
    const activeSessions = await chatAPIService.getChatSessions("ACTIVE");
    console.log("📋 [TEST] Found active sessions:", activeSessions.length);
    
    if (activeSessions.length === 0) {
      console.log("⚠️ [TEST] No active sessions found");
      return;
    }
    
    // Test với 2-3 sessions đầu tiên
    const testSessions = activeSessions.slice(0, 3);
    
    for (const session of testSessions) {
      console.log(`\n--- Testing Session: ${session.sessionId} ---`);
      console.log(`Customer: ${session.customerName}`);
      
      try {
        // Test staff perspective (should count customer messages)
        const staffUnread = await chatAPIService.getUnreadCount(
          session.sessionId, 
          "Nhân viên hỗ trợ"
        );
        
        // Test customer perspective (should count staff messages)
        const customerUnread = await customerChatAPI.getUnreadCount(
          session.sessionId, 
          session.customerName
        );
        
        console.log(`📊 Staff unread (customer messages): ${staffUnread}`);
        console.log(`📊 Customer unread (staff messages): ${customerUnread}`);
        
        // Verify logic
        if (staffUnread >= 0 && customerUnread >= 0) {
          console.log("✅ Both counts are valid (>= 0)");
        } else {
          console.log("❌ Invalid counts detected");
        }
        
      } catch (error) {
        console.error(`❌ Error testing session ${session.sessionId}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error("❌ [TEST] Error getting sessions:", error);
  }
};

// Export test functions
export {
  testUnreadCountLogic,
  testMultipleSessionsLogic
};

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log("🧪 [TEST] Unread Count Logic Test Module Loaded");
  console.log("🧪 [TEST] Available functions:");
  console.log("  - testUnreadCountLogic()");
  console.log("  - testMultipleSessionsLogic()");
  console.log("🧪 [TEST] Run these functions in browser console to test");
}
