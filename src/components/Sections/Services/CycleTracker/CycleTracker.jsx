import React, { useState, useEffect, useCallback } from "react";
import { addDays, subDays, format, isSameDay, startOfDay, differenceInDays } from "date-fns";
import Calendar from "./Calendar";
import LogModal from "./LogModal";
import "./CycleTracker.css";

const INITIAL_USER_DATA = {
  periodHistory: [], logs: {}, avgPeriodLength: 5,
};
const MIN_CYCLE_LENGTH = 15, MAX_CYCLE_LENGTH = 60, DEFAULT_CYCLE_LENGTH = 28;

const CycleTracker = () => {
  const [today, setToday] = useState(startOfDay(new Date()));
  const [predictions, setPredictions] = useState(null);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  // Đảm bảo modalInfo có đủ các trường
  const [modalInfo, setModalInfo] = useState({ isOpen: false, date: null, periodDayNumber: null });

  const calculatePredictions = useCallback(() => {
    const { periodHistory, avgPeriodLength } = userData;

    if (periodHistory.length === 0) {
      setPredictions(null);
      return;
    }

    const sortedHistory = [...periodHistory].sort((a, b) => b - a);
    const lastPeriodStart = sortedHistory[0];

    let avgCycleLength = DEFAULT_CYCLE_LENGTH;
    if (sortedHistory.length > 1) {
      const validCycleLengths = [];
      for (let i = 0; i < sortedHistory.length - 1; i++) {
        const diff = differenceInDays(sortedHistory[i], sortedHistory[i + 1]);
        if (diff >= MIN_CYCLE_LENGTH && diff <= MAX_CYCLE_LENGTH) {
          validCycleLengths.push(diff);
        }
      }
      if (validCycleLengths.length > 0) {
        avgCycleLength = Math.round(validCycleLengths.reduce((a, b) => a + b, 0) / validCycleLengths.length);
      }
    }

    // === LOGIC TÍNH TOÁN QUAN TRỌNG CẦN KIỂM TRA ===
    const periodDayNumbers = {}; // Object để map từ date string -> số ngày kinh
    const periodDays = [];      // Mảng các ngày kinh để tô màu trên lịch
    
    sortedHistory.forEach(startDate => {
      for (let i = 0; i < avgPeriodLength; i++) {
        const currentPeriodDay = addDays(startDate, i);
        const dateKey = format(currentPeriodDay, 'yyyy-MM-dd');
        
        // Đánh số cho ngày kinh
        periodDayNumbers[dateKey] = i + 1;
        // Thêm vào mảng để Calendar tô màu
        periodDays.push(currentPeriodDay);
      }
    });

    const nextPeriodStart = addDays(lastPeriodStart, avgCycleLength);
    const ovulationDay = subDays(nextPeriodStart, 14);

    setPredictions({
      nextPeriodStart,
      nextPeriodEnd: addDays(nextPeriodStart, avgPeriodLength - 1),
      ovulationDay,
      ovulationNotificationDay: subDays(ovulationDay, 2),
      notificationDay: subDays(nextPeriodStart, 2),
      periodDayNumbers, // Dùng để gửi cho Modal
      periodDays,       // Dùng để gửi cho Calendar
      avgCycleLength,
    });
  }, [userData]);


  useEffect(() => {
    calculatePredictions();
    const interval = setInterval(() => setToday(startOfDay(new Date())), 60000);
    return () => clearInterval(interval);
  }, [calculatePredictions]);


  // === HÀM XỬ LÝ CLICK QUAN TRỌNG ===
  const handleDayClick = (day) => {
    let periodDayNumber = null;
    if (predictions && predictions.periodDayNumbers) {
      const dateKey = format(day, 'yyyy-MM-dd');
      periodDayNumber = predictions.periodDayNumbers[dateKey] || null;
    }

    setModalInfo({ 
      isOpen: true, 
      date: day,
      periodDayNumber: periodDayNumber 
    });
  };

  const handleCloseModal = () => setModalInfo({ isOpen: false, date: null, periodDayNumber: null });

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
        // Xóa khỏi history nếu người dùng bỏ đánh dấu (tính năng nâng cao, tùy chọn)
        // newPeriodHistory = newPeriodHistory.filter(d => !isSameDay(d, date));
      }

      if (logData.symptoms.length === 0 && !logData.isPeriodStart) {
        delete newLogs[dateKey];
      }
      
      return { ...prevData, logs: newLogs, periodHistory: newPeriodHistory };
    });
  };
  
  const renderNotifications = () => {
    if (!predictions) return null;
    if (isSameDay(today, predictions.ovulationNotificationDay)) {
      return (
        <div className="notification-item info">
          <strong>💖 Nhắc nhở:</strong> Giai đoạn dễ thụ thai của bạn sắp bắt đầu! Ngày rụng trứng dự kiến là sau 2 ngày nữa.
        </div>
      );
    }
    
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
          periodDayNumber={modalInfo.periodDayNumber} 
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
            <p>Chưa đủ dữ liệu để dự đoán.</p>
          )}
          <div className="legend">
             <h3>Chú thích</h3>
             <ul>
               <li><span className="legend-color period"></span> Ngày có kinh</li>
               <li><span className="legend-color predicted"></span> Ngày kinh dự đoán</li>
               <li><span className="legend-color ovulation"></span> Ngày rụng trứng</li>
               <li><span className="legend-dot"></span> Ngày có ghi chú</li>
               <li><span className="legend-color today"></span> Hôm nay</li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;