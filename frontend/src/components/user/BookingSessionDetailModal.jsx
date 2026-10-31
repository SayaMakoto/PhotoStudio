import { useState, useEffect } from 'react';
import { PaintBrushIcon, PhotoIcon } from '@heroicons/react/24/solid';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Camera,
  CheckCircle2,
  FileText,
  AlertCircle,
  ShieldCheck,
  Send,
  UserCheck,
  Printer,
  CreditCard,
  Receipt,
  RotateCcw,
  Ban,
  Package,
  Scissors,
} from 'lucide-react';
import { FloralCardCorner } from '../common/FloralDecorations';
import customerBookingService from '../../services/user/bookingService';
import customerReviewService from '../../services/user/reviewService';
import customerPaymentService from '../../services/user/paymentService';
import customerRoomService from '../../services/user/roomService';
import customerPackageService from '../../services/user/packageService';
import { ROUTES } from '../../routes/web';
import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xác nhận',
    badge: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  },
  confirmed: {
    label: 'Đã xác nhận',
    badge: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
  },
  in_progress: {
    label: 'Đang chụp',
    badge: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
  },
  completed: {
    label: 'Đã hoàn thành',
    badge: 'bg-[#EBF8F2] text-[#2EA46D] border-[#B4E8D0]',
  },
  cancelled: {
    label: 'Đã hủy',
    badge: 'bg-[#FFF2F4] text-[#E53E3E] border-[#FCD5DC]',
  },
};

