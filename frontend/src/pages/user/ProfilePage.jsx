import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  LockClosedIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CameraIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  CalendarDaysIcon,
  StarIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import customerBookingService from "../../services/user/bookingService";
import customerPaymentService from "../../services/user/paymentService";
import customerReviewService from "../../services/user/reviewService";
import BookingSessionDetailModal from "../../components/user/BookingSessionDetailModal";
import { ROUTES } from "../../routes/web";
import axiosCustomer, { customerAuth } from "../../lib/axiosCustomer";
import customerAuthService from "../../services/user/authService";
import {
  validateVietnamesePhone,
  isValidPhone,
  validateDateOfBirth,
  isAddressValid,
} from "../../utils/phoneValidator";
import {
  FloralCardCorner,
  FloralBranchCorner,
} from "../../components/common/FloralDecorations";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const addressTextareaRef = useRef(null);

  // Kiểm tra đăng nhập
  const isAuth = customerAuth.isAuthenticated();

  // Tab điều hướng: 'profile' | 'bookings' | 'reviews' | 'messages' | 'password'
  const [activeTab, setActiveTab] = useState("profile");

  // State lưu thông tin khách hàng (lấy từ CSDL, không dùng dữ liệu mẫu)
  const [user, setUser] = useState(() => customerAuth.getUser() || null);

  // Chế độ chỉnh sửa thông tin cá nhân
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    avatar: "",
  });

  // State đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Lịch chụp & Đơn đặt của khách hàng (chỉ lấy đơn của chính mình)
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Phân trang & bộ lọc đơn đặt lịch (2 đơn / trang)
  const [bookingFilter, setBookingFilter] = useState("all");
  const [bookingCurrentPage, setBookingCurrentPage] = useState(1);
  const BOOKINGS_PER_PAGE = 2;

  // Phân trang đánh giá của tôi (5 đánh giá / trang)
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  // Xử lý hủy lịch đặt
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đặt lịch này không?")) return;
    try {
      try {
        await customerBookingService.cancelBooking(bookingId, "Khách hàng hủy");
      } catch (apiErr) {
        console.warn("API cancel booking error:", apiErr.message);
      }

      // Cập nhật trạng thái trong photostudio_paid_orders nếu có
      try {
        const paidList = JSON.parse(localStorage.getItem('photostudio_paid_orders') || '[]');
        const updated = paidList.map((o) =>
          o.bookingId === bookingId || o.id === bookingId
            ? { ...o, status: 'cancelled', bookingStatus: 'cancelled' }
            : o
        );
        localStorage.setItem('photostudio_paid_orders', JSON.stringify(updated));
      } catch {
        // Ignored
      }

      // Cập nhật trực tiếp danh sách bookings trên màn hình
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );

      alert("Đã hủy đơn đặt lịch thành công!");
      if (user) fetchRealBookings(user);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Không thể hủy lịch lúc này.");
    }
  };

  // Đặt lại lịch chụp
  const handleRebook = () => {
    navigate(ROUTES.USER.BOOKING);
  };

  // Hỗ trợ tự động mở tab và modal từ URL (?tab=bookings&bookingId=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam && ["profile", "bookings", "reviews", "password"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const openId = params.get("bookingId") || params.get("openBookingId");
    if (openId && bookings.length > 0) {
      const targetB = bookings.find((item) => String(item.id) === String(openId));
      if (targetB) {
        setSelectedBookingForDetail(targetB);
        setIsDetailModalOpen(true);
      }
    }
  }, [bookings]);

  // Đánh giá của tôi
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Lỗi & thông báo
  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Lấy chữ cái đầu tiên của tên khi chưa có ảnh đại diện
  const getInitialLetter = (fullname, username) => {
    const str = (fullname || username || "U").trim();
    const parts = str.split(/\s+/).filter(Boolean);
    const lastPart = parts[parts.length - 1] || str;
    return lastPart.charAt(0).toUpperCase();
  };

  // Tải thông tin mới nhất từ backend
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!isAuth) return;

    customerAuthService
      .getProfile()
      .then((res) => {
        if (res) {
          const normalizedGender = res.gender
            ? String(res.gender).toUpperCase() === "MALE"
              ? "MALE"
              : String(res.gender).toUpperCase() === "FEMALE"
              ? "FEMALE"
              : "OTHER"
            : "";
          const fullUser = { ...res, gender: normalizedGender };
          setUser(fullUser);
          setEditForm({
            username: res.username || "",
            fullname: res.fullname || "",
            email: res.email || "",
            phone: res.phone || "",
            gender: normalizedGender,
            dateOfBirth: res.dateOfBirth || "",
            address: res.address || "",
            avatar: res.avatar || "",
          });
          fetchRealBookings(fullUser);
          fetchMyReviews(fullUser);
        }
      })
      .catch(() => {
        const local = customerAuth.getUser();
        if (local) {
          const normalizedGender = local.gender
            ? String(local.gender).toUpperCase() === "MALE"
              ? "MALE"
              : String(local.gender).toUpperCase() === "FEMALE"
              ? "FEMALE"
              : "OTHER"
            : "";
          const fullUser = { ...local, gender: normalizedGender };
          setUser(fullUser);
          setEditForm({
            username: local.username || "",
            fullname: local.fullname || "",
            email: local.email || "",
            phone: local.phone || "",
            gender: normalizedGender,
            dateOfBirth: local.dateOfBirth || "",
            address: local.address || "",
            avatar: local.avatar || "",
          });
          fetchRealBookings(local);
          fetchMyReviews(local);
        }
      });
  }, [isAuth]);

  // Bắt đầu chỉnh sửa thông tin
  const handleStartEdit = () => {
    const currentGender = user?.gender
      ? String(user.gender).toUpperCase() === "MALE"
        ? "MALE"
        : String(user.gender).toUpperCase() === "FEMALE"
        ? "FEMALE"
        : "OTHER"
      : "";
    setEditForm({
      username: user?.username || "",
      fullname: user?.fullname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      gender: currentGender,
      dateOfBirth: user?.dateOfBirth || "",
      address: user?.address || "",
      avatar: user?.avatar || "",
    });
    setFieldErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsEditing(true);
    setTimeout(() => {
      if (addressTextareaRef.current) {
        autoResizeAddress(addressTextareaRef.current);
      }
    }, 60);
  };

  // Tự động điều chỉnh kích thước ô Địa chỉ khi vào chế độ chỉnh sửa
  useEffect(() => {
    if (isEditing && addressTextareaRef.current) {
      autoResizeAddress(addressTextareaRef.current);
    }
  }, [isEditing]);

  // Tải đơn đặt lịch: Chỉ lọc đơn của chính mình
  const fetchRealBookings = async (targetUser) => {
    setBookingsLoading(true);
    try {
      let rawList = [];
      const apiBookingIds = new Set();

      if (targetUser?.id) {
        try {
          const resByCust = await customerBookingService.getBookingsByCustomer(targetUser.id);
          const apiRows = Array.isArray(resByCust) ? resByCust
            : Array.isArray(resByCust?.data) ? resByCust.data
              : Array.isArray(resByCust?.content) ? resByCust.content : [];
          rawList = apiRows;
          apiRows.forEach((booking) => apiBookingIds.add(String(booking.id)));
        } catch (e) {
          console.warn("Lấy đơn theo customerId:", e.message);
        }
      }

      try {
        const localBookings = JSON.parse(
          localStorage.getItem(`user_bookings_${targetUser?.id}`) || "[]"
        );
        if (Array.isArray(localBookings) && localBookings.length > 0) {
          const existingIds = new Set(rawList.map((b) => b.id));
          for (const lb of localBookings) {
            if (!existingIds.has(lb.id)) rawList.push(lb);
          }
        }
      } catch {}

      const filteredList = rawList.filter((item) => {
        if (!targetUser) return false;
        // Endpoint này đã được giới hạn theo customerId; một số DTO không trả lại customerId.
        if (apiBookingIds.has(String(item.id))) return true;
        const matchId = item.customerId && Number(item.customerId) === Number(targetUser.id);
        const matchUserId = item.userId && Number(item.userId) === Number(targetUser.id);
        const matchPhone = item.customerPhone && targetUser.phone && item.customerPhone.trim() === targetUser.phone.trim();
        const matchEmail = item.customerEmail && targetUser.email && item.customerEmail.toLowerCase() === targetUser.email.toLowerCase();
        return matchId || matchUserId || matchPhone || matchEmail;
      });

      if (filteredList.length > 0) {
        const enriched = await Promise.all(
          filteredList.map(async (item) => {
            let pkgName = item.roomName ? `Buổi chụp tại ${item.roomName}` : "Gói Chụp Ảnh Studio VIP";
            let reviewInfo = null;
            let packageImage = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80";
            let totalPrice = 1500000;
            let backgroundName = "Studio Tone Trầm & Cành Đào";
            let quantity = 1;

            if (item.customerNote && item.customerNote.includes("Gói:")) {
              const notePart = item.customerNote.split("Gói:")[1];
              if (notePart) pkgName = notePart.trim();
            }

            try {
              const pkgs = await customerBookingService.getBookingPackages(item.id);
              if (Array.isArray(pkgs) && pkgs.length > 0 && pkgs[0].packageName) {
                pkgName = pkgs[0].packageName;
                if (pkgs[0].subTotal) totalPrice = Number(pkgs[0].subTotal);
                else if (pkgs[0].unitPrice) totalPrice = Number(pkgs[0].unitPrice);
                if (pkgs[0].quantity) quantity = Number(pkgs[0].quantity);
                if (pkgs[0].packageId) {
                  try {
                    const pInfo = await customerPackageService.getPackageById(pkgs[0].packageId);
                    if (pInfo?.thumbnail || pInfo?.coverImage) {
                      packageImage = pInfo.thumbnail || pInfo.coverImage;
                    }
                  } catch {}
                }
              }
            } catch {}

            try {
              const rev = await customerBookingService.getBookingReview(item.id);
              if (rev && rev.id) reviewInfo = rev;
            } catch {}

            let bookingPayments = [];
            try {
              const paymentResult = await customerPaymentService.getPaymentsByBookingId(item.id);
              bookingPayments = Array.isArray(paymentResult) ? paymentResult : Array.isArray(paymentResult?.data) ? paymentResult.data : [];
            } catch {}
            const depositPayment = bookingPayments.find((payment) => ['deposit_30', 'deposit_50'].includes((payment.status || '').toLowerCase()));
            const savedPackageTotal = Number(totalPrice || 0);
            if (depositPayment && Math.abs(savedPackageTotal - Number(depositPayment.amount || 0)) < 1) {
              const rate = depositPayment.status.toLowerCase() === 'deposit_50' ? 0.5 : 0.3;
              totalPrice = Number(depositPayment.amount || 0) / rate;
            }

            // Ngày có thứ
            let dayOfWeekAndDate = "Chưa xếp ngày";
            let timeLabel = "Chờ xếp";
            let timeLabelClass = "bg-gray-100 text-gray-600 border border-gray-200";

            if (item.bookingDate) {
              try {
                const bDate = new Date(item.bookingDate);
                if (!isNaN(bDate.getTime())) {
                  const weekday = bDate.toLocaleDateString("vi-VN", { weekday: "long" });
                  const dateStr = bDate.toLocaleDateString("vi-VN");
                  dayOfWeekAndDate = `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${dateStr}`;

                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const target = new Date(bDate);
                  target.setHours(0, 0, 0, 0);
                  const diffDays = Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                  if (diffDays === 0) {
                    timeLabel = "Hôm nay";
                    timeLabelClass = "bg-amber-100 text-amber-800 border border-amber-300";
                  } else if (diffDays === 1) {
                    timeLabel = "Ngày mai";
                    timeLabelClass = "bg-rose-100 text-[#BE4B5E] border border-rose-200";
                  } else if (diffDays > 1) {
                    timeLabel = `Còn ${diffDays} ngày`;
                    timeLabelClass = "bg-blue-100 text-blue-800 border border-blue-200";
                  } else {
                    timeLabel = "Đã qua";
                    timeLabelClass = "bg-gray-100 text-gray-600 border border-gray-200";
                  }
                }
              } catch {}
            }

            const paymentPriority = { pending: 0, deposit_30: 1, deposit_50: 2, paid: 3, success: 3, completed: 3 };
            const paymentStatus = ([...bookingPayments].sort((a, b) => (paymentPriority[(b.status || '').toLowerCase()] || 0) - (paymentPriority[(a.status || '').toLowerCase()] || 0))[0]?.status || "pending").toLowerCase();
            const paymentLabels = {
              pending: ["Đang chờ thanh toán", "bg-gray-100 text-gray-600 border-gray-200"],
              deposit_30: ["Đã cọc 30%", "bg-amber-50 text-amber-700 border-amber-200"],
              deposit_50: ["Đã cọc 50%", "bg-amber-50 text-amber-700 border-amber-200"],
              paid: ["Đã thanh toán", "bg-emerald-50 text-emerald-700 border-emerald-200"],
              success: ["Đã thanh toán", "bg-emerald-50 text-emerald-700 border-emerald-200"],
              completed: ["Đã thanh toán", "bg-emerald-50 text-emerald-700 border-emerald-200"],
            };
            const [paymentStatusText, paymentBadgeClass] = paymentLabels[paymentStatus] || paymentLabels.pending;

            const rawStatus = (item.status || "pending").toLowerCase();

            // Lấy thông tin lưu từ photostudio_paid_orders (nếu đơn được đặt và thanh toán trên máy)
            let matchedPaid = null;
            try {
              const paidList = JSON.parse(localStorage.getItem('photostudio_paid_orders') || '[]');
              matchedPaid = paidList.find((p) => p.id === item.id || p.bookingId === item.id) || null;
            } catch {}

            return {
              id: item.id,
              customerId: item.customerId,
              customerName: item.customerName,
              customerPhone: item.customerPhone,
              customerEmail: item.customerEmail,
              packageName: pkgName,
              packageImage,
              packagePrice: matchedPaid?.packagePrice || matchedPaid?.finalPackagePrice,
              packageOriginalPrice: matchedPaid?.packageOriginalPrice,
              roomSurcharge: matchedPaid?.roomSurcharge ?? 0,
              services: matchedPaid?.services || matchedPaid?.selectedServices || [],
              servicesTotal: matchedPaid?.servicesTotal || 0,
              isServiceOptOut: matchedPaid?.isServiceOptOut || false,
              discountAmount: matchedPaid?.discountAmount || 0,
              quantity,
              staffCount: 2,
              totalPrice: matchedPaid?.totalOrderPrice || totalPrice,
              totalOrderPrice: matchedPaid?.totalOrderPrice || totalPrice,
              paymentStatusText,
              paymentBadgeClass,
              dayOfWeekAndDate,
              timeLabel,
              timeLabelClass,
              bookingDate: item.bookingDate,
              startTime: item.startTime ? String(item.startTime).slice(0, 5) : "08:30",
              endTime: item.endTime ? String(item.endTime).slice(0, 5) : "10:30",
              roomId: item.roomId,
              roomName: item.roomName || `Phòng Studio VIP #${item.roomId || 1}`,
              backgroundName,
              status: rawStatus,
              customerNote: item.customerNote || "",
              review: reviewInfo,
            };
          })
        );
        enriched.sort((a, b) => Number(b.id) - Number(a.id));
        setBookings(enriched);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.warn("Lỗi tải lịch chụp:", err);
      setBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  // Làm mới khi người dùng quay lại tab đơn đặt lịch hoặc quay lại cửa sổ sau khi admin cập nhật.
  useEffect(() => {
    if (activeTab !== "bookings" || !user) return undefined;
    fetchRealBookings(user);
    const refreshOnFocus = () => fetchRealBookings(user);
    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, [activeTab, user?.id]);

  // Tải danh sách đánh giá của tôi (luôn lấy các đánh giá MỚI NHẤT)
  const fetchMyReviews = async (targetUser) => {
    setReviewsLoading(true);
    try {
      let myRevs = [];
      const uid = targetUser?.id;
      if (uid) {
        try {
          const res = await customerReviewService.getReviewsByCustomerId(uid);
          if (Array.isArray(res) && res.length > 0) {
            myRevs = res;
          }
        } catch (apiErr) {
          console.warn("API getReviewsByCustomerId không trả về kết quả, thử getAllReviews:", apiErr.message);
        }
      }

      if (myRevs.length === 0) {
        try {
          const all = await customerReviewService.getAllReviews();
          if (Array.isArray(all) && all.length > 0) {
            myRevs = all.filter((r) => {
              if (!targetUser) return false;
              const matchCustId = r.customerId && Number(r.customerId) === Number(targetUser.id);
              const matchUserId = r.userId && Number(r.userId) === Number(targetUser.id);
              const matchUser = r.username && targetUser.username && r.username.toLowerCase() === targetUser.username.toLowerCase();
              const matchName = r.customerName && targetUser.fullname && r.customerName.toLowerCase() === targetUser.fullname.toLowerCase();
              return matchCustId || matchUserId || matchUser || matchName;
            });
          }
        } catch (e) {
          console.warn("Lỗi gọi getAllReviews:", e.message);
        }
      }

      // Sắp xếp lấy các đánh giá MỚI NHẤT lên đầu (theo createdAt hoặc id giảm dần)
      myRevs.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.adminRepliedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.adminRepliedAt || 0).getTime();
        if (timeB !== timeA) return timeB - timeA;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });

      setReviews(myRevs);
    } catch (err) {
      console.warn("Lỗi tải đánh giá:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Tự động tải lại đánh giá mới nhất khi chuyển sang tab "reviews" hoặc focus lại tab
  useEffect(() => {
    if (activeTab === "reviews" && user) {
      fetchMyReviews(user);
      const refreshReviewsOnFocus = () => fetchMyReviews(user);
      window.addEventListener("focus", refreshReviewsOnFocus);
      return () => window.removeEventListener("focus", refreshReviewsOnFocus);
    }
  }, [activeTab, user?.id]);

  // Tự động co giãn ô nhập Địa chỉ: tối đa 3 dòng, quá 3 dòng hiện thanh cuộn
  const autoResizeAddress = (textarea) => {
    if (!textarea) return;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    // Chiều cao tối đa của 3 dòng văn bản (line-height ~22px + padding ~16px)
    const maxHeight = 84;
    if (scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.height = `${Math.max(scrollHeight, 38)}px`;
      textarea.style.overflowY = "hidden";
    }
  };

  const handleAddressChange = (e) => {
    const target = e.target;
    setEditForm((prev) => ({ ...prev, address: target.value }));
    if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: "" }));
    autoResizeAddress(target);
  };

  // Cập nhật ảnh đại diện (Upload Avatar)
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Vui lòng chọn tệp định dạng hình ảnh (JPG, PNG, WEBP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Dung lượng ảnh tối đa 5MB. Vui lòng chọn ảnh nhỏ hơn.");
      return;
    }

    setIsUploadingAvatar(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // 1. Tải file ảnh lên máy chủ qua API /api/uploads/images
      const formData = new FormData();
      formData.append("file", file);

      // Không gán cố định multipart/form-data để axios tự tạo boundary chuẩn
      const uploadRes = await axiosCustomer.post("/api/uploads/images", formData, {
        headers: { "Content-Type": undefined },
      });

      let finalAvatarUrl = uploadRes?.imageUrl || uploadRes?.url;
      if (!finalAvatarUrl && typeof uploadRes === "string") {
        finalAvatarUrl = uploadRes;
      }
      if (!finalAvatarUrl) {
        throw new Error("Không nhận được đường dẫn ảnh từ máy chủ");
      }

      // Chuẩn hóa đường dẫn nếu máy chủ trả về URL tương đối
      if (!finalAvatarUrl.startsWith("http://") && !finalAvatarUrl.startsWith("https://")) {
        const cleanPath = finalAvatarUrl.startsWith("/") ? finalAvatarUrl : `/${finalAvatarUrl}`;
        finalAvatarUrl = `${API_BASE_URL}${cleanPath}`;
      }

      // 2. Cập nhật ngay vào editForm và user state để UI đổi ảnh tức thì
      setEditForm((prev) => ({ ...prev, avatar: finalAvatarUrl }));
      setUser((prev) => ({ ...(prev || {}), avatar: finalAvatarUrl }));

      // 3. Cập nhật avatar vào CSDL
      const currentUser = customerAuth.getUser() || user || {};
      const updateData = {
        username: currentUser.username || user?.username,
        fullname: editForm.fullname || currentUser.fullname || user?.fullname || "",
        email: editForm.email || currentUser.email || user?.email || "",
        phone: editForm.phone || currentUser.phone || user?.phone || null,
        gender: (editForm.gender || user?.gender) === "MALE" ? "Male" : (editForm.gender || user?.gender) === "FEMALE" ? "Female" : null,
        dateOfBirth: editForm.dateOfBirth || currentUser.dateOfBirth || user?.dateOfBirth || null,
        address: editForm.address || currentUser.address || user?.address || null,
        avatar: finalAvatarUrl,
      };

      const updated = await customerAuthService.updateProfile(updateData);
      const normalizedGender = updated?.gender
        ? String(updated.gender).toUpperCase() === "MALE"
          ? "MALE"
          : String(updated.gender).toUpperCase() === "FEMALE"
          ? "FEMALE"
          : "OTHER"
        : "";
      const merged = { ...updated, avatar: finalAvatarUrl, gender: normalizedGender };
      setUser(merged);
      customerAuth.setUser(merged);
      setSuccessMessage("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật ảnh đại diện:", err);
      setErrorMessage(
        err.response?.data?.message || err.message || "Không thể cập nhật ảnh đại diện. Vui lòng kiểm tra kết nối máy chủ!"
      );
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Kiểm tra điều kiện thông tin cá nhân
  const validateEditForm = () => {
    const errors = {};

    if (!editForm.fullname || !editForm.fullname.trim()) {
      errors.fullname = "Họ và tên không được để trống.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editForm.email || !editForm.email.trim()) {
      errors.email = "Email không được để trống.";
    } else if (!emailRegex.test(editForm.email.trim())) {
      errors.email = "Địa chỉ email không hợp lệ (VD: user@photostudio.vn).";
    }

    // Số điện thoại: Nếu có nhập thì phải hợp lệ (10 số, bắt đầu bằng 0, số thứ hai là 3, 5, 7, 8, 9)
    if (editForm.phone && editForm.phone.trim()) {
      const phoneVal = validateVietnamesePhone(editForm.phone);
      if (!phoneVal.isValid) {
        errors.phone = phoneVal.message;
      }
    }

    // Ngày sinh: nếu có chọn thì >= 13 tuổi, không lớn hơn ngày hiện tại
    if (editForm.dateOfBirth) {
      const dobVal = validateDateOfBirth(editForm.dateOfBirth);
      if (!dobVal.isValid) {
        errors.dateOfBirth = dobVal.message;
      }
    }

    // Địa chỉ: kiểm tra độ dài tối đa
    if (editForm.address && editForm.address.trim().length > 255) {
      errors.address = "Địa chỉ tối đa 255 ký tự.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Lưu thông tin cá nhân
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateEditForm()) {
      setErrorMessage("Vui lòng kiểm tra lại thông tin bị thiếu hoặc không hợp lệ.");
      return;
    }

    setIsLoading(true);

    try {
      let normalizedPhone = null;
      if (editForm.phone && editForm.phone.trim()) {
        const phoneVal = validateVietnamesePhone(editForm.phone);
        normalizedPhone = phoneVal.normalizedPhone || editForm.phone.trim();
      }

      const updateData = {
        username: editForm.username ? editForm.username.trim() : (user?.username || ""),
        fullname: editForm.fullname ? editForm.fullname.trim() : "",
        email: editForm.email ? editForm.email.trim() : (user?.email || ""),
        phone: normalizedPhone,
        gender: editForm.gender === "MALE" ? "Male" : editForm.gender === "FEMALE" ? "Female" : null,
        dateOfBirth: editForm.dateOfBirth || null,
        address: editForm.address && editForm.address.trim() ? editForm.address.trim() : null,
        avatar: editForm.avatar || null,
      };

      const updated = await customerAuthService.updateProfile(updateData);
      const normalizedGender = updated?.gender
        ? String(updated.gender).toUpperCase() === "MALE"
          ? "MALE"
          : String(updated.gender).toUpperCase() === "FEMALE"
          ? "FEMALE"
          : "OTHER"
        : "";

      const merged = { ...updated, gender: normalizedGender };
      setUser(merged);
      customerAuth.setUser(merged);

      setSuccessMessage("Cập nhật hồ sơ cá nhân thành công!");
      setIsEditing(false);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "Không thể cập nhật hồ sơ lúc này.");
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi mật khẩu
  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại.";
    if (!passwordForm.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới.";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Mật khẩu mới phải có tối thiểu 6 ký tự.";
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới.";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validatePasswordForm()) {
      setErrorMessage("Vui lòng điền đúng và đủ các trường thay đổi mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      await customerAuthService.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      setSuccessMessage("Đổi mật khẩu thành công!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || "Đổi mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const handleLogout = () => {
    customerAuth.clearAuth();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const maxDobDate = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#FAF5F5] text-[#261A1E] font-sans selection:bg-[#B85064]/20 selection:text-[#B85064] relative overflow-hidden">
      {/* Cành hoa đào trang trí góc trên nền trắng hồng giống các trang khác */}
      <FloralBranchCorner position="top-right" opacity="opacity-75" className="top-24 z-10 pointer-events-none" />
      <FloralBranchCorner position="bottom-left" opacity="opacity-60" className="bottom-96 z-10 pointer-events-none" />

      {/* ========================================================================= */}
      {/* 1. HERO BANNER: CHỈ GIỮ HÌNH NỀN, ĐƯỜNG DẪN BREADCRUMB VÀ TÊN TRANG */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[220px] sm:min-h-[250px] bg-[#141012] overflow-hidden flex items-center pt-24 pb-10">
        {/* Hình nền nhiếp ảnh gia */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-75 scale-105 pointer-events-none transition-transform duration-1000"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85)',
          }}
        />
        {/* Gradient bóng mờ điện ảnh chuyển mượt sang màu trắng hồng #FAF5F5 */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141012]/92 via-[#141012]/65 to-[#141012]/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF5F5] pointer-events-none" />

        {/* Ambient spotlight hồng nhẹ */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[260px] bg-rose-500/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
          {/* Breadcrumb: Trang Chủ / Thông Tin Tài Khoản */}
          <div className="flex items-center gap-2 text-xs text-neutral-300 mb-3">
            <Link to={ROUTES.USER.HOME} className="hover:text-[#E899A8] transition-colors">
              Trang Chủ
            </Link>
            <span>/</span>
            <span className="text-[#E899A8] font-semibold">Thông Tin Tài Khoản</span>
          </div>

          {/* Tên của trang */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-serif-luxury tracking-tight">
            Thông Tin Tài Khoản
          </h1>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PHẦN HỒ SƠ CÁ NHÂN (BỐ CỤC THEO ĐÚNG HÌNH BẠN YÊU CẦU) */}
      {/* ========================================================================= */}
      <section className="relative w-full pb-20 pt-8 px-4 sm:px-6 lg:px-8">
        
        {/* DÒNG CHỮ NGHỆ THUẬT GÓC TRÊN PHẢI (Capture Your Best Moments ♡) */}
        <div className="max-w-7xl mx-auto flex justify-end mb-4 pr-4 sm:pr-8">
          <span 
            style={{ fontFamily: "'Alex Brush', cursive" }}
            className="text-2xl sm:text-3xl md:text-4xl text-[#BE4B5E] tracking-wider select-none pointer-events-none drop-shadow-sm"
          >
            Capture Your Best Moments ♡
          </span>
        </div>

        {/* File input ẩn dùng để upload ảnh đại diện */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="max-w-7xl mx-auto">
          {/* Layout: Cột trái (Sidebar tối) + Cột phải (Panel trắng lớn) - chiều cao 2 cột luôn bằng nhau */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            
            {/* -----------------------------------------------------------------
                A. CỘT TRÁI: SIDEBAR ĐIỀU HƯỚNG TỐI (CHIỀU CAO LUÔN BẰNG BÊN PHẢI)
               ----------------------------------------------------------------- */}
            <aside className="w-full lg:w-64 shrink-0 self-stretch bg-[#160E11]/90 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Nút Trang chủ */}
                <Link
                  to={ROUTES.USER.HOME}
                  className="inline-flex items-center gap-2.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <HomeIcon className="w-4 h-4 text-gray-400" />
                  <span>Trang chủ</span>
                </Link>

                {/* Tiêu đề mục: TÀI KHOẢN */}
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-3 px-1">
                  Tài khoản
                </div>

                {/* Danh sách 5 mục menu đồng nhất phông chữ theo hình */}
                <nav className="space-y-1">
                  {/* 1. Thông tin cá nhân */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("profile");
                      setIsEditing(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      activeTab === "profile"
                        ? "bg-[#BE4B5E] text-white shadow-md shadow-[#BE4B5E]/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UserIcon className="w-4 h-4 shrink-0" />
                    <span>Thông tin cá nhân</span>
                  </button>

                  {/* 2. Đơn đặt lịch */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("bookings");
                      setIsEditing(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      activeTab === "bookings"
                        ? "bg-[#BE4B5E] text-white shadow-md shadow-[#BE4B5E]/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <CalendarDaysIcon className="w-4 h-4 shrink-0" />
                    <span>Đơn đặt lịch</span>
                  </button>

                  {/* 3. Đánh giá của tôi */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("reviews");
                      setIsEditing(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      activeTab === "reviews"
                        ? "bg-[#BE4B5E] text-white shadow-md shadow-[#BE4B5E]/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <StarIcon className="w-4 h-4 shrink-0" />
                    <span>Đánh giá của tôi</span>
                  </button>

                  {/* 4. Đổi mật khẩu */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("password");
                      setIsEditing(false);
                    }}
                    className={`cursor-pointer w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      activeTab === "password"
                        ? "bg-[#BE4B5E] text-white shadow-md shadow-[#BE4B5E]/30"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <KeyIcon className="w-4 h-4 shrink-0" />
                    <span>Đổi mật khẩu</span>
                  </button>
                </nav>
              </div>

              {/* Dưới cùng sidebar: Every frame is a story... ♡ (luôn nằm đáy cột trái) */}
              <div className="pt-8 text-center relative select-none pointer-events-none mt-auto">
                <p
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                  className="text-pink-300/85 text-xl tracking-wide drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]"
                >
                  Every frame is a story... ♡
                </p>
                <div className="w-20 h-20 bg-rose-500/10 rounded-full blur-2xl mx-auto -mt-6" />
              </div>
            </aside>

            {/* -----------------------------------------------------------------
                B. CỘT PHẢI: KHUNG TRẮNG LỚN (THEO ĐÚNG HÌNH)
               ----------------------------------------------------------------- */}
            <main className="flex-1 w-full bg-white text-[#2A1D22] rounded-[28px] p-6 sm:p-9 shadow-xl border border-pink-100/70 relative overflow-hidden">
              {/* CÀNH HOA ĐÀO GÓC TRÊN PHẢI KHUNG TRẮNG */}
              <div className="absolute top-0 right-0 w-64 h-52 pointer-events-none opacity-40 select-none overflow-hidden">
                <FloralBranchCorner position="top-right" />
              </div>

              {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button onClick={() => setErrorMessage("")} className="p-1 hover:text-black">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                  <button onClick={() => setSuccessMessage("")} className="p-1 hover:text-black">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* PHẦN ĐẦU HỒ SƠ (HERO USER HEADER) */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10 pb-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  {/* Avatar tròn với nút icon máy ảnh ở góc */}
                  <div className="relative group shrink-0">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] cursor-pointer relative"
                      title="Nhấn để thay đổi ảnh đại diện"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullname || user.username}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                        style={{ display: user?.avatar ? "none" : "flex" }}
                      >
                        {getInitialLetter(user?.fullname, user?.username)}
                      </div>

                      {/* Lớp phủ đổi ảnh khi hover */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[11px] font-medium gap-1">
                        <CameraIcon className="w-5 h-5 drop-shadow-sm" />
                        <span>Đổi ảnh</span>
                      </div>
                    </div>

                    {/* Nút camera tròn màu hồng ở góc dưới avatar */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      title="Thay đổi ảnh đại diện"
                      className="cursor-pointer absolute bottom-0 right-0 p-2 rounded-full bg-[#BE4B5E] hover:bg-[#a63d4f] text-white shadow-md border-2 border-white transition-transform hover:scale-110 active:scale-95 z-10"
                    >
                      {isUploadingAvatar ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <CameraIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Thông tin: Tên, Khách hàng, Email, SĐT, Địa chỉ, Châm ngôn */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#261A1E]">
                        {user?.fullname || user?.username || "Chưa có thông tin"}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDF0F3] text-[#BE4B5E] text-xs font-medium border border-pink-100">
                        {user?.role === "ADMIN" ? "Quản trị viên" : user?.role === "EMPLOYEE" ? "Nhân viên" : "Khách hàng"}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-500 pt-1">
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{user?.email || "Chưa có thông tin"}</span>
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <PhoneIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className={!user?.phone ? "text-gray-400 italic" : ""}>
                          {user?.phone || "Chưa có thông tin"}
                        </span>
                      </p>
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <MapPinIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className={`truncate max-w-[280px] ${!user?.address ? "text-gray-400 italic" : ""}`} title={user?.address || "Chưa có thông tin"}>
                          {user?.address || "Chưa có thông tin"}
                        </span>
                      </p>
                    </div>

                    <p className="text-xs italic text-gray-400 pt-1">
                      “Lưu giữ những khoảnh khắc đẹp nhất của cuộc sống!” ♡
                    </p>
                  </div>
                </div>

                {/* Nút bấm góc trên phải: Chỉnh sửa thông tin */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    if (isEditing) {
                      setIsEditing(false);
                    } else {
                      handleStartEdit();
                    }
                  }}
                  className="cursor-pointer self-center sm:self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#2A1D22] text-xs font-medium border border-gray-200/80 shadow-xs transition-all hover:scale-105 active:scale-95"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5 text-gray-500" />
                  <span>{isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}</span>
                </button>
              </div>

              {/* THANH TAB ĐIỀU HƯỚNG NGANG */}
              <div className="flex items-center gap-8 border-b border-gray-100 overflow-x-auto text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditing(false);
                  }}
                  className={`inline-flex items-center gap-2 py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "profile"
                      ? "text-[#BE4B5E] border-[#BE4B5E] font-semibold"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Thông tin cá nhân</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("bookings");
                    setIsEditing(false);
                  }}
                  className={`inline-flex items-center gap-2 py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "bookings"
                      ? "text-[#BE4B5E] border-[#BE4B5E] font-semibold"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>Đơn đặt lịch</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("reviews");
                    setIsEditing(false);
                  }}
                  className={`inline-flex items-center gap-2 py-3.5 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-[#BE4B5E] border-[#BE4B5E] font-semibold"
                      : "text-gray-500 border-transparent hover:text-gray-800"
                  }`}
                >
                  <StarIcon className="w-4 h-4" />
                  <span>Đánh giá</span>
                </button>

                </div>

              {/* NỘI DUNG CHÍNH DƯỚI TAB */}
              <div className="pt-6">
                
                {/* TAB 1: THÔNG TIN CÁ NHÂN */}
                {activeTab === "profile" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
                    
                    {/* Cột trái (8/12): Card Thông tin cá nhân (6 hàng) */}
                    <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
                      <h3 className="font-bold text-sm sm:text-base text-[#261A1E] mb-5">
                        {isEditing ? "Chỉnh sửa thông tin cá nhân" : "Thông tin cá nhân"}
                      </h3>

                      {isEditing ? (
                        // FORM CHỈNH SỬA THÔNG TIN (ĐỒNG BỘ Y HỆT GIAO DIỆN BẢNG XEM THÔNG TIN)
                        <form onSubmit={handleSaveProfile} className="space-y-4">
                          <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                            {/* Hàng 0: Ảnh đại diện */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <CameraIcon className="w-4 h-4 text-gray-400" />
                                <span>Ảnh đại diện</span>
                              </div>
                              <div className="flex-1 flex items-center gap-3">
                                <div
                                  onClick={() => fileInputRef.current?.click()}
                                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center cursor-pointer hover:border-[#BE4B5E] transition-colors relative group shadow-2xs"
                                  title="Nhấn để đổi ảnh mới"
                                >
                                  {editForm.avatar || user?.avatar ? (
                                    <img
                                      src={editForm.avatar || user?.avatar}
                                      alt="Avatar"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400"
                                    style={{ display: (editForm.avatar || user?.avatar) ? "none" : "flex" }}
                                  >
                                    {getInitialLetter(editForm.fullname || user?.fullname, editForm.username || user?.username)}
                                  </div>
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                    <CameraIcon className="w-4 h-4" />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  disabled={isUploadingAvatar}
                                  className="cursor-pointer px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#BE4B5E] hover:text-[#BE4B5E] text-xs font-medium text-gray-700 bg-white transition-all flex items-center gap-2 shadow-2xs"
                                >
                                  {isUploadingAvatar ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-[#BE4B5E] border-t-transparent rounded-full animate-spin" />
                                      <span>Đang tải ảnh...</span>
                                    </>
                                  ) : (
                                    <>
                                      <PhotoIcon className="w-3.5 h-3.5 text-[#BE4B5E]" />
                                      <span>Thay đổi hình ảnh</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Hàng 1: Họ và tên */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span>Họ và tên <span className="text-rose-500">*</span></span>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={editForm.fullname}
                                  placeholder="Chưa có thông tin"
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, fullname: e.target.value });
                                    if (fieldErrors.fullname) setFieldErrors({ ...fieldErrors, fullname: "" });
                                  }}
                                  className="w-full px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none placeholder:text-gray-400"
                                />
                                {fieldErrors.fullname && (
                                  <p className="mt-1 text-xs text-rose-500">{fieldErrors.fullname}</p>
                                )}
                              </div>
                            </div>

                            {/* Hàng 2: Email */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                <span>Email <span className="text-rose-500">*</span></span>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="email"
                                  value={editForm.email}
                                  placeholder="Chưa có thông tin"
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, email: e.target.value });
                                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                                  }}
                                  className="w-full px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none placeholder:text-gray-400"
                                />
                                {fieldErrors.email && (
                                  <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>
                                )}
                              </div>
                            </div>

                            {/* Hàng 3: Số điện thoại */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <PhoneIcon className="w-4 h-4 text-gray-400" />
                                <span>Số điện thoại</span>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="tel"
                                  maxLength={10}
                                  value={editForm.phone}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, phone: e.target.value });
                                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                                  }}
                                  placeholder="Chưa có thông tin"
                                  className="w-full px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none placeholder:text-gray-400"
                                />
                                <span className="text-[11px] text-gray-400 block mt-1">10 số, bắt đầu bằng 0 (03, 05, 07, 08, 09)</span>
                                {fieldErrors.phone && (
                                  <p className="mt-1 text-xs text-rose-500">{fieldErrors.phone}</p>
                                )}
                              </div>
                            </div>

                            {/* Hàng 4: Ngày sinh */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span>Ngày sinh</span>
                              </div>
                              <div className="flex-1">
                                <input
                                  type="date"
                                  max={maxDobDate}
                                  value={editForm.dateOfBirth}
                                  onChange={(e) => {
                                    setEditForm({ ...editForm, dateOfBirth: e.target.value });
                                    if (fieldErrors.dateOfBirth) setFieldErrors({ ...fieldErrors, dateOfBirth: "" });
                                  }}
                                  className="w-full sm:w-64 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none"
                                />
                                <span className="text-[11px] text-gray-400 block mt-1">Yêu cầu từ đủ 13 tuổi trở lên</span>
                                {fieldErrors.dateOfBirth && (
                                  <p className="mt-1 text-xs text-rose-500">{fieldErrors.dateOfBirth}</p>
                                )}
                              </div>
                            </div>

                            {/* Hàng 5: Giới tính */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span>Giới tính</span>
                              </div>
                              <div className="flex-1">
                                <div className="inline-flex gap-2">
                                  {[
                                    { id: "FEMALE", label: "Nữ" },
                                    { id: "MALE", label: "Nam" },
                                    { id: "OTHER", label: "Khác" },
                                  ].map((g) => {
                                    const isSelected =
                                      editForm.gender &&
                                      editForm.gender.toUpperCase() === g.id;
                                    return (
                                      <button
                                        key={g.id}
                                        type="button"
                                        onClick={() =>
                                          setEditForm({
                                            ...editForm,
                                            gender: isSelected ? "" : g.id,
                                          })
                                        }
                                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                          isSelected
                                            ? "bg-[#BE4B5E] text-white border-[#BE4B5E] shadow-xs"
                                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                                        }`}
                                      >
                                        {g.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Hàng 6: Địa chỉ */}
                            <div className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                              <div className="flex items-center gap-3 text-gray-500 w-36 sm:w-44 shrink-0 pt-2">
                                <MapPinIcon className="w-4 h-4 text-gray-400" />
                                <span>Địa chỉ</span>
                              </div>
                              <div className="flex-1">
                                <textarea
                                  ref={addressTextareaRef}
                                  rows={1}
                                  value={editForm.address}
                                  onChange={handleAddressChange}
                                  placeholder="Chưa có thông tin"
                                  style={{ minHeight: "38px", maxHeight: "84px" }}
                                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm leading-relaxed border border-gray-200 focus:border-[#BE4B5E] focus:outline-none placeholder:text-gray-400 break-words [overflow-wrap:anywhere] [word-break:break-word] resize-none overflow-y-auto transition-all"
                                />
                                {fieldErrors.address && (
                                  <p className="mt-1 text-xs text-rose-500">{fieldErrors.address}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              disabled={isLoading}
                              className="cursor-pointer px-4 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              disabled={isLoading}
                              className="cursor-pointer px-5 py-2 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                            >
                              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                            </button>
                          </div>
                        </form>
                      ) : (
                        // BẢNG 6 HÀNG XEM THÔNG TIN CÁ NHÂN (THEO CSDL THỰC TẾ)
                        <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                          {/* Hàng 1: Họ và tên */}
                          <div className="py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0">
                              <UserIcon className="w-4 h-4 text-gray-400" />
                              <span>Họ và tên</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left">
                              {user?.fullname || user?.username || (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Hàng 2: Email */}
                          <div className="py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              <span>Email</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left">
                              {user?.email || (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Hàng 3: Số điện thoại */}
                          <div className="py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <span>Số điện thoại</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left">
                              {user?.phone ? (
                                user.phone
                              ) : (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Hàng 4: Ngày sinh */}
                          <div className="py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0">
                              <CalendarIcon className="w-4 h-4 text-gray-400" />
                              <span>Ngày sinh</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left">
                              {user?.dateOfBirth ? (
                                new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                              ) : (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Hàng 5: Giới tính */}
                          <div className="py-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0">
                              <UserIcon className="w-4 h-4 text-gray-400" />
                              <span>Giới tính</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left">
                              {user?.gender === "FEMALE" || user?.gender === "Female" ? (
                                "Nữ"
                              ) : user?.gender === "MALE" || user?.gender === "Male" ? (
                                "Nam"
                              ) : user?.gender === "OTHER" || user?.gender === "Other" ? (
                                "Khác"
                              ) : (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Hàng 6: Địa chỉ */}
                          <div className="py-3.5 flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 text-gray-500 w-36 shrink-0 pt-0.5">
                              <MapPinIcon className="w-4 h-4 text-gray-400" />
                              <span>Địa chỉ</span>
                            </div>
                            <span className="font-medium text-[#261A1E] flex-1 text-left break-words [overflow-wrap:anywhere] [word-break:break-word] line-clamp-3 leading-relaxed">
                              {user?.address ? (
                                user.address
                              ) : (
                                <span className="text-gray-400 italic font-normal">Chưa có thông tin</span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={handleStartEdit}
                              className="text-gray-400 hover:text-[#BE4B5E] p-1 transition-colors shrink-0"
                              title="Chỉnh sửa"
                            >
                              <PencilSquareIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cột phải (4/12): 3 thẻ (Ảnh đại diện, Liên kết nhanh, Bạn cần hỗ trợ) */}
                    <div className="lg:col-span-4 space-y-4">
                      
                      {/* Thẻ 1: Ảnh đại diện */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs">
                        <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-3">
                          Ảnh đại diện
                        </h4>
                        <div className="flex items-center gap-4">
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-200 bg-gradient-to-tr from-[#BE4B5E] to-[#E295A2] cursor-pointer hover:opacity-90 transition-opacity relative group"
                            title="Nhấn để đổi ảnh"
                          >
                            {user?.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.fullname || user.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full flex items-center justify-center text-lg font-bold text-white"
                              style={{ display: user?.avatar ? "none" : "flex" }}
                            >
                              {getInitialLetter(user?.fullname, user?.username)}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <CameraIcon className="w-4 h-4" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-[#2A1D22] text-xs font-medium border border-gray-200 transition-colors shadow-2xs"
                          >
                            {isUploadingAvatar ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-[#BE4B5E] border-t-transparent rounded-full animate-spin" />
                                <span>Đang tải ảnh...</span>
                              </>
                            ) : (
                              <>
                                <CameraIcon className="w-3.5 h-3.5 text-[#BE4B5E]" />
                                <span>Thay đổi ảnh</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Thẻ 2: Liên kết nhanh */}
                      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-2">
                        <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2">
                          Liên kết nhanh
                        </h4>
                        <button
                          type="button"
                          onClick={() => setActiveTab("password")}
                          className="cursor-pointer w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-[#2A1D22] hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <LockClosedIcon className="w-4 h-4 text-gray-400" />
                            <span>Đổi mật khẩu</span>
                          </div>
                          <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="cursor-pointer w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-400" />
                            <span>Đăng xuất</span>
                          </div>
                          <ArrowRightIcon className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>

                      {/* Thẻ 3: Bạn cần hỗ trợ? (Gradient hồng nhạt + cành đào) */}
                      <div className="bg-gradient-to-br from-[#FFF0F3] to-[#FDF5F6] border border-[#FADDE3] rounded-2xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-36 h-28 pointer-events-none opacity-40 overflow-hidden">
                          <FloralBranchCorner position="top-right" />
                        </div>

                        <div className="flex items-center gap-3 mb-2.5 relative z-10">
                          <div className="w-8 h-8 rounded-xl bg-[#BE4B5E] text-white flex items-center justify-center shrink-0 shadow-sm">
                            <CameraIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#2A1D22]">Bạn cần hỗ trợ?</h4>
                            <p className="text-[11px] text-gray-500">Liên hệ với chúng tôi qua:</p>
                          </div>
                        </div>

                        <div className="space-y-1 pl-11 text-xs text-gray-600 relative z-10">
                          <p className="flex items-center gap-1.5 font-medium text-[#2A1D22]">
                            <PhoneIcon className="w-3 h-3 text-[#BE4B5E]" />
                            <span>0987 654 321</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <EnvelopeIcon className="w-3 h-3 text-[#BE4B5E]" />
                            <span className="truncate">support@photostudio.vn</span>
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 2: ĐƠN ĐẶT LỊCH */}
                {activeTab === "bookings" && (() => {
                  const filtered = bookings.filter((b) => {
                    if (bookingFilter === "all") return true;
                    return b.status === bookingFilter;
                  });
                  const totalPages = Math.ceil(filtered.length / BOOKINGS_PER_PAGE) || 1;
                  const currentPage = Math.min(bookingCurrentPage, totalPages);
                  const paginated = filtered.slice((currentPage - 1) * BOOKINGS_PER_PAGE, currentPage * BOOKINGS_PER_PAGE);

                  return (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-fade-in space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-[#261A1E]">
                            Đơn đặt lịch của tôi
                          </h3>
                          <p className="text-xs text-gray-500">
                            Theo dõi lịch hẹn chụp ảnh và hóa đơn của bạn tại Studio ({filtered.length} đơn)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.USER.BOOKING)}
                          className="px-4 py-2 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
                        >
                          + Đặt lịch mới
                        </button>
                      </div>

                      {/* Bộ lọc trạng thái đơn */}
                      <div className="flex flex-wrap items-center gap-1.5 pb-2">
                        {[
                          { id: "all", label: "Tất cả" },
                          { id: "pending", label: "Chờ xác nhận" },
                          { id: "confirmed", label: "Đã xác nhận" },
                          { id: "completed", label: "Hoàn thành" },
                          { id: "cancelled", label: "Đã hủy" },
                        ].map((tab) => {
                          const count = tab.id === "all" ? bookings.length : bookings.filter((b) => b.status === tab.id).length;
                          const isActive = bookingFilter === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => {
                                setBookingFilter(tab.id);
                                setBookingCurrentPage(1);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#BE4B5E] text-white shadow-xs font-semibold"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {tab.label} ({count})
                            </button>
                          );
                        })}
                      </div>

                      {bookingsLoading ? (
                        <div className="py-12 text-center text-gray-400">
                          <div className="w-6 h-6 border-2 border-[#BE4B5E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs">Đang tải danh sách lịch đặt...</p>
                        </div>
                      ) : paginated.length === 0 ? (
                        <div className="py-12 text-center rounded-2xl bg-gray-50/70 border border-gray-100 p-6">
                          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-[#BE4B5E] flex items-center justify-center mx-auto mb-3">
                            <CalendarDaysIcon className="w-7 h-7" />
                          </div>
                          <h4 className="text-base font-bold text-[#261A1E] mb-1">
                            Không có đơn đặt lịch nào
                          </h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                            Không tìm thấy lịch chụp nào phù hợp với bộ lọc hiện tại.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate(ROUTES.USER.BOOKING)}
                            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <CalendarDaysIcon className="w-4 h-4 text-white" />
                            <span>Đặt lịch ngay</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {paginated.map((b) => {
                            const statusBadge =
                              b.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : b.status === "confirmed"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : b.status === "cancelled"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-blue-50 text-blue-700 border-blue-200";

                            const statusLabel =
                              b.status === "completed"
                                ? "Đã hoàn thành"
                                : b.status === "confirmed"
                                ? "Đã xác nhận"
                                : b.status === "cancelled"
                                ? "Đã hủy"
                                : "Chờ xác nhận";

                            return (
                              <div
                                key={b.id}
                                className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:border-pink-200 transition-all space-y-3.5"
                              >
                                {/* Hàng 1: Ảnh đại diện + Tên gói + Mã đơn + Trạng thái đơn + Nhãn thời gian */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                                  <div className="flex items-center gap-3.5">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                      <img
                                        src={b.packageImage}
                                        alt={b.packageName}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h4 className="font-bold text-sm sm:text-base text-[#261A1E]">
                                          {b.packageName}
                                        </h4>
                                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                                          #BK-{b.id}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.timeLabelClass}`}>
                                          {b.timeLabel}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-1.5">
                                        <span className="font-medium text-gray-700">{b.roomName}</span>
                                        <span>•</span>
                                        <span>Bối cảnh: {b.backgroundName}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="self-start sm:self-auto">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge}`}>
                                      {statusLabel}
                                    </span>
                                  </div>
                                </div>

                                {/* Hàng 2: Chi tiết ca chụp */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                  <div>
                                    <span className="text-gray-400 block text-[11px]">Ngày chụp:</span>
                                    <strong className="text-gray-800">{b.dayOfWeekAndDate}</strong>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block text-[11px]">Khung giờ:</span>
                                    <strong className="text-gray-800">{b.startTime} – {b.endTime}</strong>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block text-[11px]">Số lượng & Ekip:</span>
                                    <strong className="text-gray-800">{b.quantity} gói • {b.staffCount} nhân sự</strong>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 block text-[11px]">Đánh giá:</span>
                                    {b.review ? (
                                      <span className="text-amber-500 font-bold flex items-center gap-1">
                                        <StarIcon className="w-3.5 h-3.5 fill-amber-400" />
                                        {b.review.rating || 5}.0 (Đã đánh giá)
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic font-normal">Chưa đánh giá</span>
                                    )}
                                  </div>
                                </div>

                                {/* Hàng 3: Tổng tiền + Trạng thái thanh toán + Các nút hành động */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <span className="text-[11px] text-gray-400 block">Tổng tiền:</span>
                                      <strong className="text-sm sm:text-base font-bold text-[#BE4B5E]">
                                        {Number(b.totalPrice || 0).toLocaleString("vi-VN")} đ
                                      </strong>
                                    </div>
                                    <div className="h-6 w-px bg-gray-200" />
                                    <div>
                                      <span className="text-[11px] text-gray-400 block">Thanh toán:</span>
                                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${b.paymentBadgeClass}`}>
                                        {b.paymentStatusText}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Cụm nút hành động */}
                                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedBookingForDetail(b);
                                        setIsDetailModalOpen(true);
                                      }}
                                      className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all shadow-2xs"
                                    >
                                      Chi tiết
                                    </button>

                                    {(b.status === "pending" || b.status === "confirmed") && (
                                      <button
                                        type="button"
                                        onClick={() => handleCancelBooking(b.id)}
                                        className="cursor-pointer px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-all shadow-2xs"
                                      >
                                        Hủy lịch
                                      </button>
                                    )}

                                    {b.status === "completed" && !b.review && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedBookingForDetail(b);
                                          setIsDetailModalOpen(true);
                                        }}
                                        className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-all shadow-2xs flex items-center gap-1"
                                      >
                                        <StarIcon className="w-3.5 h-3.5" />
                                        <span>Đánh giá</span>
                                      </button>
                                    )}

                                    {(b.status === "completed" || b.status === "cancelled") && (
                                      <button
                                        type="button"
                                        onClick={handleRebook}
                                        className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold transition-all shadow-2xs"
                                      >
                                        Đặt lại
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* THANH PHÂN TRANG 2 ĐƠN / TRANG */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                              <span>
                                Trang {currentPage} / {totalPages} (Tổng {filtered.length} đơn)
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={currentPage <= 1}
                                  onClick={() => setBookingCurrentPage((p) => Math.max(1, p - 1))}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
                                >
                                  Trước
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                  <button
                                    key={i + 1}
                                    type="button"
                                    onClick={() => setBookingCurrentPage(i + 1)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      currentPage === i + 1
                                        ? "bg-[#BE4B5E] text-white shadow-xs"
                                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  disabled={currentPage >= totalPages}
                                  onClick={() => setBookingCurrentPage((p) => Math.min(totalPages, p + 1))}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
                                >
                                  Sau
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* TAB 3: ĐÁNH GIÁ */}
                {activeTab === "reviews" && (() => {
                  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE) || 1;
                  const currentPage = Math.min(reviewCurrentPage, totalPages);
                  const paginated = reviews.slice((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE);

                  return (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-fade-in space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-[#261A1E]">
                            Đánh giá của tôi
                          </h3>
                          <p className="text-xs text-gray-500">
                            Xem lại các đánh giá về buổi chụp ảnh của bạn ({reviews.length} đánh giá)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(ROUTES.USER.REVIEWS)}
                          className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200 transition-colors"
                        >
                          Xem tất cả đánh giá
                        </button>
                      </div>

                      {reviewsLoading ? (
                        <div className="py-12 text-center text-gray-400">
                          <div className="w-6 h-6 border-2 border-[#BE4B5E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs">Đang tải bài đánh giá...</p>
                        </div>
                      ) : paginated.length === 0 ? (
                        <div className="py-12 text-center rounded-2xl bg-gray-50/70 border border-gray-100 p-6">
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                            <StarIcon className="w-7 h-7 text-amber-400" />
                          </div>
                          <h4 className="text-base font-bold text-[#261A1E] mb-1">
                            Chưa có bài đánh giá
                          </h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                            Bạn chưa có bài đánh giá nào cho các buổi chụp ảnh tại PhotoStudio.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate(ROUTES.USER.REVIEWS)}
                            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <StarIcon className="w-4 h-4 text-amber-300" />
                            <span>Đến trang đánh giá</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {paginated.map((rev) => (
                            <div key={rev.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-4 h-4 ${i < (rev.rating || 5) ? "text-amber-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                  <span className="text-xs font-bold text-gray-800 ml-1.5">{rev.rating || 5}/5</span>
                                </div>
                                <span className="text-[11px] text-gray-400">
                                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("vi-VN") : "Gần đây"}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {rev.comment || rev.content || "Chất lượng hình ảnh và phục vụ rất tuyệt vời!"}
                              </p>

                              {/* Phản hồi từ Quản trị viên / PhotoStudio */}
                              {rev.adminReply && (
                                <div className="mt-2.5 p-3 rounded-xl bg-[#FDF0F3]/90 border border-[#F5D5DC] text-xs space-y-1 ml-1 sm:ml-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 font-bold text-[#BE4B5E]">
                                      <ShieldCheckIcon className="w-3.5 h-3.5 text-[#BE4B5E]" />
                                      <span>PhotoStudio phản hồi:</span>
                                    </div>
                                    {rev.adminRepliedAt && (
                                      <span className="text-[10px] text-gray-400">
                                        {new Date(rev.adminRepliedAt).toLocaleDateString("vi-VN", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[#3E2F35] font-normal leading-relaxed pl-5 italic text-[11.5px]">
                                    "{rev.adminReply}"
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* THANH PHÂN TRANG 5 ĐÁNH GIÁ / TRANG */}
                          {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                              <span>
                                Trang {currentPage} / {totalPages} (Tổng {reviews.length} đánh giá)
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={currentPage <= 1}
                                  onClick={() => setReviewCurrentPage((p) => Math.max(1, p - 1))}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
                                >
                                  Trước
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                  <button
                                    key={i + 1}
                                    type="button"
                                    onClick={() => setReviewCurrentPage(i + 1)}
                                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                      currentPage === i + 1
                                        ? "bg-[#BE4B5E] text-white shadow-xs"
                                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  disabled={currentPage >= totalPages}
                                  onClick={() => setReviewCurrentPage((p) => Math.min(totalPages, p + 1))}
                                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-medium"
                                >
                                  Sau
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* TAB 4: ĐỔI MẬT KHẨU */}
                {activeTab === "password" && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-fade-in max-w-md mx-auto">
                    <h3 className="font-bold text-sm sm:text-base text-[#261A1E] text-center mb-1">
                      Đổi mật khẩu tài khoản
                    </h3>
                    <p className="text-xs text-gray-400 text-center mb-5">
                      Để bảo mật, vui lòng không chia sẻ mật khẩu của bạn với người khác
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu hiện tại <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showOldPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordErrors.oldPassword && (
                          <p className="mt-1 text-xs text-rose-500">{passwordErrors.oldPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mật khẩu mới <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showNewPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-xs text-rose-500">{passwordErrors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 focus:border-[#BE4B5E] focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          >
                            {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-xs text-rose-500">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer w-full py-2.5 rounded-xl bg-[#BE4B5E] hover:bg-[#a53b4d] text-white text-xs font-semibold shadow-sm transition-all mt-2"
                      >
                        {isLoading ? "Đang lưu..." : "Cập nhật mật khẩu"}
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </main>
          </div>
        </div>

        {/* Modal chi tiết lịch chụp & Hóa đơn */}
        {isDetailModalOpen && selectedBookingForDetail && (
          <BookingSessionDetailModal
            booking={selectedBookingForDetail}
            isOpen={isDetailModalOpen}
            currentUser={user}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedBookingForDetail(null);
            }}
            onBookingCancelled={() => {
              if (user) fetchRealBookings(user);
            }}
            onReviewSubmitted={() => {
              if (user) {
                fetchRealBookings(user);
                fetchMyReviews(user);
              }
            }}
          />
        )}
      </section>
    </div>
  );
}
