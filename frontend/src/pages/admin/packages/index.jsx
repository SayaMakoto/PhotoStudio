import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArchiveRestore,
  Camera,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import useAdminNotification from "../../../components/admin/common/useAdminNotification";
import adminPackageService from "../../../services/admin/packageService";
import adminImageService from "../../../services/admin/imageService";
import PackageDialog from "./PackageDialog";
import {
  PACKAGE_STATUS_OPTIONS,
  formatPackageDate,
  formatPackagePrice,
  getPackageErrorMessage,
} from "./packageConfig";

const asRows = (rows) => (Array.isArray(rows) ? rows : []);
const COLUMNS = [
  { key: "id", title: "Mã", cellClassName: "font-mono text-neutral-400" },
  {
    key: "name",
    title: "Gói chụp",
    render: (name, item) => (
      <div className="min-w-48">
        <p className="font-medium text-neutral-100">{name || "Chưa đặt tên"}</p>
        <p className="mt-0.5 max-w-sm truncate text-[11px] text-neutral-500">
          {item.description || "Chưa có mô tả"}
        </p>
      </div>
    ),
  },
  {
    key: "duration",
    title: "Thời lượng",
    render: (duration) => `${duration ?? 0} phút`,
  },
  { key: "price", title: "Giá gói", render: formatPackagePrice },
  { key: "status", title: "Trạng thái", type: "status", toggleable: true },
  { key: "updatedAt", title: "Cập nhật", render: formatPackageDate },
];

