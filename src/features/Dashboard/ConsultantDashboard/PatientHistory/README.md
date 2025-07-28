# Patient History Components

Hệ thống components để hiển thị hồ sơ bệnh án và lịch sử khám bệnh của bệnh nhân.

## Components

### 1. PatientDetailButton

**Nút "Chi tiết" để mở modal hồ sơ bệnh án**

```jsx
import { PatientDetailButton } from './features/Dashboard/ConsultantDashboard/PatientHistory';

// Sử dụng cơ bản
<PatientDetailButton
  patientId={3}
  patientName="Nguyễn Văn A"
/>

// Tùy chỉnh
<PatientDetailButton
  patientId={3}
  patientName="Nguyễn Văn A"
  buttonText="Xem hồ sơ"
  buttonType="primary"
  buttonSize="small"
/>
```

**Props:**

- `patientId` (number, required): ID bệnh nhân
- `patientName` (string): Tên bệnh nhân hiển thị trong modal
- `buttonText` (string): Text hiển thị trên nút (default: "Chi tiết")
- `buttonType` (string): Loại nút Ant Design (default: "link")
- `buttonSize` (string): Kích thước nút (default: "small")
- `disabled` (boolean): Vô hiệu hóa nút

### 2. PatientInfoCard

**Thẻ hiển thị thông tin bệnh nhân với nút Chi tiết**

```jsx
import { PatientInfoCard } from "./features/Dashboard/ConsultantDashboard/PatientHistory";

<PatientInfoCard
  patientId={3}
  patientName="Nguyễn Văn A"
  patientAge={35}
  patientGender="Nam"
  patientEmail="patient@email.com"
  patientPhone="0123456789"
  appointmentDate="2025-07-03"
  appointmentCount={4}
/>;
```

**Props:**

- `patientId` (number): ID bệnh nhân
- `patientName` (string): Tên bệnh nhân
- `patientAge` (number): Tuổi
- `patientGender` (string): Giới tính
- `patientEmail` (string): Email
- `patientPhone` (string): Số điện thoại
- `appointmentDate` (string): Ngày hẹn
- `appointmentCount` (number): Số lượt khám
- `showDetailButton` (boolean): Hiển thị nút Chi tiết (default: true)

### 3. PatientMedicalHistory

**Component chính hiển thị hồ sơ bệnh án đầy đủ**

```jsx
import { PatientMedicalHistory } from "./features/Dashboard/ConsultantDashboard/PatientHistory";

<PatientMedicalHistory patientId={3} />;
```

**Props:**

- `patientId` (number, required): ID bệnh nhân

## 🔧 API Functions

### getPatientMedicalHistory

```jsx
import { getPatientMedicalHistory } from "./api/patientHistoryAPI";

const response = await getPatientMedicalHistory(patientId, page, size);
```

**Endpoint:** `GET /api/medical-profile/patient/{patientId}/history`

**Parameters:**

- `patientId` (number): ID bệnh nhân
- `page` (number): Số trang (0-based)
- `size` (number): Kích thước trang

## Cách tích hợp vào project hiện có

### 1. Trong Consultant Dashboard

```jsx
// Thêm vào PersonalSchedule.jsx hoặc component khác
import { PatientDetailButton } from "../PatientHistory";

// Trong render của appointment detail
<PatientDetailButton
  patientId={appointment.customerId}
  patientName={appointment.customerName}
/>;
```

### 2. Trong bảng danh sách bệnh nhân

```jsx
// Thêm column "Chi tiết" vào Table
{
  title: "Thao tác",
  key: "action",
  render: (_, record) => (
    <PatientDetailButton
      patientId={record.id}
      patientName={record.name}
    />
  ),
}
```

### 3. Trong thẻ thông tin bệnh nhân

```jsx
// Sử dụng PatientInfoCard thay thế cho card hiện có
<PatientInfoCard
  patientId={patient.id}
  patientName={patient.name}
  patientAge={patient.age}
  patientGender={patient.gender}
  patientEmail={patient.email}
  appointmentCount={patient.totalVisits}
/>
```

## 🎨 Thiết kế

- **Chuyên nghiệp y tế**: Màu sắc nhẹ nhàng, không lòe loẹt
- **Tiếng Việt**: Toàn bộ interface bằng tiếng Việt
- **Responsive**: Tương thích mobile và desktop
- **Modal**: Hiển thị hồ sơ trong modal không ảnh hưởng workflow
- **Loading states**: Có loading và error handling

## Demo

Chạy `PatientHistoryDemo` component để xem demo đầy đủ:

```jsx
import { PatientHistoryDemo } from "./features/Dashboard/ConsultantDashboard/PatientHistory";

<PatientHistoryDemo />;
```

## 📱 User Experience

1. **Click nút "Chi tiết"** → Mở modal hồ sơ bệnh án
2. **Modal hiển thị**:
   - Thông tin cơ bản bệnh nhân
   - Lịch sử khám bệnh (có pagination)
   - Kết quả xét nghiệm gần đây
3. **Click "Đóng"** → Đóng modal, quay về màn hình chính

**Không ảnh hưởng đến workflow hiện có!** ✅
