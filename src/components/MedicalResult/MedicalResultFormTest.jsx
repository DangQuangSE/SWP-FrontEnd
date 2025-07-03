import React, { useState } from 'react';
import { Card, Button, Alert, Space, Typography, Row, Col } from 'antd';
import { ExperimentOutlined, BugOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MedicalResultFormWrapper, { MedicalResultButton } from './MedicalResultFormWrapper';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

/**
 * Test component to verify the dayjs error fix
 */
const MedicalResultFormTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState(null);

  // Mock appointment details for testing
  const testAppointmentDetails = [
    {
      id: 1,
      serviceName: "HIV Ag/Ab Combo Test",
      customerName: "Nguyễn Văn A",
      consultantId: 2,
      consultantName: "BS. Trần Thị B",
      slotTime: "2025-01-15T10:30:00",
      status: "WAITING_RESULT"
    },
    {
      id: 2,
      serviceName: "Glucose Test",
      customerName: "Lê Thị C",
      consultantId: 3,
      consultantName: "BS. Phạm Văn D",
      slotTime: dayjs().toISOString(),
      status: "WAITING_RESULT"
    },
    {
      id: 3,
      serviceName: "X-ray Chest",
      customerName: "Hoàng Văn E",
      consultantId: 2,
      slotTime: new Date().toISOString(),
      status: "WAITING_RESULT"
    }
  ];

  const handleTestSuccess = (result, testName) => {
    const testResult = {
      testName,
      success: true,
      result,
      timestamp: new Date().toLocaleString('vi-VN'),
      error: null
    };
    
    setTestResults(prev => [testResult, ...prev]);
    console.log(`✅ Test "${testName}" passed:`, result);
  };

  const handleTestError = (error, testName) => {
    const testResult = {
      testName,
      success: false,
      result: null,
      timestamp: new Date().toLocaleString('vi-VN'),
      error: error.message || error
    };
    
    setTestResults(prev => [testResult, ...prev]);
    console.error(`❌ Test "${testName}" failed:`, error);
  };

  const runTest = (appointmentDetail, testName) => {
    try {
      setCurrentTest(testName);
      console.log(`🧪 Running test: ${testName}`);
      console.log('Test data:', appointmentDetail);
    } catch (error) {
      handleTestError(error, testName);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Title level={2}>
        <BugOutlined /> Medical Result Form - Error Fix Test
      </Title>
      
      <Alert
        message="Kiểm tra lỗi dayjs.isValid"
        description="Test component này kiểm tra xem lỗi 'date4.isValid is not a function' đã được sửa chưa"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Test Cases */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {testAppointmentDetails.map((detail, index) => (
          <Col span={8} key={detail.id}>
            <Card 
              size="small"
              title={`Test Case ${index + 1}`}
              extra={
                <MedicalResultButton
                  appointmentDetail={detail}
                  onSuccess={(result) => handleTestSuccess(result, `Test Case ${index + 1}`)}
                  onError={(error) => handleTestError(error, `Test Case ${index + 1}`)}
                  size="small"
                >
                  Test
                </MedicalResultButton>
              }
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong>Dịch vụ:</Text>
                <Text>{detail.serviceName}</Text>
                
                <Text strong>Bệnh nhân:</Text>
                <Text>{detail.customerName}</Text>
                
                <Text strong>Thời gian:</Text>
                <Text>{dayjs(detail.slotTime).format('DD/MM/YYYY HH:mm')}</Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card title="📊 Kết quả test">
          <Space direction="vertical" style={{ width: '100%' }}>
            {testResults.map((result, index) => (
              <Alert
                key={index}
                message={
                  <Space>
                    {result.success ? <CheckCircleOutlined /> : <BugOutlined />}
                    <Text strong>{result.testName}</Text>
                    <Text type="secondary">- {result.timestamp}</Text>
                  </Space>
                }
                description={
                  result.success ? (
                    <div>
                      <Text type="success">✅ Test thành công!</Text>
                      <br />
                      <Text code>Result ID: {result.result?.id}</Text>
                    </div>
                  ) : (
                    <div>
                      <Text type="danger">❌ Test thất bại!</Text>
                      <br />
                      <Text code>{result.error}</Text>
                    </div>
                  )
                }
                type={result.success ? "success" : "error"}
                size="small"
              />
            ))}
          </Space>
        </Card>
      )}

      {/* Debug Information */}
      <Card title="🔧 Debug Information" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Dayjs Version">
              <Text code>{dayjs.version || 'Unknown'}</Text>
              <br />
              <Text>Current time: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Error Fixes Applied">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>✅ Safe date conversion in form submission</li>
                <li>✅ Error handling in DatePicker onChange</li>
                <li>✅ Fallback values for invalid dates</li>
                <li>✅ Wrapper component with error boundaries</li>
                <li>✅ Proper dayjs object handling</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Instructions */}
      <Card title="📋 Hướng dẫn test" style={{ marginTop: 24 }}>
        <Paragraph>
          <strong>Cách test:</strong>
        </Paragraph>
        <ol>
          <li>Click vào nút "Test" ở mỗi test case</li>
          <li>Form sẽ mở ra - kiểm tra xem có lỗi console không</li>
          <li>Điền thông tin và submit form</li>
          <li>Kiểm tra kết quả trong phần "Kết quả test"</li>
          <li>Nếu không có lỗi "date4.isValid is not a function" → Fix thành công!</li>
        </ol>
        
        <Paragraph>
          <strong>Các lỗi đã được sửa:</strong>
        </Paragraph>
        <ul>
          <li><Text code>date4.isValid is not a function</Text> - Lỗi dayjs validation</li>
          <li><Text code>Cannot read property 'toISOString' of undefined</Text> - Null date handling</li>
          <li><Text code>Invalid date format</Text> - Date parsing errors</li>
        </ul>
      </Card>
    </div>
  );
};

export default MedicalResultFormTest;
