import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

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
        // Tạo SockJS connection đến endpoint /ws/chat
        const socket = new SockJS('http://localhost:8080/ws/chat');
        this.stompClient = Stomp.over(socket);

        // Disable debug logs
        this.stompClient.debug = () => {};

        // Connect với headers
        this.stompClient.connect(
          {
            // Có thể thêm auth headers nếu cần
          },
          (frame) => {
            console.log('WebSocket connected:', frame);
            this.connected = true;
            this.connecting = false;
            this.reconnectAttempts = 0;
            resolve();
          },
          (error) => {
            console.error('WebSocket connection error:', error);
            this.connected = false;
            this.connecting = false;
            this.handleReconnect();
            reject(error);
          }
        );

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
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
        console.log('WebSocket disconnected');
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
      console.error('WebSocket not connected');
      return null;
    }

    try {
      const subscription = this.stompClient.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (error) {
          console.error('Error parsing message:', error);
          callback(message.body);
        }
      });

      this.subscriptions.set(destination, subscription);
      console.log(`Subscribed to: ${destination}`);
      return subscription;

    } catch (error) {
      console.error('Error subscribing to destination:', destination, error);
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
      console.error('WebSocket not connected');
      return false;
    }

    try {
      this.stompClient.send(destination, {}, JSON.stringify(payload));
      console.log(`Message sent to ${destination}:`, payload);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Gửi chat message - tương ứng với @MessageMapping("/chat.send")
   */
  sendChatMessage(sessionId, message, senderName, senderType = 'STAFF') {
    const payload = {
      sessionId,
      message,
      senderName,
      senderType
    };
    
    return this.sendMessage('/app/chat.send', payload);
  }

  /**
   * Join chat session - tương ứng với @MessageMapping("/chat.join")
   */
  joinChatSession(sessionId) {
    return this.sendMessage('/app/chat.join', sessionId);
  }

  /**
   * Mark messages as read - tương ứng với @MessageMapping("/chat.markRead")
   */
  markMessagesAsRead(sessionId, readerName) {
    const payload = {
      sessionId,
      readerName
    };
    
    return this.sendMessage('/app/chat.markRead', payload);
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
    return this.subscribe('/topic/staff/messages', callback);
  }

  /**
   * Subscribe to new session notifications - /topic/staff/new-session
   */
  subscribeToNewSessions(callback) {
    return this.subscribe('/topic/staff/new-session', callback);
  }

  /**
   * Auto-reconnect logic
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnect failed, will try again
        });
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
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
