import axiosAdmin from '../../lib/axiosAdmin';

const adminImageService = {
  getAll: () => axiosAdmin.get('/api/images'),
  getById: (id) => axiosAdmin.get(`/api/images/${id}`),
  getByImageable: (type, id) => axiosAdmin.get('/api/images/imageable', { params: { type, id } }),
  getPrimary: (type, id) => axiosAdmin.get('/api/images/primary', { params: { type, id } }),
  create: (data) => axiosAdmin.post('/api/images', data),
  update: (id, data) => axiosAdmin.put(`/api/images/${id}`, data),
  setPrimary: (id) => axiosAdmin.patch(`/api/images/${id}/primary`),
  delete: (id) => axiosAdmin.delete(`/api/images/${id}`),
};

export default adminImageService;
