import axios from "axios";

/**
 * Chat API Service for Staff Dashboard
 * REST API endpoints for chat functionality
 */
class ChatAPIService {
  constructor() {
    this.baseURL = "http://localhost:8080/api";

    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor để thêm auth token và logging
    this.api.interceptors.request.use(
      (config) => {
        console.log("🚀 [STAFF CHAT API] Request:", {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          data: config.data,
          params: config.params,
        });

        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("🔐 [STAFF CHAT API] Auth token added");
        } else {
          console.log("⚠️ [STAFF CHAT API] No auth token found");
        }
        return config;
      },
      (error) => {
        console.error("❌ [STAFF CHAT API] Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor để handle errors và logging
    this.api.interceptors.response.use(
      (response) => {
        console.log("✅ [STAFF CHAT API] Response:", {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          data: response.data,
          dataLength: Array.isArray(response.data)
            ? response.data.length
            : "N/A",
        });
        return response;
      },
      (error) => {
        console.error("❌ [STAFF CHAT API] Response Error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });

        if (error.response?.status === 401) {
          console.log(
            "🔐 [STAFF CHAT API] Unauthorized - redirecting to login"
          );
          localStorage.removeItem("token");
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Lấy danh sách chat sessions cho staff
   * @param {string} status - Filter by status: WAITING, ACTIVE, ENDED (optional)
   */
  async getChatSessions(status = null) {
    try {
      const params = {};
      if (status) {
        params.status = status;
      }

      console.log("🔍 [STAFF CHAT API] getChatSessions params:", params);

      const response = await this.api.get("/chat/sessions", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một chat session
   */
  async getChatSession(sessionId) {
    try {
      const response = await this.api.get(`/chat/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat session:", error);
      throw error;
    }
  }

  /**
   * Lấy messages của một session
   */
  async getSessionMessages(sessionId, page = 0, size = 50) {
    try {
      const response = await this.api.get(
        `/chat/sessions/${sessionId}/messages`,
        {
          params: { page, size },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error;
    }
  }

  /**
   * Gửi message qua REST API (backup cho WebSocket)
   */
  async sendMessage(sessionId, message, senderName, senderType = "STAFF") {
    try {
      const payload = {
        sessionId,
        message,
        senderName,
        senderType,
      };

      const response = await this.api.post("/chat/messages", payload);
      return response.data;
    } catch (error) {
      console.error("Error sending message via REST:", error);
      throw error;
    }
  }

  /**
   * Send chat message via REST API - /api/chat/send endpoint
   */
  async sendChatMessage(sessionId, message, senderName) {
    try {
      const payload = {
        sessionId,
        message,
        senderName,
      };

      console.log("📤 [CHAT API] Sending message:", payload);
      const response = await this.api.post("/chat/send", payload);
      console.log("✅ [CHAT API] Message sent successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ [CHAT API] Error sending chat message:", error);
      throw error;
    }
  }

  /**
   * Tạo chat session mới (cho customer)
   */
  async createChatSession(customerName, topic = "General Support") {
    try {
      const payload = {
        customerName,
        topic,
      };

      const response = await this.api.post("/chat/sessions", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái session
   */
  async updateSessionStatus(sessionId, status) {
    try {
      const response = await this.api.patch(
        `/chat/sessions/${sessionId}/status`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating session status:", error);
      throw error;
    }
  }

  /**
   * Assign session cho staff
   */
  async assignSession(sessionId, staffId) {
    try {
      const response = await this.api.patch(
        `/chat/sessions/${sessionId}/assign`,
        {
          staffId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error assigning session:", error);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(sessionId, readerName) {
    try {
      const response = await this.api.patch(
        `/chat/sessions/${sessionId}/read`,
        {
          readerName,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  /**
   * Lấy thống kê chat cho staff dashboard
   */
  async getChatStats() {
    try {
      const response = await this.api.get("/chat/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching chat stats:", error);
      throw error;
    }
  }

  /**
   * Search messages
   */
  async searchMessages(query, sessionId = null) {
    try {
      const params = { query };
      if (sessionId) {
        params.sessionId = sessionId;
      }

      const response = await this.api.get("/chat/search", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching messages:", error);
      throw error;
    }
  }

  /**
   * Get chat history for a customer
   */
  async getCustomerChatHistory(customerId) {
    try {
      const response = await this.api.get(
        `/chat/customers/${customerId}/history`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching customer chat history:", error);
      throw error;
    }
  }

  /**
   * Join chat session (staff joins a waiting session)
   */
  async joinSession(sessionId) {
    try {
      const response = await this.api.post(`/chat/join/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error("Error joining session:", error);
      throw error;
    }
  }

  /**
   * Close chat session
   */
  async closeSession(sessionId, reason = "Completed") {
    try {
      const response = await this.api.patch(
        `/chat/sessions/${sessionId}/close`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error closing session:", error);
      throw error;
    }
  }
}

// Export singleton instance
const chatAPIService = new ChatAPIService();
export default chatAPIService;
