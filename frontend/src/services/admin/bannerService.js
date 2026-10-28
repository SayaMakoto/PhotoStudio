import axiosAdmin from '../../lib/axiosAdmin';

const adminBannerService = {
  getAll: () => axiosAdmin.get('/api/banners'),
  getById: (id) => axiosAdmin.get(`/api/banners/${id}`),
  create: (data) => axiosAdmin.post('/api/banners', data),
  update: (id, data) => axiosAdmin.put(`/api/banners/${id}`, data),
  updateStatus: (id, status) => axiosAdmin.patch(`/api/banners/${id}/status`, { status }),
  delete: (id) => axiosAdmin.delete(`/api/banners/${id}`),
};

export default adminBannerService;
