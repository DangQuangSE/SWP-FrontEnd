import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
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
import api from "../../configs/api";

const { TextArea } = Input;
const { Option } = Select;
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
  const [loadingProtocols, setLoadingProtocols] = useState(false);
  const [treatmentProtocols, setTreatmentProtocols] = useState([]);

  // Fetch treatment protocols
  const fetchTreatmentProtocols = async () => {
    try {
      setLoadingProtocols(true);
      const response = await api.get('/treatment');
      setTreatmentProtocols(response.data || []);
    } catch (error) {
      console.error("Error fetching treatment protocols:", error);
      setTreatmentProtocols([]);
    } finally {
      setLoadingProtocols(false);
    }
  };

  // Load treatment protocols on component mount
  useEffect(() => {
    fetchTreatmentProtocols();
  }, []);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    form.setFieldValue(field, value);
  };

  // Dữ liệu mẫu cho form khám bệnh/tư vấn
  const defaultFormData = {
    appointmentDetailId: appointmentDetail?.id || 123,
    description:
      "Bệnh nhân có triệu chứng ngứa, đau rát vùng kín, có dịch tiết bất thường",
    diagnosis: "Viêm âm đạo do nấm Candida",
    treatmentPlan: "Sử dụng thuốc kháng nấm, tái khám sau 1 tuần",
    treatmentProtocolId: null,
  };

  // Set initial form values
  React.useEffect(() => {
    const formValues = { ...defaultFormData, ...initialData };
    form.setFieldsValue(formValues);
  }, [form, initialData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log("[DEBUG] Submitting consulting form data:", values);

      const submitData = {
        ...values,
        appointmentDetailId: appointmentDetail?.id || 123,
        resultType: "CONSULTATION",
        treatmentProtocolId: values.treatmentProtocolId || null,
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
    form.setFieldsValue(defaultFormData);
    message.info("Đã reset form về dữ liệu mẫu");
  };

  return (
    <Card
      title={
        <Space>
          <MedicineBoxOutlined />
          <span>Kết quả khám bệnh & tư vấn</span>
          {appointmentDetail && (
            <Tag color="green">#{appointmentDetail.id}</Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      }
    >
      {/* Patient Info */}
      {appointmentDetail && (
        <Alert
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
          style={{ marginBottom: 24 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={defaultFormData}
      >
        {/* Clinical Assessment - Full Width */}
        <Card
          size="small"
          title="Đánh giá lâm sàng"
          style={{ marginBottom: 24 }}
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
                  rows={6}
                  placeholder="Ví dụ: Sử dụng thuốc kháng nấm, tái khám sau 1 tuần"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="treatmentProtocolId"
                label="Phác đồ điều trị"
                extra="Chọn phác đồ điều trị có sẵn (không bắt buộc)"
              >
                <Select
                  placeholder="Chọn phác đồ điều trị..."
                  loading={loadingProtocols}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(value) => handleFieldChange("treatmentProtocolId", value)}
                >
                  {treatmentProtocols.map((protocol) => (
                    <Option key={protocol.id} value={protocol.id}>
                      {protocol.diseaseName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Additional Notes */}
        <Card size="small" title="Ghi chú bổ sung" style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="symptoms" label="Triệu chứng chi tiết">
                <TextArea
                  rows={4}
                  placeholder="Mô tả chi tiết các triệu chứng quan sát được..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="recommendations" label="Khuyến nghị">
                <TextArea
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
                <TextArea rows={2} placeholder="Ghi chú riêng của bác sĩ..." />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Submit Buttons */}
        <div style={{ textAlign: "right" }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button
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
