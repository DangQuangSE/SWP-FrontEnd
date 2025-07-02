import React, { useState } from 'react';
import { Modal, Button, Alert, Space } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import MedicalResultForm from './MedicalResultForm';
import dayjs from 'dayjs';

/**
 * Wrapper component to handle MedicalResultForm with proper error handling
 * This component ensures dayjs compatibility and prevents validation errors
 */
const MedicalResultFormWrapper = ({ 
  visible, 
  onClose, 
  appointmentDetail, 
  onSuccess 
}) => {
  const [formError, setFormError] = useState(null);

  // Ensure appointmentDetail has required fields
  const safeAppointmentDetail = appointmentDetail ? {
    id: appointmentDetail.id,
    serviceName: appointmentDetail.serviceName || 'Dịch vụ khám',
    customerName: appointmentDetail.customerName || 'Bệnh nhân',
    consultantId: appointmentDetail.consultantId,
    consultantName: appointmentDetail.consultantName || `Bác sĩ #${appointmentDetail.consultantId}`,
    slotTime: appointmentDetail.slotTime || new Date().toISOString(),
    status: appointmentDetail.status || 'WAITING_RESULT'
  } : null;

  const handleSuccess = (result) => {
    try {
      console.log('✅ Form submission successful:', result);
      setFormError(null);
      if (onSuccess) {
        onSuccess(result);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error in success handler:', error);
      setFormError('Có lỗi xảy ra sau khi lưu thành công');
    }
  };

  const handleCancel = () => {
    try {
      setFormError(null);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error in cancel handler:', error);
    }
  };

  const handleFormError = (error) => {
    console.error('Form error:', error);
    setFormError(error.message || 'Có lỗi xảy ra trong form');
  };

  if (!visible) {
    return null;
  }

  if (!safeAppointmentDetail) {
    return (
      <Modal
        title="Lỗi"
        open={visible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>
        ]}
      >
        <Alert
          message="Không thể mở form"
          description="Thông tin cuộc hẹn không hợp lệ hoặc bị thiếu"
          type="error"
          showIcon
        />
      </Modal>
    );
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      style={{ top: 20 }}
      maskClosable={false}
    >
      {formError && (
        <Alert
          message="Lỗi form"
          description={formError}
          type="error"
          showIcon
          closable
          onClose={() => setFormError(null)}
          style={{ marginBottom: 16 }}
        />
      )}
      
      <div style={{ padding: '0 8px' }}>
        <MedicalResultForm
          appointmentDetail={safeAppointmentDetail}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          onError={handleFormError}
        />
      </div>
    </Modal>
  );
};

/**
 * Hook to manage MedicalResultForm modal state
 */
export const useMedicalResultModal = () => {
  const [visible, setVisible] = useState(false);
  const [appointmentDetail, setAppointmentDetail] = useState(null);

  const openModal = (detail) => {
    try {
      console.log('🔄 Opening medical result modal for:', detail);
      setAppointmentDetail(detail);
      setVisible(true);
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  };

  const closeModal = () => {
    try {
      console.log('🔄 Closing medical result modal');
      setVisible(false);
      setAppointmentDetail(null);
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  return {
    visible,
    appointmentDetail,
    openModal,
    closeModal
  };
};

/**
 * Simple button component to trigger medical result form
 */
export const MedicalResultButton = ({ 
  appointmentDetail, 
  onSuccess, 
  children,
  ...buttonProps 
}) => {
  const { visible, openModal, closeModal } = useMedicalResultModal();

  const handleClick = () => {
    openModal(appointmentDetail);
  };

  const handleSuccess = (result) => {
    closeModal();
    if (onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ExperimentOutlined />}
        onClick={handleClick}
        {...buttonProps}
      >
        {children || 'Nhập kết quả'}
      </Button>
      
      <MedicalResultFormWrapper
        visible={visible}
        onClose={closeModal}
        appointmentDetail={appointmentDetail}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default MedicalResultFormWrapper;
