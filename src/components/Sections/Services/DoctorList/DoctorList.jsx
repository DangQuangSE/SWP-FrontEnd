import React, { useState, useEffect } from "react";
import DoctorCard from "./DoctorCard";
import doctorsData from "./Data/Doctors";
import "./DoctorList.css";

const ITEMS_PER_PAGE = 8;

const DoctorList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("DoctorList component mounted");
    console.log("Initial doctorsData:", doctorsData);

    setTimeout(() => {
      setDoctors(doctorsData);
      setLoading(false);
      console.log("Doctors set after timeout:", doctorsData);
    }, 300);
  }, []);

  console.log("Current doctors state:", doctors);
  console.log("Loading state:", loading);

  const indexOfLastDoctor = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstDoctor = indexOfLastDoctor - ITEMS_PER_PAGE;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="doctor-page-number"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="start-ellipsis" className="doctor-page-ellipsis">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`doctor-page-number ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" className="doctor-page-ellipsis">
            ...
          </span>
        );
      }
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="doctor-page-number"
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="doctor-list-page">
      <h1 className="page-title">Danh sách Bác sĩ - Chuyên gia</h1>
      <div className="doctors-grid-container">
        {loading ? (
          <p>Đang tải danh sách bác sĩ...</p>
        ) : currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))
        ) : (
          <p>Không tìm thấy bác sĩ nào.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="doctor-pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="doctor-page-nav-button"
          >
            &lt;
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="doctor-page-nav-button"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
