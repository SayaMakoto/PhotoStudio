// Mock static data for Employee Portal
export const EMPLOYEE_PROFILE = {
  id: 'EMP-088',
  name: 'Trần Minh Đức',
  role: 'Lead Photographer & Retoucher',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  department: 'Tổ Nhiếp Ảnh & Nghệ Thuật',
  phone: '0988 776 543',
  email: 'duc.photographer@photostudio.vn',
  status: 'Đang ca trực (Studio B)',
  level: 'Senior Photographer (Level 4)',
  joinedDate: '15/03/2023',
  totalShoots: 428,
  avgRating: 4.95,
};

export const EMPLOYEE_KPIS = {
  shiftsThisMonth: 28,
  targetShifts: 32,
  completedBookings: 24,
  targetBookings: 26,
  commission: 14850000, // VNĐ
  baseSalary: 12000000,
  bonusEstimate: 3500000,
  ratingScore: 4.95,
  ratingTotalCount: 142,
  unreadNotifications: 3,
};

export const BOOKING_ASSIGNMENTS = [
  {
    id: 'BK-2026-1042',
    customerName: 'Nguyễn Thúy Hằng & Hoàng Nam',
    phone: '0912 345 678',
    email: 'thuyhang.wedding@gmail.com',
    packageName: 'Gói Cưới Premium Hàn Quốc',
    room: 'Phòng Studio B (Concept Hoa Cưới & Neon)',
    background: 'Hàn Quốc Lãng Mạn + Pastel Light',
    date: '2026-10-10',
    time: '14:30 - 17:30',
    status: 'in_progress', // upcoming, in_progress, retouched, delivered
    deadline: '2026-10-15 18:00',
    deliveryLink: 'https://drive.photostudio.vn/shares/BK-1042-raw-retouch',
    note: 'Cô dâu thích tông màu da sáng hồng tự nhiên, góc mặt nghiêng bên trái. Chú rể thích phong cách lịch lãm, tối giản.',
    colleagues: [
      { name: 'Ngọc Mai', role: 'Makeup Artist', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
      { name: 'Lê Tuấn', role: 'Lighting Assistant', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' }
    ],
    equipments: ['Sony A7IV', 'Sony FE 50mm f/1.2 GM', 'Godox AD600Pro', 'Nanlite Pavotube II 30X'],
    clothes: ['Váy cưới xòe công chúa mẫu 2026', 'Vest đen Tuxedo Slimfit'],
    accessories: ['Vương miện pha lê', 'Hoa cưới cầm tay hoa tulip trắng'],
    checklist: [
      { task: 'Check pin và thẻ nhớ 128GB', done: true },
      { task: 'Test ánh sáng Godox AD600Pro Studio B', done: true },
      { task: 'Xác nhận trang phục với bạn Makeup', done: true },
      { task: 'Backup file RAW vào Server lưu trữ', done: false },
      { task: 'Gửi 30 file chọn lọc cho khách chấm', done: false },
    ]
  },
  {
    id: 'BK-2026-1045',
    customerName: 'Phạm Thu Trang',
    phone: '0977 123 456',
    email: 'trang.pham22@outlook.com',
    packageName: 'Gói Chân Dung Nghệ Thuật Nàng Thơ',
    room: 'Phòng VIP Lounge (Ánh Sáng Tự Nhiên)',
    background: 'Concept Vintage Hoa Khô & Ánh Nắng Chiều',
    date: '2026-10-10',
    time: '18:00 - 20:00',
    status: 'upcoming',
    deadline: '2026-10-13 12:00',
    deliveryLink: '',
    note: 'Khách chụp kỷ niệm sinh nhật tuổi 25, muốn phong cách nhẹ nhàng, thơ mộng pha chút cổ điển châu Âu.',
    colleagues: [
      { name: 'Khánh Linh', role: 'Makeup Artist', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' }
    ],
    equipments: ['Canon EOS R5', 'Canon RF 85mm f/1.2L', 'Softbox Bát Giác 120cm'],
    clothes: ['Váy lụa tơ tằm cổ điển phong cách Pháp'],
    accessories: ['Găng tay ren vintage', 'Sách báo cổ & nến thơm'],
    checklist: [
      { task: 'Vệ sinh lens Canon 85mm', done: true },
      { task: 'Set up bối cảnh rèm ren & bình gốm hoa', done: false },
      { task: 'Đón tiếp khách và trao đổi moodboard', done: false },
    ]
  },
  {
    id: 'BK-2026-1038',
    customerName: 'Gia Đình Anh Vũ & Chị Lan',
    phone: '0903 888 999',
    email: 'vu.hoang@vietcorp.com',
    packageName: 'Gói Gia Đình Hạnh Phúc 4 Thành Viên',
    room: 'Phòng Studio A (Không Gian Gia Đình)',
    background: 'Phòng Khách Ấm Cúng Scandinavian',
    date: '2026-10-09',
    time: '09:00 - 11:30',
    status: 'retouched',
    deadline: '2026-10-12 17:00',
    deliveryLink: 'https://drive.photostudio.vn/shares/BK-1038-final-retouch',
    note: 'Có 2 bé nhỏ (3 tuổi & 6 tuổi). Cần tạo không khí vui nhộn, chụp bắt khoảnh khắc tự nhiên của các con.',
    colleagues: [
      { name: 'Bảo Trâm', role: 'Stylist & Kid Support', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' }
    ],
    equipments: ['Sony A7IV', 'Sony FE 24-70mm f/2.8 GM II'],
    clothes: ['Set áo thun & sơ mi đồng điệu gia đình màu be'],
    accessories: ['Đồ chơi gấu bông', 'Bóng bay pastel'],
    checklist: [
      { task: 'Chụp xong 250 shot RAW', done: true },
      { task: 'Khách đã duyệt chọn 20 ảnh in album', done: true },
      { task: 'Hoàn thiện chỉnh sửa da và màu sắc', done: true },
      { task: 'Gửi link file hoàn chỉnh', done: true },
    ]
  },
  {
    id: 'BK-2026-1029',
    customerName: 'Doanh Nhân Quốc Bảo',
    phone: '0938 667 788',
    email: 'bao.ceo@innovatetech.io',
    packageName: 'Gói Doanh Nhân & Profile Thương Hiệu',
    room: 'Phòng Studio C (High-End Dark Studio)',
    background: 'Phông xám xi măng & Đèn Viền Cyber Rimlight',
    date: '2026-10-08',
    time: '14:00 - 16:00',
    status: 'delivered',
    deadline: '2026-10-10 12:00',
    deliveryLink: 'https://drive.photostudio.vn/shares/BK-1029-completed',
    note: 'Chụp ảnh phục vụ bài PR Forbes và website tập đoàn. Tone màu uy quyền, sắc cạnh, tương phản cao.',
    colleagues: [
      { name: 'Ngọc Mai', role: 'Makeup Artist', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' }
    ],
    equipments: ['Sony A7R V (61MP)', 'Sony 85mm f/1.4 GM', 'Godox QT600III'],
    clothes: ['Vest xanh Navy may đo Ý'],
    accessories: ['Đồng hồ cơ cao cấp', 'Kính mắt gọng kim loại titan'],
    checklist: [
      { task: 'Bàn giao trọn bộ ảnh đạt chuẩn in ấn', done: true },
      { task: 'Khách hàng ký biên bản nhận ảnh', done: true },
    ]
  }
];

export const EQUIPMENT_ITEMS = [
  { id: 'EQ-01', name: 'Body Sony Alpha A7IV', code: 'SN-A74-02', status: 'holding', condition: 'Hoàn hảo', category: 'Body Máy Ảnh' },
  { id: 'EQ-02', name: 'Lens Sony FE 50mm f/1.2 GM', code: 'LN-50GM-01', status: 'holding', condition: 'Mới 99%', category: 'Ống Kính' },
  { id: 'EQ-03', name: 'Lens Sony FE 24-70mm f/2.8 GM II', code: 'LN-2470-03', status: 'returned', condition: 'Tốt', category: 'Ống Kính' },
  { id: 'EQ-04', name: 'Đèn Flash Studio Godox AD600Pro', code: 'FL-AD600-02', status: 'holding', condition: 'Hoạt động tốt', category: 'Thiết Bị Đèn' },
  { id: 'EQ-05', name: 'Đèn Led Nanlite Pavotube II 30X', code: 'LED-PT30-01', status: 'reported', condition: 'Chân sạc chập chờn', category: 'Đèn Led Màu' },
];

export const CUSTOMER_REVIEWS = [
  {
    id: 'RV-901',
    customerName: 'Nguyễn Thúy Hằng',
    bookingId: 'BK-2026-1042',
    rating: 5,
    date: '10/10/2026',
    comment: 'Anh Đức hướng dẫn tạo dáng cực kỳ tận tâm và có tâm! Hai vợ chồng mình ngại trước ống kính mà ảnh chụp góc nào cũng như poster điện ảnh. Rất ưng ý!',
    reply: 'Cảm ơn Hằng & Nam! Chúc hai bạn trăm năm hạnh phúc!',
    tag: 'Chụp cưới'
  },
  {
    id: 'RV-894',
    customerName: 'Anh Quốc Bảo',
    bookingId: 'BK-2026-1029',
    rating: 5,
    date: '09/10/2026',
    comment: 'Tác phong rất chuyên nghiệp, đúng giờ và hiểu rõ góc sáng cho ảnh doanh nhân. Tấm ảnh bìa profile mình nhận được rất nhiều lời khen.',
    tag: 'Profile Doanh nhân'
  },
  {
    id: 'RV-882',
    customerName: 'Chị Lan & Anh Vũ',
    bookingId: 'BK-2026-1038',
    rating: 4.8,
    date: '08/10/2026',
    comment: 'Ekip kiên nhẫn với các bé nhỏ, màu ảnh ấm áp gia đình đúng gu. Sẽ quay lại chụp kỷ niệm hàng năm.',
    tag: 'Gia đình'
  }
];

export const ADMIN_NOTIFICATIONS = [
  {
    id: 'NOTI-01',
    sender: 'Admin Quản Trị',
    title: 'Phân công ca chụp VIP: BK-2026-1045',
    content: 'Bạn đã được chỉ định phụ trách buổi chụp Chân Dung Nàng Thơ cho khách hàng Thu Trang lúc 18:00 chiều nay tại VIP Lounge.',
    time: '10 phút trước',
    unread: true,
    type: 'assignment'
  },
  {
    id: 'NOTI-02',
    sender: 'Bộ Phận Kỹ Thuật',
    title: 'Xác nhận kiểm định thiết bị định kỳ',
    content: 'Nhắc nhở nộp lại Lens 24-70mm trước 20:00 tối nay để kỹ thuật bảo dưỡng lớp tráng phủ thấu kính.',
    time: '2 giờ trước',
    unread: true,
    type: 'alert'
  },
  {
    id: 'NOTI-03',
    sender: 'Kế Toán Studio',
    title: 'Thưởng hoa hồng ca chụp xuất sắc tháng 9',
    content: 'Doanh số hoa hồng cá nhân tháng 9 đạt chỉ tiêu mốc thưởng Top 3 nhiếp ảnh gia.',
    time: '1 ngày trước',
    unread: false,
    type: 'finance'
  }
];

export const CONCEPTS_PRESETS = [
  {
    id: 'CP-01',
    title: 'Tone Màu Nàng Thơ Pastel Hàn Quốc',
    category: 'Preset Lightroom',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    description: 'Tone da trong trẻo mịn màng, làm dịu sắc đỏ, ánh sáng mềm tự nhiên.',
    downloads: 148,
    presetFile: 'Studio_Korean_Pastel_2026.xmp'
  },
  {
    id: 'CP-02',
    title: 'Concept Moodboard Cưới Cinematic Film',
    category: 'Moodboard Tạo Dáng',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    description: 'Hướng dẫn góc máy điện ảnh 35mm, ánh sáng ngược nắng hoàng hôn.',
    downloads: 230,
    presetFile: 'Wedding_Cinematic_35mm_Mood.pdf'
  },
  {
    id: 'CP-03',
    title: 'Profile Doanh Nhân Monochrome & Rimlight',
    category: 'Lighting Diagram',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    description: 'Sơ đồ set up 3 đèn: Key light Grid 45 độ, Rim light sau lưng, Kicker tạo khối.',
    downloads: 95,
    presetFile: 'CEO_Lighting_Diagram.pdf'
  }
];

export const BOOKING_MESSAGES = {
  'BK-2026-1042': [
    { sender: 'Admin', role: 'Quản trị viên', text: 'Đức nhớ kiểm tra trước bối cảnh Neon Studio B nhé, khách muốn chụp thêm 1 outfit cá tính.', time: '13:40', isMe: false },
    { sender: 'Ngọc Mai', role: 'Makeup Artist', text: 'Mình đang làm tóc xoăn sóng nhẹ cho cô dâu rồi nhé, tầm 14:30 là vào set chụp chuẩn giờ!', time: '14:05', isMe: false },
    { sender: 'Trần Minh Đức', role: 'Photographer', text: 'Đã sẵn sàng! Đèn và thẻ nhớ đã test ok hết.', time: '14:15', isMe: true },
  ]
};
