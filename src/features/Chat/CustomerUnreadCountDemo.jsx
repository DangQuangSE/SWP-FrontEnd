import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Typography, Space, Divider, message } from 'antd';
import { MessageOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons';
import { customerChatAPI } from './customerChatAPI';

const { Text, Title } = Typography;

/**
 * Demo component để test tính năng unread count cho customer
 */
const CustomerUnreadCountDemo = () => {
  const [sessionId, setSessionId] = useState(null);
  const [customerName, setCustomerName] = useState("Demo Customer");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Simulate creating a chat session
  const createDemoSession = async () => {
    try {
      setLoading(true);
      message.info("Đang tạo demo session...");
      
      // This would normally call the chat start API
      const demoSessionId = `demo_${Date.now()}`;
      setSessionId(demoSessionId);
      
      message.success(`Demo session created: ${demoSessionId}`);
    } catch (error) {
      console.error("Error creating demo session:", error);
      message.error("Lỗi khi tạo demo session");
    } finally {
      setLoading(false);
    }
  };

  // Test fetch unread count
  const testFetchUnreadCount = async () => {
    if (!sessionId) {
      message.warning("Vui lòng tạo session trước");
      return;
    }

    try {
      setLoading(true);
      console.log("🧪 [DEMO] Testing unread count API...");
      
      const count = await customerChatAPI.getUnreadCount(sessionId, customerName);
      setUnreadCount(count);
      
      message.success(`Unread count: ${count}`);
      console.log("✅ [DEMO] Unread count fetched:", count);
    } catch (error) {
      console.error("❌ [DEMO] Error fetching unread count:", error);
      message.error("Lỗi khi lấy unread count");
    } finally {
      setLoading(false);
    }
  };

  // Simulate receiving a new message (increment unread count)
  const simulateNewMessage = () => {
    const newCount = unreadCount + 1;
    setUnreadCount(newCount);
    localStorage.setItem('chat_unread_count', newCount.toString());
    message.info(`Simulated new message - Unread count: ${newCount}`);
  };

  // Simulate reading messages (reset unread count)
  const simulateReadMessages = () => {
    setUnreadCount(0);
    localStorage.setItem('chat_unread_count', '0');
    message.success("Simulated reading messages - Unread count reset");
  };

  // Load unread count from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_unread_count');
    if (saved) {
      setUnreadCount(parseInt(saved, 10));
    }
  }, []);

  return (
    <Card
      title={
        <Space>
          <MessageOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Customer Unread Count Demo
          </Title>
        </Space>
      }
      style={{ margin: '16px', maxWidth: '600px' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Session Info */}
        <div>
          <Text strong>Session Info:</Text>
          <div style={{ marginTop: '8px' }}>
            <Text>Customer Name: <Text code>{customerName}</Text></Text>
            <br />
            <Text>Session ID: <Text code>{sessionId || 'Not created'}</Text></Text>
          </div>
        </div>

        <Divider />

        {/* Unread Count Display */}
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Current Unread Count</Title>
          <Badge 
            count={unreadCount} 
            style={{
              backgroundColor: '#ff4d4f',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '24px',
              minWidth: '60px',
              height: '60px',
              lineHeight: '60px',
              borderRadius: '30px',
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            showZero={true}
          />
        </div>

        <Divider />

        {/* Control Buttons */}
        <Space wrap style={{ width: '100%', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={createDemoSession}
            loading={loading}
          >
            Create Demo Session
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={testFetchUnreadCount}
            loading={loading}
            disabled={!sessionId}
          >
            Fetch Unread Count
          </Button>

          <Button
            icon={<SendOutlined />}
            onClick={simulateNewMessage}
            type="dashed"
          >
            Simulate New Message
          </Button>

          <Button
            onClick={simulateReadMessages}
            type="default"
          >
            Simulate Read Messages
          </Button>
        </Space>

        <Divider />

        {/* Instructions */}
        <div>
          <Text strong>Instructions:</Text>
          <ul style={{ marginTop: '8px' }}>
            <li>Click "Create Demo Session" to create a test session</li>
            <li>Click "Fetch Unread Count" to test the API call</li>
            <li>Click "Simulate New Message" to increment unread count</li>
            <li>Click "Simulate Read Messages" to reset unread count</li>
            <li>Unread count is persisted in localStorage</li>
          </ul>
        </div>

        {/* LocalStorage Info */}
        <div>
          <Text strong>LocalStorage:</Text>
          <div style={{ marginTop: '8px' }}>
            <Text code>
              chat_unread_count: {localStorage.getItem('chat_unread_count') || '0'}
            </Text>
          </div>
        </div>
      </Space>
    </Card>
  );
};

export default CustomerUnreadCountDemo;
