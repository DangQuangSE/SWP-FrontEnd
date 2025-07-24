import chatAPIService from "../Dashboard/StaffDashboard/ChatDashboard/chatAPI";
import { customerChatAPI } from "./customerChatAPI";

/**
 * Unified Chat API Service
 * Provides consistent interface for both customer and staff message sending
 */
class UnifiedChatAPIService {
  /**
   * Send message with unified interface
   * @param {string} sessionId - Chat session ID
   * @param {string} message - Message content
   * @param {string} senderName - Sender name
   * @param {boolean} isStaff - Whether sender is staff
   * @param {string} clientId - Optional client-generated ID for deduplication
   * @returns {Promise} API response
   */
  async sendMessage(sessionId, message, senderName, isStaff = false, clientId = null) {
    try {
      console.log(`📤 [UNIFIED CHAT] Sending message:`, {
        sessionId,
        message: message.substring(0, 50),
        senderName,
        isStaff,
        clientId
      });

      let response;
      
      if (isStaff) {
        // Use staff API
        response = await chatAPIService.sendChatMessage(
          sessionId,
          message,
          senderName,
          clientId
        );
      } else {
        // Use customer API
        response = await customerChatAPI.sendMessage(
          sessionId,
          message,
          senderName,
          clientId
        );
      }

      console.log(`✅ [UNIFIED CHAT] Message sent successfully:`, response);
      return response;
      
    } catch (error) {
      console.error(`❌ [UNIFIED CHAT] Failed to send message:`, error);
      throw error;
    }
  }

  /**
   * Get session messages with unified interface
   * @param {string} sessionId - Chat session ID
   * @param {boolean} isStaff - Whether requester is staff
   * @returns {Promise} Messages array
   */
  async getSessionMessages(sessionId, isStaff = false) {
    try {
      console.log(`📥 [UNIFIED CHAT] Fetching messages:`, {
        sessionId,
        isStaff
      });

      let messages;
      
      if (isStaff) {
        // Use staff API
        messages = await chatAPIService.getSessionMessages(sessionId);
      } else {
        // Use customer API
        messages = await customerChatAPI.getSessionMessages(sessionId);
      }

      console.log(`✅ [UNIFIED CHAT] Messages fetched:`, {
        count: messages?.length || 0,
        isStaff
      });
      
      return messages || [];
      
    } catch (error) {
      console.error(`❌ [UNIFIED CHAT] Failed to fetch messages:`, error);
      
      // For customer side, return empty array on error to allow chat to continue
      if (!isStaff) {
        console.warn(`⚠️ [UNIFIED CHAT] Returning empty messages for customer`);
        return [];
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const unifiedChatAPI = new UnifiedChatAPIService();
export default unifiedChatAPI;
