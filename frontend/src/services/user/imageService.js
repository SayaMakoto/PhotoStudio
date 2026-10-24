import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service lấy Ảnh Gallery & Bộ sưu tập dành cho Khách hàng
 */
export const userImageService = {
  // Lấy toàn bộ ảnh bộ sưu tập
  getAllImages: () => axiosCustomer.get('/api/images'),

  // Lấy ảnh theo loại entity
  getImagesByType: (type, id) => axiosCustomer.get(`/api/images/imageable?type=${type}&id=${id}`),

  // Lấy ảnh đại diện chính
  getPrimaryImage: (type, id) => axiosCustomer.get(`/api/images/primary?type=${type}&id=${id}`),
};

export default userImageService;
