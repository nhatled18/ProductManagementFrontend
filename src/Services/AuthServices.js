// services/authService.js
import apiClient from '../API/apiClient';

export const authService = {
  // Đăng nhập
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    // Lưu token vào localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  // Đăng ký
  register: (data) => apiClient.post('/auth/register', data),

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Đổi mật khẩu
  changePassword: (data) => apiClient.post('/auth/change-password', data),
};
