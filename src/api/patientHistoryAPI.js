import api from "../configs/api";

/**
 * Get patient medical history
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientMedicalHistory = async (patientId, page = 0, size = 5) => {
  try {
    console.log(`📋 [API] Getting patient medical history for ID: ${patientId}, page: ${page}, size: ${size}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/history`, {
      params: {
        page,
        size
      }
    });
    
    console.log("✅ [API] Patient medical history loaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error getting patient medical history:", error);
    console.error("❌ [API] Error details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

/**
 * Get patient basic info only
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response
 */
export const getPatientBasicInfo = async (patientId) => {
  try {
    console.log(`👤 [API] Getting patient basic info for ID: ${patientId}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/basic`);
    
    console.log("✅ [API] Patient basic info loaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error getting patient basic info:", error);
    throw error;
  }
};

/**
 * Search patients by criteria
 * @param {Object} searchParams - Search parameters
 * @param {string} searchParams.name - Patient name
 * @param {string} searchParams.email - Patient email
 * @param {string} searchParams.phone - Patient phone
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const searchPatients = async (searchParams = {}, page = 0, size = 10) => {
  try {
    console.log(`🔍 [API] Searching patients with params:`, searchParams);
    
    const response = await api.get("/medical-profile/patients/search", {
      params: {
        ...searchParams,
        page,
        size
      }
    });
    
    console.log("✅ [API] Patient search completed successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error searching patients:", error);
    throw error;
  }
};

/**
 * Get patient appointment history only
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientAppointments = async (patientId, page = 0, size = 10) => {
  try {
    console.log(`📅 [API] Getting patient appointments for ID: ${patientId}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/appointments`, {
      params: {
        page,
        size
      }
    });
    
    console.log("✅ [API] Patient appointments loaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error getting patient appointments:", error);
    throw error;
  }
};

/**
 * Get patient test results only
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientTestResults = async (patientId, page = 0, size = 10) => {
  try {
    console.log(`🧪 [API] Getting patient test results for ID: ${patientId}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/tests`, {
      params: {
        page,
        size
      }
    });
    
    console.log("✅ [API] Patient test results loaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error getting patient test results:", error);
    throw error;
  }
};

/**
 * Export patient medical history to PDF
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response with PDF blob
 */
export const exportPatientHistoryToPDF = async (patientId) => {
  try {
    console.log(`📄 [API] Exporting patient history to PDF for ID: ${patientId}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/export/pdf`, {
      responseType: 'blob'
    });
    
    console.log("✅ [API] Patient history PDF exported successfully");
    return response;
  } catch (error) {
    console.error("❌ [API] Error exporting patient history to PDF:", error);
    throw error;
  }
};

/**
 * Get patient statistics
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response
 */
export const getPatientStatistics = async (patientId) => {
  try {
    console.log(`📊 [API] Getting patient statistics for ID: ${patientId}`);
    
    const response = await api.get(`/medical-profile/patient/${patientId}/statistics`);
    
    console.log("✅ [API] Patient statistics loaded successfully:", response.data);
    return response;
  } catch (error) {
    console.error("❌ [API] Error getting patient statistics:", error);
    throw error;
  }
};
