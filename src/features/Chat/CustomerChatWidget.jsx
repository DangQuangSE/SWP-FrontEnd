import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Avatar, Badge, Typography, Tooltip } from "antd";
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import chatApi from "../../configs/chatApi";
import "./CustomerChatWidget.css";

const { Text } = Typography;

/**
 * Customer Chat Widget - Discord-like Interface
 */
const CustomerChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
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

  console.log("🔍 [WIDGET] Redux user:", reduxUser);
  console.log("🔍 [WIDGET] Redux token:", !!reduxToken);
  console.log("🔍 [WIDGET] LocalStorage user:", localStorageUser);
  console.log("🔍 [WIDGET] Final user:", currentUser);
  console.log("🔍 [WIDGET] Final role:", userRole);
  console.log("🔍 [WIDGET] All localStorage keys:", Object.keys(localStorage));
  const unreadCount = 0;

  // Start chat session API call (no auth required)
  const startChatSession = async (name) => {
    try {
      console.log("🚀 [CHAT API] Starting chat session (no auth)...");
      console.log("🔍 [CHAT API] Customer name:", name);

      const requestBody = {
        customerName: name || "Khách hàng",
      };

      console.log("🔍 [CHAT API] Request body:", requestBody);

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

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      message: inputMessage,
      senderName: currentUser.name,
      senderType: "CUSTOMER",
      timestamp: new Date().toISOString(),
      avatar: null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Simulate staff response after 2 seconds
    setTimeout(() => {
      const staffResponse = {
        id: Date.now() + 1,
        message: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ hỗ trợ bạn ngay.",
        senderName: "Support Staff",
        senderType: "STAFF",
        timestamp: new Date().toISOString(),
        avatar: null,
      };
      setMessages((prev) => [...prev, staffResponse]);
    }, 2000);
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

  // Initialize demo messages
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        message: "Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?",
        senderName: "Support Bot",
        senderType: "STAFF",
        timestamp: new Date().toISOString(),
        avatar: null,
      };
      setMessages([welcomeMessage]);
      setIsConnected(true);
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
          <Badge count={unreadCount} offset={[-8, 8]}>
            <Button
              type="primary"
              shape="circle"
              size="large"
              icon={isOpen ? <CloseOutlined /> : <MessageOutlined />}
              className={`chat-toggle-btn ${isOpen ? "open" : ""}`}
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
                      isConnected ? "online" : "offline"
                    }`}
                  ></div>
                  <Text strong style={{ color: "#fff" }}>
                    Customer Support
                  </Text>
                </div>
                <Text style={{ color: "#b9bbbe", fontSize: "12px" }}>
                  {isConnected ? "Đang kết nối" : "Ngoại tuyến"}
                </Text>
              </div>
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={toggleWidget}
                style={{ color: "#b9bbbe" }}
              />
            </div>

            {/* Name Form or Messages Area */}
            {showNameForm ? (
              <div
                className="name-form-container"
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "300px",
                  backgroundColor: "#36393f",
                }}
              >
                <Text
                  style={{
                    color: "#dcddde",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  Xin chào! Vui lòng nhập tên của bạn để bắt đầu cuộc trò chuyện
                </Text>
                <Input
                  placeholder="Nhập tên của bạn..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onKeyDown={handleNameKeyPress}
                  style={{
                    marginBottom: "16px",
                    backgroundColor: "#40444b",
                    border: "1px solid #72767d",
                    color: "#dcddde",
                  }}
                  autoFocus
                />
                <Button
                  type="primary"
                  onClick={handleNameSubmit}
                  disabled={!customerName.trim()}
                  style={{
                    backgroundColor: "#5865f2",
                    borderColor: "#5865f2",
                  }}
                >
                  Bắt đầu trò chuyện
                </Button>
              </div>
            ) : (
              <div className="chat-messages-area">
                {messages.map((msg) => (
                  <div key={msg.id} className="message-wrapper">
                    <div className="message-content">
                      <Avatar
                        size={40}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor:
                            msg.senderType === "STAFF" ? "#5865f2" : "#57f287",
                          flexShrink: 0,
                        }}
                      />
                      <div className="message-details">
                        <div className="message-header">
                          <Text strong style={{ color: "#dcddde" }}>
                            {msg.senderName}
                          </Text>
                          <Text
                            style={{
                              color: "#72767d",
                              fontSize: "12px",
                              marginLeft: "8px",
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Text>
                        </div>
                        <div className="message-text">
                          <Text style={{ color: "#dcddde" }}>
                            {msg.message}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="typing-indicator">
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      style={{ backgroundColor: "#5865f2" }}
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

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="chat-input-container">
                <Input.TextArea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  style={{
                    backgroundColor: "#40444b",
                    border: "none",
                    color: "#dcddde",
                    resize: "none",
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  style={{
                    backgroundColor: "#5865f2",
                    borderColor: "#5865f2",
                    marginLeft: "8px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChatWidget;
