import axiosAdmin from '../../lib/axiosAdmin';

const adminContentService = {
  getAll: () => axiosAdmin.get('/api/contents'),
  getById: (id) => axiosAdmin.get(`/api/contents/${id}`),
  getBySlug: (slug) => axiosAdmin.get(`/api/contents/slug/${encodeURIComponent(slug)}`),
  getByType: (type) => axiosAdmin.get('/api/contents/type', { params: { type } }),
  getByStatus: (status) => axiosAdmin.get('/api/contents/status', { params: { status } }),
  search: (keyword) => axiosAdmin.get('/api/contents/search', { params: { keyword } }),
  create: (data) => axiosAdmin.post('/api/contents', data),
  update: (id, data) => axiosAdmin.put(`/api/contents/${id}`, data),
  updateStatus: (id, status) => axiosAdmin.patch(`/api/contents/${id}/status`, { status }),
  delete: (id) => axiosAdmin.delete(`/api/contents/${id}`),
};

export default adminContentService;
