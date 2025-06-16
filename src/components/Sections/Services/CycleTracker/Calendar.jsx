import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { vi } from "date-fns/locale";
import "./Calendar.css";

const Calendar = ({ predictions, logs, onDayClick }) => {
  // Nhận thêm props
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => (
    <div className="calendar-header">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
      ></button>
      <span>{format(currentMonth, "MMMM yyyy", { locale: vi })}</span>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      ></button>
    </div>
  );

  const renderDaysOfWeek = () => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return (
      <div className="days-of-week">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="calendar-grid">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          let cellClass = "day-cell";
          if (!isSameMonth(day, monthStart)) cellClass += " disabled";
          if (isSameDay(day, new Date())) cellClass += " today";

          // Kiểm tra xem ngày có log triệu chứng không
          const hasSymptoms =
            logs[dateKey] &&
            logs[dateKey].symptoms &&
            logs[dateKey].symptoms.length > 0;

          if (predictions) {
            // Ngày có kinh thực tế
            if (
              logs[dateKey]?.isPeriodStart ||
              (predictions.periodDays &&
                predictions.periodDays.some((pd) => isSameDay(day, pd)))
            ) {
              cellClass += " period-day";
            }
            // Ngày rụng trứng
            if (isSameDay(day, predictions.ovulationDay))
              cellClass += " ovulation-day";
            // Ngày kinh dự đoán
            if (
              day >= predictions.nextPeriodStart &&
              day <= predictions.nextPeriodEnd
            ) {
              cellClass += " predicted-day";
            }
          }

          return (
            <button
              key={day.toString()}
              className={cellClass}
              onClick={() => onDayClick(day)}
            >
              <span>{format(day, "d")}</span>
              {/* Thêm chấm nếu có triệu chứng */}
              {hasSymptoms && <div className="symptom-dot"></div>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
