import React, { useState } from "react";
import {
  Timeline,
  Card,
  Tag,
  Space,
  Button,
  Modal,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Typography,
  Tooltip,
  Badge,
} from "antd";
import {
  TrendingUpOutlined,
  TrendingDownOutlined,
  MinusOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import MedicalResultViewer from "./MedicalResultViewer";

const { Text, Title } = Typography;

const MedicalResultTimeline = ({ results = [], testName }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Sort results by date (newest first)
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate trends
  const calculateTrend = (current, previous) => {
    if (!current || !previous) return null;

    const currentValue = parseFloat(current.testResult);
    const previousValue = parseFloat(previous.testResult);

    if (isNaN(currentValue) || isNaN(previousValue)) return null;

    const change = currentValue - previousValue;
    const percentChange = (change / previousValue) * 100;

    return {
      change,
      percentChange,
      direction: change > 0 ? "up" : change < 0 ? "down" : "stable",
    };
  };

  const getTrendIcon = (trend) => {
    if (!trend) return <MinusOutlined style={{ color: "#999" }} />;

    switch (trend.direction) {
      case "up":
        return <TrendingUpOutlined style={{ color: "#ff4d4f" }} />;
      case "down":
        return <TrendingDownOutlined style={{ color: "#52c41a" }} />;
      default:
        return <MinusOutlined style={{ color: "#1890ff" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "NORMAL":
        return "success";
      case "ABNORMAL":
        return "error";
      case "BORDERLINE":
        return "warning";
      default:
        return "processing";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "NORMAL":
        return <CheckCircleOutlined />;
      case "ABNORMAL":
        return <ExclamationCircleOutlined />;
      case "BORDERLINE":
        return <ClockCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const showDetail = (result) => {
    setSelectedResult(result);
    setDetailModalVisible(true);
  };

  if (!results || results.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <LineChartOutlined
            style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
          />
          <Text type="secondary">Chưa có lịch sử kết quả xét nghiệm</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <LineChartOutlined />
          <span>Lịch sử kết quả: {testName}</span>
          <Badge
            count={results.length}
            style={{ backgroundColor: "#52c41a" }}
          />
        </Space>
      }
      extra={
        <Button
          type="primary"
          ghost
          icon={<LineChartOutlined />}
          onClick={() => {
            /* TODO: Show chart view */
          }}
        >
          Xem biểu đồ
        </Button>
      }
    >
      <Timeline mode="left">
        {sortedResults.map((result, index) => {
          const previousResult = sortedResults[index + 1];
          const trend = calculateTrend(result, previousResult);
          const isLatest = index === 0;

          return (
            <Timeline.Item
              key={result.id || index}
              color={getStatusColor(result.testStatus)}
              dot={
                <Badge
                  dot={isLatest}
                  status={getStatusColor(result.testStatus)}
                >
                  {getStatusIcon(result.testStatus)}
                </Badge>
              }
            >
              <Card
                size="small"
                className={`timeline-result-card ${
                  isLatest ? "latest-result" : ""
                }`}
                hoverable
                style={{
                  marginBottom: 16,
                  border: isLatest ? "2px solid #1890ff" : "1px solid #f0f0f0",
                }}
              >
                <Row gutter={16} align="middle">
                  <Col span={6}>
                    <div className="result-date">
                      <Text strong>
                        {new Date(result.createdAt).toLocaleDateString("vi-VN")}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {new Date(result.createdAt).toLocaleTimeString("vi-VN")}
                      </Text>
                      {isLatest && (
                        <Tag color="blue" size="small" style={{ marginTop: 4 }}>
                          Mới nhất
                        </Tag>
                      )}
                    </div>
                  </Col>

                  <Col span={6}>
                    <Statistic
                      title="Kết quả"
                      value={result.testResult}
                      precision={2}
                      valueStyle={{
                        fontSize: "18px",
                        color:
                          getStatusColor(result.testStatus) === "error"
                            ? "#ff4d4f"
                            : getStatusColor(result.testStatus) === "warning"
                            ? "#faad14"
                            : "#52c41a",
                      }}
                    />
                  </Col>

                  <Col span={4}>
                    <div className="result-status">
                      <Tag
                        color={getStatusColor(result.testStatus)}
                        icon={getStatusIcon(result.testStatus)}
                      >
                        {result.testStatus === "NORMAL"
                          ? "Bình thường"
                          : result.testStatus === "ABNORMAL"
                          ? "Bất thường"
                          : result.testStatus === "BORDERLINE"
                          ? "Biên giới"
                          : "Đang xử lý"}
                      </Tag>
                    </div>
                  </Col>

                  <Col span={4}>
                    {trend && (
                      <div className="trend-indicator">
                        <Tooltip
                          title={`${
                            trend.direction === "up"
                              ? "Tăng"
                              : trend.direction === "down"
                              ? "Giảm"
                              : "Không đổi"
                          } ${Math.abs(trend.percentChange).toFixed(1)}%`}
                        >
                          <Space>
                            {getTrendIcon(trend)}
                            <Text
                              style={{
                                color:
                                  trend.direction === "up"
                                    ? "#ff4d4f"
                                    : trend.direction === "down"
                                    ? "#52c41a"
                                    : "#1890ff",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              {Math.abs(trend.percentChange).toFixed(1)}%
                            </Text>
                          </Space>
                        </Tooltip>
                      </div>
                    )}
                  </Col>

                  <Col span={4}>
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => showDetail(result)}
                      >
                        Chi tiết
                      </Button>
                    </Space>
                  </Col>
                </Row>

                {result.normalRange && (
                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Giá trị bình thường: {result.normalRange}
                    </Text>
                    {result.testResult && result.normalRange && (
                      <Progress
                        percent={calculateProgressPercent(
                          result.testResult,
                          result.normalRange
                        )}
                        size="small"
                        status={
                          getStatusColor(result.testStatus) === "success"
                            ? "success"
                            : "exception"
                        }
                        showInfo={false}
                        style={{ marginTop: 4 }}
                      />
                    )}
                  </div>
                )}

                {result.labNotes && (
                  <Alert
                    message="Ghi chú"
                    description={result.labNotes}
                    type="info"
                    size="small"
                    style={{ marginTop: 12 }}
                  />
                )}
              </Card>
            </Timeline.Item>
          );
        })}
      </Timeline>

      <Modal
        title={`Chi tiết kết quả - ${new Date(
          selectedResult?.createdAt
        ).toLocaleDateString("vi-VN")}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 20 }}
      >
        {selectedResult && (
          <MedicalResultViewer
            result={selectedResult}
            onClose={() => setDetailModalVisible(false)}
          />
        )}
      </Modal>
    </Card>
  );
};

// Helper function to calculate progress percentage
const calculateProgressPercent = (value, normalRange) => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return 0;

  const rangeMatch = normalRange.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]);
    const max = parseFloat(rangeMatch[2]);
    return Math.min(100, Math.max(0, ((numValue - min) / (max - min)) * 100));
  }

  return 50; // Default to middle if can't parse range
};

export default MedicalResultTimeline;
