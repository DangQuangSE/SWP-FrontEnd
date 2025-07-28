import React from 'react';
import { Card, Typography, Space, Tag, Divider } from 'antd';
import { 
  SettingOutlined, 
  CheckCircleOutlined, 
  InfoCircleOutlined,
  BulbOutlined 
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ConfigDemo = () => {
  const demoConfigs = [
    {
      name: 'MAX_BOOKING',
      value: 6,
      description: 'Số lượng booking tối đa mỗi slot thời gian',
      type: 'Booking System',
      status: 'active'
    },
    {
      name: 'MIN_BOOKING_TIME',
      value: 30,
      description: 'Thời gian tối thiểu trước khi có thể booking (phút)',
      type: 'Booking System', 
      status: 'active'
    },
    {
      name: 'SESSION_TIMEOUT',
      value: 3600,
      description: 'Thời gian timeout session (giây)',
      type: 'Security',
      status: 'active'
    },
    {
      name: 'MAX_FILE_SIZE',
      value: 10,
      description: 'Kích thước file upload tối đa (MB)',
      type: 'File Upload',
      status: 'active'
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      'Booking System': 'blue',
      'Security': 'red',
      'File Upload': 'green',
      'Email': 'orange',
      'Payment': 'purple'
    };
    return colors[type] || 'default';
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <SettingOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2}>Config Management Demo</Title>
          <Paragraph>
            Đây là demo cho module Quản lý Cấu hình chung. Module này cho phép admin quản lý các tham số hệ thống.
          </Paragraph>
        </div>

        <Divider />

        <Title level={3}>
          <BulbOutlined style={{ color: '#faad14' }} /> Tính năng chính
        </Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>CRUD Operations:</Text> Tạo, đọc, cập nhật, xóa cấu hình
          </div>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>Validation:</Text> Kiểm tra dữ liệu đầu vào
          </div>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>Real-time Updates:</Text> Cập nhật ngay lập tức
          </div>
          <div>
            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
            <Text strong>Responsive UI:</Text> Giao diện thân thiện trên mọi thiết bị
          </div>
        </Space>
      </Card>

      <Card title={
        <span>
          <InfoCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          Ví dụ các cấu hình hệ thống
        </span>
      }>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {demoConfigs.map((config, index) => (
            <Card 
              key={index}
              size="small" 
              style={{ 
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                background: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                      {config.name}
                    </Text>
                    <Tag 
                      color={getTypeColor(config.type)} 
                      style={{ marginLeft: '8px' }}
                    >
                      {config.type}
                    </Tag>
                  </div>
                  <Paragraph style={{ margin: 0, color: '#666' }}>
                    {config.description}
                  </Paragraph>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    background: '#e6f7ff', 
                    padding: '4px 12px', 
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    color: '#1890ff',
                    fontSize: '18px'
                  }}>
                    {config.value}
                  </div>
                  <Tag color="green" style={{ marginTop: '4px' }}>
                    {config.status}
                  </Tag>
                </div>
              </div>
            </Card>
          ))}
        </Space>
      </Card>

      <Card style={{ marginTop: '24px' }}>
        <Title level={4}>API Endpoints</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Tag color="green">POST</Tag>
            <Text code>/api/config</Text>
            <Text style={{ marginLeft: '16px' }}>Tạo cấu hình mới</Text>
          </div>
          <div>
            <Tag color="blue">GET</Tag>
            <Text code>/api/config</Text>
            <Text style={{ marginLeft: '16px' }}>Lấy tất cả cấu hình</Text>
          </div>
          <div>
            <Tag color="orange">PUT</Tag>
            <Text code>/api/config/{'{id}'}</Text>
            <Text style={{ marginLeft: '16px' }}>Cập nhật cấu hình</Text>
          </div>
          <div>
            <Tag color="red">DELETE</Tag>
            <Text code>/api/config/{'{id}'}</Text>
            <Text style={{ marginLeft: '16px' }}>Xóa cấu hình</Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ConfigDemo;
