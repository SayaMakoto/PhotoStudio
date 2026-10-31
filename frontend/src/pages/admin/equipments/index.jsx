import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArchiveRestore,
  Camera,
  CheckCircle2,
  CircleAlert,
  PackageCheck,
  Plus,
  RotateCcw,
  Trash2,
  Wrench,
} from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import useAdminNotification from "../../../components/admin/common/useAdminNotification";
import adminEquipmentService from "../../../services/admin/equipmentService";
import adminImageService from "../../../services/admin/imageService";
import EquipmentDialog from "./EquipmentDialog";
import {
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPE_OPTIONS,
  formatEquipmentDate,
  getEquipmentErrorMessage,
} from "./equipmentConfig";

const EQUIPMENT_COLUMNS = [
  { key: "id", title: "Mã", cellClassName: "font-mono text-neutral-400" },
  {
    key: "name",
    title: "Thiết bị",
    render: (name, item) => (
      <div className="min-w-40">
        <p className="font-medium text-neutral-100">{name || "Chưa đặt tên"}</p>
        <p className="mt-0.5 text-[11px] text-neutral-500">
          {[item.brand, item.model].filter(Boolean).join(" · ") || "Chưa có thương hiệu / model"}
        </p>
      </div>
    ),
  },
  { key: "type", title: "Loại", render: (value) => EQUIPMENT_TYPE_LABELS[value] || value || "—" },
  { key: "serialNumber", title: "Số serial", cellClassName: "font-mono text-neutral-400" },
  { key: "purchaseDate", title: "Ngày mua", render: formatEquipmentDate },
  { key: "status", title: "Tình trạng", render: (value) => <StatusBadge status={value} /> },
];

