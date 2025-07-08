// Test script để kiểm tra logic Zoom mới (đã cập nhật)

console.log("🧪 Testing Updated Zoom Logic");
console.log("=============================");

// Test case: Appointment với join_url có sẵn
const appointmentWithJoinUrl = {
  id: 23,
  serviceType: "CONSULTING_ON",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 23,
      serviceId: 1,
      serviceName: "Tư vấn online phụ khoa",
      serviceType: "CONSULTING_ON",
      consultantId: 2,
      consultantName: "Dr. Smith",
      slotTime: "2025-07-08T08:30:00",
      joinUrl: "https://zoom.us/j/123456789?pwd=abcdef",
      startUrl: "https://zoom.us/s/123456789?pwd=abcdef",
      status: "CONFIRMED"
    }
  ]
};

// Test case: Appointment không có join_url
const appointmentWithoutJoinUrl = {
  id: 24,
  serviceType: "CONSULTING_ON",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 24,
      serviceId: 2,
      serviceName: "Tư vấn online tim mạch",
      serviceType: "CONSULTING_ON",
      consultantId: 3,
      consultantName: "Dr. Johnson",
      slotTime: "2025-07-08T10:00:00",
      joinUrl: null,
      startUrl: null,
      status: "CONFIRMED"
    }
  ]
};

// Function để test logic button
function testButtonLogic(appointment) {
  console.log(`\n=== Testing Button Logic for Appointment ${appointment.id} ===`);
  
  // Logic kiểm tra hiển thị button
  const isConsultingOnline = 
    appointment.serviceType === "CONSULTING_ON" || 
    appointment.appointmentDetails?.some((detail) => {
      return detail.serviceType === "CONSULTING_ON";
    }) || false;

  const isConfirmed = appointment.status === "CONFIRMED";
  const shouldShowButton = isConsultingOnline && isConfirmed;

  // Logic lấy join_url
  const joinUrl = appointment.appointmentDetails?.find(
    (detail) => detail.serviceType === "CONSULTING_ON"
  )?.joinUrl;

  console.log("shouldShowButton:", shouldShowButton);
  console.log("joinUrl:", joinUrl);
  console.log("buttonText:", joinUrl ? "Tham gia ngay" : "Tư vấn Online");
  console.log("buttonTitle:", joinUrl ? "Click để tham gia ngay" : "Click để kết nối phòng tư vấn");

  return {
    shouldShowButton,
    joinUrl,
    buttonText: joinUrl ? "Tham gia ngay" : "Tư vấn Online",
    action: joinUrl ? "openDirectly" : "createAndOpen"
  };
}

// Function để simulate button click
function simulateButtonClick(appointment) {
  const result = testButtonLogic(appointment);
  
  if (!result.shouldShowButton) {
    console.log("❌ Button should not be shown");
    return;
  }

  console.log("\n🖱️ Simulating button click...");
  
  if (result.joinUrl) {
    console.log("✅ Has join_url - Opening directly");
    console.log("✅ Action: window.open('" + result.joinUrl + "', '_blank')");
    console.log("✅ Message: 'Đã mở phòng tư vấn online!'");
    console.log("✅ Blinking animation: 3 seconds");
  } else {
    console.log("🔄 No join_url - Creating new meeting");
    console.log("🔄 Action: createAndOpenZoomMeeting(" + appointment.id + ")");
    console.log("🔄 Steps:");
    console.log("   1. Show loading: 'Đang tạo phòng tư vấn...'");
    console.log("   2. Call API: GET /api/zoom/test-create-meeting?appointmentId=" + appointment.id);
    console.log("   3. Open join_url from response");
    console.log("   4. Show success: 'Đã mở phòng tư vấn online!'");
    console.log("   5. Refresh appointments after 1s");
    console.log("   6. Blinking animation: 3 seconds");
  }
}

// Test flow sau thanh toán
function testPaymentSuccessFlow(appointmentId) {
  console.log("\n💳 Testing Payment Success Flow");
  console.log("================================");
  console.log("appointmentId:", appointmentId);
  
  console.log("\n📋 Steps:");
  console.log("1. Payment success detected (vnpResponseCode === '00')");
  console.log("2. Call createZoomMeetingIfNeeded(" + appointmentId + ")");
  console.log("3. Check if service is CONSULTING_ON");
  console.log("4. Call API: GET /api/zoom/test-create-meeting?appointmentId=" + appointmentId);
  console.log("5. Refresh appointments after 1s to get join_url in appointmentDetails");
  console.log("6. Button automatically changes to 'Tham gia ngay'");
  
  console.log("\n✅ Expected Result:");
  console.log("- Zoom meeting created in background");
  console.log("- join_url saved to appointmentDetails");
  console.log("- Button ready for direct access");
}

// Chạy tests
console.log("\n📊 Running Tests:");

const result1 = testButtonLogic(appointmentWithJoinUrl);
const result2 = testButtonLogic(appointmentWithoutJoinUrl);

console.log("\n🎯 Test Results:");
console.log("Appointment with join_url:", result1);
console.log("Appointment without join_url:", result2);

console.log("\n🖱️ Button Click Simulations:");
simulateButtonClick(appointmentWithJoinUrl);
simulateButtonClick(appointmentWithoutJoinUrl);

testPaymentSuccessFlow(23);

console.log("\n🔄 Key Improvements:");
console.log("✅ Removed zoomUrls cache - now uses appointmentDetails directly");
console.log("✅ Removed getZoomUrl() and joinZoomMeeting() functions");
console.log("✅ Added createAndOpenZoomMeeting() for fallback cases");
console.log("✅ Simplified logic - direct access when join_url exists");
console.log("✅ Better error handling and user feedback");

// Export functions
window.testButtonLogic = testButtonLogic;
window.simulateButtonClick = simulateButtonClick;
window.testPaymentSuccessFlow = testPaymentSuccessFlow;

console.log("\n🎯 Available test functions:");
console.log("- testButtonLogic(appointment)");
console.log("- simulateButtonClick(appointment)");
console.log("- testPaymentSuccessFlow(appointmentId)");
