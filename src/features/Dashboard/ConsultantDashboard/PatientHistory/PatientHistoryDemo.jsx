import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Alert,
  Divider,
  Row,
  Col,
} from "antd";
import PatientMedicalHistory from "./PatientMedicalHistory";
import PatientInfoCard from "./PatientInfoCard";
import PatientDetailButton from "./PatientDetailButton";

const { Title, Text } = Typography;
const { Search } = Input;

const PatientHistoryDemo = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [inputPatientId, setInputPatientId] = useState("");

  const handleSearchPatient = (value) => {
    const patientId = parseInt(value);
    if (patientId && patientId > 0) {
      setSelectedPatientId(patientId);
      console.log(` [DEMO] Searching for patient ID: ${patientId}`);
    } else {
      setSelectedPatientId(null);
    }
  };

  const handleQuickSelect = (patientId) => {
    setSelectedPatientId(patientId);
    setInputPatientId(patientId.toString());
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      {/* Demo Header */}
      <Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
        <Title level={3} style={{ margin: 0, color: "#1a1a1a" }}>
          🏥 Demo Hồ Sơ Bệnh Án
        </Title>
        <Text style={{ color: "#666" }}>
          Nhập ID bệnh nhân để xem lịch sử khám bệnh chi tiết
        </Text>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          {/* Search Input */}
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Tìm kiếm bệnh nhân:
            </Text>
            <Search
              placeholder="Nhập ID bệnh nhân (ví dụ: 3)"
              value={inputPatientId}
              onChange={(e) => setInputPatientId(e.target.value)}
              onSearch={handleSearchPatient}
              enterButton="Tìm kiếm"
              size="large"
              style={{ maxWidth: "400px" }}
            />
          </div>

          {/* Quick Select Buttons */}
          <div>
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              Hoặc chọn nhanh:
            </Text>
            <Space wrap>
              <Button
                type={selectedPatientId === 3 ? "primary" : "default"}
                onClick={() => handleQuickSelect(3)}
              >
                Bệnh nhân #3
              </Button>
              <Button
                type={selectedPatientId === 1 ? "primary" : "default"}
                onClick={() => handleQuickSelect(1)}
              >
                Bệnh nhân #1
              </Button>
              <Button
                type={selectedPatientId === 2 ? "primary" : "default"}
                onClick={() => handleQuickSelect(2)}
              >
                Bệnh nhân #2
              </Button>
              <Button
                type={selectedPatientId === 5 ? "primary" : "default"}
                onClick={() => handleQuickSelect(5)}
              >
                Bệnh nhân #5
              </Button>
            </Space>
          </div>

          {/* API Info */}
          <Alert
            message="Thông tin API"
            description={
              <div>
                <Text code style={{ fontSize: "12px" }}>
                  GET /api/medical-profile/patient/{patientId}/history
                </Text>
                <br />
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  Parameters: patientId (path), page (query), size (query)
                </Text>
              </div>
            }
            type="info"
            showIcon
            style={{ marginTop: "8px" }}
          />
        </Space>
      </Card>

      {/* Patient History Component */}
      {selectedPatientId ? (
        <PatientMedicalHistory patientId={selectedPatientId} />
      ) : (
        <Card
          style={{ textAlign: "center", padding: "60px", borderRadius: "8px" }}
        >
          <div style={{ color: "#999", fontSize: "16px" }}>
            👆 Vui lòng nhập ID bệnh nhân để xem hồ sơ bệnh án
          </div>
          <div style={{ color: "#ccc", fontSize: "14px", marginTop: "8px" }}>
            Ví dụ: nhập số 3 để xem hồ sơ bệnh nhân có ID = 3
          </div>
        </Card>
      )}
    </div>
  );
};

export default PatientHistoryDemo;
