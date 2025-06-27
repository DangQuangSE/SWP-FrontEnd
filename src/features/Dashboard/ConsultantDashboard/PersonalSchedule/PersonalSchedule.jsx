import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Input,
} from "antd";
import { SolutionOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  fetchAvailableSlots,
  cancelSchedule,
} from "../../../../api/consultantAPI";
import "./PersonalSchedule.css";

const PersonalSchedule = ({ userId }) => {
  const [personalConsultations, setPersonalConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConsultationModalVisible, setIsConsultationModalVisible] =
    useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [consultForm] = Form.useForm();
  const [resultForm] = Form.useForm();

  // Load personal consultations
  const loadPersonalConsultations = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const res = await fetchAvailableSlots(userId, today, oneMonthLater);
      const slots = (res.data || []).map((slot) => ({
        id: slot.id || slot.slotId,
        date: slot.workDate || slot.date,
        time:
          slot.startTime && slot.endTime
            ? `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(
                0,
                5
              )}`
            : "",
        patient: `${slot.currentBooking || 0}/${slot.maxBooking || 0}`,
        status: slot.status || "ACTIVE",
      }));
      setPersonalConsultations(slots);
    } catch (error) {
      console.error("Error loading personal consultations:", error);
      toast.error("Không thể tải lịch tư vấn cá nhân");
      setPersonalConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  // Cancel schedule
  const handleCancelSchedule = async (record) => {
    try {
      let startTime = "08:00";
      let endTime = "09:00";
      if (record.time && record.time.includes("-")) {
        const [start, end] = record.time.split("-").map((s) => s.trim());
        startTime = start;
        endTime = end;
      }
      const scheduleData = {
        consultant_id: userId,
        date: `${record.date}T${startTime}:00`,
        startTime: startTime,
        endTime: endTime,
        reason: "Hủy lịch làm việc",
      };
      await cancelSchedule(scheduleData);
      Modal.success({ content: "Hủy lịch làm việc thành công!" });
      loadPersonalConsultations();
    } catch (error) {
      console.error("Error canceling schedule:", error);
      Modal.error({ content: "Hủy lịch làm việc thất bại!" });
    }
  };

  // Handle consultation
  const handleConsultation = () => {
    consultForm.validateFields().then((values) => {
      console.log("Consultation data:", values);
      toast.success("Tư vấn đã được ghi nhận!");
      setIsConsultationModalVisible(false);
      consultForm.resetFields();
    });
  };

  // Handle send result
  const handleSendResult = () => {
    resultForm.validateFields().then((values) => {
      console.log("Result data:", values);
      toast.success("Kết quả tư vấn đã được gửi!");
      setIsResultModalVisible(false);
      resultForm.resetFields();
    });
  };

  useEffect(() => {
    loadPersonalConsultations();
  }, [userId]);

  // Columns for consultation table
  const consultationColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "time", key: "time" },
    { title: "Bệnh nhân", dataIndex: "patient", key: "patient" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Confirmed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<SolutionOutlined />}
            size="small"
            onClick={() => setIsConsultationModalVisible(true)}
          >
            Tư vấn
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => setIsResultModalVisible(true)}
          >
            Gửi kết quả
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn hủy lịch này?"
            onConfirm={() => handleCancelSchedule(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger size="small">
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Lịch tư vấn cá nhân</h2>
      <Table
        columns={consultationColumns}
        dataSource={personalConsultations}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
        }}
      />

      {/* Modal tư vấn trực tuyến */}
      <Modal
        title="Tư vấn trực tuyến"
        open={isConsultationModalVisible}
        onOk={handleConsultation}
        onCancel={() => setIsConsultationModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={consultForm} layout="vertical">
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="consultationNotes" label="Ghi chú tư vấn">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal gửi kết quả tư vấn */}
      <Modal
        title="Gửi kết quả tư vấn"
        open={isResultModalVisible}
        onOk={handleSendResult}
        onCancel={() => setIsResultModalVisible(false)}
        okText="Gửi"
        cancelText="Hủy"
      >
        <Form form={resultForm} layout="vertical">
          <Form.Item
            name="patientName"
            label="Tên bệnh nhân"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh nhân!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="results"
            label="Kết quả"
            rules={[
              { required: true, message: "Vui lòng nhập kết quả tư vấn!" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonalSchedule;
