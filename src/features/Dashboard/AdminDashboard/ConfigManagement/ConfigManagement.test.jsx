import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import ConfigManagement from './ConfigManagement';
import * as configAPI from '../../../../api/configAPI';

// Mock the API functions
jest.mock('../../../../api/configAPI');

// Mock antd message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ConfigManagement', () => {
  const mockConfigs = [
    { id: 1, name: 'MAX_BOOKING', value: 6 },
    { id: 2, name: 'MIN_BOOKING', value: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    configAPI.fetchAllConfigs.mockResolvedValue({ data: mockConfigs });
  });

  test('renders config management component', async () => {
    render(<ConfigManagement />);
    
    expect(screen.getByText('Quản lý Cấu hình chung')).toBeInTheDocument();
    expect(screen.getByText('Thêm cấu hình')).toBeInTheDocument();
    expect(screen.getByText('Làm mới')).toBeInTheDocument();
  });

  test('loads and displays configs on mount', async () => {
    render(<ConfigManagement />);
    
    await waitFor(() => {
      expect(configAPI.fetchAllConfigs).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('MAX_BOOKING')).toBeInTheDocument();
      expect(screen.getByText('MIN_BOOKING')).toBeInTheDocument();
    });
  });

  test('opens create modal when add button is clicked', async () => {
    render(<ConfigManagement />);
    
    const addButton = screen.getByText('Thêm cấu hình');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thêm cấu hình mới')).toBeInTheDocument();
    });
  });

  test('creates new config successfully', async () => {
    configAPI.createConfig.mockResolvedValue({ data: { id: 3, name: 'TEST_CONFIG', value: 5 } });
    
    render(<ConfigManagement />);
    
    // Open create modal
    const addButton = screen.getByText('Thêm cấu hình');
    fireEvent.click(addButton);
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Nhập tên cấu hình (ví dụ: MAX_BOOKING)');
    const valueInput = screen.getByPlaceholderText('Nhập giá trị (ví dụ: 6)');
    
    fireEvent.change(nameInput, { target: { value: 'TEST_CONFIG' } });
    fireEvent.change(valueInput, { target: { value: '5' } });
    
    // Submit form
    const submitButton = screen.getByText('Tạo mới');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(configAPI.createConfig).toHaveBeenCalledWith({
        name: 'TEST_CONFIG',
        value: 5,
      });
      expect(message.success).toHaveBeenCalledWith('Tạo cấu hình thành công!');
    });
  });

  test('handles create config error', async () => {
    configAPI.createConfig.mockRejectedValue(new Error('API Error'));
    
    render(<ConfigManagement />);
    
    // Open create modal
    const addButton = screen.getByText('Thêm cấu hình');
    fireEvent.click(addButton);
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Nhập tên cấu hình (ví dụ: MAX_BOOKING)');
    const valueInput = screen.getByPlaceholderText('Nhập giá trị (ví dụ: 6)');
    
    fireEvent.change(nameInput, { target: { value: 'TEST_CONFIG' } });
    fireEvent.change(valueInput, { target: { value: '5' } });
    
    // Submit form
    const submitButton = screen.getByText('Tạo mới');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Tạo cấu hình thất bại!');
    });
  });

  test('opens edit modal with pre-filled data', async () => {
    render(<ConfigManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('MAX_BOOKING')).toBeInTheDocument();
    });
    
    // Click edit button for first config
    const editButtons = screen.getAllByText('Sửa');
    fireEvent.click(editButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('Sửa cấu hình')).toBeInTheDocument();
      expect(screen.getByDisplayValue('MAX_BOOKING')).toBeInTheDocument();
      expect(screen.getByDisplayValue('6')).toBeInTheDocument();
    });
  });

  test('deletes config successfully', async () => {
    configAPI.deleteConfig.mockResolvedValue({});
    
    render(<ConfigManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('MAX_BOOKING')).toBeInTheDocument();
    });
    
    // Click delete button for first config
    const deleteButtons = screen.getAllByText('Xóa');
    fireEvent.click(deleteButtons[0]);
    
    // Confirm deletion
    const confirmButton = screen.getByText('Xóa');
    fireEvent.click(confirmButton);
    
    await waitFor(() => {
      expect(configAPI.deleteConfig).toHaveBeenCalledWith(1);
      expect(message.success).toHaveBeenCalledWith('Xóa cấu hình thành công!');
    });
  });

  test('refreshes config list when refresh button is clicked', async () => {
    render(<ConfigManagement />);
    
    const refreshButton = screen.getByText('Làm mới');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(configAPI.fetchAllConfigs).toHaveBeenCalledTimes(2); // Once on mount, once on refresh
    });
  });
});
