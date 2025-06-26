import React from 'react';
import { Card, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import './ConsultationResults.css';

const ConsultationResults = ({ setIsResultModalVisible }) => {
  return (
    <Card title="Gửi kết quả tư vấn">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => setIsResultModalVisible(true)}
      >
        Gửi kết quả mới
      </Button>
      <p style={{ marginTop: "20px" }}>Danh sách kết quả đã gửi...</p>
    </Card>
  );
};

export default ConsultationResults; 