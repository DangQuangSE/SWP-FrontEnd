import React, { useState } from "react";
import { Card, Button, Space, Typography, Row, Col, Alert, Tag } from "antd";
import {
  ExperimentOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import MedicalResultForm from "./MedicalResultForm";
import MedicalResultViewer from "./MedicalResultViewer";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../configs/serverConfig";

const { Title, Text } = Typography;

/**
 * Demo component for testing MedicalResultForm
 */
const MedicalResultFormDemo = () => {
  const [showForm, setShowForm] = useState(false);
  const [submittedResults, setSubmittedResults] = useState([]);

  // Mock appointment detail data
  const mockAppointmentDetail = {
    id: 3,
    serviceName: "HIV Ag/Ab Combo Test",
    customerName: "Nguyễn Văn A",
    consultantId: 2,
    consultantName: "BS. Trần Thị B",
    slotTime: "2025-01-15T10:30:00",
    status: "WAITING_RESULT",
  };

  const handleFormSuccess = (result) => {
    console.log(" Form submitted successfully:", result);
    setSubmittedResults((prev) => [result, ...prev]);
    setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={2}>🧪 Medical Result Form - Demo</Title>

      <Alert
        message="Demo hệ thống nhập kết quả khám"
        description="Thử nghiệm form nhập kết quả khám chuyên nghiệp với API integration"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* Mock Appointment Detail */}
      <Card title=" Thông tin cuộc hẹn mẫu" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <Space direction="vertical">
                <Text strong>
                  <UserOutlined /> Bệnh nhân
                </Text>
                <Text>{mockAppointmentDetail.customerName}</Text>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Space direction="vertical">
                <Text strong>
                  <ExperimentOutlined /> Dịch vụ
                </Text>
                <Text>{mockAppointmentDetail.serviceName}</Text>
              </Space>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Space direction="vertical">
                <Text strong>
                  <CalendarOutlined /> Thời gian
                </Text>
                <Text>
                  {dayjs(mockAppointmentDetail.slotTime).format(
                    "DD/MM/YYYY HH:mm"
                  )}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            icon={<ExperimentOutlined />}
            onClick={() => setShowForm(true)}
            disabled={showForm}
          >
            Nhập kết quả khám
          </Button>
        </div>
      </Card>

      {/* Form */}
      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <MedicalResultForm
            appointmentDetail={mockAppointmentDetail}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </Card>
      )}

      {/* Submitted Results */}
      {submittedResults.length > 0 && (
        <Card title="📊 Kết quả đã lưu">
          <Row gutter={[16, 16]}>
            {submittedResults.map((result, index) => (
              <Col span={24} key={index}>
                <MedicalResultViewer result={result} compact={false} />
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* API Information */}
      <Card title="🔧 Thông tin API" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Request Format">
              <pre
                style={{
                  fontSize: "12px",
                  background: "#f6f6f6",
                  padding: "12px",
                  borderRadius: "4px",
                }}
              >
                {`{
  "appointmentDetailId": 3,
  "resultType": "LAB_TEST",
  "description": "Mô tả triệu chứng...",
  "diagnosis": "Chẩn đoán...",
  "treatmentPlan": "Kế hoạch điều trị...",
  "testName": "HIV Ag/Ab Combo Test",
  "testResult": "Non-reactive",
  "normalRange": "Non-reactive",
  "testMethod": "ELISA",
  "specimenType": "Blood",
  "testStatus": "NORMAL",
  "sampleCollectedAt": "2025-01-15T10:30:00",
  "labNotes": "Ghi chú phòng lab..."
}`}
              </pre>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="API Endpoint">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Tag color="green">POST</Tag>
                  <Text code>{API_BASE_URL}/result</Text>
                </div>
                <Alert
                  message="Tính năng"
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li> Validation dữ liệu đầu vào</li>
                      <li> Error handling chuyên nghiệp</li>
                      <li> Loading states</li>
                      <li> Success callbacks</li>
                      <li> Form reset sau submit</li>
                      <li> Toast notifications</li>
                    </ul>
                  }
                  type="success"
                  size="small"
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Code Organization */}
      <Card title="📁 Tổ chức code React" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small" title="🔧 API Layer">
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: "12px" }}>
                <li>
                  <Text code>src/api/medicalResultAPI.js</Text>
                </li>
                <li>• submitMedicalResult()</li>
                <li>• validateMedicalResultData()</li>
                <li>• formatMedicalResultForAPI()</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="🎣 Custom Hooks">
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: "12px" }}>
                <li>
                  <Text code>src/hooks/useMedicalResult.js</Text>
                </li>
                <li>• useMedicalResult()</li>
                <li>• useMedicalResultForm()</li>
                <li>• State management</li>
              </ul>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="🎨 UI Components">
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: "12px" }}>
                <li>
                  <Text code>MedicalResultForm.jsx</Text>
                </li>
                <li>• Professional form UI</li>
                <li>• Validation & error handling</li>
                <li>• Responsive design</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Best Practices */}
      <Card title="⭐ React Best Practices Applied" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Alert
              message="Architecture Patterns"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    <strong>Separation of Concerns:</strong> API, Hooks, UI
                    riêng biệt
                  </li>
                  <li>
                    <strong>Custom Hooks:</strong> Logic tái sử dụng
                  </li>
                  <li>
                    <strong>Controlled Components:</strong> Form state
                    management
                  </li>
                  <li>
                    <strong>Error Boundaries:</strong> Graceful error handling
                  </li>
                </ul>
              }
              type="info"
              size="small"
            />
          </Col>
          <Col span={12}>
            <Alert
              message="Performance & UX"
              description={
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>
                    <strong>useCallback:</strong> Prevent unnecessary re-renders
                  </li>
                  <li>
                    <strong>Loading States:</strong> User feedback
                  </li>
                  <li>
                    <strong>Optimistic Updates:</strong> Instant UI response
                  </li>
                  <li>
                    <strong>Form Validation:</strong> Real-time feedback
                  </li>
                </ul>
              }
              type="success"
              size="small"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MedicalResultFormDemo;
