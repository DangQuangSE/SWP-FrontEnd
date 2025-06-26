
import React, { useState } from "react";
import "./DoctorList.css";

const DoctorList = () => {
  const doctors = [
    {
      id: 1,
      name: "BS. Nguyễn Văn A",
      image: "https://i.pinimg.com/736x/37/8b/54/378b5429a928e610c211eaa96af003ce.jpg",
      experience: "10 năm kinh nghiệm",
      specialties: ["Sản phụ khoa"],
      workplace: "BV Phụ sản Quốc tế",
    },
    {
      id: 2,
      name: "BS. Trần Thị B",
      image: "https://i.pinimg.com/736x/4c/35/0e/4c350ec37fc1ddd6c62ddf65dc5255ea.jpg",
      experience: "8 năm kinh nghiệm",
      specialties: ["Nam khoa", "Tư vấn giới tính"],
      workplace: "BV Đại học Y",
    },
    {
      id: 3,
      name: "BS. Lê Văn C",
      image: "https://i.pinimg.com/736x/91/04/05/910405ee7040a817b3f43223412e08b4.jpg",
      experience: "15 năm kinh nghiệm",
      specialties: ["Nhi khoa", "Dị ứng"],
      workplace: "BV Nhi Đồng",
    },
    {
      id: 4, 
      name: "BS. Phạm Thị D", 
      image: "https://i.pinimg.com/736x/e7/b2/2c/e7b22c1f928c1d06d00dc1c887ef9918.jpg", 
      experience: "12 năm kinh nghiệm", 
      specialties: ["Da liễu"], 
      workplace: "BV Da liễu Trung ương",
    },
    {
      id: 5, 
      name: "BS. Trần Thị H", 
      image: "https://i.pinimg.com/736x/6a/bf/2b/6abf2b327e6093e100127b0abf8acd28.jpg", 
      experience: "13 năm kinh nghiệm", 
      specialties: ["Ngoại khoa"], 
      workplace: "BV Quân Y",
    },
    {
      id: 6, 
      name: "BS. Nguyễn Văn V", 
      image: "https://i.pinimg.com/736x/aa/14/ec/aa14ec594fc216764d67d696067a913e.jpg", 
      experience: "20 năm kinh nghiệm", 
      specialties: ["Tim mạch"], 
      workplace: "BV Đại học Y",
    },
    {
      id: 7,
      name: "BS. Nguyễn Văn A",
      image: "https://i.pinimg.com/736x/37/8b/54/378b5429a928e610c211eaa96af003ce.jpg",
      experience: "10 năm kinh nghiệm",
      specialties: ["Sản phụ khoa"],
      workplace: "BV Phụ sản Quốc tế",
    },
    {
      id: 8,
      name: "BS. Trần Thị B",
      image: "https://i.pinimg.com/736x/4c/35/0e/4c350ec37fc1ddd6c62ddf65dc5255ea.jpg",
      experience: "8 năm kinh nghiệm",
      specialties: ["Nam khoa", "Tư vấn giới tính"],
      workplace: "BV Đại học Y",
    },
    {
      id: 9,
      name: "BS. Lê Văn C",
      image: "https://i.pinimg.com/736x/91/04/05/910405ee7040a817b3f43223412e08b4.jpg",
      experience: "15 năm kinh nghiệm",
      specialties: ["Nhi khoa", "Dị ứng"],
      workplace: "BV Nhi Đồng",
    },
    {
      id: 10, 
      name: "BS. Phạm Thị D", 
      image: "https://i.pinimg.com/736x/e7/b2/2c/e7b22c1f928c1d06d00dc1c887ef9918.jpg", 
      experience: "12 năm kinh nghiệm", 
      specialties: ["Da liễu"], 
      workplace: "BV Da liễu Trung ương",
    },
    {
      id: 11, 
      name: "BS. Trần Thị H", 
      image: "https://i.pinimg.com/736x/6a/bf/2b/6abf2b327e6093e100127b0abf8acd28.jpg", 
      experience: "13 năm kinh nghiệm", 
      specialties: ["Ngoại khoa"], 
      workplace: "BV Quân Y",
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6; 
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className="doctor-list-container">
        {currentDoctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-info">
              <div>
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialties.join(", ")}</p>
                <p className="doctor-experience">{doctor.experience}</p>
                <p className="doctor-workplace">{doctor.workplace}</p>
              </div>
              <button className="book-appointment-btn">Đặt lịch hẹn</button>
            </div>
          </div>
        ))}
      </div>

       {totalPages > 1 && (
        <div className="pagination">
          {/* Nút Previous (Lùi) */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            
          </button>

          {/* Các nút số trang */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          ))}

          {/* Nút Next (Tới) */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          ></button>
        </div>
      )}
    </>
  );
};

export default DoctorList;