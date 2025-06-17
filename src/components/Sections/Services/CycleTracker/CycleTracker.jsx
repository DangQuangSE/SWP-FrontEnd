import React, { useState, useEffect, useCallback } from "react";
import { addDays, subDays, format, isSameDay, startOfDay, differenceInDays } from "date-fns";
import Calendar from "./Calendar";
import LogModal from "./LogModal";
import "./CycleTracker.css";

// Dữ liệu ban đầu, có thể lấy từ API
const INITIAL_USER_DATA = {
  periodHistory: [
    new Date("2025-05-18T00:00:00"), // Kỳ gần đây
    new Date("2025-04-20T00:00:00"), // Kỳ trước đó
    // Giả sử có một kỳ kinh từ rất lâu, đây là nguyên nhân gây lỗi
    new Date("2024-09-01T00:00:00"), 
  ],
  logs: {
    '2025-05-19': { symptoms: ['Đau bụng'] }
  },
  avgPeriodLength: 5,
};

// THAY ĐỔI 1: Đặt ra hằng số cho giới hạn chu kỳ hợp lý
const MIN_CYCLE_LENGTH = 15;
const MAX_CYCLE_LENGTH = 60;
const DEFAULT_CYCLE_LENGTH = 28;

const CycleTracker = () => {
  const [today, setToday] = useState(startOfDay(new Date()));
  const [predictions, setPredictions] = useState(null);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, date: null });

  const calculatePredictions = useCallback(() => {
    const { periodHistory, avgPeriodLength } = userData;
    if (periodHistory.length === 0) {
      setPredictions(null);
      return;
    }

    const sortedHistory = [...periodHistory].sort((a, b) => b - a);
    const lastPeriodStart = sortedHistory[0];

    // --- LOGIC TÍNH TOÁN ĐƯỢC SỬA LẠI HOÀN TOÀN ---
    let avgCycleLength = DEFAULT_CYCLE_LENGTH; // Bắt đầu với giá trị mặc định

    if (sortedHistory.length > 1) {
      const validCycleLengths = [];
      for (let i = 0; i < sortedHistory.length - 1; i++) {
        const diff = differenceInDays(sortedHistory[i], sortedHistory[i + 1]);

        // THAY ĐỔI 2: Chỉ thêm vào danh sách nếu độ dài chu kỳ hợp lý
        if (diff >= MIN_CYCLE_LENGTH && diff <= MAX_CYCLE_LENGTH) {
          validCycleLengths.push(diff);
        }
      }

      // THAY ĐỔI 3: Chỉ tính trung bình nếu có ít nhất một chu kỳ hợp lệ
      if (validCycleLengths.length > 0) {
        avgCycleLength = Math.round(
          validCycleLengths.reduce((a, b) => a + b, 0) / validCycleLengths.length
        );
      }
    }
    // --- KẾT THÚC PHẦN SỬA LỖI LOGIC ---

    const nextPeriodStart = addDays(lastPeriodStart, avgCycleLength);
    const ovulationDay = subDays(nextPeriodStart, 14);
    const notificationDay = subDays(nextPeriodStart, 2);

    // Xác định các ngày có kinh thực tế dựa trên toàn bộ lịch sử
    const actualPeriodDays = [];
    sortedHistory.forEach(startDate => {
        for(let i=0; i<avgPeriodLength; i++) {
            actualPeriodDays.push(addDays(startDate, i));
        }
    });

    setPredictions({
      nextPeriodStart,
      nextPeriodEnd: addDays(nextPeriodStart, avgPeriodLength - 1),
      ovulationDay,
      notificationDay,
      periodDays: actualPeriodDays, // Hiển thị tất cả các ngày kinh trong lịch sử
      avgCycleLength,
    });
  }, [userData]);


  useEffect(() => {
    calculatePredictions();
    const interval = setInterval(() => setToday(startOfDay(new Date())), 60000);
    return () => clearInterval(interval);
  }, [calculatePredictions]);

  const handleDayClick = (day) => {
    setModalInfo({ isOpen: true, date: day });
  };

  const handleCloseModal = () => {
    setModalInfo({ isOpen: false, date: null });
  };

  const handleSaveLog = (date, logData) => {
    const dateKey = format(date, 'yyyy-MM-dd');

    setUserData(prevData => {
      const newLogs = { ...prevData.logs, [dateKey]: logData };
      let newPeriodHistory = [...prevData.periodHistory];

      if (logData.isPeriodStart) {
        if (!newPeriodHistory.some(d => isSameDay(d, date))) {
          newPeriodHistory.push(date);
        }
      } else {
        newPeriodHistory = newPeriodHistory.filter(d => !isSameDay(d, date));
      }

      if (logData.symptoms.length === 0 && !logData.isPeriodStart) {
        delete newLogs[dateKey];
      }

      return { ...prevData, logs: newLogs, periodHistory: newPeriodHistory };
    });
  };
  
  // Các hàm render còn lại giữ nguyên...
  const renderNotifications = () => {
    if (!predictions) return null;
    if (isSameDay(today, predictions.notificationDay)) {
      return (
        <div className="notification-item warning">
          <strong>🔔 Nhắc nhở:</strong> Kỳ kinh của bạn dự kiến sẽ bắt đầu sau 2 ngày nữa!
        </div>
      );
    }
    if (isSameDay(today, predictions.ovulationDay)) {
      return (
        <div className="notification-item info">
          <strong>💖 Thông báo:</strong> Hôm nay là ngày rụng trứng dự kiến của bạn.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cycle-tracker-container">
      {modalInfo.isOpen && (
        <LogModal
          date={modalInfo.date}
          existingLog={userData.logs[format(modalInfo.date, 'yyyy-MM-dd')]}
          onSave={handleSaveLog}
          onClose={handleCloseModal}
        />
      )}
      <header className="tracker-header">
        <h1>Theo dõi chu kỳ kinh nguyệt</h1>
        <p>Nhấp vào một ngày để ghi lại thông tin và nhận dự đoán chính xác hơn.</p>
      </header>

      <div className="tracker-notifications">{renderNotifications()}</div>

      <div className="tracker-body">
        <div className="calendar-section">
          <Calendar 
            predictions={predictions} 
            onDayClick={handleDayClick}
            logs={userData.logs}
          />
        </div>
        <div className="info-section">
          <h2>Thông tin dự đoán</h2>
          {predictions ? (
            <div className="info-card">
              <p>Kỳ kinh tiếp theo: <strong>{format(predictions.nextPeriodStart, "dd/MM/yyyy")}</strong></p>
              <p>Ngày rụng trứng: <strong>{format(predictions.ovulationDay, "dd/MM/yyyy")}</strong></p>
              <p>Độ dài chu kỳ TB: <strong>{predictions.avgCycleLength} ngày</strong></p>
              <p>Độ dài kỳ kinh TB: <strong>{userData.avgPeriodLength} ngày</strong></p>
            </div>
          ) : (
            <p>Chưa đủ dữ liệu để dự đoán. Vui lòng ghi lại ít nhất một ngày bắt đầu kỳ kinh.</p>
          )}
          <div className="legend">
             <h3>Chú thích</h3>
             <ul>
               <li><span className="legend-color period"></span> Ngày có kinh</li>
               <li><span className="legend-color predicted"></span> Ngày kinh dự đoán</li>
               <li><span className="legend-color ovulation"></span> Ngày rụng trứng</li>
               <li><span className="legend-dot"></span> Ngày có ghi chú triệu chứng</li>
               <li><span className="legend-color today"></span> Hôm nay</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;