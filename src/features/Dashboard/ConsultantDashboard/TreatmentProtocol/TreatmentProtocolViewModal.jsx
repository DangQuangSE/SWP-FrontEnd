
// File: src/features/Dashboard/ConsultantDashboard/TreatmentProtocol/TreatmentProtocolViewModal.jsx
import React from "react";
import { Modal, Button } from "antd";

const TreatmentProtocolViewModal = ({
    visible,
    onClose,
    protocol
}) => {
    return (
        <Modal
            title="Chi tiết phác đồ điều trị"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            width={700}
        >
            {protocol && (
                <div style={{ padding: '16px 0' }}>
                    <div style={{ marginBottom: 16 }}>
                        <strong>Tên bệnh:</strong>
                        <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                            {protocol.diseaseName}
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Triệu chứng, chẩn đoán:</strong>
                        <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4, whiteSpace: 'pre-wrap' }}>
                            {protocol.diagnosis}
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Phác đồ điều trị:</strong>
                        <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4, whiteSpace: 'pre-wrap' }}>
                            {protocol.treatment}
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <strong>Kế hoạch theo dõi:</strong>
                        <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4, whiteSpace: 'pre-wrap' }}>
                            {protocol.followUp}
                        </div>
                    </div>

                    {protocol.notes && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>Lưu ý đặc biệt:</strong>
                            <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#f5f5f5', borderRadius: 4, whiteSpace: 'pre-wrap' }}>
                                {protocol.notes}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default TreatmentProtocolViewModal;

