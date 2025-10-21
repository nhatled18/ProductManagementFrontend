import apiClient from '../API/apiClient';

export const importService = {
getAll: (params = {}) => apiClient.get('/imports', { params }),

getById: (id) => apiClient.get(`/imports/${id}`),

create: (data) => apiClient.post('/imports', data),

update: (id, data) => apiClient.put(`/imports/${id}`, data),

delete: (id) => apiClient.delete(`/imports/${id}`),

approve: (id) => apiClient.post(`/imports/${id}/approve`),

getSuppliers: () => apiClient.get('/suppliers'),
};
