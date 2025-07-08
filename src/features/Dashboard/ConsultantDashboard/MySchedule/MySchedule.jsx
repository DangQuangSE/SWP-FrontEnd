import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Space,
  Tag,
  Typography,
  Spin,
  Alert,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useMySchedule } from '../hooks/useMySchedule';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * MySchedule Component - Display consultant's appointments
 */
const MySchedule = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    fetchConfirmedAppointments,
    getAllAppointmentDetails,
    clearError,
    refresh
  } = useMySchedule();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Load today's appointments on component mount
  useEffect(() => {
    fetchTodayAppointments();
  }, [fetchTodayAppointments]);

  /**
   * Handle filter change
   */
  const handleFilterChange = () => {
    const date = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
    fetchAppointments(date, selectedStatus);
  };

  /**
   * Handle quick filter buttons
   */
  const handleQuickFilter = (type) => {
    switch (type) {
      case 'today':
        setSelectedDate(dayjs());
        setSelectedStatus(null);
        fetchTodayAppointments();
        break;
      case 'confirmed':
        setSelectedStatus('CONFIRMED');
        fetchConfirmedAppointments(selectedDate?.format('YYYY-MM-DD'));
        break;
      case 'all':
        setSelectedDate(null);
        setSelectedStatus(null);
        fetchAppointments();
        break;
      default:
        break;
    }
  };

  /**
   * Get status color for Tag
   */
  const getStatusColor = (status) => {
    const colors = {
      'CONFIRMED': 'green',
      'PENDING': 'orange',
      'CANCELLED': 'red',
      'COMPLETED': 'blue'
    };
    return colors[status] || 'default';
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  /**
   * Table columns for appointment details
   */
  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Slot Time',
      dataIndex: 'slotTime',
      key: 'slotTime',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          {dayjs(time).format('HH:mm DD/MM/YYYY')}
        </Space>
      )
    },
    {
      title: 'Consultant',
      dataIndex: 'consultantName',
      key: 'consultantName',
      render: (name, record) => (
        <Space>
          <UserOutlined />
          {name || `ID: ${record.consultantId}`}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Medical Result',
      dataIndex: 'medicalResult',
      key: 'medicalResult',
      render: (result) => result || <Text type="secondary">Not available</Text>
    }
  ];

  // Get all appointment details for table
  const appointmentDetails = getAllAppointmentDetails();

  // Calculate statistics
  const totalAppointments = appointments.length;
  const confirmedCount = appointments.filter(apt => apt.status === 'CONFIRMED').length;
  const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.price || 0), 0);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <CalendarOutlined /> My Schedule
      </Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Appointments"
              value={totalAppointments}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Confirmed"
              value={confirmedCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Details Count"
              value={appointmentDetails.length}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Filters:</Text>
          </Col>
          <Col>
            <DatePicker
              placeholder="Select date"
              value={selectedDate}
              onChange={setSelectedDate}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col>
            <Select
              placeholder="Select status"
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="PENDING">Pending</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={handleFilterChange}>
              Apply Filters
            </Button>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              Refresh
            </Button>
          </Col>
        </Row>

        <Row gutter={8} style={{ marginTop: 16 }}>
          <Col>
            <Text>Quick filters:</Text>
          </Col>
          <Col>
            <Button size="small" onClick={() => handleQuickFilter('today')}>
              Today
            </Button>
          </Col>
          <Col>
            <Button size="small" onClick={() => handleQuickFilter('confirmed')}>
              Confirmed Only
            </Button>
          </Col>
          <Col>
            <Button size="small" onClick={() => handleQuickFilter('all')}>
              All Appointments
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={clearError}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Appointments Table */}
      <Card title="Appointment Details">
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={appointmentDetails}
            rowKey={(record) => `${record.appointmentId}-${record.id}`}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} appointment details`
            }}
            scroll={{ x: 800 }}
          />
        </Spin>

        {/* Summary */}
        <div style={{ marginTop: 16, textAlign: 'center', color: '#666' }}>
          <Text>
            Showing {appointmentDetails.length} appointment details from {totalAppointments} appointments
            {selectedDate && ` for ${selectedDate.format('DD/MM/YYYY')}`}
            {selectedStatus && ` with status: ${selectedStatus}`}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MySchedule;
