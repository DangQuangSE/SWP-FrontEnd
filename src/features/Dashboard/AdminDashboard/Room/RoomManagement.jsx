import React, { useState, useEffect } from "react";
import { Card, Table, Button, Space, Tag, Popconfirm, message, Form } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchRooms, addRoom, updateRoom, deleteRoom } from "./roomAPI";
import RoomModal from "./RoomModal";
import dayjs from "dayjs";

const RoomManagement = () => {
  // States
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Load rooms on mount
  useEffect(() => {
    loadRooms();
  }, []);

  // Load rooms from API
  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      console.error("Error loading rooms:", error);
      message.error("Không thể tải danh sách phòng!");
    } finally {
      setLoading(false);
    }
  };

  // Handle add room
  const handleAddRoom = () => {
    setEditingRoom(null);
    form.resetFields();
    setIsRoomModalVisible(true);
  };

  // Handle edit room
  const handleEditRoom = (record) => {
    setEditingRoom(record);
    
    // Convert time strings to dayjs objects for TimePicker
    const formData = {
      ...record,
      openTime: record.openTime ? dayjs(record.openTime, 'HH:mm:ss') : null,
      closeTime: record.closeTime ? dayjs(record.closeTime, 'HH:mm:ss') : null,
    };
    
    form.setFieldsValue(formData);
    setIsRoomModalVisible(true);
  };

  // Handle delete room
  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      message.success("Xóa phòng thành công!");
      await loadRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      message.error("Có lỗi xảy ra khi xóa phòng!");
    }
  };

  // Handle modal OK (save)
  const handleRoomModalOk = async (roomData) => {
    try {
      if (editingRoom) {
        // Update existing room
        await updateRoom(editingRoom.id, roomData);
        message.success("Cập nhật phòng thành công!");
      } else {
        // Add new room
        await addRoom(roomData);
        message.success("Thêm phòng thành công!");
      }

      // Close modal and reset form
      setIsRoomModalVisible(false);
      form.resetFields();
      setEditingRoom(null);

      // Reload data
      await loadRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      message.error("Có lỗi xảy ra khi lưu phòng!");
    }
  };

  // Handle modal cancel
  const handleRoomModalCancel = () => {
    setIsRoomModalVisible(false);
    form.resetFields();
    setEditingRoom(null);
  };

  // Table columns definition
  const roomColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên Phòng",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
      width: 100,
    },
    {
      title: "Tiện nghi",
      dataIndex: "facilities",
      key: "facilities",
      ellipsis: true,
    },
    {
      title: "Giờ hoạt động",
      key: "workingHours",
      width: 150,
      render: (_, record) => (
        <span>
          {record.openTime} - {record.closeTime}
        </span>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specializationName",
      key: "specializationName",
      ellipsis: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditRoom(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa phòng này?"
            onConfirm={() => handleDeleteRoom(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Quản lý Phòng khám"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRoom}
          >
            Thêm Phòng
          </Button>
        }
      >
        <Table
          columns={roomColumns}
          dataSource={rooms}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} phòng`,
          }}
        />
      </Card>

      <RoomModal
        visible={isRoomModalVisible}
        onOk={handleRoomModalOk}
        onCancel={handleRoomModalCancel}
        form={form}
        editingRoom={editingRoom}
      />
    </>
  );
};

export default RoomManagement;
