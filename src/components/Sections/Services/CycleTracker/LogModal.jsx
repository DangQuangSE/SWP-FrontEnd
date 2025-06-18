// LogModal.jsx - PHIÊN BẢN HOÀN CHỈNH

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
  // HOẶC nếu nó đã được lưu là ngày bắt đầu từ trước (`existingLog?.isPeriodStart`).
  const [isPeriodStart, setIsPeriodStart] = useState(
    !!(existingLog?.isPeriodStart || periodDayNumber)
  );
  
  // Khởi tạo state cho triệu chứng một cách ngắn gọn
  const [selectedSymptoms, setSelectedSymptoms] = useState(existingLog?.symptoms || []);

  // `useEffect` không còn cần thiết nữa vì chúng ta đã khởi tạo state ở trên.

  if (!date) return null;

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    // Chúng ta chỉ lưu isPeriodStart = true nếu đây là lần đầu người dùng đánh dấu.
    // Nếu đây đã là ngày kinh thứ 2, 3... thì không cần lưu lại isPeriodStart.
    const shouldMarkAsStart = isPeriodStart && !periodDayNumber;
    onSave(date, { isPeriodStart: shouldMarkAsStart, symptoms: selectedSymptoms });
    onClose();
  };

  // THAY ĐỔI 3: Logic hiển thị số ngày kinh
  // Nếu cha gửi xuống `periodDayNumber`, hãy dùng nó.
  // Nếu không (người dùng vừa tick mới), mặc định hiển thị là 1.
  const displayPeriodDay = periodDayNumber || 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        <h2>
          Ghi chú cho ngày: {format(date, 'dd MMMM, yyyy', { locale: vi })}
        </h2>
    
        <div className="modal-section period-start-option">
          <label className="period-start-label">
            <input
              type="checkbox"
              checked={isPeriodStart}
              onChange={e => setIsPeriodStart(e.target.checked)}
              // THAY ĐỔI 4: Vô hiệu hóa checkbox nếu đây là ngày 2, 3...
              // Người dùng không thể đánh dấu ngày thứ 3 là "ngày bắt đầu".
              disabled={periodDayNumber > 1}
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
                />
                <span>{symptom}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>Hủy</button>
          <button className="button-primary" onClick={handleSave}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
};

export default LogModal;