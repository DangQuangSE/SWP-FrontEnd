// Test script để kiểm tra logic hiển thị nút "Tư vấn Online"

// Test case 1: serviceType ở level cao
const appointment1 = {
  id: 23,
  serviceType: "CONSULTING_ON", // Level cao
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 23,
      serviceId: 1,
      serviceName: "Tư vấn online",
      consultantId: 2,
      consultantName: "Nguyen Quoc An",
      slotTime: "2025-07-08T08:30:00",
      status: "CONFIRMED"
    }
  ]
};

// Test case 2: serviceType trong appointmentDetails
const appointment2 = {
  id: 24,
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 24,
      serviceId: 2,
      serviceName: "Tư vấn online phụ khoa",
      serviceType: "CONSULTING_ON", // Trong appointmentDetails
      consultantId: 3,
      consultantName: "Dr. Smith",
      slotTime: "2025-07-08T10:00:00",
      status: "CONFIRMED"
    }
  ]
};

// Test case 3: Không phải CONSULTING_ON
const appointment3 = {
  id: 25,
  serviceType: "EXAMINATION",
  status: "CONFIRMED",
  appointmentDetails: [
    {
      id: 25,
      serviceId: 3,
      serviceName: "Khám tổng quát",
      serviceType: "EXAMINATION",
      consultantId: 4,
      consultantName: "Dr. Johnson",
      slotTime: "2025-07-08T14:00:00",
      status: "CONFIRMED"
    }
  ]
};

// Test case 4: CONSULTING_ON nhưng status không phải CONFIRMED
const appointment4 = {
  id: 26,
  serviceType: "CONSULTING_ON",
  status: "PENDING", // Không phải CONFIRMED
  appointmentDetails: [
    {
      id: 26,
      serviceId: 4,
      serviceName: "Tư vấn online tim mạch",
      serviceType: "CONSULTING_ON",
      consultantId: 5,
      consultantName: "Dr. Brown",
      slotTime: "2025-07-08T16:00:00",
      status: "PENDING"
    }
  ]
};

// Function để test logic
function testConsultingOnLogic(appointment) {
  console.log(`\n=== Testing Appointment ${appointment.id} ===`);
  console.log("Appointment:", appointment);
  
  // Logic giống như trong component
  const isConsultingOnline = 
    appointment.serviceType === "CONSULTING_ON" || // Level cao
    appointment.appointmentDetails?.some((detail) => {
      return detail.serviceType === "CONSULTING_ON";
    }) || false;

  const isConfirmed = appointment.status === "CONFIRMED";
  const shouldShowButton = isConsultingOnline && isConfirmed;

  console.log("isConsultingOnline:", isConsultingOnline);
  console.log("isConfirmed:", isConfirmed);
  console.log("shouldShowButton:", shouldShowButton);
  
  return shouldShowButton;
}

// Chạy test
console.log("🧪 Testing CONSULTING_ON Logic");
console.log("================================");

const results = [
  testConsultingOnLogic(appointment1), // Should be true
  testConsultingOnLogic(appointment2), // Should be true  
  testConsultingOnLogic(appointment3), // Should be false
  testConsultingOnLogic(appointment4), // Should be false
];

console.log("\n📊 Test Results:");
console.log("Appointment 1 (serviceType level cao + CONFIRMED):", results[0] ? "✅ PASS" : "❌ FAIL");
console.log("Appointment 2 (serviceType trong details + CONFIRMED):", results[1] ? "✅ PASS" : "❌ FAIL");
console.log("Appointment 3 (EXAMINATION service):", results[2] ? "❌ FAIL" : "✅ PASS");
console.log("Appointment 4 (CONSULTING_ON + PENDING):", results[3] ? "❌ FAIL" : "✅ PASS");

console.log("\n🎯 Expected: [true, true, false, false]");
console.log("🎯 Actual:  ", results);
console.log("🎯 All tests passed:", JSON.stringify(results) === JSON.stringify([true, true, false, false]) ? "✅ YES" : "❌ NO");
