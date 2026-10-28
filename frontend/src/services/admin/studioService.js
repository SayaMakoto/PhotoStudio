import axiosAdmin from '../../lib/axiosAdmin';

const adminStudioService = {
  getAll: () => axiosAdmin.get('/api/services'),
  getTrash: () => axiosAdmin.get('/api/services/trash'),
  getById: (id) => axiosAdmin.get(`/api/services/${id}`),
  create: (data) => axiosAdmin.post('/api/services', data),
  update: (id, data) => axiosAdmin.put(`/api/services/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/api/services/${id}`),
  restore: (id) => axiosAdmin.put(`/api/services/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/services/trash/${id}/permanent`),
};

export default adminStudioService;