export default function BookingSessionDetailModal({
  booking,
  isOpen,
  onClose,
  currentUser,
  onReviewSubmitted,
  onBookingCancelled,
}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [existingReview, setExistingReview] = useState(booking?.review || null);
  const [roomDetail, setRoomDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [payments, setPayments] = useState([]);
  const [cancelling, setCancelling] = useState(false);

  // Form đánh giá
  const [overallRating, setOverallRating] = useState(5);
  const [overallComment, setOverallComment] = useState('');
  const [employeeFeedback, setEmployeeFeedback] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !booking) return undefined;
    let isMounted = true;
    setLoading(true);
    setSubmitError('');
    setSubmitSuccess(false);

    const loadAllDetails = async () => {
      try {
        // 1. Ekip nhân viên
        let staffList = [];
        try {
          const empRes = await customerBookingService.getAssignedEmployees(booking.id);
          if (Array.isArray(empRes) && empRes.length > 0) {
            staffList = empRes.map((emp) => ({
              id: emp.id,
              employeeId: emp.employeeId,
              employeeName: emp.employeeName,
              position: emp.position || 'Nhiếp ảnh gia chính (Photographer)',
              employeePhone: emp.employeePhone || '0912 345 671',
              email: emp.email || 'photographer@photostudio.vn',
              avatar: emp.position?.toLowerCase().includes('makeup')
                ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            }));
          }
        } catch {}

        if (!staffList.length) {
          try {
            const allEmps = await customerBookingService.getAllEmployees();
            if (Array.isArray(allEmps) && allEmps.length > 0) {
              staffList = allEmps.slice(0, 2).map((emp) => ({
                id: emp.id,
                employeeId: emp.id,
                employeeName: emp.fullname,
                position: emp.position === 'photographer'
                  ? 'Nhiếp ảnh gia chính (Photographer)'
                  : emp.position === 'makeup'
                  ? 'Chuyên viên Trang điểm & Làm tóc (Makeup Artist)'
                  : emp.position,
                employeePhone: emp.phone || '0901 234 567',
                email: emp.email || `${emp.username || 'staff'}@photostudio.vn`,
                avatar: emp.avatar || (emp.position === 'makeup'
                  ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
              }));
            }
          } catch {}
        }

        if (!staffList.length) {
          staffList = [
            {
              id: 1,
              employeeId: 1,
              employeeName: 'Nguyễn Hoàng Anh',
              position: 'Nhiếp ảnh gia chính (Photographer)',
              employeePhone: '0912 345 671',
              email: 'hoanganh.photo@photostudio.vn',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            },
            {
              id: 2,
              employeeId: 2,
              employeeName: 'Trần Thủy Tiên',
              position: 'Chuyên viên Trang điểm & Làm tóc (Makeup)',
              employeePhone: '0912 345 672',
              email: 'thuytien.makeup@photostudio.vn',
              avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
            },
          ];
        }

        // 2. Chi tiết phòng chụp
        if (booking.roomId) {
          try {
            const rRes = await customerRoomService.getRoomById(booking.roomId);
            if (rRes && isMounted) setRoomDetail(rRes);
          } catch {}
        }

        // 3. Chi tiết gói chụp
        let loadedPkg = null;
        try {
          const bpRes = await customerBookingService.getBookingPackages(booking.id);
          if (Array.isArray(bpRes) && bpRes.length > 0) {
            loadedPkg = bpRes[0];
          }
        } catch {}

        if (!loadedPkg && booking.packageId) {
          try {
            const pRes = await customerPackageService.getPackageById(booking.packageId);
            if (pRes) {
              loadedPkg = {
                packageId: pRes.id,
                packageName: pRes.name,
                unitPrice: pRes.price,
                quantity: 1,
                subTotal: pRes.price,
                image: pRes.thumbnail || pRes.coverImage,
                description: pRes.description,
                services: pRes.includedServices || ['Chụp ảnh nghệ thuật 100+ files', 'Trang điểm & làm tóc 1 layout', 'In 10 ảnh lụa cao cấp'],
                clothes: pRes.clothes || '02 bộ trang phục cao cấp tự chọn',
                accessories: pRes.accessories || 'Trọn bộ phụ kiện cao cấp tại studio',
              };
            }
          } catch {}
        }

        // 4. Lịch sử thanh toán
        let loadedPayments = [];
        try {
          const payRes = await customerPaymentService.getPaymentsByBookingId(booking.id);
          if (Array.isArray(payRes) && payRes.length > 0) {
            loadedPayments = payRes;
          }
        } catch {}

        // Repair old booking-package rows that stored the deposit as the package price.
        const depositPayment = loadedPayments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
        const linkedPackageId = loadedPkg?.packageId || booking.packageId;
        const linkedPackageTotal = Number(loadedPkg?.subTotal)
          || Number(loadedPkg?.unitPrice) * Number(loadedPkg?.quantity || 1)
          || 0;
        if (depositPayment && linkedPackageId && Math.abs(linkedPackageTotal - Number(depositPayment.amount || 0)) < 1) {
          const depositRate = depositPayment.status.toLowerCase() === 'deposit_50' ? 0.5 : 0.3;
          const correctedUnitPrice = Number(depositPayment.amount || 0) / depositRate;
          if (correctedUnitPrice > linkedPackageTotal && loadedPkg) {
            loadedPkg = {
              ...loadedPkg,
              unitPrice: correctedUnitPrice / Number(loadedPkg.quantity || 1),
              subTotal: correctedUnitPrice,
            };
          }
        }

        // 5. Đánh giá
        let reviewData = booking.review || null;
        try {
          const revRes = await customerBookingService.getBookingReview(booking.id);
          if (revRes && revRes.id) {
            reviewData = revRes;
            try {
              const empRevs = await customerReviewService.getEmployeeReviewsByReviewId(revRes.id);
              if (Array.isArray(empRevs) && empRevs.length > 0) {
                reviewData.employeeReviews = empRevs;
              }
            } catch {}
          }
        } catch {}

        if (isMounted) {
          setEmployees(staffList);
          const initialFeedback = {};
          staffList.forEach((emp) => {
            initialFeedback[emp.employeeId] = { rating: 5, comment: '' };
          });
          setEmployeeFeedback(initialFeedback);

          if (loadedPkg) setPackageDetail(loadedPkg);
          setPayments(loadedPayments);
          setExistingReview(reviewData);
        }
      } catch (err) {
        console.warn('Lỗi tải chi tiết đơn:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllDetails();
    return () => {
      isMounted = false;
    };
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  // Lấy dữ liệu đơn hàng đã lưu từ photostudio_paid_orders (nếu có)
  const cachedOrder = (() => {
    try {
      const list = JSON.parse(localStorage.getItem('photostudio_paid_orders') || '[]');
      return list.find((o) => o.id === booking.id || o.bookingId === booking.id) || null;
    } catch {
      return null;
    }
  })();

  // Dịch vụ bổ sung đã chọn
  const selectedServices = (Array.isArray(booking.services) && booking.services.length > 0)
    ? booking.services
    : (Array.isArray(booking.selectedServices) && booking.selectedServices.length > 0)
    ? booking.selectedServices
    : (Array.isArray(cachedOrder?.services) && cachedOrder.services.length > 0)
    ? cachedOrder.services
    : (Array.isArray(cachedOrder?.selectedServices) ? cachedOrder.selectedServices : []);

  const servicesTotal = Number(
    booking.servicesTotal ??
    cachedOrder?.servicesTotal ??
    selectedServices.reduce((sum, s) => sum + Number(s.price || 0), 0)
  );

  // Phụ thu phòng studio
  const roomSurcharge = Number(
    booking.roomSurcharge ??
    cachedOrder?.roomSurcharge ??
    (roomDetail?.surcharge || 0)
  );

  // Tính số đã trả trước và tổng đơn
  const successfulPaymentStatuses = ['completed', 'paid', 'deposit_30', 'deposit_50'];
  const paidAmount = payments.length > 0
    ? payments.reduce((sum, p) => sum + (successfulPaymentStatuses.includes(p.status?.toLowerCase()) ? Number(p.amount || 0) : 0), 0)
    : Number(booking.paidAmount || (['paid', 'success', 'completed'].includes(String(booking.paymentStatus || '').toLowerCase()) ? booking.totalOrderPrice || booking.totalPrice : 0) || 0);

  const packageTotal = Number(packageDetail?.subTotal)
    || Number(packageDetail?.unitPrice) * Number(packageDetail?.quantity || 1)
    || 0;
  const bookingTotal = Number(booking.totalOrderPrice || booking.finalPackagePrice || booking.totalAmount || booking.totalPrice || 0);
  const depositPayment = payments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
  const depositRate = depositPayment?.status?.toLowerCase() === 'deposit_50' ? 0.5 : 0.3;
  const depositAmount = Number(depositPayment?.amount || 0);
  const storedPriceLooksLikeDeposit = depositPayment && (
    Math.abs(bookingTotal - depositAmount) < 1 || Math.abs(packageTotal - depositAmount) < 1
  );
  const inferredOrderTotal = storedPriceLooksLikeDeposit ? depositAmount / depositRate : 0;
  const totalAmount = Number(booking.totalOrderPrice || booking.finalPackagePrice)
    || (bookingTotal > paidAmount ? bookingTotal : inferredOrderTotal || packageTotal || bookingTotal)
    || 1500000;
  const remainingAmount = Math.max(0, totalAmount - paidAmount);

  // Đơn giá gói chụp (tách riêng với phòng và dịch vụ)
  const packagePrice = Number(
    booking.packagePrice ??
    cachedOrder?.packagePrice ??
    packageDetail?.unitPrice ??
    (totalAmount >= roomSurcharge + servicesTotal ? totalAmount - roomSurcharge - servicesTotal : totalAmount)
  );
  const packageName = booking.packageName || packageDetail?.packageName || 'Gói Chụp Ảnh Studio Tiêu Chuẩn';
  const roomName = booking.roomName || roomDetail?.name || 'Phòng Studio VIP';

  const discountAmount = Number(booking.discountAmount ?? cachedOrder?.discountAmount ?? 0);

  const handlePrint = () => {
    // Tạo iframe chuyên dụng để chỉ in duy nhất nội dung hóa đơn của đơn này, hoàn toàn cách ly với trang nền
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const customerName = booking.customerName || currentUser?.fullname || currentUser?.username || 'Khách hàng';
    const customerPhone = booking.customerPhone || currentUser?.phone || 'Chưa có thông tin';
    const customerEmail = booking.customerEmail || currentUser?.email || 'Chưa có thông tin';
    const customerNote = booking.customerNote
      ? `<div style="margin-top:6px;padding:8px 10px;background:#f9fafb;border-radius:6px;border:1px solid #f3f4f6;font-size:11px;"><span style="color:#9ca3af;">Ghi chú của khách:</span> <br/><em style="color:#1f2937;">"${booking.customerNote}"</em></div>`
      : '';

    const roomName = booking.roomName || roomDetail?.name || 'Phòng Studio VIP';
    const backgroundConcept = booking.backgroundName || roomDetail?.concept || 'Tone Trầm Điện Ảnh & Hoa Đào';
    const roomDesc = roomDetail?.description || 'Phòng chụp sang trọng chuẩn Cinematic với hệ thống ánh sáng Profoto, phông nền nghệ thuật đa phong cách và góc máy sáng tạo.';

    const packageName = booking.packageName || packageDetail?.packageName || 'Gói Chụp Ảnh Studio Tiêu Chuẩn';

    const serviceInvoiceRows = selectedServices.length > 0
      ? selectedServices.map((srv) => `
        <tr>
          <td>
            <strong style="color: #111827;">Dịch vụ: ${srv.name}</strong>
            <div style="font-size: 10px; color: #9ca3af;">Dịch vụ bổ sung đã chọn</div>
          </td>
          <td style="text-align: right; font-weight: 500;">+${Number(srv.price || 0).toLocaleString('vi-VN')} đ</td>
          <td style="text-align: center; font-weight: bold;">1</td>
          <td style="text-align: right; font-weight: 800; color: #111827;">+${Number(srv.price || 0).toLocaleString('vi-VN')} đ</td>
        </tr>
      `).join('')
      : `
        <tr>
          <td>
            <strong style="color: #6b7280;">Dịch vụ bổ sung</strong>
            <div style="font-size: 10px; color: #9ca3af;">Không có dịch vụ bổ sung</div>
          </td>
          <td style="text-align: right; color: #9ca3af;">0 đ</td>
          <td style="text-align: center; color: #9ca3af;">0</td>
          <td style="text-align: right; color: #9ca3af;">0 đ</td>
        </tr>
      `;

    const staffRows = employees.length > 0 
      ? employees.map(emp => `
        <div style="padding:8px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <strong style="color:#111827;font-size:12.5px;">${emp.employeeName}</strong>
            <span style="color:#BE4B5E;font-size:11px;font-weight:600;margin-left:6px;">(${emp.position})</span>
          </div>
          <div style="font-size:11px;color:#6b7280;">
            Hotline: <strong style="color:#374151;">${emp.employeePhone || 'Đang cập nhật'}</strong>
          </div>
        </div>
      `).join('')
      : '<p style="font-size:11.5px;color:#9ca3af;font-style:italic;">Ekip nhân viên đang được Studio sắp xếp phù hợp với phong cách chụp.</p>';

    const paymentRows = payments.length > 0
      ? payments.map((p, idx) => `
        <tr>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;font-family:monospace;">#${p.id || `TXN-${idx + 1}`}</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-transform:uppercase;">${p.paymentMethod || 'VNPay'}</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;">${p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:bold;color:#111827;">${Number(p.amount || 0).toLocaleString('vi-VN')} đ</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:right;"><span style="color:#059669;font-weight:bold;font-size:11px;">${p.status?.toLowerCase() === 'deposit_30' ? 'Đã cọc 30%' : p.status?.toLowerCase() === 'deposit_50' ? 'Đã cọc 50%' : p.status?.toLowerCase() === 'pending' ? 'Đang chờ thanh toán' : 'Đã thanh toán'}</span></td>
        </tr>
      `).join('')
      : `
        <tr>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;font-family:monospace;">#TXN-INIT-${booking.id}</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;">Thanh toán tại Studio</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;">${new Date().toLocaleDateString('vi-VN')}</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:bold;color:#111827;">${paidAmount.toLocaleString('vi-VN')} đ</td>
          <td style="padding:7px 4px;border-bottom:1px solid #f3f4f6;text-align:right;"><span style="color:#6b7280;font-weight:bold;font-size:11px;">Đang chờ thanh toán</span></td>
        </tr>
      `;

    const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <title>Hóa Đơn Buổi Chụp #BK-${booking.id} - PhotoStudio</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&subset=vietnamese&display=swap" rel="stylesheet">
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
              color: #1f2937;
              background: #ffffff;
              font-size: 11.5px;
              line-height: 1.5;
              padding: 16px 20px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #BE4B5E;
              padding-bottom: 12px;
              margin-bottom: 16px;
            }
            .brand-name {
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 1px;
              color: #261A1E;
            }
            .brand-name span { color: #BE4B5E; }
            .brand-sub {
              font-size: 11px;
              color: #6b7280;
              margin-top: 2px;
            }
            .invoice-badge-title {
              display: inline-block;
              background: #FFF1F3;
              color: #BE4B5E;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              padding: 2px 8px;
              border-radius: 9999px;
              border: 1px solid #FECDD3;
              margin-top: 4px;
            }
            .meta-right {
              text-align: right;
            }
            .status-tag {
              display: inline-block;
              padding: 3px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: bold;
              border: 1px solid #E5E7EB;
              background: #F9FAFB;
              color: #374151;
              margin-bottom: 4px;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin-bottom: 12px;
            }
            .card {
              background: #FDFBFB;
              border: 1px solid #F0E4E6;
              border-radius: 8px;
              padding: 10px 12px;
              break-inside: avoid;
            }
            .card-title {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #BE4B5E;
              border-bottom: 1px solid #F0E4E6;
              padding-bottom: 5px;
              margin-bottom: 7px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
              font-size: 11px;
            }
            .row-label { color: #6b7280; }
            .row-val { font-weight: 600; color: #111827; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
              font-size: 11px;
            }
            th {
              text-align: left;
              color: #6b7280;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              border-bottom: 1px solid #E5E7EB;
              padding: 6px 4px;
            }
            td {
              padding: 6px 4px;
            }
            .package-perks {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 6px;
              margin-top: 8px;
              font-size: 10.5px;
            }
            .perk-box {
              background: #ffffff;
              border: 1px solid #F0E4E6;
              border-radius: 6px;
              padding: 6px 8px;
            }
            .perk-title {
              font-weight: 700;
              color: #BE4B5E;
              font-size: 9.5px;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            .summary-box {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 8px;
              background: #FAF5F5;
              border: 1px solid #F0E4E6;
              border-radius: 8px;
              padding: 8px 10px;
              text-align: center;
              margin-bottom: 8px;
            }
            .summary-label { font-size: 10px; color: #6b7280; }
            .summary-val { font-size: 13.5px; font-weight: 800; }
            .signatures {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              text-align: center;
              margin-top: 20px;
              padding-top: 12px;
              border-top: 1px dashed #E5E7EB;
              break-inside: avoid;
            }
            .sig-title {
              font-weight: 700;
              text-transform: uppercase;
              font-size: 11px;
              color: #111827;
            }
            .sig-sub {
              font-size: 10px;
              color: #9ca3af;
              font-style: italic;
              margin-top: 2px;
            }
            .sig-space {
              height: 50px;
            }
            .footer-note {
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
              margin-top: 14px;
              border-top: 1px solid #F3F4F6;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <!-- HEADER HÓA ĐƠN -->
          <div class="header">
            <div>
              <div class="brand-name">PHOTO<span>STUDIO</span></div>
              <div class="brand-sub">Hệ Thống Studio Chụp Ảnh Nghệ Thuật & Concept Chuyên Nghiệp</div>
              <div class="invoice-badge-title">PHIẾU HÓA ĐƠN BUỔI CHỤP</div>
            </div>
            <div class="meta-right">
              <div><span class="status-tag">${statusInfo.label}</span></div>
              <div style="font-size: 13px; font-weight: 700; color: #111827;">Mã đơn: #BK-${booking.id}</div>
              <div style="font-size: 10.5px; color: #6b7280; margin-top: 2px;">Ngày in: ${new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>

          <!-- 1. KHÁCH HÀNG & LỊCH CHỤP -->
          <div class="grid-2">
            <div class="card">
              <div class="card-title">Thông Tin Khách Hàng</div>
              <div class="row"><span class="row-label">Họ và tên:</span><span class="row-val">${customerName}</span></div>
              <div class="row"><span class="row-label">Số điện thoại:</span><span class="row-val">${customerPhone}</span></div>
              <div class="row"><span class="row-label">Email:</span><span class="row-val">${customerEmail}</span></div>
              ${customerNote}
            </div>
            <div class="card">
              <div class="card-title">Thời Gian Ca Chụp</div>
              <div class="row"><span class="row-label">Ngày chụp:</span><span class="row-val">${formattedFullDate}</span></div>
              <div class="row"><span class="row-label">Khung giờ:</span><span class="row-val">${booking.startTime || '08:30'} – ${booking.endTime || '10:30'}</span></div>
              <div class="row"><span class="row-label">Thời lượng:</span><span class="row-val">120 phút (tiêu chuẩn)</span></div>
            </div>
          </div>

          <!-- 2. KHÔNG GIAN STUDIO & BỐI CẢNH -->
          <div class="card" style="margin-bottom: 12px;">
            <div class="card-title">Không Gian Studio & Bối Cảnh</div>
            <div class="row"><span class="row-label">Phòng chụp:</span><span class="row-val">${roomName}</span></div>
            <div class="row"><span class="row-label">Bối cảnh concept:</span><span class="row-val" style="color:#BE4B5E;">${backgroundConcept}</span></div>
            <div style="font-size: 10.5px; color: #6b7280; margin-top: 3px; line-height: 1.4;">${roomDesc}</div>
          </div>

          <!-- 3. BẢNG KÊ CHI PHÍ & DỊCH VỤ BUỔI CHỤP -->
          <div class="card" style="margin-bottom: 12px;">
            <div class="card-title">Bảng Kê Chi Phí & Dịch Vụ Buổi Chụp</div>
            <table>
              <thead>
                <tr>
                  <th>Khoản mục / Dịch vụ</th>
                  <th style="text-align: right;">Đơn giá</th>
                  <th style="text-align: center;">Số lượng</th>
                  <th style="text-align: right;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong style="color: #111827;">Gói chụp: ${packageName}</strong>
                    <div style="font-size: 10px; color: #9ca3af;">File gốc & hậu kỳ chuyên sâu</div>
                  </td>
                  <td style="text-align: right; font-weight: 500;">${packagePrice.toLocaleString('vi-VN')} đ</td>
                  <td style="text-align: center; font-weight: bold;">1</td>
                  <td style="text-align: right; font-weight: 800; color: #111827;">${packagePrice.toLocaleString('vi-VN')} đ</td>
                </tr>
                <tr>
                  <td>
                    <strong style="color: #111827;">Không gian phòng: ${roomName}</strong>
                    <div style="font-size: 10px; color: #9ca3af;">Bối cảnh: ${backgroundConcept}</div>
                  </td>
                  <td style="text-align: right; font-weight: 500;">${roomSurcharge > 0 ? `+${roomSurcharge.toLocaleString('vi-VN')} đ` : '0 đ (Đã bao gồm)'}</td>
                  <td style="text-align: center; font-weight: bold;">1</td>
                  <td style="text-align: right; font-weight: 800; color: #111827;">${roomSurcharge > 0 ? roomSurcharge.toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
                </tr>
                ${serviceInvoiceRows}
                ${discountAmount > 0 ? `
                  <tr>
                    <td>
                      <strong style="color: #059669;">Ưu đãi giảm giá</strong>
                      <div style="font-size: 10px; color: #059669;">Voucher khuyến mãi</div>
                    </td>
                    <td style="text-align: right; font-weight: 500; color: #059669;">-${discountAmount.toLocaleString('vi-VN')} đ</td>
                    <td style="text-align: center; color: #059669;">1</td>
                    <td style="text-align: right; font-weight: 800; color: #059669;">-${discountAmount.toLocaleString('vi-VN')} đ</td>
                  </tr>
                ` : ''}
              </tbody>
              <tfoot>
                <tr style="border-top: 2px solid #E5E7EB;">
                  <td colspan="3" style="text-align: right; font-weight: 700; padding-top: 8px;">Tổng chi phí buổi chụp:</td>
                  <td style="text-align: right; font-weight: 800; color: #BE4B5E; font-size: 13px; padding-top: 8px;">${totalAmount.toLocaleString('vi-VN')} đ</td>
                </tr>
              </tfoot>
            </table>

            <div class="package-perks">
              <div class="perk-box">
                <div class="perk-title">Dịch vụ kèm theo</div>
                <div>Chụp không giới hạn file, chỉnh sửa 10 ảnh cao cấp, 1 ảnh để bàn 15x21cm.</div>
              </div>
              <div class="perk-box">
                <div class="perk-title">Trang phục</div>
                <div>02 bộ trang phục tự chọn (Dạ hội, Áo dài truyền thống hoặc Concept hiện đại).</div>
              </div>
              <div class="perk-box">
                <div class="perk-title">Phụ kiện & Makeup</div>
                <div>Trọn gói làm tóc & makeup chuyên nghiệp, phụ kiện miễn phí.</div>
              </div>
            </div>
          </div>

          <!-- 4. EKIP NHÂN VIÊN -->
          <div class="card" style="margin-bottom: 12px;">
            <div class="card-title">Ekip Nhân Viên Phụ Trách (${employees.length} nhân sự)</div>
            ${staffRows}
          </div>

          <!-- 5. THANH TOÁN & GIAO DỊCH -->
          <div class="card" style="margin-bottom: 12px;">
            <div class="card-title">Chi Tiết Thanh Toán & Lịch Sử Giao Dịch</div>
            
            <div class="summary-box">
              <div>
                <div class="summary-label">Tổng thanh toán:</div>
                <div class="summary-val" style="color: #111827;">${totalAmount.toLocaleString('vi-VN')} đ</div>
              </div>
              <div style="border-left: 1px solid #E5E7EB; border-right: 1px solid #E5E7EB;">
                <div class="summary-label">Đã thanh toán:</div>
                <div class="summary-val" style="color: #059669;">${paidAmount.toLocaleString('vi-VN')} đ</div>
              </div>
              <div>
                <div class="summary-label">Còn lại (tại Studio):</div>
                <div class="summary-val" style="color: #BE4B5E;">${remainingAmount.toLocaleString('vi-VN')} đ</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Mã GD</th>
                  <th>Phương thức</th>
                  <th style="text-align: center;">Thời gian</th>
                  <th style="text-align: right;">Số tiền</th>
                  <th style="text-align: right;">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                ${paymentRows}
              </tbody>
            </table>
          </div>

          <!-- CHỮ KÝ XÁC NHẬN -->
          <div class="signatures">
            <div>
              <div class="sig-title">Khách Hàng</div>
              <div class="sig-sub">(Ký & ghi rõ họ tên)</div>
              <div class="sig-space"></div>
              <div style="font-weight: 700; color: #111827;">${customerName}</div>
            </div>
            <div>
              <div class="sig-title">Đại Diện PhotoStudio</div>
              <div class="sig-sub">(Ký, đóng dấu & ghi rõ họ tên)</div>
              <div class="sig-space"></div>
              <div style="font-weight: 700; color: #BE4B5E;">PhotoStudio Team</div>
            </div>
          </div>

          <div class="footer-note">
            Cảm ơn Quý khách đã tin tưởng và sử dụng dịch vụ tại PhotoStudio! Hotline hỗ trợ: 0987.654.321.
          </div>
        </body>
      </html>
    `;

    const doc = printFrame.contentWindow.document;
    doc.open();
    doc.write(invoiceHtml);
    doc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (err) {
        console.error('Print error:', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1500);
      }
    }, 350);
  };

  const handleEmployeeRatingChange = (empId, star) => {
    setEmployeeFeedback((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { comment: '' }),
        rating: star,
      },
    }));
  };

  const handleEmployeeCommentChange = (empId, comment) => {
    setEmployeeFeedback((prev) => ({
      ...prev,
      [empId]: {
        ...(prev[empId] || { rating: 5 }),
        comment,
      },
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!currentUser || !currentUser.role) {
      setSubmitError('Tính năng đánh giá chỉ dành cho người dùng đã đăng ký và có vai trò (role) trong hệ thống.');
      return;
    }

    if (!overallComment.trim()) {
      setSubmitError('Vui lòng nhập lời nhận xét trải nghiệm chung về buổi chụp.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookingId: booking.id,
        customerId: currentUser?.id || booking.customerId || 1,
        rating: Number(overallRating) || 5.0,
        comment: overallComment.trim(),
      };

      const savedResult = await customerBookingService.submitReview(payload);
      setExistingReview(savedResult || payload);
      setSubmitSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted(savedResult || payload);
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.message || 'Không thể gửi đánh giá lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt lịch này?')) return;
    try {
      setCancelling(true);
      try {
        await customerBookingService.cancelBooking(booking.id, 'Khách hàng hủy');
      } catch (apiErr) {
        console.warn('API cancel booking error:', apiErr.message);
        // Nếu API trả lỗi nhưng đơn có thể là đơn mock/offline, kiểm tra tiếp
        if (!apiErr.response || apiErr.response.status >= 500) {
          throw apiErr;
        }
      }

      // Đồng bộ trạng thái vào bộ nhớ lưu trữ photostudio_paid_orders
      try {
        const paidList = JSON.parse(localStorage.getItem('photostudio_paid_orders') || '[]');
        const updated = paidList.map((o) =>
          o.bookingId === booking.id || o.id === booking.id
            ? { ...o, status: 'cancelled', bookingStatus: 'cancelled' }
            : o
        );
        localStorage.setItem('photostudio_paid_orders', JSON.stringify(updated));
      } catch {
        // Ignored
      }

      alert('Đã hủy đơn đặt lịch thành công.');
      if (onBookingCancelled) onBookingCancelled(booking.id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Hủy đơn thất bại.');
    } finally {
      setCancelling(false);
    }
  };

  const handleRebook = () => {
    onClose();
    navigate(ROUTES.USER.BOOKING);
  };

  const statusKey = (booking.status || 'pending').toLowerCase();
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: booking.status || 'Chờ xác nhận',
    badge: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  // Ngày có thứ
  let formattedFullDate = booking.bookingDate || 'Chưa xếp ngày';
  if (booking.bookingDate) {
    try {
      const d = new Date(booking.bookingDate);
      if (!isNaN(d.getTime())) {
        const weekday = d.toLocaleDateString('vi-VN', { weekday: 'long' });
        const dateStr = d.toLocaleDateString('vi-VN');
        formattedFullDate = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dateStr}`;
      }
    } catch {}
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in printable-bill-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl my-8 bg-white rounded-3xl border border-[#F0E4E6] shadow-2xl overflow-hidden text-[#261A1E] printable-bill-area"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="no-print">
          <FloralCardCorner position="top-right" opacity="opacity-30" />
        </div>

        {/* HEADER MODAL */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-[#F0E4E6] bg-white/95 backdrop-blur-md no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FDF5F6] border border-[#F5D5DC] flex items-center justify-center text-[#BE4B5E]">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#BE4B5E]">
                  HÓA ĐƠN & CHI TIẾT BUỔI CHỤP
                </span>
                <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                  #BK-{booking.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#261A1E]">
                {booking.packageName || packageDetail?.packageName || 'Gói Chụp Ảnh Nghệ Thuật Studio'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút xuất file PDF / In hóa đơn */}
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold border border-gray-300 transition-all shadow-2xs"
              title="In hóa đơn hoặc lưu file PDF (Print to PDF)"
            >
              <Printer className="w-4 h-4 text-[#BE4B5E]" />
              <span>In Hóa Đơn / Xuất PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY MODAL */}
        <div id="printable-invoice-content" className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto space-y-6 printable-bill-scrollable">
          
          {/* PHẦN ĐẦU HÓA ĐƠN KHI IN */}
          <div className="p-5 rounded-2xl bg-[#FAF5F5] border border-[#F0E4E6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold tracking-wider text-[#261A1E]">
                  PHOTO<span className="text-[#BE4B5E]">STUDIO</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-[#BE4B5E] font-semibold border border-rose-200">
                  Hóa Đơn Buổi Chụp
                </span>
              </div>
              <p className="text-xs text-gray-500">Mã đơn: <strong className="text-gray-800">#BK-{booking.id}</strong> • Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Trạng thái ca chụp:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badge}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* 1. KHÁCH HÀNG & LỊCH CHỤP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cột 1: Thông tin khách hàng */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <FileText className="w-3.5 h-3.5 text-[#BE4B5E]" />
                Thông tin Khách hàng
              </h4>
              <p className="flex justify-between">
                <span className="text-gray-400">Họ và tên:</span>
                <strong className="text-gray-800">{booking.customerName || currentUser?.fullname || currentUser?.username || 'Chưa có thông tin'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Số điện thoại:</span>
                <strong className="text-gray-800">{booking.customerPhone || currentUser?.phone || 'Chưa có thông tin'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <strong className="text-gray-800">{booking.customerEmail || currentUser?.email || 'Chưa có thông tin'}</strong>
              </p>
              {booking.customerNote && (
                <div className="pt-1 text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <span className="text-gray-400 block text-[11px]">Ghi chú của khách:</span>
                  <em className="text-gray-800">"{booking.customerNote}"</em>
                </div>
              )}
            </div>

            {/* Cột 2: Lịch chụp */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
                <Calendar className="w-3.5 h-3.5 text-[#BE4B5E]" />
                Thời gian ca chụp
              </h4>
              <p className="flex justify-between">
                <span className="text-gray-400">Ngày chụp:</span>
                <strong className="text-gray-800">{formattedFullDate}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Khung giờ:</span>
                <strong className="text-gray-800">{booking.startTime || '08:30'} – {booking.endTime || '10:30'}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Thời lượng:</span>
                <strong className="text-gray-800">120 phút (tiêu chuẩn)</strong>
              </p>
            </div>
          </div>

          {/* 2. KHÔNG GIAN STUDIO & BỐI CẢNH */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-[#BE4B5E]" />
              Không Gian Studio & Bối Cảnh
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-full sm:w-40 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <img
                  src={roomDetail?.thumbnail || roomDetail?.image || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80'}
                  alt={booking.roomName || 'Studio Room'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <h5 className="font-bold text-sm text-[#261A1E]">
                  {booking.roomName || roomDetail?.name || 'Phòng Studio VIP'}
                </h5>
                <p className="text-gray-600 leading-relaxed">
                  {roomDetail?.description || 'Phòng chụp sang trọng chuẩn Cinematic với hệ thống ánh sáng Profoto, phông nền nghệ thuật đa phong cách và góc máy sáng tạo.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#BE4B5E] border border-rose-100 font-medium">
                    Bối cảnh: {booking.backgroundName || roomDetail?.concept || 'Tone Trầm Điện Ảnh & Hoa Đào'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                    Sức chứa: {roomDetail?.capacity || '4 - 6 người'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BẢNG KÊ CHI PHÍ & DỊCH VỤ BUỔI CHỤP */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Package className="w-3.5 h-3.5 text-[#BE4B5E]" />
              Bảng Kê Chi Phí & Dịch Vụ Buổi Chụp
            </h4>
            
            {/* Bảng chi tiết đơn giá từng mục */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-medium">
                    <th className="pb-2">Khoản mục / Dịch vụ</th>
                    <th className="pb-2 text-right">Đơn giá</th>
                    <th className="pb-2 text-center">Số lượng</th>
                    <th className="pb-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {/* Gói chụp chính */}
                  <tr>
                    <td className="py-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <img
                          src={packageDetail?.image || booking.packageImage || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=300&q=80'}
                          alt={packageName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <strong className="text-gray-800 font-bold block text-sm">
                          {packageName}
                        </strong>
                        <span className="text-gray-400 text-[11px]">Gói chụp chính • File gốc & hậu kỳ chuyên sâu</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-gray-700">
                      {packagePrice.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3 text-center font-bold text-gray-800">1</td>
                    <td className="py-3 text-right font-bold text-[#BE4B5E] text-sm">
                      {packagePrice.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>

                  {/* Không gian phòng chụp */}
                  <tr>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img
                            src={roomDetail?.thumbnail || roomDetail?.image || 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=300&q=80'}
                            alt={roomName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-gray-800 font-bold block text-sm">
                            {roomName}
                          </strong>
                          <span className="text-gray-400 text-[11px]">
                            {booking.backgroundName || roomDetail?.concept || 'Không gian phòng chụp Studio Cinematic'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium text-gray-700">
                      {roomSurcharge > 0 ? `+${roomSurcharge.toLocaleString('vi-VN')} đ` : '0 đ (Đã bao gồm)'}
                    </td>
                    <td className="py-3 text-center font-bold text-gray-800">1</td>
                    <td className="py-3 text-right font-bold text-gray-800 text-sm">
                      {roomSurcharge > 0 ? `+${roomSurcharge.toLocaleString('vi-VN')} đ` : '0 đ'}
                    </td>
                  </tr>

                  {/* Dịch vụ bổ sung */}
                  {selectedServices.length > 0 ? (
                    selectedServices.map((srv, idx) => (
                      <tr key={srv.id || idx}>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100 text-[#BE4B5E]">
                              {srv.image ? (
                                <img src={srv.image} alt={srv.name} className="w-full h-full object-cover" />
                              ) : (
                                <Scissors className="w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <strong className="text-gray-800 font-bold block text-sm">
                                {srv.name}
                              </strong>
                              <span className="text-gray-400 text-[11px]">Dịch vụ bổ sung đã chọn</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right font-medium text-gray-700">
                          +{Number(srv.price || 0).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3 text-center font-bold text-gray-800">1</td>
                        <td className="py-3 text-right font-bold text-gray-800 text-sm">
                          +{Number(srv.price || 0).toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-dashed border-gray-200 text-gray-400">
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div>
                            <strong className="text-gray-600 font-medium block text-sm">
                              Dịch vụ bổ sung
                            </strong>
                            <span className="text-gray-400 text-[11px]">Không có dịch vụ bổ sung</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium text-gray-400">0 đ</td>
                      <td className="py-3 text-center font-medium text-gray-400">0</td>
                      <td className="py-3 text-right font-medium text-gray-400 text-sm">0 đ</td>
                    </tr>
                  )}

                  {/* Ưu đãi giảm giá nếu có */}
                  {discountAmount > 0 && (
                    <tr>
                      <td className="py-3">
                        <strong className="text-emerald-700 font-bold block text-sm">
                          Ưu đãi giảm giá
                        </strong>
                        <span className="text-emerald-600 text-[11px]">Voucher áp dụng thành công</span>
                      </td>
                      <td className="py-3 text-right font-medium text-emerald-600">
                        -{discountAmount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 text-center font-bold text-emerald-600">1</td>
                      <td className="py-3 text-right font-bold text-emerald-600 text-sm">
                        -{discountAmount.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={3} className="py-3.5 text-right font-bold text-gray-800 text-sm">
                      Tổng tiền thanh toán buổi chụp:
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-[#BE4B5E] text-base">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Nội dung gói: Dịch vụ, Trang phục, Phụ kiện */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-700 flex items-center gap-1.5 text-[11px]">
                  <PhotoIcon className="w-3.5 h-3.5 text-[#BE4B5E]" />
                  Dịch vụ kèm theo
                </span>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Chụp không giới hạn file, chỉnh sửa 10 ảnh cao cấp, 1 ảnh ép gỗ để bàn 15x21cm.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-700 flex items-center gap-1.5 text-[11px]">
                  <Scissors className="w-3.5 h-3.5 text-[#BE4B5E]" />
                  Trang phục
                </span>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  02 bộ trang phục tự chọn (Váy dạ hội, Áo dài truyền thống hoặc Concept hiện đại).
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="font-bold text-gray-700 flex items-center gap-1.5 text-[11px]">
                  <PaintBrushIcon className="w-3.5 h-3.5 text-[#BE4B5E]" />
                  Phụ kiện & Makeup
                </span>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  Trọn gói làm tóc & makeup chuyên nghiệp, mượn phụ kiện chụp ảnh miễn phí.
                </p>
              </div>
            </div>
          </div>

          {/* 4. EKIP NHÂN VIÊN ĐỒNG HÀNH */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Users className="w-3.5 h-3.5 text-[#BE4B5E]" />
              Ekip Nhân Viên Phụ Trách ({employees.length} nhân sự)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {employees.map((emp) => (
                <div
                  key={emp.employeeId}
                  className="p-3 rounded-xl bg-gray-50/80 border border-gray-200 flex items-center gap-3"
                >
                  <img
                    src={emp.avatar}
                    alt={emp.employeeName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="font-bold text-gray-800 text-sm truncate">{emp.employeeName}</p>
                    <p className="text-[#BE4B5E] font-medium text-[11px] truncate">{emp.position}</p>
                    <div className="text-[11px] text-gray-500 pt-0.5 space-y-0.5">
                      <p>Hotline: <strong className="text-gray-700">{emp.employeePhone}</strong></p>
                      <p>Email: <span className="text-gray-700">{emp.email}</span></p>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* 5. THANH TOÁN & DANH SÁCH GIAO DỊCH */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <CreditCard className="w-3.5 h-3.5 text-[#BE4B5E]" />
              Chi Tiết Thanh Toán & Lịch Sử Giao Dịch
            </h4>

            {/* Tóm tắt số tiền */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#FAF5F5] border border-[#F0E4E6] text-center">
              <div>
                <span className="text-[11px] text-gray-500 block">Tổng số tiền:</span>
                <strong className="text-sm sm:text-base text-gray-800 font-bold">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <div className="border-x border-gray-200">
                <span className="text-[11px] text-gray-500 block">Đã thanh toán:</span>
                <strong className="text-sm sm:text-base text-emerald-600 font-bold">
                  {paidAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">Còn lại (tại studio):</span>
                <strong className="text-sm sm:text-base text-[#BE4B5E] font-bold">
                  {remainingAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>

            {/* Bảng lịch sử giao dịch */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-semibold text-[11px]">
                    <th className="pb-1.5">Mã GD</th>
                    <th className="pb-1.5">Phương thức</th>
                    <th className="pb-1.5 text-right">Số tiền</th>
                    <th className="pb-1.5 text-center">Thời gian</th>
                    <th className="pb-1.5 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {payments.length > 0 ? (
                    payments.map((p, idx) => (
                      <tr key={p.id || idx}>
                        <td className="py-2 font-mono">#{p.id || `TXN-${idx + 1}`}</td>
                        <td className="py-2 uppercase font-medium">{p.paymentMethod || 'VNPay'}</td>
                        <td className="py-2 text-right font-bold text-gray-800">{Number(p.amount || 0).toLocaleString('vi-VN')} đ</td>
                        <td className="py-2 text-center text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}</td>
                        <td className="py-2 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.status?.toLowerCase() === 'deposit_30' ? 'Đã cọc 30%' : p.status?.toLowerCase() === 'deposit_50' ? 'Đã cọc 50%' : p.status?.toLowerCase() === 'pending' ? 'Đang chờ thanh toán' : 'Đã thanh toán'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-2 font-mono">#TXN-INIT-{booking.id}</td>
                      <td className="py-2 uppercase font-medium">Thanh toán tại Studio</td>
                      <td className="py-2 text-right font-bold text-gray-800">{paidAmount.toLocaleString('vi-VN')} đ</td>
                      <td className="py-2 text-center text-gray-500">{new Date().toLocaleDateString('vi-VN')}</td>
                      <td className="py-2 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : booking.paymentStatus === 'deposit_50' ? 'Đã cọc 50%' : booking.paymentStatus === 'deposit_30' ? 'Đã cọc 30%' : 'Đang chờ thanh toán'}
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CHỮ KÝ XÁC NHẬN KHI IN */}
          <div className="hidden print:grid grid-cols-2 gap-8 pt-6 mt-6 border-t border-gray-200 text-xs text-center text-gray-700">
            <div>
              <p className="font-bold uppercase tracking-wider text-gray-800">Khách Hàng</p>
              <p className="text-[11px] text-gray-400 italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-14"></div>
              <p className="font-semibold text-gray-800">{booking.customerName || currentUser?.fullname || 'Khách hàng'}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-gray-800">Đại Diện PhotoStudio</p>
              <p className="text-[11px] text-gray-400 italic">(Ký, đóng dấu & ghi rõ họ tên)</p>
              <div className="h-14"></div>
              <p className="font-semibold text-[#BE4B5E]">PhotoStudio Team</p>
            </div>
          </div>

          {/* 6. ĐÁNH GIÁ (NẾU ĐÃ HOÀN THÀNH HOẶC ĐÃ CÓ REVIEW) - KHÔNG IN */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3 no-print">
            <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              Đánh Giá Trải Nghiệm Buổi Chụp
            </h4>

            {existingReview ? (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{existingReview.rating || 5}.0 / 5.0</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Đã đánh giá</span>
                </div>
                <p className="text-gray-800 italic">"{existingReview.comment}"</p>
                {existingReview.adminReply && (
                  <div className="pt-2 border-t border-amber-200/60 text-xs text-[#BE4B5E] bg-white/70 p-2 rounded-lg">
                    <strong>Phản hồi từ PhotoStudio:</strong> {existingReview.adminReply}
                  </div>
                )}
              </div>
            ) : statusKey === 'completed' ? (
              <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    Cảm ơn bạn đã gửi đánh giá buổi chụp!
                  </div>
                )}
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Điểm số sao cho buổi chụp:</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= overallRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="font-bold text-[#BE4B5E] ml-2">{overallRating}.0</span>
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Nhận xét của bạn:</label>
                  <textarea
                    rows={2}
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    placeholder="Chia sẻ cảm nhận về buổi chụp, ảnh chụp, không gian studio..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#BE4B5E]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer px-4 py-2 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white font-bold transition-all shadow-xs"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>
            ) : (
              <p className="text-xs text-gray-400 italic">
                (Chức năng đánh giá sẽ mở sau khi buổi chụp hoàn thành tại Studio)
              </p>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS (Ẩn khi in ấn) */}
        <div className="px-6 py-4 bg-[#FAF5F5] border-t border-[#F0E4E6] flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-300 transition-all shadow-2xs"
            >
              <Printer className="w-4 h-4 text-[#BE4B5E]" />
              <span>In Hóa Đơn / Xuất PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Hủy lịch (khi pending hoặc confirmed) */}
            {(statusKey === 'pending' || statusKey === 'confirmed') && (
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all disabled:opacity-50"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>{cancelling ? 'Đang hủy...' : 'Hủy lịch đặt'}</span>
              </button>
            )}

            {/* Nút Đặt lại (khi completed hoặc cancelled) */}
            {(statusKey === 'completed' || statusKey === 'cancelled') && (
              <button
                type="button"
                onClick={handleRebook}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại lịch</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-white transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
