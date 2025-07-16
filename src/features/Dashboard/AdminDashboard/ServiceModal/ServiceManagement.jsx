import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  message,
  Form,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  CheckOutlined,
  StopOutlined,
} from "@ant-design/icons";
import api from "../../../../configs/api";
import ServiceModal from "./ServiceModal";
import ServiceDetailModal from "./ServiceDetailModal";

// Helper functions for service type
const getServiceTypeColor = (serviceType) => {
  switch (serviceType) {
    case "CONSULTING":
    case "CONSULTING_ON":
      return "blue";
    case "TESTING_OFF":
      return "green";
    case "EXAMINATION":
      return "orange";
    case "OTHER":
    default:
      return "default";
  }
};

const getServiceTypeLabel = (serviceType) => {
  switch (serviceType) {
    case "CONSULTING":
      return "Tư Vấn";
    case "CONSULTING_ON":
      return "Tư vấn trực tuyến";
    case "TESTING_OFF":
      return "Xét nghiệm";
    case "EXAMINATION":
      return "Khám bệnh";
    case "COMBO":
      return "Gói khám";
    default:
      return serviceType?.replace(/_/g, " ") || "N/A";
  }
};

/**
 * Service Management Component
 * Handles all service-related operations
 */
const ServiceManagement = () => {
  // States
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [isServiceModalVisible, setIsServiceModalVisible] = useState(false);
  const [isServiceDetailModalVisible, setIsServiceDetailModalVisible] =
    useState(false);
  const [serviceDetail, setServiceDetail] = useState(null);
  const [isComboService, setIsComboService] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [form] = Form.useForm();

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // API Functions
  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      const data = Array.isArray(response.data)
        ? response.data
        : [response.data];
      return data;
    } catch (error) {
      console.error("Lỗi lấy dịch vụ:", error);
      return [];
    }
  };

  const fetchServiceById = async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy dịch vụ theo ID:", error);
      throw error;
    }
  };

  const fetchAvailableServices = async () => {
    try {
      console.log(" Fetching available services for combo...");
      const response = await api.get("/services");
      console.log(" Available services response:", response);

      const data = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];

      // Chỉ lấy services: không phải combo (bỏ filter theo status)
      const filteredData = data.filter((service) => !service.isCombo);
      console.log(
        " Filtered available services (non-combo, all status):",
        filteredData
      );

      return filteredData;
    } catch (error) {
      console.error(" Lỗi lấy danh sách services:", error);
      message.error("Không thể tải danh sách services để tạo combo!");
      return [];
    }
  };

  const addService = async (service) => {
    try {
      const serviceData = {
        name: service.name,
        description: service.description,
        duration: service.duration ? parseInt(service.duration) : null,
        type: service.type,
        price: service.price ? parseFloat(service.price) : 0,
        discountPercent: service.discountPercent
          ? parseFloat(service.discountPercent)
          : 0,
        isActive: service.isActive !== undefined ? service.isActive : true,
        isCombo: service.isCombo || false,
        specializationIds: service.specializationIds || [],
        ...(service.isCombo &&
          service.subServiceIds &&
          service.subServiceIds.length > 0 && {
            subServiceIds: service.subServiceIds,
          }),
      };

      console.log(" Sending service data:", serviceData);
      const response = await api.post("/services", serviceData);
      console.log(" Backend response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm dịch vụ:", error);
      throw error;
    }
  };

  const updateService = async (id, service) => {
    try {
      const serviceData = {
        name: service.name,
        description: service.description,
        duration: service.duration ? parseInt(service.duration) : null,
        type: service.type,
        price: service.price ? parseFloat(service.price) : 0,
        discountPercent: service.discountPercent
          ? parseFloat(service.discountPercent)
          : 0,
        isActive: service.isActive !== undefined ? service.isActive : true,
        isCombo: service.isCombo || false,
        specializationIds: service.specializationIds || [],
        ...(service.isCombo &&
          service.subServiceIds &&
          service.subServiceIds.length > 0 && {
            subServiceIds: service.subServiceIds,
          }),
      };

      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error("Lỗi sửa dịch vụ:", error);
      throw error;
    }
  };

  const deactivateService = async (id) => {
    try {
      await api.put(`/services/${id}/deactivate`);
    } catch (error) {
      console.error("Lỗi vô hiệu hóa dịch vụ:", error);
      throw error;
    }
  };

  const activateService = async (id) => {
    try {
      await api.put(`/services/${id}/activate`);
    } catch (error) {
      console.error("Lỗi kích hoạt dịch vụ:", error);
      throw error;
    }
  };

  const createComboService = async (serviceData) => {
    try {
      const response = await api.post("/services/combo", serviceData);
      return response.data;
    } catch (error) {
      console.error("Lỗi tạo combo service:", error);
      throw error;
    }
  };

  const searchServiceByName = async (name) => {
    try {
      console.log(" Searching services with name:", name);
      const response = await api.get("/services/search", {
        params: { name: name },
      });
      console.log(" Search response:", response.data);
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      console.error(" Lỗi tìm kiếm service:", error);
      console.error(" Error response:", error.response?.data);
      console.error(" Error status:", error.response?.status);
      throw error;
    }
  };

  // Load services
  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      message.error("Không thể tải danh sách services!");
    }
  };

  // Handlers
  const handleAddService = () => {
    setEditingService(null);
    setIsComboService(false);
    form.resetFields();
    setIsServiceModalVisible(true);
  };

  const handleAddComboService = async () => {
    setEditingService(null);
    setIsComboService(true);
    form.resetFields();
    // Load available services for combo
    console.log(" Loading available services for combo...");
    const services = await fetchAvailableServices();
    console.log(" Available services loaded:", services);
    setAvailableServices(services);
    setIsServiceModalVisible(true);
  };

  const handleEditService = async (record) => {
    try {
      const serviceDetail = await fetchServiceById(record.id);
      setEditingService(serviceDetail);

      const formData = {
        ...serviceDetail,
        duration: serviceDetail.duration
          ? Math.floor(serviceDetail.duration / 60)
          : null,
      };
      form.setFieldsValue(formData);
      setIsServiceModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết dịch vụ:", error);
      message.error("Không thể lấy thông tin chi tiết dịch vụ!");
    }
  };

  const handleViewServiceDetail = async (record) => {
    try {
      const detail = await fetchServiceById(record.id);
      setServiceDetail(detail);
      setIsServiceDetailModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết dịch vụ:", error);
      message.error("Không thể lấy thông tin chi tiết dịch vụ!");
    }
  };

  const handleToggleServiceStatus = async (record) => {
    try {
      console.log(
        " Toggling service status:",
        record.id,
        "isActive:",
        record.isActive
      );

      if (record.isActive) {
        console.log("⏸ Deactivating service...");
        await deactivateService(record.id);
        message.success("Dịch vụ đã được vô hiệu hóa!");
      } else {
        console.log(" Activating service...");
        await activateService(record.id);
        message.success("Dịch vụ đã được kích hoạt!");
      }

      console.log(" Reloading services data...");
      await loadServices();
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái dịch vụ:", error);
      message.error("Có lỗi xảy ra khi thay đổi trạng thái dịch vụ!");
    }
  };

  // Handle adding regular service
  const handleAddRegularService = async () => {
    try {
      const values = await form.validateFields();
      console.log("🔵 Adding regular service with values:", values);

      const serviceData = {
        name: values.name,
        description: values.description,
        duration: values.duration ? parseInt(values.duration) : null,
        type: values.type,
        price: values.price ? parseFloat(values.price) : 0,
        isActive: values.isActive !== undefined ? values.isActive : true,
        isCombo: false,
        specializationIds: values.specializationIds || [],
        discountPercent: values.discountPercent
          ? parseFloat(values.discountPercent)
          : 0,
      };

      console.log("🔵 Sending regular service data:", serviceData);
      await addService(serviceData);

      // Close modal and reset
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
      setIsComboService(false);

      await loadServices();
      message.success("Tạo dịch vụ thành công!");
    } catch (error) {
      console.error(" Lỗi tạo dịch vụ thường:", error);
      message.error("Có lỗi xảy ra khi tạo dịch vụ!");
    }
  };

  // Handle submitting combo service form
  const handleSubmitComboService = async () => {
    try {
      const values = await form.validateFields();
      console.log("🟠 Adding combo service with values:", values);

      const comboData = {
        name: values.name,
        description: values.description,
        duration: values.duration ? parseInt(values.duration) * 60 : null,
        type: values.type,
        isCombo: true,
        specializationIds: values.specializationIds || [],
        subServiceIds: values.subServiceIds || [],
        discountPercent: values.discountPercent
          ? parseFloat(values.discountPercent)
          : 0,
      };

      console.log("🟠 Sending combo service data:", comboData);
      await createComboService(comboData);

      // Close modal and reset
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
      setIsComboService(false);

      await loadServices();
      message.success("Tạo gói dịch vụ thành công!");
    } catch (error) {
      console.error(" Lỗi tạo gói dịch vụ:", error);
      message.error("Có lỗi xảy ra khi tạo gói dịch vụ!");
    }
  };

  // Handle updating existing service
  const handleUpdateService = async () => {
    try {
      const values = await form.validateFields();
      console.log("🟡 Updating service with values:", values);

      await updateService(editingService.id, values);

      // Close modal and reset
      setIsServiceModalVisible(false);
      form.resetFields();
      setEditingService(null);
      setIsComboService(false);

      await loadServices();
      message.success("Cập nhật dịch vụ thành công!");
    } catch (error) {
      console.error(" Lỗi cập nhật dịch vụ:", error);
      message.error("Có lỗi xảy ra khi cập nhật dịch vụ!");
    }
  };

  // Main handler that routes to appropriate function
  const handleServiceModalOk = async () => {
    if (editingService) {
      await handleUpdateService();
    } else if (isComboService) {
      await handleSubmitComboService();
    } else {
      await handleAddRegularService();
    }
  };

  const handleServiceModalCancel = () => {
    setIsServiceModalVisible(false);
    setEditingService(null);
    form.resetFields();
    setIsComboService(false);
  };

  const handleServiceDetailModalCancel = () => {
    setIsServiceDetailModalVisible(false);
    setServiceDetail(null);
  };

  // Handle search service
  const handleSearchService = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setSearchTerm("");
      return;
    }

    try {
      setIsSearching(true);
      setSearchTerm(value);
      const results = await searchServiceByName(value.trim());
      const searchData = Array.isArray(results) ? results : [results];
      setSearchResults(searchData);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
      message.error("Không tìm thấy dịch vụ nào!");
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Table columns definition
  const serviceColumns = [
    { title: "Tên Dịch vụ", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Thời gian (phút)",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => {
        try {
          return duration ? Math.floor(duration / 60) : "N/A";
        } catch (error) {
          console.error(" Error rendering duration:", error, duration);
          return "Error";
        }
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={getServiceTypeColor(type)}>{getServiceTypeLabel(type)}</Tag>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specializations",
      key: "specializations",
      render: (specializations) => (
        <div>
          {specializations && specializations.length > 0 ? (
            specializations.map((spec) => (
              <Tag key={spec.id} color="blue" style={{ marginBottom: 4 }}>
                {spec.name}
              </Tag>
            ))
          ) : (
            <span style={{ color: "#999" }}>Chưa có</span>
          )}
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => {
        try {
          return `${price?.toLocaleString() || 0}đ`;
        } catch (error) {
          console.error(" Error rendering price:", error, price);
          return "0đ";
        }
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (discount) => `${discount || 0}%`,
    },
    {
      title: "Gói Dịch vụ",
      dataIndex: "isCombo",
      key: "isCombo",
      render: (isCombo) => (
        <Tag color={isCombo ? "orange" : "default"}>
          {isCombo ? "Có" : "Không"}
        </Tag>
      ),
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => {
        try {
          // console.log(" Rendering Action for record:", record);

          if (!record) {
            console.error(" Record is null/undefined");
            return <span>Error: No data</span>;
          }

          return (
            <Space size="middle">
              <Button
                icon={<EyeOutlined />}
                size="small"
                onClick={() => handleViewServiceDetail(record)}
              >
                Xem
              </Button>
              <Button
                icon={<EditOutlined />}
                size="small"
                onClick={() => handleEditService(record)}
              >
                Sửa
              </Button>
              <Popconfirm
                title={`Bạn có chắc muốn ${
                  record.isActive ? "vô hiệu hóa" : "kích hoạt"
                } dịch vụ này?`}
                onConfirm={() => handleToggleServiceStatus(record)}
              >
                <Button
                  icon={record.isActive ? <StopOutlined /> : <CheckOutlined />}
                  size="small"
                  danger={record.isActive}
                  type={record.isActive ? "default" : "primary"}
                >
                  {record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                </Button>
              </Popconfirm>
            </Space>
          );
        } catch (error) {
          console.error(" Error rendering Action column:", error, record);
          return <span>Error</span>;
        }
      },
    },
  ];

  console.log(" Rendering ServiceManagement with data:", {
    services,
    searchResults,
    searchTerm,
    servicesLength: services?.length,
    searchResultsLength: searchResults?.length,
  });

  return (
    <>
      <Card
        title="Quản lý Dịch vụ Xét nghiệm & Giá cả"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm kiếm dịch vụ theo tên..."
              allowClear
              loading={isSearching}
              onSearch={handleSearchService}
              onChange={(e) => {
                if (!e.target.value) {
                  handleClearSearch();
                }
              }}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddService}
            >
              Thêm Dịch vụ
            </Button>
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleAddComboService}
              style={{
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                color: "white",
              }}
            >
              Thêm Gói Dịch vụ
            </Button>
          </Space>
        }
      >
        {searchTerm && (
          <div style={{ marginBottom: 16 }}>
            <Tag color="blue">
              Kết quả tìm kiếm cho: "{searchTerm}" ({searchResults.length} tìm
              thấy)
            </Tag>
            <Button type="link" size="small" onClick={handleClearSearch}>
              Xóa tìm kiếm
            </Button>
          </div>
        )}
        <Table
          columns={serviceColumns}
          dataSource={searchTerm ? searchResults : services}
          rowKey={(record) => {
            // console.log(" Table rowKey record:", record);
            return record?.id || `temp-${Math.random()}`;
          }}
          locale={{
            emptyText: searchTerm
              ? `Không tìm thấy dịch vụ nào cho "${searchTerm}"`
              : "Không có dịch vụ nào",
          }}
          // onRow={(record, index) => {
          //   // console.log(" Table onRow:", { record, index });
          //   return {};
          // }}
        />
      </Card>

      {/* Service Modal */}
      <ServiceModal
        visible={isServiceModalVisible}
        onOk={handleServiceModalOk}
        onCancel={handleServiceModalCancel}
        form={form}
        editingService={editingService}
        isComboService={isComboService}
        setIsComboService={setIsComboService}
        availableServices={availableServices}
        setAvailableServices={setAvailableServices}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        visible={isServiceDetailModalVisible}
        onCancel={handleServiceDetailModalCancel}
        serviceDetail={serviceDetail}
      />
    </>
  );
};

export default ServiceManagement;
