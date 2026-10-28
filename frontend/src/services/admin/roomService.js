import axiosAdmin from '../../lib/axiosAdmin';

const adminRoomService = {
  getAll: () => axiosAdmin.get('/api/rooms'),
  getTrash: () => axiosAdmin.get('/api/rooms/trash'),
  getById: (id) => axiosAdmin.get(`/api/rooms/${id}`),
  create: (data) => axiosAdmin.post('/api/rooms', data),
  update: (id, data) => axiosAdmin.put(`/api/rooms/${id}`, data),
  delete: (id) => axiosAdmin.delete(`/api/rooms/${id}`),
  restore: (id) => axiosAdmin.put(`/api/rooms/trash/${id}/restore`),
  permanentlyDelete: (id) => axiosAdmin.delete(`/api/rooms/trash/${id}/permanent`),
};

export default adminRoomService;
