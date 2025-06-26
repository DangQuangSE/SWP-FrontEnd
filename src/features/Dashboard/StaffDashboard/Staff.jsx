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
  Space,
  Breadcrumb,
  theme
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  QuestionCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  LaptopOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

function Staff() {
  const [isAppointmentModalVisible, setIsAppointmentModalVisible] = useState(false);
  const [isQAModalVisible, setIsQAModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedMenuItem, setSelectedMenuItem] = useState('appointments_view_all'); // Default selected item

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items for the top navigation
  const items1 = ['Dashboard', 'Appointments', 'Settings'].map((label, key) => ({
    key: String(key + 1),
    label,
  }));

  // Menu items for the side navigation
  const items2 = [
    {
      key: 'appointments',
      icon: React.createElement(CalendarOutlined),
      label: 'Appointments',
      children: [
        { key: 'appointments_view_all', label: 'View All' },
        { key: 'appointments_consultant_schedule', label: 'Consultant Schedule' },
      ],
    },
    {
      key: 'customers',
      icon: React.createElement(UserOutlined),
      label: 'Customers',
      children: [
        { key: 'customers_profiles', label: 'Profiles' },
        { key: 'customers_history', label: 'History' },
      ],
    },
    {
      key: 'qa',
      icon: React.createElement(QuestionCircleOutlined),
      label: 'Q&A',
      children: [
        { key: 'qa_questions', label: 'Questions' },
        { key: 'qa_responses', label: 'Responses' },
      ],
    },
  ];

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

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'appointments_view_all':
        return (
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
        );
      case 'appointments_consultant_schedule':
        return (
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
        );
      case 'customers_profiles':
        return (
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
        );
      case 'qa_questions':
        return (
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
        );
      case 'customers_history':
        return (
          <Card title="Customer History">
            <p>Customer history details will be displayed here.</p>
          </Card>
        );
      case 'qa_responses':
        return (
          <Card title="Q&A Responses">
            <p>Q&A responses will be displayed here.</p>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['appointments_view_all']}
            defaultOpenKeys={['appointments']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
            onSelect={({ key }) => setSelectedMenuItem(key)}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb
            items={[
              { title: 'Home' },
              { title: 'Staff' },
              { title: 'Dashboard' }
            ]}
            style={{ margin: '16px 0' }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

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
    </Layout>
  );
}

export default Staff;