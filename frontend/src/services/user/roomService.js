import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service xem Phòng Studio dành cho Khách hàng
 */
export const customerRoomService = {
  // Xem danh sách các phòng studio khả dụng
  getAllRooms: () => axiosCustomer.get('/api/rooms'),

  // Xem chi tiết một phòng studio
  getRoomById: (id) => axiosCustomer.get(`/api/rooms/${id}`),
};

export default customerRoomService;
