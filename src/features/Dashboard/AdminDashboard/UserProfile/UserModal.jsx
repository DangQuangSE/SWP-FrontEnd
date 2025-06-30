import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const UserModal = ({ visible, onOk, onCancel, form, editingUser }) => {
  return (
    <Modal
      title={editingUser ? "Edit User" : "Add User"}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="User Name"
          rules={[{ required: true, message: "Please input user name!" }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select placeholder="Select a role">
            <Option value="User">Customer</Option>
            <Option value="Consultant">Consultant</Option>
            <Option value="Admin">Staff</Option>
            <Option value="Admin">Admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
