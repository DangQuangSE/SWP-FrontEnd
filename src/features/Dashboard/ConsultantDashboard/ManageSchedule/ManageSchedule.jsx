import React from 'react';
import { Card, Table, Button } from 'antd';
import { ScheduleOutlined } from '@ant-design/icons';
import './ManageSchedule.css';

const ManageSchedule = ({ setIsScheduleModalVisible, consultationColumns, personalConsultations }) => {
  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Quản lý lịch làm việc</span>
          <Button
            type="primary"
            icon={<ScheduleOutlined />}
            onClick={() => setIsScheduleModalVisible(true)}
          >
            Thêm/Sửa ca làm việc
          </Button>
        </div>
      }
    >
      <Table
        columns={consultationColumns}
        dataSource={personalConsultations}
        rowKey="id"
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};

export default ManageSchedule; 