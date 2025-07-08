import axios from "axios";

/**
 * Customer Chat API Service
 * Handles chat operations for customer side without authentication
 */
class CustomerChatAPIService {
  constructor() {
    // Create axios instance without auth interceptors
    this.api = axios.create({
      baseURL: "http://localhost:8080/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor - NO AUTH for customer API
    this.api.interceptors.request.use(
      (config) => {
        console.log("🚀 [CUSTOMER CHAT API] Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          fullURL: `${config.baseURL}${config.url}`,
          data: config.data,
          params: config.params,
        });

        // Explicitly remove any auth headers that might be added
        delete config.headers.Authorization;

        return config;
      },
      (error) => {
        console.error("❌ [CUSTOMER CHAT API] Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log("✅ [CUSTOMER CHAT API] Response:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error("❌ [CUSTOMER CHAT API] Error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });

        // Don't redirect on 401 for customer API - it's expected to be public
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create new chat session
   */
  async createChatSession(customerName, topic = "General Support") {
    try {
      const payload = {
        customerName,
        topic,
      };

      console.log("📤 [CUSTOMER CHAT API] Creating session:", payload);
      const response = await this.api.post("/chat/start", payload);
      console.log("✅ [CUSTOMER CHAT API] Session created:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT API] Error creating session:", error);
      throw error;
    }
  }

  /**
   * Send chat message
   */
  async sendMessage(sessionId, message, senderName) {
    try {
      const payload = {
        sessionId,
        message,
        senderName,
      };

      console.log("📤 [CUSTOMER CHAT API] Sending message:", payload);
      const response = await this.api.post("/chat/send", payload);
      console.log("✅ [CUSTOMER CHAT API] Message sent:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT API] Error sending message:", error);
      throw error;
    }
  }

  /**
   * Get session messages (public endpoint for customers)
   */
  async getSessionMessages(sessionId) {
    try {
      console.log("📥 [CUSTOMER CHAT API] Fetching messages for:", sessionId);

      // Try public endpoint first
      const response = await this.api.get(`/chat/messages/${sessionId}`);
      console.log("✅ [CUSTOMER CHAT API] Messages fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT API] Error fetching messages:", error);

      // If public endpoint fails, try the original endpoint
      try {
        console.log("🔄 [CUSTOMER CHAT API] Trying alternative endpoint...");
        const response = await this.api.get(
          `/chat/sessions/${sessionId}/messages`
        );
        console.log(
          "✅ [CUSTOMER CHAT API] Messages fetched (alternative):",
          response.data
        );
        return response.data;
      } catch (altError) {
        console.error(
          "❌ [CUSTOMER CHAT API] Alternative endpoint also failed:",
          altError
        );
        throw altError;
      }
    }
  }

  /**
   * End chat session
   */
  async endChatSession(sessionId) {
    try {
      console.log("📤 [CUSTOMER CHAT API] Ending session:", sessionId);
      const response = await this.api.post(`/chat/sessions/${sessionId}/end`);
      console.log("✅ [CUSTOMER CHAT API] Session ended:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT API] Error ending session:", error);
      throw error;
    }
  }

  /**
   * Get session status
   */
  async getSessionStatus(sessionId) {
    try {
      console.log("📥 [CUSTOMER CHAT API] Getting session status:", sessionId);
      const response = await this.api.get(`/chat/sessions/${sessionId}/status`);
      console.log("✅ [CUSTOMER CHAT API] Session status:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ [CUSTOMER CHAT API] Error getting session status:",
        error
      );
      throw error;
    }
  }

  /**
   * Get unread count for customer in a session
   * @param {string} sessionId - Session ID
   * @param {string} customerName - Customer name
   * @returns {Promise<number>} Number of unread messages
   */
  async getUnreadCount(sessionId, customerName) {
    try {
      console.log("📊 [CUSTOMER CHAT API] Getting unread count:", {
        sessionId,
        customerName,
      });

      const response = await this.api.get(
        `/chat/sessions/${sessionId}/unread-count`,
        {
          params: { readerName: customerName },
        }
      );

      console.log("✅ [CUSTOMER CHAT API] Unread count:", response.data);
      return response.data || 0;
    } catch (error) {
      console.error(
        "❌ [CUSTOMER CHAT API] Error getting unread count:",
        error
      );
      // Return 0 if error to prevent UI issues
      return 0;
    }
  }
}

// Export singleton instance
export const customerChatAPI = new CustomerChatAPIService();
export default customerChatAPI;
