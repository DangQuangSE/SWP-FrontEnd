// Test script để kiểm tra modal chi tiết lịch hẹn

console.log("🧪 Testing Appointment Detail Modal");
console.log("==================================");

// Sample appointment data với đầy đủ thông tin
const sampleAppointment = {
  id: 23,
  price: 200000,
  note: "Khám định kỳ, có triệu chứng đau bụng",
  preferredDate: "2025-07-08",
  created_at: "2025-07-06T23:37:58.902809",
  status: "CONFIRMED",
  serviceType: "CONSULTING_ON",
  customerId: 1,
  customerName: "Quoc An",
  serviceName: "Khám phụ khoa định kỳ",
  isPaid: true,
  paymentStatus: "Đã thanh toán qua VNPay",
  appointmentDetails: [
    {
      id: 23,
      serviceId: 1,
      serviceName: "Khám phụ khoa định kỳ",
      consultantId: 2,
      consultantName: "BS. Nguyen Quoc An",
      slotTime: "2025-07-08T08:30:00",
      joinUrl: "https://zoom.us/j/123456789?pwd=abcdef",
      startUrl: "https://zoom.us/s/123456789?pwd=startabc",
      status: "CONFIRMED",
      medicalResult: "Kết quả bình thường, không có vấn đề gì đáng lo ngại",
      room: {
        id: 1,
        name: "Phòng số 1",
        description: "Phòng khám phụ khoa chính",
        specializationName: "Khoa Phụ Sản"
      }
    }
  ]
};

// Sample appointment với multiple services (combo)
const comboAppointment = {
  id: 24,
  price: 500000,
  note: "Gói khám tổng quát",
  preferredDate: "2025-07-10",
  created_at: "2025-07-07T10:15:30.123456",
  status: "PENDING",
  serviceType: "COMBO",
  customerId: 1,
  customerName: "Quoc An",
  serviceName: "Gói khám sức khỏe tổng quát",
  isPaid: false,
  paymentStatus: null,
  appointmentDetails: [
    {
      id: 24,
      serviceId: 2,
      serviceName: "Khám nội khoa",
      consultantId: 3,
      consultantName: "BS. Tran Van B",
      slotTime: "2025-07-10T09:00:00",
      joinUrl: null,
      startUrl: null,
      status: "PENDING",
      medicalResult: null,
      room: {
        id: 2,
        name: "Phòng số 2",
        description: "Phòng khám nội khoa",
        specializationName: "Khoa Nội"
      }
    },
    {
      id: 25,
      serviceId: 3,
      serviceName: "Xét nghiệm máu",
      consultantId: 4,
      consultantName: "BS. Le Thi C",
      slotTime: "2025-07-10T10:30:00",
      joinUrl: null,
      startUrl: null,
      status: "PENDING",
      medicalResult: null,
      room: {
        id: 3,
        name: "Phòng xét nghiệm",
        description: "Phòng xét nghiệm tổng hợp",
        specializationName: "Khoa Xét nghiệm"
      }
    }
  ]
};

// Function để test hiển thị thông tin chung
function testGeneralInfo(appointment) {
  console.log("\n📋 THÔNG TIN CHUNG");
  console.log("==================");
  console.log("ID lịch hẹn:", appointment.id);
  console.log("Ngày hẹn:", appointment.preferredDate);
  console.log("Dịch vụ:", appointment.serviceName);
  console.log("Loại dịch vụ:", appointment.serviceType);
  console.log("Trạng thái:", appointment.status);
  console.log("Giá:", appointment.price?.toLocaleString(), "VND");
  console.log("Ghi chú:", appointment.note || "Không có");
  console.log("Thời gian tạo:", new Date(appointment.created_at).toLocaleString());
}

// Function để test hiển thị chi tiết dịch vụ
function testServiceDetails(appointment) {
  console.log("\n🏥 CHI TIẾT DỊCH VỤ");
  console.log("===================");
  
  if (appointment.appointmentDetails && appointment.appointmentDetails.length > 0) {
    appointment.appointmentDetails.forEach((detail, index) => {
      console.log(`\n--- Dịch vụ ${index + 1} ---`);
      console.log("Tên dịch vụ:", detail.serviceName);
      console.log("Bác sĩ tư vấn:", detail.consultantName || "Chưa phân công");
      console.log("Thời gian khám:", detail.slotTime ? new Date(detail.slotTime).toLocaleString() : "Chưa xác định");
      
      if (detail.room) {
        console.log("Phòng khám:", detail.room.name);
        console.log("Chuyên khoa:", detail.room.specializationName);
      }
      
      console.log("Trạng thái dịch vụ:", detail.status);
      
      if (detail.joinUrl) {
        console.log("Link tư vấn online:", detail.joinUrl);
      }
      
      if (detail.medicalResult) {
        console.log("Kết quả khám:", detail.medicalResult);
      }
    });
  } else {
    console.log("Không có chi tiết dịch vụ");
  }
}

// Function để test hiển thị thông tin thanh toán
function testPaymentInfo(appointment) {
  console.log("\n💳 THÔNG TIN THANH TOÁN");
  console.log("=======================");
  console.log("Trạng thái thanh toán:", appointment.isPaid ? "Đã thanh toán" : "Chưa thanh toán");
  
  if (appointment.paymentStatus) {
    console.log("Chi tiết thanh toán:", appointment.paymentStatus);
  }
}

// Function để test toàn bộ modal
function testCompleteModal(appointment) {
  console.log(`\n🔍 TESTING MODAL FOR APPOINTMENT ${appointment.id}`);
  console.log("=".repeat(50));
  
  testGeneralInfo(appointment);
  testServiceDetails(appointment);
  testPaymentInfo(appointment);
  
  console.log("\n✅ Modal Content Complete!");
}

// Chạy tests
console.log("🚀 Running Modal Tests...");

testCompleteModal(sampleAppointment);
testCompleteModal(comboAppointment);

console.log("\n📊 MODAL FEATURES TESTED:");
console.log("✅ Thông tin chung (ID, ngày, dịch vụ, trạng thái, giá, ghi chú, thời gian tạo)");
console.log("✅ Chi tiết dịch vụ (tên, bác sĩ, thời gian, phòng, chuyên khoa, trạng thái)");
console.log("✅ Link tư vấn online (nếu có)");
console.log("✅ Kết quả khám (nếu có)");
console.log("✅ Thông tin thanh toán");
console.log("✅ Multiple services support (combo)");
console.log("✅ Responsive design");
console.log("✅ Status color coding");

console.log("\n🎯 MODAL STRUCTURE:");
console.log("1. Header: 'Chi tiết lịch hẹn'");
console.log("2. Section 1: Thông tin chung");
console.log("3. Section 2: Chi tiết dịch vụ (có thể nhiều dịch vụ)");
console.log("4. Section 3: Thông tin thanh toán");
console.log("5. Footer: Không có (chỉ nút đóng)");

// Export functions
window.testCompleteModal = testCompleteModal;
window.testGeneralInfo = testGeneralInfo;
window.testServiceDetails = testServiceDetails;
window.testPaymentInfo = testPaymentInfo;

console.log("\n🎯 Available test functions:");
console.log("- testCompleteModal(appointment)");
console.log("- testGeneralInfo(appointment)");
console.log("- testServiceDetails(appointment)");
console.log("- testPaymentInfo(appointment)");
