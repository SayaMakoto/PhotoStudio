import { Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/web";

export default function AdminPlaceholderPage({ title, description, category }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb / Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link
            to={ROUTES.ADMIN.DASHBOARD}
            className="hover:text-amber-400 transition-colors"
          >
            Trang chủ Admin
          </Link>
          <span>/</span>
          {category && (
            <>
              <span>{category}</span>
              <span>/</span>
            </>
          )}
          <span className="text-amber-400 font-semibold">{title}</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
        <p className="mt-1 text-xs text-neutral-400">
          {description ||
            "Khu vực quản lý và cấu hình dữ liệu dành cho quản trị viên."}
        </p>
      </div>

      {/* Placeholder Container */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center backdrop-blur-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4 shadow-lg shadow-amber-500/5">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-neutral-400 max-w-lg mx-auto mb-6">
          Chức năng <strong>{title}</strong> đã được thiết lập tuyến đường dẫn
          (Route) sẵn sàng. Bạn có thể kết nối thêm các bảng dữ liệu hoặc API
          tương ứng tại đây.
        </p>
        <Link
          to={ROUTES.ADMIN.DASHBOARD}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Bảng Thống Kê Trang Chủ Admin
        </Link>
      </div>
    </div>
  );
}
