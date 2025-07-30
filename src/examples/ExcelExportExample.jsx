import React, { useState } from 'react';
import { Button, Space, Card, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { 
  exportAppointmentsToExcel,
  exportServicesToExcel,
  exportUsersToExcel,
  exportFinancialToExcel
} from '../utils/excelExport';

const { Title, Paragraph } = Typography;

/**
 * Example component showing how to use Excel export utilities
 */
const ExcelExportExample = () => {
  const [loading, setLoading] = useState({
    appointments: false,
    services: false,
    users: false,
    financial: false
  });

  // Sample data
  const sampleAppointments = [
    {
      customerName: "Nguyễn Văn A",
      serviceName: "Tư vấn sức khỏe",
      slotTime: "2024-01-15 10:00",
      status: "COMPLETED",
      created_at: "2024-01-10T08:00:00Z",
      servicePrice: 500000,
      note: "Khách hàng hài lòng"
    },
    {
      customerName: "Trần Thị B", 
      serviceName: "Khám tổng quát",
      slotTime: "2024-01-16 14:30",
      status: "CONFIRMED",
      created_at: "2024-01-12T10:30:00Z",
      servicePrice: 800000,
      note: ""
    }
  ];

  const sampleServices = [
    {
      name: "Tư vấn sức khỏe",
      type: "CONSULTING",
      price: 500000,
      description: "Tư vấn về sức khỏe tổng quát",
      isActive: true
    },
    {
      name: "Khám tổng quát",
      type: "EXAMINATION", 
      price: 800000,
      description: "Khám sức khỏe tổng quát",
      isActive: true
    }
  ];

  const sampleUsers = [
    {
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0123456789",
      role: "CUSTOMER",
      gender: "MALE",
      createdAt: "2024-01-01T00:00:00Z",
      isActive: true
    },
    {
      name: "Trần Thị B",
      email: "tranthib@email.com", 
      phone: "0987654321",
      role: "CONSULTANT",
      gender: "FEMALE",
      createdAt: "2024-01-02T00:00:00Z",
      isActive: true
    }
  ];

  const sampleFinancialData = {
    summary: {
      totalRevenue: 10000000,
      monthRevenue: 2000000,
      todayRevenue: 100000,
      totalTransactions: 50
    },
    monthlyRevenue: [
      { month: 1, year: 2024, revenue: 2000000, transactionCount: 15 },
      { month: 2, year: 2024, revenue: 2500000, transactionCount: 18 },
      { month: 3, year: 2024, revenue: 1800000, transactionCount: 12 }
    ]
  };

  const handleExport = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      switch (type) {
        case 'appointments':
          await exportAppointmentsToExcel(sampleAppointments, "Danh sách lịch hẹn mẫu");
          break;
        case 'services':
          await exportServicesToExcel(sampleServices, "Danh sách dịch vụ mẫu");
          break;
        case 'users':
          await exportUsersToExcel(sampleUsers, "Danh sách người dùng mẫu");
          break;
        case 'financial':
          await exportFinancialToExcel(sampleFinancialData, "Báo cáo tài chính mẫu");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Export ${type} failed:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Excel Export Examples</Title>
      <Paragraph>
        Các ví dụ sử dụng thư viện xuất Excel với dữ liệu mẫu.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Xuất danh sách lịch hẹn" size="small">
          <Paragraph>
            Xuất {sampleAppointments.length} lịch hẹn mẫu với thông tin khách hàng, dịch vụ, thời gian và trạng thái.
          </Paragraph>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading.appointments}
            onClick={() => handleExport('appointments')}
          >
            {loading.appointments ? "Đang xuất..." : "Xuất lịch hẹn"}
          </Button>
        </Card>

        <Card title="Xuất danh sách dịch vụ" size="small">
          <Paragraph>
            Xuất {sampleServices.length} dịch vụ mẫu với thông tin tên, loại, giá và mô tả.
          </Paragraph>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading.services}
            onClick={() => handleExport('services')}
          >
            {loading.services ? "Đang xuất..." : "Xuất dịch vụ"}
          </Button>
        </Card>

        <Card title="Xuất danh sách người dùng" size="small">
          <Paragraph>
            Xuất {sampleUsers.length} người dùng mẫu với thông tin cá nhân và vai trò.
          </Paragraph>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading.users}
            onClick={() => handleExport('users')}
          >
            {loading.users ? "Đang xuất..." : "Xuất người dùng"}
          </Button>
        </Card>

        <Card title="Xuất báo cáo tài chính" size="small">
          <Paragraph>
            Xuất báo cáo tài chính với tổng quan và doanh thu theo tháng.
          </Paragraph>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={loading.financial}
            onClick={() => handleExport('financial')}
          >
            {loading.financial ? "Đang xuất..." : "Xuất báo cáo"}
          </Button>
        </Card>
      </Space>
    </div>
  );
};

export default ExcelExportExample;
