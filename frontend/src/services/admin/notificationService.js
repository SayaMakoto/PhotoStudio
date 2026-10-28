import axiosAdmin from '../../lib/axiosAdmin';

const adminNotificationService = {
  getAll: () => axiosAdmin.get('/api/notifications'),
  getById: (id) => axiosAdmin.get(`/api/notifications/${id}`),
  create: (data) => axiosAdmin.post('/api/notifications', data),
  update: (id, data) => axiosAdmin.put(`/api/notifications/${id}`, data),
  markAsRead: (id) => axiosAdmin.patch(`/api/notifications/${id}/read`),
  markAllAsRead: (userId) => axiosAdmin.patch(`/api/notifications/user/${userId}/read-all`),
  getByUserId: (userId) => axiosAdmin.get(`/api/notifications/user/${userId}`),
  getUnreadByUserId: (userId) => axiosAdmin.get(`/api/notifications/user/${userId}/unread`),
  getUnreadCount: (userId) => axiosAdmin.get(`/api/notifications/user/${userId}/unread/count`),
  delete: (id) => axiosAdmin.delete(`/api/notifications/${id}`),
  getByType: (type) => axiosAdmin.get('/api/notifications/type', { params: { type } }),
};

export default adminNotificationService;
