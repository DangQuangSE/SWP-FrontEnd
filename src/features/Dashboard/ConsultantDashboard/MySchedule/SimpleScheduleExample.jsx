import React, { useEffect, useState } from 'react';
import { Card, List, Button, DatePicker, Select, Space, Tag, Typography, Spin } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useMySchedule } from '../hooks/useMySchedule';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Simple example component showing how to use the MySchedule API
 */
const SimpleScheduleExample = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    getAllAppointmentDetails
  } = useMySchedule();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('CONFIRMED');

  // Load today's confirmed appointments on mount
  useEffect(() => {
    fetchTodayAppointments('CONFIRMED');
  }, [fetchTodayAppointments]);

  /**
   * Handle search button click
   */
  const handleSearch = () => {
    const date = selectedDate ? selectedDate.format('YYYY-MM-DD') : null;
    fetchAppointments(date, selectedStatus);
  };

  /**
   * Get status color
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

  // Get all appointment details
  const appointmentDetails = getAllAppointmentDetails();

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>
        <CalendarOutlined /> Simple Schedule Example
      </Title>

      {/* Search Controls */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <DatePicker
            placeholder="Select date"
            value={selectedDate}
            onChange={setSelectedDate}
            format="YYYY-MM-DD"
          />
          
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
          >
            <Option value={null}>All Status</Option>
            <Option value="CONFIRMED">Confirmed</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="CANCELLED">Cancelled</Option>
            <Option value="COMPLETED">Completed</Option>
          </Select>
          
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Search Appointments
          </Button>
          
          <Button onClick={() => fetchTodayAppointments('CONFIRMED')}>
            Today's Confirmed
          </Button>
        </Space>
      </Card>

      {/* Error Display */}
      {error && (
        <Card style={{ marginBottom: 16, borderColor: '#ff4d4f' }}>
          <Text type="danger">Error: {error}</Text>
        </Card>
      )}

      {/* Results */}
      <Card title={`Appointments (${appointments.length})`}>
        <Spin spinning={loading}>
          {appointments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <CalendarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
              <div>No appointments found</div>
            </div>
          ) : (
            <List
              dataSource={appointments}
              renderItem={(appointment) => (
                <List.Item key={appointment.id}>
                  <Card 
                    size="small" 
                    style={{ width: '100%' }}
                    title={
                      <Space>
                        <Text strong>Appointment #{appointment.id}</Text>
                        <Tag color={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Tag>
                      </Space>
                    }
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <Text strong>Date: </Text>
                      <Text>{appointment.preferredDate}</Text>
                      <br />
                      <Text strong>Price: </Text>
                      <Text>{appointment.price?.toLocaleString('vi-VN')} VND</Text>
                      <br />
                      {appointment.note && (
                        <>
                          <Text strong>Note: </Text>
                          <Text>{appointment.note}</Text>
                          <br />
                        </>
                      )}
                      <Text strong>Customer: </Text>
                      <Text>{appointment.customerName || 'N/A'}</Text>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <Text strong>Services:</Text>
                      <List
                        size="small"
                        dataSource={appointment.appointmentDetails || []}
                        renderItem={(detail) => (
                          <List.Item key={detail.id} style={{ padding: '8px 0' }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <div>
                                <Text strong>{detail.serviceName}</Text>
                                <Tag color={getStatusColor(detail.status)} style={{ marginLeft: 8 }}>
                                  {detail.status}
                                </Tag>
                              </div>
                              <div>
                                <ClockCircleOutlined style={{ marginRight: 8 }} />
                                <Text>{dayjs(detail.slotTime).format('HH:mm DD/MM/YYYY')}</Text>
                              </div>
                              {detail.consultantName && (
                                <div>
                                  <Text type="secondary">Consultant: {detail.consultantName}</Text>
                                </div>
                              )}
                              {detail.medicalResult && (
                                <div>
                                  <Text type="secondary">Result: {detail.medicalResult}</Text>
                                </div>
                              )}
                            </Space>
                          </List.Item>
                        )}
                      />
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>

      {/* Summary */}
      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Summary</Title>
        <div>
          <Text>Total Appointments: <Text strong>{appointments.length}</Text></Text>
          <br />
          <Text>Total Services: <Text strong>{appointmentDetails.length}</Text></Text>
          <br />
          <Text>
            Total Revenue: <Text strong>
              {appointments.reduce((sum, apt) => sum + (apt.price || 0), 0).toLocaleString('vi-VN')} VND
            </Text>
          </Text>
        </div>
      </Card>

      {/* API Usage Example */}
      <Card style={{ marginTop: 16 }} title="API Usage Example">
        <pre style={{ background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
{`// Import the hook
import { useMySchedule } from '../hooks/useMySchedule';

// Use in component
const { 
  appointments, 
  loading, 
  error, 
  fetchAppointments,
  fetchTodayAppointments 
} = useMySchedule();

// Fetch today's appointments
fetchTodayAppointments('CONFIRMED');

// Fetch by date and status
fetchAppointments('2025-07-02', 'CONFIRMED');

// Access data
appointments.forEach(apt => {
  console.log(apt.serviceName, apt.slotTime);
});`}
        </pre>
      </Card>
    </div>
  );
};

export default SimpleScheduleExample;
