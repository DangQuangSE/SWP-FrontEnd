import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  addDays,
  subDays,
  format,
  isSameDay,
  startOfDay,
  differenceInDays,
} from "date-fns";
import Calendar from "./Calendar";
import LogModal from "./LogModal";
import "./CycleTracker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../../../configs/api";

// Sử dụng API mới: không truyền userId, chỉ dùng token ở header
const fetchCycleLogs = () => api.get("/cycle-track/logs");
const saveCycleLog = (logData, token) =>
  api.post("/cycle-track/log", logData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

const INITIAL_USER_DATA = {
  periodHistory: [],
  logs: {},
  avgPeriodLength: 5,
};
const MIN_CYCLE_LENGTH = 15,
  MAX_CYCLE_LENGTH = 60,
  DEFAULT_CYCLE_LENGTH = 28;

const enumToVietnamese = {
  STOMACH_PAIN: "Đau bụng",
  FATIGUE: "Mệt mỏi",
  HEADACHE: "Đau đầu",
  ACNE: "Nổi mụn",
  BREAST_TENDERNESS: "Căng ngực",
  BLOATING: "Chướng bụng",
  DIARRHEA: "Tiêu chảy",
  MOOD_SWING: "Thay đổi tâm trạng",
};

const symptomEnumMap = {
  "Đau bụng": "STOMACH_PAIN",
  "Mệt mỏi": "FATIGUE",
  "Đau đầu": "HEADACHE",
  "Nổi mụn": "ACNE",
  "Căng ngực": "BREAST_TENDERNESS",
  "Chướng bụng": "BLOATING",
  "Tiêu chảy": "DIARRHEA",
  "Thay đổi tâm trạng": "MOOD_SWING",
};

const CycleTracker = () => {
  const reduxToken = useSelector((state) => state.user.jwt || state.user.token);
  const token = reduxToken || localStorage.getItem("token");

  // Đã bỏ notifications
  const [showGuide, setShowGuide] = useState(false);
  const [selectedDay, setSelectedDay] = useState(startOfDay(new Date()));
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [today, setToday] = useState(startOfDay(new Date()));
  const [predictions, setPredictions] = useState(null);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSymptomStatsModal, setShowSymptomStatsModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    date: null,
    periodDayNumber: null,
  });
  const [loading, setLoading] = useState(false);

  // Lấy logs từ API mới (không truyền userId)
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchCycleLogs()
      .then((res) => {
        const logsArr = res.data || [];
        const logs = {};
        const periodHistory = [];
        let avgPeriodLength = 5;
        logsArr.forEach((item) => {
          const dateKey = item.startDate;
          let symptoms = [];
          if (Array.isArray(item.symptoms)) {
            symptoms = item.symptoms;
          } else if (typeof item.symptoms === "string") {
            symptoms = item.symptoms
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
          }
          logs[dateKey] = {
            symptoms,
            note: item.note || "",
            isPeriodStart: item.isPeriodStart,
          };
          if (item.isPeriodStart) {
            periodHistory.push(new Date(item.startDate));
          }
        });
        setUserData({
          periodHistory,
          logs,
          avgPeriodLength,
        });
      })
      .catch(() => setUserData(INITIAL_USER_DATA))
      .finally(() => setLoading(false));
  }, [token]);

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
        avgCycleLength = Math.round(
          validCycleLengths.reduce((a, b) => a + b, 0) /
            validCycleLengths.length
        );
      }
    }

    const periodDayNumbers = {};
    const periodDays = [];

    sortedHistory.forEach((startDate) => {
      for (let i = 0; i < avgPeriodLength; i++) {
        const currentPeriodDay = addDays(startDate, i);
        const dateKey = format(currentPeriodDay, "yyyy-MM-dd");
        periodDayNumbers[dateKey] = i + 1;
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
      periodDayNumbers,
      periodDays,
      avgCycleLength,
    });
  }, [userData]);

  useEffect(() => {
    calculatePredictions();
    const interval = setInterval(() => setToday(startOfDay(new Date())), 60000);
    return () => clearInterval(interval);
  }, [calculatePredictions]);

  // Thống kê triệu chứng theo filter
  const filteredSymptomStats = {};
  Object.entries(userData.logs).forEach(([date, log]) => {
    if (
      (!filterStart || date >= filterStart) &&
      (!filterEnd || date <= filterEnd)
    ) {
      (log.symptoms || []).forEach((symptom) => {
        filteredSymptomStats[symptom] =
          (filteredSymptomStats[symptom] || 0) + 1;
      });
    }
  });

  const getRecommendations = () => {
    if (!predictions) return [];

    const recs = [];
    const log = userData.logs[format(selectedDay, "yyyy-MM-dd")];

    // ...giữ nguyên logic gợi ý như cũ...

    // 🔁 Gợi ý về chu kỳ
    if (
      isSameDay(selectedDay, predictions.notificationDay) ||
      (differenceInDays(predictions.nextPeriodStart, selectedDay) <= 3 &&
        differenceInDays(predictions.nextPeriodStart, selectedDay) >= 0)
    ) {
      recs.push(
        `🔁 Sắp đến kỳ kinh:
      1. Chuẩn bị sẵn các vật dụng vệ sinh cá nhân như băng vệ sinh, cốc nguyệt san, giấy vệ sinh sạch.
      2. Đảm bảo có sẵn thuốc giảm đau bụng kinh (nếu thường xuyên đau).
      3. Chuẩn bị nước ấm hoặc túi chườm để giảm đau bụng nếu cần.
      4. Lên kế hoạch nghỉ ngơi hợp lý, tránh vận động mạnh vào những ngày đầu kỳ kinh.
      5. Ghi chú lại các triệu chứng bất thường nếu xuất hiện.`
      );
    }
    if (isSameDay(selectedDay, predictions.ovulationNotificationDay)) {
      recs.push(
        `🔁 Sắp đến ngày rụng trứng:
      1. Nếu bạn muốn mang thai, hãy chuẩn bị sức khỏe tốt nhất: ăn uống đủ chất, ngủ đủ giấc.
      2. Theo dõi các dấu hiệu rụng trứng như dịch nhầy cổ tử cung trong, dai, nhiệt độ cơ thể tăng nhẹ.
      3. Lên kế hoạch quan hệ vợ chồng trong những ngày này để tăng khả năng thụ thai.
      4. Nếu không muốn mang thai, hãy sử dụng biện pháp bảo vệ an toàn.`
      );
    }
    recs.push(
      `🔁 Dự đoán kỳ kinh tiếp theo: ${format(
        predictions.nextPeriodStart,
        "dd/MM/yyyy"
      )}.
    - Hãy ghi chú lại ngày bắt đầu và kết thúc kỳ kinh để hệ thống dự đoán chính xác hơn cho các chu kỳ sau.`
    );

    // 🧠 Gợi ý về sức khỏe thể chất và tinh thần
    if (log && log.symptoms && log.symptoms.includes("Mệt mỏi")) {
      recs.push(
        `🧠 Bạn có dấu hiệu mệt mỏi:
      1. Ưu tiên nghỉ ngơi, ngủ đủ 7-8 tiếng mỗi ngày.
      2. Uống đủ nước (1.5-2 lít/ngày).
      3. Ăn các thực phẩm giàu vitamin và khoáng chất như trái cây, rau xanh.
      4. Tránh làm việc quá sức, giảm stress bằng thiền hoặc nghe nhạc nhẹ.
      5. Nếu mệt mỏi kéo dài nhiều ngày, hãy cân nhắc đi khám bác sĩ.`
      );
    }
    if (log && log.symptoms && log.symptoms.includes("Đau bụng")) {
      recs.push(
        `🧠 Đau bụng kinh:
      1. Sử dụng túi chườm ấm đặt lên bụng dưới để giảm đau.
      2. Massage nhẹ nhàng vùng bụng.
      3. Uống nước ấm, tránh đồ uống lạnh hoặc có gas.
      4. Nếu đau dữ dội, có thể dùng thuốc giảm đau theo chỉ dẫn của bác sĩ.
      5. Ghi chú lại mức độ đau để theo dõi qua các kỳ kinh.`
      );
    }
    const warnings = getCycleWarnings(userData.periodHistory);
    if (warnings.length > 0) {
      recs.push(
        `🧠 Chu kỳ của bạn có dấu hiệu bất thường:
      1. Theo dõi sát các triệu chứng lạ như ra máu kéo dài, đau bụng dữ dội, kinh nguyệt không đều.
      2. Ghi chú lại các bất thường trong ứng dụng.
      3. Nếu tình trạng kéo dài hoặc có dấu hiệu nghiêm trọng, hãy đi khám phụ khoa để được tư vấn.`
      );
    }

    // 🧬 Gợi ý cho người muốn mang thai
    if (
      differenceInDays(predictions.ovulationDay, selectedDay) <= 2 &&
      differenceInDays(predictions.ovulationDay, selectedDay) >= -2
    ) {
      recs.push(
        `🧬 Đây là "cửa sổ sinh sản" (fertile window) – thời điểm dễ thụ thai nhất:
      1. Lên kế hoạch quan hệ đều đặn trong 5 ngày trước và 1 ngày sau ngày rụng trứng.
      2. Theo dõi thêm các dấu hiệu rụng trứng: dịch nhầy cổ tử cung trong, nhiệt độ cơ thể tăng nhẹ.
      3. Ăn uống đủ chất, bổ sung axit folic, tránh rượu bia và thuốc lá.
      4. Giữ tinh thần thoải mái, tránh căng thẳng để tăng khả năng thụ thai.`
      );
      recs.push(
        `🧬 Theo dõi các dấu hiệu rụng trứng:
      - Đo nhiệt độ cơ thể mỗi sáng.
      - Quan sát dịch nhầy cổ tử cung.
      - Sử dụng que thử rụng trứng nếu cần.`
      );
    }

    // ❌ Gợi ý tránh thai tự nhiên
    if (
      differenceInDays(predictions.ovulationDay, selectedDay) <= 2 &&
      differenceInDays(predictions.ovulationDay, selectedDay) >= -2
    ) {
      recs.push(
        `❌ Những ngày này có nguy cơ thụ thai cao:
      1. Nếu bạn muốn tránh thai tự nhiên, hãy tránh quan hệ hoặc sử dụng bao cao su.
      2. Theo dõi sát các dấu hiệu rụng trứng để xác định ngày an toàn.
      3. Ghi chú lại các ngày quan hệ để kiểm soát tốt hơn.`
      );
    }

    // 🧘 Gợi ý về lối sống
    if (
      log &&
      (log.symptoms.includes("Đau bụng") ||
        log.symptoms.includes("Căng ngực") ||
        log.symptoms.includes("Chướng bụng"))
    ) {
      recs.push(
        `🧘 Lối sống lành mạnh trong kỳ kinh:
      1. Tập yoga nhẹ nhàng, đi bộ hoặc các bài tập giãn cơ để giảm khó chịu.
      2. Bổ sung thực phẩm giàu sắt (thịt đỏ, gan, rau xanh), uống nhiều nước.
      3. Tránh đồ ăn cay nóng, nhiều dầu mỡ.
      4. Nghỉ ngơi hợp lý, tránh thức khuya.
      5. Ghi chú lại các triệu chứng để theo dõi sức khỏe lâu dài.`
      );
    }

    // Gợi ý tổng quát
    if (
      log &&
      log.symptoms.length === 0 &&
      !log.isPeriodStart &&
      !(
        isSameDay(selectedDay, predictions.notificationDay) ||
        isSameDay(selectedDay, predictions.ovulationNotificationDay) ||
        isSameDay(selectedDay, predictions.ovulationDay)
      )
    ) {
      recs.push(
        `💡 Hãy ghi chú lại các triệu chứng hoặc cảm xúc của bạn:
      1. Nhấn vào ngày trên lịch để thêm ghi chú hoặc triệu chứng.
      2. Việc ghi chú đều đặn giúp hệ thống dự đoán chính xác hơn và đưa ra gợi ý phù hợp với bạn.
      3. Theo dõi sức khỏe bản thân tốt hơn qua từng chu kỳ.`
      );
    }

    return recs;
  };

  const chartData = Object.entries(filteredSymptomStats).map(
    ([symptom, count]) => ({
      symptom,
      count,
    })
  );

  const handleCloseModal = () =>
    setModalInfo({ isOpen: false, date: null, periodDayNumber: null });

  // Lưu log: chỉ gửi dữ liệu, không gửi userId
  const handleSaveLog = async (date, logData) => {
    if (!token) {
      toast.error("Bạn chưa đăng nhập hoặc thông tin đăng nhập chưa sẵn sàng!");
      return;
    }
    setLoading(true);
    try {
      const symptoms = Array.isArray(logData.symptoms)
        ? logData.symptoms.map((s) => symptomEnumMap[s] || s).filter(Boolean)
        : [];

      await saveCycleLog(
        {
          startDate: format(date, "yyyy-MM-dd"),
          isPeriodStart: !!logData.isPeriodStart,
          symptoms,
          note: logData.note || "",
        },
        token
      );
      // Sau khi lưu, refetch lại logs
      const res = await fetchCycleLogs();
      const logsArr = res.data || [];
      const logs = {};
      const periodHistory = [];
      let avgPeriodLength = 5;
      logsArr.forEach((item) => {
        const dateKey = item.startDate;
        let symptoms = [];
        if (Array.isArray(item.symptoms)) {
          symptoms = item.symptoms;
        } else if (typeof item.symptoms === "string") {
          symptoms = item.symptoms
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        logs[dateKey] = {
          symptoms,
          note: item.note || "",
          isPeriodStart: item.isPeriodStart,
        };
        if (item.isPeriodStart) {
          periodHistory.push(new Date(item.startDate));
        }
      });
      setUserData({
        periodHistory,
        logs,
        avgPeriodLength,
      });
      toast.success("Lưu nhật ký thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu log:", err, err?.response?.data);
      toast.error("Không thể lưu log. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const symptomStats = {};
  Object.values(userData.logs).forEach((log) => {
    (log.symptoms || []).forEach((symptom) => {
      symptomStats[symptom] = (symptomStats[symptom] || 0) + 1;
    });
  });

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthlySymptomStats = {};
  Object.entries(userData.logs).forEach(([date, log]) => {
    const d = new Date(date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      (log.symptoms || []).forEach((symptom) => {
        monthlySymptomStats[symptom] = (monthlySymptomStats[symptom] || 0) + 1;
      });
    }
  });

  const getCycleWarnings = (periodHistory) => {
    if (!periodHistory || periodHistory.length < 2) return [];

    const warnings = [];
    const cycleLengths = [];
    for (let i = 1; i < periodHistory.length; i++) {
      const prev = new Date(periodHistory[i - 1]);
      const curr = new Date(periodHistory[i]);
      const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      cycleLengths.push(diff);
      if (diff < 21) {
        warnings.push(
          `Chu kỳ từ ${format(prev, "dd/MM/yyyy")} đến ${format(
            curr,
            "dd/MM/yyyy"
          )} quá ngắn (${diff} ngày).`
        );
      }
      if (diff > 35) {
        warnings.push(
          `Chu kỳ từ ${format(prev, "dd/MM/yyyy")} đến ${format(
            curr,
            "dd/MM/yyyy"
          )} quá dài (${diff} ngày).`
        );
      }
    }
    const max = Math.max(...cycleLengths);
    const min = Math.min(...cycleLengths);
    if (max - min > 7) {
      warnings.push(
        "Chu kỳ kinh nguyệt của bạn không đều (độ lệch giữa các chu kỳ lớn hơn 7 ngày)."
      );
    }
    return warnings;
  };

  const handleDayClick = (day) => {
    setSelectedDay(startOfDay(day));
    let periodDayNumber = null;
    if (predictions && predictions.periodDayNumbers) {
      const dateKey = format(day, "yyyy-MM-dd");
      periodDayNumber = predictions.periodDayNumbers[dateKey] || null;
    }
    setModalInfo({
      isOpen: true,
      date: day,
      periodDayNumber: periodDayNumber,
    });
  };

  const renderNotifications = () => {
    if (!predictions) return null;
    const warnings = getCycleWarnings(userData.periodHistory);
    const notifications = [];
    if (isSameDay(selectedDay, predictions.ovulationNotificationDay)) {
      notifications.push(
        <div key="ovulation-noti" className="notification-item info">
          <strong>💖 Nhắc nhở:</strong> Giai đoạn dễ thụ thai của bạn sắp bắt
          đầu! Ngày rụng trứng dự kiến là sau 2 ngày nữa.
        </div>
      );
    }
    if (isSameDay(selectedDay, predictions.notificationDay)) {
      notifications.push(
        <div key="period-noti" className="notification-item warning">
          <strong>🔔 Nhắc nhở:</strong> Kỳ kinh của bạn dự kiến sẽ bắt đầu sau 2
          ngày nữa!
        </div>
      );
    }
    if (isSameDay(selectedDay, predictions.ovulationDay)) {
      notifications.push(
        <div key="ovulation-today" className="notification-item info">
          <strong>💖 Thông báo:</strong> Hôm nay là ngày rụng trứng dự kiến của
          bạn.
        </div>
      );
    }
    warnings.forEach((w, idx) => {
      notifications.push(
        <div key={`warning-${idx}`} className="notification-item danger">
          ⚠️ {w}
        </div>
      );
    });
    return <>{notifications}</>;
  };

  return (
    <div className="cycle-tracker-container">
      {/* Đã bỏ notifications từ backend */}
      {loading && <div>Đang tải dữ liệu...</div>}
      {modalInfo.isOpen && (
        <LogModal
          date={modalInfo.date}
          periodDayNumber={modalInfo.periodDayNumber}
          existingLog={
            userData.logs[format(modalInfo.date, "yyyy-MM-dd")]
              ? {
                  ...userData.logs[format(modalInfo.date, "yyyy-MM-dd")],
                  symptoms: (
                    userData.logs[format(modalInfo.date, "yyyy-MM-dd")]
                      .symptoms || []
                  ).map((sym) => enumToVietnamese[sym] || sym),
                }
              : undefined
          }
          onSave={handleSaveLog}
          onClose={handleCloseModal}
        />
      )}
      {getRecommendations().length > 0 && (
        <div className="recommendations-box">
          <strong>Gợi ý cho bạn:</strong>
          <ul>
            {getRecommendations().map((rec, idx) => (
              <li key={idx} style={{ marginBottom: 8, whiteSpace: "pre-line" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div
        className="guide-preview"
        style={{
          background: "#f3f4f6",
          borderLeft: "4px solid #6366f1",
          padding: "10px 16px",
          borderRadius: "6px",
          margin: "12px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>
          <b>💡 Hướng dẫn sử dụng:</b> Xem các bước sử dụng CycleTracking cho
          người mới.
        </span>
        <button
          className="button-secondary"
          style={{ marginLeft: 16 }}
          onClick={() => setShowGuide(true)}
        >
          Xem chi tiết
        </button>
      </div>
      <header className="tracker-header">
        <h1>Theo dõi chu kỳ kinh nguyệt</h1>
        <p>
          Nhấp vào một ngày để ghi lại thông tin và nhận dự đoán chính xác hơn.
        </p>
      </header>
      {showGuide && (
        <div className="modal-overlay" onClick={() => setShowGuide(false)}>
          <div
            className="modal-content guide-modal"
            style={{ maxWidth: 540 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-button"
              onClick={() => setShowGuide(false)}
              aria-label="Đóng"
            >
              ×
            </button>

            <h2 style={{ color: "#4f46e5", fontWeight: 700, marginBottom: 12 }}>
              Hướng dẫn sử dụng CycleTracking
            </h2>

            <p style={{ marginBottom: 16 }}>
              <b>Chu kỳ kinh nguyệt</b> là quá trình sinh lý tự nhiên lặp lại
              hàng tháng của cơ thể người có tử cung, bao gồm các giai đoạn:
              hành kinh (có kinh), giai đoạn nang trứng, rụng trứng và hoàng
              thể. Theo dõi chu kỳ giúp bạn hiểu rõ hơn về sức khỏe sinh sản,
              tâm trạng và thể chất của chính mình.
            </p>

            <ol style={{ marginLeft: 20, paddingLeft: 0, marginBottom: 0 }}>
              <li style={{ marginBottom: 12 }}>
                <b>📅 Chọn ngày trên lịch:</b> Nhấn vào bất kỳ ngày nào trên
                lịch để mở form ghi chú. Bạn có thể sử dụng lịch để ghi nhận
                thông tin theo từng ngày một cách trực quan.
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>🔴 Đánh dấu ngày bắt đầu kỳ kinh:</b> Nếu ngày đó là ngày đầu
                tiên bạn bắt đầu có kinh nguyệt, hãy tick vào ô "Đánh dấu là
                ngày bắt đầu kỳ kinh". Đây là bước **rất quan trọng**, vì hệ
                thống sẽ dựa vào đó để tính toán và dự đoán chu kỳ tiếp theo và
                thời điểm rụng trứng.
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>📝 Ghi chú thêm:</b> Bạn có thể ghi lại cảm xúc trong ngày,
                mức độ căng thẳng, giấc ngủ, chế độ ăn uống hoặc bất kỳ điều gì
                ảnh hưởng đến sức khỏe. Đây là cách để bạn hiểu được ảnh hưởng
                của các yếu tố bên ngoài đến cơ thể mình.
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>💊 Chọn triệu chứng:</b> Tick vào các triệu chứng bạn đang
                gặp như:
                <ul style={{ marginTop: 6, marginLeft: 20 }}>
                  <li>Đau bụng kinh, mệt mỏi, đau đầu, nổi mụn</li>
                  <li>
                    Căng tức ngực, chướng bụng, tiêu chảy, thay đổi tâm trạng
                  </li>
                  <li>Khác (tuỳ chọn thêm của bạn)</li>
                </ul>
                Việc ghi nhận triệu chứng thường xuyên sẽ giúp hệ thống đưa ra
                gợi ý cải thiện sức khỏe phù hợp với bạn.
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>💾 Lưu lại thông tin:</b> Sau khi nhập xong, nhấn "Lưu thay
                đổi" để lưu dữ liệu. Nếu bạn muốn xoá thông tin của ngày đó, hãy
                chọn "Xóa ngày này".
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>📊 Xem dự đoán và gợi ý:</b> Hệ thống sẽ dựa trên dữ liệu của
                bạn để:
                <ul style={{ marginTop: 6, marginLeft: 20 }}>
                  <li>Dự đoán ngày rụng trứng và kỳ kinh tiếp theo</li>
                  <li>Cảnh báo chu kỳ bất thường</li>
                  <li>Đưa ra lời khuyên chăm sóc sức khỏe cá nhân hóa</li>
                </ul>
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>📈 Xem lịch sử và thống kê:</b> Bạn có thể theo dõi biểu đồ
                chu kỳ và triệu chứng theo tháng để quan sát sự thay đổi của cơ
                thể qua thời gian. Đây là công cụ hữu ích nếu bạn đang quan tâm
                đến sức khỏe sinh sản, muốn mang thai, hoặc đang điều trị bệnh
                lý phụ khoa.
              </li>
              <li style={{ marginBottom: 12 }}>
                <b>⚠️ Lưu ý:</b> Dữ liệu của bạn được lưu trên hệ thống. Hãy ghi
                chú đều đặn để không bị mất dữ liệu khi đổi thiết bị.
              </li>
            </ol>

            <div style={{ marginTop: 20, color: "#555", fontSize: 14 }}>
              <b>🌟 Mẹo nhỏ:</b> Theo dõi chu kỳ không chỉ giúp bạn biết khi nào
              đến kỳ, mà còn giúp bạn hiểu rõ về cơ thể, cảm xúc, và sức khỏe
              tổng quát. Ghi chú đều đặn mỗi ngày để nhận được các dự đoán và
              lời khuyên cá nhân hóa chính xác nhất.
            </div>
          </div>
        </div>
      )}
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
              <button
                className="button-secondary"
                style={{ margin: "12px 0 0 0" }}
                onClick={() => setShowSymptomStatsModal(true)}
              >
                Xem thống kê triệu chứng tháng này
              </button>

              {showSymptomStatsModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowSymptomStatsModal(false)}
                >
                  <div
                    className="modal-content"
                    style={{ maxWidth: 400 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="modal-close-button"
                      onClick={() => setShowSymptomStatsModal(false)}
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                    <h2
                      style={{
                        textAlign: "center",
                        color: "#4f46e5",
                        fontWeight: 800,
                        fontSize: "1.3rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Thống kê triệu chứng tháng này
                    </h2>
                    {chartData.length > 0 && (
                      <div
                        style={{ width: "100%", height: 260, marginBottom: 18 }}
                      >
                        <ResponsiveContainer>
                          <BarChart
                            data={chartData.map((item) => ({
                              ...item,
                              name:
                                enumToVietnamese[item.symptom] || item.symptom,
                            }))}
                            layout="vertical"
                            margin={{ left: 20, right: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis dataKey="name" type="category" width={120} />
                            <Tooltip />
                            <Bar
                              dataKey="count"
                              fill="#6366f1"
                              radius={[6, 6, 6, 6]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        margin: "12px 0",
                      }}
                    >
                      <label>
                        Từ:
                        <input
                          type="date"
                          value={filterStart}
                          onChange={(e) => setFilterStart(e.target.value)}
                          style={{ marginLeft: 6 }}
                        />
                      </label>
                      <label>
                        Đến:
                        <input
                          type="date"
                          value={filterEnd}
                          onChange={(e) => setFilterEnd(e.target.value)}
                          style={{ marginLeft: 6 }}
                        />
                      </label>
                    </div>
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1.5px solid #e5e7eb",
                        margin: "0 0 10px 0",
                      }}
                    />
                    <table
                      className="period-history-table"
                      style={{ margin: "0 auto" }}
                    >
                      <thead>
                        <tr>
                          <th>Triệu chứng</th>
                          <th>Số lần</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(filteredSymptomStats).length === 0 && (
                          <tr>
                            <td colSpan={2}>Chưa có dữ liệu.</td>
                          </tr>
                        )}
                        {Object.entries(filteredSymptomStats).map(
                          ([symptom, count]) => (
                            <tr key={symptom}>
                              <td>{enumToVietnamese[symptom] || symptom}</td>
                              <td style={{ textAlign: "center" }}>{count}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <button
                className="button-secondary"
                style={{ margin: "12px 0" }}
                onClick={() => setShowHistoryModal(true)}
              >
                Xem lịch sử kỳ kinh
              </button>
              {showHistoryModal && (
                <div
                  className="modal-overlay"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <div
                    className="modal-content"
                    style={{ maxWidth: 700 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="modal-close-button"
                      onClick={() => setShowHistoryModal(false)}
                      aria-label="Đóng"
                    >
                      ×
                    </button>
                    <h2
                      style={{
                        textAlign: "center",
                        color: "#4f46e5",
                        fontWeight: 800,
                        fontSize: "1.5rem",
                        marginBottom: "0.5rem",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Lịch sử kỳ kinh
                    </h2>
                    <hr
                      style={{
                        border: "none",
                        borderTop: "1.5px solid #e5e7eb",
                        margin: "0 0 10px 0",
                      }}
                    />
                    <table className="period-history-table">
                      <thead>
                        <tr>
                          <th>Ngày bắt đầu</th>
                          <th>Số ngày</th>
                          <th>Ghi chú</th>
                          <th>Triệu chứng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.periodHistory.length === 0 && (
                          <tr>
                            <td colSpan={4}>Chưa có dữ liệu.</td>
                          </tr>
                        )}
                        {userData.periodHistory
                          .slice()
                          .sort((a, b) => new Date(b) - new Date(a))
                          .map((startDate) => {
                            const dateKey = format(startDate, "yyyy-MM-dd");
                            const log = userData.logs[dateKey] || {};
                            return (
                              <tr key={dateKey}>
                                <td>{format(startDate, "dd/MM/yyyy")}</td>
                                <td>{userData.avgPeriodLength}</td>
                                <td>{log.note || ""}</td>
                                <td>
                                  {(log.symptoms || [])
                                    .map((sym) => enumToVietnamese[sym] || sym)
                                    .join(", ")}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p>
                Kỳ kinh tiếp theo:{" "}
                <strong>
                  {format(predictions.nextPeriodStart, "dd/MM/yyyy")}
                </strong>
              </p>
              <p>
                Ngày rụng trứng:{" "}
                <strong>
                  {format(predictions.ovulationDay, "dd/MM/yyyy")}
                </strong>
              </p>
              <p>
                Độ dài chu kỳ TB:{" "}
                <strong>{predictions.avgCycleLength} ngày</strong>
              </p>
              <label>
                Độ dài kỳ kinh TB:{" "}
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={userData.avgPeriodLength}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      avgPeriodLength: Math.max(
                        2,
                        Math.min(15, Number(e.target.value))
                      ),
                    }))
                  }
                  style={{ width: 50, marginLeft: 8 }}
                />{" "}
                ngày
              </label>

              <p>
                Số kỳ kinh đã ghi nhận:{" "}
                <strong>{userData.periodHistory.length}</strong>
              </p>
              <p>
                Số ngày có ghi chú:{" "}
                <strong>{Object.keys(userData.logs).length}</strong>
              </p>
              <p>
                Số ngày có triệu chứng:{" "}
                <strong>
                  {
                    Object.values(userData.logs).filter(
                      (log) => log.symptoms && log.symptoms.length > 0
                    ).length
                  }
                </strong>
              </p>
            </div>
          ) : (
            <p>Chưa đủ dữ liệu để dự đoán.</p>
          )}
          <div className="legend">
            <h3>Chú thích</h3>
            <ul>
              <li>
                <span className="legend-color period"></span> Ngày có kinh
              </li>
              <li>
                <span className="legend-color predicted"></span> Ngày kinh dự
                đoán
              </li>
              <li>
                <span className="legend-color ovulation"></span> Ngày rụng trứng
              </li>
              <li>
                <span className="legend-dot"></span> Ngày có ghi chú
              </li>
              <li>
                <span className="legend-color today"></span> Hôm nay
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleTracker;
