import React from "react";
import { Modal, Button, Tag } from "antd";

const ServiceDetailModal = ({ visible, onCancel, serviceDetail }) => {
  return (
    <Modal
      title="Service Details"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={600}
    >
      {serviceDetail && (
        <div>
          <p>
            <strong>ID:</strong> {serviceDetail.id}
          </p>
          <p>
            <strong>Name:</strong> {serviceDetail.name}
          </p>
          <p>
            <strong>Description:</strong> {serviceDetail.description}
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {serviceDetail.duration
              ? Math.floor(serviceDetail.duration / 60)
              : "N/A"}{" "}
            minutes
          </p>
          <p>
            <strong>Type:</strong>
            <Tag
              color={serviceDetail.type === "CONSULTING" ? "blue" : "green"}
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.type}
            </Tag>
          </p>
          <p>
            <strong>Price:</strong> {serviceDetail.price?.toLocaleString() || 0}
            đ
          </p>
          <p>
            <strong>Discount:</strong> {serviceDetail.discountPercent || 0}%
          </p>
          <p>
            <strong>Is Combo:</strong>
            <Tag
              color={serviceDetail.isCombo ? "orange" : "default"}
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.isCombo ? "Yes" : "No"}
            </Tag>
          </p>
          <p>
            <strong>Status:</strong>
            <Tag
              color={serviceDetail.isActive ? "green" : "red"}
              style={{ marginLeft: 8 }}
            >
              {serviceDetail.isActive ? "Active" : "Inactive"}
            </Tag>
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(serviceDetail.createdAt).toLocaleString("vi-VN")}
          </p>
          {serviceDetail.subServiceIds &&
            serviceDetail.subServiceIds.length > 0 && (
              <p>
                <strong>Sub Service IDs:</strong>{" "}
                {serviceDetail.subServiceIds.join(", ")}
              </p>
            )}
          {serviceDetail.subServices &&
            serviceDetail.subServices.length > 0 && (
              <div>
                <p>
                  <strong>Sub Services:</strong>
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
                        Price: {subService.price?.toLocaleString() || 0}đ |
                        Duration:{" "}
                        {subService.duration
                          ? Math.floor(subService.duration / 60)
                          : "N/A"}{" "}
                        minutes | Type:{" "}
                        <Tag
                          size="small"
                          color={
                            subService.type === "CONSULTING" ? "blue" : "green"
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
