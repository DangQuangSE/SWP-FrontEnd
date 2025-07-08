import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Input,
  Avatar,
  Badge,
  Typography,
  Tooltip,
  Tag,
  Space,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import chatApi from "../../configs/chatApi";
import { useRealTimeMessages } from "./hooks/useRealTimeMessages";
import { customerChatAPI } from "./customerChatAPI";
import unifiedChatAPI from "./unifiedChatAPI";
import {
  getMessageColors,
  getAvatarColor,
  getMessageBubbleStyle,
} from "./chatColors";
import "./CustomerChatWidget.css";

const { Text } = Typography;

/**
 * Customer Chat Widget - Discord-like Interface
 */
const CustomerChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [staffOnline, setStaffOnline] = useState(false);
  const [staffTyping, setStaffTyping] = useState(false);
  const [sessionStatus, setSessionStatus] = useState("WAITING"); // WAITING, ACTIVE, COMPLETED
  const [unreadCount, setUnreadCount] = useState(() => {
    // Load unread count from localStorage on init
    const saved = localStorage.getItem("chat_unread_count");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lastReadMessageId, setLastReadMessageId] = useState(null);

  // Real-time messages hook
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    addMessage,
    clearMessages,
    refetch: refetchMessages,
  } = useRealTimeMessages(
    sessionId,
    false, // isStaff = false for customer
    sessionStatus === "ACTIVE" // isActive when session is active
  );
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const stompClientRef = useRef(null);
  const wsConnectedRef = useRef(false);
  const navigate = useNavigate();

  // Get current user info from Redux store first, then fallback to localStorage
  const reduxUser = useSelector((state) => state.user?.user);
  const reduxToken = useSelector((state) => state.user?.token);

  // Fallback to localStorage if Redux is empty
  const userData =
    localStorage.getItem("user") || localStorage.getItem("currentUser") || "{}";
  const localStorageUser = JSON.parse(userData);

  // Use Redux data first, then localStorage as fallback
  const currentUser = reduxUser || localStorageUser;
  const userRole = currentUser?.role || "CUSTOMER";

  // WebSocket connection for real-time updates
  const connectWebSocket = () => {
    if (wsConnectedRef.current || !sessionId) return;

    try {
      const socket = new SockJS("http://localhost:8080/ws/chat");
      const stompClient = Stomp.over(socket);

      stompClient.debug = null;

      stompClient.connect(
        {},
        (frame) => {
          wsConnectedRef.current = true;
          stompClientRef.current = stompClient;

          // Subscribe to session messages
          stompClient.subscribe(`/topic/chat/${sessionId}`, (message) => {
            try {
              const data = JSON.parse(message.body);

              // Handle real-time message via WebSocket
              if (data.message) {
                // If this is the first staff message, update status to ACTIVE
                if (
                  data.senderType === "STAFF" &&
                  sessionStatus === "WAITING"
                ) {
                  setStaffOnline(true);
                  setSessionStatus("ACTIVE");

                  // Clear bot messages - let polling fetch the real message
                  clearMessages();
                }

                // Update unread count if widget is closed and message is from staff
                if (!isOpen && data.senderType === "STAFF") {
                  setUnreadCount((prev) => {
                    const newCount = prev + 1;
                    // Save to localStorage
                    localStorage.setItem(
                      "chat_unread_count",
                      newCount.toString()
                    );
                    return newCount;
                  });
                }

                // Trigger refetch to sync with backend (get real message from server)
                setTimeout(() => refetchMessages(), 500);
              }

              // Handle typing indicators
              if (data.type === "TYPING_START") {
                setStaffTyping(true);
              } else if (data.type === "TYPING_STOP") {
                setStaffTyping(false);
              }
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          });

          // Subscribe to session status updates
          stompClient.subscribe(
            `/topic/chat/${sessionId}/status`,
            (message) => {
              try {
                const data = JSON.parse(message.body);

                if (data.status) {
                  setSessionStatus(data.status);

                  if (data.status === "ACTIVE") {
                    setStaffOnline(true);
                  } else if (data.status === "COMPLETED") {
                    setStaffOnline(false);
                  }
                }
              } catch (error) {
                console.error("Error parsing status:", error);
              }
            }
          );
        },
        (error) => {
          console.error("Connection error:", error);
          wsConnectedRef.current = false;

          // Retry connection after 5 seconds
          setTimeout(() => {
            if (sessionId) connectWebSocket();
          }, 5000);
        }
      );
    } catch (error) {
      console.error("Failed to create connection:", error);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (stompClientRef.current && wsConnectedRef.current) {
      stompClientRef.current.disconnect();
      wsConnectedRef.current = false;
      stompClientRef.current = null;
    }
  };

  // Start chat session API call (no auth required)
  const startChatSession = async (name) => {
    try {
      const requestBody = {
        customerName: name || "Khách hàng",
      };

      // Call chat API (no auth required)
      const response = await chatApi.post("/chat/start", requestBody);

      console.log("✅ [CHAT API] Response received:");
      console.log("🔍 [CHAT API] Full response:", response);
      console.log("🔍 [CHAT API] Response data:", response.data);
      console.log("🔍 [CHAT API] Response status:", response.status);
      console.log("🔍 [CHAT API] Response headers:", response.headers);

      if (response.data && response.data.sessionId) {
        setSessionId(response.data.sessionId);
        console.log("✅ [CHAT API] Session ID set:", response.data.sessionId);
        setIsConnected(true);
        setShowNameForm(false);

        // Set initial session status to WAITING
        setSessionStatus("WAITING");
        setStaffOnline(false);

        // Connect WebSocket for real-time updates
        setTimeout(() => {
          connectWebSocket();
        }, 1000);
      }

      return response.data;
    } catch (error) {
      console.error("❌ [CHAT API] Error starting chat session:");
      console.error("🔍 [CHAT API] Error object:", error);
      console.error("🔍 [CHAT API] Error response:", error.response);
      console.error("🔍 [CHAT API] Error message:", error.message);

      if (error.response) {
        console.error("🔍 [CHAT API] Error status:", error.response.status);
        console.error("🔍 [CHAT API] Error data:", error.response.data);
        console.error("🔍 [CHAT API] Error headers:", error.response.headers);
      }

      throw error;
    }
  };

  // Handle name form submission
  const handleNameSubmit = async () => {
    if (!customerName.trim()) {
      console.log("❌ [NAME FORM] Customer name is required");
      return;
    }

    console.log("🚀 [NAME FORM] Submitting name:", customerName);
    try {
      await startChatSession(customerName);
      console.log("✅ [NAME FORM] Chat session started successfully");
    } catch (error) {
      console.error("❌ [NAME FORM] Failed to start chat session:", error);
    }
  };

  // Handle name form key press
  const handleNameKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleNameSubmit();
    }
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect WebSocket when sessionId is available
  useEffect(() => {
    if (sessionId && !wsConnectedRef.current) {
      console.log(
        "🔌 [CUSTOMER WS] SessionId available, connecting WebSocket..."
      );
      connectWebSocket();
    }

    // Cleanup on unmount or sessionId change
    return () => {
      if (wsConnectedRef.current) {
        console.log("🧹 [CUSTOMER WS] Cleaning up WebSocket connection...");
        disconnectWebSocket();
      }
    };
  }, [sessionId]);

  // Save unread count to localStorage
  const saveUnreadCount = (count) => {
    localStorage.setItem("chat_unread_count", count.toString());
  };

  // Update unread count with persistence
  const updateUnreadCount = useCallback(
    (newCount) => {
      console.log(
        `📊 [CUSTOMER CHAT] Updating unread count: ${unreadCount} → ${newCount}`
      );
      setUnreadCount(newCount);
      saveUnreadCount(newCount);
    },
    [unreadCount]
  );

  // Fetch unread count from server
  const fetchUnreadCount = async () => {
    if (!sessionId || !customerName) return;

    try {
      console.log("📊 [CUSTOMER CHAT] Fetching unread count from server...");
      const count = await customerChatAPI.getUnreadCount(
        sessionId,
        customerName
      );
      console.log("✅ [CUSTOMER CHAT] Server unread count:", count);
      updateUnreadCount(count);
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT] Error fetching unread count:", error);
    }
  };

  // Load unread count when session is established
  useEffect(() => {
    if (sessionId && customerName && !isOpen) {
      fetchUnreadCount();
    }
  }, [sessionId, customerName, isOpen]);

  // Reset unread count when widget opens
  useEffect(() => {
    if (isOpen) {
      console.log("🔄 [CUSTOMER CHAT] Widget opened - resetting unread count");
      updateUnreadCount(0);

      // Mark messages as read on server if session exists
      if (sessionId && customerName) {
        // Optional: Call mark as read API here if available
        console.log("📖 [CUSTOMER CHAT] Marking messages as read on server");
      }
    }
  }, [isOpen, sessionId, customerName, updateUnreadCount]);

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const messageText = inputMessage.trim();
    // Use the customerName from state (entered in name form)

    // Add message to local state immediately for better UX
    // Clear input immediately for better UX
    setInputMessage("");

    // Send message via REST API (more reliable)
    try {
      console.log("📤 [CUSTOMER CHAT] Sending message via REST API...");

      const sentMessage = await unifiedChatAPI.sendMessage(
        sessionId,
        messageText,
        customerName,
        false // isStaff = false for customer
      );

      console.log("✅ [CUSTOMER CHAT] Message sent successfully:", sentMessage);

      // Trigger immediate refetch to get the sent message
      if (refetchMessages) {
        setTimeout(() => {
          refetchMessages();
        }, 500);
      }

      // Don't send via WebSocket - REST API is sufficient
      // WebSocket will receive the message from server after API processes it
      console.log(
        "✅ [CUSTOMER CHAT] Message sent via REST API only, WebSocket will receive from server"
      );
    } catch (error) {
      console.error("❌ [CUSTOMER CHAT] Failed to send message:", error);

      // Don't add error message optimistically
      // Just log the error and let user retry
      console.log("💡 [CUSTOMER CHAT] User can retry sending the message");
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle widget or navigate to staff dashboard
  const toggleWidget = () => {
    console.log("🚀 [WIDGET] Chat button clicked!");
    console.log("🔍 [WIDGET] Redux user:", reduxUser);
    console.log("🔍 [WIDGET] LocalStorage user:", localStorageUser);
    console.log("🔍 [WIDGET] Final user:", currentUser);
    console.log("🔍 [WIDGET] Final role:", userRole);
    console.log("🔍 [WIDGET] Role comparison:", {
      userRole,
      isStaff: userRole === "STAFF",
      isStaffUpperCase: userRole?.toUpperCase() === "STAFF",
      roleType: typeof userRole,
      roleLength: userRole?.length,
    });

    // Check multiple role variations
    const isStaff =
      userRole === "STAFF" ||
      userRole?.toUpperCase() === "STAFF" ||
      currentUser?.role === "STAFF" ||
      reduxUser?.role === "STAFF";

    console.log("🔍 [WIDGET] Is staff check:", isStaff);

    // If user is staff, navigate to Q&A Waiting page
    if (isStaff) {
      console.log(
        "✅ [WIDGET] Staff detected! Navigating to staff dashboard..."
      );
      console.log("🔍 [WIDGET] Current location:", window.location.pathname);

      // Set selected menu item BEFORE navigation
      localStorage.setItem("staffSelectedMenuItem", "qa_waiting");
      console.log(
        "🔍 [WIDGET] Set localStorage staffSelectedMenuItem to qa_waiting"
      );

      // Navigate to staff dashboard
      navigate("/staff");
      console.log("🔍 [WIDGET] Navigation called to /staff");
      return;
    }

    console.log("👤 [WIDGET] Customer detected - opening chat widget...");
    // For customers, toggle chat widget
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Show name form if no session exists
      if (!sessionId) {
        setShowNameForm(true);
      }
      // Focus input when opening
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Initialize connection when widget opens
  useEffect(() => {
    if (isOpen) {
      setIsConnected(true);
      // Don't add welcome message optimistically
      // Let the real chat flow handle initial messages
      console.log("💬 [CUSTOMER CHAT] Widget opened, ready for chat");
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Widget Button */}
      <div className="chat-widget-button" onClick={toggleWidget}>
        <Tooltip
          title={
            userRole === "STAFF" ? "Đi đến Chat Dashboard" : "Mở Chat Hỗ trợ"
          }
          placement="left"
        >
          <Badge
            count={unreadCount}
            offset={[-8, 8]}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
              minWidth: "20px",
              height: "20px",
              lineHeight: "20px",
              borderRadius: "10px",
              border: "2px solid white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            showZero={false}
          >
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
              className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
              style={{
                position: "relative",
                boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                transition: "all 0.3s ease",
              }}
            />
          </Badge>
        </Tooltip>
      </div>

      {/* Chat Widget Panel - Only show for customers */}
      {isOpen && userRole !== "STAFF" && (
        <div className="chat-widget-panel">
          <div className="chat-widget-container">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-status-indicator">
                  <div
                    className={`status-dot ${
                      staffOnline
                        ? "online"
                        : isConnected
                        ? "waiting"
                        : "offline"
                    }`}
                  ></div>
                  <Text strong style={{ color: "#fff" }}>
                    Customer Support
                  </Text>
                  {sessionStatus === "ACTIVE" && (
                    <Tag color="#52c41a" size="small" style={{ marginLeft: 8 }}>
                      <CheckCircleOutlined /> Đang hỗ trợ
                    </Tag>
                  )}
                </div>
                <Space direction="vertical" size={0}>
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.8)",
                      fontSize: "12px",
                    }}
                  >
                    {staffOnline
                      ? "Nhân viên đang online"
                      : sessionStatus === "WAITING"
                      ? "Đang chờ nhân viên..."
                      : isConnected
                      ? "Đang kết nối"
                      : "Ngoại tuyến"}
                  </Text>
                  {staffTyping && (
                    <Text style={{ color: "#52c41a", fontSize: "11px" }}>
                      <LoadingOutlined /> Nhân viên đang nhập...
                    </Text>
                  )}
                </Space>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={toggleWidget}
                style={{ color: "#b9bbbe" }}
              />
            </div>

            {/* Name Form or Messages Area */}
            {showNameForm && !sessionId ? (
              <div className="chat-name-form">
                <Typography.Title level={4}>
                  Xin chào! Vui lòng nhập tên của bạn để bắt đầu cuộc trò chuyện
                </Typography.Title>
                <Input
                  placeholder="Nhập tên của bạn..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  autoFocus
                />
                <Button
                  type="primary"
                  onClick={handleNameSubmit}
                  disabled={!customerName.trim()}
                  block
                >
                  Bắt đầu trò chuyện
                </Button>
              </div>
            ) : (
              <div className="chat-messages-area">
                {messages
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((msg) => {
                    console.log(`🎨 [CUSTOMER CHAT] Message colors:`, {
                      senderType: msg.senderType,
                      avatarColor: getAvatarColor(msg.senderType),
                      bubbleStyle: getMessageBubbleStyle(msg.senderType),
                    });

                    return (
                      <div
                        key={`${msg.id}-${msg.senderType}`}
                        className={`message-item ${
                          msg.senderType === "STAFF"
                            ? "staff-message"
                            : "customer-message"
                        }`}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: "16px",
                          padding: "8px 12px",
                        }}
                      >
                        <Avatar
                          size={32}
                          icon={<UserOutlined />}
                          style={{
                            backgroundColor: getAvatarColor(msg.senderType),
                            marginRight: "12px",
                            flexShrink: 0,
                          }}
                        />
                        <div className="message-details" style={{ flex: 1 }}>
                          <div
                            className="message-header"
                            style={{ marginBottom: "4px" }}
                          >
                            <Text
                              strong
                              style={{ color: "white", fontSize: "14px" }}
                            >
                              {msg.senderName}
                            </Text>
                            <Text
                              style={{
                                color: "rgba(255, 255, 255, 0.7)",
                                fontSize: "12px",
                                marginLeft: "8px",
                              }}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                            </Text>
                          </div>
                          <div
                            className="message-bubble"
                            style={getMessageBubbleStyle(msg.senderType)}
                          >
                            <Text
                              style={{
                                color: getMessageColors(msg.senderType).text,
                                fontSize: "14px",
                              }}
                            >
                              {msg.message}
                            </Text>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {staffTyping && (
                  <div className="typing-indicator">
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#1890ff" }}
                    />
                    <div className="typing-content">
                      <Text style={{ color: "#dcddde" }}>
                        Support đang nhập...
                      </Text>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area - Only show when staff is connected */}
            {sessionStatus === "ACTIVE" && staffOnline && (
              <div className="chat-input-area">
                <div className="chat-input-container">
                  <Input.TextArea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  />
                </div>
              </div>
            )}

            {/* Waiting Status Message */}
            {sessionStatus === "WAITING" && (
              <div className="chat-waiting-area">
                <div className="waiting-message">
                  <LoadingOutlined
                    spin
                    style={{ marginRight: 8, color: "#1890ff" }}
                  />
                  <Text style={{ color: "#8c8c8c", fontStyle: "italic" }}>
                    Đang chờ nhân viên hỗ trợ tham gia cuộc trò chuyện...
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
