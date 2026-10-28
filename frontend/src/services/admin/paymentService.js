import axiosAdmin from '../../lib/axiosAdmin';

/** API chỉ đọc dành cho trang lịch sử thanh toán trong admin. */
const adminPaymentService = {
  getAll: () => axiosAdmin.get('/api/payments'),
  getById: (id) => axiosAdmin.get(`/api/payments/${id}`),
};

export default adminPaymentService;
