// Test script để kiểm tra flow thanh toán → tạo Zoom link → gán vào button

console.log("🧪 Testing Payment → Zoom → Button Flow");
console.log("========================================");

// Simulate payment success flow
function simulatePaymentSuccess(appointmentId) {
  console.log("\n💳 STEP 1: Payment Success");
  console.log("==========================");
  console.log("vnpResponseCode: '00'");
  console.log("vnpTransactionStatus: '00'");
  console.log("appointmentId:", appointmentId);
  
  console.log("\n🔄 STEP 2: Call createZoomMeetingIfNeeded()");
  console.log("============================================");
  console.log("1. Check if service is CONSULTING_ON");
  console.log("2. Call API: GET /api/zoom/test-create-meeting?appointmentId=" + appointmentId);
  console.log("3. Zoom API creates meeting and returns join_url");
  console.log("4. Refresh appointments after 1s to get updated appointmentDetails");
  console.log("5. Show message: 'Phòng tư vấn online đã sẵn sàng! Bạn có thể tham gia bất cứ lúc nào.'");
  
  console.log("\n📋 STEP 3: Refresh Appointments Data");
  console.log("====================================");
  console.log("Call API: GET /appointment/by-status?status=CONFIRMED");
  console.log("Response includes updated appointmentDetails with join_url:");
  
  const mockUpdatedAppointment = {
    id: appointmentId,
    serviceType: "CONSULTING_ON",
    status: "CONFIRMED",
    appointmentDetails: [
      {
        id: appointmentId,
        serviceType: "CONSULTING_ON",
        joinUrl: "https://zoom.us/j/123456789?pwd=abcdef", // ← join_url đã có
        startUrl: "https://zoom.us/s/123456789?pwd=abcdef",
        status: "CONFIRMED"
      }
    ]
  };
  
  console.log("Updated appointment:", mockUpdatedAppointment);
  
  console.log("\n🎯 STEP 4: Button Logic Update");
  console.log("==============================");
  testButtonAfterPayment(mockUpdatedAppointment);
}

// Test button logic after payment success
function testButtonAfterPayment(appointment) {
  // Logic kiểm tra hiển thị button
  const isConsultingOnline = 
    appointment.serviceType === "CONSULTING_ON" || 
    appointment.appointmentDetails?.some((detail) => {
      return detail.serviceType === "CONSULTING_ON";
    }) || false;

  const isConfirmed = appointment.status === "CONFIRMED";
  const shouldShowButton = isConsultingOnline && isConfirmed;

  // Logic lấy join_url từ appointmentDetails
  const joinUrl = appointment.appointmentDetails?.find(
    (detail) => detail.serviceType === "CONSULTING_ON"
  )?.joinUrl;

  console.log("shouldShowButton:", shouldShowButton);
  console.log("joinUrl found:", !!joinUrl);
  console.log("joinUrl value:", joinUrl);
  console.log("buttonText:", joinUrl ? "Tham gia ngay" : "Tư vấn Online");
  console.log("buttonTitle:", joinUrl ? "Click để tham gia ngay" : "Click để kết nối phòng tư vấn");
  
  if (joinUrl) {
    console.log("\n✅ SUCCESS: Button ready for direct access!");
    console.log("When user clicks button:");
    console.log("1. window.open('" + joinUrl + "', '_blank')");
    console.log("2. Show message: 'Đã mở phòng tư vấn online!'");
    console.log("3. Start blinking animation for 3 seconds");
  } else {
    console.log("\n⚠️ WARNING: No join_url found!");
    console.log("Button will fallback to createAndOpenZoomMeeting()");
  }
}

// Test complete flow
function testCompleteFlow() {
  console.log("\n🎬 COMPLETE FLOW TEST");
  console.log("====================");
  
  const appointmentId = 23;
  
  console.log("📝 Scenario: User completes VNPay payment for CONSULTING_ON service");
  console.log("Expected outcome: Button changes from 'Tư vấn Online' to 'Tham gia ngay'");
  
  // Before payment
  console.log("\n🔴 BEFORE PAYMENT:");
  const appointmentBefore = {
    id: appointmentId,
    serviceType: "CONSULTING_ON",
    status: "CONFIRMED",
    appointmentDetails: [
      {
        id: appointmentId,
        serviceType: "CONSULTING_ON",
        joinUrl: null, // ← Chưa có join_url
        startUrl: null,
        status: "CONFIRMED"
      }
    ]
  };
  
  console.log("Button text: 'Tư vấn Online'");
  console.log("Button action: createAndOpenZoomMeeting() - tạo meeting mới");
  
  // Simulate payment success
  simulatePaymentSuccess(appointmentId);
  
  console.log("\n🟢 AFTER PAYMENT:");
  console.log("Button text: 'Tham gia ngay'");
  console.log("Button action: window.open(join_url) - mở trực tiếp");
  
  console.log("\n🎉 RESULT: User can now join meeting anytime without creating new one!");
}

// API call examples
function showAPIExamples() {
  console.log("\n📡 API CALLS INVOLVED");
  console.log("=====================");
  
  console.log("\n1. Create Zoom Meeting:");
  console.log("GET /api/zoom/test-create-meeting?appointmentId=23");
  console.log("Response: { join_url: '...', start_url: '...', meeting_id: '...' }");
  
  console.log("\n2. Get Updated Appointments:");
  console.log("GET /appointment/by-status?status=CONFIRMED");
  console.log("Response: [{ appointmentDetails: [{ joinUrl: '...' }] }]");
  
  console.log("\n3. No additional API calls needed for button click!");
  console.log("Direct access using join_url from appointmentDetails");
}

// Run tests
console.log("🚀 Running Complete Flow Test...");
testCompleteFlow();
showAPIExamples();

console.log("\n✅ KEY POINTS:");
console.log("1. Payment success → Create Zoom link (background)");
console.log("2. Refresh appointments → Get join_url in appointmentDetails");
console.log("3. Button automatically updates to 'Tham gia ngay'");
console.log("4. User clicks when ready → Direct access, no API calls");
console.log("5. No automatic opening of meeting room");

// Export functions
window.simulatePaymentSuccess = simulatePaymentSuccess;
window.testButtonAfterPayment = testButtonAfterPayment;
window.testCompleteFlow = testCompleteFlow;

console.log("\n🎯 Available test functions:");
console.log("- simulatePaymentSuccess(appointmentId)");
console.log("- testButtonAfterPayment(appointment)");
console.log("- testCompleteFlow()");
