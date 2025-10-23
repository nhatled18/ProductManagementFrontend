// Services/TransactionServices.js (đổi tên file)
import apiClient from '../API/apiClient';

export const transactionService = {
  getAll: (params = {}) => apiClient.get('/transactions', { params }),
  
  getById: (id) => apiClient.get(`/transactions/${id}`),
  
  create: (data) => apiClient.post('/transactions', data),
  
  update: (id, data) => apiClient.put(`/transactions/${id}`, data),
  
  delete: (id) => apiClient.delete(`/transactions/${id}`),
  
  approve: (id) => apiClient.post(`/transactions/${id}/approve`),
  
  // Có thể thêm filter by type
  getByType: (type, params = {}) => 
    apiClient.get('/transactions', { params: { ...params, type } }),  // type: 'import' hoặc 'export'
};