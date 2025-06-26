import React from 'react';
import { Card, Table } from 'antd';
import './PersonalSchedule.css';

const PersonalSchedule = ({ consultationColumns, personalConsultations }) => {
  return (
    <Card title="Lịch tư vấn cá nhân">
      <Table
        columns={consultationColumns}
        dataSource={personalConsultations}
        rowKey="id"
      />
    </Card>
  );
};

export default PersonalSchedule;