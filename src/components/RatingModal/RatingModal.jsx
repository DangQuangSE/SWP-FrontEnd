import React, { useState, useEffect } from 'react';
import { Modal, Form, Rate, Input, Button, message, Spin } from 'antd';
import api from '../../configs/api';
import './RatingModal.css';

const { TextArea } = Input;

const RatingModal = ({ visible, onClose, appointment, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previousRating, setPreviousRating] = useState(null);

  // Fetch existing rating if appointment is already rated
  useEffect(() => {
    if (!visible || !appointment) return;

    const fetchExistingRating = async () => {
      if (appointment.isRated) {
        try {
          setLoading(true);
          // Fetch service feedback
          const feedbackRes = await api.get(`/feedback/appointment/${appointment.id}`);
          console.log("Raw feedback data:", feedbackRes.data);

          // Xử lý dữ liệu trả về có thể là array hoặc object
          const feedbackData = Array.isArray(feedbackRes.data)
            ? feedbackRes.data[0]
            : feedbackRes.data;

          if (!feedbackData) {
            throw new Error("Không tìm thấy đánh giá");
          }

          console.log("Processed feedback data:", feedbackData);
          setPreviousRating(feedbackData);

          // Lấy thông tin đánh giá bác sĩ từ consultantFeedbacks nếu có
          let consultantRating = 0;
          let consultantComment = "";

          if (feedbackData.consultantFeedbacks &&
            feedbackData.consultantFeedbacks.length > 0) {
            const consultantFeedback = feedbackData.consultantFeedbacks[0];
            consultantRating = consultantFeedback.rating || 0;
            consultantComment = consultantFeedback.comment || "";

            console.log("Found consultant feedback:", {
              rating: consultantRating,
              comment: consultantComment
            });
          }

          // Set form values với cấu trúc mới
          form.setFieldsValue({
            serviceRating: feedbackData.rating || 0,
            serviceComment: feedbackData.comment || "",
            serviceCommentConsultant: consultantComment
          });

          console.log("Set form values:", {
            serviceRating: feedbackData.rating || 0,
            serviceComment: feedbackData.comment || "",
            commentConsultant: consultantComment
          });
        } catch (error) {
          console.error("Lỗi khi lấy đánh giá cũ:", error);
          message.error("Không thể tải đánh giá cũ");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset form for new rating
        form.resetFields();
        setPreviousRating(null);
      }
    };

    fetchExistingRating();
  }, [visible, appointment, form]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      try {
        const consultantId = appointment.appointmentDetails?.[0]?.consultantId;

        if (appointment.isRated && previousRating) {
          // Update existing rating
          await api.put(`/feedback/${previousRating.id}`, {
            rating: values.serviceRating,
            comment: values.serviceComment || "",
            consultantRating: values.consultantRating || 0,
            commentConsultant: values.serviceCommentConsultant || ""
          });

          message.success("Đã cập nhật đánh giá thành công!");
        } else {
          // Create new rating
          const consultantId = appointment.appointmentDetails?.[0]?.consultantId;

          await api.post('/feedback', {
            appointmentId: appointment.id,
            rating: values.serviceRating,
            comment: values.serviceComment || "",
            commentConsultant: values.serviceCommentConsultant || "",
            consultantRating: values.consultantRating || 0,
            consultantComment: values.consultantComment || "",
            consultantId: consultantId
          });

          // Update appointment isRated status using the specific API endpoint
          if (!appointment.isRated) {
            await api.put(`/appointment/${appointment.id}/rate`);
            console.log("Appointment marked as rated");
          }

          message.success("Cảm ơn bạn đã đánh giá!");
        }

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }

        // Close modal
        onClose();
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        message.error("Có lỗi xảy ra khi gửi đánh giá: " +
          (error.response?.data?.message || error.message));
      } finally {
        setSubmitting(false);
      }
    } catch (validationError) {
      console.log("Lỗi validation:", validationError);
      setSubmitting(false);
    }
  };

  // If no appointment is selected, don't render
  if (!appointment) return null;

  const consultantName = appointment.appointmentDetails?.[0]?.consultantName;

  return (
    <Modal
      title="Đánh giá dịch vụ"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={submitting}
        >
          Gửi đánh giá
        </Button>
      ]}
      width={500}
    >
      {loading ? (
        <div className="rating-loading">
          <Spin /> Đang tải dữ liệu đánh giá...
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <p className="service-name">
            Vui lòng đánh giá trải nghiệm của bạn với dịch vụ <strong>{appointment.serviceName}</strong>:
          </p>

          <Form.Item
            name="serviceRating"
            label={<span className="required-label">Đánh giá dịch vụ</span>}
            rules={[{ required: true, message: 'Vui lòng đánh giá dịch vụ' }]}
          >
            <Rate allowHalf />
          </Form.Item>

          <Form.Item
            name="serviceComment"
            label="Nhận xét về dịch vụ"
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="serviceCommentConsultant"
            label="Nhận xét về bác sĩ"
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ..."
              maxLength={500}
              showCount
            />
          </Form.Item>


        </Form>
      )}
    </Modal>
  );
};

export default RatingModal;






