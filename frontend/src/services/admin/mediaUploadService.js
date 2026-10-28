import axiosAdmin from '../../lib/axiosAdmin';

const adminMediaUploadService = {
  uploadImage: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosAdmin.post('/api/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
};

export default adminMediaUploadService;
