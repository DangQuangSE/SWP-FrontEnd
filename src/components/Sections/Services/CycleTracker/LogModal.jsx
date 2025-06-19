import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './LogModal.css';

const SYMPTOM_OPTIONS = [
  "Đau bụng", "Mệt mỏi", "Đau đầu", "Nổi mụn", "Tâm trạng thay đổi", "Căng ngực",
];

// THAY ĐỔI 1: Nhận thêm prop `periodDayNumber` từ component cha
const LogModal = ({ date, existingLog, onSave, onClose, periodDayNumber }) => {

  // THAY ĐỔI 2: Cập nhật logic khởi tạo state
  // `isPeriodStart` sẽ được check nếu cha (CycleTracker) nói rằng đây là một ngày kinh (`periodDayNumber > 0`)
  // HOẶC nếu nó đã được lưu là ngày bắt đầu từ trước.
  const [isPeriodStart, setIsPeriodStart] = useState(
    !!(existingLog?.isPeriodStart || periodDayNumber)
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(existingLog?.symptoms || []);
  if (!date) return null;

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    const shouldMarkAsStart = isPeriodStart && !periodDayNumber;
    onSave(date, { isPeriodStart: shouldMarkAsStart, symptoms: selectedSymptoms });
    onClose();
  };

  // THAY ĐỔI 3: Logic hiển thị số ngày kinh
  // Nếu không (người dùng vừa tick mới), mặc định hiển thị là 1.
  const displayPeriodDay = periodDayNumber || 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Đóng">×</button>
        
        <h2>
          Ghi chú cho ngày: {format(date, 'dd MMMM, yyyy', { locale: vi })}
        </h2>
    
        <div className="modal-section period-start-option">
          <label className="period-start-label">
            <input
              type="checkbox"
              checked={isPeriodStart}
              onChange={e => setIsPeriodStart(e.target.checked)}
              disabled={periodDayNumber > 1}
              aria-label="Đánh dấu là ngày bắt đầu kỳ kinh"
            />
            Đánh dấu là ngày bắt đầu kỳ kinh
          </label>
        </div>
    
        {/* THAY ĐỔI 5: Thêm card thông báo "Ngày hành kinh X" */}
        {isPeriodStart && (
          <div className="period-day-info-card">
            🩸 Ngày hành kinh {displayPeriodDay}
          </div>
        )}

        <div className="modal-section">
          <h4>Triệu chứng hôm nay:</h4>
          <div className="symptoms-grid">
            {SYMPTOM_OPTIONS.map(symptom => (
              <label key={symptom} className="symptom-label">
                <input
                  type="checkbox"
                  value={symptom}
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomChange(symptom)}
                  aria-label={symptom}
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose} tabIndex={0}>Hủy</button>
          <button className="button-primary" onClick={handleSave} tabIndex={0}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

export default LogModal;