import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  List,
  Input,
  Button,
  Typography,
  Space,
  Avatar,
  Badge,
  Divider,
  Row,
  Col,
  Tag,
  Empty,
  Tabs,
  Spin,
  message,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import chatAPIService from "./chatAPI";
import "./StaffChatInterface.css";

const { Text, Title } = Typography;
const { TextArea } = Input;

/**
 * Staff Chat Interface for Q&A Section
 * Hiển thị chat sessions và chat interface
 */
const StaffChatInterface = ({ defaultTab = "waiting", hideTabs = false }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waitingSessions, setWaitingSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chat sessions for specific status
  const fetchChatSessionsByStatus = async (status) => {
    try {
      console.log("🚀 [STAFF CHAT] Fetching sessions with status:", status);
      const response = await chatAPIService.getChatSessions(status);
      console.log(`✅ [STAFF CHAT] ${status} sessions fetched:`, response);
      return response;
    } catch (error) {
      console.error(
        `❌ [STAFF CHAT] Error fetching ${status} sessions:`,
        error
      );
      throw error;
    }
  };

  // Load all sessions (both WAITING and ACTIVE) - called when clicking Q&A
  const loadAllSessions = async () => {
    try {
      setLoading(true);
      console.log("🚀 [STAFF CHAT] Loading all sessions (WAITING + ACTIVE)...");

      // Fetch both WAITING and ACTIVE sessions in parallel
      const [waitingData, activeData] = await Promise.all([
        fetchChatSessionsByStatus("WAITING"),
        fetchChatSessionsByStatus("ACTIVE"),
      ]);

      // Store sessions by status
      setWaitingSessions(waitingData);
      setActiveSessions(activeData);

      // Set current tab sessions
      if (activeTab === "waiting") {
        setSessions(waitingData);
      } else if (activeTab === "active") {
        setSessions(activeData);
      }

      console.log("✅ [STAFF CHAT] All sessions loaded successfully");
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error loading all sessions:", error);
      message.error("Không thể tải danh sách chat sessions");
    } finally {
      setLoading(false);
    }
  };

  // Load sessions for specific tab - called when clicking tab
  const loadSessionsForTab = async (tabKey) => {
    try {
      setLoading(true);
      console.log("🚀 [STAFF CHAT] Loading sessions for tab:", tabKey);
      console.log(
        "🔍 [STAFF CHAT] Function loadSessionsForTab is being called!"
      );

      let sessionsData;
      if (tabKey === "waiting") {
        // Always fetch fresh data when clicking tab
        console.log("🔄 [STAFF CHAT] Fetching fresh WAITING sessions");
        sessionsData = await fetchChatSessionsByStatus("WAITING");
        setWaitingSessions(sessionsData);
      } else if (tabKey === "active") {
        // Always fetch fresh data when clicking tab
        console.log("🔄 [STAFF CHAT] Fetching fresh ACTIVE sessions");
        sessionsData = await fetchChatSessionsByStatus("ACTIVE");
        setActiveSessions(sessionsData);
      }

      setSessions(sessionsData);
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error loading sessions for tab:", error);
      message.error("Không thể tải danh sách chat sessions");
    } finally {
      setLoading(false);
    }
  };

  // Note: Filtering is now done by backend via status parameter

  // No automatic API calls on component mount
  // Sessions will only be loaded when user clicks tabs

  // Mock data for demo - organized by status (fallback)
  const mockSessions = [
    {
      sessionId: "1",
      customerName: "Nguyễn Văn A",
      topic: "Hỗ trợ đặt lịch",
      status: "WAITING",
      unreadCount: 3,
      lastMessage: "Tôi cần hỗ trợ đặt lịch khám",
      lastMessageTime: "2024-01-15T10:30:00Z",
      customerAvatar: null,
    },
    {
      sessionId: "2",
      customerName: "Trần Thị B",
      topic: "Tư vấn dịch vụ",
      status: "WAITING",
      unreadCount: 1,
      lastMessage: "Cho em hỏi về gói khám sức khỏe",
      lastMessageTime: "2024-01-15T09:15:00Z",
      customerAvatar: null,
    },
    {
      sessionId: "3",
      customerName: "Lê Văn C",
      topic: "Thanh toán",
      status: "ACTIVE",
      unreadCount: 2,
      lastMessage: "Tôi đã thanh toán rồi",
      lastMessageTime: "2024-01-15T08:45:00Z",
      customerAvatar: null,
    },
    {
      sessionId: "4",
      customerName: "Phạm Thị D",
      topic: "Hỗ trợ kỹ thuật",
      status: "ACTIVE",
      unreadCount: 0,
      lastMessage: "Ứng dụng bị lỗi không vào được",
      lastMessageTime: "2024-01-15T07:20:00Z",
      customerAvatar: null,
    },
  ];

  const mockMessages = {
    1: [
      {
        id: 1,
        message: "Xin chào! Tôi cần hỗ trợ đặt lịch khám.",
        senderName: "Nguyễn Văn A",
        senderType: "CUSTOMER",
        timestamp: "2024-01-15T10:25:00Z",
      },
      {
        id: 2,
        message:
          "Chào bạn! Tôi sẽ hỗ trợ bạn đặt lịch. Bạn muốn đặt lịch cho dịch vụ nào?",
        senderName: "Staff Support",
        senderType: "STAFF",
        timestamp: "2024-01-15T10:26:00Z",
      },
      {
        id: 3,
        message: "Tôi muốn đặt lịch khám tổng quát.",
        senderName: "Nguyễn Văn A",
        senderType: "CUSTOMER",
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
    2: [
      {
        id: 1,
        message: "Cho em hỏi về gói khám sức khỏe ạ",
        senderName: "Trần Thị B",
        senderType: "CUSTOMER",
        timestamp: "2024-01-15T09:15:00Z",
      },
    ],
    3: [
      {
        id: 1,
        message: "Tôi đã thanh toán nhưng chưa nhận được xác nhận",
        senderName: "Lê Văn C",
        senderType: "CUSTOMER",
        timestamp: "2024-01-15T08:40:00Z",
      },
      {
        id: 2,
        message: "Tôi đã kiểm tra và xác nhận thanh toán của bạn. Cảm ơn bạn!",
        senderName: "Staff Support",
        senderType: "STAFF",
        timestamp: "2024-01-15T08:42:00Z",
      },
      {
        id: 3,
        message: "Cảm ơn bạn đã hỗ trợ!",
        senderName: "Lê Văn C",
        senderType: "CUSTOMER",
        timestamp: "2024-01-15T08:45:00Z",
      },
    ],
  };

  // Note: Sessions are now fetched directly from API with status filter

  // Note: Sessions are now fetched via API calls, not filtered from mock data

  // Handle tab change - call API only when user clicks tab
  const handleTabChange = (key) => {
    console.log("🔄 [STAFF CHAT] Tab changed to:", key);
    console.log("🎯 [STAFF CHAT] handleTabChange function is being called!");
    setActiveTab(key);
    setSelectedSession(null); // Clear selection when switching tabs

    // Call API for the selected tab
    console.log("🚀 [STAFF CHAT] User clicked tab, loading data for:", key);
    console.log("🔥 [STAFF CHAT] About to call loadSessionsForTab...");
    loadSessionsForTab(key);
  };

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-load all sessions when component mounts (when clicking Q&A)
  useEffect(() => {
    console.log("🚀 [STAFF CHAT] Component mounted, loading all sessions...");
    loadAllSessions();
  }, []); // Empty dependency array means this runs once on mount

  // Handle session selection
  const handleSessionSelect = (session) => {
    setSelectedSession(session);
    setMessages(mockMessages[session.sessionId] || []);

    // Focus input after selecting session
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedSession) return;

    const newMessage = {
      id: Date.now(),
      message: inputMessage,
      senderName: "Staff Support",
      senderType: "STAFF",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Update session's last message
    setSessions((prev) =>
      prev.map((session) =>
        session.sessionId === selectedSession.sessionId
          ? {
              ...session,
              lastMessage: inputMessage,
              lastMessageTime: new Date().toISOString(),
            }
          : session
      )
    );
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "WAITING":
        return "orange";
      case "RESOLVED":
        return "blue";
      default:
        return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircleOutlined />;
      case "WAITING":
        return <ClockCircleOutlined />;
      case "RESOLVED":
        return <ExclamationCircleOutlined />;
      default:
        return <MessageOutlined />;
    }
  };

  return (
    <div className="staff-chat-interface">
      {/* Tabs for Q&A Status - Only show if not hidden */}
      {!hideTabs && (
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          style={{ marginBottom: "16px" }}
          items={[
            {
              key: "waiting",
              label: (
                <Space>
                  <ClockCircleOutlined />
                  <span>Đang chờ</span>
                  <Badge
                    count={
                      waitingSessions.filter((s) => s.unreadCount > 0).length
                    }
                    size="small"
                  />
                </Space>
              ),
            },
            {
              key: "active",
              label: (
                <Space>
                  <CheckCircleOutlined />
                  <span>Đang hoạt động</span>
                  <Badge
                    count={
                      activeSessions.filter((s) => s.unreadCount > 0).length
                    }
                    size="small"
                  />
                </Space>
              ),
            },
          ]}
        />
      )}

      <Row
        gutter={16}
        style={{ height: hideTabs ? "100%" : "calc(100% - 60px)" }}
      >
        {/* Sessions List */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <MessageOutlined />
                <span>
                  {activeTab === "waiting"
                    ? "Đang chờ phản hồi"
                    : "Đang hoạt động"}
                </span>
                <Badge
                  count={sessions.filter((s) => s.unreadCount > 0).length}
                />
              </Space>
            }
            extra={
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={() => {
                  console.log("🔄 [STAFF CHAT] Refresh button clicked");
                  // Clear cache and reload all sessions
                  setWaitingSessions([]);
                  setActiveSessions([]);
                  loadAllSessions();
                }}
                loading={loading}
                title="Refresh"
              />
            }
            className="sessions-card"
          >
            <div className="sessions-list-container">
              {loading ? (
                <div
                  className="loading-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    minHeight: "200px",
                  }}
                >
                  <Spin size="large" />
                  <Text style={{ marginTop: 16, color: "#8c8c8c" }}>
                    Đang tải chat sessions...
                  </Text>
                </div>
              ) : sessions.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Text type="secondary">
                      {activeTab === "waiting"
                        ? "Không có cuộc trò chuyện đang chờ"
                        : "Không có cuộc trò chuyện đang hoạt động"}
                    </Text>
                  }
                  style={{ padding: "40px 20px" }}
                />
              ) : (
                <div className="sessions-list" style={{ padding: "8px 0" }}>
                  {sessions.map((session) => (
                    <div
                      key={session.sessionId}
                      className={`session-card ${
                        selectedSession?.sessionId === session.sessionId
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleSessionSelect(session)}
                      style={{
                        padding: "12px 16px",
                        margin: "4px 8px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        backgroundColor:
                          selectedSession?.sessionId === session.sessionId
                            ? "#e6f7ff"
                            : "transparent",
                        border:
                          selectedSession?.sessionId === session.sessionId
                            ? "1px solid #1890ff"
                            : "1px solid transparent",
                        ":hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSession?.sessionId !== session.sessionId) {
                          e.target.style.backgroundColor = "#f5f5f5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSession?.sessionId !== session.sessionId) {
                          e.target.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      {/* Session Header */}
                      <div
                        className="session-header"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                        }}
                      >
                        <div
                          className="session-avatar-container"
                          style={{ position: "relative" }}
                        >
                          <Avatar
                            size={44}
                            style={{
                              backgroundColor:
                                session.status === "WAITING"
                                  ? "#ff7a00"
                                  : "#52c41a",
                              fontSize: "16px",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {session.customerName?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </Avatar>
                          {session.unreadCount > 0 && (
                            <Badge
                              count={session.unreadCount}
                              style={{
                                position: "absolute",
                                top: "-2px",
                                right: "-2px",
                                minWidth: "18px",
                                height: "18px",
                                lineHeight: "18px",
                                fontSize: "11px",
                              }}
                            />
                          )}
                          {/* Online status indicator */}
                          <div
                            className="status-indicator"
                            style={{
                              position: "absolute",
                              bottom: "2px",
                              right: "2px",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor:
                                session.status === "ACTIVE"
                                  ? "#52c41a"
                                  : "#faad14",
                              border: "2px solid white",
                              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
                            }}
                          />
                        </div>

                        <div
                          className="session-info"
                          style={{ flex: 1, minWidth: 0 }}
                        >
                          <div
                            className="session-name-row"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "4px",
                            }}
                          >
                            <Text
                              strong
                              className="customer-name"
                              style={{
                                fontSize: "15px",
                                color: "#262626",
                                lineHeight: "20px",
                                fontWeight: "600",
                              }}
                            >
                              {session.customerName}
                            </Text>
                            <Text
                              type="secondary"
                              className="session-time"
                              style={{
                                fontSize: "11px",
                                color: "#8c8c8c",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {session.updatedAt
                                ? new Date(
                                    session.updatedAt
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Mới"}
                            </Text>
                          </div>

                          <div
                            className="session-preview"
                            style={{ marginBottom: "6px" }}
                          >
                            <Text
                              type="secondary"
                              className="last-message"
                              style={{
                                fontSize: "13px",
                                color: "#595959",
                                lineHeight: "18px",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {session.lastMessage ||
                                (session.status === "WAITING"
                                  ? "Khách hàng đang chờ phản hồi..."
                                  : "Cuộc trò chuyện đang diễn ra")}
                            </Text>
                          </div>

                          <div
                            className="session-tags"
                            style={{
                              display: "flex",
                              gap: "4px",
                              flexWrap: "wrap",
                            }}
                          >
                            <Tag
                              color={
                                session.status === "WAITING"
                                  ? "orange"
                                  : "green"
                              }
                              style={{
                                fontSize: "10px",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                border: "none",
                                fontWeight: "500",
                                margin: 0,
                              }}
                            >
                              {session.status === "WAITING"
                                ? "Chờ phản hồi"
                                : "Đang hoạt động"}
                            </Tag>
                            {session.staffName && (
                              <Tag
                                color="blue"
                                style={{
                                  fontSize: "10px",
                                  padding: "2px 8px",
                                  borderRadius: "12px",
                                  border: "none",
                                  fontWeight: "500",
                                  margin: 0,
                                }}
                              >
                                {session.staffName}
                              </Tag>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Chat Area */}
        <Col xs={24} lg={16}>
          {selectedSession ? (
            <Card
              title={
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>{selectedSession.customerName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {selectedSession.topic}
                    </Text>
                  </div>
                </Space>
              }
              className="chat-card"
            >
              {/* Messages Area */}
              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message-item ${msg.senderType.toLowerCase()}`}
                  >
                    <div className="message-content">
                      <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        style={{
                          backgroundColor:
                            msg.senderType === "STAFF" ? "#52c41a" : "#1890ff",
                        }}
                      />
                      <div className="message-details">
                        <div className="message-header">
                          <Text strong style={{ fontSize: "14px" }}>
                            {msg.senderName}
                          </Text>
                          <Text
                            type="secondary"
                            style={{ fontSize: "12px", marginLeft: "8px" }}
                          >
                            {new Date(msg.timestamp).toLocaleString("vi-VN")}
                          </Text>
                        </div>
                        <div className="message-text">
                          <Text>{msg.message}</Text>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Input Area */}
              <div className="input-area">
                <Space.Compact style={{ width: "100%" }}>
                  <TextArea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Nhập tin nhắn cho ${selectedSession.customerName}...`}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    style={{ height: "auto" }}
                  >
                    Gửi
                  </Button>
                </Space.Compact>
              </div>
            </Card>
          ) : (
            <Card className="chat-card">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chọn một chat session để bắt đầu trò chuyện"
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default StaffChatInterface;
