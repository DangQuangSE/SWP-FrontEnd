import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
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
import dayjs from "dayjs"; // Only for DatePicker component, not used in MedicalResultForm
import MedicalResultViewer from "../../../../components/MedicalResult/MedicalResultViewer";
import MedicalResultFormWrapper from "../../../../components/MedicalResult/MedicalResultFormWrapper";
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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const getCacheKey = useCallback(
    (date, status) => `schedule_${userId}_${date}_${status}`,
    [userId]
  );

  const saveToCache = useCallback(
    (date, status, data) => {
      try {
        const cacheKey = getCacheKey(date, status);
        const cacheData = {
          data,
          timestamp: Date.now(),
          expiry: Date.now() + 5 * 60 * 1000, // 5 minutes cache
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        console.log(`💾 [CACHE] Saved data for ${status} on ${date}`);
      } catch (error) {
        console.warn("⚠️ [CACHE] Failed to save to localStorage:", error);
      }
    },
    [getCacheKey]
  );

  const getFromCache = useCallback(
    (date, status) => {
      try {
        const cacheKey = getCacheKey(date, status);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const cacheData = JSON.parse(cached);
        if (Date.now() > cacheData.expiry) {
          localStorage.removeItem(cacheKey);
          console.log(
            `🗑️ [CACHE] Expired cache removed for ${status} on ${date}`
          );
          return null;
        }

        console.log(`📦 [CACHE] Retrieved data for ${status} on ${date}`);
        return cacheData.data;
      } catch (error) {
        console.warn("⚠️ [CACHE] Failed to read from localStorage:", error);
        return null;
      }
    },
    [getCacheKey]
  );

  // Load appointments for specific status
  const loadAppointmentsByStatus = useCallback(
    async (date, status, useCache = true) => {
      const targetDate = date || dayjs().format("YYYY-MM-DD");

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
    [userId, getFromCache, saveToCache]
  );

  // Load all tabs data in parallel
  const loadAllTabsData = useCallback(
    async (date, useCache = true) => {
      const targetDate = date || dayjs().format("YYYY-MM-DD");
      const statuses = [
        "CHECKED",
        "IN_PROGRESS",
        "WAITING_RESULT",
        "COMPLETED",
      ];

      console.log(
        `🚀 [PARALLEL] Loading all tabs data for ${targetDate}, useCache: ${useCache}`
      );
      console.log("🎯 [PARALLEL] Will load these statuses:", statuses);
      setAppointmentsLoading(true);

      try {
        // Load all statuses in parallel
        const promises = statuses.map((status) => {
          console.log(
            `📡 [API_CALL] Calling loadAppointmentsByStatus(${targetDate}, ${status}, ${useCache})`
          );
          return loadAppointmentsByStatus(targetDate, status, useCache);
        });

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

  // Handle tab change - always call API with current selected date
  const handleTabChange = (key) => {
    setActiveTab(key);

    // CRITICAL FIX: Use currentDateStr state for immediate access to selected date
    console.log(`🎯 [TAB] Using currentDateStr: ${currentDateStr}`);

    // Status mapping for consultant dashboard API calls
    const statusMap = {
      checked: "CHECKED", // CHECKED -> CHECKED in backend
      in_progress: "IN_PROGRESS", // IN_PROGRESS -> IN_PROGRESS in backend
      waiting_result: "WAITING_RESULT", // WAITING_RESULT -> WAITING_RESULT in backend
      completed: "COMPLETED", // COMPLETED -> COMPLETED in backend
    };

    const status = statusMap[key] || "CHECKED";
    console.log(
      `🎯 [TAB] Switching to ${key} tab for date ${currentDateStr}, reloading ${status} data`
    );

    // Always call API when switching tabs (useCache = false) with CURRENT date
    loadAppointmentsByStatus(currentDateStr, status, false);
  };

  // Store current date string for immediate access
  const [currentDateStr, setCurrentDateStr] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  // Handle date change
  const handleDateChange = (date) => {
    console.log("🔍 [DEBUG] DatePicker onChange triggered");
    console.log("🔍 [DEBUG] Raw date from DatePicker:", date);

    // Keep dayjs object for internal state to avoid timezone conversion issues
    const selectedDayjs = date || dayjs();
    const nativeDate = selectedDayjs.toDate();
    const dateStr = selectedDayjs.format("YYYY-MM-DD");

    console.log("� [DATE] New date selected:", dateStr);

    // Update both states immediately
    setSelectedDate(nativeDate);
    setCurrentDateStr(dateStr); // CRITICAL: Store formatted date string

    console.log("📅 [DATE] Updated currentDateStr to:", dateStr);

    // CRITICAL: Force reload ALL TABS for new date (no cache)
    console.log("🚀 [FORCE_RELOAD] Loading ALL 4 tabs for new date:", dateStr);
    loadAllTabsData(dateStr, false); // Force reload without cache
  };

  // Initial load when component mounts
  useEffect(() => {
    console.log("🚀 [MOUNT] Component mounted, loading appointments...");
    console.log("👤 [MOUNT] Current userId:", userId);

    if (userId) {
      const today = selectedDate.toISOString().split("T")[0];
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
      const date = selectedDate.toISOString().split("T")[0];

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

  // Get columns based on current tab - hide medical result column for non-completed tabs
  const getDetailColumns = () => {
    const baseColumns = [
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
              📅 Ngày hẹn:{" "}
              {new Date(detail.preferredDate).toLocaleDateString("vi-VN")}
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
              ⏰{" "}
              {new Date(detail.slotTime).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
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
                  ✅ Đã hoàn thành
                </div>
              )}
            </Space>
          );
        },
      },
    ];

    // Only show medical result column for completed tab
    if (activeTab === "completed") {
      baseColumns.push({
        title: "Kết quả khám",
        dataIndex: "medicalResult",
        key: "medicalResult",
        ellipsis: true,
        width: 300,
        render: (result) => (
          <MedicalResultViewer result={result} compact={true} />
        ),
      });
    }

    return baseColumns;
  };

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
            value={
              selectedDate
                ? dayjs(selectedDate).startOf("day")
                : dayjs().startOf("day")
            }
            onChange={(date) => {
              console.log("🎯 [DATEPICKER] Raw onChange value:", date);
              if (date) {
                console.log(
                  "🎯 [DATEPICKER] Date format YYYY-MM-DD:",
                  date.format("YYYY-MM-DD")
                );
                console.log(
                  "🎯 [DATEPICKER] Date format DD/MM/YYYY:",
                  date.format("DD/MM/YYYY")
                );
              }
              handleDateChange(date);
            }}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            style={{ width: "200px" }}
            allowClear={false}
          />
          <span style={{ color: "#666" }}>
            Hiển thị lịch hẹn ngày {selectedDate.toLocaleDateString("vi-VN")}
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
          columns={getDetailColumns()}
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
                  {selectedDate.toLocaleDateString("vi-VN")}
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

      {/* Medical Result Form Modal */}
      <MedicalResultFormWrapper
        visible={isResultModalVisible}
        appointmentDetail={selectedAppointmentDetail}
        onSuccess={async (result) => {
          console.log("✅ Medical result submitted successfully:", result);
          toast.success("Đã lưu kết quả khám thành công!");

          try {
            // Update appointment detail status to COMPLETED after submitting medical result
            if (selectedAppointmentDetail?.id) {
              console.log(
                "🔄 [STATUS] Updating appointment detail status to COMPLETED"
              );
              await updateAppointmentDetailStatus(
                selectedAppointmentDetail.id,
                "COMPLETED"
              );
              console.log(
                "✅ [STATUS] Appointment detail status updated to COMPLETED"
              );
            }
          } catch (error) {
            console.error(
              "❌ [STATUS] Error updating appointment detail status:",
              error
            );
            // Don't show error to user as medical result was saved successfully
          }

          // Close modal
          setIsResultModalVisible(false);
          setSelectedAppointmentDetail(null);
          resultForm.resetFields();

          // Get current date for API calls
          const date = dayjs(selectedDate).format("YYYY-MM-DD");
          const statusMap = {
            checked: "CHECKED",
            in_progress: "IN_PROGRESS",
            waiting_result: "WAITING_RESULT",
            completed: "COMPLETED",
          };
          const currentStatus = statusMap[activeTab] || "CHECKED";

          console.log(
            "🔄 [RELOAD] Reloading tabs after medical result submission"
          );

          // Refetch current tab data (WAITING_RESULT)
          loadAppointmentsByStatus(date, currentStatus, false);

          // Also reload COMPLETED tab since the appointment is now completed
          console.log("🔄 [RELOAD] Also reloading COMPLETED tab");
          loadAppointmentsByStatus(date, "COMPLETED", false);

          // Update cache for both tabs
          console.log(
            "✅ [RELOAD] Finished reloading tabs after medical result submission"
          );
        }}
        onClose={() => {
          setIsResultModalVisible(false);
          setSelectedAppointmentDetail(null);
          resultForm.resetFields();
        }}
      />
    </div>
  );
};

export default PersonalSchedule;
