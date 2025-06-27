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
      title={editingSpecialization ? "Edit Specialization" : "Add Specialization"}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Specialization Name"
          rules={[{ required: true, message: "Please input specialization name!" }]}
        >
          <Input placeholder="Enter specialization name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please input description!" }]}
        >
          <TextArea 
            rows={4} 
            placeholder="Enter specialization description" 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SpecializationModal;
