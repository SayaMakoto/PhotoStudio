import axiosAdmin from '../../lib/axiosAdmin';

const adminImageService = {
  getAll: () => axiosAdmin.get('/api/images'),
  getById: (id) => axiosAdmin.get(`/api/images/${id}`),
  getByImageable: (type, id) => axiosAdmin.get('/api/images/imageable', { params: { type, id } }),
  getPrimary: (type, id) => axiosAdmin.get('/api/images/primary', { params: { type, id } }),
  create: (data) => axiosAdmin.post('/api/images', data),
  update: (id, data) => axiosAdmin.put(`/api/images/${id}`, data),
  setPrimary: (id) => axiosAdmin.patch(`/api/images/${id}/primary`),
  delete: (id) => axiosAdmin.delete(`/api/images/${id}`),
  savePrimaryImage: async (imageableType, imageableId, imageUrl, description = '') => {
    const linkedImages = await axiosAdmin.get('/api/images/imageable', {
      params: { type: imageableType, id: imageableId },
    });
    const imageList = Array.isArray(linkedImages) ? linkedImages : [];
    const primary = imageList.find((image) => image.isPrimary);

    if (!imageUrl) {
      if (primary) await axiosAdmin.delete(`/api/images/${primary.id}`);
      return null;
    }

    const payload = { imageableType, imageableId, imageUrl, description: description || null, isPrimary: true };
    const existing = primary || imageList.find((image) => image.imageUrl === imageUrl);
    return existing
      ? axiosAdmin.put(`/api/images/${existing.id}`, payload)
      : axiosAdmin.post('/api/images', payload);
  },
};

export default adminImageService;
