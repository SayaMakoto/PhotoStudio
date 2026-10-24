import axiosEmployee from '../../lib/axiosEmployee';

/**
 * Service kiểm tra thiết bị và báo cáo sự cố dành cho Nhân viên
 */
export const employeeEquipmentService = {
  // Xem danh sách thiết bị và trạng thái sẵn sàng
  getEquipments: () => axiosEmployee.get('/api/equipments'),

  // Gửi báo cáo sự cố thiết bị (hỏng, lỗi, cần bảo dưỡng)
  reportIncident: (data) => axiosEmployee.post('/api/incidents/report', data),
};

export default employeeEquipmentService;
