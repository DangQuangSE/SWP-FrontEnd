import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider, message, List, Badge } from 'antd';
import { MessageOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons';
import chatAPIService from './chatAPI.js';
import unifiedChatAPI from '../../../Chat/unifiedChatAPI.js';

const { Text, Title } = Typography;

/**
 * Test component để verify tính năng refresh unread count sau khi gửi tin nhắn
 */
const RefreshUnreadCountTest = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testMessage, setTestMessage] = useState("Test message from staff");

  // Fetch active sessions
  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      console.log("🔍 [TEST] Fetching active sessions...");
      
      const activeSessions = await chatAPIService.getChatSessions("ACTIVE");
      console.log("📋 [TEST] Active sessions:", activeSessions);
      
      // Fetch unread counts for each session
      const sessionsWithUnread = await Promise.all(
        activeSessions.map(async (session) => {
          try {
            const unreadCount = await chatAPIService.getUnreadCount(
              session.sessionId,
              "Nhân viên hỗ trợ"
            );
            return {
              ...session,
              unreadCount: unreadCount || 0
            };
          } catch (error) {
            console.error(`Error getting unread count for ${session.sessionId}:`, error);
            return {
              ...session,
              unreadCount: 0
            };
          }
        })
      );
      
      setSessions(sessionsWithUnread);
      console.log("✅ [TEST] Sessions with unread counts:", sessionsWithUnread);
      
    } catch (error) {
      console.error("❌ [TEST] Error fetching sessions:", error);
      message.error("Lỗi khi tải danh sách sessions");
    } finally {
      setLoading(false);
    }
  };

  // Send test message
  const sendTestMessage = async () => {
    if (!selectedSession) {
      message.warning("Vui lòng chọn session trước");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 [TEST] Sending test message...");
      
      // Send message via unified API
      await unifiedChatAPI.sendMessage(
        selectedSession.sessionId,
        testMessage,
        "Nhân viên hỗ trợ",
        true // isStaff = true
      );
      
      console.log("✅ [TEST] Message sent successfully");
      message.success("Tin nhắn đã được gửi");
      
      // Wait a bit then refresh unread counts
      setTimeout(async () => {
        console.log("🔄 [TEST] Refreshing unread counts...");
        await fetchActiveSessions();
        message.info("Đã refresh unread counts");
      }, 1500);
      
    } catch (error) {
      console.error("❌ [TEST] Error sending message:", error);
      message.error("Lỗi khi gửi tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  // Load sessions on mount
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  return (
    <Card
      title={
        <Space>
          <MessageOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Refresh Unread Count Test
          </Title>
        </Space>
      }
      extra={
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchActiveSessions}
          loading={loading}
        >
          Refresh Sessions
        </Button>
      }
      style={{ margin: '16px' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Instructions */}
        <div>
          <Text strong>Test Instructions:</Text>
          <ol style={{ marginTop: '8px' }}>
            <li>Chọn một session từ danh sách</li>
            <li>Click "Send Test Message" để gửi tin nhắn</li>
            <li>Quan sát unread count có được refresh không</li>
            <li>Kiểm tra console logs để xem chi tiết</li>
          </ol>
        </div>

        <Divider />

        {/* Test Message Input */}
        <div>
          <Text strong>Test Message:</Text>
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}
              placeholder="Enter test message..."
            />
          </div>
        </div>

        {/* Selected Session */}
        {selectedSession && (
          <div>
            <Text strong>Selected Session:</Text>
            <div style={{ 
              marginTop: '8px', 
              padding: '12px', 
              background: '#f0f2f5', 
              borderRadius: '6px' 
            }}>
              <Text>Session ID: <Text code>{selectedSession.sessionId}</Text></Text>
              <br />
              <Text>Customer: <Text strong>{selectedSession.customerName}</Text></Text>
              <br />
              <Text>Current Unread Count: <Badge count={selectedSession.unreadCount} /></Text>
            </div>
          </div>
        )}

        {/* Send Button */}
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendTestMessage}
          loading={loading}
          disabled={!selectedSession || !testMessage.trim()}
          size="large"
        >
          Send Test Message
        </Button>

        <Divider />

        {/* Sessions List */}
        <div>
          <Text strong>Active Sessions ({sessions.length}):</Text>
          <List
            style={{ marginTop: '8px' }}
            dataSource={sessions}
            renderItem={(session) => (
              <List.Item
                key={session.sessionId}
                onClick={() => setSelectedSession(session)}
                style={{
                  cursor: 'pointer',
                  padding: '12px',
                  border: selectedSession?.sessionId === session.sessionId 
                    ? '2px solid #1890ff' 
                    : '1px solid #f0f0f0',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  backgroundColor: selectedSession?.sessionId === session.sessionId 
                    ? '#e6f7ff' 
                    : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <Text strong>{session.customerName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {session.sessionId}
                    </Text>
                  </div>
                  <Badge count={session.unreadCount} />
                </div>
              </List.Item>
            )}
            locale={{ emptyText: 'Không có session nào' }}
          />
        </div>

        {/* Expected Behavior */}
        <div>
          <Text strong>Expected Behavior:</Text>
          <ul style={{ marginTop: '8px' }}>
            <li>Sau khi gửi tin nhắn, unread count sẽ được refresh tự động</li>
            <li>Unread count có thể tăng hoặc giảm tùy thuộc vào logic backend</li>
            <li>Console sẽ hiển thị logs chi tiết về quá trình refresh</li>
            <li>Badge sẽ cập nhật ngay lập tức sau khi refresh</li>
          </ul>
        </div>
      </Space>
    </Card>
  );
};

export default RefreshUnreadCountTest;
