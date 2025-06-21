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

          const hasSymptoms = logs[dateKey]?.symptoms?.length > 0;
          const hasNote =
            logs[dateKey]?.note && logs[dateKey].note.trim() !== "";

          if (predictions) {
            if (predictions?.periodDays?.some((pd) => isSameDay(day, pd))) {
              cellClass += " period-day";
            }
            if (isSameDay(day, predictions.ovulationDay)) {
              cellClass += " ovulation-day";
            }
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
              {/* Hiển thị icon ghi chú ở trên số ngày */}
              {hasNote && (
                <span
                  className="note-dot"
                  title={logs[dateKey].note}
                  style={{ display: "block", fontSize: 13, lineHeight: 1 }}
                >
                  🧸
                </span>
              )}
              <span style={{ position: "relative", display: "inline-block" }}>
                {format(day, "d")}
                {hasSymptoms && (
                  <span
                    className="bear-icon"
                    title="Có triệu chứng"
                    style={{
                      position: "absolute",
                      top: -20,
                      right: -12,
                      fontSize: "1.1em",
                      pointerEvents: "none",
                    }}
                  >
                    🐻
                  </span>
                )}
              </span>
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