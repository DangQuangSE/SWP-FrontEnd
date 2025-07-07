// Test script để kiểm tra API update profile với gender
// Chạy trong browser console để test

const testUpdateProfile = async () => {
  const updateData = {
    fullname: "Test User",
    phone: "0123456789",
    address: "123 Test Street",
    gender: "MALE", // Thêm trường gender
    dateOfBirth: "1990-01-01"
  };

  console.log("Testing profile update with gender:", updateData);

  try {
    // Giả lập API call
    const response = await fetch('/api/me/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });

    const result = await response.json();
    console.log("API Response:", result);
    
    if (response.ok) {
      console.log("✅ Profile updated successfully with gender!");
    } else {
      console.error("❌ Failed to update profile:", result);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Uncomment để chạy test
// testUpdateProfile();

console.log("Test script loaded. Run testUpdateProfile() to test the API.");
