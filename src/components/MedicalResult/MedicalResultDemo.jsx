import React from "react";
import { Row, Col, Card, Typography, Space, Divider, Button } from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import MedicalResultViewer, {
  MedicalResultDashboard,
} from "./MedicalResultViewer";
import MedicalResultTimeline from "./MedicalResultTimeline";

const { Title, Paragraph } = Typography;

const MedicalResultDemo = () => {
  // Mock data for demonstration
  const mockResults = [
    {
      id: 1,
      testName: "Glucose máu",
      testResult: "126",
      normalRange: "70-100",
      testStatus: "ABNORMAL",
      resultType: "LAB_TEST",
      severity: "HIGH",
      diagnosis: "Tiền tiểu đường - cần theo dõi và điều chỉnh chế độ ăn uống",
      treatmentPlan:
        "Kiểm soát chế độ ăn, tập thể dục đều đặn, tái khám sau 3 tháng",
      labNotes: "Bệnh nhân nhịn ăn 8 tiếng trước khi xét nghiệm",
      createdAt: "2024-01-15T08:30:00Z",
      doctorName: "BS. Nguyễn Văn A",
    },
    {
      id: 2,
      testName: "Cholesterol toàn phần",
      testResult: "180",
      normalRange: "150-200",
      testStatus: "NORMAL",
      resultType: "LAB_TEST",
      severity: "LOW",
      diagnosis: "Mức cholesterol trong giới hạn bình thường",
      treatmentPlan: "Duy trì chế độ ăn uống lành mạnh",
      createdAt: "2024-01-15T08:30:00Z",
      doctorName: "BS. Nguyễn Văn A",
    },
    {
      id: 3,
      testName: "X-quang phổi",
      testResult: "Phát hiện đốm mờ vùng phổi trái",
      normalRange: "Không có bất thường",
      testStatus: "ABNORMAL",
      resultType: "IMAGING",
      severity: "MEDIUM",
      diagnosis: "Nghi ngờ viêm phổi nhẹ hoặc sẹo phổi cũ",
      treatmentPlan:
        "Chụp CT phổi để đánh giá chi tiết hơn, kê đơn kháng sinh dự phòng",
      labNotes: "Bệnh nhân có tiền sử hút thuốc",
      createdAt: "2024-01-14T14:20:00Z",
      doctorName: "BS. Trần Thị B",
    },
    {
      id: 4,
      testName: "Tư vấn tim mạch",
      testResult: "Nhịp tim đều, huyết áp 130/85",
      normalRange: "120/80",
      testStatus: "BORDERLINE",
      resultType: "CONSULTATION",
      severity: "MEDIUM",
      diagnosis: "Huyết áp cao nhẹ (giai đoạn 1)",
      treatmentPlan:
        "Giảm muối trong ăn uống, tập thể dục nhẹ nhàng, theo dõi huyết áp hàng ngày",
      createdAt: "2024-01-13T10:15:00Z",
      doctorName: "BS. Lê Văn C",
    },
    {
      id: 5,
      testName: "Glucose máu",
      testResult: "95",
      normalRange: "70-100",
      testStatus: "NORMAL",
      resultType: "LAB_TEST",
      severity: "LOW",
      diagnosis: "Đường huyết bình thường",
      treatmentPlan: "Tiếp tục duy trì chế độ ăn uống hiện tại",
      createdAt: "2023-12-15T08:30:00Z",
      doctorName: "BS. Nguyễn Văn A",
    },
    {
      id: 6,
      testName: "Glucose máu",
      testResult: "110",
      normalRange: "70-100",
      testStatus: "BORDERLINE",
      resultType: "LAB_TEST",
      severity: "MEDIUM",
      diagnosis: "Đường huyết cao nhẹ",
      treatmentPlan: "Giảm đường trong ăn uống, tái khám sau 1 tháng",
      createdAt: "2023-11-15T08:30:00Z",
      doctorName: "BS. Nguyễn Văn A",
    },
  ];

  // Filter glucose results for timeline demo
  const glucoseResults = mockResults.filter(
    (r) => r.testName === "Glucose máu"
  );

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <Title level={2}>🏥 Medical Result Viewer - Demo</Title>
      <Paragraph>
        Hệ thống hiển thị kết quả y tế chuyên nghiệp, lấy cảm hứng từ các bệnh
        viện hàng đầu thế giới
      </Paragraph>

      <Divider />

      {/* Compact View Demo */}
      <Title level={3}>📋 Chế độ xem compact</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {mockResults.slice(0, 4).map((result) => (
          <Col span={12} key={result.id}>
            <MedicalResultViewer result={result} compact={true} />
          </Col>
        ))}
      </Row>

      <Divider />

      {/* Full View Demo */}
      <Title level={3}>📊 Chế độ xem chi tiết</Title>
      <Card style={{ marginBottom: 32 }}>
        <MedicalResultViewer result={mockResults[0]} compact={false} />
      </Card>

      <Divider />

      {/* Timeline Demo */}
      <Title level={3}>📈 Lịch sử theo dõi</Title>
      <Card style={{ marginBottom: 32 }}>
        <MedicalResultTimeline
          results={glucoseResults}
          testName="Glucose máu"
        />
      </Card>

      <Divider />

      {/* Dashboard Demo */}
      <Title level={3}>🎛️ Dashboard tổng quan</Title>
      <MedicalResultDashboard results={mockResults} />

      <Divider />

      {/* Interactive Demo */}
      <Title level={3}>🎮 Demo tương tác</Title>
      <Card style={{ marginBottom: 32 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Test các chức năng">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  block
                  onClick={() => {
                    // Import the function from the component
                    const result = mockResults[0];
                    const link = document.createElement("a");
                    link.href =
                      "data:text/html;charset=utf-8," +
                      encodeURIComponent(`
                      <h1>Demo PDF - ${result.testName}</h1>
                      <p>Kết quả: ${result.testResult}</p>
                      <p>Trạng thái: ${result.testStatus}</p>
                      <p>Chẩn đoán: ${result.diagnosis}</p>
                    `);
                    link.download = "demo-result.html";
                    link.click();
                  }}
                >
                  Test tải xuống PDF
                </Button>
                <Button
                  icon={<PrinterOutlined />}
                  block
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    printWindow.document.write(`
                      <h1>Demo Print - ${mockResults[0].testName}</h1>
                      <p>Kết quả: ${mockResults[0].testResult}</p>
                      <p>Trạng thái: ${mockResults[0].testStatus}</p>
                    `);
                    printWindow.document.close();
                    printWindow.print();
                  }}
                >
                  Test in ấn
                </Button>
                <Button
                  danger
                  icon={<CloseOutlined />}
                  block
                  onClick={() => {
                    if (window.history.length > 1) {
                      window.history.back();
                    } else {
                      alert("Demo: Sẽ đóng tab (Ctrl+W)");
                    }
                  }}
                >
                  Test đóng tab
                </Button>
              </Space>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Keyboard Shortcuts">
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>P</kbd> - In nhanh
                </li>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>S</kbd> - Lưu/Tải xuống
                </li>
                <li>
                  <kbd>Ctrl</kbd> + <kbd>W</kbd> - Đóng tab
                </li>
                <li>
                  <kbd>Esc</kbd> - Đóng modal
                </li>
                <li>
                  <kbd>Enter</kbd> - Xem chi tiết
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Features List */}
      <Card title="✨ Tính năng nổi bật">
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>🎨 Thiết kế chuyên nghiệp</Title>
            <ul>
              <li>Giao diện hiện đại, trực quan</li>
              <li>Màu sắc phân loại theo mức độ nghiêm trọng</li>
              <li>Responsive design cho mọi thiết bị</li>
              <li>Animation mượt mà</li>
            </ul>
          </Col>
          <Col span={12}>
            <Title level={4}>📊 Trực quan hóa dữ liệu</Title>
            <ul>
              <li>Progress bar cho giá trị xét nghiệm</li>
              <li>Timeline theo dõi lịch sử</li>
              <li>Dashboard thống kê tổng quan</li>
              <li>Biểu đồ xu hướng (coming soon)</li>
            </ul>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Title level={4}>🔧 Tính năng tiện ích - ĐÃ HOẠT ĐỘNG</Title>
            <ul>
              <li>✅ Export HTML/PDF hoạt động</li>
              <li>✅ Print với layout tối ưu</li>
              <li>✅ Modal xem chi tiết</li>
              <li>✅ Đóng tab thông minh</li>
              <li>✅ Toast notifications</li>
              <li>✅ Loading states</li>
            </ul>
          </Col>
          <Col span={12}>
            <Title level={4}>🏥 Chuẩn y tế</Title>
            <ul>
              <li>Tuân thủ chuẩn hiển thị y tế</li>
              <li>Phân loại mức độ nghiêm trọng</li>
              <li>Ghi chú từ bác sĩ/phòng lab</li>
              <li>Lịch sử theo dõi chi tiết</li>
              <li>Keyboard accessibility</li>
              <li>Print-optimized layouts</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MedicalResultDemo;
