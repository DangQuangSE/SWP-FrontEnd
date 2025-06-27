import React from "react";
import { Modal, Form, Input } from "antd";

const { TextArea } = Input;

const SpecializationModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingSpecialization,
}) => {
  return (
    <Modal
      title={editingSpecialization ? "Sửa Chuyên khoa" : "Thêm Chuyên khoa"}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên Chuyên khoa"
          rules={[
            { required: true, message: "Vui lòng nhập tên chuyên khoa!" },
          ]}
        >
          <Input placeholder="Nhập tên chuyên khoa" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả chuyên khoa" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SpecializationModal;
