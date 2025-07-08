// Test script cho button "Tư vấn Online" đơn giản với link trực tiếp

console.log("🧪 Testing Simple Link Button Logic");
console.log("===================================");

// Test case 1: Có join_url - sẽ render thành <a> tag
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

// Test case 2: Không có join_url - sẽ render thành <button> tag
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

// Function để test render logic
function testRenderLogic(appointment) {
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
    
    if (joinUrl) {
      console.log("🔗 RENDER: <a> tag");
      console.log("Element type: Link");
      console.log("href:", joinUrl);
      console.log("target: '_blank'");
      console.log("rel: 'noopener noreferrer'");
      console.log("className: 'zoom-button-profile'");
      console.log("title: 'Click để tham gia tư vấn online'");
      console.log("text: 'Tư vấn Online'");
      
      return {
        elementType: "link",
        href: joinUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        action: "directAccess"
      };
    } else {
      console.log("🔘 RENDER: <button> tag");
      console.log("Element type: Button");
      console.log("onClick: createAndOpenZoomMeeting()");
      console.log("className: 'zoom-button-profile'");
      console.log("title: 'Click để tạo phòng tư vấn'");
      console.log("text: 'Tư vấn Online'");
      
      return {
        elementType: "button",
        onClick: "createAndOpenZoomMeeting",
        action: "createNewMeeting"
      };
    }
  } else {
    console.log("❌ NO RENDER: Button not shown");
    return {
      elementType: null,
      action: null
    };
  }
}

// Function để simulate user interaction
function simulateUserInteraction(appointment) {
  const result = testRenderLogic(appointment);
  
  if (!result.elementType) {
    console.log("❌ No interaction - button not shown");
    return;
  }

  console.log("\n👆 Simulating user interaction...");
  
  if (result.elementType === "link") {
    console.log("✅ User clicks LINK:");
    console.log("1. Browser navigates to:", result.href);
    console.log("2. Opens in new tab (target='_blank')");
    console.log("3. No JavaScript execution needed");
    console.log("4. Direct access to Zoom meeting");
  } else if (result.elementType === "button") {
    console.log("🔄 User clicks BUTTON:");
    console.log("1. onClick event fires");
    console.log("2. Calls createAndOpenZoomMeeting(" + appointment.id + ")");
    console.log("3. Shows loading: 'Đang tạo phòng tư vấn...'");
    console.log("4. API call: GET /api/zoom/test-create-meeting?appointmentId=" + appointment.id);
    console.log("5. Opens join_url from response");
    console.log("6. Refreshes appointments data");
  }
}

// Function để test HTML output
function testHTMLOutput(appointment) {
  const result = testRenderLogic(appointment);
  
  console.log("\n📝 Expected HTML Output:");
  
  if (result.elementType === "link") {
    const joinUrl = appointment.appointmentDetails?.find(
      (detail) => detail.serviceType === "CONSULTING_ON"
    )?.joinUrl;
    
    console.log(`<a
  href="${joinUrl}"
  target="_blank"
  rel="noopener noreferrer"
  className="zoom-button-profile"
  title="Click để tham gia tư vấn online"
>
  Tư vấn Online
</a>`);
  } else if (result.elementType === "button") {
    console.log(`<button
  className="zoom-button-profile"
  onClick={() => createAndOpenZoomMeeting(${appointment.id})}
  title="Click để tạo phòng tư vấn"
>
  Tư vấn Online
</button>`);
  } else {
    console.log("<!-- No button rendered -->");
  }
}

// Chạy tests
console.log("\n📊 Running Tests:");

const results = [
  testRenderLogic(appointmentWithJoinUrl),
  testRenderLogic(appointmentWithoutJoinUrl)
];

console.log("\n🎯 Test Results Summary:");
console.log("Appointment 1 (has join_url):", results[0]);
console.log("Appointment 2 (no join_url):", results[1]);

console.log("\n👆 User Interaction Simulations:");
simulateUserInteraction(appointmentWithJoinUrl);
simulateUserInteraction(appointmentWithoutJoinUrl);

console.log("\n📝 HTML Output Tests:");
testHTMLOutput(appointmentWithJoinUrl);
testHTMLOutput(appointmentWithoutJoinUrl);

console.log("\n✅ SIMPLIFIED LOGIC SUMMARY:");
console.log("1. Có join_url → Render <a> tag với href trực tiếp");
console.log("2. Không có join_url → Render <button> tag với onClick");
console.log("3. Cùng styling CSS class: 'zoom-button-profile'");
console.log("4. Cùng text: 'Tư vấn Online'");
console.log("5. Link tự động mở tab mới, button gọi API tạo meeting");

console.log("\n🎯 BENEFITS:");
console.log("✅ Đơn giản hơn - không cần onClick logic phức tạp");
console.log("✅ Hiệu quả hơn - link trực tiếp không cần JavaScript");
console.log("✅ Tự nhiên hơn - browser handle link navigation");
console.log("✅ Fallback tốt - button cho trường hợp chưa có link");

// Export functions
window.testRenderLogic = testRenderLogic;
window.simulateUserInteraction = simulateUserInteraction;
window.testHTMLOutput = testHTMLOutput;

console.log("\n🎯 Available functions:");
console.log("- testRenderLogic(appointment)");
console.log("- simulateUserInteraction(appointment)");
console.log("- testHTMLOutput(appointment)");
