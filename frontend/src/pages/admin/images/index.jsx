import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Image as ImageIcon,
  Layers3,
  Plus,
  Star,
} from "lucide-react";
import AdminFilterBar from "../../../components/admin/common/AdminFilterBar";
import AdminTable from "../../../components/admin/common/AdminTable";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import useAdminNotification from "../../../components/admin/common/useAdminNotification";
import adminImageService from "../../../services/admin/imageService";
import ImageDialog from "./ImageDialog";
import {
  formatImageDate,
  getImageErrorMessage,
  IMAGEABLE_TYPES,
  IMAGE_PRIMARY_FILTER_OPTIONS,
  IMAGE_TYPE_LABELS,
} from "./imageConfig";

const asRows = (rows) => (Array.isArray(rows) ? rows : []);

function SummaryCard({ label, value, icon: Icon, tone = "amber" }) {
  const colors = {
    amber: "border-amber-500/20 bg-amber-500/10 text-amber-300",
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

export default function AdminImagesPage() {
  const { notify } = useAdminNotification();
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [primaryState, setPrimaryState] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [dialog, setDialog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [pendingPrimaryId, setPendingPrimaryId] = useState(null);

  const loadImages = async () => {
    setLoading(true);
    setPageError("");
    try {
      setImages(asRows(await adminImageService.getAll()));
    } catch (error) {
      setPageError(getImageErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    adminImageService
      .getAll()
      .then((rows) => {
        if (mounted) setImages(asRows(rows));
      })
      .catch((error) => {
        if (mounted) setPageError(getImageErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return images
      .filter((image) => {
        const matchesSearch =
          !keyword ||
          [
            image.id,
            image.imageableId,
            image.description,
            image.imageUrl,
            IMAGE_TYPE_LABELS[image.imageableType],
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword));
        const matchesType = !type || image.imageableType === type;
        const matchesPrimary =
          !primaryState ||
          (primaryState === "primary"
            ? Boolean(image.isPrimary)
            : !image.isPrimary);
        return matchesSearch && matchesType && matchesPrimary;
      })
      .sort(
        (a, b) =>
          (sortOrder === "oldest" ? 1 : -1) *
          ((Number(a.id) || 0) - (Number(b.id) || 0)),
      );
  }, [images, primaryState, search, sortOrder, type]);

  const stats = useMemo(
    () => ({
      total: images.length,
      primary: images.filter((image) => Boolean(image.isPrimary)).length,
      relatedTypes: new Set(images.map((image) => image.imageableType)).size,
    }),
    [images],
  );

  const saveImage = async (payload) => {
    try {
      if (dialog.mode === "create") {
        await adminImageService.create(payload);
        notify({
          type: "success",
          title: "Thêm hình ảnh thành công",
          message: `Hình ảnh đã được gắn với ${IMAGE_TYPE_LABELS[payload.imageableType]?.toLowerCase() || "đối tượng"} #${payload.imageableId}.`,
        });
      } else {
        await adminImageService.update(dialog.image.id, payload);
        notify({
          type: "success",
          title: "Đã cập nhật hình ảnh",
          message: `Thông tin hình ảnh #${dialog.image.id} đã được lưu.`,
        });
      }
      setDialog(null);
      await loadImages();
    } catch (error) {
      setPageError(getImageErrorMessage(error));
      throw error;
    }
  };

  const setPrimary = async (image) => {
    if (image.isPrimary || pendingPrimaryId != null) return;
    setPendingPrimaryId(image.id);
    try {
      const updated = await adminImageService.setPrimary(image.id);
      setImages((current) =>
        current.map((item) =>
          item.imageableType === image.imageableType &&
          item.imageableId === image.imageableId
            ? { ...item, isPrimary: item.id === image.id }
            : item,
        ),
      );
      notify({
        type: "success",
        title: "Đã đặt ảnh đại diện",
        message: `Ảnh #${image.id} hiện là ảnh đại diện cho ${IMAGE_TYPE_LABELS[image.imageableType]?.toLowerCase() || "đối tượng"} #${image.imageableId}.`,
      });
      if (!updated) await loadImages();
    } catch (error) {
      notify({ type: "error", message: getImageErrorMessage(error) });
    } finally {
      setPendingPrimaryId(null);
    }
  };

  const deleteImage = async (image) => {
    if (
      !window.confirm(
        `Xóa vĩnh viễn hình ảnh #${image.id}? Thao tác này chỉ xóa bản ghi ảnh, không xóa tệp từ máy chủ bên ngoài.`,
      )
    )
      return;
    try {
      await adminImageService.delete(image.id);
      setImages((current) => current.filter((item) => item.id !== image.id));
      notify({
        type: "success",
        title: "Đã xóa hình ảnh",
        message: `Bản ghi hình ảnh #${image.id} đã được xóa.`,
      });
    } catch (error) {
      notify({ type: "error", message: getImageErrorMessage(error) });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setType("");
    setPrimaryState("");
    setSortOrder("newest");
  };
  const columns = [
    { key: "id", title: "Mã", cellClassName: "font-mono text-neutral-400" },
    {
      key: "imageUrl",
      title: "Hình ảnh",
      render: (url, image) => (
        <div className="flex min-w-56 items-center gap-3">
          <img
            src={url}
            alt={image.description || `Ảnh #${image.id}`}
            className="h-14 w-20 shrink-0 rounded-lg border border-neutral-800 bg-neutral-950 object-cover"
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
          <div className="min-w-0">
            <p
              className="max-w-64 truncate font-medium text-neutral-200"
              title={image.description || ""}
            >
              {image.description || "Không có mô tả"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block max-w-64 truncate text-[11px] text-neutral-500 hover:text-amber-300"
              title={url}
            >
              {url}
            </a>
          </div>
        </div>
      ),
    },
    {
      key: "imageableType",
      title: "Đối tượng",
      render: (value, image) => (
        <div className="min-w-32">
          <p className="font-medium text-neutral-200">
            {IMAGE_TYPE_LABELS[value] || value || "—"}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            Mã đối tượng: {image.imageableId}
          </p>
        </div>
      ),
    },
    {
      key: "isPrimary",
      title: "Vai trò",
      render: (value, image) =>
        value ? (
          <StatusBadge status="primary" domain="imagePrimary" />
        ) : (
          <button
            type="button"
            disabled={pendingPrimaryId != null}
            onClick={() => setPrimary(image)}
            title="Đặt làm ảnh đại diện"
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-400 transition hover:border-amber-500/40 hover:text-amber-300 disabled:opacity-50"
          >
            <Star className="h-3.5 w-3.5" />
            Đặt đại diện
          </button>
        ),
    },
    { key: "createdAt", title: "Ngày tạo", render: formatImageDate },
  ];

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">
            Quản lý hệ thống
          </p>
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-white">
            <ImageIcon className="h-6 w-6 text-amber-300" />
            Quản lý hình ảnh
          </h1>
          <p className="mt-1 max-w-3xl text-xs text-neutral-400">
            Quản lý URL ảnh, mô tả và liên kết ảnh với phòng chụp, bối cảnh,
            thiết bị, trang phục, phụ kiện, gói chụp hoặc dịch vụ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialog({ mode: "create", image: null })}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-amber-400 px-4 text-xs font-semibold text-neutral-950 transition hover:bg-amber-300 sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Thêm hình ảnh
        </button>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          icon={Layers3}
          label="Tổng bản ghi ảnh"
          value={stats.total}
        />
        <SummaryCard
          icon={Star}
          label="Ảnh đại diện"
          value={stats.primary}
          tone="green"
        />
        <SummaryCard
          icon={Check}
          label="Loại đối tượng đang dùng"
          value={`${stats.relatedTypes}/${IMAGEABLE_TYPES.length}`}
          tone="blue"
        />
      </div>
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Tìm mã ảnh, URL, mô tả hoặc mã đối tượng..."
        filters={[
          {
            key: "type",
            label: "Loại đối tượng",
            value: type,
            onChange: setType,
            options: IMAGEABLE_TYPES,
          },
          {
            key: "primary",
            label: "Vai trò hình ảnh",
            value: primaryState,
            onChange: setPrimaryState,
            options: IMAGE_PRIMARY_FILTER_OPTIONS,
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
            onClick={loadImages}
            className="ml-auto whitespace-nowrap font-medium underline"
          >
            Tải lại
          </button>
        </div>
      )}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/50 text-sm text-neutral-400">
          <span className="mr-3 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-300" />
          Đang tải hình ảnh...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={filtered}
          emptyMessage="Không có hình ảnh phù hợp với bộ lọc."
          onDetail={(image) => setDialog({ mode: "detail", image })}
          onEdit={(image) => setDialog({ mode: "edit", image })}
          onDelete={deleteImage}
        />
      )}
      {dialog && (
        <ImageDialog
          key={`${dialog.mode}-${dialog.image?.id ?? "new"}`}
          image={dialog.image}
          mode={dialog.mode}
          onClose={() => setDialog(null)}
          onSave={saveImage}
        />
      )}
    </section>
  );
}
