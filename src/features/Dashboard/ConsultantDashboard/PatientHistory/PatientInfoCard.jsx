import React from "react";
import { Card, Space, Typography, Tag } from "antd";
import { UserOutlined, CalendarOutlined, HistoryOutlined } from "@ant-design/icons";
import PatientDetailButton from "./PatientDetailButton";
import dayjs from "dayjs";

const { Text } = Typography;

const PatientInfoCard = ({ 
  patientId,
  patientName = "Chưa có tên",
  patientAge,
  patientGender,
  patientEmail,
  patientPhone,
  appointmentDate,
  appointmentCount = 0,
  showDetailButton = true,
  style = {}
}) => {
  return (
    <Card
      size="small"
      style={{
        borderRadius: "6px",
        border: "1px solid #e8e8e8",
        backgroundColor: "#fafafa",
        ...style
      }}
      bodyStyle={{ padding: "12px" }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {/* Patient Name & ID */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size="small">
            <UserOutlined style={{ color: "#1890ff", fontSize: "14px" }} />
            <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
              {patientName}
            </Text>
            {patientId && (
              <Text style={{ color: "#999", fontSize: "12px" }}>
                (ID: {patientId})
              </Text>
            )}
          </Space>
          
          {showDetailButton && patientId && (
            <PatientDetailButton 
              patientId={patientId}
              patientName={patientName}
              buttonText="Chi tiết"
              buttonType="link"
              buttonSize="small"
            />
          )}
        </div>

        {/* Patient Basic Info */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {patientAge && (
            <Tag color="blue" style={{ fontSize: "11px", margin: 0 }}>
              {patientAge} tuổi
            </Tag>
          )}
          {patientGender && (
            <Tag color="green" style={{ fontSize: "11px", margin: 0 }}>
              {patientGender}
            </Tag>
          )}
          {appointmentCount > 0 && (
            <Tag color="orange" style={{ fontSize: "11px", margin: 0 }}>
              <HistoryOutlined style={{ fontSize: "10px", marginRight: "2px" }} />
              {appointmentCount} lượt khám
            </Tag>
          )}
        </div>

        {/* Contact Info */}
        {(patientEmail || patientPhone) && (
          <div style={{ fontSize: "12px", color: "#666" }}>
            {patientEmail && (
              <div>📧 {patientEmail}</div>
            )}
            {patientPhone && (
              <div>📞 {patientPhone}</div>
            )}
          </div>
        )}

        {/* Appointment Date */}
        {appointmentDate && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <CalendarOutlined style={{ color: "#52c41a", fontSize: "12px" }} />
            <Text style={{ fontSize: "12px", color: "#52c41a" }}>
              Ngày hẹn: {dayjs(appointmentDate).format("DD/MM/YYYY")}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default PatientInfoCard;
