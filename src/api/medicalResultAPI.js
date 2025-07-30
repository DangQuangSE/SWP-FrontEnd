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
  return await api.post("/result/consultation", resultData);
};

/**
 * Get medical result by ID
 * @param {number} resultId - Result ID
 * @returns {Promise} API response
 */
export const getMedicalResult = async (resultId) => {
  return await api.get(`/result/${resultId}`);
};

/**
 * Update medical result
 * @param {number} resultId - Result ID
 * @param {Object} updateData - Update data
 * @returns {Promise} API response
 */
export const updateMedicalResult = async (resultId, updateData) => {
  return await api.put(`/result/${resultId}`, updateData);
};

/**
 * Delete medical result
 * @param {number} resultId - Result ID
 * @returns {Promise} API response
 */
export const deleteMedicalResult = async (resultId) => {
  return await api.delete(`/result/${resultId}`);
};

/**
 * Submit lab test result
 * @param {Object} labTestData - Lab test result data
 * @returns {Promise} API response
 */
export const submitLabTestResult = async (labTestData) => {
  return await api.post("/result/lab-test", labTestData);
};

/**
 * Submit consultation result
 * @param {Object} consultationData - Consultation result data
 * @returns {Promise} API response
 */
export const submitConsultationResult = async (consultationData) => {
  return await api.post("/result/consultation", consultationData);
};

/**
 * Get medical results by appointment detail ID
 * @param {number} appointmentDetailId - Appointment detail ID
 * @returns {Promise} API response
 */
export const getMedicalResultsByAppointmentDetail = async (
  appointmentDetailId
) => {
  return await api.get(`/result/appointment-detail/${appointmentDetailId}`);
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
    treatmentProtocolId: formData.treatmentProtocolId || null,
  };
};
