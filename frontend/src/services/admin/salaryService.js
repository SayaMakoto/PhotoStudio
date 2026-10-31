import axiosAdmin from '../../lib/axiosAdmin';

const MOCK_SALARIES = [
  {
    id: 1,
    employeeId: 1,
    userId: 2,
    employeeName: 'Nguyễn Hoàng Anh',
    employeePhone: '0912 345 671',
    employeeEmail: 'hoanganh.photo@photostudio.vn',
    position: 'photographer',
    month: 10,
    year: 2026,
    workDays: 22,
    dailyRate: 250000,
    baseSalary: 5500000,
    totalShoots: 5,
    commissionRate: 0.1,
    totalCommission: 1306000,
    bonus: 500000,
    deduction: 0,
    netSalary: 7306000,
    status: 'approved',
    note: 'Đạt chỉ tiêu KPI tháng 10 và phản hồi 5 sao từ khách hàng',
    paidAt: null,
    createdAt: '2026-10-31T08:00:00',
    commissionDetails: [
      {
        id: 1,
        salaryId: 1,
        bookingId: 1,
        packageId: 1,
        packageName: 'Gói Chụp Ảnh Cưới Luxury & Ngoại Cảnh VIP',
        packagePrice: 6390000,
        commissionRate: 0.1,
        commissionAmount: 639000,
        shootDate: '2026-10-12',
        customerName: 'Lê Minh Tuấn',
      },
      {
        id: 2,
        salaryId: 1,
        bookingId: 2,
        packageId: 2,
        packageName: 'Gói Chụp Chân Dung Nghệ Thuật Nàng Thơ',
        packagePrice: 990000,
        commissionRate: 0.1,
        commissionAmount: 99000,
        shootDate: '2026-10-15',
        customerName: 'Nguyễn Thu Trang',
      },
      {
        id: 3,
        salaryId: 1,
        bookingId: 3,
        packageId: 3,
        packageName: 'Gói Chụp Ảnh Gia Đình Vintage Ấm Cúng',
        packagePrice: 1890000,
        commissionRate: 0.1,
        commissionAmount: 189000,
        shootDate: '2026-10-20',
        customerName: 'Phạm Hoàng Long',
      },
      {
        id: 4,
        salaryId: 1,
        bookingId: 4,
        packageId: 4,
        packageName: 'Gói Chụp Ảnh Doanh Nhân & Profile VIP',
        packagePrice: 1290000,
        commissionRate: 0.1,
        commissionAmount: 129000,
        shootDate: '2026-10-25',
        customerName: 'Trần Thị Mai',
      },
      {
        id: 5,
        salaryId: 1,
        bookingId: 5,
        packageId: 5,
        packageName: 'Gói Chụp Concept Thời Trang & Lookbook',
        packagePrice: 2500000,
        commissionRate: 0.1,
        commissionAmount: 250000,
        shootDate: '2026-10-28',
        customerName: 'Đỗ Minh Quân',
      },
    ],
  },
  {
    id: 2,
    employeeId: 1,
    userId: 2,
    employeeName: 'Nguyễn Hoàng Anh',
    employeePhone: '0912 345 671',
    employeeEmail: 'hoanganh.photo@photostudio.vn',
    position: 'photographer',
    month: 9,
    year: 2026,
    workDays: 24,
    dailyRate: 250000,
    baseSalary: 6000000,
    totalShoots: 6,
    commissionRate: 0.1,
    totalCommission: 1650000,
    bonus: 300000,
    deduction: 0,
    netSalary: 7950000,
    status: 'paid',
    note: 'Đã thanh toán chuyển khoản qua VCB',
    paidAt: '2026-10-05T10:30:00',
    createdAt: '2026-09-30T18:00:00',
    commissionDetails: [
      {
        id: 10,
        salaryId: 2,
        bookingId: 20,
        packageId: 1,
        packageName: 'Gói Chụp Ảnh Cưới Luxury',
        packagePrice: 6390000,
        commissionRate: 0.1,
        commissionAmount: 639000,
        shootDate: '2026-09-10',
        customerName: 'Vũ Hải Đăng',
      },
      {
        id: 11,
        salaryId: 2,
        bookingId: 21,
        packageId: 3,
        packageName: 'Gói Chụp Ảnh Gia Đình',
        packagePrice: 1890000,
        commissionRate: 0.1,
        commissionAmount: 189000,
        shootDate: '2026-09-18',
        customerName: 'Hoàng Bích Ngọc',
      },
    ],
  },
  {
    id: 3,
    employeeId: 2,
    userId: 3,
    employeeName: 'Trần Thủy Tiên',
    employeePhone: '0912 345 672',
    employeeEmail: 'thuytien.makeup@photostudio.vn',
    position: 'makeup',
    month: 10,
    year: 2026,
    workDays: 20,
    dailyRate: 200000,
    baseSalary: 4000000,
    totalShoots: 4,
    commissionRate: 0.1,
    totalCommission: 850000,
    bonus: 200000,
    deduction: 0,
    netSalary: 5050000,
    status: 'approved',
    note: 'Chuyên viên makeup hoàn thành tốt các ca chụp',
    paidAt: null,
    createdAt: '2026-10-31T08:30:00',
    commissionDetails: [
      {
        id: 6,
        salaryId: 3,
        bookingId: 1,
        packageId: 1,
        packageName: 'Gói Chụp Ảnh Cưới Luxury',
        packagePrice: 6390000,
        commissionRate: 0.1,
        commissionAmount: 639000,
        shootDate: '2026-10-12',
        customerName: 'Lê Minh Tuấn',
      },
      {
        id: 7,
        salaryId: 3,
        bookingId: 2,
        packageId: 2,
        packageName: 'Gói Chụp Chân Dung Nàng Thơ',
        packagePrice: 990000,
        commissionRate: 0.1,
        commissionAmount: 99000,
        shootDate: '2026-10-15',
        customerName: 'Nguyễn Thu Trang',
      },
    ],
  },
];

