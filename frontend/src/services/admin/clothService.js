import axiosAdmin from '../../lib/axiosAdmin';

const adminClothService = {
  getAll: () => axiosAdmin.get('/api/clothes'),
  getTrash: () => axiosAdmin.get('/api/clothes/trash'),
  getById: (id) => axiosAdmin.get(`/api/clothes/${id}`),
  create: (data) => axiosAdmin.post('/api/clothes', data),
  update: (id, data) => axiosAdmin.put(`/api/clothes/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/api/clothes/${id}`),
  restore: (id) => axiosAdmin.put(`/api/clothes/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/clothes/trash/${id}/permanent`),
};

export default adminClothService;
