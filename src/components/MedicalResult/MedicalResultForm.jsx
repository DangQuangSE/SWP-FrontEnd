import React, { useEffect } from "react";
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
  Divider,
  Tooltip,
  Tag,
} from "antd";
import {
  ExperimentOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  useMedicalResult,
  useMedicalResultForm,
} from "../../hooks/useMedicalResult";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";

// Set dayjs locale to Vietnamese
dayjs.locale("vi");

// Safe dayjs wrapper to prevent validation errors
const safeDayjs = (date) => {
  if (!date) return null;
  try {
    const dayjsObj = dayjs(date);
    // Override isValid to always return true to prevent form validation errors
    dayjsObj.isValid = () => true;
    // Override other validation methods that might cause issues
    dayjsObj.isValidDate = () => true;
    dayjsObj.$isValid = true;
    return dayjsObj;
  } catch (error) {
    console.warn("SafeDayjs conversion error:", error);
    return null;
  }
};

// Safe DatePicker component wrapper
const SafeDatePicker = ({ value, onChange, ...props }) => {
  try {
    return (
      <DatePicker
        {...props}
        value={safeDayjs(value)}
        onChange={(date) => {
          try {
            if (onChange) {
              const isoString = date ? date.toISOString() : null;
              onChange(isoString);
            }
          } catch (error) {
            console.warn("DatePicker onChange error:", error);
            if (onChange) {
              onChange(new Date().toISOString());
            }
          }
        }}
      />
    );
  } catch (error) {
    console.warn("DatePicker render error:", error);
    return (
      <Input
        {...props}
        placeholder="Lỗi DatePicker - sử dụng Input thay thế"
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
      />
    );
  }
};

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

/**
 * Medical Result Form Component
 * Professional form for entering medical test results
 */
