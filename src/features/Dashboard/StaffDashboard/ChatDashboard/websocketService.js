import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { chatNotificationService } from "./ChatNotification";
import { WEBSOCKET_URL } from "../../../../configs/serverConfig";

/**
 * WebSocket Service for Chat Dashboard
 * Tương thích với Backend WebSocket Configuration
 */
class ChatWebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.connecting = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Kết nối WebSocket theo config Backend
   * Endpoint: /ws/chat
   * Brokers: /topic, /queue
   * App prefix: /app
   */
  connect() {
    return new Promise((resolve, reject) => {
      if (this.connected || this.connecting) {
        resolve();
        return;
      }

      this.connecting = true;

      try {
        console.log(
          `🔌 [WEBSOCKET] Creating SockJS connection to: ${WEBSOCKET_URL}`
        );

        // Tạo SockJS connection đến endpoint /ws/chat
        const socket = new SockJS(WEBSOCKET_URL);

        // Log SockJS events
        socket.onopen = () => {
          console.log("🔌 [SOCKJS] Connection opened");
        };

        socket.onclose = (event) => {
          console.log("🔌 [SOCKJS] Connection closed:", event);
        };

        socket.onerror = (error) => {
          console.error("❌ [SOCKJS] Error:", error);
        };

        this.stompClient = Stomp.over(socket);

        // Enable debug logs để xem chi tiết
        this.stompClient.debug = (str) => {
          console.log("🔍 [STOMP DEBUG]:", str);
        };

        console.log("🔌 [WEBSOCKET] Attempting STOMP connection...");

        // Connect với headers
        this.stompClient.connect(
          {
            // Có thể thêm auth headers nếu cần
          },
          (frame) => {
            console.log("✅ [WEBSOCKET] Connected successfully!");
            console.log("✅ [WEBSOCKET] Frame:", frame);
            console.log("✅ [WEBSOCKET] Session ID:", frame.headers["session"]);
            this.connected = true;
            this.connecting = false;
            this.reconnectAttempts = 0;
            resolve();
          },
          (error) => {
            console.error("❌ [WEBSOCKET] Connection error:", error);
            this.connected = false;
            this.connecting = false;
            this.handleReconnect();
            reject(error);
          }
        );
      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        this.connecting = false;
        reject(error);
      }
    });
  }

  /**
   * Ngắt kết nối WebSocket
   */
  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe tất cả subscriptions
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.stompClient.disconnect(() => {
        console.log("WebSocket disconnected");
      });

      this.connected = false;
      this.stompClient = null;
    }
  }

  /**
   * Subscribe to topic theo Backend config
   * Topics: /topic/chat/{sessionId}, /topic/staff/messages
   */
  subscribe(destination, callback) {
    if (!this.connected || !this.stompClient) {
      console.error("❌ [SUBSCRIPTION] WebSocket not connected");
      console.error("❌ [SUBSCRIPTION] Connection state:", {
        connected: this.connected,
        stompClient: !!this.stompClient,
        connecting: this.connecting,
      });
      return null;
    }

    try {
      console.log(`📡 [SUBSCRIPTION] Subscribing to: ${destination}`);

      const subscription = this.stompClient.subscribe(
        destination,
        (message) => {
          try {
            console.log(`📨 [MESSAGE] Received on ${destination}:`, message);
            console.log(`📨 [MESSAGE] Raw body:`, message.body);

            const data = JSON.parse(message.body);
            console.log(`📨 [MESSAGE] Parsed data:`, data);

            // Xử lý thông báo session mới
            if (destination === "/topic/staff/new-session") {
              console.log(
                "🔔 [NEW SESSION] Displaying notification for:",
                data
              );
              chatNotificationService.showNewSessionNotification(data);
            }

            if (callback) {
              console.log(`📨 [MESSAGE] Calling callback for ${destination}`);
              callback(data);
            } else {
              console.warn(`⚠️ [MESSAGE] No callback for ${destination}`);
            }
          } catch (error) {
            console.error(
              `❌ [MESSAGE] Error parsing message from ${destination}:`,
              error
            );
            console.error(`❌ [MESSAGE] Raw body:`, message.body);
            if (callback) {
              callback(message.body);
            }
          }
        }
      );

      this.subscriptions.set(destination, subscription);
      console.log(
        `✅ [SUBSCRIPTION] Successfully subscribed to: ${destination}`
      );
      console.log(`✅ [SUBSCRIPTION] Subscription object:`, subscription);
      console.log(
        `✅ [SUBSCRIPTION] Total subscriptions:`,
        this.subscriptions.size
      );
      return subscription;
    } catch (error) {
      console.error(
        "❌ [SUBSCRIPTION] Error subscribing to destination:",
        destination,
        error
      );
      return null;
    }
  }

  /**
   * Unsubscribe from topic
   */
  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`Unsubscribed from: ${destination}`);
    }
  }

  /**
   * Gửi message đến Backend theo MessageMapping
   * Destinations: /app/chat.send, /app/chat.join, /app/chat.markRead
   */
  sendMessage(destination, payload) {
    if (!this.connected || !this.stompClient) {
      console.error("WebSocket not connected");
      return false;
    }

    try {
      this.stompClient.send(destination, {}, JSON.stringify(payload));
      console.log(`Message sent to ${destination}:`, payload);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  /**
   * Gửi chat message - tương ứng với @MessageMapping("/chat.send")
   */
  sendChatMessage(sessionId, message, senderName, senderType = "STAFF") {
    const payload = {
      sessionId,
      message,
      senderName,
      senderType,
    };

    return this.sendMessage("/app/chat.send", payload);
  }

  /**
   * Join chat session - tương ứng với @MessageMapping("/chat.join")
   */
  joinChatSession(sessionId) {
    return this.sendMessage("/app/chat.join", sessionId);
  }

  /**
   * Mark messages as read - tương ứng với @MessageMapping("/chat.markRead")
   */
  markMessagesAsRead(sessionId, readerName) {
    const payload = {
      sessionId,
      readerName,
    };

    return this.sendMessage("/app/chat.markRead", payload);
  }

  /**
   * Subscribe to session messages - /topic/chat/{sessionId}
   */
  subscribeToSession(sessionId, callback) {
    return this.subscribe(`/topic/chat/${sessionId}`, callback);
  }

  /**
   * Subscribe to staff messages - /topic/staff/messages
   */
  subscribeToStaffMessages(callback) {
    return this.subscribe("/topic/staff/messages", callback);
  }

  /**
   * Subscribe to new session notifications - /topic/staff/new-session
   */
  subscribeToNewSessions(callback) {
    return this.subscribe("/topic/staff/new-session", callback);
  }

  /**
   * Auto-reconnect logic
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnect failed, will try again
        });
      }, this.reconnectDelay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  /**
   * Get connection status
   */
  isConnected() {
    return this.connected;
  }

  /**
   * Get connecting status
   */
  isConnecting() {
    return this.connecting;
  }
}

// Export singleton instance
const chatWebSocketService = new ChatWebSocketService();
export default chatWebSocketService;
