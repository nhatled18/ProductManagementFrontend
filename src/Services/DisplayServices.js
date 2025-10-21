import apiClient from '../API/apiClient';

export const displayService = {
getAll: (params = {}) => apiClient.get('/display', { params }),

getById: (id) => apiClient.get(`/display/${id}`),

addProduct: (data) => apiClient.post('/display/products', data),

updatePosition: (id, data) => apiClient.put(`/display/${id}`, data),

removeProduct: (id) => apiClient.delete(`/display/${id}`),

getAreas: () => apiClient.get('/display/areas'),
};
