import { useState, useEffect } from "react";
import { message } from "antd";
import {
  fetchSpecializations,
  addSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "./specializationAPI";

/**
 * Custom hook for managing Specializations
 */
export const useSpecializations = () => {
  // States
  const [specializations, setSpecializations] = useState([]);
  const [editingSpecialization, setEditingSpecialization] = useState(null);
  const [isSpecializationModalVisible, setIsSpecializationModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  // Load specializations on mount
  useEffect(() => {
    loadSpecializations();
  }, []);

  // Load specializations from API
  const loadSpecializations = async () => {
    try {
      setLoading(true);
      const data = await fetchSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error("Error loading specializations:", error);
      message.error("Không thể tải danh sách specializations!");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit specialization
  const handleEditSpecialization = (record, form) => {
    setEditingSpecialization(record);
    form.setFieldsValue(record);
    setIsSpecializationModalVisible(true);
  };

  // Handle add new specialization
  const handleAddSpecialization = (form) => {
    setEditingSpecialization(null);
    form.resetFields();
    setIsSpecializationModalVisible(true);
  };

  // Handle modal OK (save)
  const handleSpecializationModalOk = async (form) => {
    try {
      const values = await form.validateFields();
      console.log(" Form values:", values);

      if (editingSpecialization) {
        // Update existing specialization
        console.log(" Updating specialization:", editingSpecialization.id);
        await updateSpecialization(editingSpecialization.id, values);
        message.success("Cập nhật specialization thành công!");
      } else {
        // Add new specialization
        console.log(" Adding new specialization");
        const specializationData = {
          ...values,
          isActive: true, // Thêm isActive mặc định
        };
        await addSpecialization(specializationData);
        message.success("Thêm specialization thành công!");
      }

      // Close modal and reset form
      setIsSpecializationModalVisible(false);
      form.resetFields();
      setEditingSpecialization(null);

      // Reload data
      await loadSpecializations();
    } catch (error) {
      console.error(" Lỗi cập nhật specialization:", error);
      console.error("Error details:", error.response?.data);

      // Hiển thị lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi xử lý specialization!";
      message.error(errorMessage);
    }
  };

  // Handle delete specialization
  const handleDeleteSpecialization = async (id) => {
    try {
      await deleteSpecialization(id);
      message.success("Xóa specialization thành công!");
      // Reload data
      await loadSpecializations();
    } catch (error) {
      console.error("Lỗi xóa specialization:", error);
      message.error("Có lỗi xảy ra khi xóa specialization!");
    }
  };

  // Handle modal cancel
  const handleSpecializationModalCancel = (form) => {
    setIsSpecializationModalVisible(false);
    setEditingSpecialization(null);
    form.resetFields();
  };

  return {
    // States
    specializations,
    editingSpecialization,
    isSpecializationModalVisible,
    loading,

    // Actions
    handleEditSpecialization,
    handleAddSpecialization,
    handleSpecializationModalOk,
    handleDeleteSpecialization,
    handleSpecializationModalCancel,
    loadSpecializations,
  };
};
