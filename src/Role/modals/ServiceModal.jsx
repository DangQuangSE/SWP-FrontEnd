import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const ServiceModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingService,
  isComboService,
  setIsComboService,
  availableServices,
  fetchAvailableServices,
  setAvailableServices,
}) => {
  const handleCancel = () => {
    setIsComboService(false);
    setAvailableServices([]);
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingService ? "Edit Service" : "Add Service"}
      visible={visible}
      onOk={onOk}
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
            <Option value="CONSULTING">CONSULTING</Option>
            <Option value="TESTING">TESTING</Option>
            <Option value="TREATMENT">TREATMENT</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="price"
          label="Price (VND)"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>
        <Form.Item name="discountPercent" label="Discount Percentage">
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="Enter discount percentage (0-100)"
          />
        </Form.Item>
        <Form.Item name="isCombo" label="Is Combo Service">
          <Select
            placeholder="Select if this is a combo service"
            onChange={(value) => {
              setIsComboService(value);
              if (value) {
                // Load available services khi chọn combo
                fetchAvailableServices().then(setAvailableServices);
              }
            }}
          >
            <Option value={false}>No</Option>
            <Option value={true}>Yes</Option>
          </Select>
        </Form.Item>

        {/* Hiển thị trường sub-services khi isCombo = true */}
        {isComboService && (
          <Form.Item
            name="subServiceIds"
            label="Sub Services"
            rules={[
              { required: true, message: "Please select sub services!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select sub services"
              loading={availableServices.length === 0}
            >
              {availableServices.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name} - {service.price?.toLocaleString() || 0}đ
                </Option>
              ))}
            </Select>
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
