import React, { useState } from "react";
import { Card, Button } from "antd";
import { ScheduleOutlined } from "@ant-design/icons";
import ScheduleModal from "./ScheduleModal";
import ScheduleByDate from "./ScheduleByDate";
import "./ManageSchedule.css";

const ManageSchedule = ({ userId }) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Handle schedule modal success - will trigger refresh in ScheduleByDate component
  const handleScheduleSuccess = () => {
    // The ScheduleByDate component will handle its own data refresh
    console.log("Schedule added successfully");
  };
  return (
    <div>
      {/* Header Card with Add Button */}
      <Card style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Quản lý lịch làm việc</h2>
            <p style={{ margin: "4px 0 0 0", color: "#666" }}>
              Xem và quản lý lịch làm việc của bạn theo từng ngày
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ScheduleOutlined />}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            Thêm ca làm việc
          </Button>
        </div>
      </Card>

      {/* Schedule by Date Component */}
      <ScheduleByDate
        userId={userId}
        onEditSchedule={(slot, workDate) => {
          console.log("Edit schedule:", slot, workDate);
          setIsScheduleModalOpen(true);
        }}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        visible={isScheduleModalOpen}
        onCancel={() => setIsScheduleModalOpen(false)}
        onSuccess={handleScheduleSuccess}
        userId={userId}
      />
    </div>
  );
};

export default ManageSchedule;
