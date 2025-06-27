import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

// Service Type Options
const SERVICE_TYPE_OPTIONS = [
  { value: "CONSULTING", label: "CONSULTING" },
  // { value: "DIAGNOSIS", label: "DIAGNOSIS" },
  { value: "TREATMENT", label: "TREATMENT" },
  { value: "TESTING_ON", label: "TESTING ON" },
  { value: "TESTING_OFF", label: "TESTING OFF" },
  // { value: "EXAMINATION", label: "EXAMINATION" },
  // { value: "PREVENTION", label: "PREVENTION" },
  // { value: "REHABILITATION", label: "REHABILITATION" },
  { value: "OTHER", label: "OTHER" },
];

const ServiceModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingService,
  isComboService,
  setIsComboService,
  availableServices,
  setAvailableServices,
}) => {
  const handleCancel = () => {
    setIsComboService(false);
    setAvailableServices([]);
    form.resetFields();
    onCancel();
  };

  const handleOk = async () => {
    try {
      console.log(" Form fields before validation:", form.getFieldsValue());
      const values = await form.validateFields();
      console.log(" ServiceModal form values after validation:", values);
      console.log(" ServiceModal isComboService:", isComboService);
      onOk();
    } catch (error) {
      console.error(" Form validation failed:", error);
      console.error(" Error details:", error.errorFields);
    }
  };

  return (
    <Modal
      title={
        editingService
          ? "Edit Service"
          : isComboService
          ? "Add Combo Service"
          : "Add Service"
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Service Name"
          rules={[{ required: true, message: "Please input service name!" }]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <Input.TextArea rows={3} placeholder="Enter service description" />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Duration (minutes)"
          rules={[{ required: true, message: "Please input duration!" }]}
        >
          <Input type="number" placeholder="Enter duration in minutes" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Service Type"
          rules={[{ required: true, message: "Please select service type!" }]}
        >
          <Select placeholder="Select service type">
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="price"
          label="Price (VND)"
          rules={[
            { required: !isComboService, message: "Please input price!" },
          ]}
        >
          {isComboService ? (
            <Input
              type="number"
              placeholder="Will be calculated by backend from selected services"
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          ) : (
            <Input type="number" placeholder="Enter price" />
          )}
        </Form.Item>
        <Form.Item name="discountPercent" label="Discount Percentage">
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="Enter discount percentage (0-100)"
          />
        </Form.Item>

        {/* Hiển thị trường sub-services khi isCombo = true */}
        {isComboService && (
          <Form.Item
            name="subServiceIds"
            label="Sub Services"
            rules={[
              { required: true, message: "Please select at least 2 services!" },
              {
                validator: (_, value) => {
                  console.log(" Validator checking value:", value);
                  if (value && value.length >= 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Please select at least 2 services for combo!")
                  );
                },
              },
            ]}
            extra="Select multiple services to create combo package"
          >
            <Select
              mode="multiple"
              placeholder="Select sub services to create combo"
              loading={availableServices.length === 0}
              onChange={(selectedIds) => {
                console.log(" Selected service IDs:", selectedIds);
                console.log(" Available services:", availableServices);
                // Manually set form field value
                form.setFieldsValue({ subServiceIds: selectedIds });
                console.log(" Form values after set:", form.getFieldsValue());
              }}
              notFoundContent={
                availableServices.length === 0
                  ? "Loading available services..."
                  : "No active services available"
              }
            >
              {availableServices.map((service) => {
                console.log(" Service for option:", service);
                return (
                  <Option key={service.id} value={service.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        {service.name} (ID: {service.id})
                      </span>
                      <span style={{ color: "#666", fontSize: "12px" }}>
                        {service.price?.toLocaleString() || 0}đ
                      </span>
                    </div>
                  </Option>
                );
              })}
            </Select>
            {availableServices.length === 0 && (
              <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
                💡 Only non-combo services can be selected for combo packages
              </div>
            )}
            {isComboService && (
              <div
                style={{
                  marginTop: 8,
                  padding: "8px",
                  backgroundColor: "#f0f8ff",
                  borderRadius: "4px",
                }}
              >
                <div style={{ fontSize: "12px", color: "#666" }}>
                  💰 Backend will automatically calculate total price from
                  selected services
                </div>
                <div
                  style={{ fontSize: "11px", color: "#999", marginTop: "4px" }}
                >
                  You can apply discount percentage to the final combo price
                </div>
              </div>
            )}
          </Form.Item>
        )}
        <Form.Item name="isActive" label="Status">
          <Select placeholder="Select status">
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
