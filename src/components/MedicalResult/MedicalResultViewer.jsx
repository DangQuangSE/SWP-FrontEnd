import React, { useState, useRef } from "react";
import {
  Card,
  Badge,
  Progress,
  Tooltip,
  Button,
  Modal,
  Descriptions,
  Timeline,
  Alert,
  Tag,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Statistic,
  Table,
  message,
} from "antd";
import {
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HeartOutlined,
  ExperimentOutlined,
  RadarChartOutlined,
  AlertOutlined,
  TrophyOutlined,
  WarningOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import "./MedicalResultViewer.css";

const { Text, Title, Paragraph } = Typography;

// Utility functions for actions
const generatePDF = async (result) => {
  try {
    message.loading({ content: "Đang tạo file PDF...", key: "pdf" });

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Kết quả khám - ${result.testName || result.serviceName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #1890ff; padding-bottom: 20px; margin-bottom: 30px; }
          .result-section { margin-bottom: 20px; padding: 15px; border: 1px solid #f0f0f0; border-radius: 8px; }
          .result-title { font-size: 18px; font-weight: bold; color: #1890ff; margin-bottom: 10px; }
          .result-value { font-size: 24px; font-weight: bold; color: ${
            result.testStatus === "ABNORMAL"
              ? "#ff4d4f"
              : result.testStatus === "NORMAL"
              ? "#52c41a"
              : "#faad14"
          }; }
          .normal-range { color: #666; font-size: 14px; }
          .diagnosis { background: #f6ffed; padding: 15px; border-left: 4px solid #52c41a; margin: 15px 0; }
          .treatment { background: #fff7e6; padding: 15px; border-left: 4px solid #faad14; margin: 15px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KẾT QUẢ KHÁM BỆNH</h1>
          <p><strong>${result.testName || result.serviceName}</strong></p>
          <p>Ngày: ${
            result.createdAt
              ? new Date(result.createdAt).toLocaleDateString("vi-VN")
              : "N/A"
          }</p>
        </div>

        <div class="result-section">
          <div class="result-title">Kết quả xét nghiệm</div>
          <div class="result-value">${result.testResult || "N/A"}</div>
          <div class="normal-range">Giá trị bình thường: ${
            result.normalRange || "N/A"
          }</div>
        </div>

        ${
          result.diagnosis
            ? `
        <div class="diagnosis">
          <strong>Chẩn đoán:</strong><br>
          ${result.diagnosis}
        </div>
        `
            : ""
        }

        ${
          result.treatmentPlan
            ? `
        <div class="treatment">
          <strong>Kế hoạch điều trị:</strong><br>
          ${result.treatmentPlan}
        </div>
        `
            : ""
        }

        ${
          result.labNotes
            ? `
        <div class="result-section">
          <div class="result-title">Ghi chú từ phòng lab</div>
          <p>${result.labNotes}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p><strong>Bác sĩ thực hiện:</strong> ${
            result.doctorName || "N/A"
          }</p>
          <p><strong>Ngày tạo báo cáo:</strong> ${new Date().toLocaleDateString(
            "vi-VN"
          )}</p>
          <p><em>Báo cáo này được tạo tự động từ hệ thống quản lý bệnh viện</em></p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ket-qua-kham-${
      result.testName || "result"
    }-${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success({ content: "Đã tải xuống file thành công!", key: "pdf" });
    toast.success("File đã được tải xuống thành công!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    message.error({ content: "Lỗi khi tạo file PDF!", key: "pdf" });
    toast.error("Có lỗi xảy ra khi tạo file PDF!");
  }
};

const handlePrint = (result) => {
  try {
    const printContent = `
      <html>
      <head>
        <title>In kết quả khám - ${
          result.testName || result.serviceName
        }</title>
        <style>
          @media print {
            body { margin: 0; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
          }
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .result-section { margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; }
          .result-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          .result-value { font-size: 24px; font-weight: bold; }
          .diagnosis { background: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin: 15px 0; }
          .treatment { background: #f9f9f9; padding: 15px; border-left: 4px solid #000; margin: 15px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>KẾT QUẢ KHÁM BỆNH</h1>
          <p><strong>${result.testName || result.serviceName}</strong></p>
          <p>Ngày: ${
            result.createdAt
              ? new Date(result.createdAt).toLocaleDateString("vi-VN")
              : "N/A"
          }</p>
        </div>

        <div class="result-section">
          <div class="result-title">Kết quả xét nghiệm</div>
          <div class="result-value">${result.testResult || "N/A"}</div>
          <p>Giá trị bình thường: ${result.normalRange || "N/A"}</p>
          <p>Trạng thái: ${
            result.testStatus === "NORMAL"
              ? "Bình thường"
              : result.testStatus === "ABNORMAL"
              ? "Bất thường"
              : "Đang xử lý"
          }</p>
        </div>

        ${
          result.diagnosis
            ? `
        <div class="diagnosis">
          <strong>Chẩn đoán:</strong><br>
          ${result.diagnosis}
        </div>
        `
            : ""
        }

        ${
          result.treatmentPlan
            ? `
        <div class="treatment">
          <strong>Kế hoạch điều trị:</strong><br>
          ${result.treatmentPlan}
        </div>
        `
            : ""
        }

        ${
          result.labNotes
            ? `
        <div class="result-section">
          <div class="result-title">Ghi chú từ phòng lab</div>
          <p>${result.labNotes}</p>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p><strong>Bác sĩ thực hiện:</strong> ${
            result.doctorName || "N/A"
          }</p>
          <p><strong>Ngày in:</strong> ${new Date().toLocaleDateString(
            "vi-VN"
          )} ${new Date().toLocaleTimeString("vi-VN")}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      // Close window after printing (optional)
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };

    toast.success("Đã mở cửa sổ in!");
  } catch (error) {
    console.error("Error printing:", error);
    toast.error("Có lỗi xảy ra khi in!");
  }
};

const handleCloseTab = () => {
  try {
    // Try to close current tab/window
    if (window.history.length > 1) {
      window.history.back();
      toast.info("Đã quay lại trang trước");
    } else {
      window.close();
      // If can't close (due to browser restrictions), show message
      setTimeout(() => {
        toast.info("Vui lòng đóng tab thủ công (Ctrl+W)");
      }, 100);
    }
  } catch (error) {
    console.error("Error closing tab:", error);
    toast.info("Vui lòng đóng tab thủ công (Ctrl+W)");
  }
};

const MedicalResultViewer = ({ result, compact = false, onClose }) => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const printRef = useRef();

  if (!result) {
    return (
      <div className="medical-result-empty">
        <FileTextOutlined style={{ fontSize: 24, color: "#d9d9d9" }} />
        <Text type="secondary">Chưa có kết quả khám</Text>
      </div>
    );
  }

  // Determine result severity and styling
  const getResultSeverity = (result) => {
    if (result.testStatus === "ABNORMAL" || result.severity === "HIGH") {
      return {
        level: "error",
        icon: <AlertOutlined />,
        color: "#ff4d4f",
        label: "Cần chú ý",
      };
    }
    if (result.testStatus === "BORDERLINE" || result.severity === "MEDIUM") {
      return {
        level: "warning",
        icon: <WarningOutlined />,
        color: "#faad14",
        label: "Theo dõi",
      };
    }
    if (result.testStatus === "NORMAL" || result.severity === "LOW") {
      return {
        level: "success",
        icon: <CheckCircleOutlined />,
        color: "#52c41a",
        label: "Bình thường",
      };
    }
    return {
      level: "processing",
      icon: <ClockCircleOutlined />,
      color: "#1890ff",
      label: "Đang xử lý",
    };
  };

  const severity = getResultSeverity(result);

  // Parse lab values for visualization
  const parseLabValue = (value, normalRange) => {
    if (!value || !normalRange) return null;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    // Parse normal range (e.g., "10-20", "<5", ">100")
    const rangeMatch = normalRange.match(
      /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/
    );
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const percentage = Math.min(
        100,
        Math.max(0, ((numValue - min) / (max - min)) * 100)
      );

      return {
        value: numValue,
        min,
        max,
        percentage,
        status: numValue < min ? "low" : numValue > max ? "high" : "normal",
      };
    }

    return { value: numValue, status: "unknown" };
  };

  const labData = parseLabValue(result.testResult, result.normalRange);

  if (compact) {
    return (
      <Card
        size="small"
        className="medical-result-compact"
        hoverable
        onClick={() => setDetailModalVisible(true)}
      >
        <div className="result-compact-header">
          <Space>
            <Badge
              status={severity.level}
              text={
                <Text strong style={{ color: severity.color }}>
                  {result.testName || result.serviceName}
                </Text>
              }
            />
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                setDetailModalVisible(true);
              }}
            >
              Chi tiết
            </Button>
          </Space>
        </div>

        {(result.testResult || result.normalRange) && (
          <div className="result-compact-value">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Kết quả"
                  value={result.testResult || "N/A"}
                  valueStyle={{
                    color: severity.color,
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                />
              </Col>
              <Col span={12}>
                <div className="result-range-indicator">
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Tham chiếu: {result.normalRange || "N/A"}
                  </Text>
                  <div style={{ marginTop: 4 }}>
                    <Badge status={severity.level} text={severity.label} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        <DetailModal
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          result={result}
          severity={severity}
          labData={labData}
        />
      </Card>
    );
  }

  return (
    <Card className="medical-result-full">
      <div className="result-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              {severity.icon}
              <Title level={4} style={{ margin: 0, color: severity.color }}>
                {result.testName || result.serviceName}
              </Title>
              <Tag color={severity.level}>{severity.label}</Tag>
              {result.createdAt && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {new Date(result.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<PrinterOutlined />}
                size="small"
                onClick={() => handlePrint(result)}
                type="primary"
                ghost
              >
                In kết quả
              </Button>
              {onClose && (
                <Button
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={onClose}
                  type="text"
                >
                  Đóng
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      <Row gutter={24}>
        <Col span={24}>
          <div className="result-content">
            {/* Thông tin bệnh nhân */}
            {(result.customerName || result.appointmentId) && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Bệnh nhân: </Text>
                    <Text>{result.customerName || "N/A"}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Mã phiếu khám: </Text>
                    <Text>#{result.appointmentId || "N/A"}</Text>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Kết quả xét nghiệm */}
            {(result.testResult || result.normalRange) && (
              <Card
                size="small"
                title={
                  <Space>
                    <ExperimentOutlined />
                    <span>Kết quả xét nghiệm</span>
                  </Space>
                }
                className="lab-values-card"
                style={{ marginBottom: 16 }}
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Kết quả đo được"
                      value={result.testResult || "Chưa có"}
                      valueStyle={{
                        color: severity.color,
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Giá trị tham chiếu"
                      value={result.normalRange || "N/A"}
                      valueStyle={{ fontSize: "16px", color: "#666" }}
                    />
                  </Col>
                  <Col span={8}>
                    <div className="result-status-indicator">
                      <Text strong>Đánh giá</Text>
                      <div style={{ marginTop: 8 }}>
                        <Badge
                          status={severity.level}
                          text={
                            <Text
                              style={{
                                color: severity.color,
                                fontWeight: "bold",
                              }}
                            >
                              {severity.label}
                            </Text>
                          }
                        />
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Thông tin phương pháp và mẫu xét nghiệm */}
                {(result.testMethod || result.specimenType) && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: 12,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 6,
                    }}
                  >
                    <Row gutter={16}>
                      {result.testMethod && (
                        <Col span={12}>
                          <Text type="secondary">Phương pháp: </Text>
                          <Text>{result.testMethod}</Text>
                        </Col>
                      )}
                      {result.specimenType && (
                        <Col span={12}>
                          <Text type="secondary">Loại mẫu: </Text>
                          <Text>{result.specimenType}</Text>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
              </Card>
            )}

            {/* Chẩn đoán */}
            {result.diagnosis && (
              <Alert
                message="Chẩn đoán của bác sĩ"
                description={result.diagnosis}
                type={severity.level}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            {/* Kế hoạch điều trị */}
            {result.treatmentPlan && (
              <Card
                size="small"
                title={
                  <Space>
                    <HeartOutlined />
                    <span>Kế hoạch điều trị</span>
                  </Space>
                }
                style={{ marginBottom: 16 }}
              >
                <Paragraph style={{ margin: 0 }}>
                  {result.treatmentPlan}
                </Paragraph>
              </Card>
            )}

            {/* Thông tin bổ sung */}
            <Card size="small" title="Thông tin chi tiết">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Loại kết quả">
                  {result.resultType === "LAB_TEST" ? "Xét nghiệm" : "Tư vấn"}
                </Descriptions.Item>
                {result.sampleCollectedAt && (
                  <Descriptions.Item label="Thời gian lấy mẫu">
                    {new Date(result.sampleCollectedAt).toLocaleString("vi-VN")}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Ngày có kết quả">
                  {result.createdAt
                    ? new Date(result.createdAt).toLocaleDateString("vi-VN")
                    : "N/A"}
                </Descriptions.Item>
                {result.doctorName && (
                  <Descriptions.Item label="Bác sĩ thực hiện">
                    {result.doctorName}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {result.labNotes && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: "#f0f8ff",
                    borderRadius: 6,
                  }}
                >
                  <Text strong style={{ color: "#1890ff" }}>
                    Ghi chú từ phòng lab:
                  </Text>
                  <Paragraph
                    style={{ marginTop: 8, marginBottom: 0, fontSize: "13px" }}
                  >
                    {result.labNotes}
                  </Paragraph>
                </div>
              )}
            </Card>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

const getTestTypeDisplay = (type) => {
  const types = {
    LAB_TEST: {
      icon: <ExperimentOutlined />,
      text: "Xét nghiệm",
      color: "#1890ff",
    },
    IMAGING: {
      icon: <RadarChartOutlined />,
      text: "Chẩn đoán hình ảnh",
      color: "#722ed1",
    },
    CONSULTATION: { icon: <HeartOutlined />, text: "Tư vấn", color: "#52c41a" },
  };

  const typeInfo = types[type] || {
    icon: <FileTextOutlined />,
    text: type,
    color: "#666",
  };

  return (
    <Space>
      <span style={{ color: typeInfo.color }}>{typeInfo.icon}</span>
      <Text style={{ color: typeInfo.color }}>{typeInfo.text}</Text>
    </Space>
  );
};

const DetailModal = ({ visible, onClose, result, severity, labData }) => (
  <Modal
    title={
      <Space>
        {severity.icon}
        <span>Chi tiết kết quả: {result.testName || result.serviceName}</span>
      </Space>
    }
    open={visible}
    onCancel={onClose}
    footer={[
      <Button
        key="print"
        icon={<PrinterOutlined />}
        type="primary"
        onClick={() => handlePrint(result)}
      >
        In kết quả
      </Button>,
      <Button key="close" onClick={onClose} type="default">
        Đóng
      </Button>,
    ]}
    width={900}
    style={{ top: 20 }}
    destroyOnClose
  >
    <MedicalResultViewer result={result} compact={false} />
  </Modal>
);

// Advanced Medical Dashboard Component
const MedicalResultDashboard = ({ results = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Categorize results
  const categorizedResults = {
    all: results,
    abnormal: results.filter((r) => r.testStatus === "ABNORMAL"),
    normal: results.filter((r) => r.testStatus === "NORMAL"),
    pending: results.filter((r) => r.testStatus === "PENDING"),
    lab: results.filter((r) => r.resultType === "LAB_TEST"),
    imaging: results.filter((r) => r.resultType === "IMAGING"),
    consultation: results.filter((r) => r.resultType === "CONSULTATION"),
  };

  const stats = {
    total: results.length,
    abnormal: categorizedResults.abnormal.length,
    normal: categorizedResults.normal.length,
    pending: categorizedResults.pending.length,
    criticalCount: results.filter((r) => r.severity === "HIGH").length,
  };

  return (
    <div className="medical-dashboard">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số kết quả"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Cần chú ý"
              value={stats.abnormal}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Bình thường"
              value={stats.normal}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang chờ"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Kết quả xét nghiệm"
        extra={
          <Space>
            <Button
              type={selectedCategory === "all" ? "primary" : "default"}
              size="small"
              onClick={() => setSelectedCategory("all")}
            >
              Tất cả ({stats.total})
            </Button>
            <Button
              type={selectedCategory === "abnormal" ? "primary" : "default"}
              size="small"
              danger={selectedCategory === "abnormal"}
              onClick={() => setSelectedCategory("abnormal")}
            >
              Bất thường ({stats.abnormal})
            </Button>
            <Button
              type={selectedCategory === "normal" ? "primary" : "default"}
              size="small"
              onClick={() => setSelectedCategory("normal")}
            >
              Bình thường ({stats.normal})
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {categorizedResults[selectedCategory].map((result, index) => (
            <Col span={12} key={result.id || index}>
              <MedicalResultViewer result={result} compact={true} />
            </Col>
          ))}
        </Row>

        {categorizedResults[selectedCategory].length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <FileTextOutlined
              style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
            />
            <Text type="secondary">
              Không có kết quả nào trong danh mục này
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicalResultViewer;
export { MedicalResultDashboard };
