import React from 'react';
import { Card, Table } from 'antd';
// import { EyeOutlined } from '@ant-design/icons';
import './ViewFeedback.css';

const feedback = [
    {
      id: 1,
      source: "Blog: Cảm lạnh thông thường",
      comment: "Bài viết rất hữu ích!",
      date: "2024-03-21",
    },
    {
      id: 2,
      source: "Dịch vụ: Tư vấn trực tuyến",
      comment: "Tư vấn rất tốt, cảm ơn bác sĩ.",
      date: "2024-03-22",
    },
  ];

// const feedbackColumns = [
//   { title: "Nguồn", dataIndex: "source", key: "source" },
//   { title: "Nội dung", dataIndex: "comment", key: "comment" },
//   { title: "Ngày", dataIndex: "date", key: "date" },
//   {
//     title: "Thao tác",
//     key: "action",
//     render: (_, record) => (
//       <Button icon={<EyeOutlined />} size="small">
//         Xem
//       </Button>
//     ),
//   },
// ];

const ViewFeedback = () => {
    return (
        <Card title="Xem phản hồi/nhận xét">
            <Table
            // columns={feedbackColumns}
            dataSource={feedback}
            rowKey="id"
            />
        </Card>
    );
};

export default ViewFeedback; 