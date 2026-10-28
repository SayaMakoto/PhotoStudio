import axiosAdmin from '../../lib/axiosAdmin';

const adminBackgroundService = {
  getAll: () => axiosAdmin.get('/api/backgrounds'),
  getTrash: () => axiosAdmin.get('/api/backgrounds/trash'),
  getById: (id) => axiosAdmin.get(`/api/backgrounds/${id}`),
  create: (data) => axiosAdmin.post('/api/backgrounds', data),
  update: (id, data) => axiosAdmin.put(`/api/backgrounds/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/api/backgrounds/${id}`),
  restore: (id) => axiosAdmin.put(`/api/backgrounds/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/backgrounds/trash/${id}/permanent`),
};

export default adminBackgroundService;
