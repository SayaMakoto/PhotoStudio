import axiosAdmin from '../../lib/axiosAdmin';

const adminAccessoryService = {
  getAll: () => axiosAdmin.get('/api/accessories'),
  getTrash: () => axiosAdmin.get('/api/accessories/trash'),
  getById: (id) => axiosAdmin.get(`/api/accessories/${id}`),
  create: (data) => axiosAdmin.post('/api/accessories', data),
  update: (id, data) => axiosAdmin.put(`/api/accessories/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/api/accessories/${id}`),
  restore: (id) => axiosAdmin.put(`/api/accessories/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/accessories/trash/${id}/permanent`),
};

export default adminAccessoryService;
