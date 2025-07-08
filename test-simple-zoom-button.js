// Test script đơn giản cho button "Tư vấn Online"

console.log("🧪 Testing Simple Zoom Button Logic");
console.log("===================================");

// Test case 1: Có join_url trong appointmentDetails
const appointmentWithJoinUrl = {
  id: 23,
  serviceType: "CONSULTING_ON",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 23,
      serviceType: "CONSULTING_ON",
      joinUrl: "https://zoom.us/j/123456789?pwd=abcdef", // ← Có join_url
      status: "CONFIRMED"
    }
  ]
};

// Test case 2: Không có join_url
const appointmentWithoutJoinUrl = {
  id: 24,
  serviceType: "CONSULTING_ON",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 24,
      serviceType: "CONSULTING_ON",
      joinUrl: null, // ← Không có join_url
      status: "CONFIRMED"
    }
  ]
};

// Test case 3: Không phải CONSULTING_ON
const appointmentNotConsulting = {
  id: 25,
  serviceType: "EXAMINATION",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 25,
      serviceType: "EXAMINATION",
      joinUrl: null,
      status: "CONFIRMED"
    }
  ]
};

// Function để test button logic
function testButtonLogic(appointment) {
  console.log(`\n=== Testing Appointment ${appointment.id} ===`);
  
  // Logic kiểm tra hiển thị button
  const isConsultingOnline =
    appointment.serviceType === "CONSULTING_ON" ||
    appointment.appointmentDetails?.some((detail) => {
      return detail.serviceType === "CONSULTING_ON";
    }) ||
    false;

  const isConfirmed = appointment.status === "CONFIRMED";
  const shouldShowButton = isConsultingOnline && isConfirmed;

  console.log("serviceType:", appointment.serviceType);
  console.log("status:", appointment.status);
  console.log("shouldShowButton:", shouldShowButton);

  if (shouldShowButton) {
    // Lấy join_url từ appointmentDetails
    const joinUrl = appointment.appointmentDetails?.find(
      (detail) => detail.serviceType === "CONSULTING_ON"
    )?.joinUrl;

    console.log("joinUrl found:", !!joinUrl);
    console.log("joinUrl value:", joinUrl);
    console.log("buttonText: 'Tư vấn Online'"); // Luôn hiển thị "Tư vấn Online"
    console.log("buttonTitle: 'Click để tham gia tư vấn online'");
    
    return {
      showButton: true,
      hasJoinUrl: !!joinUrl,
      joinUrl: joinUrl,
      action: joinUrl ? "openDirectly" : "createNewMeeting"
    };
  } else {
    console.log("Button will NOT be shown");
    return {
      showButton: false,
      hasJoinUrl: false,
      joinUrl: null,
      action: null
    };
  }
}

// Function để simulate button click
function simulateButtonClick(appointment) {
  const result = testButtonLogic(appointment);
  
  if (!result.showButton) {
    console.log("❌ Button not shown - no click simulation");
    return;
  }

  console.log("\n🖱️ Simulating button click...");
  console.log("Button text: 'Tư vấn Online'");
  
  if (result.hasJoinUrl) {
    console.log("✅ Has join_url - Opening directly");
    console.log("Action: window.open('" + result.joinUrl + "', '_blank')");
    console.log("Message: 'Đã mở phòng tư vấn online!'");
    console.log("Blinking: 3 seconds");
  } else {
    console.log("🔄 No join_url - Creating new meeting");
    console.log("Action: createAndOpenZoomMeeting(" + appointment.id + ")");
    console.log("Steps:");
    console.log("  1. Show loading: 'Đang tạo phòng tư vấn...'");
    console.log("  2. Call API: GET /api/zoom/test-create-meeting?appointmentId=" + appointment.id);
    console.log("  3. Open join_url from response");
    console.log("  4. Show success: 'Đã mở phòng tư vấn online!'");
    console.log("  5. Refresh appointments");
  }
}

// Chạy tests
console.log("\n📊 Running Tests:");

const results = [
  testButtonLogic(appointmentWithJoinUrl),
  testButtonLogic(appointmentWithoutJoinUrl),
  testButtonLogic(appointmentNotConsulting)
];

console.log("\n🎯 Test Results Summary:");
console.log("Appointment 1 (has join_url):", results[0]);
console.log("Appointment 2 (no join_url):", results[1]);
console.log("Appointment 3 (not consulting):", results[2]);

console.log("\n🖱️ Button Click Simulations:");
simulateButtonClick(appointmentWithJoinUrl);
simulateButtonClick(appointmentWithoutJoinUrl);
simulateButtonClick(appointmentNotConsulting);

console.log("\n✅ SIMPLIFIED LOGIC:");
console.log("1. Button always shows 'Tư vấn Online' (không thay đổi text)");
console.log("2. Có join_url → Mở trực tiếp");
console.log("3. Không có join_url → Tạo meeting mới");
console.log("4. Không phải CONSULTING_ON → Không hiển thị button");

console.log("\n🎯 Expected Behavior:");
console.log("- CONSULTING_ON + CONFIRMED + có join_url → Click mở trực tiếp");
console.log("- CONSULTING_ON + CONFIRMED + không có join_url → Click tạo meeting mới");
console.log("- Không phải CONSULTING_ON → Không có button");

// Export functions
window.testButtonLogic = testButtonLogic;
window.simulateButtonClick = simulateButtonClick;

console.log("\n🎯 Available functions:");
console.log("- testButtonLogic(appointment)");
console.log("- simulateButtonClick(appointment)");
