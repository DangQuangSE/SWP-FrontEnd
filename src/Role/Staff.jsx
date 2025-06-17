import React, { useState } from 'react';
import './Staff.css';
import { 
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Tabs,
  List,
  Typography,
  Row,
  Col,
  Tag,
  Space
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

function Staff() {
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isQAModalVisible, setIsQAModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data - Replace with actual API calls
  const appointments = [
    { 
      id: 1, 
      customer: 'John Doe', 
      room: 'Room 101', 
      consultant: 'Dr. Smith', 
      time: '10:00 AM', 
      status: 'Confirmed',
      date: '2024-03-20'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      room: 'Room 102', 
      consultant: 'Dr. Johnson', 
      time: '11:30 AM', 
      status: 'Pending',
      date: '2024-03-20'
    },
  ];

  const consultantSchedule = [
    { 
      id: 1, 
      consultant: 'Dr. Smith', 
      date: '2024-03-20', 
      slots: ['9:00 AM', '10:00 AM', '11:00 AM'] 
    },
    { 
      id: 2, 
      consultant: 'Dr. Johnson', 
      date: '2024-03-20', 
      slots: ['9:30 AM', '10:30 AM', '11:30 AM'] 
    },
  ];

  const customerProfiles = [
    { 
      id: 1, 
      name: 'John Doe', 
      medicalHistory: 'Hypertension', 
      lastVisit: '2024-02-15' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      medicalHistory: 'Diabetes', 
      lastVisit: '2024-03-01' 
    },
  ];

  const appointmentColumns = [
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'Consultant',
      dataIndex: 'consultant',
      key: 'consultant',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Confirmed' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} size="small">
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateAppointment = () => {
    setIsAppointmentModalVisible(true);
  };

  const handleCreateQA = () => {
    setIsQAModalVisible(true);
  };

  const handleAppointmentModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      setIsAppointmentModalVisible(false);
      form.resetFields();
    });
  };

  const handleQAModalOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      setIsQAModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <Layout className="staff-layout">
      <Header className="staff-header">
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Staff Dashboard
        </Title>
      </Header>
      <Content className="staff-content">
        <Tabs defaultActiveKey="1">
          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                Appointments
              </span>
            } 
            key="1"
          >
            <Card
              title="Appointments"
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateAppointment}
                >
                  Create Appointment
                </Button>
              }
            >
              <Table 
                columns={appointmentColumns} 
                dataSource={appointments}
                rowKey="id"
              />
            </Card>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                Consultant Schedule
              </span>
            } 
            key="2"
          >
            <Row gutter={[16, 16]}>
              {consultantSchedule.map((schedule) => (
                <Col xs={24} md={12} key={schedule.id}>
                  <Card title={schedule.consultant}>
                    <p><strong>Date:</strong> {schedule.date}</p>
                    <p><strong>Available Slots:</strong></p>
                    <Space wrap>
                      {schedule.slots.map((slot, index) => (
                        <Tag key={index} color="blue">{slot}</Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <UserOutlined />
                Customer Profiles
              </span>
            } 
            key="3"
          >
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={customerProfiles}
              renderItem={(profile) => (
                <List.Item>
                  <Card
                    title={profile.name}
                    extra={
                      <Button type="primary" icon={<EyeOutlined />}>
                        View Details
                      </Button>
                    }
                  >
                    <p><strong>Medical History:</strong> {profile.medicalHistory}</p>
                    <p><strong>Last Visit:</strong> {profile.lastVisit}</p>
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <QuestionCircleOutlined />
                Q&A
              </span>
            } 
            key="4"
          >
            <Card
              title="Customer Q&A"
              extra={
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateQA}
                >
                  New Q&A
                </Button>
              }
            >
              <List
                itemLayout="horizontal"
                dataSource={[
                  {
                    title: 'Question about appointment scheduling',
                    customer: 'John Doe',
                    status: 'Pending'
                  }
                ]}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button type="primary" size="small">
                        Respond
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={`Customer: ${item.customer} | Status: ${item.status}`}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
        </Tabs>

        {/* Create Appointment Modal */}
        <Modal
          title="Create New Appointment"
          visible={isAppointmentModalVisible}
          onOk={handleAppointmentModalOk}
          onCancel={() => setIsAppointmentModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="customer"
              label="Customer Name"
              rules={[{ required: true, message: 'Please input customer name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="consultant"
              label="Consultant"
              rules={[{ required: true, message: 'Please input consultant name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: 'Please select time!' }]}
            >
              <TimePicker style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Create Q&A Modal */}
        <Modal
          title="New Q&A"
          visible={isQAModalVisible}
          onOk={handleQAModalOk}
          onCancel={() => setIsQAModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="customer"
              label="Customer Name"
              rules={[{ required: true, message: 'Please input customer name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: 'Please input your question!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default Staff;