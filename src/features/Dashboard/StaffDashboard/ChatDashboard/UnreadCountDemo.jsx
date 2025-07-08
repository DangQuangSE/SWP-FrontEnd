import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, List, Typography, Space, Spin, message } from 'antd';
import { MessageOutlined, ReloadOutlined } from '@ant-design/icons';
import chatAPIService from './chatAPI.js';

const { Text, Title } = Typography;

/**
 * Demo component để test tính năng unread count
 * Component này hiển thị danh sách sessions với unread count
 */
const UnreadCountDemo = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [staffName] = useState("Nhân viên hỗ trợ");

  // Fetch sessions với unread count
  const fetchSessionsWithUnreadCount = async () => {
    try {
      setLoading(true);
      console.log("🚀 [DEMO] Fetching active sessions...");
      
      // Lấy danh sách active sessions
      const activeSessions = await chatAPIService.getChatSessions("ACTIVE");
      console.log("📋 [DEMO] Active sessions:", activeSessions);
      
      if (activeSessions.length === 0) {
        setSessions([]);
        message.info("Không có session nào đang hoạt động");
        return;
      }
      
      // Fetch unread count cho từng session
      const sessionsWithUnreadCount = await Promise.all(
        activeSessions.map(async (session) => {
          try {
            const unreadCount = await chatAPIService.getUnreadCount(session.sessionId, staffName);
            return {
              ...session,
              unreadCount: unreadCount || 0
            };
          } catch (error) {
            console.error(`❌ [DEMO] Error fetching unread count for ${session.sessionId}:`, error);
            return {
              ...session,
              unreadCount: 0
            };
          }
        })
      );
      
      console.log("✅ [DEMO] Sessions with unread count:", sessionsWithUnreadCount);
      setSessions(sessionsWithUnreadCount);
      
    } catch (error) {
      console.error("❌ [DEMO] Error:", error);
      message.error("Lỗi khi tải danh sách sessions");
    } finally {
      setLoading(false);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchSessionsWithUnreadCount();
  }, []);

  // Render session item
  const renderSessionItem = (session) => (
    <List.Item
      key={session.sessionId}
      style={{
        padding: '12px 16px',
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        marginBottom: '8px',
        backgroundColor: session.unreadCount > 0 ? '#fff7e6' : '#ffffff'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ flex: 1 }}>
          <Space direction="vertical" size={4}>
            <Text strong style={{ fontSize: '14px' }}>
              {session.customerName}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Session ID: {session.sessionId}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Status: {session.status}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Updated: {session.updatedAt ? new Date(session.updatedAt).toLocaleString('vi-VN') : 'N/A'}
            </Text>
          </Space>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge 
            count={session.unreadCount} 
            style={{ 
              backgroundColor: session.unreadCount > 0 ? '#ff4d4f' : '#d9d9d9',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              console.log("🔍 [DEMO] Session clicked:", session);
              message.info(`Clicked session: ${session.customerName} (${session.unreadCount} unread)`);
            }}
          >
            View
          </Button>
        </div>
      </div>
    </List.Item>
  );

  return (
    <Card
      title={
        <Space>
          <MessageOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Unread Count Demo
          </Title>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchSessionsWithUnreadCount}
          loading={loading}
        >
          Refresh
        </Button>
      }
      style={{ margin: '16px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text type="secondary">
          Staff Name: <Text strong>{staffName}</Text>
        </Text>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text type="secondary">Đang tải unread count...</Text>
          </div>
        </div>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">Không có session nào đang hoạt động</Text>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>
              Tổng số sessions: {sessions.length} | 
              Sessions có tin nhắn chưa đọc: {sessions.filter(s => s.unreadCount > 0).length}
            </Text>
          </div>
          
          <List
            dataSource={sessions}
            renderItem={renderSessionItem}
            style={{ maxHeight: '500px', overflowY: 'auto' }}
          />
        </div>
      )}
    </Card>
  );
};

export default UnreadCountDemo;