const adminSalaryService = {
  getAll: async (month, year) => {
    try {
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;
      const res = await axiosAdmin.get('/api/salaries', { params });
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (err) {
      console.warn('API /api/salaries offline, dùng dữ liệu fallback:', err.message);
    }
    // Filter fallback mock
    return MOCK_SALARIES.filter((s) => {
      if (month && Number(s.month) !== Number(month)) return false;
      if (year && Number(s.year) !== Number(year)) return false;
      return true;
    });
  },

  getById: async (id) => {
    try {
      const res = await axiosAdmin.get(`/api/salaries/${id}`);
      if (res && res.id) return res;
    } catch {}
    return MOCK_SALARIES.find((s) => Number(s.id) === Number(id)) || null;
  },

  calculateSalaries: async (month, year) => {
    try {
      const res = await axiosAdmin.post('/api/salaries/calculate', null, {
        params: { month, year },
      });
      if (Array.isArray(res) && res.length > 0) return res;
    } catch (err) {
      console.warn('API calculate offline:', err.message);
    }
    return MOCK_SALARIES;
  },

  updateStatus: async (id, payload) => {
    try {
      const res = await axiosAdmin.patch(`/api/salaries/${id}`, payload);
      if (res && res.id) return res;
    } catch (err) {
      console.warn('API updateStatus offline:', err.message);
    }
    const found = MOCK_SALARIES.find((s) => Number(s.id) === Number(id));
    if (found) {
      Object.assign(found, payload);
      if (payload.status === 'paid' && !found.paidAt) {
        found.paidAt = new Date().toISOString();
      }
      return found;
    }
    return null;
  },

  delete: async (id) => {
    try {
      await axiosAdmin.delete(`/api/salaries/${id}`);
    } catch {}
    const idx = MOCK_SALARIES.findIndex((s) => Number(s.id) === Number(id));
    if (idx !== -1) MOCK_SALARIES.splice(idx, 1);
  },
};

export default adminSalaryService;
