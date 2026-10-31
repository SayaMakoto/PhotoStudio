import { useEffect, useRef, useState } from "react";
import { CalendarDays, Camera, X } from "lucide-react";
import StatusBadge from "../../../components/admin/common/StatusBadge";
import ImageUploadField from "../../../components/admin/common/ImageUploadField";
import ImageDetailPreview from "../../../components/admin/common/ImageDetailPreview";
import GlideSelect from "../../../components/admin/common/GlideSelect";
import {
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_TYPE_LABELS,
  EQUIPMENT_TYPE_OPTIONS,
  formatEquipmentDate,
  getEquipmentErrorMessage,
} from "./equipmentConfig";

const EMPTY_FORM = {
  type: "camera",
  name: "",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  description: "",
  status: "available",
};

function toFormValue(equipment) {
  return {
    ...EMPTY_FORM,
    ...equipment,
    purchaseDate: equipment?.purchaseDate?.slice(0, 16) || "",
  };
}

function DetailRow({ label, children }) {
  return (
    <div className="border-b border-neutral-800/80 py-3 last:border-0">
      <dt className="text-[11px] text-neutral-500">{label}</dt>
      <dd className="mt-1 wrap-break-word text-sm text-neutral-200">
        {children || "—"}
      </dd>
    </div>
  );
}

export default function EquipmentDialog({ equipment, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => toFormValue(equipment));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const purchaseDateInputRef = useRef(null);
  const isDetail = mode === "detail";
  const title =
    mode === "create"
      ? "Thêm thiết bị"
      : mode === "edit"
        ? "Cập nhật thiết bị"
        : "Chi tiết thiết bị";

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, saving]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openPurchaseDatePicker = () => {
    const input = purchaseDateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    const purchaseDate = form.purchaseDate
      ? `${form.purchaseDate}${form.purchaseDate.length === 16 ? ":00" : ""}`
      : null;
    try {
      await onSave({ ...form, purchaseDate, imageUrl: form.imageUrl });
    } catch (error) {
      setSaveError(getEquipmentErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const inputClassName =
    "mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-dialog-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
              <Camera className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="equipment-dialog-title"
                className="font-semibold text-white"
              >
                {title}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                {equipment?.id
                  ? `Mã thiết bị #${equipment.id}`
                  : "Kho thiết bị studio"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {isDetail ? (
          <>
          <div className="px-5 pt-4"><ImageDetailPreview imageableType="equipment" imageableId={equipment?.id} alt={`Ảnh thiết bị ${equipment?.name || ''}`} /></div>
          <dl className="grid gap-x-8 px-5 py-2 sm:grid-cols-2">
            <DetailRow label="Tên thiết bị">{equipment?.name}</DetailRow>
            <DetailRow label="Loại thiết bị">
              {EQUIPMENT_TYPE_LABELS[equipment?.type] || equipment?.type}
            </DetailRow>
            <DetailRow label="Thương hiệu">{equipment?.brand}</DetailRow>
            <DetailRow label="Mẫu / model">{equipment?.model}</DetailRow>
            <DetailRow label="Số serial">{equipment?.serialNumber}</DetailRow>
            <DetailRow label="Ngày mua">
              {formatEquipmentDate(equipment?.purchaseDate)}
            </DetailRow>
            <DetailRow label="Trạng thái">
              <StatusBadge status={equipment?.status} />
            </DetailRow>
            <div className="sm:col-span-2">
              <DetailRow label="Mô tả">{equipment?.description}</DetailRow>
            </div>
          </dl>
          </>
        ) : (
          <form onSubmit={submit} className="space-y-4 px-5 py-5">
            {saveError && (
              <div
                role="alert"
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200"
              >
                {saveError}
              </div>
            )}
            <ImageUploadField label="Ảnh thiết bị" imageableType="equipment" imageableId={equipment?.id} value={form.imageUrl || ""} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium text-neutral-300 sm:col-span-2">
                Tên thiết bị <span className="text-rose-300">*</span>
                <input
                  autoFocus
                  required
                  maxLength={255}
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  className={inputClassName}
                  placeholder="Ví dụ: Máy ảnh Sony A7 IV"
                />
              </label>
              <div className="text-xs font-medium text-neutral-300">
                Loại thiết bị <span className="text-rose-300">*</span>
                <GlideSelect
                  options={EQUIPMENT_TYPE_OPTIONS}
                  value={form.type}
                  onChange={(type) => setForm((current) => ({ ...current, type }))}
                  ariaLabel="Loại thiết bị"
                  showTags={false}
                  size="md"
                  accentColor="#fbbf24"
                  surfaceColor="#0a0a0a"
                  highlightColor="#262626"
                  textColor="#e5e5e5"
                  menuWidth={240}
                  className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800"
                />
              </div>
              <div className="text-xs font-medium text-neutral-300">
                Trạng thái
                <GlideSelect
                  options={EQUIPMENT_STATUS_OPTIONS}
                  value={form.status}
                  onChange={(status) => setForm((current) => ({ ...current, status }))}
                  ariaLabel="Trạng thái thiết bị"
                  showTags={false}
                  size="md"
                  accentColor="#fbbf24"
                  surfaceColor="#0a0a0a"
                  highlightColor="#262626"
                  textColor="#e5e5e5"
                  menuWidth={240}
                  className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800"
                />
              </div>
              <label className="text-xs font-medium text-neutral-300">
                Thương hiệu
                <input
                  maxLength={255}
                  name="brand"
                  value={form.brand}
                  onChange={updateField}
                  className={inputClassName}
                  placeholder="Sony, Canon, Godox..."
                />
              </label>
              <label className="text-xs font-medium text-neutral-300">
                Model
                <input
                  maxLength={255}
                  name="model"
                  value={form.model}
                  onChange={updateField}
                  className={inputClassName}
                  placeholder="Tên hoặc mã model"
                />
              </label>
              <label className="text-xs font-medium text-neutral-300">
                Số serial
                <input
                  maxLength={255}
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={updateField}
                  className={inputClassName}
                  placeholder="Mã serial duy nhất"
                />
              </label>
              <label className="text-xs font-medium text-neutral-300">
                Ngày và giờ mua
                <span className="relative mt-1.5 block">
                  <input
                    ref={purchaseDateInputRef}
                    type="datetime-local"
                    step="60"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={updateField}
                    className={`${inputClassName} datetime-picker-native mt-0 pr-10 [color-scheme:dark]`}
                  />
                  <button
                    type="button"
                    onClick={openPurchaseDatePicker}
                    aria-label="Mở bộ chọn ngày và giờ mua"
                    title="Chọn ngày và giờ"
                    className="absolute top-1/2 right-2 inline-grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-rose-400 transition hover:bg-rose-500/10 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-amber-300"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </label>
              <label className="text-xs font-medium text-neutral-300 sm:col-span-2">
                Mô tả
                <textarea
                  rows={3}
                  maxLength={255}
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  className={`${inputClassName} resize-y`}
                  placeholder="Ghi chú về tình trạng hoặc đặc điểm thiết bị"
                />
              </label>
            </div>
            <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={onClose}
                className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-60"
              >
                {saving
                  ? "Đang lưu..."
                  : mode === "create"
                    ? "Thêm thiết bị"
                    : "Lưu thay đổi"}
              </button>
            </footer>
          </form>
        )}
        {isDetail && (
          <footer className="flex justify-end border-t border-neutral-800 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800"
            >
              Đóng
            </button>
          </footer>
        )}
      </section>
    </div>
  );
}
