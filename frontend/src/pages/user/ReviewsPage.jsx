import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  StarIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  XMarkIcon,
  HeartIcon,
  CameraIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";

import BlurText from "../../components/animations/BlurText";
import ScrollReveal from "../../components/animations/ScrollReveal";
import CountUp from "../../components/animations/CountUp";
import {
  FloralBranchCorner,
  ScatteredPetals,
} from "../../components/common/FloralDecorations";
import { ROUTES } from "../../routes/web";
import { customerAuth } from "../../lib/axiosCustomer";
import customerReviewService from "../../services/user/reviewService";
import customerBookingService from "../../services/user/bookingService";

const ITEMS_PER_PAGE = 6;

export default function ReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Viết Đánh Giá
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requireRoleModalOpen, setRequireRoleModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    customerName: "",
    rating: 5,
    packageName: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const reviewsSectionRef = useRef(null);
  const ratingDropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        ratingDropdownRef.current &&
        !ratingDropdownRef.current.contains(event.target)
      ) {
        setIsRatingDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lấy dữ liệu từ CSDL qua API
  useEffect(() => {
    let isMounted = true;

    customerReviewService
      .getAllReviews()
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          const mapped = data.map((item) => ({
            id: item.id,
            bookingId: item.bookingId || item.id,
            customerId: item.customerId,
            customerName: item.customerName || "Khách hàng PhotoStudio",
            rating: typeof item.rating === "number" ? item.rating : 5.0,
            comment: item.comment || "",
            createdAt: item.createdAt || new Date().toISOString(),
            packageName: item.packageName || "Dịch Vụ Nhiếp Ảnh Chuyên Nghiệp",
            category: item.category || "portrait",
            avatar: item.avatar || null,
            adminReply: item.adminReply || null,
            adminRepliedAt: item.adminRepliedAt || null,
          }));
          setReviews(mapped);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => {
        console.warn("[ReviewsPage] Lỗi khi tải đánh giá từ API:", err.message);
        setReviews([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Tính toán số liệu thống kê
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0)
      return {
        avg: 5.0,
        total: 0,
        count5: 0,
        count4: 0,
        count3: 0,
        count2: 0,
        count1: 0,
        satisfaction: 100,
      };

    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    const count5 = reviews.filter(
      (r) => Math.round(Number(r.rating) || 5) === 5,
    ).length;
    const count4 = reviews.filter(
      (r) => Math.round(Number(r.rating) || 5) === 4,
    ).length;
    const count3 = reviews.filter(
      (r) => Math.round(Number(r.rating) || 5) === 3,
    ).length;
    const count2 = reviews.filter(
      (r) => Math.round(Number(r.rating) || 5) === 2,
    ).length;
    const count1 = reviews.filter(
      (r) => Math.round(Number(r.rating) || 5) === 1,
    ).length;
    const satisfaction = (((count5 + count4) / total) * 100).toFixed(1);

    return { avg, total, count5, count4, count3, count2, count1, satisfaction };
  }, [reviews]);

  // Đếm số lượng theo từng mức sao cho menu xổ xuống
  const ratingCounts = useMemo(() => {
    return {
      all: reviews.length,
      5: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 5).length,
      4: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 4).length,
      3: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 3).length,
      2: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 2).length,
      1: reviews.filter((r) => Math.round(Number(r.rating) || 5) === 1).length,
    };
  }, [reviews]);

  // Bộ lọc dữ liệu (Lọc theo gói chụp, "Đánh giá của tôi" & số sao)
  const filteredReviews = useMemo(() => {
    const isAuth = customerAuth.isAuthenticated();
    const currentUser = customerAuth.getUser();

    return reviews.filter((r) => {
      // 1. Lọc theo Category gói chụp hoặc "Đánh giá của tôi"
      if (selectedCategory === "my_reviews") {
        if (!isAuth || !currentUser) return false;
        const matchId = currentUser.id && Number(r.customerId) === Number(currentUser.id);
        const matchName =
          (currentUser.fullname && r.customerName === currentUser.fullname) ||
          (currentUser.username && r.customerName === currentUser.username);
        if (!matchId && !matchName) return false;
      } else if (selectedCategory !== "all" && r.category !== selectedCategory) {
        return false;
      }
      // 2. Lọc theo số sao xổ xuống (1, 2, 3, 4, 5 sao)
      if (selectedRatingFilter !== "all") {
        const reviewStar = Math.round(Number(r.rating) || 5);
        if (reviewStar !== Number(selectedRatingFilter)) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, selectedCategory, selectedRatingFilter]);

  // Phân trang
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / ITEMS_PER_PAGE),
  );
  const currentReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (reviewsSectionRef.current) {
        reviewsSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSelectRatingFilter = (ratingValue) => {
    setSelectedRatingFilter(ratingValue);
    setIsRatingDropdownOpen(false);
    setCurrentPage(1);
  };

  // Mở modal viết đánh giá (Chỉ dành cho người dùng đã có role hợp lệ)
  const handleOpenReviewModal = async () => {
    const isAuth = customerAuth.isAuthenticated();
    const user = customerAuth.getUser();

    // Nếu chưa đăng nhập hoặc tài khoản chưa có vai trò (role): hiển thị popup thông báo
    if (!isAuth || !user || !user.role) {
      setRequireRoleModalOpen(true);
      return;
    }

    setNewReviewForm({
      customerName: user.fullname || user.username || "Khách hàng PhotoStudio",
      rating: 5,
      bookingId: "",
      comment: "",
    });
    setSubmitError("");
    setEligibleBookings([]);
    setIsModalOpen(true);

    // Chỉ cho đánh giá các đơn đã hoàn thành của chính khách và chưa được đánh giá
    setIsLoadingBookings(true);
    try {
      const data = await customerBookingService.getBookingsByCustomer(user.id);
      const reviewedIds = new Set(reviews.map((r) => Number(r.bookingId)));
      const list = (Array.isArray(data) ? data : []).filter(
        (b) => b.status === "completed" && !reviewedIds.has(Number(b.id)),
      );
      setEligibleBookings(list);
      if (list.length > 0) {
        setNewReviewForm((f) => ({ ...f, bookingId: String(list[0].id) }));
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Không tải được danh sách đơn đặt lịch của bạn.");
    } finally {
      setIsLoadingBookings(false);
    }
  };
  // Submit modal form
  const handleCreateReview = async (e) => {
    e.preventDefault();
    if (!newReviewForm.comment.trim() || !newReviewForm.bookingId) return;

    const isAuth = customerAuth.isAuthenticated();
    const user = customerAuth.getUser();
    if (!isAuth || !user || !user.role) {
      setIsModalOpen(false);
      setRequireRoleModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      const saved = await customerReviewService.createReview({
        customerName: newReviewForm.customerName,
        rating: Number(newReviewForm.rating) || 5.0,
        comment: newReviewForm.comment.trim(),
        customerId: user.id,
        bookingId: Number(newReviewForm.bookingId),
      });

      // Tải lại danh sách từ CSDL để hiển thị đúng dữ liệu đã lưu
      const fresh = await customerReviewService.getAllReviews();
      if (Array.isArray(fresh)) {
        setReviews(
          fresh.map((item) => ({
            ...item,
            bookingId: item.bookingId || item.id,
            customerName: item.customerName || "Khách hàng PhotoStudio",
            rating: typeof item.rating === "number" ? item.rating : 5.0,
            comment: item.comment || "",
            createdAt: item.createdAt || new Date().toISOString(),
            packageName: item.packageName || "Dịch Vụ Nhiếp Ảnh Chuyên Nghiệp",
            category: item.category || "portrait",
          })),
        );
      } else if (saved) {
        setReviews([saved, ...reviews]);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setNewReviewForm({ customerName: "", rating: 5, bookingId: "", comment: "" });
      }, 1500);
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || err.message || "Không thể gửi đánh giá lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  // Lấy nhãn hiển thị cho dropdown số sao
  const currentRatingOptionLabel = useMemo(() => {
    if (selectedRatingFilter === "all") return "Tất Cả Số Sao";
    return `${selectedRatingFilter} Sao (${ratingCounts[selectedRatingFilter] || 0})`;
  }, [selectedRatingFilter, ratingCounts]);

  return (
    <div className="bg-[#FAF5F5] min-h-screen text-[#2A1D22] pt-24 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-rose-500/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-[#B85064]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Floral elements */}
      <FloralBranchCorner
        position="top-right"
        className="opacity-20 pointer-events-none"
      />
      <FloralBranchCorner
        position="bottom-left"
        className="opacity-15 pointer-events-none rotate-180"
      />
      <ScatteredPetals count={8} className="opacity-25" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#7A6C71] mb-8 font-medium">
          <Link
            to={ROUTES.USER.HOME}
            className="hover:text-[#B85064] transition-colors"
          >
            Trang Chủ
          </Link>
          <span>/</span>
          <span className="text-[#B85064] font-semibold">
            Đánh Giá Của Khách Hàng
          </span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <ScrollReveal direction="down">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-luxury tracking-tight text-[#2A1D22] mb-6 leading-tight">
              <BlurText
                text="Lắng Nghe Cảm Nhận Từ"
                delay={40}
                className="inline"
              />{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B85064] via-[#D46B81] to-[#8C3A4B]">
                Khách Hàng Hài Lòng
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#7A6C71] font-light leading-relaxed max-w-3xl mx-auto">
              Hơn {stats.total}+ đánh giá trung thực từ những khách hàng đã trực
              tiếp chụp ảnh tại PhotoStudio. Sự tin tưởng và nụ cười của bạn là
              nguồn cảm hứng nghệ thuật lớn nhất của chúng tôi.
            </p>
          </ScrollReveal>
        </div>

        {/* Rating Overview & Trust Stats Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 items-stretch">
          {/* Card Điểm Trung Bình Tổng Thể */}
          <div className="lg:col-span-5 bg-white border border-[#F0E4E6] rounded-3xl p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-bold text-[#7A6C71]">
                  Xếp Hạng Trung Bình
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckBadgeIcon className="w-3.5 h-3.5" />
                  Đã xác minh
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-3">
                <span className="text-5xl sm:text-6xl font-bold font-serif-luxury text-[#B85064]">
                  {stats.avg}
                </span>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className="w-5 h-5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#7A6C71]">
                    Trên thang điểm 5.0 tuyệt đối
                  </p>
                </div>
              </div>
            </div>

            {/* Star breakdown bar (Đầy đủ 1 đến 5 sao theo CSDL API) */}
            <div className="space-y-2 pt-3 border-t border-[#F0E4E6]">
              {/* 5 sao */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">5 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.count5 / (stats.total || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">
                  {stats.count5}
                </span>
              </div>

              {/* 4 sao */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">4 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.count4 / (stats.total || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">
                  {stats.count4}
                </span>
              </div>

              {/* 3 sao */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">3 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.count3 / (stats.total || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">
                  {stats.count3}
                </span>
              </div>

              {/* 2 sao */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">2 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.count2 / (stats.total || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">
                  {stats.count2}
                </span>
              </div>

              {/* 1 sao */}
              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#3E2F35] font-semibold">1 sao</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#B85064] rounded-full transition-all duration-700"
                    style={{
                      width: `${(stats.count1 / (stats.total || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-[#2A1D22]">
                  {stats.count1}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards + Viết Đánh Giá Banner */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064] mb-3">
                <HeartIcon className="w-5 h-5 text-[#B85064]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  <CountUp to={stats.total} duration={2} />+
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">
                  Đánh Giá Được Ghi Nhận
                </h4>
                <p className="text-[11px] text-[#7A6C71] font-light">
                  100% được xác minh sau mỗi buổi chụp hoàn tất
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  {stats.satisfaction}%
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">
                  Khách Hàng Hài Lòng
                </h4>
                <p className="text-[11px] text-[#7A6C71] font-light">
                  Sẵn sàng giới thiệu bạn bè và quay lại chụp tiếp
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#F0E4E6] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                <CameraIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-serif-luxury text-[#2A1D22] mb-0.5">
                  8 Gói Chụp
                </div>
                <h4 className="text-xs font-bold text-[#2A1D22] mb-0.5">
                  Bao Phủ Đa Dạng Concept
                </h4>
                <p className="text-[11px] text-[#7A6C71] font-light">
                  Từ ảnh cưới, nàng thơ, gia đình đến lookbook
                </p>
              </div>
            </div>

            {/* Nút Viết Đánh Giá (Yêu cầu Đăng nhập) */}
            <div className="bg-gradient-to-br from-[#FDF0F3] to-[#F5D5DC] border border-[#F5D5DC] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 bg-white rounded-full text-[10px] font-bold text-[#B85064] mb-2 shadow-xs">
                  Cảm nhận của bạn
                </span>
                <h4 className="text-sm font-bold text-[#2A1D22] mb-1 font-serif-luxury">
                  Bạn Đã Từng Chụp Tại Studio?
                </h4>
                <p className="text-[11px] text-[#7A6C71] leading-relaxed mb-3 font-light">
                  Đăng nhập để chia sẻ đánh giá trải nghiệm thực tế cùng
                  PhotoStudio.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenReviewModal}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PencilSquareIcon className="w-4 h-4" />
                <span>Viết Đánh Giá Của Bạn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section Ref for Pagination Scrolling */}
        <div ref={reviewsSectionRef} className="scroll-mt-28" />

        {/* Filter Bar: Gói chụp bên trái, Dropdown số sao bên phải (ĐÃ BỎ HOÀN TOÀN THANH TÌM KIẾM) */}
        <div className="bg-white border border-[#F0E4E6] rounded-3xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* 1. Category Filter Tabs (Lọc theo các gói chụp) */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { key: "all", label: `Tất Cả (${reviews.length})` },
                { key: "my_reviews", label: "Đánh Giá Của Tôi" },
                { key: "wedding", label: "Ảnh Cưới" },
                { key: "portrait", label: "Nàng Thơ & Cá Nhân" },
                { key: "family", label: "Gia Đình" },
                { key: "business", label: "Doanh Nhân & Lookbook" },
                { key: "concept", label: "Cổ Trang & Kỷ Yếu" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleCategoryChange(tab.key)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === tab.key
                      ? "bg-[#B85064] text-white shadow-md shadow-[#B85064]/20"
                      : "bg-neutral-100 text-[#7A6C71] hover:bg-neutral-200/80 hover:text-[#2A1D22]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 2. Dropdown Lọc Số Sao Xổ Xuống (1, 2, 3, 4, 5 sao) */}
            <div
              className="relative shrink-0 w-full md:w-auto"
              ref={ratingDropdownRef}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#7A6C71] hidden sm:inline">
                  Lọc số sao:
                </span>
                <button
                  type="button"
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-full sm:w-auto px-4 py-2 bg-[#FAF5F5] hover:bg-[#FDF0F3] border border-[#F0E4E6] hover:border-[#F5D5DC] rounded-full text-xs font-bold text-[#2A1D22] flex items-center justify-between sm:justify-start gap-2.5 transition-all shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <StarIcon className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{currentRatingOptionLabel}</span>
                  </div>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-[#7A6C71] transition-transform duration-200 ${
                      isRatingDropdownOpen ? "rotate-180 text-[#B85064]" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Bảng Xổ Xuống (Dropdown Menu) */}
              <AnimatePresence>
                {isRatingDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#F0E4E6] shadow-xl p-1.5 z-40"
                  >
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#7A6C71] border-b border-[#F5EAEB] mb-1">
                      Chọn mức sao đánh giá
                    </div>

                    {/* Lựa chọn Tất cả */}
                    <button
                      type="button"
                      onClick={() => handleSelectRatingFilter("all")}
                      className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        selectedRatingFilter === "all"
                          ? "bg-[#FDF0F3] text-[#B85064] font-bold"
                          : "text-[#3E2F35] hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#B85064]" />
                        <span>Tất cả số sao</span>
                      </div>
                      <span className="text-[11px] text-[#7A6C71] bg-neutral-100 px-2 py-0.5 rounded-full">
                        {ratingCounts.all}
                      </span>
                    </button>

                    {/* Các mức từ 5 sao xuống 1 sao */}
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleSelectRatingFilter(String(star))}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          selectedRatingFilter === String(star)
                            ? "bg-[#FDF0F3] text-[#B85064] font-bold"
                            : "text-[#3E2F35] hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center">
                            {[...Array(star)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                              />
                            ))}
                          </div>
                          <span>{star} sao</span>
                        </div>
                        <span className="text-[11px] text-[#7A6C71] bg-neutral-100 px-2 py-0.5 rounded-full">
                          {ratingCounts[star] || 0}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex flex-col gap-4 mb-12">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="w-full bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-200" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 bg-neutral-200 rounded" />
                      <div className="h-3 w-24 bg-neutral-100 rounded" />
                    </div>
                  </div>
                  <div className="w-24 h-6 bg-neutral-100 rounded-full" />
                </div>
                <div className="h-4 w-full bg-neutral-100 rounded" />
                <div className="h-4 w-4/5 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty Result */}
        {!isLoading && filteredReviews.length === 0 && (
          <div className="bg-white border border-[#F0E4E6] rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm my-8">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            {selectedCategory === "my_reviews" && !customerAuth.isAuthenticated() ? (
              <>
                <h3 className="text-lg font-bold text-[#2A1D22] mb-2 font-serif-luxury">
                  Yêu Cầu Đăng Nhập
                </h3>
                <p className="text-xs text-[#7A6C71] mb-6 leading-relaxed">
                  Vui lòng đăng nhập tài khoản để xem các bài đánh giá của riêng bạn.
                </p>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.AUTH.LOGIN, { state: { from: ROUTES.USER.REVIEWS } })}
                  className="px-6 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-bold hover:bg-[#A8394C] transition-all cursor-pointer shadow-md shadow-[#B85064]/20"
                >
                  Đăng Nhập Ngay
                </button>
              </>
            ) : selectedCategory === "my_reviews" ? (
              <>
                <h3 className="text-lg font-bold text-[#2A1D22] mb-2 font-serif-luxury">
                  Bạn Chưa Có Bài Đánh Giá Nào
                </h3>
                <p className="text-xs text-[#7A6C71] mb-6 leading-relaxed">
                  Sau khi hoàn thành buổi chụp tại Studio, hãy chia sẻ trải nghiệm của bạn để đóng góp ý kiến và nhận ưu đãi từ Studio nhé!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenReviewModal}
                    className="px-5 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-bold hover:bg-[#A8394C] transition-all cursor-pointer shadow-md shadow-[#B85064]/20"
                  >
                    Viết Đánh Giá Ngay
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedRatingFilter("all");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2.5 rounded-full border border-[#F0E4E6] text-xs font-semibold text-[#7A6C71] hover:bg-[#FAF5F5] transition-all cursor-pointer"
                  >
                    Xem Đánh Giá Khác
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#2A1D22] mb-2 font-serif-luxury">
                  Không Tìm Thấy Đánh Giá Phù Hợp
                </h3>
                <p className="text-xs text-[#7A6C71] mb-6">
                  Chưa có bài đánh giá nào phù hợp với bộ lọc hiện tại. Vui lòng
                  chọn mức sao hoặc gói chụp khác.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedRatingFilter("all");
                    setCurrentPage(1);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#B85064] text-white text-xs font-semibold hover:bg-[#A8394C] transition-all cursor-pointer shadow-sm"
                >
                  Hiển Thị Tất Cả Đánh Giá
                </button>
              </>
            )}
          </div>
        )}

        {/* DANH SÁCH ĐÁNH GIÁ SỔ DỌC XUỐNG (1 ĐÁNH GIÁ CHIẾM 1 HÀNG NGANG) */}
        {!isLoading && currentReviews.length > 0 && (
          <div className="flex flex-col gap-4 mb-12">
            {currentReviews.map((rev, idx) => {
              const ratingCount = Math.round(rev.rating || 5);
              const formattedDate = rev.createdAt
                ? new Date(rev.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "10/2026";

              return (
                <motion.div
                  key={rev.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="w-full bg-white border border-[#F0E4E6] rounded-3xl p-6 sm:p-7 shadow-sm hover:border-[#B85064]/40 hover:shadow-md transition-all duration-300 relative group"
                >
                  {/* Hàng ngang Header: Khách hàng (bên trái) & Số sao đánh giá (bên phải) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F5EAEB] mb-4">
                    {/* Bên trái: Avatar, Tên, Badge đã trải nghiệm, Gói chụp, Ngày tháng */}
                    <div className="flex items-center gap-3.5">
                      {rev.avatar ? (
                        <img
                          src={rev.avatar}
                          alt={rev.customerName}
                          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#F5D5DC] shrink-0 shadow-xs"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FDF0F3] border-2 border-[#F5D5DC] flex items-center justify-center text-[#B85064] font-bold text-sm sm:text-base shrink-0">
                          {rev.customerName
                            ? rev.customerName.charAt(0).toUpperCase()
                            : "K"}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-[#2A1D22]">
                            {rev.customerName || "Khách hàng PhotoStudio"}
                          </h4>

                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckBadgeIcon className="w-3 h-3" />
                            <span>Đã trải nghiệm</span>
                          </span>

                          {rev.packageName && (
                            <span className="text-[11px] font-medium text-[#7A6C71] bg-[#FAF5F5] border border-[#F0E4E6] px-2.5 py-0.5 rounded-full">
                              {rev.packageName}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#7A6C71] mt-0.5">
                          Thời gian đánh giá: {formattedDate}
                        </p>
                      </div>
                    </div>

                    {/* Bên phải: Hiển thị số sao họ đánh giá */}
                    <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FAF5F5] border border-[#F0E4E6] px-3.5 py-1.5 rounded-full shrink-0">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < ratingCount
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-[#B85064] ml-1">
                        {rev.rating ? Number(rev.rating).toFixed(1) : "5.0"} /
                        5.0
                      </span>
                    </div>
                  </div>

                  {/* Phần đánh giá chi tiết của họ (Chiếm toàn bộ chiều ngang hàng) */}
                  <div className="text-xs sm:text-sm text-[#3E2F35] leading-relaxed font-light pl-1 sm:pl-2">
                    "{rev.comment}"
                  </div>
                  {/* Phản hồi từ PhotoStudio / Ban quản lý */}
                  {rev.adminReply && (
                    <div className="mt-4 p-4 rounded-2xl bg-[#FDF0F3]/80 border border-[#F5D5DC] text-xs space-y-1.5 ml-1 sm:ml-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-[#B85064]">
                          <ShieldCheckIcon className="w-4 h-4 text-[#B85064]" />
                          <span>PhotoStudio phản hồi:</span>
                        </div>
                        {rev.adminRepliedAt && (
                          <span className="text-[10px] text-[#9E8E93]">
                            {new Date(rev.adminRepliedAt).toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[#3E2F35] font-normal leading-relaxed pl-5 italic">
                        "{rev.adminReply}"
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Phân Trang (Pagination Controls) */}
        {!isLoading && filteredReviews.length > ITEMS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-[#F0E4E6] mt-4">
            <p className="text-xs text-[#7A6C71]">
              Hiển thị{" "}
              <strong className="text-[#2A1D22]">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </strong>{" "}
              -{" "}
              <strong className="text-[#2A1D22]">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)}
              </strong>{" "}
              trên tổng số{" "}
              <strong className="text-[#2A1D22]">
                {filteredReviews.length}
              </strong>{" "}
              bài đánh giá
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === 1
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
                    : "border-[#F0E4E6] bg-white text-[#3E2F35] hover:bg-[#FDF0F3] hover:text-[#B85064] hover:border-[#F5D5DC] cursor-pointer shadow-xs"
                }`}
                aria-label="Trang trước"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#B85064] text-white shadow-md shadow-[#B85064]/20 scale-105"
                          : "bg-white border border-[#F0E4E6] text-[#7A6C71] hover:bg-neutral-50 hover:text-[#2A1D22]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                  currentPage === totalPages
                    ? "border-neutral-200 text-neutral-300 cursor-not-allowed bg-neutral-50"
                    : "border-[#F0E4E6] bg-white text-[#3E2F35] hover:bg-[#FDF0F3] hover:text-[#B85064] hover:border-[#F5D5DC] cursor-pointer shadow-xs"
                }`}
                aria-label="Trang tiếp"
              >
                <span className="hidden sm:inline">Tiếp</span>
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1C1619] via-[#2A1D22] to-[#141012] border border-white/10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[#E899A8] text-xs font-semibold mb-4">
              Khởi Đầu Cho Bộ Ảnh Đẹp Nhất Của Bạn
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-luxury tracking-tight mb-4">
              Bạn Sẵn Sàng Trở Thành Khách Hàng Hài Lòng Tiếp Theo?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-6">
              Đội ngũ nhiếp ảnh gia và stylist hàng đầu tại PhotoStudio luôn tận
              tâm lắng nghe mọi ý tưởng concept của bạn. Đặt lịch ngay hôm nay
              để nhận ưu đãi mùa cưới và kỷ yếu.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.USER.PACKAGES}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-lg shadow-rose-950/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Xem Toàn Bộ Báo Giá & Gói Chụp</span>
              </Link>
              <Link
                to={`${ROUTES.USER.HOME}#booking`}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
              >
                Đặt Lịch Chụp Trực Tuyến
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal Gửi Đánh Giá Mới (Chỉ giữ Tên bị khóa và Nội dung đánh giá) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full p-7 border border-[#F0E4E6] shadow-2xl relative overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F0E4E6] mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center text-[#B85064]">
                    <PencilSquareIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#2A1D22] font-serif-luxury">
                      Viết Đánh Giá Trải Nghiệm
                    </h3>
                    <p className="text-[11px] text-[#7A6C71]">
                      Chia sẻ cảm nhận chân thật về buổi chụp của bạn
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckBadgeIcon className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-[#2A1D22] mb-1 font-serif-luxury">
                    Gửi Đánh Giá Thành Công!
                  </h4>
                  <p className="text-xs text-[#7A6C71]">
                    Cảm ơn bạn đã tin tưởng và đồng hành cùng PhotoStudio.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateReview} className="space-y-4">
                  {/* 1. Rating Selector (Chọn số sao) */}
                  <div>
                    <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                      Đánh giá số sao:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setNewReviewForm({ ...newReviewForm, rating: star })
                          }
                          className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <StarIcon
                            className={`w-7 h-7 ${
                              star <= newReviewForm.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-[#B85064] ml-2">
                        {newReviewForm.rating}.0 / 5.0 Sao
                      </span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs">
                      {submitError}
                    </div>
                  )}

                  {/* Chọn đơn đã hoàn thành để đánh giá */}
                  <div>
                    <label className="block text-xs font-bold text-[#2A1D22] mb-1.5">
                      Đơn đặt lịch cần đánh giá *
                    </label>
                    {isLoadingBookings ? (
                      <p className="text-xs text-[#7A6C71]">Đang tải đơn của bạn...</p>
                    ) : eligibleBookings.length === 0 ? (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                        Bạn chưa có đơn nào đã hoàn thành và chưa đánh giá. Chỉ có thể đánh giá sau khi buổi chụp hoàn thành.
                      </p>
                    ) : (
                      <select
                        required
                        value={newReviewForm.bookingId}
                        onChange={(e) =>
                          setNewReviewForm({ ...newReviewForm, bookingId: e.target.value })
                        }
                        className="w-full px-3 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064]"
                      >
                        {eligibleBookings.map((b) => (
                          <option key={b.id} value={b.id}>
                            Đơn #{b.id}{b.bookingDate ? ` - ${new Date(b.bookingDate).toLocaleDateString("vi-VN")}` : ""}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {/* 2. Customer Name (Tên người đăng nhập, BỊ KHÓA KHÔNG CHO SỬA) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#2A1D22]">
                        Tên người đánh giá
                      </label>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 font-medium">
                        <LockClosedIcon className="w-3 h-3" />
                        Đã khóa từ tài khoản đăng nhập
                      </span>
                    </div>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        readOnly
                        disabled
                        value={newReviewForm.customerName}
                        className="w-full pl-9 pr-3 py-2.5 bg-neutral-100 border border-[#E8DCDD] rounded-xl text-xs text-[#2A1D22] font-semibold cursor-not-allowed select-none"
                      />
                    </div>
                    <p className="text-[10px] text-[#7A6C71] mt-1 flex items-center gap-1">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                      Hệ thống tự động ghi nhận theo thông tin tài khoản của bạn
                    </p>
                  </div>

                  {/* 3. Comment (Phần viết nội dung đánh giá) */}
                  <div>
                    <label className="block text-xs font-bold text-[#2A1D22] mb-1">
                      Nội dung đánh giá của bạn *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={newReviewForm.comment}
                      onChange={(e) =>
                        setNewReviewForm({
                          ...newReviewForm,
                          comment: e.target.value,
                        })
                      }
                      placeholder="Chia sẻ cảm nhận chi tiết của bạn về chất lượng dịch vụ, ánh sáng, góc chụp của photographer, makeup hoặc trải nghiệm tại PhotoStudio..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF5F5] border border-[#F0E4E6] rounded-xl text-xs focus:outline-none focus:border-[#B85064] resize-none leading-relaxed"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0E4E6]">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !newReviewForm.comment.trim() || !newReviewForm.bookingId}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BE4B5E] via-[#B85064] to-[#A8394C] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá Ngay"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* POPUP YÊU CẦU ĐĂNG NHẬP / CÓ ROLE ĐỂ ĐÁNH GIÁ */}
      {requireRoleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setRequireRoleModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white border border-[#F2E8E9] shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-[#2A1D22]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setRequireRoleModalOpen(false)}
              className="cursor-pointer absolute top-4 right-4 p-2 rounded-full text-[#8C7D82] hover:text-[#2A1D22] hover:bg-[#FCECEF] transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FDF0F3] border border-[#F5D5DC] flex items-center justify-center mx-auto mb-4 text-[#B85064] shadow-sm">
              <ShieldCheckIcon className="w-7 h-7 text-[#B85064]" />
            </div>

            <h3 className="text-lg font-bold font-serif-luxury text-[#1F1418] mb-2">
              Yêu Cầu Tài Khoản Hợp Lệ
            </h3>
            <p className="text-xs text-[#7A6C71] leading-relaxed mb-6">
              Tính năng đánh giá chỉ dành cho người dùng đã đăng ký tài khoản và có vai trò (role) trong hệ thống Studio. Vui lòng đăng nhập để gửi đánh giá hoặc xem nhận xét của bạn.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setRequireRoleModalOpen(false);
                  navigate(ROUTES.AUTH.LOGIN, { state: { from: ROUTES.USER.REVIEWS } });
                }}
                className="cursor-pointer w-full py-2.5 rounded-full bg-[#B85064] hover:bg-[#A33D50] text-white text-xs font-semibold transition-all shadow-md shadow-[#B85064]/25 flex items-center justify-center gap-1.5"
              >
                <span>Đăng nhập ngay</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequireRoleModalOpen(false);
                  navigate(ROUTES.AUTH.REGISTER);
                }}
                className="cursor-pointer w-full py-2.5 rounded-full border border-[#F0E4E6] text-[#4A3C41] hover:bg-[#FAF5F5] text-xs font-semibold transition-colors"
              >
                Chưa có tài khoản? Đăng ký
              </button>

              <button
                type="button"
                onClick={() => setRequireRoleModalOpen(false)}
                className="cursor-pointer text-xs text-[#8C7D82] hover:text-[#2A1D22] pt-1"
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
