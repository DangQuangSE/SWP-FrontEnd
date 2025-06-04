"use client"

import { useEffect, useRef } from "react"
import "./SubHeader.css"

const SubHeader = () => {
  const scrollTextRef = useRef(null)

  useEffect(() => {
    // Optional: Add any initialization for the scrolling text if needed
  }, [])

  return (
    <div className="sub-header">
      <div className="scrolling-banner">
        <div className="scrolling-text" ref={scrollTextRef}>
          <span>
            Giúp Việc để người thân luôn được chăm sóc khi đi khám bệnh{" "}
            <button className="book-now-btn">📅 Đặt ngay</button>
          </span>
          <span>
            Tư vấn sức khỏe sinh sản miễn phí cho phụ nữ <button className="book-now-btn">📞 Gọi ngay</button>
          </span>
          <span>
            Dịch vụ khám sức khỏe tổng quát với các bác sĩ chuyên khoa{" "}
            <button className="book-now-btn">🔍 Tìm hiểu</button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default SubHeader
