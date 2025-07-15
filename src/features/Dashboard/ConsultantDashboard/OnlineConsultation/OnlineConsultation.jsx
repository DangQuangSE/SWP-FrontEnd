import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  message,
  DatePicker,
  Tabs,
  Space,
  Modal,
  Form,
  Input,
  Row,
  Col,
} from "antd";
import {
  SolutionOutlined,
  VideoCameraOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  updateAppointmentDetailStatus,
  getMySchedule,
} from "../../../../api/consultantAPI";
import MedicalResultViewer from "../../../../components/MedicalResult/MedicalResultViewer";
import MedicalResultForm from "../../../../components/MedicalResult/MedicalResultForm";
import PatientDetailButton from "../PatientHistory/PatientDetailButton";
import "./OnlineConsultation.css";

const OnlineConsultation = ({ setIsConsultationModalVisible, userId }) => {
  // State để lưu dữ liệu đã được lọc theo ngày theo từng tab
  const [tabsData, setTabsData] = useState({
    CONFIRMED: [], // Đã xác nhận - sẵn sàng tư vấn
    IN_PROGRESS: [], // Đang tư vấn
    WAITING_RESULT: [], // Chờ kết quả
    COMPLETED: [], // Hoàn thành
  });

  // State để hiển thị loading khi đang tải dữ liệu
  const [isLoadingData, setIsLoadingData] = useState(false);

  // State để lưu ngày được chọn (mặc định là hôm nay)
  const [currentSelectedDate, setCurrentSelectedDate] = useState(new Date());

  // State để quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("confirmed");

  // State cho modal nhập kết quả khám
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null);

  // Form cho modal tư vấn
  const [consultForm] = Form.useForm();

  // Hàm để lấy dữ liệu tư vấn trực tuyến theo status (giống PersonalSchedule)
  const loadAppointmentsByStatus = async (date, status) => {
    try {
      console.log(`📡 [API] Loading ${status} appointments for ${date}`);

      const response = await getMySchedule(date, status);
      const appointments = response.data || [];

      // Lọc chỉ lấy những cuộc hẹn tư vấn trực tuyến có startUrl
      const onlineConsultationData = appointments.filter(
        (singleAppointment) => {
          // Kiểm tra xem có phải là tư vấn trực tuyến không
          const isOnlineConsultation =
            singleAppointment.serviceType === "CONSULTING_ON";

          // Kiểm tra xem có startUrl để bắt đầu tư vấn không
          const hasStartUrl = singleAppointment.appointmentDetails?.some(
            (detail) => detail.startUrl
          );

          // Chỉ lấy những cuộc hẹn vừa là tư vấn trực tuyến vừa có startUrl
          return isOnlineConsultation && hasStartUrl;
        }
      );

      console.log(
        ` [API] Loaded ${onlineConsultationData.length} ${status} online consultations`
      );

      // Cập nhật state cho tab cụ thể
      setTabsData((prev) => ({
        ...prev,
        [status]: onlineConsultationData,
      }));

      return onlineConsultationData;
    } catch (error) {
      console.error(` Error loading ${status} appointments:`, error);
      message.error(`Không thể tải danh sách ${status}`);
      return [];
    }
  };

  // Hàm để tải tất cả tabs (giống PersonalSchedule)
  const loadAllTabsData = async (targetDate) => {
    setIsLoadingData(true);

    try {
      const statuses = [
        "CONFIRMED",
        "IN_PROGRESS",
        "WAITING_RESULT",
        "COMPLETED",
      ];

      // Load all statuses in parallel
      const promises = statuses.map((status) => {
        console.log(`📡 [API_CALL] Loading ${status} for ${targetDate}`);
        return loadAppointmentsByStatus(targetDate, status);
      });

      const results = await Promise.allSettled(promises);

      // Log results
      results.forEach((result, index) => {
        const status = statuses[index];
        if (result.status === "fulfilled") {
          console.log(
            ` [PARALLEL] ${status}: ${result.value.length} appointments`
          );
        } else {
          console.error(` [PARALLEL] ${status} failed:`, result.reason);
        }
      });

      const successCount = results.filter(
        (r) => r.status === "fulfilled"
      ).length;
      toast.success(`Đã tải ${successCount}/${statuses.length} tab thành công`);
    } catch (error) {
      console.error(" Error loading all tabs data:", error);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setIsLoadingData(false);
    }
  };

  // useEffect chạy khi component được mount (hiển thị lần đầu) hoặc khi userId thay đổi
  useEffect(() => {
    // Chỉ gọi API khi có userId
    if (userId) {
      const today = dayjs().format("YYYY-MM-DD");
      loadAllTabsData(today);
    }
  }, [userId]); // Chạy lại khi userId thay đổi

  // Hàm xử lý khi người dùng thay đổi ngày trong DatePicker
  const handleDatePickerChange = (newSelectedDate) => {
    // Nếu người dùng không chọn ngày nào, sử dụng ngày hôm nay
    const dateToUse = newSelectedDate || dayjs();

    // Chuyển từ dayjs object thành JavaScript Date object
    const javascriptDateObject = dateToUse.toDate();
    const dateString = dateToUse.format("YYYY-MM-DD");

    // Cập nhật state với ngày mới được chọn
    setCurrentSelectedDate(javascriptDateObject);

    // Load lại tất cả tabs cho ngày mới
    loadAllTabsData(dateString);
  };

  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (newActiveTab) => {
    setActiveTab(newActiveTab);
  };

  // Hàm lấy dữ liệu cho tab hiện tại
  const getCurrentTabData = () => {
    const statusMapping = {
      confirmed: "CONFIRMED",
      in_progress: "IN_PROGRESS",
      waiting_result: "WAITING_RESULT",
      completed: "COMPLETED",
    };

    const currentStatus = statusMapping[activeTab] || "CONFIRMED";
    return tabsData[currentStatus] || [];
  };

  // Hàm cập nhật trạng thái appointment detail với confirmation (giống PersonalSchedule)
  const handleStatusUpdate = async (detailId, newStatus, confirmMessage) => {
    try {
      const confirmed = await new Promise((resolve) => {
        Modal.confirm({
          title: "Xác nhận thay đổi trạng thái",
          content: confirmMessage,
          okText: "Xác nhận",
          cancelText: "Hủy",
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });

      if (!confirmed) return;

      console.log(" Updating appointment detail status:", {
        appointmentDetailId: detailId,
        newStatus: newStatus,
      });

      const response = await updateAppointmentDetailStatus(detailId, newStatus);
      console.log(" Status update response:", response);

      toast.success(`Cập nhật trạng thái thành công: ${newStatus}`);

      // Smart refetch: Reload dữ liệu để cập nhật UI (giống PersonalSchedule)
      const date = dayjs(currentSelectedDate).format("YYYY-MM-DD");
      console.log(" Reloading data after status update...");

      // Reload both current status and new status tabs
      const statusMapping = {
        confirmed: "CONFIRMED",
        in_progress: "IN_PROGRESS",
        waiting_result: "WAITING_RESULT",
        completed: "COMPLETED",
      };
      const currentStatus = statusMapping[activeTab] || "CONFIRMED";

      // Create array of statuses to refetch (avoid duplicates)
      const statusesToRefetch = [...new Set([currentStatus, newStatus])];

      // Refetch both statuses in parallel
      const refetchPromises = statusesToRefetch.map((status) =>
        loadAppointmentsByStatus(date, status)
      );

      await Promise.allSettled(refetchPromises);
      console.log(
        ` [STATUS UPDATE] Refetched ${statusesToRefetch.length} tab(s) successfully`
      );
    } catch (error) {
      console.error(" Error updating appointment detail status:", error);
      console.error("Error response:", error.response?.data);
      toast.error("Không thể cập nhật trạng thái. Vui lòng thử lại!");
    }
  };

  // Hàm bắt đầu tư vấn (CONFIRMED -> IN_PROGRESS) - giống PersonalSchedule
  const handleStartConsultation = (appointmentDetail, startUrl) => {
    handleStatusUpdate(
      appointmentDetail.id,
      "IN_PROGRESS",
      "Bạn có chắc chắn muốn bắt đầu tư vấn trực tuyến cho dịch vụ này?"
    ).then(() => {
      // Mở link tư vấn trong tab mới sau khi cập nhật trạng thái thành công
      if (startUrl) {
        window.open(startUrl, "_blank");
      }
    });
  };

  // Hàm hoàn thành tư vấn (IN_PROGRESS -> WAITING_RESULT) - giống PersonalSchedule
  const handleCompleteConsultation = (appointmentDetail) => {
    handleStatusUpdate(
      appointmentDetail.id,
      "WAITING_RESULT",
      "Bạn có chắc chắn đã hoàn thành tư vấn và chuyển sang chờ kết quả?"
    );
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Không có";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Get status info for display (giống PersonalSchedule)
  const getStatusInfo = (status) => {
    const statusMap = {
      CONFIRMED: {
        color: "cyan",
        icon: <CheckCircleOutlined />,
        text: "Đã xác nhận",
        description: "Sẵn sàng tư vấn trực tuyến",
      },
      IN_PROGRESS: {
        color: "purple",
        icon: <ClockCircleOutlined />,
        text: "Đang tư vấn",
        description: "Đang trong quá trình tư vấn",
      },
      WAITING_RESULT: {
        color: "orange",
        icon: <ExclamationCircleOutlined />,
        text: "Chờ kết quả",
        description: "Chờ tư vấn viên nhập kết quả",
      },
      COMPLETED: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
        description: "Đã hoàn tất tư vấn",
      },
      // Keep some old statuses for compatibility
      PENDING: {
        color: "orange",
        icon: <ExclamationCircleOutlined />,
        text: "Đang chờ",
        description: "Chờ xác nhận",
      },
      CANCELED: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
        description: "Tư vấn đã bị hủy",
      },
    };
    return (
      statusMap[status] || {
        color: "default",
        icon: <QuestionCircleOutlined />,
        text: status,
        description: "Trạng thái không xác định",
      }
    );
  };

  // Table columns với các chức năng mở rộng
  const getTableColumns = () => {
    const baseColumns = [
      {
        title: "Thông tin bệnh nhân",
        key: "customerInfo",
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          return (
            <div>
              <div className="patient-name">
                <UserOutlined /> {record.customerName || "Chưa có tên"}
              </div>
              <div className="patient-date">
                📅 Ngày hẹn:{" "}
                {new Date(record.preferredDate).toLocaleDateString("vi-VN")}
              </div>
              <div className="patient-id">🆔 Lịch hẹn: #{record.id}</div>
              {/* Patient Detail Button */}
              <div className="patient-buttons">
                <PatientDetailButton
                  patientId={record.customerId}
                  patientName={record.customerName || "Bệnh nhân"}
                  buttonText="Chi tiết"
                  buttonType="link"
                  buttonSize="small"
                />
              </div>
            </div>
          );
        },
      },
      {
        title: "Dịch vụ & Thời gian",
        key: "serviceInfo",
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          return (
            <div>
              <div className="service-name">{record.serviceName}</div>
              <div className="service-time">
                🕐 {formatDateTime(detail?.slotTime)}
              </div>
              <div className="service-consultant">
                👨‍⚕️ {detail?.consultantName || "Chưa phân công"}
              </div>
            </div>
          );
        },
      },
      {
        title: "Trạng thái",
        key: "status",
        width: 150,
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          const status = detail?.status || record.status;
          const statusInfo = getStatusInfo(status);
          return (
            <div>
              <Tag color={statusInfo.color} icon={statusInfo.icon}>
                {statusInfo.text}
              </Tag>
              <div
                style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}
              >
                {statusInfo.description}
              </div>
            </div>
          );
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          const startUrl = detail?.startUrl;
          const status = detail?.status;

          return (
            <Space direction="vertical" size="small">
              {/* Nút bắt đầu tư vấn cho status CONFIRMED */}
              {status === "CONFIRMED" && startUrl && (
                <Button
                  type="primary"
                  icon={<VideoCameraOutlined />}
                  size="small"
                  className="start-consultation-btn"
                  onClick={() => handleStartConsultation(detail, startUrl)}
                >
                  Bắt đầu tư vấn
                </Button>
              )}

              {/* Nút hoàn thành tư vấn cho status IN_PROGRESS */}
              {status === "IN_PROGRESS" && (
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleCompleteConsultation(detail)}
                  style={{ backgroundColor: "#faad14", borderColor: "#faad14" }}
                >
                  Hoàn thành tư vấn
                </Button>
              )}

              {/* Nút nhập kết quả cho status WAITING_RESULT */}
              {status === "WAITING_RESULT" && (
                <Button
                  type="primary"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedAppointmentDetail(detail);
                    setIsResultModalVisible(true);
                  }}
                  className="result-input-btn"
                >
                  Nhập kết quả
                </Button>
              )}

              {/* Hiển thị trạng thái hoàn thành */}
              {status === "COMPLETED" && (
                <div className="completed-status">Đã hoàn thành</div>
              )}
            </Space>
          );
        },
      },
    ];

    // Thêm cột kết quả khám cho tab completed
    if (activeTab === "completed") {
      baseColumns.push({
        title: "Kết quả tư vấn",
        key: "medicalResult",
        ellipsis: true,
        width: 300,
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          const result = detail?.medicalResult;
          return result ? (
            <MedicalResultViewer result={result} compact={true} />
          ) : (
            <span style={{ color: "#999" }}>Chưa có kết quả</span>
          );
        },
      });
    }

    return baseColumns;
  };

  return (
    <div className="online-consultation-container">
      <div className="online-consultation-header">
        <h1 className="online-consultation-title">
          <SolutionOutlined /> Tư vấn trực tuyến
        </h1>
        <p className="online-consultation-description">
          Quản lý các cuộc tư vấn trực tuyến đã được xác nhận
        </p>
      </div>

      {/* Statistics Cards - Compact Version giống PersonalSchedule */}
      <Row gutter={12} className="statistics-cards-container">
        <Col span={6}>
          <Card
            size="small"
            styles={{ body: { padding: "12px" } }}
            className="statistics-card"
          >
            <div className="statistics-card-content">
              <CalendarOutlined className="statistics-icon statistics-total" />
              <span className="statistics-text statistics-total">
                Tổng dịch vụ (
                {(tabsData.CONFIRMED?.length || 0) +
                  (tabsData.IN_PROGRESS?.length || 0) +
                  (tabsData.WAITING_RESULT?.length || 0) +
                  (tabsData.COMPLETED?.length || 0)}
                )
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            styles={{ body: { padding: "12px" } }}
            className="statistics-card"
          >
            <div className="statistics-card-content">
              <CheckCircleOutlined className="statistics-icon statistics-confirmed" />
              <span className="statistics-text statistics-confirmed">
                Đã xác nhận ({tabsData.CONFIRMED?.length || 0})
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            styles={{ body: { padding: "12px" } }}
            className="statistics-card"
          >
            <div className="statistics-card-content">
              <ExclamationCircleOutlined className="statistics-icon statistics-waiting" />
              <span className="statistics-text statistics-waiting">
                Chờ kết quả ({tabsData.WAITING_RESULT?.length || 0})
              </span>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            styles={{ body: { padding: "12px" } }}
            className="statistics-card"
          >
            <div className="statistics-card-content">
              <CheckCircleOutlined className="statistics-icon statistics-completed" />
              <span className="statistics-text statistics-completed">
                Hoàn thành ({tabsData.COMPLETED?.length || 0})
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Date Picker */}
      <Card className="date-picker-container">
        <div className="date-picker-content">
          <span className="date-picker-label">
            <CalendarOutlined /> Chọn ngày:
          </span>
          <DatePicker
            value={
              currentSelectedDate
                ? dayjs(currentSelectedDate).startOf("day")
                : dayjs().startOf("day")
            }
            onChange={handleDatePickerChange}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            className="date-picker-input"
            allowClear={false}
          />
          <span className="date-picker-info">
            Hiển thị tư vấn trực tuyến ngày{" "}
            {currentSelectedDate.toLocaleDateString("vi-VN")}
          </span>
        </div>
      </Card>

      {/* Tabs and Table */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            {
              key: "confirmed",
              label: (
                <span>
                  <CheckCircleOutlined />
                  Đã xác nhận ({tabsData.CONFIRMED?.length || 0})
                </span>
              ),
            },
            {
              key: "in_progress",
              label: (
                <span>
                  <ClockCircleOutlined />
                  Đang tư vấn ({tabsData.IN_PROGRESS?.length || 0})
                </span>
              ),
            },
            {
              key: "waiting_result",
              label: (
                <span>
                  <ExclamationCircleOutlined />
                  Chờ kết quả ({tabsData.WAITING_RESULT?.length || 0})
                </span>
              ),
            },
            {
              key: "completed",
              label: (
                <span>
                  <CheckCircleOutlined />
                  Hoàn thành ({tabsData.COMPLETED?.length || 0})
                </span>
              ),
            },
          ]}
        />

        <Table
          columns={getTableColumns()}
          dataSource={getCurrentTabData()}
          rowKey="id"
          loading={isLoadingData}
          className="online-consultation-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} cuộc tư vấn`,
          }}
          locale={{
            emptyText: (
              <div className="empty-state-container">
                <SolutionOutlined className="empty-state-icon" />
                <div className="empty-state-message">
                  Không có cuộc tư vấn trực tuyến nào cho ngày{" "}
                  {currentSelectedDate.toLocaleDateString("vi-VN")}
                </div>
                <div className="empty-state-hint">
                  Hãy thử chọn ngày khác hoặc kiểm tra lại lịch hẹn
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modal nhập kết quả khám */}
      <Modal
        title="Nhập kết quả tư vấn trực tuyến"
        open={isResultModalVisible}
        onCancel={() => {
          setIsResultModalVisible(false);
          setSelectedAppointmentDetail(null);
        }}
        footer={null}
        width={800}
        destroyOnClose={true}
        key={selectedAppointmentDetail?.id || "medical-result-modal"}
      >
        {selectedAppointmentDetail && (
          <MedicalResultForm
            key={`medical-form-${selectedAppointmentDetail.id}`}
            appointmentDetail={selectedAppointmentDetail}
            consultationType="online"
            onSuccess={async () => {
              setIsResultModalVisible(false);
              setSelectedAppointmentDetail(null);
              toast.success("Kết quả đã được lưu thành công!");

              // Cập nhật trạng thái thành COMPLETED sau khi lưu kết quả (không cần confirmation)
              try {
                console.log(
                  " [STATUS] Updating appointment detail status to COMPLETED"
                );
                await updateAppointmentDetailStatus(
                  selectedAppointmentDetail.id,
                  "COMPLETED"
                );
                console.log(
                  " [STATUS] Appointment detail status updated to COMPLETED"
                );

                // Reload dữ liệu để cập nhật UI
                const date = dayjs(currentSelectedDate).format("YYYY-MM-DD");
                await loadAppointmentsByStatus(date, "WAITING_RESULT");
                await loadAppointmentsByStatus(date, "COMPLETED");
              } catch (error) {
                console.error(
                  " [STATUS] Error updating appointment detail status:",
                  error
                );
                // Don't show error to user as medical result was saved successfully
              }
            }}
            onCancel={() => {
              setIsResultModalVisible(false);
              setSelectedAppointmentDetail(null);
            }}
          />
        )}
      </Modal>

      {/* Modal tư vấn trực tuyến */}
      <Modal
        title="Tư vấn trực tuyến"
        open={setIsConsultationModalVisible}
        onOk={() => {
          consultForm.validateFields().then((values) => {
            console.log("Consultation data:", values);
            toast.success("Tư vấn đã được ghi nhận!");
            setIsConsultationModalVisible(false);
            consultForm.resetFields();
          });
        }}
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
    </div>
  );
};

export default OnlineConsultation;
