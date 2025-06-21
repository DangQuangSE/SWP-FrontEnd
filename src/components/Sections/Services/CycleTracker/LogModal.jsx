import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "./LogModal.css";

const SYMPTOM_OPTIONS = [
  { label: "Đau bụng", icon: "🤕" },
  { label: "Mệt mỏi", icon: "😴" },
  { label: "Đau đầu", icon: "🤯" },
  { label: "Nổi mụn", icon: "😣" },
  { label: "Căng ngực", icon: "😖" },
  { label: "Chướng bụng", icon: "😵" },
  { label: "Tiêu chảy", icon: "🚽" },
  { label: "Thay đổi ", icon: "😶‍🌫️" },
];

const LogModal = ({ date, existingLog, onSave, onClose, periodDayNumber }) => {
  const [note, setNote] = useState(existingLog?.note || "");
  const [isPeriodStart, setIsPeriodStart] = useState(
    !!(existingLog?.isPeriodStart || periodDayNumber)
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    existingLog?.symptoms || []
  );
  if (!date) return null;

  // Đảm bảo không bị trùng triệu chứng khi render
  const symptomLabels = Array.from(
    new Set(SYMPTOM_OPTIONS.map((s) => s.label))
  );

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Bạn có chắc muốn xóa tất cả ghi chú và triệu chứng của ngày này?"
      )
    ) {
      onSave(date, { isPeriodStart: false, symptoms: [], note: "" });
      onClose();
    }
  };

  const handleSave = () => {
    const shouldMarkAsStart = isPeriodStart && !periodDayNumber;
    onSave(date, {
      isPeriodStart: shouldMarkAsStart,
      symptoms: selectedSymptoms,
      note,
    });
    onClose();
  };

  const displayPeriodDay = periodDayNumber || 1;

  // Thêm icon con gấu nếu có triệu chứng được chọn
  const hasSymptoms = selectedSymptoms.length > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Đóng"
        >
          ×
        </button>
        <h2>
          Ghi chú cho ngày: {format(date, "dd MMMM, yyyy", { locale: vi })}{" "}         
        </h2>
        <div className="modal-section period-start-option">
          <label className="period-start-label">
            <input
              type="checkbox"
              checked={isPeriodStart}
              onChange={(e) => setIsPeriodStart(e.target.checked)}
              disabled={periodDayNumber > 1}
              aria-label="Đánh dấu là ngày bắt đầu kỳ kinh"
            />
            Đánh dấu là ngày bắt đầu kỳ kinh
          </label>
        </div>
        {isPeriodStart && (
          <div className="period-day-info-card">
            🩸 Ngày hành kinh {displayPeriodDay}
          </div>
        )}
        <div className="modal-section">
          <h4>Ghi chú thêm:</h4>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập ghi chú cho ngày này (nếu có)..."
            rows={3}
            style={{ width: "100%" }}
          />
        </div>
        <div className="modal-section">
          <h4>Triệu chứng hôm nay:</h4>
          <div className="symptoms-grid">
            {SYMPTOM_OPTIONS.filter(
              (opt, idx, arr) => symptomLabels.indexOf(opt.label) === idx // loại trùng
            ).map(({ label, icon }) => (
              <label key={label} className="symptom-label">
                <input
                  type="checkbox"
                  value={label}
                  checked={selectedSymptoms.includes(label)}
                  onChange={() => handleSymptomChange(label)}
                  aria-label={label}
                />
                <span>
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose} tabIndex={0}>
            Hủy
          </button>
          <button className="button-danger" onClick={handleDelete} tabIndex={0}>
            Xóa ngày này
          </button>
          <button className="button-primary" onClick={handleSave} tabIndex={0}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogModal;
