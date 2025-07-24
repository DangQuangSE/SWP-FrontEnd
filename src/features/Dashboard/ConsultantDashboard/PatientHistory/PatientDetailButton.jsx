import React, { useState } from "react";
import { Button, Modal } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import PatientMedicalHistory from "./PatientMedicalHistory";

const PatientDetailButton = ({
  patientId,
  patientName = "Bệnh nhân",
  buttonText = "Chi tiết",
  buttonType = "link",
  buttonSize = "small",
  disabled = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Debug: Log props when component renders
  console.log("🔍 [PATIENT_DETAIL] Component rendered with props:", {
    patientId,
    patientName,
    buttonText,
    disabled,
    isDisabled: disabled || !patientId,
  });

  const handleShowDetail = () => {
    console.log("🔍 [PATIENT_DETAIL] Button clicked!");
    console.log("🔍 [PATIENT_DETAIL] Props:", { patientId, disabled });

    if (!patientId) {
      console.warn("⚠️ [PATIENT_DETAIL] No patientId provided");
      return;
    }

    console.log(
      ` [PATIENT_DETAIL] Opening medical history for patient ID: ${patientId}`
    );
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Detail Button */}
      <Button
        type={buttonType}
        size={buttonSize}
        icon={<FileTextOutlined />}
        onClick={handleShowDetail}
        disabled={disabled || !patientId}
        style={{
          padding: "2px 8px",
          color: disabled || !patientId ? "#ccc" : "#1890ff",
          fontSize: "12px",
          height: "auto",
          lineHeight: "1.2",
        }}
      >
        {buttonText}
      </Button>

      {/* Medical History Modal */}
      <Modal
        title={
          <div
            style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}
          >
            Hồ sơ bệnh án - {patientName}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>,
        ]}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{
          padding: 0,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        destroyOnClose={true}
      >
        {patientId && <PatientMedicalHistory patientId={patientId} />}
      </Modal>
    </>
  );
};

export default PatientDetailButton;
