import { toast } from "react-toastify";

// Global toast configuration
const toastConfig = {
  position: "bottom-center",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  newestOnTop: false,
  rtl: false,
};

// Toast utility functions
export const showToast = {
  success: (message, customConfig = {}) =>
    toast.success(message, { ...toastConfig, ...customConfig }),

  error: (message, customConfig = {}) =>
    toast.error(message, {
      ...toastConfig,
      autoClose: 3000, // Error toast hiển thị lâu hơn
      ...customConfig,
    }),

  info: (message, customConfig = {}) =>
    toast.info(message, { ...toastConfig, ...customConfig }),

  warning: (message, customConfig = {}) =>
    toast.warning(message, { ...toastConfig, ...customConfig }),

  // Custom toast với icon
  successWithIcon: (message, icon = "✓") =>
    toast.success(`${icon} ${message}`, toastConfig),

  errorWithIcon: (message, icon = "✗") =>
    toast.error(`${icon} ${message}`, {
      ...toastConfig,
      autoClose: 3000,
    }),

  // Toast cho các action cụ thể
  loading: (message) =>
    toast.loading(message, {
      ...toastConfig,
      autoClose: false, // Loading toast không tự đóng
    }),

  // Update loading toast
  updateLoading: (toastId, message, type = "success") => {
    const config = {
      ...toastConfig,
      autoClose: type === "error" ? 3000 : 2500,
    };

    if (type === "success") {
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        ...config,
      });
    } else if (type === "error") {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        ...config,
      });
    }
  },

  // Dismiss all toasts
  dismissAll: () => toast.dismiss(),

  // Dismiss specific toast
  dismiss: (toastId) => toast.dismiss(toastId),
};

// Export default config for manual usage
export const defaultToastConfig = toastConfig;

// Preset messages for common actions
export const toastMessages = {
  // Success messages
  success: {
    save: "Lưu thành công!",
    update: "Cập nhật thành công!",
    delete: "Xóa thành công!",
    create: "Tạo mới thành công!",
    login: "Đăng nhập thành công!",
    logout: "Đăng xuất thành công!",
    upload: "Tải lên thành công!",
    download: "Tải xuống thành công!",
  },

  // Error messages
  error: {
    save: "Lỗi khi lưu dữ liệu!",
    update: "Lỗi khi cập nhật!",
    delete: "Lỗi khi xóa!",
    create: "Lỗi khi tạo mới!",
    login: "Đăng nhập thất bại!",
    network: "Lỗi kết nối mạng!",
    permission: "Bạn không có quyền thực hiện hành động này!",
    validation: "Dữ liệu không hợp lệ!",
    upload: "Lỗi khi tải lên!",
    download: "Lỗi khi tải xuống!",
  },

  // Info messages
  info: {
    loading: "Đang tải dữ liệu...",
    processing: "Đang xử lý...",
    waiting: "Vui lòng đợi...",
  },

  // Warning messages
  warning: {
    unsaved: "Bạn có thay đổi chưa được lưu!",
    confirm: "Bạn có chắc chắn muốn thực hiện hành động này?",
    limit: "Bạn đã đạt giới hạn cho phép!",
  },
};

export default showToast;
