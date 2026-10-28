import axiosAdmin from '../../lib/axiosAdmin';

/** API đọc đánh giá nhân viên và endpoint riêng cho phản hồi của admin. */
const adminEmployeeReviewService = {
  getAll: () => axiosAdmin.get('/api/employee-reviews'),
  getById: (id) => axiosAdmin.get(`/api/employee-reviews/${id}`),
  reply: (id, reply) => axiosAdmin.patch(`/api/employee-reviews/${id}/reply`, { reply }),
};

export default adminEmployeeReviewService;
