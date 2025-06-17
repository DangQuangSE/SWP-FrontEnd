import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './LogModal.css';

const SYMPTOM_OPTIONS = [
  "Đau bụng",
  "Mệt mỏi",
  "Đau đầu",
  "Nổi mụn",
  "Tâm trạng thay đổi",
  "Căng ngực",
];

const LogModal = ({ date, existingLog, onSave, onClose }) => {
  const [isPeriodStart, setIsPeriodStart] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Load dữ liệu đã có của ngày này khi modal mở ra
  useEffect(() => {
    if (existingLog) {
      setIsPeriodStart(existingLog.isPeriodStart || false);
      setSelectedSymptoms(existingLog.symptoms || []);
    } else {
      setIsPeriodStart(false);
      setSelectedSymptoms([]);
    }
  }, [existingLog]);

  if (!date) return null;

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSave = () => {
    onSave(date, { isPeriodStart, symptoms: selectedSymptoms });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* THÊM NÚT ĐÓNG (X) Ở ĐÂY */}
        <button className="modal-close-button" onClick={onClose}>×</button>
        
        <h2>
          Ghi chú cho ngày: {format(date, 'dd MMMM, yyyy', { locale: vi })}
        </h2>

        {/* Bọc lựa chọn ngày bắt đầu trong một div để tạo kiểu tốt hơn */}
        <div className="modal-section period-start-option">
          <label className="period-start-label">
            <input
              type="checkbox"
              checked={isPeriodStart}
              onChange={e => setIsPeriodStart(e.target.checked)}
            />
            Đánh dấu là ngày bắt đầu kỳ kinh
          </label>
        </div>

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