import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Select,
  Space,
  Button,
  Progress,
  Tag,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrophyOutlined,
  LineChartOutlined,
  BarChartOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../../../../configs/api";
import "./DashboardReports.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DashboardReports = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [reportType, setReportType] = useState("overview");
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    monthRevenue: 0,
    completionRate: 0,
    recentAppointments: [],
    topServices: [],
    userStats: {},
    revenueStats: {},
    bookingStats: {},
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log("📊 [DASHBOARD] Loading dashboard reports data...");

      // Format date range for API calls
      const startDate = dateRange[0].format("YYYY-MM-DD");
      const endDate = dateRange[1].format("YYYY-MM-DD");

      console.log("📅 [DASHBOARD] Date range:", { startDate, endDate });

      // Call actual APIs
      const [
        revenueYearRes,
        revenueTodayRes,
        revenueMonthRes,
        bookingSummaryRes,
        bookingStatsRes,
        usersRes,
      ] = await Promise.allSettled([
        api.get("/financial-reports/revenue-year"),
        api.get("/financial-reports/revenue-today"),
        api.get("/financial-reports/revenue-month"),
        api.get("/booking-reports/summary", {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }),
        api.get("/booking-reports/stats", {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        }),
        api.get("/admin/users?role=CUSTOMER"), // Get customer count
      ]);

      console.log("📊 [DASHBOARD] API Responses:", {
        revenueYear: revenueYearRes,
        revenueToday: revenueTodayRes,
        revenueMonth: revenueMonthRes,
        bookingSummary: bookingSummaryRes,
        bookingStats: bookingStatsRes,
        users: usersRes,
      });

      // Process revenue data
      const yearRevenue =
        revenueYearRes.status === "fulfilled" ? revenueYearRes.value.data : 0;
      const todayRevenue =
        revenueTodayRes.status === "fulfilled" ? revenueTodayRes.value.data : 0;
      const monthRevenue =
        revenueMonthRes.status === "fulfilled" ? revenueMonthRes.value.data : 0;

      // Process booking data
      const bookingSummary =
        bookingSummaryRes.status === "fulfilled" &&
        bookingSummaryRes.value?.data
          ? bookingSummaryRes.value.data
          : {};
      const bookingStats =
        bookingStatsRes.status === "fulfilled" && bookingStatsRes.value?.data
          ? bookingStatsRes.value.data
          : {};

      // Log API errors for debugging
      if (bookingSummaryRes.status === "rejected") {
        console.error(
          "❌ [DASHBOARD] Booking summary API error:",
          bookingSummaryRes.reason
        );
        message.warning("Không thể tải dữ liệu tổng kết booking");
      }
      if (bookingStatsRes.status === "rejected") {
        console.error(
          "❌ [DASHBOARD] Booking stats API error:",
          bookingStatsRes.reason
        );
        message.warning("Không thể tải thống kê booking");
      }

      // Process user data
      const customerCount =
        usersRes.status === "fulfilled"
          ? Array.isArray(usersRes.value.data)
            ? usersRes.value.data.length
            : 0
          : 0;

      // Calculate completion rate from booking stats
      const totalBookings = bookingStats.totalBookings || 0;
      const completedBookings = bookingStats.completedBookings || 0;
      const completionRate =
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

      const processedData = {
        totalUsers: customerCount,
        totalAppointments: totalBookings,
        totalRevenue: yearRevenue,
        todayRevenue: todayRevenue,
        monthRevenue: monthRevenue,
        completionRate: completionRate,
        recentAppointments: bookingSummary.recentBookings || [],
        topServices: bookingSummary.topServices || [],
        userStats: {
          customers: customerCount,
          consultants: 25, // Will need separate API
          staff: 15, // Will need separate API
        },
        bookingStats: bookingStats,
      };

      setDashboardData(processedData);
      console.log(
        "✅ [DASHBOARD] Dashboard data loaded successfully:",
        processedData
      );
    } catch (error) {
      console.error("❌ [DASHBOARD] Error loading dashboard data:", error);

      // Fallback to mock data on error
      const fallbackData = {
        totalUsers: 0,
        totalAppointments: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        monthRevenue: 0,
        completionRate: 0,
        recentAppointments: [],
        topServices: [],
        userStats: {
          customers: 0,
          consultants: 0,
          staff: 0,
        },
      };
      setDashboardData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange, reportType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Statistics cards data
  const statisticsCards = [
    {
      title: "Tổng người dùng",
      value: dashboardData.totalUsers,
      icon: <UserOutlined />,
      color: "#1890ff",
      suffix: "người",
    },
    {
      title: "Tổng lịch hẹn",
      value: dashboardData.totalAppointments,
      icon: <CalendarOutlined />,
      color: "#52c41a",
      suffix: "lịch hẹn",
    },
    {
      title: "Doanh thu năm",
      value: dashboardData.totalRevenue,
      icon: <DollarOutlined />,
      color: "#faad14",
      suffix: "VND",
      formatter: (value) => `${(value / 1000000).toFixed(1)}M`,
    },
    {
      title: "Doanh thu hôm nay",
      value: dashboardData.todayRevenue,
      icon: <DollarOutlined />,
      color: "#13c2c2",
      suffix: "VND",
      formatter: (value) => `${(value / 1000).toLocaleString()}K`,
    },
    {
      title: "Doanh thu tháng",
      value: dashboardData.monthRevenue,
      icon: <DollarOutlined />,
      color: "#eb2f96",
      suffix: "VND",
      formatter: (value) => `${(value / 1000000).toFixed(1)}M`,
    },
    {
      title: "Tỷ lệ hoàn thành",
      value: dashboardData.completionRate,
      icon: <TrophyOutlined />,
      color: "#722ed1",
      suffix: "%",
      formatter: (value) => `${value.toFixed(1)}`,
    },
  ];

  // Recent appointments table columns
  const appointmentColumns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          COMPLETED: { color: "green", text: "Hoàn thành" },
          IN_PROGRESS: { color: "blue", text: "Đang tiến hành" },
          PENDING: { color: "orange", text: "Chờ xác nhận" },
        };
        const statusInfo = statusMap[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => `${revenue.toLocaleString()} VND`,
    },
  ];

  // Top services table columns
  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      render: (count) => <Statistic value={count} suffix="lịch hẹn" />,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => (
        <Statistic
          value={revenue}
          suffix="VND"
          formatter={(value) => `${(value / 1000000).toFixed(1)}M`}
        />
      ),
    },
  ];

  return (
    <div className="dashboard-reports">
      <Card
        title={
          <Space>
            <BarChartOutlined />
            <span>Dashboard & Báo cáo</span>
          </Space>
        }
        extra={
          <Space>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
            />
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 150 }}
            >
              <Option value="overview">Tổng quan</Option>
              <Option value="revenue">Doanh thu</Option>
              <Option value="appointments">Lịch hẹn</Option>
              <Option value="users">Người dùng</Option>
            </Select>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadDashboardData}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button icon={<DownloadOutlined />} type="primary">
              Xuất báo cáo
            </Button>
          </Space>
        }
      >
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statisticsCards.map((card, index) => (
            <Col xs={24} sm={12} lg={8} xl={4} key={index}>
              <Card className="stat-card">
                <Statistic
                  title={card.title}
                  value={card.value}
                  prefix={
                    <span style={{ color: card.color, fontSize: 20 }}>
                      {card.icon}
                    </span>
                  }
                  suffix={card.suffix}
                  formatter={card.formatter}
                  valueStyle={{ color: card.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]}>
          {/* Recent Appointments */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <CalendarOutlined />
                  <span>Lịch hẹn gần đây</span>
                </Space>
              }
              extra={
                <Button icon={<EyeOutlined />} size="small">
                  Xem tất cả
                </Button>
              }
            >
              <Table
                columns={appointmentColumns}
                dataSource={dashboardData.recentAppointments}
                pagination={false}
                size="small"
                rowKey="id"
              />
            </Card>
          </Col>

          {/* Top Services */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <TrophyOutlined />
                  <span>Dịch vụ hàng đầu</span>
                </Space>
              }
            >
              <Table
                columns={serviceColumns}
                dataSource={dashboardData.topServices}
                pagination={false}
                size="small"
                rowKey="name"
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* User Statistics */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Thống kê người dùng</span>
                </Space>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic
                    title="Khách hàng"
                    value={dashboardData.userStats.customers}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Tư vấn viên"
                    value={dashboardData.userStats.consultants}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Nhân viên"
                    value={dashboardData.userStats.staff}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <LineChartOutlined />
                  <span>Hiệu suất hệ thống</span>
                </Space>
              }
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <span>Tỷ lệ hoàn thành lịch hẹn</span>
                  <Progress
                    percent={dashboardData.completionRate}
                    status="active"
                    strokeColor="#52c41a"
                  />
                </div>
                <div>
                  <span>Mức độ hài lòng khách hàng</span>
                  <Progress percent={92} strokeColor="#1890ff" />
                </div>
                <div>
                  <span>Hiệu suất tư vấn viên</span>
                  <Progress percent={88} strokeColor="#faad14" />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardReports;
