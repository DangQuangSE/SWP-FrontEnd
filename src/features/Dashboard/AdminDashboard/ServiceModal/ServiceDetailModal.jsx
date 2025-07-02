import React from "react";
import { Modal, Button, Tag } from "antd";

const ServiceDetailModal = ({ visible, onCancel, serviceDetail }) => {
  return (
    <Modal
      title="Chi tiết Dịch vụ"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      {serviceDetail && (
        <div>
          <p>
            <strong>Tên:</strong> {serviceDetail.name}
          </p>
          <p>
            <strong>Mô tả:</strong> {serviceDetail.description}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {serviceDetail.duration
              ? Math.floor(serviceDetail.duration / 60)
              : "N/A"}{" "}
            phút
          </p>
          <p>
            <strong>Loại:</strong>
            <Tag
              color={
                serviceDetail.type === "CONSULTING" ||
                serviceDetail.type === "CONSULTING_ON"
                  ? "blue"
                  : "green"
              }
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.type}
            </Tag>
          </p>
          <p>
            <strong>Giá:</strong> {serviceDetail.price?.toLocaleString() || 0}đ
          </p>
          <p>
            <strong>Giảm giá:</strong> {serviceDetail.discountPercent || 0}%
          </p>
          <p>
            <strong>Là Gói:</strong>
            <Tag
              color={serviceDetail.isCombo ? "orange" : "default"}
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.isCombo ? "Có" : "Không"}
            </Tag>
          </p>
          <p>
            <strong>Trạng thái:</strong>
            <Tag
              color={serviceDetail.isActive ? "green" : "red"}
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.isActive ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </p>
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(serviceDetail.createdAt).toLocaleString("vi-VN")}
          </p>
          {serviceDetail.subServiceIds &&
            serviceDetail.subServiceIds.length > 0 && (
              <p>
                <strong>ID Dịch vụ Con:</strong>{" "}
                {serviceDetail.subServiceIds.join(", ")}
              </p>
            )}
          {serviceDetail.subServices &&
            serviceDetail.subServices.length > 0 && (
              <div>
                <p>
                  <strong>Dịch vụ Con:</strong>
                </p>
                <div style={{ marginLeft: 16 }}>
                  {serviceDetail.subServices.map((subService, index) => (
                    <div
                      key={subService.id}
                      style={{
                        marginBottom: 8,
                        padding: 8,
                        border: "1px solid #f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong>
                          {index + 1}. {subService.name}
                        </strong>
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                        {subService.description}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px" }}>
                        Giá: {subService.price?.toLocaleString() || 0}đ | Thời
                        gian:{" "}
                        {subService.duration
                          ? Math.floor(subService.duration / 60)
                          : "N/A"}{" "}
                        phút | Loại:{" "}
                        <Tag
                          size="small"
                          color={
                            subService.type === "CONSULTING" ||
                            subService.type === "CONSULTING_ON"
                              ? "blue"
                              : "green"
                          }
                        >
                          {subService.type}
                        </Tag>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </Modal>
  );
};

export default ServiceDetailModal;
