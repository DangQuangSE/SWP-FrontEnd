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
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import MedicalResultViewer from "../../../../components/MedicalResult/MedicalResultViewer";
import MedicalResultFormWrapper from "../../../../components/MedicalResult/MedicalResultFormWrapper";
import PatientDetailButton from "../PatientHistory/PatientDetailButton";
import "./OnlineConsultation.css";

const OnlineConsultation = ({ setIsConsultationModalVisible, userId }) => {
  // State để lưu tất cả dữ liệu tư vấn từ API
  const [allOnlineConsultations, setAllOnlineConsultations] = useState([]);

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

  // Hàm để lấy tất cả dữ liệu tư vấn trực tuyến từ API
  const fetchAllOnlineConsultations = async () => {
    // Bắt đầu loading
    setIsLoadingData(true);

    try {
      // Lấy token từ localStorage để xác thực
      const authToken = localStorage.getItem("token");

      // Gọi API để lấy tất cả cuộc hẹn có status CONFIRMED
      // Thêm userId vào query để lọc theo consultant hiện tại
      const apiResponse = await axios.get(
        `/api/appointment/by-status?status=CONFIRMED${
          userId ? `&consultantId=${userId}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Lọc chỉ lấy những cuộc hẹn tư vấn trực tuyến có startUrl
      const onlineConsultationData = apiResponse.data.filter(
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

      // Lưu tất cả dữ liệu vào state
      setAllOnlineConsultations(onlineConsultationData);

      // Phân chia dữ liệu theo status và ngày được chọn
      organizeDataByTabsAndDate(onlineConsultationData, currentSelectedDate);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu tư vấn trực tuyến:", error);
      message.error("Không thể tải danh sách tư vấn trực tuyến");
    } finally {
      // Kết thúc loading
      setIsLoadingData(false);
    }
  };

  // Hàm để phân chia dữ liệu theo tabs và lọc theo ngày
  const organizeDataByTabsAndDate = (allConsultations, dateToFilter) => {
    // Chuyển ngày được chọn thành chuỗi định dạng YYYY-MM-DD
    const selectedDateString = dayjs(dateToFilter).format("YYYY-MM-DD");

    // Lọc dữ liệu theo ngày trước
    const consultationsOnSelectedDate = allConsultations.filter(
      (singleAppointment) => {
        const appointmentSlotTime =
          singleAppointment.appointmentDetails?.[0]?.slotTime;
        if (!appointmentSlotTime) return false;

        const appointmentDateString =
          dayjs(appointmentSlotTime).format("YYYY-MM-DD");
        return appointmentDateString === selectedDateString;
      }
    );

    // Phân chia theo status của appointmentDetails
    const organizedData = {
      CONFIRMED: [], // Đã xác nhận - sẵn sàng tư vấn
      IN_PROGRESS: [], // Đang tư vấn
      WAITING_RESULT: [], // Chờ kết quả
      COMPLETED: [], // Hoàn thành
    };

    consultationsOnSelectedDate.forEach((appointment) => {
      // Lấy status từ appointmentDetails đầu tiên
      const appointmentDetailStatus =
        appointment.appointmentDetails?.[0]?.status;

      // Phân loại theo status
      if (appointmentDetailStatus === "CONFIRMED") {
        organizedData.CONFIRMED.push(appointment);
      } else if (appointmentDetailStatus === "IN_PROGRESS") {
        organizedData.IN_PROGRESS.push(appointment);
      } else if (appointmentDetailStatus === "WAITING_RESULT") {
        organizedData.WAITING_RESULT.push(appointment);
      } else if (appointmentDetailStatus === "COMPLETED") {
        organizedData.COMPLETED.push(appointment);
      }
    });

    // Cập nhật state với dữ liệu đã phân chia
    setTabsData(organizedData);
  };

  // useEffect chạy khi component được mount (hiển thị lần đầu) hoặc khi userId thay đổi
  useEffect(() => {
    // Chỉ gọi API khi có userId
    if (userId) {
      fetchAllOnlineConsultations();
    }
  }, [userId]); // Chạy lại khi userId thay đổi

  // Hàm xử lý khi người dùng thay đổi ngày trong DatePicker
  const handleDatePickerChange = (newSelectedDate) => {
    // Nếu người dùng không chọn ngày nào, sử dụng ngày hôm nay
    const dateToUse = newSelectedDate || dayjs();

    // Chuyển từ dayjs object thành JavaScript Date object
    const javascriptDateObject = dateToUse.toDate();

    // Cập nhật state với ngày mới được chọn
    setCurrentSelectedDate(javascriptDateObject);

    // Phân chia lại dữ liệu theo ngày mới
    organizeDataByTabsAndDate(allOnlineConsultations, javascriptDateObject);
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

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "Không có";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "orange",
      CONFIRMED: "blue",
      CHECKED: "green",
      COMPLETED: "success",
      CANCELED: "red",
      ABSENT: "default",
    };
    return statusColors[status] || "default";
  };

  // Get status text in Vietnamese
  const getStatusText = (status) => {
    const statusTexts = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      CHECKED: "Đã check in",
      COMPLETED: "Hoàn thành",
      CANCELED: "Đã hủy",
      ABSENT: "Vắng mặt",
    };
    return statusTexts[status] || status;
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
        render: (_, record) => {
          const detail = record.appointmentDetails?.[0];
          const status = detail?.status || record.status;
          return (
            <Tag
              color={getStatusColor(status)}
              className="consultation-status-tag"
            >
              {getStatusText(status)}
            </Tag>
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
                  onClick={() => window.open(startUrl, "_blank")}
                >
                  Bắt đầu tư vấn
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
      >
        {selectedAppointmentDetail && (
          <MedicalResultFormWrapper
            appointmentDetail={selectedAppointmentDetail}
            onSuccess={() => {
              setIsResultModalVisible(false);
              setSelectedAppointmentDetail(null);
              toast.success("Kết quả đã được lưu thành công!");
              // Reload data để cập nhật
              fetchAllOnlineConsultations();
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
