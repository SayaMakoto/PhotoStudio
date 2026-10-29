import axiosCustomer from '../../lib/axiosCustomer';

/**
 * Service gửi liên hệ và yêu cầu tư vấn concept từ Khách hàng vào CSDL
 */
export const customerContactService = {
  // Gửi liên hệ mới vào bảng contacts trong CSDL
  sendContact: async (data) => {
    try {
      const response = await axiosCustomer.post('/api/contacts', data);
      return response.data || response;
    } catch (err) {
      // Lưu phòng hờ vào localStorage nếu backend đang ngoại tuyến
      const savedContacts = JSON.parse(localStorage.getItem('photostudio_offline_contacts') || '[]');
      savedContacts.unshift({
        ...data,
        id: Date.now(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('photostudio_offline_contacts', JSON.stringify(savedContacts));
      return { success: true, offline: true, ...data };
    }
  },

  // Lấy danh sách liên hệ
  getAllContacts: async () => {
    try {
      const response = await axiosCustomer.get('/api/contacts');
      return response.data || response;
    } catch {
      return JSON.parse(localStorage.getItem('photostudio_offline_contacts') || '[]');
    }
  },
};

export default customerContactService;
