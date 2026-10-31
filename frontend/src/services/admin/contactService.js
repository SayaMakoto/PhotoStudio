import axiosAdmin from '../../lib/axiosAdmin';

const adminContactService = {
  getAll: () => axiosAdmin.get('/api/contacts'),
  getById: (id) => axiosAdmin.get(`/api/contacts/${id}`),
  updateStatus: (id, status, replyMessage) =>
    axiosAdmin.patch(`/api/contacts/${id}`, { status, replyMessage }),
  delete: (id) => axiosAdmin.delete(`/api/contacts/${id}`),
};

export default adminContactService;
