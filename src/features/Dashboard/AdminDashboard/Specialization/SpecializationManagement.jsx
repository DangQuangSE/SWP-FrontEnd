import React from "react";
import { Card, Table, Button, Space, Tag, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSpecializations } from "./useSpecializations";
import SpecializationModal from "./SpecializationModal";

/**
 * Specialization Management Component
 * Handles the complete specialization management interface
 */
const SpecializationManagement = ({ form }) => {
  const {
    specializations,
    editingSpecialization,
    isSpecializationModalVisible,
    loading,
    handleEditSpecialization,
    handleAddSpecialization,
    handleSpecializationModalOk,
    handleDeleteSpecialization,
    handleSpecializationModalCancel,
  } = useSpecializations();

  // Table columns definition
  const specializationColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small" style={{ gap: "4px" }}>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSpecialization(record, form)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDeleteSpecialization(record.id)}
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              style={{ marginLeft: "-4px" }}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Manage Specializations"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddSpecialization(form)}
          >
            Add Specialization
          </Button>
        }
      >
        <Table
          columns={specializationColumns}
          dataSource={specializations}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Card>

      <SpecializationModal
        visible={isSpecializationModalVisible}
        onOk={() => handleSpecializationModalOk(form)}
        onCancel={() => handleSpecializationModalCancel(form)}
        form={form}
        editingSpecialization={editingSpecialization}
      />
    </>
  );
};

export default SpecializationManagement;
