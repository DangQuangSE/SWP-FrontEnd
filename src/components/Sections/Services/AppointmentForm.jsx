import { useState } from "react";
import {
  Select,
  DatePicker,
  Button,
  Tabs,
  Card,
  Row,
  Col,
  Typography,
  Space,
} from "antd";
import {
  EnvironmentOutlined,
  LeftOutlined,
  RightOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./AppointmentForm.css";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Dữ liệu mẫu
const specialties = [
  { id: 1, name: "Nội khoa" },
  { id: 2, name: "Ngoại khoa" },
  { id: 3, name: "Nhi khoa" },
  { id: 4, name: "Da liễu" },
  { id: 5, name: "Mắt" },
];

const doctors = {
  1: [
    { id: 1, name: "BS. Nguyễn Văn A", specialty: 1 },
    { id: 2, name: "BS. Trần Thị B", specialty: 1 },
  ],
  2: [
    { id: 3, name: "BS. Lê Văn C", specialty: 2 },
    { id: 4, name: "BS. Phạm Thị D", specialty: 2 },
  ],
  3: [
    { id: 5, name: "BS. Hoàng Văn E", specialty: 3 },
    { id: 6, name: "BS. Ngô Thị F", specialty: 3 },
  ],
  4: [
    { id: 7, name: "BS. Đỗ Văn G", specialty: 4 },
    { id: 8, name: "BS. Vũ Thị H", specialty: 4 },
  ],
  5: [
    { id: 9, name: "BS. Bùi Văn I", specialty: 5 },
    { id: 10, name: "BS. Dương Thị K", specialty: 5 },
  ],
};

const availableSlots = {
  1: {
    "2025-06-08": { morning: 2, afternoon: 5, evening: 0 },
    "2025-06-09": { morning: 9, afternoon: 8, evening: 3 },
    "2025-06-10": { morning: 5, afternoon: 16, evening: 2 },
  },
  2: {
    "2025-06-08": { morning: 0, afternoon: 3, evening: 1 },
    "2025-06-09": { morning: 7, afternoon: 4, evening: 0 },
    "2025-06-10": { morning: 12, afternoon: 8, evening: 4 },
  },
};

const timeSlots = {
  morning: ["08:00 - 08:30", "09:00 - 09:30", "10:00 - 10:30", "11:00 - 11:30"],
  afternoon: [
    "13:00 - 13:30",
    "14:00 - 14:30",
    "15:00 - 15:30",
    "16:00 - 16:30",
    "17:00 - 17:30",
  ],
  evening: ["18:00 - 18:30", "19:00 - 19:30", "20:00 - 20:30"],
};

const AppointmentForm = () => {
  const [dateRange, setDateRange] = useState([
    dayjs("2025-06-08"),
    dayjs("2025-07-07"),
  ]);
  const [specialty, setSpecialty] = useState(undefined);
  const [doctor, setDoctor] = useState(undefined);
  const [selectedDay, setSelectedDay] = useState("2025-06-09");
  const [selectedTime, setSelectedTime] = useState("11:00 - 11:30");
  const [activeTab, setActiveTab] = useState("morning");

  // Xử lý khi chọn chuyên khoa
  const handleSpecialtyChange = (value) => {
    setSpecialty(value);
    setDoctor(undefined);
  };

  // Lấy danh sách bác sĩ theo chuyên khoa
  const getDoctorsBySpecialty = (specialtyId) => {
    return specialtyId ? doctors[specialtyId] || [] : [];
  };

  // Dữ liệu ngày hiển thị
  const displayDays = [
    { date: "2025-06-08", day: "CN", dayNum: "8/6", available: 0 },
    { date: "2025-06-09", day: "Thứ 2", dayNum: "9/6", available: 9 },
    { date: "2025-06-10", day: "Thứ 3", dayNum: "10/6", available: 16 },
  ];

  const getAvailableSlots = (timeOfDay) => {
    if (
      !doctor ||
      !availableSlots[doctor] ||
      !availableSlots[doctor][selectedDay]
    ) {
      return timeOfDay === "morning" ? 1 : timeOfDay === "afternoon" ? 8 : 0;
    }
    return availableSlots[doctor][selectedDay][timeOfDay];
  };

  const handleContinue = () => {
    console.log("Thông tin đặt lịch:", {
      specialty,
      doctor,
      dateRange,
      selectedDay,
      selectedTime,
      activeTab,
    });
    alert("Tiếp tục đặt lịch thành công!");
  };

  return (
    <div className="appointment-page-container">
      <Row gutter={24} className="main-content">
        <Col xs={24} lg={12} className="left-panel">
          <Card className="info-card">
            <Tabs defaultActiveKey="general" className="info-tabs">
              <TabPane tab="Thông tin chung" key="general">
                <div className="working-hours">
                  <Title level={4}>Giờ làm việc</Title>
                  <div className="about-sheathycare" style={{ marginTop: 24 }}>
                    <Title level={4}>Giới thiệu SheathyCare</Title>
                    <Text>
                      SheathyCare là cơ sở chăm sóc sức khỏe tiên phong trong
                      việc kết hợp giữa chuyên môn y tế, công nghệ hiện đại và
                      dịch vụ thân thiện với người dùng, hướng đến việc chăm sóc
                      toàn diện sức khỏe giới tính và sinh sản cho cộng đồng.
                    </Text>
                    <ul>
                      <li>Theo dõi chu kỳ sinh sản</li>
                      <li>Đặt lịch tư vấn với chuyên gia</li>
                      <li>
                        Thực hiện xét nghiệm các bệnh lây truyền qua đường tình
                        dục (STIs)
                      </li>
                      <li>Nhận lời khuyên y tế cá nhân hóa</li>
                      <li>Quản lý hồ sơ sức khỏe riêng tư, bảo mật</li>
                    </ul>

                    <Title level={5}>Đội ngũ chuyên gia hàng đầu</Title>
                    <Text>
                      SheathyCare quy tụ các bác sĩ chuyên khoa Sản – Phụ khoa,
                      Nam khoa, Da liễu, Thận – Tiết niệu,… có chuyên môn cao,
                      được đào tạo bài bản, tận tâm.
                    </Text>

                    <Title level={5} style={{ marginTop: 16 }}>
                      Công nghệ tiên tiến, tiện lợi
                    </Title>
                    <ul>
                      <li>Chẩn đoán hình ảnh & xét nghiệm hiện đại</li>
                      <li>
                        Quản lý lịch khám, trả kết quả xét nghiệm trực tuyến
                      </li>
                      <li>
                        Theo dõi và nhắc nhở chu kỳ rụng trứng, uống thuốc tránh
                        thai, khả năng thụ thai
                      </li>
                    </ul>

                    <Title level={5}>Dịch vụ chuyên biệt</Title>
                    <ul>
                      <li>Tư vấn sức khỏe giới tính và sinh sản</li>
                      <li>Xét nghiệm và điều trị các bệnh STIs</li>
                      <li>
                        Gói khám sức khỏe định kỳ cho cá nhân, doanh nghiệp và
                        chuyên gia nước ngoài
                      </li>
                    </ul>

                    <Title level={5}>Chuyên khoa hỗ trợ tại SheathyCare</Title>
                    <ul>
                      <li>Sản – Phụ khoa, Nam khoa, Da liễu</li>
                      <li>Nội – Ngoại tổng quát, Thận – Tiết niệu</li>
                      <li>
                        Cơ – Xương – Khớp, Nội thần kinh, Tai – Mũi – Họng
                      </li>
                    </ul>

                    <Title level={5}>Cơ sở vật chất – Trang thiết bị</Title>
                    <ul>
                      <li>Phòng xét nghiệm hiện đại đạt chuẩn</li>
                      <li>Máy siêu âm màu thế hệ mới, máy MRI, CT Scan</li>
                      <li>Không gian tư vấn riêng tư, bảo mật tuyệt đối</li>
                    </ul>

                    <Title level={5}>Tích hợp trong phần mềm SheathyCare</Title>
                    <ul>
                      <li>Giao diện trực quan, dễ sử dụng</li>
                      <li>Tư vấn viên quản lý lịch hẹn và hồ sơ người dùng</li>
                      <li>Người dùng đặt lịch, nhận nhắc nhở tự động</li>
                      <li>
                        Tích hợp AI đánh giá nguy cơ STIs dựa trên tiền sử
                      </li>
                      <li>Phản hồi – đánh giá minh bạch sau mỗi dịch vụ</li>
                    </ul>
                  </div>

                  <div className="schedule-list">
                    <div className="schedule-item">
                      <span className="day">Thứ Hai</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Thứ Ba</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Thứ Tư</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Thứ Năm</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Thứ Sáu</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Thứ Bảy</span>
                      <span className="hours">
                        07:30 - 11:30, 12:30 - 16:30
                      </span>
                    </div>
                    <div className="schedule-item">
                      <span className="day">Chủ Nhật</span>
                      <span className="hours closed">Đóng cửa</span>
                    </div>
                  </div>
                  <div className="emergency-info">
                    <Text type="success" strong>
                      Có cấp cứu
                    </Text>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="Dịch vụ (4)" key="services">
                <div className="services-list">
                  <Title level={4}>Danh sách dịch vụ</Title>
                  <div className="service-item">
                    <Title level={5}>Khám tổng quát</Title>
                    <Text type="secondary">
                      Khám sức khỏe định kỳ, tư vấn sức khỏe
                    </Text>
                    <div className="service-price">
                      <Text strong>500.000 đ</Text>
                    </div>
                  </div>
                  <div className="service-item">
                    <Title level={5}>Khám chuyên khoa</Title>
                    <Text type="secondary">
                      Khám và điều trị các bệnh chuyên khoa
                    </Text>
                    <div className="service-price">
                      <Text strong>800.000 đ</Text>
                    </div>
                  </div>
                  <div className="service-item">
                    <Title level={5}>Xét nghiệm máu</Title>
                    <Text type="secondary">
                      Xét nghiệm máu cơ bản và chuyên sâu
                    </Text>
                    <div className="service-price">
                      <Text strong>200.000 đ</Text>
                    </div>
                  </div>
                  <div className="service-item">
                    <Title level={5}>Siêu âm</Title>
                    <Text type="secondary">Siêu âm bụng, tim, thai...</Text>
                    <div className="service-price">
                      <Text strong>300.000 đ</Text>
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="Bác sĩ (30)" key="doctors">
                <div className="doctors-list">
                  <Title level={4}>Đội ngũ bác sĩ</Title>
                  <div className="doctor-item">
                    <div className="doctor-avatar">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt="BS. Nguyễn Văn A"
                      />
                    </div>
                    <div className="doctor-info">
                      <Title level={5}>BS. Nguyễn Văn A</Title>
                      <Text type="secondary">Chuyên khoa Nội</Text>
                      <div className="doctor-experience">
                        <Text>15 năm kinh nghiệm</Text>
                      </div>
                      <div className="doctor-rating">
                        <Text>⭐ 4.8 (120 đánh giá)</Text>
                      </div>
                    </div>
                  </div>
                  <div className="doctor-item">
                    <div className="doctor-avatar">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt="BS. Trần Thị B"
                      />
                    </div>
                    <div className="doctor-info">
                      <Title level={5}>BS. Trần Thị B</Title>
                      <Text type="secondary">Chuyên khoa Nhi</Text>
                      <div className="doctor-experience">
                        <Text>12 năm kinh nghiệm</Text>
                      </div>
                      <div className="doctor-rating">
                        <Text>⭐ 4.9 (95 đánh giá)</Text>
                      </div>
                    </div>
                  </div>
                  <div className="doctor-item">
                    <div className="doctor-avatar">
                      <img
                        src="/placeholder.svg?height=60&width=60"
                        alt="BS. Lê Văn C"
                      />
                    </div>
                    <div className="doctor-info">
                      <Title level={5}>BS. Lê Văn C</Title>
                      <Text type="secondary">Chuyên khoa Ngoại</Text>
                      <div className="doctor-experience">
                        <Text>20 năm kinh nghiệm</Text>
                      </div>
                      <div className="doctor-rating">
                        <Text>⭐ 4.7 (150 đánh giá)</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="Đánh giá (4)" key="reviews">
                <div className="reviews-list">
                  <Title level={4}>Đánh giá từ bệnh nhân</Title>
                  <div className="review-item">
                    <div className="review-header">
                      <Text strong>Nguyễn Minh H.</Text>
                      <Text type="secondary">⭐⭐⭐⭐⭐</Text>
                    </div>
                    <Text>
                      Bác sĩ tận tình, chu đáo. Phòng khám sạch sẽ, trang thiết
                      bị hiện đại.
                    </Text>
                    <Text type="secondary" className="review-date">
                      2 ngày trước
                    </Text>
                  </div>
                  <div className="review-item">
                    <div className="review-header">
                      <Text strong>Trần Thị L.</Text>
                      <Text type="secondary">⭐⭐⭐⭐⭐</Text>
                    </div>
                    <Text>
                      Dịch vụ tốt, nhân viên thân thiện. Sẽ quay lại lần sau.
                    </Text>
                    <Text type="secondary" className="review-date">
                      1 tuần trước
                    </Text>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        <Col xs={24} lg={12} className="right-panel">
          <Card className="appointment-card">
            {/* Di chuyển toàn bộ nội dung form đặt lịch vào đây */}
            <div className="appointment-header">
              <Title level={3} style={{ margin: 0 }}>
                Đặt lịch hẹn
              </Title>

              <div className="location-info">
                <EnvironmentOutlined className="location-icon" />
                <Text className="location-text">
                  Đường 22/12 Khu phố Hòa Lân, Phường Thuận Giao, Thành phố
                  Thuận An, Tỉnh Bình Dương
                </Text>
              </div>
            </div>

            <div className="form-section">
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Text strong>Chuyên khoa</Text>
                  <Select
                    className="full-width-select"
                    placeholder="Chọn chuyên khoa"
                    value={specialty}
                    onChange={handleSpecialtyChange}
                    size="large"
                  >
                    {specialties.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col span={24}>
                  <Text strong>Bác sĩ</Text>
                  <Select
                    className="full-width-select"
                    placeholder={
                      specialty
                        ? "Chọn bác sĩ"
                        : "Vui lòng chọn chuyên khoa trước"
                    }
                    value={doctor}
                    onChange={setDoctor}
                    disabled={!specialty}
                    size="large"
                  >
                    {getDoctorsBySpecialty(specialty).map((doc) => (
                      <Select.Option key={doc.id} value={doc.id}>
                        {doc.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>

                <Col span={24}>
                  <Text strong>Thời gian</Text>
                  <RangePicker
                    className="date-range-picker"
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates || [])}
                    format="DD [thg] MM, YYYY"
                    size="large"
                  />
                </Col>
              </Row>
            </div>

            <div className="schedule-section">
              <div className="schedule-header">
                <Text strong>Lịch trống gần nhất</Text>
                <Button type="link" className="today-btn">
                  Hôm nay
                </Button>
              </div>

              <div className="day-selector">
                <Button icon={<LeftOutlined />} type="text" />

                <div className="days-container">
                  {displayDays.map((day) => (
                    <div
                      key={day.date}
                      className={`day-card ${
                        selectedDay === day.date ? "selected" : ""
                      } ${day.available === 0 ? "disabled" : ""}`}
                      onClick={() =>
                        day.available > 0 && setSelectedDay(day.date)
                      }
                    >
                      <div className="day-name">{day.day}</div>
                      <div className="day-number">{day.dayNum}</div>
                      <div className="day-slots">{day.available} chỗ trống</div>
                    </div>
                  ))}
                </div>

                <Button icon={<RightOutlined />} type="text" />
              </div>

              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                className="time-tabs"
              >
                <TabPane
                  tab={`Sáng (${getAvailableSlots("morning")})`}
                  key="morning"
                >
                  <div className="time-slots-grid">
                    {timeSlots.morning.map((time) => (
                      <Button
                        key={time}
                        className={`time-slot ${
                          selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </TabPane>

                <TabPane
                  tab={`Chiều (${getAvailableSlots("afternoon")})`}
                  key="afternoon"
                >
                  <div className="time-slots-grid">
                    {timeSlots.afternoon.map((time) => (
                      <Button
                        key={time}
                        className={`time-slot ${
                          selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </TabPane>

                <TabPane
                  tab={`Tối (${getAvailableSlots("evening")})`}
                  key="evening"
                >
                  <div className="time-slots-grid">
                    {timeSlots.evening.map((time) => (
                      <Button
                        key={time}
                        className={`time-slot ${
                          selectedTime === time ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </TabPane>
              </Tabs>

              <div className="price-section">
                <Space>
                  <DollarOutlined />
                  <Text>Giá</Text>
                  <Text strong className="price">
                    965.000 đ
                  </Text>
                </Space>
              </div>

              <Button
                type="primary"
                size="large"
                className="continue-btn"
                block
                onClick={handleContinue}
              >
                TIẾP TỤC ĐẶT LỊCH
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentForm;
