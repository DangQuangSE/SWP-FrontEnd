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
  ReloadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import chatAPIService from "./chatAPI";
import unifiedChatAPI from "../../../Chat/unifiedChatAPI";
import {
  getMessageColors,
  getAvatarColor,
  getMessageBubbleStyle,
} from "../../../Chat/chatColors";
import { useChatWebSocket } from "./ChatWebSocketProvider";
import { chatNotificationService } from "./ChatNotification";
import { useRealTimeMessages } from "../../../Chat/hooks/useRealTimeMessages";
import "./StaffChatInterface.css";

const { Text } = Typography;
const { TextArea } = Input;

/**
 * Staff Chat Interface for Q&A Section
 * Hiển thị chat sessions và chat interface
 */
const StaffChatInterface = ({ defaultTab = "waiting", hideTabs = false }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedSession, setSelectedSession] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [waitingSessions, setWaitingSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const messagesEndRef = useRef(null);

  // Real-time messages hook for selected session
  const {
    messages: realTimeMessages,
    loading: messagesLoading,
    addMessage,
    clearMessages,
    refetch: refetchMessages,
  } = useRealTimeMessages(
    selectedSession?.sessionId,
    true, // isStaff
    true // isActive
  );
  const subscriptionRef = useRef(null); // Track subscription to prevent duplicates
  const processedSessionsRef = useRef(new Set()); // Track processed sessions
  const notificationTimeoutRef = useRef({}); // Track notification timeouts
  const lastReloadTimeRef = useRef(0); // Track last reload time for rate limiting

  // Get current user from Redux
  const currentUser = useSelector((state) => state.user?.user);

  // Sử dụng WebSocket context
  const { connected: wsConnected, service: chatWebSocketService } =
    useChatWebSocket();
  const inputRef = useRef(null);

  // Fetch chat sessions for specific status
  const fetchChatSessionsByStatus = async (status) => {
    try {
      console.log("🚀 [STAFF CHAT] Fetching sessions with status:", status);
      const response = await chatAPIService.getChatSessions(status);
      console.log(`✅ [STAFF CHAT] ${status} sessions fetched:`, response);

      // Debug: Check each session's actual status
      response.forEach((session, index) => {
        console.log(`🔍 [STAFF CHAT] Session ${index + 1}:`, {
          sessionId: session.sessionId,
          customerName: session.customerName,
          status: session.status,
          expectedStatus: status,
        });
      });

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

      // Fetch unread counts for both waiting and active sessions
      // For staff: use customerName as readerName to count messages from customer
      const [waitingWithUnread, activeWithUnread] = await Promise.all([
        fetchUnreadCountsForSessions(waitingData, "STAFF"),
        fetchUnreadCountsForSessions(activeData, "STAFF"),
      ]);

      // Store sessions by status
      setWaitingSessions(waitingWithUnread);
      setActiveSessions(activeWithUnread);

      // Set current tab sessions
      if (activeTab === "waiting") {
        setSessions(waitingWithUnread);
      } else if (activeTab === "active") {
        setSessions(activeWithUnread);
      }

      console.log("✅ [STAFF CHAT] All sessions loaded successfully");
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error loading all sessions:", error);
      message.error("Không thể tải danh sách chat sessions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count for sessions
  const fetchUnreadCountsForSessions = async (sessions, readerType) => {
    try {
      console.log(
        "📊 [STAFF CHAT] Fetching unread counts for sessions:",
        sessions.length,
        "Reader type:",
        readerType
      );

      // Fetch unread counts for all sessions in parallel
      const unreadCountPromises = sessions.map(async (session) => {
        try {
          // For staff dashboard: we want to count messages from customers
          // So we pass "Nhân viên hỗ trợ" as readerName to exclude staff messages
          const readerName =
            readerType === "STAFF" ? "Nhân viên hỗ trợ" : session.customerName;

          console.log(
            `📊 [STAFF CHAT] Getting unread count for session ${session.sessionId} with readerName: ${readerName}`
          );

          const unreadCount = await chatAPIService.getUnreadCount(
            session.sessionId,
            readerName
          );
          return {
            sessionId: session.sessionId,
            unreadCount: unreadCount || 0,
          };
        } catch (error) {
          console.error(
            `❌ [STAFF CHAT] Error fetching unread count for session ${session.sessionId}:`,
            error
          );
          return {
            sessionId: session.sessionId,
            unreadCount: 0,
          };
        }
      });

      const unreadCounts = await Promise.all(unreadCountPromises);

      // Map unread counts back to sessions
      const sessionsWithUnreadCount = sessions.map((session) => {
        const unreadData = unreadCounts.find(
          (uc) => uc.sessionId === session.sessionId
        );
        return {
          ...session,
          unreadCount: unreadData ? unreadData.unreadCount : 0,
        };
      });

      console.log(
        "✅ [STAFF CHAT] Sessions with unread counts:",
        sessionsWithUnreadCount
      );
      return sessionsWithUnreadCount;
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error fetching unread counts:", error);
      // Return sessions without unread count if error
      return sessions.map((session) => ({ ...session, unreadCount: 0 }));
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
        // Fetch unread counts for waiting sessions
        // For staff: use "STAFF" to indicate we want to count customer messages
        sessionsData = await fetchUnreadCountsForSessions(
          sessionsData,
          "STAFF"
        );
        setWaitingSessions(sessionsData);
      } else if (tabKey === "active") {
        // Always fetch fresh data when clicking tab
        console.log("🔄 [STAFF CHAT] Fetching fresh ACTIVE sessions");
        sessionsData = await fetchChatSessionsByStatus("ACTIVE");
        // Fetch unread counts for active sessions
        // For staff: use "STAFF" to indicate we want to count customer messages
        sessionsData = await fetchUnreadCountsForSessions(
          sessionsData,
          "STAFF"
        );
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

  // Mock data removed - using real API data

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

  // Auto scroll to bottom when messages change (only for new messages, not when switching sessions)
  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  // Only scroll when new messages are added, not when switching sessions
  const [previousMessagesLength, setPreviousMessagesLength] = useState(0);

  useEffect(() => {
    // Only scroll if messages were added (not replaced)
    if (
      realTimeMessages.length > previousMessagesLength &&
      previousMessagesLength > 0
    ) {
      scrollToBottom();
    }
    setPreviousMessagesLength(realTimeMessages.length);
  }, [realTimeMessages, previousMessagesLength]);

  // Handle new session notification from WebSocket with duplicate prevention
  const handleNewSessionNotification = (newSession) => {
    console.log("🆕 [STAFF CHAT] Processing new session:", newSession);
    console.log("🔍 [STAFF CHAT] New session status:", newSession.status);
    console.log("🔍 [STAFF CHAT] Current active tab:", activeTab);

    // Strong duplicate prevention using ref
    if (processedSessionsRef.current.has(newSession.sessionId)) {
      console.log(
        "⚠️ [STAFF CHAT] Session already processed, ignoring:",
        newSession.sessionId
      );
      return;
    }

    // Mark session as processed
    processedSessionsRef.current.add(newSession.sessionId);

    // Prevent duplicate sessions in state
    const sessionExists = (sessionsList) =>
      sessionsList.some(
        (session) => session.sessionId === newSession.sessionId
      );

    // Add to appropriate sessions list based on status
    if (newSession.status === "WAITING") {
      setWaitingSessions((prev) => {
        if (sessionExists(prev)) {
          console.log(
            "⚠️ [STAFF CHAT] Duplicate WAITING session ignored:",
            newSession.sessionId
          );
          return prev;
        }
        return [newSession, ...prev];
      });

      // If currently viewing waiting tab, update sessions display
      if (activeTab === "waiting") {
        setSessions((prev) => {
          if (sessionExists(prev)) {
            console.log("⚠️ [STAFF CHAT] Duplicate session in display ignored");
            return prev;
          }
          return [newSession, ...prev];
        });
      }
    } else if (newSession.status === "ACTIVE") {
      setActiveSessions((prev) => {
        if (sessionExists(prev)) {
          console.log(
            "⚠️ [STAFF CHAT] Duplicate ACTIVE session ignored:",
            newSession.sessionId
          );
          return prev;
        }
        return [newSession, ...prev];
      });

      // If currently viewing active tab, update sessions display
      if (activeTab === "active") {
        setSessions((prev) => {
          if (sessionExists(prev)) {
            console.log("⚠️ [STAFF CHAT] Duplicate session in display ignored");
            return prev;
          }
          return [newSession, ...prev];
        });
      }
    }

    // Play notification sound immediately (no debouncing for audio)
    chatNotificationService.playNotificationSound();

    // Show text notification with debouncing to prevent spam
    const notificationKey = `chat-session-${newSession.sessionId}`;

    // Clear existing timeout for this session
    if (notificationTimeoutRef.current[newSession.sessionId]) {
      clearTimeout(notificationTimeoutRef.current[newSession.sessionId]);
    }

    // Set new timeout - only show notification if no more events in 500ms
    notificationTimeoutRef.current[newSession.sessionId] = setTimeout(() => {
      message.success({
        content: `Có chat session mới từ ${newSession.customerName}`,
        key: notificationKey,
        duration: 3,
      });

      // Clean up timeout reference
      delete notificationTimeoutRef.current[newSession.sessionId];
    }, 500);
  };

  // Auto-load all sessions when component mounts (when clicking Q&A)
  useEffect(() => {
    console.log("🚀 [STAFF CHAT] Component mounted, loading sessions...");
    loadAllSessions();

    // Cleanup on unmount
    return () => {
      console.log(
        "🧹 [STAFF CHAT] Component unmounting, clearing processed sessions..."
      );
      processedSessionsRef.current.clear();

      // Clear all pending notification timeouts
      Object.values(notificationTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      notificationTimeoutRef.current = {};
    };
  }, []);

  // Handle new message from WebSocket to update unread count
  const handleNewMessage = (message) => {
    console.log("📨 [STAFF CHAT] New message received:", message);

    // Update unread count for the session if it's not the currently selected session
    if (selectedSession?.sessionId !== message.sessionId) {
      // Update waiting sessions
      setWaitingSessions((prev) =>
        prev.map((session) =>
          session.sessionId === message.sessionId
            ? { ...session, unreadCount: (session.unreadCount || 0) + 1 }
            : session
        )
      );

      // Update active sessions
      setActiveSessions((prev) =>
        prev.map((session) =>
          session.sessionId === message.sessionId
            ? { ...session, unreadCount: (session.unreadCount || 0) + 1 }
            : session
        )
      );

      // Update current sessions display
      setSessions((prev) =>
        prev.map((session) =>
          session.sessionId === message.sessionId
            ? { ...session, unreadCount: (session.unreadCount || 0) + 1 }
            : session
        )
      );
    }
  };

  // Subscribe to new session notifications and staff messages when WebSocket is connected
  useEffect(() => {
    // Prevent multiple subscriptions
    if (subscriptionRef.current) {
      console.log("⚠️ [STAFF CHAT] Subscription already exists, skipping...");
      return;
    }

    if (wsConnected && chatWebSocketService) {
      console.log("🔔 [STAFF CHAT] Setting up WebSocket subscriptions...");

      // Subscribe to new session notifications
      const newSessionSubscription =
        chatWebSocketService.subscribeToNewSessions((newSession) => {
          console.log(
            "🔔 [STAFF CHAT] New session notification received:",
            newSession
          );
          handleNewSessionNotification(newSession);
        });

      // Subscribe to staff messages for unread count updates
      const staffMessagesSubscription =
        chatWebSocketService.subscribeToStaffMessages((message) => {
          console.log("📨 [STAFF CHAT] Staff message received:", message);
          handleNewMessage(message);
        });

      if (newSessionSubscription || staffMessagesSubscription) {
        subscriptionRef.current = {
          newSession: newSessionSubscription,
          staffMessages: staffMessagesSubscription,
        };
        console.log(
          "✅ [STAFF CHAT] Successfully subscribed to WebSocket notifications"
        );
      }
    }

    // Cleanup function to prevent multiple subscriptions
    return () => {
      if (subscriptionRef.current) {
        console.log("🧹 [STAFF CHAT] Cleaning up WebSocket subscriptions...");

        // Unsubscribe from all subscriptions
        if (subscriptionRef.current.newSession) {
          subscriptionRef.current.newSession.unsubscribe();
        }
        if (subscriptionRef.current.staffMessages) {
          subscriptionRef.current.staffMessages.unsubscribe();
        }

        subscriptionRef.current = null;
        console.log("✅ [STAFF CHAT] WebSocket subscriptions cleaned up");
      }
    };
  }, [wsConnected, chatWebSocketService]);

  // Reset unread count when user selects a session
  const resetUnreadCountForSession = (sessionId) => {
    console.log(
      `🔄 [STAFF CHAT] Resetting unread count for session: ${sessionId}`
    );

    // Update waiting sessions
    setWaitingSessions((prev) =>
      prev.map((session) =>
        session.sessionId === sessionId
          ? { ...session, unreadCount: 0 }
          : session
      )
    );

    // Update active sessions
    setActiveSessions((prev) =>
      prev.map((session) =>
        session.sessionId === sessionId
          ? { ...session, unreadCount: 0 }
          : session
      )
    );

    // Update current sessions display
    setSessions((prev) =>
      prev.map((session) =>
        session.sessionId === sessionId
          ? { ...session, unreadCount: 0 }
          : session
      )
    );
  };

  // Refresh unread counts for current sessions
  const refreshUnreadCounts = async () => {
    try {
      console.log(
        "🔄 [STAFF CHAT] Refreshing unread counts after message sent..."
      );

      if (sessions.length === 0) return;

      // Refresh unread counts for current sessions
      const updatedSessions = await fetchUnreadCountsForSessions(
        sessions,
        "STAFF"
      );

      // Update the appropriate state based on current tab
      if (activeTab === "waiting") {
        setWaitingSessions(updatedSessions);
      } else if (activeTab === "active") {
        setActiveSessions(updatedSessions);
      }

      // Update current sessions display
      setSessions(updatedSessions);

      console.log("✅ [STAFF CHAT] Unread counts refreshed successfully");
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error refreshing unread counts:", error);
    }
  };

  // Handle session selection
  const handleSessionSelect = async (session) => {
    console.log("📱 [STAFF CHAT] Selecting session:", session.sessionId);

    // Reset unread count for the selected session
    resetUnreadCountForSession(session.sessionId);

    try {
      // If this is a WAITING session in the waiting tab, join it first
      if (session.status === "WAITING" && activeTab === "waiting") {
        console.log("🚀 [STAFF CHAT] Joining WAITING session...");
        const joinedSession = await chatAPIService.joinSession(
          session.sessionId
        );
        console.log(
          "✅ [STAFF CHAT] Session joined successfully:",
          joinedSession
        );

        // Send automatic greeting message when staff joins
        try {
          const staffName = currentUser?.name || "Nhân viên hỗ trợ";
          const greetingMessage = "Xin chào, tôi có thể giúp gì cho bạn?";

          console.log("📤 [STAFF CHAT] Sending automatic greeting message...");

          // Send greeting message via unified API
          const sentMessage = await unifiedChatAPI.sendMessage(
            session.sessionId,
            greetingMessage,
            staffName,
            true // isStaff = true
          );

          console.log(
            "✅ [STAFF CHAT] Greeting message sent successfully:",
            sentMessage
          );

          // Show success notification
          message.success(
            `Đã gửi tin nhắn chào hỏi tới ${session.customerName}`
          );

          // Refresh unread counts after sending greeting message
          setTimeout(() => {
            refreshUnreadCounts();
          }, 1000);
        } catch (error) {
          console.error(
            "❌ [STAFF CHAT] Failed to send greeting message:",
            error
          );
          message.error("Không thể gửi tin nhắn chào hỏi");
        }

        // Update selected session with joined session data
        setSelectedSession(joinedSession);
        message.success(`Đã tham gia chat với ${session.customerName}`);

        // Reload active tab to show the newly joined session
        setTimeout(() => {
          loadSessionsForTab("active");
        }, 500);
      } else {
        // Normal session selection - clear messages first
        console.log("🔄 [STAFF CHAT] Switching to session:", session.sessionId);

        // Clear previous messages immediately
        clearMessages();

        // Set selected session (this will trigger useRealTimeMessages to fetch new messages)
        setSelectedSession(session);
      }

      // Reset previous messages length to prevent unwanted scroll
      setPreviousMessagesLength(0);

      // On smaller screens, scroll to chat area smoothly
      setTimeout(() => {
        const chatArea = document.querySelector(".chat-card");
        if (chatArea && window.innerWidth < 768) {
          chatArea.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }

        // Focus input after selecting session (without scrolling)
        if (inputRef.current) {
          inputRef.current.focus({ preventScroll: true });
        }
      }, 200);
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error handling session selection:", error);
      message.error("Không thể tham gia chat session");
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedSession) return;

    const messageText = inputMessage;
    const sessionId = selectedSession.sessionId;
    const staffName = currentUser?.name || "Nhân viên hỗ trợ";

    // Clear input immediately for better UX
    setInputMessage("");

    try {
      // Send message via unified API
      await unifiedChatAPI.sendMessage(
        sessionId,
        messageText,
        staffName,
        true // isStaff = true
      );

      console.log("✅ [STAFF CHAT] Message sent successfully");

      // Trigger immediate refetch to get the sent message
      if (refetchMessages) {
        setTimeout(() => {
          refetchMessages();
        }, 500);
      }

      // Scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 100);

      // Refresh unread counts after sending message
      setTimeout(() => {
        refreshUnreadCounts();
      }, 1000); // Wait a bit longer to ensure message is processed

      // Update session's last message
      setSessions((prev) =>
        prev.map((session) =>
          session.sessionId === sessionId
            ? {
                ...session,
                lastMessage: messageText,
                lastMessageTime: new Date().toISOString(),
              }
            : session
        )
      );
    } catch (error) {
      console.error("❌ [STAFF CHAT] Error sending message:", error);
      message.error("Không thể gửi tin nhắn. Vui lòng thử lại.");

      // Restore input text on error
      setInputMessage(messageText);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Utility functions removed - not used in current implementation

  return (
    <div className="staff-chat-interface">
      {/* WebSocket Status Indicator */}
      <div style={{ marginBottom: "8px", textAlign: "right" }}>
        <Space>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Realtime:
          </Text>
          <Badge
            status={wsConnected ? "success" : "error"}
            text={wsConnected ? "Kết nối" : "Mất kết nối"}
            style={{ fontSize: "12px" }}
          />
        </Space>
      </div>

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
        style={{
          height: hideTabs ? "100%" : "calc(100% - 60px)",
          overflow: "hidden", // Prevent vertical scroll
        }}
      >
        {/* Sessions List */}
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={8}
          xl={8}
          style={{
            height: "100%",
            paddingBottom: selectedSession ? "8px" : "0", // Add space when chat is active
          }}
        >
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
            <div
              className="sessions-list-container"
              style={{
                maxHeight: "500px", // Giới hạn chiều cao
                overflowY: "auto", // Thêm scroll dọc
                overflowX: "hidden", // Ẩn scroll ngang
              }}
            >
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
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={16}
          xl={16}
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
              <div
                className="messages-container"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollBehavior: "smooth",
                }}
              >
                {messagesLoading ? (
                  <div
                    className="loading-messages"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Spin size="small" />
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      Đang tải tin nhắn...
                    </Text>
                  </div>
                ) : realTimeMessages.length === 0 ? (
                  <div
                    className="no-messages"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Text type="secondary">
                      Chưa có tin nhắn nào trong cuộc trò chuyện này
                    </Text>
                  </div>
                ) : (
                  realTimeMessages
                    .sort(
                      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                    )
                    .map((msg) => (
                      <div
                        key={`${msg.id}-${msg.senderType}`}
                        className={`message-item ${msg.senderType.toLowerCase()}`}
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
                        {/* Debug log */}
                        {console.log(`🎨 [STAFF CHAT] Message colors:`, {
                          senderType: msg.senderType,
                          avatarColor: getAvatarColor(msg.senderType),
                          bubbleStyle: getMessageBubbleStyle(msg.senderType),
                        })}
                        <div className="message-details" style={{ flex: 1 }}>
                          <div
                            className="message-header"
                            style={{ marginBottom: "4px" }}
                          >
                            <Text
                              strong
                              style={{ fontSize: "14px", color: "#333" }}
                            >
                              {msg.senderName}
                            </Text>
                            <Text
                              type="secondary"
                              style={{ fontSize: "12px", marginLeft: "8px" }}
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
                    ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <Divider style={{ margin: "16px 0" }} />

              {/* Input Area */}
              <div
                className="input-area chat-input-container"
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid #f0f0f0",
                  flexShrink: 0,
                }}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <TextArea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
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
