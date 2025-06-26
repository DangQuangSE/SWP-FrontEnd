import React from "react";
import { Modal, Form, Input, Select } from "antd";

const { Option } = Select;

const RoomModal = ({
  visible,
  onOk,
  onCancel,
  form,
  editingRoom,
}) => {
  return (
    <Modal
      title={editingRoom ? "Edit Medical Room" : "Add Medical Room"}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="roomName"
          label="Room Name"
          rules={[{ required: true, message: "Please input room name!" }]}
        >
          <Input placeholder="Enter room name" />
        </Form.Item>
        <Form.Item
          name="capacity"
          label="Capacity"
          rules={[{ required: true, message: "Please input capacity!" }]}
        >
          <Input type="number" placeholder="Enter room capacity" />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Select room status">
            <Option value="Available">Available</Option>
            <Option value="Occupied">Occupied</Option>
            <Option value="Maintenance">Maintenance</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoomModal;
