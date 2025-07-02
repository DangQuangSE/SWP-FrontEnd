import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
} from "antd";
import {
  EditOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  getMySchedule,
  updateAppointmentDetailStatus,
} from "../../../../api/consultantAPI";
import dayjs from "dayjs";
import "./PersonalSchedule.css";

const PersonalSchedule = ({ userId }) => {
  // Cache data for all tabs
  const [tabsData, setTabsData] = useState({
    CHECKED: [],
    IN_PROGRESS: [],
    WAITING_RESULT: [],
    COMPLETED: [],
  });
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [tabLoadingStates, setTabLoadingStates] = useState({
    CHECKED: false,
    IN_PROGRESS: false,
    WAITING_RESULT: false,
    COMPLETED: false,
  });
  const [lastApiResponse, setLastApiResponse] = useState(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false); // Hide by default
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [activeTab, setActiveTab] = useState("checked");
  const [isConsultationModalVisible, setIsConsultationModalVisible] =
    useState(false);
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] =
    useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [consultForm] = Form.useForm();
  const [resultForm] = Form.useForm();

  // Cache utilities
  const getCacheKey = (date, status) => `schedule_${userId}_${date}_${status}`;

  const saveToCache = (date, status, data) => {
    try {
      const cacheKey = getCacheKey(date, status);
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + 5 * 60 * 1000, // 5 minutes cache
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`� [CACHE] Saved data for ${status} on ${date}`);
    } catch (error) {
      console.warn("⚠️ [CACHE] Failed to save to localStorage:", error);
    }
  };

  const getFromCache = (date, status) => {
    try {
      const cacheKey = getCacheKey(date, status);
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(cacheKey);
        console.log(
          `�️ [CACHE] Expired cache removed for ${status} on ${date}`
        );
        return null;
      }

      console.log(`� [CACHE] Retrieved data for ${status} on ${date}`);
      return cacheData.data;
    } catch (error) {
      console.warn("⚠️ [CACHE] Failed to read from localStorage:", error);
      return null;
    }
  };

  // Load appointments for specific status
  const loadAppointmentsByStatus = useCallback(
    async (date, status, useCache = true) => {
      const targetDate = date || new Date().toISOString().slice(0, 10);

      // Check cache first if enabled
      if (useCache) {
        const cachedData = getFromCache(targetDate, status);
        if (cachedData) {
          setTabsData((prev) => ({
            ...prev,
            [status]: cachedData,
          }));
          return cachedData;
        }
      }

      // Set loading state for this specific tab
      setTabLoadingStates((prev) => ({
        ...prev,
        [status]: true,
      }));

      try {
        console.log(` [API] Loading ${status} appointments for ${targetDate}`);
        const response = await getMySchedule(targetDate, status);
        const appointments = response.data || [];

        console.log(
          `[API] Loaded ${appointments.length} ${status} appointments`
        );

        // Update cache
        saveToCache(targetDate, status, appointments);

        // Update state
        setTabsData((prev) => ({
          ...prev,
          [status]: appointments,
        }));

        // Save response for debug panel
        setLastApiResponse({
          timestamp: new Date().toLocaleString(),
          status: response.status,
          dataType: typeof response.data,
          isArray: Array.isArray(response.data),
          data: response.data,
          params: { date: targetDate, status, userId },
        });

        return appointments;
      } catch (error) {
        console.error(` [API] Error loading ${status} appointments:`, error);
        toast.error(
          `Lỗi tải dữ liệu ${status}: ${
            error.response?.data?.message || error.message
          }`
        );
        return [];
      } finally {
        setTabLoadingStates((prev) => ({
          ...prev,
          [status]: false,
        }));
      }
    },
    [userId]
  );

  // Refresh current tab data (used by other functions)
  const refreshCurrentTab = () => {
    const date = selectedDate.format("YYYY-MM-DD");
    const statusMap = {
      checked: "CHECKED",
      in_progress: "IN_PROGRESS",
      waiting_result: "WAITING_RESULT",
      completed: "COMPLETED",
    };
    const currentStatus = statusMap[activeTab] || "CHECKED";
    loadAppointmentsByStatus(date, currentStatus, false);
  };

  // Load all tabs data in parallel
  const loadAllTabsData = useCallback(
    async (date, useCache = true) => {
      const targetDate = date || new Date().toISOString().slice(0, 10);
      const statuses = [
        "CHECKED",
        "IN_PROGRESS",
        "WAITING_RESULT",
        "COMPLETED",
      ];

      console.log(
        `🚀 [PARALLEL] Loading all tabs data for ${targetDate}, useCache: ${useCache}`
      );
      setAppointmentsLoading(true);

      try {
        // Load all statuses in parallel
        const promises = statuses.map((status) =>
          loadAppointmentsByStatus(targetDate, status, useCache)
        );

        const results = await Promise.allSettled(promises);

        // Log results
        results.forEach((result, index) => {
          const status = statuses[index];
          if (result.status === "fulfilled") {
            console.log(
              `[PARALLEL] ${status}: ${result.value.length} appointments`
            );
          } else {
            console.error(` [PARALLEL] ${status} failed:`, result.reason);
          }
        });

        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        toast.success(
          `Đã tải ${successCount}/${statuses.length} tab thành công`
        );
      } catch (error) {
        console.error(" [PARALLEL] Error during parallel loading:", error);
        toast.error("Lỗi khi tải dữ liệu song song");
      } finally {
        setAppointmentsLoading(false);
      }
    },
    [loadAppointmentsByStatus]
  );

  // Handle tab change - always call API
  const handleTabChange = (key) => {
    setActiveTab(key);
    const date = selectedDate.format("YYYY-MM-DD");

    const statusMap = {
      checked: "CHECKED",
      in_progress: "IN_PROGRESS",
      waiting_result: "WAITING_RESULT",
      completed: "COMPLETED",
    };

    const status = statusMap[key] || "CHECKED";
    console.log(` [TAB] Switching to ${key} tab, reloading ${status} data`);

    // Always call API when switching tabs (useCache = false)
    loadAppointmentsByStatus(date, status, false);
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const dateStr = date.format("YYYY-MM-DD");
    console.log("📅 [DATE] Date changed, loading all data for:", dateStr);

    // Load all tabs data for new date
    loadAllTabsData(dateStr, true); // Use cache for date changes
  };

  // Initial load when component mounts
  useEffect(() => {
    console.log("🚀 [MOUNT] Component mounted, loading appointments...");
    console.log("👤 [MOUNT] Current userId:", userId);

    if (userId) {
      const today = selectedDate.format("YYYY-MM-DD");
      // Load all tabs data in parallel on mount
      loadAllTabsData(today, true);
    }
  }, [userId, selectedDate, loadAllTabsData]);

  // Get status info for display
  const getStatusInfo = (status) => {
    const statusMap = {
      CHECKED: {
        color: "blue",
        icon: <CheckCircleOutlined />,
        text: "Đã kiểm tra",
      },
      IN_PROGRESS: {
        color: "purple",
        icon: <ClockCircleOutlined />,
        text: "Đang tiến hành",
        description: "Đang trong quá trình khám",
      },
      WAITING_RESULT: {
        color: "orange",
        icon: <ExclamationCircleOutlined />,
        text: "Chờ kết quả",
        description: "Chờ bác sĩ nhập kết quả",
      },
      COMPLETED: {
        color: "green",
        icon: <CheckCircleOutlined />,
        text: "Hoàn thành",
        description: "Đã hoàn tất toàn bộ",
      },
      // Keep some old statuses for compatibility
      PENDING: {
        color: "orange",
        icon: <ExclamationCircleOutlined />,
        text: "Đang chờ",
        description: "Chờ xác nhận",
      },
      CONFIRMED: {
        color: "cyan",
        icon: <CheckCircleOutlined />,
        text: "Đã xác nhận",
        description: "Đã xác nhận lịch hẹn",
      },
      CANCELED: {
        color: "red",
        icon: <CloseCircleOutlined />,
        text: "Đã hủy",
        description: "Lịch hẹn đã bị hủy",
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

  // Handle submit medical result
  const handleSubmitResult = async (appointmentDetailId, result) => {
    try {
      console.log("Submitting medical result:", {
        appointmentDetailId,
        result,
      });
      // TODO: Call API to submit medical result
      // await submitMedicalResult(appointmentDetailId, result);

      toast.success("Đã lưu kết quả khám thành công!");
      setIsResultModalVisible(false);
      setSelectedAppointmentDetail(null);
      resultForm.resetFields();

      // Reload current tab data
      const date = selectedDate.format("YYYY-MM-DD");
      const statusMap = {
        checked: "CHECKED",
        in_progress: "IN_PROGRESS",
        waiting_result: "WAITING_RESULT",
        completed: "COMPLETED",
      };
      const currentStatus = statusMap[activeTab] || "CHECKED";

      // Refetch current tab data
      loadAppointmentsByStatus(date, currentStatus, false);
    } catch (error) {
      console.error("Error submitting result:", error);
      toast.error("Lỗi khi lưu kết quả khám!");
    }
  };

  // Check if current user is the consultant for this appointment detail
  const isMyAppointmentDetail = (detail) => {
    return detail.consultantId === userId;
  };

  // Handle status update with confirmation and smart refetch
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

      // Get current status before update
      const statusMap = {
        checked: "CHECKED",
        in_progress: "IN_PROGRESS",
        waiting_result: "WAITING_RESULT",
        completed: "COMPLETED",
      };
      const currentStatus = statusMap[activeTab] || "CHECKED";

      setStatusUpdateLoading(true);
      await updateAppointmentDetailStatus(detailId, newStatus);

      toast.success("Cập nhật trạng thái thành công!");

      // Smart refetch: Update both current tab and new status tab
      const date = selectedDate.format("YYYY-MM-DD");

      console.log(` [STATUS UPDATE] Refetching data after status change:`);
      console.log(`   - Current tab status: ${currentStatus}`);
      console.log(`   - New status: ${newStatus}`);

      // Create array of statuses to refetch (avoid duplicates)
      const statusesToRefetch = [...new Set([currentStatus, newStatus])];

      // Refetch both statuses in parallel
      const refetchPromises = statusesToRefetch.map(
        (status) => loadAppointmentsByStatus(date, status, false) // Don't use cache for status updates
      );

      await Promise.allSettled(refetchPromises);
      console.log(
        `[STATUS UPDATE] Refetched ${statusesToRefetch.length} tab(s) successfully`
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Lỗi khi cập nhật trạng thái!");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Handle start examination (CHECKED -> IN_PROGRESS)
  const handleStartExamination = (detailId) => {
    handleStatusUpdate(
      detailId,
      "IN_PROGRESS",
      "Bạn có chắc chắn muốn bắt đầu khám bệnh cho dịch vụ này?"
    );
  };

  // Handle wait for result (IN_PROGRESS -> WAITING_RESULT)
  const handleWaitForResult = (detailId) => {
    handleStatusUpdate(
      detailId,
      "WAITING_RESULT",
      "Bạn có chắc chắn đã hoàn thành khám và chuyển sang chờ kết quả?"
    );
  };

  // Columns for appointment details table (each detail is a row)
  const detailColumns = [
    {
      title: "Mã dịch vụ",
      dataIndex: "id",
      key: "detailId",
      width: 100,
      render: (id) => <strong>#{id}</strong>,
    },
    {
      title: "Thông tin bệnh nhân",
      key: "patientInfo",
      width: 200,
      render: (_, detail) => (
        <div>
          <div
            style={{ fontWeight: "bold", color: "#1890ff", fontSize: "14px" }}
          >
            <UserOutlined /> {detail.customerName || "Chưa có tên"}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            📅 Ngày hẹn: {dayjs(detail.preferredDate).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            🆔 Lịch hẹn: #{detail.appointmentId}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const statusInfo = getStatusInfo(status);
        return (
          <div>
            <Tag color={statusInfo.color} icon={statusInfo.icon}>
              {statusInfo.text}
            </Tag>
            <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>
              {statusInfo.description}
            </div>
          </div>
        );
      },
    },
    {
      title: "Dịch vụ khám",
      key: "serviceInfo",
      width: 200,
      render: (_, detail) => (
        <div>
          <div
            style={{ fontWeight: "bold", fontSize: "14px", color: "#52c41a" }}
          >
            🏥 {detail.serviceName}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            ⏰ {dayjs(detail.slotTime).format("HH:mm DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            👨‍⚕️ {detail.consultantName || `Bác sĩ #${detail.consultantId}`}
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, detail) => {
        const { status, id } = detail;

        return (
          <Space direction="vertical" size="small">
            {status === "CHECKED" && (
              <Button
                type="primary"
                size="small"
                icon={<ClockCircleOutlined />}
                onClick={() => handleStartExamination(id)}
                loading={statusUpdateLoading}
              >
                Bắt đầu khám
              </Button>
            )}

            {status === "IN_PROGRESS" && (
              <Button
                type="primary"
                size="small"
                icon={<ExclamationCircleOutlined />}
                onClick={() => handleWaitForResult(id)}
                loading={statusUpdateLoading}
                style={{ backgroundColor: "#fa8c16", borderColor: "#fa8c16" }}
              >
                Chờ kết quả
              </Button>
            )}

            {status === "WAITING_RESULT" && (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedAppointmentDetail(detail);
                  setIsResultModalVisible(true);
                }}
                style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
              >
                Nhập kết quả
              </Button>
            )}

            {status === "COMPLETED" && (
              <div
                style={{
                  color: "#52c41a",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                Đã hoàn thành
              </div>
            )}
          </Space>
        );
      },
    },
    {
      title: "Kết quả khám",
      dataIndex: "medicalResult",
      key: "medicalResult",
      ellipsis: true,
      width: 300,
      render: (result) => (
        <div style={{ fontSize: "12px" }}>
          {result ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
                borderRadius: "6px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <strong style={{ color: "#52c41a" }}>🏥 Loại kết quả:</strong>{" "}
                <span style={{ color: "#1890ff" }}>
                  {result.resultType === "LAB_TEST"
                    ? "Xét nghiệm"
                    : result.resultType === "IMAGING"
                    ? "Chẩn đoán hình ảnh"
                    : result.resultType === "CONSULTATION"
                    ? "Tư vấn"
                    : result.resultType || "Không xác định"}
                </span>
              </div>

              {result.diagnosis && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}> Chẩn đoán:</strong>
                  <div style={{ marginTop: "4px", color: "#262626" }}>
                    {result.diagnosis}
                  </div>
                </div>
              )}

              {result.treatmentPlan && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}>
                    💊 Kế hoạch điều trị:
                  </strong>
                  <div style={{ marginTop: "4px", color: "#262626" }}>
                    {result.treatmentPlan}
                  </div>
                </div>
              )}

              {result.testName && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}>
                    🧪 Tên xét nghiệm:
                  </strong>
                  <div style={{ marginTop: "4px", color: "#262626" }}>
                    {result.testName}
                  </div>
                </div>
              )}

              {result.testResult && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}> Kết quả:</strong>
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#262626",
                      backgroundColor: "#fff",
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9",
                    }}
                  >
                    {result.testResult}
                  </div>
                </div>
              )}

              {result.normalRange && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}>
                    📏 Giá trị bình thường:
                  </strong>
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#595959",
                      fontSize: "11px",
                    }}
                  >
                    {result.normalRange}
                  </div>
                </div>
              )}

              {result.testStatus && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}>Trạng thái:</strong>{" "}
                  <span
                    style={{
                      color:
                        result.testStatus === "NORMAL"
                          ? "#52c41a"
                          : result.testStatus === "ABNORMAL"
                          ? "#ff4d4f"
                          : "#fa8c16",
                      fontWeight: "bold",
                    }}
                  >
                    {result.testStatus === "NORMAL"
                      ? "Bình thường"
                      : result.testStatus === "ABNORMAL"
                      ? "Bất thường"
                      : result.testStatus === "PENDING"
                      ? "Đang chờ"
                      : result.testStatus || "Không xác định"}
                  </span>
                </div>
              )}

              {result.description && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}> Mô tả:</strong>
                  <div style={{ marginTop: "4px", color: "#262626" }}>
                    {result.description}
                  </div>
                </div>
              )}

              {result.labNotes && (
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#52c41a" }}>
                    🔬 Ghi chú phòng lab:
                  </strong>
                  <div
                    style={{
                      marginTop: "4px",
                      color: "#595959",
                      fontSize: "11px",
                    }}
                  >
                    {result.labNotes}
                  </div>
                </div>
              )}

              {result.createdAt && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "8px",
                    borderTop: "1px solid #d9d9d9",
                    color: "#8c8c8c",
                    fontSize: "11px",
                  }}
                >
                  📅 Ngày tạo:{" "}
                  {new Date(result.createdAt).toLocaleString("vi-VN")}
                </div>
              )}
            </div>
          ) : (
            <span style={{ color: "#ccc", fontStyle: "italic" }}>
              Chưa có kết quả
            </span>
          )}
        </div>
      ),
    },
  ];

  // Get current tab data
  const getCurrentTabData = () => {
    const statusMap = {
      checked: "CHECKED",
      in_progress: "IN_PROGRESS",
      waiting_result: "WAITING_RESULT",
      completed: "COMPLETED",
    };
    const currentStatus = statusMap[activeTab] || "CHECKED";
    return tabsData[currentStatus] || [];
  };

  // Flatten appointment details and add appointment info for current tab
  const getCurrentTabDetails = () => {
    const currentData = getCurrentTabData();
    return currentData.flatMap((appointment) =>
      (appointment.appointmentDetails || [])
        .filter((detail) => isMyAppointmentDetail(detail))
        .map((detail) => ({
          ...detail,
          // Add appointment info to detail
          appointmentId: appointment.id,
          customerName: appointment.customerName,
          preferredDate: appointment.preferredDate,
          appointmentNote: appointment.note,
          appointmentStatus: appointment.status,
          created_at: appointment.created_at,
          isPaid: appointment.isPaid,
          paymentStatus: appointment.paymentStatus,
        }))
    );
  };

  // Get all details from all tabs for statistics
  const getAllAppointmentDetails = () => {
    const allStatuses = [
      "CHECKED",
      "IN_PROGRESS",
      "WAITING_RESULT",
      "COMPLETED",
    ];
    return allStatuses.flatMap((status) =>
      (tabsData[status] || []).flatMap((appointment) =>
        (appointment.appointmentDetails || [])
          .filter((detail) => isMyAppointmentDetail(detail))
          .map((detail) => ({
            ...detail,
            appointmentId: appointment.id,
            customerName: appointment.customerName,
            preferredDate: appointment.preferredDate,
            appointmentNote: appointment.note,
            appointmentStatus: appointment.status,
            created_at: appointment.created_at,
            isPaid: appointment.isPaid,
            paymentStatus: appointment.paymentStatus,
          }))
      )
    );
  };

  const currentTabDetails = getCurrentTabDetails();
  const allMyDetails = getAllAppointmentDetails();

  // Calculate statistics based on all details
  const totalDetails = allMyDetails.length;
  const checkedCount = allMyDetails.filter(
    (detail) => detail.status === "CHECKED"
  ).length;
  const inProgressCount = allMyDetails.filter(
    (detail) => detail.status === "IN_PROGRESS"
  ).length;
  const waitingResultCount = allMyDetails.filter(
    (detail) => detail.status === "WAITING_RESULT"
  ).length;
  const completedCount = allMyDetails.filter(
    (detail) => detail.status === "COMPLETED"
  ).length;

  // Create tab items
  const tabItems = [
    {
      key: "checked",
      label: (
        <span>
          <CheckCircleOutlined />
          Đã check in ({checkedCount})
        </span>
      ),
    },
    {
      key: "in_progress",
      label: (
        <span>
          <ClockCircleOutlined />
          Đang tiến hành ({inProgressCount})
        </span>
      ),
    },
    {
      key: "waiting_result",
      label: (
        <span>
          <ExclamationCircleOutlined />
          Chờ kết quả ({waitingResultCount})
        </span>
      ),
    },
    {
      key: "completed",
      label: (
        <span>
          <CheckCircleOutlined />
          Hoàn thành ({completedCount})
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, color: "#1890ff" }}>
          <CalendarOutlined /> Lịch Tư Vấn Cá Nhân
        </h1>
        <p style={{ color: "#666", margin: "8px 0 0 0" }}>
          Quản lý lịch hẹn và theo dõi tiến trình khám bệnh
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={totalDetails}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã check in"
              value={checkedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Chờ kết quả"
              value={waitingResultCount}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={completedCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Date Picker */}
      <Card style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontWeight: "bold" }}>
            <CalendarOutlined /> Chọn ngày:
          </span>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            style={{ width: "200px" }}
            allowClear={false}
          />
          <span style={{ color: "#666" }}>
            Hiển thị lịch hẹn ngày {selectedDate.format("DD/MM/YYYY")}
          </span>
          {!showDebugPanel && (
            <Button
              size="small"
              onClick={() => setShowDebugPanel(true)}
              style={{ marginLeft: "auto" }}
            >
              Debug
            </Button>
          )}
        </div>
      </Card>

      {/* Debug Panel */}
      {showDebugPanel && (
        <Card style={{ marginBottom: "16px", borderColor: "#1890ff" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <h4 style={{ margin: 0, color: "#1890ff" }}> Debug Panel</h4>
            <Button size="small" onClick={() => setShowDebugPanel(false)}>
              Ẩn
            </Button>
          </div>

          {lastApiResponse ? (
            <div style={{ fontSize: "12px" }}>
              <p>
                <strong>Lần gọi API cuối:</strong> {lastApiResponse.timestamp}
              </p>
              <p>
                <strong>Tham số:</strong>{" "}
                {JSON.stringify(lastApiResponse.params)}
              </p>
              <p>
                <strong>Trạng thái:</strong> {lastApiResponse.status}
              </p>
              <p>
                <strong>Số lượng dữ liệu:</strong>{" "}
                {lastApiResponse.isArray ? lastApiResponse.data?.length : "N/A"}
              </p>
              <details>
                <summary>Dữ liệu thô</summary>
                <pre
                  style={{
                    fontSize: "11px",
                    maxHeight: "150px",
                    overflow: "auto",
                    background: "#f5f5f5",
                    padding: "8px",
                  }}
                >
                  {JSON.stringify(lastApiResponse.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <p>Chưa có lần gọi API nào</p>
          )}
        </Card>
      )}

      {/* Tabs for different status */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
        />

        <Table
          columns={detailColumns}
          dataSource={currentTabDetails}
          rowKey="id"
          loading={
            appointmentsLoading ||
            Object.values(tabLoadingStates).some((loading) => loading)
          }
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong tổng số ${total} dịch vụ`,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: "40px", textAlign: "center" }}>
                <CalendarOutlined
                  style={{
                    fontSize: "48px",
                    color: "#ccc",
                    marginBottom: "16px",
                  }}
                />
                <div style={{ color: "#999" }}>
                  Không có dịch vụ nào trong tab này cho ngày{" "}
                  {selectedDate.format("DD/MM/YYYY")}
                </div>
                <div
                  style={{ color: "#ccc", fontSize: "12px", marginTop: "8px" }}
                >
                  Hãy thử chọn ngày khác hoặc kiểm tra tab khác
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* Modal tư vấn trực tuyến */}
      <Modal
        title="Tư vấn trực tuyến"
        open={isConsultationModalVisible}
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

      {/* Modal nhập kết quả khám */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <EditOutlined />
            Nhập kết quả khám bệnh
          </div>
        }
        open={isResultModalVisible}
        onOk={() => {
          resultForm.validateFields().then((values) => {
            handleSubmitResult(
              selectedAppointmentDetail?.id,
              values.medicalResult
            );
          });
        }}
        onCancel={() => {
          setIsResultModalVisible(false);
          setSelectedAppointmentDetail(null);
          resultForm.resetFields();
        }}
        okText="Lưu kết quả"
        cancelText="Hủy"
        width={600}
      >
        {selectedAppointmentDetail && (
          <div>
            {/* Thông tin dịch vụ */}
            <Card
              size="small"
              style={{ marginBottom: "16px", backgroundColor: "#f0f9ff" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "#1890ff",
                    }}
                  >
                    🏥 {selectedAppointmentDetail.serviceName}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "4px",
                    }}
                  >
                    ⏰ Thời gian:{" "}
                    {dayjs(selectedAppointmentDetail.slotTime).format(
                      "HH:mm DD/MM/YYYY"
                    )}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    👨‍⚕️ Bác sĩ:{" "}
                    {selectedAppointmentDetail.consultantName ||
                      `ID: ${selectedAppointmentDetail.consultantId}`}
                  </div>
                </div>
                <Tag
                  color={getStatusInfo(selectedAppointmentDetail.status).color}
                >
                  {getStatusInfo(selectedAppointmentDetail.status).text}
                </Tag>
              </div>
            </Card>

            {/* Form nhập kết quả */}
            <Form form={resultForm} layout="vertical">
              <Form.Item
                name="medicalResult"
                label={
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>
                    Kết quả khám bệnh
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập kết quả khám bệnh!",
                  },
                  {
                    min: 10,
                    message: "Kết quả khám phải có ít nhất 10 ký tự!",
                  },
                ]}
              >
                <Input.TextArea
                  rows={8}
                  placeholder="Nhập kết quả khám bệnh chi tiết...

Ví dụ:
- Triệu chứng: ...
- Chẩn đoán: ...
- Hướng điều trị: ...
- Lưu ý: ..."
                  style={{ fontSize: "13px" }}
                />
              </Form.Item>

              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fff7e6",
                  borderRadius: "6px",
                  border: "1px solid #ffd591",
                }}
              >
                <div style={{ fontSize: "12px", color: "#d46b08" }}>
                  <strong>💡 Lưu ý:</strong>
                  <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                    <li>Nhập kết quả khám chi tiết và rõ ràng</li>
                    <li>Bao gồm chẩn đoán và hướng điều trị</li>
                    <li>Kết quả sẽ được gửi cho bệnh nhân</li>
                  </ul>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PersonalSchedule;
