import React from "react";
import { Modal, Button } from "antd";
import "./MedicalResultModal.css";

const MedicalResultModal = ({ visible, onClose, selectedResult }) => {
  if (!selectedResult) return null;

  return (
    <Modal
      title="Kết quả khám bệnh"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      {selectedResult && selectedResult.appointment && (
        <div className="medical-result-modal-content">
          {/* Thông tin lịch hẹn */}
          <div className="appointment-info-section">
            <h3>Thông tin lịch hẹn</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Ngày khám:</span>
                <span className="info-value">
                  {selectedResult.appointment?.preferredDate ||
                    "Không có thông tin"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Dịch vụ:</span>
                <span className="info-value">
                  {selectedResult.appointment?.serviceName ||
                    "Không có thông tin"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Bác sĩ:</span>
                <span className="info-value">
                  {selectedResult.appointment?.appointmentDetails?.[0]
                    ?.consultantName || "Không có thông tin"}
                </span>
              </div>
            </div>
          </div>

          {/* Kết quả khám từ appointmentDetails */}
          {((selectedResult.selectedDetail &&
            selectedResult.selectedDetail.medicalResult) ||
            selectedResult.appointment.appointmentDetails?.some(
              (detail) =>
                detail.medicalResult &&
                Object.keys(detail.medicalResult).length > 0
            )) && (
              <div className="medical-results-section">
                <h3>Kết quả khám bệnh</h3>
                {(selectedResult.selectedDetail
                  ? [selectedResult.selectedDetail]
                  : selectedResult.appointment.appointmentDetails.filter(
                    (detail) =>
                      detail.medicalResult &&
                      Object.keys(detail.medicalResult).length > 0
                  )
                ).map((detail, index) => (
                  <div key={index} className="result-item">
                    <div className="result-header">
                      <h4>{detail.serviceName}</h4>
                      {detail.medicalResult.createdAt && (
                        <span className="result-date">
                          {new Date(
                            detail.medicalResult.createdAt
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>

                    <div className="result-content">
                      {/* Kết quả xét nghiệm */}
                      {detail.medicalResult.testResult && (
                        <div className="result-field">
                          <span className="field-label">Kết quả xét nghiệm:</span>
                          <span className="field-value">
                            {detail.medicalResult.testResult}
                          </span>
                          {detail.medicalResult.normalRange && (
                            <div className="normal-range">
                              Giá trị bình thường:{" "}
                              {detail.medicalResult.normalRange}
                            </div>
                          )}
                          {detail.medicalResult.testStatus && (
                            <div className="test-status">
                              Trạng thái:{" "}
                              {detail.medicalResult.testStatus === "NORMAL"
                                ? "Bình thường"
                                : detail.medicalResult.testStatus === "ABNORMAL"
                                  ? "Bất thường"
                                  : "Đang xử lý"}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Chẩn đoán */}
                      {detail.medicalResult.diagnosis && (
                        <div className="result-field">
                          <span className="field-label">Chẩn đoán:</span>
                          <div className="field-value">
                            {detail.medicalResult.diagnosis}
                          </div>
                        </div>
                      )}

                      {/* Kế hoạch điều trị */}
                      {detail.medicalResult.treatmentPlan && (
                        <div className="result-field">
                          <span className="field-label">Kế hoạch điều trị:</span>
                          <div className="field-value">
                            {detail.medicalResult.treatmentPlan}
                          </div>
                        </div>
                      )}

                      {/* Mô tả */}
                      {detail.medicalResult.description && (
                        <div className="result-field">
                          <span className="field-label">Mô tả:</span>
                          <div className="field-value">
                            {detail.medicalResult.description}
                          </div>
                        </div>
                      )}

                      {/* Ghi chú từ phòng lab */}
                      {detail.medicalResult.labNotes && (
                        <div className="result-field">
                          <span className="field-label">
                            Ghi chú từ phòng lab:
                          </span>
                          <div className="field-value">
                            {detail.medicalResult.labNotes}
                          </div>
                        </div>
                      )}

                      {/* Thông tin bác sĩ */}
                      {detail.medicalResult.doctorName && (
                        <div className="result-field">
                          <span className="field-label">Bác sĩ thực hiện:</span>
                          <span className="field-value">
                            {detail.medicalResult.doctorName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Thông tin y tế cá nhân */}
          {selectedResult.medicalProfile &&
            Object.keys(selectedResult.medicalProfile).length > 0 && (
              <div className="medical-profile-section">
                <h3>Thông tin y tế cá nhân</h3>
                <div className="profile-content">
                  {selectedResult.medicalProfile.allergies && (
                    <div className="profile-field">
                      <span className="field-label">Dị ứng:</span>
                      <div className="field-value">
                        {selectedResult.medicalProfile.allergies}
                      </div>
                    </div>
                  )}

                  {selectedResult.medicalProfile.chronicConditions && (
                    <div className="profile-field">
                      <span className="field-label">Bệnh mãn tính:</span>
                      <div className="field-value">
                        {selectedResult.medicalProfile.chronicConditions}
                      </div>
                    </div>
                  )}

                  {selectedResult.medicalProfile.familyHistory && (
                    <div className="profile-field">
                      <span className="field-label">Tiền sử gia đình:</span>
                      <div className="field-value">
                        {selectedResult.medicalProfile.familyHistory}
                      </div>
                    </div>
                  )}

                  {selectedResult.medicalProfile.specialNotes && (
                    <div className="profile-field">
                      <span className="field-label">Ghi chú đặc biệt:</span>
                      <div className="field-value">
                        {selectedResult.medicalProfile.specialNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </Modal>
  );
};

export default MedicalResultModal;
