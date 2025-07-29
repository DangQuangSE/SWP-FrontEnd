import api from "../../../../configs/api";

/**
 * Get doctor working schedule by date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response with doctor schedules
 */
export const getDoctorWorkingSchedule = async (date) => {
  try {
    const response = await api.get(`/schedules/doctors-working`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor working schedule:", error);
    throw error;
  }
};

export default getDoctorWorkingSchedule;
