import React from 'react';
import { Card, Button } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';
import './OnlineConsultation.css';

const OnlineConsultation = ({ setIsConsultationModalVisible }) => {
  return (
    <Card title="Tư vấn trực tuyến">
      <Button
        type="primary"
        icon={<SolutionOutlined />}
        onClick={() => setIsConsultationModalVisible(true)}
      >
        Bắt đầu tư vấn mới
      </Button>
      <p style={{ marginTop: "20px" }}>
        Thông tin các ca tư vấn đang diễn ra...
      </p>
    </Card>
  );
};

export default OnlineConsultation; 