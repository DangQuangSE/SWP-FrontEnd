import api from "../configs/api";

/**
 * Get patient medical history
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientMedicalHistory = async (
  patientId,
  page = 0,
  size = 5
) => {
  return await api.get(`/medical-profile/patient/${patientId}/history`, {
    params: {
      page,
      size,
    },
  });
};

/**
 * Get patient basic info only
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response
 */
export const getPatientBasicInfo = async (patientId) => {
  return await api.get(`/medical-profile/patient/${patientId}/basic`);
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
export const searchPatients = async (
  searchParams = {},
  page = 0,
  size = 10
) => {
  return await api.get("/medical-profile/patients/search", {
    params: {
      ...searchParams,
      page,
      size,
    },
  });
};

/**
 * Get patient appointment history only
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientAppointments = async (
  patientId,
  page = 0,
  size = 10
) => {
  return await api.get(`/medical-profile/patient/${patientId}/appointments`, {
    params: {
      page,
      size,
    },
  });
};

/**
 * Get patient test results only
 * @param {number} patientId - Patient ID
 * @param {number} page - Page number (0-based)
 * @param {number} size - Page size
 * @returns {Promise} API response
 */
export const getPatientTestResults = async (patientId, page = 0, size = 10) => {
  return await api.get(`/medical-profile/patient/${patientId}/tests`, {
    params: {
      page,
      size,
    },
  });
};

/**
 * Export patient medical history to PDF
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response with PDF blob
 */
export const exportPatientHistoryToPDF = async (patientId) => {
  return await api.get(`/medical-profile/patient/${patientId}/export/pdf`, {
    responseType: "blob",
  });
};

/**
 * Get patient statistics
 * @param {number} patientId - Patient ID
 * @returns {Promise} API response
 */
export const getPatientStatistics = async (patientId) => {
  return await api.get(`/medical-profile/patient/${patientId}/statistics`);
};
