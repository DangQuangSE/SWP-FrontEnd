import React, { useEffect } from 'react';
import { Modal, Form, Rate, Input, Button, Divider } from 'antd';

const RatingModal = ({ visible, appointment, previousRating, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  // Thêm debug để kiểm tra cấu trúc dữ liệu
  useEffect(() => {
    if (previousRating) {
      console.log("Previous rating structure:", JSON.stringify(previousRating, null, 2));
    }
  }, [previousRating]);

  // Cập nhật useEffect để xử lý cấu trúc dữ liệu mới
  useEffect(() => {
    if (visible && previousRating) {
      console.log("Setting form values with previous rating:", previousRating);

      // Lấy dữ liệu từ cấu trúc mới
      const serviceFeedback = previousRating.serviceFeedback;
      const consultantFeedback = previousRating.consultantFeedback;

      if (serviceFeedback) {
        // Điền các giá trị đánh giá dịch vụ
        form.setFieldsValue({
          serviceRating: serviceFeedback.rating,
          serviceComment: serviceFeedback.comment || ""
        });

        // Điền các giá trị đánh giá bác sĩ nếu có
        if (consultantFeedback) {
          form.setFieldsValue({
            consultantRating: consultantFeedback.rating,
            consultantComment: consultantFeedback.comment || ""
          });
        }

        console.log("Form values set successfully");
      } else {
        console.log("No service feedback found in previousRating");
        form.resetFields();
      }
    } else if (visible) {
      console.log("Resetting form - no previous rating");
      form.resetFields();
    }
  }, [visible, previousRating, form]);

  if (!appointment) return null;

  return (
    <Modal
      title={previousRating ? "Sửa đánh giá dịch vụ và bác sĩ" : "Đánh giá dịch vụ và bác sĩ"}
      open={visible}
      footer={null}
      onCancel={onCancel}
      width={500}
      destroyOnClose={false} // Không hủy component khi đóng modal
    >
      <p>
        {previousRating
          ? "Cập nhật đánh giá của bạn về dịch vụ và bác sĩ:"
          : "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Vui lòng đánh giá trải nghiệm của bạn:"}
      </p>

      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        initialValues={
          previousRating && previousRating.serviceFeedback ? {
            serviceRating: previousRating.serviceFeedback.rating,
            serviceComment: previousRating.serviceFeedback.comment || "",
            consultantRating: previousRating.consultantFeedback?.rating || 0,
            consultantComment: previousRating.consultantFeedback?.comment || ""
          } : {}
        }
      >
        <Form.Item
          name="serviceRating"
          label={previousRating ? "Sửa đánh giá dịch vụ" : "Đánh giá dịch vụ"}
          rules={[{ required: true, message: 'Vui lòng đánh giá dịch vụ' }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="serviceComment"
          label="Nhận xét về dịch vụ"
        >
          <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..." />
        </Form.Item>

        <Divider />

        <Form.Item
          name="consultantRating"
          label={previousRating
            ? `Sửa đánh giá bác sĩ ${appointment.doctorName || ''}`
            : `Đánh giá bác sĩ ${appointment.doctorName || ''}`}
          rules={[{ required: true, message: 'Vui lòng đánh giá bác sĩ' }]}
        >
          <Rate allowHalf />
        </Form.Item>

        <Form.Item
          name="consultantComment"
          label="Nhận xét về bác sĩ"
        >
          <Input.TextArea rows={3} placeholder="Chia sẻ trải nghiệm của bạn về bác sĩ..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {previousRating ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RatingModal;











