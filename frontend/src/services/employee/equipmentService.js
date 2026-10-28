import axiosEmployee from '../../lib/axiosEmployee';

/**
 * Service quản lý thiết bị kết nối trực tiếp CSDL thật (Bảng `equipments`)
 */
export const employeeEquipmentService = {
  // Lấy toàn bộ danh sách thiết bị từ CSDL thật
  getAll: () => axiosEmployee.get('/api/equipments'),

  // Xem chi tiết một thiết bị
  getById: (id) => axiosEmployee.get(`/api/equipments/${id}`),
};

export default employeeEquipmentService;