function SummaryCard({ icon: Icon, label, value, tone = "amber" }) {
  const tones = {
    amber: "border-rose-500/20 bg-rose-500/10 text-rose-400",
    green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    blue: "border-sky-500/20 bg-sky-500/10 text-sky-300",
    rose: "border-rose-500/20 bg-rose-500/10 text-rose-300",
  };
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl border ${tones[tone]}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

const asRows = (value) => (Array.isArray(value) ? value : []);

export default function AdminEquipmentsPage() {
  const { notify } = useAdminNotification();
  const [view, setView] = useState("active");
  const [equipment, setEquipment] = useState([]);
  const [trashCount, setTrashCount] = useState(0);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const loadRows = async () => {
    setLoading(true);
    setPageError("");
    try {
      const [rows, trash] = await Promise.all([
        adminEquipmentService.getAll(),
        adminEquipmentService.getTrash(),
      ]);
      setEquipment(asRows(view === "trash" ? trash : rows));
      setTrashCount(asRows(trash).length);
    } catch (error) {
      setPageError(getEquipmentErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([adminEquipmentService.getAll(), adminEquipmentService.getTrash()])
      .then(([rows, trash]) => {
        if (!mounted) return;
        setEquipment(asRows(view === "trash" ? trash : rows));
        setTrashCount(asRows(trash).length);
      })
      .catch((error) => {
        if (mounted) setPageError(getEquipmentErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [view]);

  const filteredEquipment = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return equipment
      .filter((item) => {
        const matchesSearch =
          !keyword ||
          [item.name, item.brand, item.model, item.serialNumber, item.description]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
        return (
          matchesSearch &&
          (!typeFilter || item.type === typeFilter) &&
          (!statusFilter || item.status === statusFilter)
        );
      })
      .sort((left, right) => {
        const delta = (Number(left.id) || 0) - (Number(right.id) || 0);
        return sortOrder === "oldest" ? delta : -delta;
      });
  }, [equipment, search, sortOrder, statusFilter, typeFilter]);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("");
    setStatusFilter("");
    setSortOrder("newest");
  };

  const switchView = () => {
    setLoading(true);
    setPageError("");
    setView((current) => (current === "trash" ? "active" : "trash"));
  };

  const saveEquipment = async (payload) => {
    try {
      const { imageUrl, ...equipmentPayload } = payload;
      let savedEquipment;
      if (dialog.mode === "create") {
        savedEquipment = await adminEquipmentService.create(equipmentPayload);
        setDialog({ mode: "edit", equipment: { ...savedEquipment, imageUrl } });
        notify({
          type: "success",
          title: "Thêm thiết bị thành công",
          message: `Đã thêm “${payload.name}” vào kho thiết bị.`,
        });
      } else {
        savedEquipment = await adminEquipmentService.update(dialog.equipment.id, equipmentPayload);
        notify({
          type: "success",
          title: "Cập nhật thiết bị thành công",
          message: `Thông tin “${payload.name}” đã được lưu.`,
        });
      }
      if (imageUrl !== undefined && savedEquipment?.id) {
        await adminImageService.savePrimaryImage("equipment", savedEquipment.id, imageUrl, payload.name || payload.description);
      }
      setDialog(null);
      await loadRows();
    } catch (error) {
      setPageError(getEquipmentErrorMessage(error));
      throw error;
    }
  };

  const moveToTrash = async (item) => {
    if (!window.confirm(`Đưa thiết bị “${item.name}” vào thùng rác? Bạn có thể khôi phục sau.`)) return;
    try {
      await adminEquipmentService.delete(item.id);
      notify({
        type: "success",
        title: "Đã chuyển vào thùng rác",
        message: `Thiết bị “${item.name}” có thể được khôi phục sau.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getEquipmentErrorMessage(error) });
    }
  };

  const restoreEquipment = async (item) => {
    if (!window.confirm(`Khôi phục thiết bị “${item.name}” về danh sách quản lý?`)) return;
    try {
      await adminEquipmentService.restore(item.id);
      notify({
        type: "success",
        title: "Khôi phục thiết bị thành công",
        message: `“${item.name}” đã được đưa về danh sách thiết bị.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getEquipmentErrorMessage(error) });
    }
  };

  const permanentlyDelete = async (item) => {
    if (!window.confirm(`Xóa vĩnh viễn thiết bị “${item.name}”? Thao tác này không thể hoàn tác.`)) return;
    try {
      await adminEquipmentService.permanentlyDelete(item.id);
      notify({
        type: "success",
        title: "Đã xóa thiết bị vĩnh viễn",
        message: `“${item.name}” đã bị xóa khỏi hệ thống.`,
      });
      await loadRows();
    } catch (error) {
      notify({ type: "error", message: getEquipmentErrorMessage(error) });
    }
  };

  const columns = view === "trash"
    ? [
        ...EQUIPMENT_COLUMNS,
        { key: "deletedAt", title: "Ngày xóa", render: formatEquipmentDate },
        {
          key: "trashActions",
          title: "Thùng rác",
          render: (_, item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => restoreEquipment(item)} aria-label={`Khôi phục ${item.name}`} title="Khôi phục" className="rounded-lg p-2 text-emerald-300 transition hover:bg-emerald-500/10 hover:text-emerald-200">
                <ArchiveRestore className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => permanentlyDelete(item)} aria-label={`Xóa vĩnh viễn ${item.name}`} title="Xóa vĩnh viễn" className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200">
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ),
        },
      ]
    : EQUIPMENT_COLUMNS;

  const stats = useMemo(() => ({
    total: equipment.length,
    available: equipment.filter((item) => item.status === "available").length,
    inUse: equipment.filter((item) => item.status === "in_use").length,
    attention: equipment.filter((item) => ["maintenance", "broken"].includes(item.status)).length,
  }), [equipment]);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-400">Quản lý tài nguyên</p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Camera className="h-6 w-6 text-rose-400" aria-hidden="true" />
            {view === "trash" ? "Thùng rác thiết bị" : "Quản lý thiết bị"}
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            {view === "trash"
              ? "Khôi phục thiết bị đã xóa hoặc xóa vĩnh viễn khỏi hệ thống."
              : "Theo dõi danh mục, tình trạng sử dụng và thông tin thiết bị của studio."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={switchView} className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-xs font-medium transition ${view === "trash" ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800" : "border-rose-500/30 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15"}`}>
            {view === "trash" ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
            {view === "trash" ? "Quay lại thiết bị" : "Thùng rác"}
            {view !== "trash" && <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-[10px] text-rose-100">{trashCount}</span>}
          </button>
          {view !== "trash" && (
            <button type="button" onClick={() => setDialog({ mode: "create", equipment: null })} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-rose-500 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-rose-600">
              <Plus className="h-4 w-4" aria-hidden="true" />Thêm thiết bị
            </button>
          )}
        </div>
      </header>

      {view !== "trash" && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard icon={PackageCheck} label="Tổng thiết bị" value={stats.total} />
          <SummaryCard icon={CheckCircle2} label="Sẵn sàng" value={stats.available} tone="green" />
          <SummaryCard icon={Camera} label="Đang sử dụng" value={stats.inUse} tone="blue" />
          <SummaryCard icon={Wrench} label="Cần chú ý" value={stats.attention} tone="rose" />
        </div>
      )}

      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm tên, thương hiệu, model, serial..."
        filters={[
          { key: "type", label: "Loại thiết bị", value: typeFilter, onChange: setTypeFilter, options: EQUIPMENT_TYPE_OPTIONS },
          { key: "status", label: "Tình trạng", value: statusFilter, onChange: setStatusFilter, options: EQUIPMENT_STATUS_OPTIONS },
        ]}
        sortValue={sortOrder}
        onSortChange={setSortOrder}
        onReset={resetFilters}
      />

      {pageError && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{pageError}</span>
          <button type="button" onClick={loadRows} className="ml-auto whitespace-nowrap font-medium underline underline-offset-2">Tải lại</button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-rose-400" />
          Đang tải danh sách thiết bị...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filteredEquipment}
          emptyMessage={view === "trash" ? "Thùng rác đang trống." : "Không có thiết bị phù hợp với bộ lọc."}
          onDetail={(item) => setDialog({ mode: "detail", equipment: item })}
          onEdit={view === "trash" ? undefined : (item) => setDialog({ mode: "edit", equipment: item })}
          onDelete={view === "trash" ? undefined : moveToTrash}
          actions={view === "trash" ? { edit: false, delete: false } : undefined}
        />
      )}

      {view === "trash" && !loading && equipment.length > 0 && (
        <p className="flex items-center gap-2 text-[11px] text-neutral-500">
          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
          Thiết bị có lịch sử cấp phát không thể bị xóa vĩnh viễn.
        </p>
      )}

      {dialog && (
        <EquipmentDialog
          key={`${dialog.mode}-${dialog.equipment?.id ?? "new"}`}
          equipment={dialog.equipment}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={saveEquipment}
        />
      )}
    </section>
  );
}
