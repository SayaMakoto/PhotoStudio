import axiosEmployee from '../../lib/axiosEmployee';

const employeeMediaUploadService = {
  uploadImage: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosEmployee.post('/api/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
};

export default employeeMediaUploadService;
