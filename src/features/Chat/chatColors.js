/**
 * Unified Chat Color Scheme
 * Consistent colors for both customer and staff chat interfaces
 */

export const CHAT_COLORS = {
  // Staff messages - Professional blue theme
  STAFF: {
    background: "#1890ff",
    text: "#ffffff",
    avatar: "#1890ff",
    border: "#1890ff",
  },

  // Customer messages - Friendly green theme
  CUSTOMER: {
    background: "#52c41a",
    text: "#ffffff",
    avatar: "#52c41a",
    border: "#52c41a",
  },
};

/**
 * Get colors for a message based on sender type
 * @param {string} senderType - STAFF or CUSTOMER
 * @returns {object} Color configuration
 */
export const getMessageColors = (senderType) => {
  switch (senderType) {
    case "STAFF":
      return CHAT_COLORS.STAFF;
    case "CUSTOMER":
      return CHAT_COLORS.CUSTOMER;
    default:
      return CHAT_COLORS.CUSTOMER; // Default to customer colors
  }
};

/**
 * Get avatar colors for consistent display
 * @param {string} senderType - STAFF or CUSTOMER
 * @returns {string} Avatar background color
 */
export const getAvatarColor = (senderType) => {
  const colors = getMessageColors(senderType);
  return colors.avatar;
};

/**
 * Get message bubble colors
 * @param {string} senderType - STAFF or CUSTOMER
 * @returns {object} Bubble style configuration
 */
export const getMessageBubbleStyle = (senderType) => {
  const colors = getMessageColors(senderType);

  return {
    backgroundColor: colors.background,
    color: colors.text,
    border: "none",
    borderRadius: "12px",
    padding: "8px 12px",
    maxWidth: "80%",
    wordWrap: "break-word",
  };
};

export default CHAT_COLORS;
