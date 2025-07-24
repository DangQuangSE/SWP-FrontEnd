import api from "../configs/api";

/**
 * Medical Result API Service
 * Handles all medical result related API calls
 */

/**
 * Submit medical result for an appointment detail
 * @param {Object} resultData - Medical result data
 * @returns {Promise} API response
 */
export const submitMedicalResult = async (resultData) => {
  try {
    console.log("🔄 [API] Submitting medical result:", resultData);

    const response = await api.post("/result", resultData);

    console.log(" [API] Medical result submitted successfully:", response.data);
    return response;
  } catch (error) {
    console.error(" [API] Error submitting medical result:", error);
    console.error(" [API] Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Get medical result by ID
 * @param {number} resultId - Result ID
 * @returns {Promise} API response
 */
export const getMedicalResult = async (resultId) => {
  try {
    console.log(`🔄 [API] Fetching medical result ID: ${resultId}`);

    const response = await api.get(`/result/${resultId}`);

    console.log(" [API] Medical result fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error(" [API] Error fetching medical result:", error);
    throw error;
  }
};

/**
 * Update medical result
 * @param {number} resultId - Result ID
 * @param {Object} updateData - Update data
 * @returns {Promise} API response
 */
export const updateMedicalResult = async (resultId, updateData) => {
  try {
    console.log(`🔄 [API] Updating medical result ID: ${resultId}`, updateData);

    const response = await api.put(`/result/${resultId}`, updateData);

    console.log(" [API] Medical result updated successfully:", response.data);
    return response;
  } catch (error) {
    console.error(" [API] Error updating medical result:", error);
    throw error;
  }
};

/**
 * Delete medical result
 * @param {number} resultId - Result ID
 * @returns {Promise} API response
 */
export const deleteMedicalResult = async (resultId) => {
  try {
    console.log(`🔄 [API] Deleting medical result ID: ${resultId}`);

    const response = await api.delete(`/result/${resultId}`);

    console.log(" [API] Medical result deleted successfully");
    return response;
  } catch (error) {
    console.error(" [API] Error deleting medical result:", error);
    throw error;
  }
};

/**
 * Get medical results by appointment detail ID
 * @param {number} appointmentDetailId - Appointment detail ID
 * @returns {Promise} API response
 */
export const getMedicalResultsByAppointmentDetail = async (
  appointmentDetailId
) => {
  try {
    console.log(
      `🔄 [API] Fetching medical results for appointment detail: ${appointmentDetailId}`
    );

    const response = await api.get(
      `/result/appointment-detail/${appointmentDetailId}`
    );

    console.log(" [API] Medical results fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error(" [API] Error fetching medical results:", error);
    throw error;
  }
};

/**
 * Validate medical result data before submission
 * @param {Object} resultData - Result data to validate
 * @returns {Object} Validation result
 */
export const validateMedicalResultData = (resultData) => {
  const errors = {};

  // Required fields validation
  if (!resultData.appointmentDetailId) {
    errors.appointmentDetailId = "Appointment Detail ID là bắt buộc";
  }

  if (!resultData.resultType) {
    errors.resultType = "Loại kết quả là bắt buộc";
  }

  if (!resultData.testName) {
    errors.testName = "Tên xét nghiệm là bắt buộc";
  }

  if (!resultData.testResult) {
    errors.testResult = "Kết quả xét nghiệm là bắt buộc";
  }

  if (!resultData.testStatus) {
    errors.testStatus = "Trạng thái xét nghiệm là bắt buộc";
  }

  // Optional but recommended fields
  const warnings = {};

  if (!resultData.diagnosis) {
    warnings.diagnosis = "Nên có chẩn đoán";
  }

  if (!resultData.treatmentPlan) {
    warnings.treatmentPlan = "Nên có kế hoạch điều trị";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings,
  };
};

/**
 * Format medical result data for API submission
 * @param {Object} formData - Form data from UI
 * @returns {Object} Formatted data for API
 */
export const formatMedicalResultForAPI = (formData) => {
  return {
    appointmentDetailId: parseInt(formData.appointmentDetailId),
    resultType: formData.resultType || "LAB_TEST",
    description: formData.description || "",
    diagnosis: formData.diagnosis || "",
    treatmentPlan: formData.treatmentPlan || "",
    testName: formData.testName || "",
    testResult: formData.testResult || "",
    normalRange: formData.normalRange || "",
    testMethod: formData.testMethod || "",
    specimenType: formData.specimenType || "",
    testStatus: formData.testStatus || "PENDING",
    sampleCollectedAt: formData.sampleCollectedAt || new Date().toISOString(),
    labNotes: formData.labNotes || "",
  };
};
