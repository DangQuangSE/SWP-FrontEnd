// Test script để kiểm tra logic sử dụng join_url từ appointmentDetails

// Test case 1: Có join_url trong appointmentDetails
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
      joinUrl: "https://zoom.us/j/123456789?pwd=abcdef", // Có join_url
      startUrl: "https://zoom.us/s/123456789?pwd=abcdef",
      status: "CONFIRMED"
    }
  ]
};

// Test case 2: Không có join_url trong appointmentDetails
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
      joinUrl: null, // Không có join_url
      startUrl: null,
      status: "CONFIRMED"
    }
  ]
};

// Test case 3: Multiple appointmentDetails, chỉ CONSULTING_ON có join_url
const appointmentMultipleDetails = {
  id: 25,
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 25,
      serviceId: 3,
      serviceName: "Khám tổng quát",
      serviceType: "EXAMINATION",
      consultantId: 4,
      consultantName: "Dr. Brown",
      slotTime: "2025-07-08T14:00:00",
      joinUrl: null,
      status: "CONFIRMED"
    },
    {
      id: 26,
      serviceId: 4,
      serviceName: "Tư vấn online",
      serviceType: "CONSULTING_ON",
      consultantId: 5,
      consultantName: "Dr. Wilson",
      slotTime: "2025-07-08T16:00:00",
      joinUrl: "https://zoom.us/j/987654321?pwd=xyz123", // CONSULTING_ON có join_url
      startUrl: "https://zoom.us/s/987654321?pwd=xyz123",
      status: "CONFIRMED"
    }
  ]
};

// Function để test logic lấy join_url
function testJoinUrlLogic(appointment) {
  console.log(`\n=== Testing Appointment ${appointment.id} ===`);
  console.log("Appointment:", appointment);
  
  // Logic giống như trong component
  const isConsultingOnline = 
    appointment.serviceType === "CONSULTING_ON" || 
    appointment.appointmentDetails?.some((detail) => {
      return detail.serviceType === "CONSULTING_ON";
    }) || false;

  const isConfirmed = appointment.status === "CONFIRMED";

  // Lấy join_url từ appointmentDetails
  const joinUrl = appointment.appointmentDetails?.find(detail => 
    detail.serviceType === "CONSULTING_ON"
  )?.joinUrl;

  const shouldShowButton = isConsultingOnline && isConfirmed;

  console.log("isConsultingOnline:", isConsultingOnline);
  console.log("isConfirmed:", isConfirmed);
  console.log("joinUrl from appointmentDetails:", joinUrl);
  console.log("shouldShowButton:", shouldShowButton);
  console.log("buttonText:", joinUrl ? "Tham gia ngay" : "Tư vấn Online");
  console.log("buttonAction:", joinUrl ? "Open join_url directly" : "Use fallback method");
  
  return {
    shouldShowButton,
    joinUrl,
    buttonText: joinUrl ? "Tham gia ngay" : "Tư vấn Online",
    action: joinUrl ? "direct" : "fallback"
  };
}

// Function để simulate button click
function simulateButtonClick(appointment) {
  const result = testJoinUrlLogic(appointment);
  
  if (!result.shouldShowButton) {
    console.log("❌ Button should not be shown");
    return;
  }

  console.log("\n🖱️ Simulating button click...");
  
  if (result.joinUrl) {
    console.log("✅ Opening join_url directly:", result.joinUrl);
    console.log("✅ Action: window.open('" + result.joinUrl + "', '_blank')");
    console.log("✅ Message: 'Đã mở phòng tư vấn online!'");
  } else {
    console.log("🔄 No join_url found, using fallback method");
    console.log("🔄 Action: Call joinZoomMeeting() to create meeting");
  }
}

// Chạy test
console.log("🧪 Testing join_url Logic from appointmentDetails");
console.log("=================================================");

const results = [
  testJoinUrlLogic(appointmentWithJoinUrl),
  testJoinUrlLogic(appointmentWithoutJoinUrl), 
  testJoinUrlLogic(appointmentMultipleDetails)
];

console.log("\n📊 Test Results Summary:");
console.log("Appointment 1 (has join_url):", results[0]);
console.log("Appointment 2 (no join_url):", results[1]);
console.log("Appointment 3 (multiple details):", results[2]);

console.log("\n🖱️ Button Click Simulations:");
simulateButtonClick(appointmentWithJoinUrl);
simulateButtonClick(appointmentWithoutJoinUrl);
simulateButtonClick(appointmentMultipleDetails);

console.log("\n✅ Expected Behavior:");
console.log("1. Appointment with join_url → 'Tham gia ngay' → Open directly");
console.log("2. Appointment without join_url → 'Tư vấn Online' → Use fallback");
console.log("3. Multiple details → Find CONSULTING_ON join_url → Open directly");

// Export for manual testing
window.testJoinUrlLogic = testJoinUrlLogic;
window.simulateButtonClick = simulateButtonClick;

console.log("\n🎯 Available functions:");
console.log("- testJoinUrlLogic(appointment)");
console.log("- simulateButtonClick(appointment)");
