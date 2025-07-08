// Test script để kiểm tra API Zoom call
// Chạy trong browser console để test

const testZoomAPI = async (appointmentId) => {
  console.log("🧪 Testing Zoom API call");
  console.log("========================");
  console.log("appointmentId:", appointmentId);

  if (!appointmentId) {
    console.error("❌ appointmentId is required");
    return;
  }

  try {
    // Test API call giống như trong component
    console.log("🔍 Calling API: GET /api/zoom/test-create-meeting?appointmentId=" + appointmentId);
    
    const response = await fetch(`/api/zoom/test-create-meeting?appointmentId=${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response headers:", response.headers);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("📹 Response data:", data);

    // Kiểm tra structure của response
    if (data.join_url) {
      console.log("✅ join_url found:", data.join_url);
      console.log("✅ API call successful!");
      
      // Test thêm các field khác
      if (data.start_url) {
        console.log("✅ start_url found:", data.start_url);
      }
      if (data.meeting_id) {
        console.log("✅ meeting_id found:", data.meeting_id);
      }
      
      return data;
    } else {
      console.warn("⚠️ No join_url in response");
      console.warn("⚠️ Available fields:", Object.keys(data));
      return null;
    }

  } catch (error) {
    console.error("❌ Error calling Zoom API:", error);
    console.error("❌ Error details:", error.message);
    return null;
  }
};

// Test với appointmentId mẫu
const testWithSampleId = () => {
  const sampleAppointmentId = 23; // Thay bằng ID thực tế
  console.log("🎯 Testing with sample appointmentId:", sampleAppointmentId);
  return testZoomAPI(sampleAppointmentId);
};

// Test flow hoàn chỉnh
const testCompleteFlow = async (appointmentId) => {
  console.log("\n🔄 Testing complete flow:");
  console.log("1. Create Zoom meeting");
  console.log("2. Get appointment data");
  console.log("3. Check join_url in appointmentDetails");
  
  // Step 1: Create Zoom meeting
  const zoomResult = await testZoomAPI(appointmentId);
  
  if (zoomResult) {
    console.log("\n⏳ Waiting 2 seconds before fetching appointment data...");
    
    // Step 2: Wait and fetch appointment data
    setTimeout(async () => {
      try {
        console.log("🔍 Fetching appointment data...");
        const appointmentResponse = await fetch(`/api/appointment/by-status?status=CONFIRMED`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const appointments = await appointmentResponse.json();
        console.log("📋 Appointments data:", appointments);
        
        // Step 3: Find our appointment and check join_url
        const targetAppointment = appointments.find(apt => apt.id == appointmentId);
        if (targetAppointment) {
          console.log("🎯 Found target appointment:", targetAppointment);
          
          const joinUrl = targetAppointment.appointmentDetails?.[0]?.joinUrl;
          if (joinUrl) {
            console.log("✅ join_url found in appointmentDetails:", joinUrl);
            console.log("🎉 Complete flow successful!");
          } else {
            console.warn("⚠️ No join_url in appointmentDetails");
            console.log("📋 appointmentDetails:", targetAppointment.appointmentDetails);
          }
        } else {
          console.warn("⚠️ Target appointment not found in response");
        }
        
      } catch (error) {
        console.error("❌ Error fetching appointment data:", error);
      }
    }, 2000);
  }
};

// Export functions for manual testing
window.testZoomAPI = testZoomAPI;
window.testWithSampleId = testWithSampleId;
window.testCompleteFlow = testCompleteFlow;

console.log("🧪 Zoom API Test Script Loaded");
console.log("Available functions:");
console.log("- testZoomAPI(appointmentId)");
console.log("- testWithSampleId()");
console.log("- testCompleteFlow(appointmentId)");
console.log("\nExample usage:");
console.log("testZoomAPI(23)");
console.log("testCompleteFlow(23)");
