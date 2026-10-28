import axiosAdmin from '../../lib/axiosAdmin';

/** API đọc đánh giá và API riêng cho phản hồi của admin. */
const adminReviewService = {
  getAll: () => axiosAdmin.get('/api/reviews'),
  getById: (id) => axiosAdmin.get(`/api/reviews/${id}`),
  reply: (id, reply) => axiosAdmin.patch(`/api/reviews/${id}/reply`, { reply }),
};

export default adminReviewService;
