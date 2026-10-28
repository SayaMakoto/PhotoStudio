import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service lấy danh sách Thiết bị Studio cho Khách hàng
 */
export const customerEquipmentService = {
  // Lấy toàn bộ danh sách thiết bị
  getAllEquipments: () => axiosCustomer.get('/api/equipments'),

  // Lấy chi tiết thiết bị theo ID
  getEquipmentById: (id) => axiosCustomer.get(`/api/equipments/${id}`),
};

export default customerEquipmentService;
