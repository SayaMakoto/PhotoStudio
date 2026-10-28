import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Gói chụp (Admin)
 */
export const adminPackageService = {
  // Lấy toàn bộ gói chụp
  getAll: () => axiosAdmin.get('/api/packages'),
  getTrash: () => axiosAdmin.get('/api/packages/trash'),

  // Lấy chi tiết gói chụp
  getById: (id) => axiosAdmin.get(`/api/packages/${id}`),

  // Tạo mới gói chụp
  create: (data) => axiosAdmin.post('/api/packages', data),

  // Cập nhật gói chụp
  update: (id, data) => axiosAdmin.put(`/api/packages/${id}`, data),

  // Xóa gói chụp
  delete: (id) => axiosAdmin.delete(`/api/packages/${id}`),
  restore: (id) => axiosAdmin.put(`/api/packages/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/packages/trash/${id}/permanent`),
  getServiceCatalog: () => axiosAdmin.get('/api/services'),
  getBackgroundCatalog: () => axiosAdmin.get('/api/backgrounds'),
  getPackageServices: (packageId) => axiosAdmin.get(`/api/package-services/package/${packageId}`),
  addPackageService: (data) => axiosAdmin.post('/api/package-services', data),
  updatePackageService: (id, data) => axiosAdmin.put(`/api/package-services/${id}`, data),
  removePackageService: (id) => axiosAdmin.delete(`/api/package-services/${id}`),
  getPackageBackgrounds: (packageId) => axiosAdmin.get(`/api/package-backgrounds/package/${packageId}`),
  addPackageBackground: (data) => axiosAdmin.post('/api/package-backgrounds', data),
  removePackageBackground: (id) => axiosAdmin.delete(`/api/package-backgrounds/${id}`),
};

export default adminPackageService;
