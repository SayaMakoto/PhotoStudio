import { useEffect, useState } from 'react';
import { Camera, CircleAlert, Plus, Trash2, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import ImageUploadField from '../../../components/admin/common/ImageUploadField';
import ImageDetailPreview from '../../../components/admin/common/ImageDetailPreview';
import adminPackageService from '../../../services/admin/packageService';
import { PACKAGE_EQUIPMENT_LABELS, PACKAGE_EQUIPMENT_OPTIONS, PACKAGE_STATUS_OPTIONS, formatPackageDate, formatPackagePrice, getPackageErrorMessage } from './packageConfig';

const EMPTY = { name: '', description: '', duration: 0, price: 0, status: 'active', equipments: [] };
const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-amber-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 wrap-break-word text-sm text-neutral-200">{children || '—'}</dd></div>;
}

function Select({ label, options, value, onChange, ariaLabel }) {
  return <div className="text-xs font-medium text-neutral-300">{label}<GlideSelect options={options} value={value} onChange={onChange} ariaLabel={ariaLabel} showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={260} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></div>;
}

export default function PackageDialog({ packageEntity, mode, onClose, onSave, notify }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...packageEntity, equipments: packageEntity?.equipments?.map(({ equipmentType, quantity }) => ({ equipmentType, quantity })) || [] }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [relationsLoading, setRelationsLoading] = useState(Boolean(packageEntity?.id));
  const [relationsError, setRelationsError] = useState('');
  const [packageServices, setPackageServices] = useState([]);
  const [packageBackgrounds, setPackageBackgrounds] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [backgroundOptions, setBackgroundOptions] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [backgroundId, setBackgroundId] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Tạo gói chụp' : mode === 'edit' ? 'Cập nhật gói chụp' : 'Chi tiết gói chụp';

  const reloadRelations = async () => {
    if (!packageEntity?.id) return;
    setRelationsLoading(true); setRelationsError('');
    try {
      const [linkedServices, linkedBackgrounds, services, backgrounds] = await Promise.all([
        adminPackageService.getPackageServices(packageEntity.id),
        adminPackageService.getPackageBackgrounds(packageEntity.id),
        adminPackageService.getServiceCatalog(),
        adminPackageService.getBackgroundCatalog(),
      ]);
      setPackageServices(Array.isArray(linkedServices) ? linkedServices : []);
      setPackageBackgrounds(Array.isArray(linkedBackgrounds) ? linkedBackgrounds : []);
      setServiceOptions((Array.isArray(services) ? services : []).filter((item) => item.status === 'active').map((item) => ({ value: String(item.id), label: `${item.name} · ${item.price?.toLocaleString?.('vi-VN') || 0} ₫` })));
      setBackgroundOptions((Array.isArray(backgrounds) ? backgrounds : []).filter((item) => item.status === 'active').map((item) => ({ value: String(item.id), label: item.name })));
    } catch (loadError) { setRelationsError(getPackageErrorMessage(loadError)); }
    finally { setRelationsLoading(false); }
  };

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  useEffect(() => {
    if (!packageEntity?.id) return undefined;
    let mounted = true;
    Promise.all([
      adminPackageService.getPackageServices(packageEntity.id),
      adminPackageService.getPackageBackgrounds(packageEntity.id),
      adminPackageService.getServiceCatalog(),
      adminPackageService.getBackgroundCatalog(),
    ]).then(([linkedServices, linkedBackgrounds, services, backgrounds]) => {
      if (!mounted) return;
      setPackageServices(Array.isArray(linkedServices) ? linkedServices : []);
      setPackageBackgrounds(Array.isArray(linkedBackgrounds) ? linkedBackgrounds : []);
      setServiceOptions((Array.isArray(services) ? services : []).filter((item) => item.status === 'active').map((item) => ({ value: String(item.id), label: `${item.name} · ${item.price?.toLocaleString?.('vi-VN') || 0} ₫` })));
      setBackgroundOptions((Array.isArray(backgrounds) ? backgrounds : []).filter((item) => item.status === 'active').map((item) => ({ value: String(item.id), label: item.name })));
    }).catch((loadError) => {
      if (mounted) setRelationsError(getPackageErrorMessage(loadError));
    }).finally(() => {
      if (mounted) setRelationsLoading(false);
    });
    return () => { mounted = false; };
  }, [packageEntity?.id]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await onSave({ ...form, duration: Number(form.duration), price: Number(form.price), equipments: form.equipments.map((item) => ({ ...item, quantity: Number(item.quantity) })), imageUrl: form.imageUrl }); }
    catch (saveError) { setError(getPackageErrorMessage(saveError)); }
    finally { setSaving(false); }
  };

  const addEquipment = () => setForm((current) => ({ ...current, equipments: [...current.equipments, { equipmentType: 'camera', quantity: 1 }] }));
  const updateEquipment = (index, key, value) => setForm((current) => ({ ...current, equipments: current.equipments.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  const removeEquipment = (index) => setForm((current) => ({ ...current, equipments: current.equipments.filter((_, itemIndex) => itemIndex !== index) }));

  const addService = async () => {
    if (!serviceId) return;
    try {
      await adminPackageService.addPackageService({ packageId: packageEntity.id, serviceId: Number(serviceId), quantity: Number(serviceQuantity) });
      setServiceId(''); setServiceQuantity(1); await reloadRelations();
      notify?.({ type: 'success', message: 'Đã thêm dịch vụ vào gói chụp.' });
    } catch (relationError) { setRelationsError(getPackageErrorMessage(relationError)); }
  };

  const removeService = async (item) => {
    if (!window.confirm(`Gỡ dịch vụ “${item.serviceName}” khỏi gói chụp?`)) return;
    try { await adminPackageService.removePackageService(item.id); await reloadRelations(); notify?.({ type: 'success', message: 'Đã gỡ dịch vụ khỏi gói chụp.' }); }
    catch (relationError) { setRelationsError(getPackageErrorMessage(relationError)); }
  };

  const addBackground = async () => {
    if (!backgroundId) return;
    try {
      await adminPackageService.addPackageBackground({ packageId: packageEntity.id, backgroundId: Number(backgroundId) });
      setBackgroundId(''); await reloadRelations(); notify?.({ type: 'success', message: 'Đã thêm bối cảnh vào gói chụp.' });
    } catch (relationError) { setRelationsError(getPackageErrorMessage(relationError)); }
  };

  const removeBackground = async (item) => {
    if (!window.confirm(`Gỡ bối cảnh “${item.backgroundName}” khỏi gói chụp?`)) return;
    try { await adminPackageService.removePackageBackground(item.id); await reloadRelations(); notify?.({ type: 'success', message: 'Đã gỡ bối cảnh khỏi gói chụp.' }); }
    catch (relationError) { setRelationsError(getPackageErrorMessage(relationError)); }
  };

  const canEditRelations = mode === 'edit' && packageEntity?.status === 'active';

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="package-dialog-title" className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><Camera className="h-5 w-5" /></span><div><h2 id="package-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{packageEntity?.id ? `Mã gói #${packageEntity.id}` : 'Danh mục gói chụp studio'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <div className="space-y-5 px-5 py-4"><ImageDetailPreview imageableType="package" imageableId={packageEntity?.id} alt={`Ảnh gói chụp ${packageEntity?.name || ''}`} /><dl className="grid gap-x-8 sm:grid-cols-2"><Detail label="Tên gói">{packageEntity?.name}</Detail><Detail label="Thời lượng">{packageEntity?.duration} phút</Detail><Detail label="Giá gói">{formatPackagePrice(packageEntity?.price)}</Detail><Detail label="Trạng thái"><StatusBadge status={packageEntity?.status} /></Detail><div className="sm:col-span-2"><Detail label="Mô tả">{packageEntity?.description}</Detail></div><Detail label="Ngày tạo">{formatPackageDate(packageEntity?.createdAt)}</Detail><Detail label="Cập nhật lần cuối">{formatPackageDate(packageEntity?.updatedAt)}</Detail><div className="sm:col-span-2"><dt className="text-[11px] text-neutral-500">Thiết bị yêu cầu trong gói</dt><dd className="mt-2 flex flex-wrap gap-2">{packageEntity?.equipments?.length ? packageEntity.equipments.map((item, index) => <span key={`${item.equipmentType}-${index}`} className="rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs text-neutral-200">{PACKAGE_EQUIPMENT_LABELS[item.equipmentType] || item.equipmentType}: {item.quantity}</span>) : <span className="text-sm text-neutral-500">Chưa yêu cầu thiết bị cụ thể</span>}</dd></div></dl>
        <RelationshipPanel title="Dịch vụ đi kèm" loading={relationsLoading} error={relationsError} empty="Gói chưa có dịch vụ đi kèm.">{packageServices.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-300"><span>{item.serviceName} <span className="text-neutral-500">× {item.quantity}</span></span><span>{formatPackagePrice(item.subtotal)}</span></div>)}</RelationshipPanel>
        <RelationshipPanel title="Bối cảnh áp dụng" loading={relationsLoading} error={relationsError} empty="Gói chưa gắn bối cảnh.">{packageBackgrounds.map((item) => <div key={item.id} className="rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-300">{item.backgroundName}</div>)}</RelationshipPanel>
      </div> : <form onSubmit={submit} className="space-y-5 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <ImageUploadField label="Ảnh gói chụp" imageableType="package" imageableId={packageEntity?.id} value={form.imageUrl || ''} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))} />
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium text-neutral-300 sm:col-span-2">Tên gói chụp <span className="text-rose-300">*</span><input autoFocus required maxLength={255} value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className={inputClass} placeholder="Ví dụ: Gói cưới Premium" /></label>
          <label className="block text-xs font-medium text-neutral-300">Thời lượng (phút)<input type="number" min="0" step="1" required value={form.duration ?? 0} onChange={(e) => setForm((current) => ({ ...current, duration: e.target.value }))} className={inputClass} /></label><label className="block text-xs font-medium text-neutral-300">Giá gói (VND)<input type="number" min="0" step="1000" required value={form.price ?? 0} onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))} className={inputClass} /></label>
          <div><Select label="Trạng thái" options={PACKAGE_STATUS_OPTIONS} value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} ariaLabel="Trạng thái gói chụp" /></div><label className="block text-xs font-medium text-neutral-300 sm:col-span-2">Mô tả<textarea rows={3} maxLength={255} value={form.description || ''} onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))} className={`${inputClass} resize-y`} placeholder="Mô tả nội dung và quyền lợi của gói chụp" /></label></div>
        <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-medium text-neutral-100">Yêu cầu thiết bị</h3><p className="mt-0.5 text-[11px] text-neutral-500">Số lượng tối thiểu theo từng loại thiết bị.</p></div><button type="button" onClick={addEquipment} className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800"><Plus className="h-3.5 w-3.5" />Thêm loại</button></div>
          <div className="space-y-2">{form.equipments.map((item, index) => <div key={`equipment-${index}`} className="grid gap-2 sm:grid-cols-[1fr_140px_auto]"><Select label="Loại thiết bị" options={PACKAGE_EQUIPMENT_OPTIONS} value={item.equipmentType} onChange={(equipmentType) => updateEquipment(index, 'equipmentType', equipmentType)} ariaLabel={`Loại thiết bị dòng ${index + 1}`} /><label className="block text-xs font-medium text-neutral-300">Số lượng<input type="number" min="1" step="1" required value={item.quantity ?? 1} onChange={(e) => updateEquipment(index, 'quantity', e.target.value)} className={inputClass} /></label><button type="button" onClick={() => removeEquipment(index)} aria-label="Gỡ loại thiết bị" title="Gỡ" className="self-end rounded-lg p-2.5 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div>)}{form.equipments.length === 0 && <p className="py-3 text-xs text-neutral-500">Gói này chưa yêu cầu thiết bị cụ thể.</p>}</div>
        </section>
        {packageEntity?.id && <section className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-950/50 p-4"><div><h3 className="text-sm font-medium text-neutral-100">Thành phần gói chụp</h3><p className="mt-0.5 text-[11px] text-neutral-500">Dịch vụ và bối cảnh được lưu qua các bảng liên kết riêng.</p></div>{relationsError && <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{relationsError}<button type="button" onClick={reloadRelations} className="ml-2 underline">Tải lại</button></div>}
          {canEditRelations && <div className="space-y-2"><div className="grid gap-2 sm:grid-cols-[1fr_100px_auto]"><Select label="Dịch vụ" options={serviceOptions} value={serviceId} onChange={setServiceId} ariaLabel="Chọn dịch vụ thêm vào gói" /><label className="block text-xs font-medium text-neutral-300">Số lượng<input type="number" min="1" value={serviceQuantity} onChange={(e) => setServiceQuantity(e.target.value)} className={inputClass} /></label><button type="button" disabled={!serviceId || relationsLoading} onClick={addService} className="self-end rounded-lg bg-amber-400 px-3 py-2.5 text-xs font-semibold text-neutral-950 disabled:opacity-50">Thêm dịch vụ</button></div><div className="grid gap-2 sm:grid-cols-[1fr_auto]"><Select label="Bối cảnh" options={backgroundOptions} value={backgroundId} onChange={setBackgroundId} ariaLabel="Chọn bối cảnh thêm vào gói" /><button type="button" disabled={!backgroundId || relationsLoading} onClick={addBackground} className="self-end rounded-lg bg-amber-400 px-3 py-2.5 text-xs font-semibold text-neutral-950 disabled:opacity-50">Thêm bối cảnh</button></div></div>}
          <RelationshipPanel title="Dịch vụ đi kèm" loading={relationsLoading} error={relationsError} empty="Chưa có dịch vụ gắn với gói.">{packageServices.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-300"><span>{item.serviceName} <span className="text-neutral-500">× {item.quantity}</span></span><div className="flex items-center gap-3"><span>{formatPackagePrice(item.subtotal)}</span>{canEditRelations && <button type="button" onClick={() => removeService(item)} aria-label={`Gỡ ${item.serviceName}`} className="rounded p-1 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /></button>}</div></div>)}</RelationshipPanel>
          <RelationshipPanel title="Bối cảnh áp dụng" loading={relationsLoading} error={relationsError} empty="Chưa có bối cảnh gắn với gói.">{packageBackgrounds.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 px-3 py-2 text-xs text-neutral-300"><span>{item.backgroundName}</span>{canEditRelations && <button type="button" onClick={() => removeBackground(item)} aria-label={`Gỡ ${item.backgroundName}`} className="rounded p-1 text-rose-300 hover:bg-rose-500/10"><Trash2 className="h-3.5 w-3.5" /></button>}</div>)}</RelationshipPanel>
          {!canEditRelations && !detail && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5" />Chỉ gói đang hoạt động mới cho phép thay đổi dịch vụ và bối cảnh.</p>}
        </section>}
        {mode === 'create' && <p className="flex items-center gap-2 text-[11px] text-neutral-500"><CircleAlert className="h-3.5 w-3.5 shrink-0" />Sau khi tạo gói, có thể thêm dịch vụ và bối cảnh trong phần chỉnh sửa.</p>}
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button><button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-amber-300 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo gói chụp' : 'Lưu thông tin gói'}</button></footer>
      </form>}
      {detail && <footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer>}
    </section>
  </div>;
}

function RelationshipPanel({ title, loading, error, empty, children }) {
  return <div className="space-y-2"><h4 className="text-xs font-medium text-neutral-300">{title}</h4>{loading ? <p className="text-xs text-neutral-500">Đang tải thành phần gói...</p> : children.length ? <div className="space-y-2">{children}</div> : <p className="rounded-lg border border-dashed border-neutral-800 px-3 py-3 text-xs text-neutral-500">{error ? 'Không tải được dữ liệu thành phần.' : empty}</p>}</div>;
}
