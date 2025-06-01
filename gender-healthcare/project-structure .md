# 📁 Gender Healthcare Service Management System – Dự Án Web Fullstack

Phần mềm quản lý dịch vụ chăm sóc sức khỏe giới tính tại cơ sở y tế.

---

## 🎯 Mục tiêu

- Quản lý tư vấn giới tính, sức khỏe sinh sản, lịch hẹn xét nghiệm STIs.
- Quản lý hồ sơ người dùng, tư vấn viên, lịch sử sức khỏe, dashboard.
- Xây dựng giao diện frontend hiện đại và backend API mạnh mẽ.

---

## 📁 Cấu trúc thư mục dự án

```
gender-healthcare-system/
│
├── .gitignore              # Cấu hình loại trừ Git
├── README.md               # Hướng dẫn sử dụng hệ thống
│
├── backend/                # 📦 Spring Boot project
│   ├── mvnw, mvnw.cmd      # Maven wrapper
│   ├── pom.xml             # File cấu hình Maven
│   ├── .mvn/               # Thư mục config Maven Wrapper
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/demo/
│   │   │   │       ├── DemoApplication.java
│   │   │   │       ├── controller/       # Xử lý request
│   │   │   │       ├── service/          # Xử lý logic nghiệp vụ
│   │   │   │       ├── model/            # Entity, DTO, Enum
│   │   │   │       └── repository/       # JPA Repository
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── static/               # File tĩnh (nếu cần)
│   │   └── test/                         # Unit tests
│   └── target/                           # Thư mục biên dịch (ignored)
│
frontend/
├── node_modules/              # 📦 Tự sinh ra bởi npm install (đừng đẩy Git)
│
├── public/                    # 🌐 Các file tĩnh được đưa nguyên vào build
│   └── favicon.ico
│
├── src/                       # 🎯 Toàn bộ source code
│   ├── assets/                # 📷 Hình ảnh, icon, font, v.v.
│   │   └── logo.png
│   │
│   ├── components/            # 🧩 Các component tái sử dụng
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Button.jsx
│   │
│   ├── pages/                 # 📄 Các trang (Home, Login, Register,...)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── routes/                # 🛣️ Định tuyến (nếu dùng react-router)
│   │   └── index.jsx
│   │
│   ├── App.jsx                # 🔁 Component chính
│   └── main.jsx               # 🚀 Điểm bắt đầu (entrypoint)
│
├── index.html                 # 🔧 HTML chính dùng bởi Vite (FE mount tại đây)
├── package.json               # 📦 Danh sách dependencies và scripts FE
├── package-lock.json          # 📌 Khóa phiên bản lib
├── vite.config.js             # ⚙️ Cấu hình Vite (port, alias, proxy, v.v.)
├── tailwind.config.cjs        # 🎨 Cấu hình Tailwind
├── postcss.config.cjs         # 🧵 Cấu hình dùng chung với Tailwind
├── .env                       # 🔐 Biến môi trường (ví dụ: `VITE_API_URL`)
├── .gitignore                 # 🛡️ Bỏ qua node_modules, dist, .env,...
└── dist/                      # 🏗️ Output khi build (dùng cho deploy, ignore Git)
```

---

## 👥 Roles (Actor)

- **Guest**: Xem thông tin, đăng ký tài khoản
- **Customer**: Khai báo chu kỳ, đặt lịch, nhận tư vấn
- **Consultant**: Trả lời tư vấn, cập nhật lịch
- **Staff**: Quản lý xét nghiệm, nhập kết quả
- **Manager**: Quản lý tổng thể, báo cáo
- **Admin**: Quản lý người dùng, dashboard, quyền hạn

---

## ✅ Các module chính

- Giới thiệu, blog, giáo dục giới tính
- Theo dõi chu kỳ kinh nguyệt
- Đặt lịch tư vấn
- Hỏi đáp với tư vấn viên
- Xét nghiệm STIs (đặt lịch, nhập kết quả)
- Quản lý tư vấn viên (hồ sơ, lịch tư vấn)
- Feedback, đánh giá
- Hồ sơ sức khỏe, lịch sử người dùng
- Dashboard, báo cáo doanh thu - hoạt động

---

## 🛠️ Công nghệ sử dụng

- Backend: **Spring Boot**, **JPA**, **MySQL**
- Frontend: **React**, **Vite**, **Tailwind CSS**
- Tools: **Postman**, **GitHub**, **IntelliJ**, **VS Code**
