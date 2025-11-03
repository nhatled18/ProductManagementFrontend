import apiClient from '../API/apiClient';

export const transactionService = {
  // Lấy tất cả transactions với filter
  getAll: (params = {}) => {
    return apiClient.get('/transactions', { params });
  },

  // Lấy theo ID
  getById: (id) => {
    return apiClient.get(`/transactions/${id}`);
  },

  // Tạo mới một transaction
  create: (transactionData) => {
    return apiClient.post('/transactions', transactionData);
  },

  // Tạo nhiều transactions cùng lúc (batch import/export)
  createBatch: (transactions) => {
    return apiClient.post('/transactions/batch', { transactions });
  },

  // Cập nhật transaction
  update: (id, transactionData) => {
    return apiClient.put(`/transactions/${id}`, transactionData);
  },

  // Xóa transaction
  delete: (id) => {
    return apiClient.delete(`/transactions/${id}`);
  },

  // Xóa nhiều transactions
  deleteMany: (ids) => {
    return apiClient.post('/transactions/delete-many', { ids });
  },

  // Lấy transactions theo type (import/export)
  getByType: (type, params = {}) => {
    return apiClient.get('/transactions', { 
      params: { ...params, type } 
    });
  },

  // Lấy transactions theo productId
  getByProduct: (productId, params = {}) => {
    return apiClient.get(`/transactions/product/${productId}`, { params });
  },

  // Thống kê transactions
  getStats: (params = {}) => {
    return apiClient.get('/transactions/stats', { params });
  },

  // Import từ Excel
  importExcel: (file, type = 'import') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type); 
    return apiClient.post('/transactions/import-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Export to Excel
  exportExcel: (params = {}) => {
    return apiClient.get('/transactions/export', {
      params,
      responseType: 'blob'
    });
  },

  // Lấy transactions theo date range
  getByDateRange: (startDate, endDate, params = {}) => {
    return apiClient.get('/transactions', {
      params: {
        ...params,
        startDate,
        endDate
      }
    });
  }
};

export default transactionService;