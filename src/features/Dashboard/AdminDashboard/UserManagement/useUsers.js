import { useState, useEffect } from "react";
import { message } from "antd";
import { fetchUsers, addUser, updateUser, deleteUser } from "./userAPI";
import dayjs from "dayjs";

/**
 * Custom hook for managing Users
 */
export const useUsers = () => {
  // States
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from API
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      message.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit user
  const handleEditUser = (record) => {
    setEditingUser(record);
    setIsUserModalVisible(true);
  };

  // Handle add new user
  const handleAddUser = (form) => {
    setEditingUser(null);
    form.resetFields();
    setIsUserModalVisible(true);
  };

  // Handle modal OK (save)
  const handleUserModalOk = async (form) => {
    try {
      const values = await form.validateFields();

      // Format data theo API request
      const userData = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
          : null,
        specializationIds: values.specializationIds || [],
      };

      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, userData);
        message.success("Cập nhật người dùng thành công!");
      } else {
        // Add new user
        await addUser(userData);
        message.success("Thêm người dùng thành công!");
      }

      // Close modal and reset form
      setIsUserModalVisible(false);
      form.resetFields();
      setEditingUser(null);

      // Reload data
      await loadUsers();
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      message.error("Có lỗi xảy ra khi xử lý người dùng!");
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      message.success("Xóa người dùng thành công!");
      await loadUsers();
    } catch (error) {
      console.error("Lỗi xóa người dùng:", error);
      message.error("Có lỗi xảy ra khi xóa người dùng!");
    }
  };

  // Handle modal cancel
  const handleUserModalCancel = (form) => {
    setIsUserModalVisible(false);
    form.resetFields();
    setEditingUser(null);
  };

  return {
    // States
    users,
    editingUser,
    isUserModalVisible,
    loading,

    // Actions
    handleEditUser,
    handleAddUser,
    handleUserModalOk,
    handleDeleteUser,
    handleUserModalCancel,
    loadUsers,
  };
};
