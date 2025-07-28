import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Alert,
  Space,
  Typography,
  Tag,
  message,
} from "antd";
import {
  MedicineBoxOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { submitConsultationResult } from "../../api/medicalResultAPI";
import "./MedicalResultFormConsulting.css";

const { TextArea } = Input;
const { Text } = Typography;

/**
 * Medical Result Form for Consulting Services
 * Form chuyên dụng cho dịch vụ khám bệnh và tư vấn
 */
const MedicalResultFormConsulting = ({
  appointmentDetail,
  onSuccess,
  onCancel,
  initialData = {},
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Set initial form values
  React.useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      form.setFieldsValue(initialData);
    }
  }, [form, initialData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("[DEBUG] Submitting consulting form data:", values);

      const submitData = {
        ...values,
        appointmentDetailId: appointmentDetail?.id || 123,
        resultType: "CONSULTATION",
      };

      console.log("[DEBUG] Final submit data:", submitData);

      // Call API /api/result/consultation
      const response = await submitConsultationResult(submitData);
      message.success("Lưu kết quả khám bệnh thành công!");
      onSuccess?.(response.data);
    } catch (error) {
      console.error("[ERROR] Submit failed:", error);
      console.error("[ERROR] Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi lưu kết quả khám bệnh";

      message.error("Lưu kết quả thất bại: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info("Đã reset form");
  };

  return (
    <Card
      className="medical-result-form-consulting"
      title={
        <div className="form-title">
          <MedicineBoxOutlined />
          <span>Kết quả khám bệnh & tư vấn</span>
          {appointmentDetail && (
            <Tag color="green">#{appointmentDetail.id}</Tag>
          )}
        </div>
      }
      extra={
        <div className="form-extra-buttons">
          <Button
            className="reset-button"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button className="cancel-button" onClick={onCancel}>
            Hủy
          </Button>
        </div>
      }
    >
      {/* Patient Info */}
      {appointmentDetail && (
        <Alert
          className="patient-info-alert"
          message="Thông tin bệnh nhân"
          description={
            <div>
              <Text strong>Dịch vụ: </Text>
              {appointmentDetail.serviceName}
              <br />
              <Text strong>Loại dịch vụ: </Text>
              CONSULTING
              <br />
              <Text strong>Bệnh nhân: </Text>
              {appointmentDetail.customerName || "N/A"}
              <br />
              <Text strong>Thời gian: </Text>
              {new Date(appointmentDetail.slotTime).toLocaleDateString("vi-VN")}
            </div>
          }
          type="info"
          showIcon
        />
      )}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Clinical Assessment - Full Width */}
        <Card
          className="clinical-assessment-card clinical-assessment-section"
          size="small"
          title="Đánh giá lâm sàng"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="description"
                label="Mô tả triệu chứng"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mô tả triệu chứng!",
                  },
                  { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
                ]}
              >
                <TextArea
                  className="form-field-textarea large"
                  rows={6}
                  placeholder="Ví dụ: Bệnh nhân có triệu chứng ngứa, đau rát vùng kín, có dịch tiết bất thường"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="diagnosis"
                label="Chẩn đoán"
                rules={[
                  { required: true, message: "Vui lòng nhập chẩn đoán!" },
                  { min: 10, message: "Chẩn đoán phải có ít nhất 10 ký tự!" },
                ]}
              >
                <TextArea
                  className="form-field-textarea large"
                  rows={6}
                  placeholder="Ví dụ: Viêm âm đạo do nấm Candida"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="treatmentPlan"
                label="Kế hoạch điều trị"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập kế hoạch điều trị!",
                  },
                  {
                    min: 10,
                    message: "Kế hoạch điều trị phải có ít nhất 10 ký tự!",
                  },
                ]}
              >
                <TextArea
                  className="form-field-textarea large"
                  rows={6}
                  placeholder="Ví dụ: Sử dụng thuốc kháng nấm, tái khám sau 1 tuần"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Additional Notes */}
        <Card
          className="additional-notes-card additional-notes-section"
          size="small"
          title="Ghi chú bổ sung"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="symptoms" label="Triệu chứng chi tiết">
                <TextArea
                  className="form-field-textarea medium"
                  rows={4}
                  placeholder="Mô tả chi tiết các triệu chứng quan sát được..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recommendations" label="Khuyến nghị">
                <TextArea
                  className="form-field-textarea medium"
                  rows={4}
                  placeholder="Các khuyến nghị về chế độ sinh hoạt, dinh dưỡng..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="followUpDate" label="Ngày tái khám">
                <Input placeholder="Ví dụ: Sau 1 tuần" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="doctorNotes" label="Ghi chú của bác sĩ">
                <TextArea
                  className="form-field-textarea small"
                  rows={2}
                  placeholder="Ghi chú riêng của bác sĩ..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Buttons */}
        <div className="submit-buttons-container">
          <Space>
            <Button className="cancel-button" onClick={onCancel}>
              Hủy
            </Button>
            <Button
              className="submit-button"
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              Lưu kết quả khám bệnh
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default MedicalResultFormConsulting;
