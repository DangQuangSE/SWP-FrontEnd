import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  ConfigProvider,
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
  ExperimentOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { submitLabTestResult } from "../../api/medicalResultAPI";
import "./MedicalResultFormTesting.css";

dayjs.locale("vi");

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

/**
 * Medical Result Form for Testing Services
 * Form chuyên dụng cho dịch vụ xét nghiệm
 */
const MedicalResultFormTesting = ({
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
      const formValues = { ...initialData };
      if (formValues.sampleCollectedAt) {
        formValues.sampleCollectedAt = dayjs(formValues.sampleCollectedAt);
      }
      form.setFieldsValue(formValues);
    }
  }, [form, initialData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("[DEBUG] Submitting testing form data:", values);

      // Convert dayjs to ISO string
      const submitData = {
        ...values,
        appointmentDetailId: appointmentDetail?.id || 123,
        resultType: "LAB_TEST",
        sampleCollectedAt: values.sampleCollectedAt?.toISOString(),
      };

      console.log("[DEBUG] Final submit data:", submitData);

      // Call API /api/result/lab-test
      const response = await submitLabTestResult(submitData);
      message.success("Lưu kết quả xét nghiệm thành công!");
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
        "Có lỗi xảy ra khi lưu kết quả xét nghiệm";

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
      className="medical-result-form-testing"
      title={
        <div className="form-title">
          <ExperimentOutlined />
          <span>Kết quả xét nghiệm</span>
          {appointmentDetail && <Tag color="blue">#{appointmentDetail.id}</Tag>}
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
              TESTING
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
        <Row gutter={24}>
          {/* Left Column - Thông tin xét nghiệm */}
          <Col span={12}>
            <Card
              className="form-section-card test-info-section"
              size="small"
              title="Thông tin xét nghiệm"
            >
              <Form.Item
                name="testName"
                label="Tên xét nghiệm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên xét nghiệm!" },
                ]}
              >
                <Input placeholder="Ví dụ: HIV Ag/Ab Combo Test" />
              </Form.Item>

              <Form.Item
                name="testMethod"
                label="Phương pháp xét nghiệm"
                rules={[
                  { required: true, message: "Vui lòng chọn phương pháp!" },
                ]}
              >
                <Select placeholder="Chọn phương pháp">
                  <Option value="ELISA">ELISA</Option>
                  <Option value="PCR">PCR</Option>
                  <Option value="Western Blot">Western Blot</Option>
                  <Option value="Rapid Test">Rapid Test</Option>
                  <Option value="Culture">Culture</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="specimenType"
                label="Loại mẫu bệnh phẩm"
                rules={[{ required: true, message: "Vui lòng chọn loại mẫu!" }]}
              >
                <Select placeholder="Chọn loại mẫu">
                  <Option value="Blood">Máu</Option>
                  <Option value="Urine">Nước tiểu</Option>
                  <Option value="Saliva">Nước bọt</Option>
                  <Option value="Swab">Dịch tiết</Option>
                  <Option value="Tissue">Mô</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="sampleCollectedAt"
                label="Thời gian lấy mẫu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian lấy mẫu!",
                  },
                ]}
              >
                <ConfigProvider locale={locale}>
                  <DatePicker
                    className="date-picker-full-width"
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn thời gian lấy mẫu"
                  />
                </ConfigProvider>
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Kết quả */}
          <Col span={12}>
            <Card
              className="form-section-card test-result-section"
              size="small"
              title="Kết quả xét nghiệm"
            >
              <Form.Item
                name="testResult"
                label="Kết quả"
                rules={[{ required: true, message: "Vui lòng nhập kết quả!" }]}
              >
                <Input placeholder="Ví dụ: Non-reactive" />
              </Form.Item>

              <Form.Item
                name="normalRange"
                label="Giá trị tham chiếu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập giá trị tham chiếu!",
                  },
                ]}
              >
                <Input placeholder="Ví dụ: Non-reactive" />
              </Form.Item>

              <Form.Item
                name="testStatus"
                label="Trạng thái kết quả"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="NORMAL">Bình thường</Option>
                  <Option value="ABNORMAL">Bất thường</Option>
                  <Option value="CRITICAL">Nguy hiểm</Option>
                  <Option value="PENDING">Chờ kết quả</Option>
                  <Option value="INVALID">Không hợp lệ</Option>
                </Select>
              </Form.Item>

              <Form.Item name="labNotes" label="Ghi chú phòng lab">
                <TextArea
                  className="form-field-textarea"
                  rows={3}
                  placeholder="Ví dụ: Mẫu đạt chất lượng, kết quả tin cậy"
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        {/* Clinical Assessment */}
        <Card
          className="clinical-assessment-card clinical-assessment-section"
          size="small"
          title="Đánh giá lâm sàng"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="description"
                label="Mô tả triệu chứng"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả!" },
                  { min: 10, message: "Mô tả phải có ít nhất 10 ký tự!" },
                ]}
              >
                <TextArea
                  className="form-field-textarea"
                  rows={4}
                  placeholder="Ví dụ: Kiểm tra định kỳ HIV theo yêu cầu của bệnh nhân"
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
                  className="form-field-textarea"
                  rows={4}
                  placeholder="Ví dụ: Âm tính với HIV, không phát hiện kháng thể"
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
                  className="form-field-textarea"
                  rows={4}
                  placeholder="Ví dụ: Không cần điều trị, kiểm tra lại sau 6 tháng"
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
              Lưu kết quả xét nghiệm
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default MedicalResultFormTesting;
