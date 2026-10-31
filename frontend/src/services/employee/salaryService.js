import axiosAdmin from '../../lib/axiosAdmin';
import adminSalaryService from '../admin/salaryService';

const employeeSalaryService = {
  getMySalaries: async (userId, employeeId) => {
    try {
      if (userId) {
        const res = await axiosAdmin.get(`/api/salaries/user/${userId}`);
        if (Array.isArray(res) && res.length > 0) return res;
      }
      if (employeeId) {
        const res = await axiosAdmin.get(`/api/salaries/employee/${employeeId}`);
        if (Array.isArray(res) && res.length > 0) return res;
      }
    } catch (err) {
      console.warn('API getMySalaries offline, lấy từ mock:', err.message);
    }
    const all = await adminSalaryService.getAll();
    return all.filter(
      (s) =>
        (userId && Number(s.userId) === Number(userId)) ||
        (employeeId && Number(s.employeeId) === Number(employeeId)) ||
        Number(s.employeeId) === 1
    );
  },
};

export default employeeSalaryService;
