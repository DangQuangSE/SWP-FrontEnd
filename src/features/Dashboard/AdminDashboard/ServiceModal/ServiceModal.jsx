import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import api from "../../../../configs/api";

const { Option } = Select;

// Service Type Options
const SERVICE_TYPE_OPTIONS = [
  { value: "CONSULTING", label: "CONSULTING" },
  { value: "CONSULTING_ON", label: "CONSULTING_ON" },
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
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);

  // Fetch specializations when modal opens
  useEffect(() => {
    if (visible) {
      fetchSpecializations();
    }
  }, [visible]);

  // Set form values when editing service
  useEffect(() => {
    if (editingService && visible) {
      form.setFieldsValue({
        name: editingService.name,
        description: editingService.description,
        duration: editingService.duration,
        type: editingService.type,
        price: editingService.price,
        discountPercent: editingService.discountPercent || 0,
        specializationIds: editingService.specializationIds || [],
        subServiceIds: editingService.subServiceIds || [],
      });
    } else if (visible) {
      // Reset form when adding new service
      form.resetFields();
    }
  }, [editingService, visible, form]);

  const fetchSpecializations = async () => {
    setLoadingSpecializations(true);
    try {
      const response = await api.get("/specializations");
      const data = response.data || [];
      setSpecializations(data);
      console.log("📋 Loaded specializations:", data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
      setSpecializations([]);
    } finally {
      setLoadingSpecializations(false);
    }
  };

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
          ? "Sửa Dịch vụ"
          : isComboService
          ? "Thêm Gói Dịch vụ"
          : "Thêm Dịch vụ"
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Dịch vụ"
          rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
        >
          <Input placeholder="Nhập tên dịch vụ" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <Input.TextArea rows={3} placeholder="Nhập mô tả dịch vụ" />
        </Form.Item>
        <Form.Item
          name="duration"
          label="Thời gian (phút)"
          rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
        >
          <Input type="number" placeholder="Nhập thời gian tính bằng phút" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại Dịch vụ"
          rules={[{ required: true, message: "Vui lòng chọn loại dịch vụ!" }]}
        >
          <Select placeholder="Chọn loại dịch vụ">
            {SERVICE_TYPE_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="specializationIds"
          label="Chuyên khoa"
          rules={[{ required: true, message: "Vui lòng chọn chuyên khoa!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn chuyên khoa"
            loading={loadingSpecializations}
            allowClear
          >
            {specializations.map((specialization) => (
              <Option key={specialization.id} value={specialization.id}>
                {specialization.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá (VND)"
          rules={[{ required: !isComboService, message: "Vui lòng nhập giá!" }]}
        >
          {isComboService ? (
            <Input
              type="number"
              placeholder="Sẽ được tính tự động từ các dịch vụ đã chọn"
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          ) : (
            <Input type="number" placeholder="Nhập giá" />
          )}
        </Form.Item>

        <Form.Item name="discountPercent" label="Phần trăm Giảm giá">
          <Input
            type="number"
            min={0}
            max={100}
            placeholder="Nhập phần trăm giảm giá (0-100)"
          />
        </Form.Item>

        {/* Hiển thị trường sub-services khi isCombo = true */}
        {isComboService && (
          <Form.Item
            name="subServiceIds"
            label="Dịch vụ Con"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 2 dịch vụ!" },
              {
                validator: (_, value) => {
                  console.log(" Validator checking value:", value);
                  if (value && value.length >= 2) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Vui lòng chọn ít nhất 2 dịch vụ cho gói!")
                  );
                },
              },
            ]}
            extra="Chọn nhiều dịch vụ để tạo gói dịch vụ"
          >
            <Select
              mode="multiple"
              placeholder="Chọn dịch vụ con để tạo gói"
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
                  ? "Đang tải dịch vụ..."
                  : "Không có dịch vụ nào"
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
                💡 Chỉ có thể chọn các dịch vụ đơn lẻ cho gói dịch vụ
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
                  Hệ thống sẽ tự động tính tổng giá từ các dịch vụ đã chọn
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
        {/* <Form.Item name="isActive" label="Status">
          <Select placeholder="Select status">
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ServiceModal;