function SummaryCard({ label, value, icon: Icon, tone = "amber" }) {
  const colors = {
    amber: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
  };
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl border ${colors[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminPackagesPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState("active");
  const [packages, setPackages] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setPageError("");
    try {
      const [activeRows, trashRows] = await Promise.all([
        adminPackageService.getAll(),
        adminPackageService.getTrash(),
      ]);
      setPackages(asRows(view === "trash" ? trashRows : activeRows));
      setTrashCount(asRows(trashRows).length);
    } catch (error) {
      setPageError(getPackageErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminPackageService.getAll(), adminPackageService.getTrash()])
      .then(([activeRows, trashRows]) => {
        if (mounted) {
          setPackages(asRows(view === "trash" ? trashRows : activeRows));
          setTrashCount(asRows(trashRows).length);
        }
      })
      .catch((error) => {
        if (mounted) setPageError(getPackageErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [view]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return packages
      .filter(
        (item) =>
          (!keyword ||
            [item.name, item.description]
              .filter(Boolean)
              .some((value) =>
                String(value).toLowerCase().includes(keyword),
              )) &&
          (!status || item.status === status),
      )
      .sort(
        (a, b) =>
          (sortOrder === "oldest" ? 1 : -1) *
          ((Number(a.id) || 0) - (Number(b.id) || 0)),
      );
  }, [packages, search, sortOrder, status]);

  const stats = useMemo(
    () => ({
      total: packages.length,
      active: packages.filter((item) => item.status === "active").length,
      inactive: packages.filter((item) => item.status === "inactive").length,
      averagePrice: packages.length
        ? packages.reduce((sum, item) => sum + (Number(item.price) || 0), 0) /
          packages.length
        : 0,
    }),
    [packages],
  );
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSortOrder("newest");
  };

  const savePackage = async (payload) => {
    try {
      const { imageUrl, ...packagePayload } = payload;
      let savedPackage;
      const creating = dialog.mode === "create";
      if (dialog.mode === "create") {
        savedPackage = await adminPackageService.create(packagePayload);
        setDialog({ mode: "edit", packageEntity: { ...savedPackage, imageUrl } });
        notify({
          type: "success",
          title: "Tạo gói chụp thành công",
          message: `Đã thêm “${payload.name}” vào danh mục. Có thể cấu hình dịch vụ và bối cảnh trong phần tiếp theo.`,
        });
      } else {
        savedPackage = await adminPackageService.update(dialog.packageEntity.id, packagePayload);
        notify({
          type: "success",
          title: "Cập nhật gói chụp thành công",
          message: `Thông tin “${payload.name}” đã được lưu.`,
        });
      }
      if (imageUrl !== undefined && savedPackage?.id) {
        await adminImageService.savePrimaryImage("package", savedPackage.id, imageUrl, payload.name || payload.description);
      }
      if (!creating) setDialog(null);
      await loadRows();
    } catch (error) {
      setPageError(getPackageErrorMessage(error));
      throw error;
    }
  };

  const changeStatus = async (item, nextStatus) => {
    const label =
      PACKAGE_STATUS_OPTIONS.find((option) => option.value === nextStatus)
        ?.label || nextStatus;
    if (
      !window.confirm(`Chuyển gói “${item.name}” sang trạng thái “${label}”?`)
    )
      return;
    try {
      await adminPackageService.update(item.id, {
        name: item.name,
        description: item.description,
        duration: item.duration,
        price: item.price,
        status: nextStatus,
        equipments: item.equipments || [],
      });
      notify({
        type: "success",
        title: "Đã cập nhật trạng thái gói",
        message: `“${item.name}” hiện ở trạng thái ${label.toLowerCase()}.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getPackageErrorMessage(error) });
    }
  };

  const moveToTrash = async (item) => {
    if (
      !window.confirm(
        `Đưa gói “${item.name}” vào thùng rác? Gói đã được sử dụng trong booking sẽ không thể xóa.`,
      )
    )
      return;
    try {
      await adminPackageService.delete(item.id);
      notify({
        type: "success",
        title: "Đã chuyển gói vào thùng rác",
        message: `“${item.name}” có thể được khôi phục sau.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getPackageErrorMessage(error) });
    }
  };

  const restorePackage = async (item) => {
    if (!window.confirm(`Khôi phục gói “${item.name}” về danh mục?`)) return;
    try {
      await adminPackageService.restore(item.id);
      notify({
        type: "success",
        title: "Khôi phục gói chụp thành công",
        message: `“${item.name}” đã trở lại danh mục.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getPackageErrorMessage(error) });
    }
  };

  const permanentlyDelete = async (item) => {
    if (
      !window.confirm(
        `Xóa vĩnh viễn gói “${item.name}”? Thao tác không thể hoàn tác. Gói còn được booking sử dụng sẽ không thể xóa.`,
      )
    )
      return;
    try {
      await adminPackageService.permanentlyDelete(item.id);
      notify({
        type: "success",
        title: "Đã xóa gói chụp vĩnh viễn",
        message: `“${item.name}” đã bị xóa khỏi hệ thống.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getPackageErrorMessage(error) });
    }
  };

  const columns =
    view === "trash"
      ? [
          ...COLUMNS.map((column) =>
            column.key === "status" ? { ...column, toggleable: false } : column,
          ),
          { key: "deletedAt", title: "Ngày xóa", render: formatPackageDate },
          {
            key: "trashActions",
            title: "Thùng rác",
            render: (_, item) => (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => restorePackage(item)}
                  aria-label={`Khôi phục ${item.name}`}
                  title="Khôi phục"
                  className="rounded-lg p-2 text-emerald-300 hover:bg-emerald-500/10"
                >
                  <ArchiveRestore className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => permanentlyDelete(item)}
                  aria-label={`Xóa vĩnh viễn ${item.name}`}
                  title="Xóa vĩnh viễn"
                  className="rounded-lg p-2 text-rose-300 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]
      : COLUMNS;

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">
            Dịch vụ &amp; gói chụp
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Camera className="h-6 w-6 text-rose-400" />
            {view === "trash" ? "Thùng rác gói chụp" : "Quản lý gói chụp"}
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            {view === "trash"
              ? "Khôi phục gói hoặc xóa vĩnh viễn khi gói không còn liên kết booking."
              : "Quản lý giá, thời lượng, yêu cầu thiết bị, dịch vụ và bối cảnh trong từng gói."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setPageError("");
              setView((current) => (current === "trash" ? "active" : "trash"));
            }}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium ${view === "trash" ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800" : "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15"}`}
          >
            {view === "trash" ? (
              <RotateCcw className="h-4 w-4" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {view === "trash" ? "Quay lại gói chụp" : "Thùng rác"}
            {view !== "trash" && (
              <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">
                {trashCount}
              </span>
            )}
          </button>
          {view !== "trash" && (
            <button
              type="button"
              onClick={() => setDialog({ mode: "create", packageEntity: null })}
              className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-rose-500 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-rose-600 sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              Thêm gói chụp
            </button>
          )}
        </div>
      </header>
      {view !== "trash" && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Camera}
            label="Tổng gói chụp"
            value={stats.total}
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Đang hoạt động"
            value={stats.active}
            tone="green"
          />
          <SummaryCard
            icon={CircleAlert}
            label="Ngừng hoạt động"
            value={stats.inactive}
          />
          <SummaryCard
            icon={Clock3}
            label="Giá trung bình"
            value={formatPackagePrice(stats.averagePrice)}
            tone="blue"
          />
        </div>
      )}
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm tên hoặc mô tả gói chụp..."
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            value: status,
            onChange: setStatus,
            options: PACKAGE_STATUS_OPTIONS,
          },
        ]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />
      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{pageError}</span>
          <button
            type="button"
            onClick={loadRows}
            className="ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />
          Đang tải danh sách gói chụp...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage={
            view === "trash"
              ? "Thùng rác đang trống."
              : "Không có gói chụp phù hợp với bộ lọc."
          }
          onDetail={(item) =>
            setDialog({ mode: "detail", packageEntity: item })
          }
          onEdit={
            view === "trash"
              ? undefined
              : (item) => setDialog({ mode: "edit", packageEntity: item })
          }
          onDelete={view === "trash" ? undefined : moveToTrash}
          actions={
            view === "trash" ? { edit: false, delete: false } : undefined
          }
          onStatusChange={view === "trash" ? undefined : changeStatus}
        />
      )}
      {view === "active" && (
        <p className="flex items-center gap-2 text-[11px] text-neutral-500">
          <CircleAlert className="h-3.5 w-3.5 shrink-0" />
          Gói đã được booking sử dụng không thể chuyển vào thùng rác; dữ liệu
          thành phần chỉ bị xóa khi xóa vĩnh viễn gói.
        </p>
      )}
      {dialog && (
        <PackageDialog
          key={`${dialog.mode}-${dialog.packageEntity?.id ?? "new"}`}
          packageEntity={dialog.packageEntity}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={savePackage}
          notify={notify}
        />
      )}
    </section>
  );
}
