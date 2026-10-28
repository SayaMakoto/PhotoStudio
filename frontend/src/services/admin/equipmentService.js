import axiosAdmin from '../../lib/axiosAdmin';

/**
 * Service quản lý Thiết bị (Admin)
 */
export const adminEquipmentService = {
  // Lấy toàn bộ danh sách thiết bị
  getAll: () => axiosAdmin.get('/api/equipments'),

  // Lấy danh sách thiết bị đã đưa vào thùng rác
  getTrash: () => axiosAdmin.get('/api/equipments/trash'),

  // Lấy chi tiết thiết bị
  getById: (id) => axiosAdmin.get(`/api/equipments/${id}`),

  // Thêm thiết bị mới
  create: (data) => axiosAdmin.post('/api/equipments', data),

  // Cập nhật thiết bị
  update: (id, data) => axiosAdmin.put(`/api/equipments/${id}`, data),

  // Xóa thiết bị
  delete: (id) => axiosAdmin.delete(`/api/equipments/${id}`),

  // Khôi phục thiết bị khỏi thùng rác
  restore: (id) => axiosAdmin.put(`/api/equipments/trash/${id}/restore`),

  // Xóa vĩnh viễn thiết bị khỏi cơ sở dữ liệu
  permanentlyDelete: (id) =>
    axiosAdmin.delete(`/api/equipments/trash/${id}/permanent`),
};

export default adminEquipmentService;