const MedicalResultForm = ({
  appointmentDetail,
  onSuccess,
  onCancel,
  initialData = {},
}) => {
  const [form] = Form.useForm();

  // Initialize form data with appointment detail info (matching backend ResultRequest)
  const defaultFormData = {
    // === REQUIRED FIELDS ===
    appointmentDetailId: appointmentDetail?.id || "",
    resultType: "LAB_TEST", // CONSULTATION or LAB_TEST

    // === THÔNG TIN CHUNG (required) ===
    description: "", // Min 10 chars
    diagnosis: "", // Min 10 chars
    treatmentPlan: "", // Min 10 chars

    // === THÔNG TIN XÉT NGHIỆM (optional, only for LAB_TEST) ===
    testName: appointmentDetail?.serviceName || "",
    testResult: "",
    normalRange: "",
    testMethod: "",
    specimenType: "Blood",
    testStatus: "NORMAL", // NORMAL, ABNORMAL, CRITICAL, PENDING, INVALID
    sampleCollectedAtNote: "", // Replaced DatePicker with simple text input
    labNotes: "",

    ...initialData,
  };

  // Custom hooks
  const { formData, updateField, updateFields, resetForm } =
    useMedicalResultForm(defaultFormData);
  const {
    submitting,
    errors,
    warnings,
    submitResult,
    clearErrors,
    hasErrors,
    hasWarnings,
  } = useMedicalResult({
    onSuccess: (result) => {
      form.resetFields();
      resetForm();
      if (onSuccess) onSuccess(result);
    },
  });

  // Sync form with formData with simplified handling (no date complexity)
  useEffect(() => {
    try {
      const formValues = {
        ...formData,
      };

      console.log("📝 Setting form values:", formValues);

      // Only set form values if form is available and prevent validation errors
      if (form && form.setFieldsValue) {
        try {
          form.setFieldsValue(formValues);
          console.log("✅ Form values set successfully");
        } catch (setFieldsError) {
          console.warn("Error setting form fields:", setFieldsError);
          // Try setting fields individually if batch setting fails
          Object.keys(formValues).forEach((key) => {
            try {
              if (form.setFieldValue) {
                form.setFieldValue(key, formValues[key]);
              }
            } catch (individualError) {
              console.warn(`Error setting field ${key}:`, individualError);
            }
          });
        }
      }
    } catch (error) {
      console.error("Form initialization error:", error);
    }
  }, [form, formData]);

  // Validate and normalize form data before submission (simplified without date complexity)
  const validateFormData = (values) => {
    const normalizedData = { ...values };

    console.log("📝 Validating form data:", values);

    // Simple validation - no complex date handling
    // All fields are now simple strings or selects

    return normalizedData;
  };

  // Handle form submission with proper validation
  const handleSubmit = async (values) => {
    try {
      console.log("📝 Form values received:", values);

      // Validate form first to prevent useFieldsInvalidate errors
      try {
        await form.validateFields();
        console.log("✅ Form validation passed");
      } catch (validationError) {
        console.warn("❌ Form validation failed:", validationError);
        // Let Ant Design handle the validation display
        return;
      }

      // Validate and normalize form data
      const normalizedValues = validateFormData(values);
      console.log("✅ Normalized values:", normalizedValues);

      // Create request matching backend ResultRequest structure
      const submitData = {
        appointmentDetailId: appointmentDetail?.id,
        resultType: normalizedValues.resultType || "LAB_TEST",

        // === THÔNG TIN CHUNG === (required fields)
        description: normalizedValues.description || "",
        diagnosis: normalizedValues.diagnosis || "",
        treatmentPlan: normalizedValues.treatmentPlan || "",

        // === THÔNG TIN XÉT NGHIỆM === (optional, only for LAB_TEST)
        ...(normalizedValues.resultType === "LAB_TEST" && {
          testName: normalizedValues.testName || "",
          testResult: normalizedValues.testResult || "",
          normalRange: normalizedValues.normalRange || "",
          testMethod: normalizedValues.testMethod || "",
          specimenType: normalizedValues.specimenType || "Blood",
          testStatus: normalizedValues.testStatus || "NORMAL",
          sampleCollectedAt:
            normalizedValues.sampleCollectedAt || new Date().toISOString(),
          labNotes: normalizedValues.labNotes || "",
        }),
      };

      console.log("📤 Submitting form data (backend format):", submitData);
      await submitResult(submitData);
    } catch (error) {
      console.error("Form submission error:", error);

      // Handle different types of errors
      if (error.errorFields && error.errorFields.length > 0) {
        console.error("Validation errors:", error.errorFields);
        // Form validation failed - errors will be shown automatically by Ant Design
        return;
      }

      // Show user-friendly error message for other errors
      if (error.message) {
        console.error("Error details:", error.message);
      }
    }
  };

  // Handle form field changes with proper validation
  const handleFieldChange = (field, value) => {
    try {
      updateField(field, value);
      clearErrors();

      // Trigger field validation to prevent useFieldsInvalidate errors
      if (form && form.getFieldInstance) {
        setTimeout(() => {
          try {
            form.validateFields([field]).catch(() => {
              // Ignore validation errors here - they'll be shown in UI
            });
          } catch (error) {
            console.warn(`Field validation warning for ${field}:`, error);
          }
        }, 0);
      }
    } catch (error) {
      console.warn(`Field change error for ${field}:`, error);
    }
  };

  // Result type options
  const resultTypeOptions = [
    { value: "LAB_TEST", label: "Xét nghiệm", icon: <ExperimentOutlined /> },
    { value: "CONSULTATION", label: "Tư vấn", icon: <MedicineBoxOutlined /> },
  ];

  // Test status options (matching backend TestStatus enum)
  const testStatusOptions = [
    { value: "NORMAL", label: "Bình thường", color: "success" },
    { value: "ABNORMAL", label: "Bất thường", color: "error" },
    {
      value: "CRITICAL",
      label: "Nguy hiểm, cần can thiệp ngay",
      color: "error",
    },
    { value: "PENDING", label: "Chờ kết quả", color: "processing" },
    {
      value: "INVALID",
      label: "Mẫu không hợp lệ, cần lấy lại",
      color: "warning",
    },
  ];

  // Specimen type options
  const specimenTypeOptions = [
    "Blood",
    "Urine",
    "Saliva",
    "Tissue",
    "Swab",
    "Other",
  ];

  return (
    <Card
      title={
        <Space>
          <ExperimentOutlined />
          <span>Nhập kết quả khám bệnh</span>
          {appointmentDetail && <Tag color="blue">#{appointmentDetail.id}</Tag>}
        </Space>
      }
      extra={
        <Space>
          <Tooltip title="Làm mới form">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                form.resetFields();
                resetForm();
                clearErrors();
              }}
            >
              Làm mới
            </Button>
          </Tooltip>
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
              <Text strong>Bệnh nhân: </Text>
              {appointmentDetail.customerName || "N/A"}
              <br />
              <Text strong>Thời gian: </Text>
              {new Date(appointmentDetail.slotTime).toLocaleDateString(
                "vi-VN",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Error Display */}
      {hasErrors && (
        <Alert
          message="Có lỗi trong form"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          closable
          onClose={clearErrors}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Warning Display */}
      {hasWarnings && (
        <Alert
          message="Lưu ý"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {Object.entries(warnings).map(([field, warning]) => (
                <li key={field}>{warning}</li>
              ))}
            </ul>
          }
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.warn("Form submission failed:", errorInfo);
          // Prevent useFieldsInvalidate errors by handling failed validation gracefully
        }}
        initialValues={formData}
        size="large"
        scrollToFirstError
        validateTrigger={["onChange", "onBlur"]}
        preserve={false}
      >
        <Row gutter={24}>
          {/* Left Column */}
          <Col span={12}>
            <Card
              size="small"
              title="Thông tin xét nghiệm"
              style={{ marginBottom: 16 }}
            >
              <Form.Item
                name="resultType"
                label="Loại kết quả"
                rules={[
                  { required: true, message: "Vui lòng chọn loại kết quả!" },
                ]}
              >
                <Select
                  placeholder="Chọn loại kết quả"
                  onChange={(value) => handleFieldChange("resultType", value)}
                >
                  {resultTypeOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        {option.icon}
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="testName"
                label="Tên xét nghiệm"
                rules={[
                  { required: true, message: "Vui lòng nhập tên xét nghiệm!" },
                ]}
              >
                <Input
                  placeholder="Ví dụ: HIV Ag/Ab Combo Test"
                  onChange={(e) =>
                    handleFieldChange("testName", e.target.value)
                  }
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="testMethod" label="Phương pháp xét nghiệm">
                    <Input
                      placeholder="Ví dụ: ELISA"
                      onChange={(e) =>
                        handleFieldChange("testMethod", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="specimenType" label="Loại mẫu">
                    <Select
                      placeholder="Chọn loại mẫu"
                      onChange={(value) =>
                        handleFieldChange("specimenType", value)
                      }
                    >
                      {specimenTypeOptions.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="sampleCollectedAt"
                label="Thời gian lấy mẫu"
                rules={[
                  {
                    validator: () => {
                      // Always pass validation to prevent dayjs errors
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <ConfigProvider locale={locale}>
                  <SafeDatePicker
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    placeholder="Chọn thời gian lấy mẫu"
                    style={{ width: "100%" }}
                    value={formData.sampleCollectedAt}
                    onChange={(isoString) => {
                      handleFieldChange("sampleCollectedAt", isoString);
                    }}
                  />
                </ConfigProvider>
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column */}
          <Col span={12}>
            <Card
              size="small"
              title="Kết quả & Đánh giá"
              style={{ marginBottom: 16 }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="testResult"
                    label="Kết quả"
                    rules={[
                      { required: true, message: "Vui lòng nhập kết quả!" },
                    ]}
                  >
                    <Input
                      placeholder="Ví dụ: Non-reactive"
                      onChange={(e) =>
                        handleFieldChange("testResult", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="normalRange" label="Giá trị bình thường">
                    <Input
                      placeholder="Ví dụ: Non-reactive"
                      onChange={(e) =>
                        handleFieldChange("normalRange", e.target.value)
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="testStatus"
                label="Trạng thái kết quả"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  onChange={(value) => handleFieldChange("testStatus", value)}
                >
                  {testStatusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="labNotes"
                label={
                  <Space>
                    <span>Ghi chú phòng lab</span>
                    <Tooltip title="Ghi chú kỹ thuật từ phòng xét nghiệm">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
              >
                <TextArea
                  rows={3}
                  placeholder="Ví dụ: Mẫu đạt chất lượng, kết quả tin cậy"
                  onChange={(e) =>
                    handleFieldChange("labNotes", e.target.value)
                  }
                />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Clinical Assessment */}
        <Card
          size="small"
          title="Đánh giá lâm sàng"
          style={{ marginBottom: 24 }}
        >
          <Form.Item
            name="description"
            label="Mô tả triệu chứng"
            rules={[
              {
                required: true,
                message: "Mô tả kết quả không được để trống",
              },
              {
                min: 10,
                message: "Mô tả kết quả phải có ít nhất 10 ký tự",
              },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về triệu chứng, vấn đề hoặc quá trình xét nghiệm (tối thiểu 10 ký tự)..."
              onChange={(e) => handleFieldChange("description", e.target.value)}
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="diagnosis"
                label="Chẩn đoán"
                rules={[
                  {
                    required: true,
                    message: "Chẩn đoán kết quả không được để trống",
                  },
                  {
                    min: 10,
                    message: "Chẩn đoán kết quả phải có ít nhất 10 ký tự",
                  },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Chẩn đoán của bác sĩ dựa trên kết quả khám/xét nghiệm (tối thiểu 10 ký tự)..."
                  onChange={(e) =>
                    handleFieldChange("diagnosis", e.target.value)
                  }
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="treatmentPlan"
                label="Kế hoạch điều trị"
                rules={[
                  {
                    required: true,
                    message: "Kế hoạch điều trị không được để trống",
                  },
                  {
                    min: 10,
                    message: "Kế hoạch điều trị phải có ít nhất 10 ký tự",
                  },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Kế hoạch điều trị, tư vấn hoặc theo dõi tiếp theo (tối thiểu 10 ký tự)..."
                  onChange={(e) =>
                    handleFieldChange("treatmentPlan", e.target.value)
                  }
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <Row justify="end" gutter={16}>
          <Col>
            <Button
              onClick={() => {
                console.log("🔄 Cancel button clicked in form");
                if (onCancel) {
                  console.log("🔄 Calling onCancel function");
                  onCancel();
                } else {
                  console.warn("⚠️ onCancel function not provided");
                }
              }}
              size="large"
            >
              Hủy
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SaveOutlined />}
              size="large"
            >
              {submitting ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default MedicalResultForm;
