import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import GlideSelect from '../../../components/admin/common/GlideSelect';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { formatNotificationDate, getNotificationErrorMessage, NOTIFICATION_TYPES, NOTIFICATION_TYPE_LABELS } from './notificationConfig';

const inputClass = 'mt-1.5 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-rose-400/60';

function Detail({ label, children }) {
  return <div className="border-b border-neutral-800/80 py-3 last:border-0"><dt className="text-[11px] text-neutral-500">{label}</dt><dd className="mt-1 break-words text-sm text-neutral-200">{children || '—'}</dd></div>;
}

export default function NotificationDialog({ notification, mode, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    userId: notification?.userId ?? '',
    title: notification?.title ?? '',
    message: notification?.message ?? '',
    type: notification?.type ?? 'system',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const detail = mode === 'detail';
  const title = mode === 'create' ? 'Tạo thông báo' : mode === 'edit' ? 'Chỉnh sửa thông báo' : 'Chi tiết thông báo';

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape' && !saving) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, saving]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        userId: Number(form.userId),
        title: form.title.trim(),
        message: form.message.trim(),
        type: form.type,
      });
    } catch (saveError) {
      setError(getNotificationErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="notification-dialog-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-5 py-4 backdrop-blur"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><Bell className="h-5 w-5" /></span><div><h2 id="notification-dialog-title" className="font-semibold text-white">{title}</h2><p className="mt-0.5 text-xs text-neutral-500">{notification?.id ? `Mã thông báo #${notification.id}` : 'Thông báo gửi đến một tài khoản cụ thể'}</p></div></div><button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"><X className="h-4 w-4" /></button></header>
      {detail ? <><dl className="grid gap-x-8 px-5 py-3 sm:grid-cols-2"><Detail label="Người nhận">{notification?.userFullname || `Người dùng #${notification?.userId}`}</Detail><Detail label="Loại chức năng">{NOTIFICATION_TYPE_LABELS[notification?.type] || notification?.type}</Detail><Detail label="Tiêu đề">{notification?.title}</Detail><Detail label="Trạng thái">{notification?.readAt ? 'Đã đọc' : 'Chưa đọc'}</Detail><div className="sm:col-span-2"><Detail label="Nội dung">{notification?.message}</Detail></div><Detail label="Thời điểm tạo">{formatNotificationDate(notification?.createdAt)}</Detail><Detail label="Thời điểm đọc">{notification?.readAt ? formatNotificationDate(notification.readAt) : 'Chưa đọc'}</Detail></dl><footer className="flex justify-end border-t border-neutral-800 px-5 py-4"><button type="button" onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Đóng</button></footer></> : <form onSubmit={submit} className="space-y-4 px-5 py-5">
        {error && <div role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs text-rose-200">{error}</div>}
        <label className="block text-xs font-medium text-neutral-300">Mã người nhận <span className="text-rose-300">*</span><input autoFocus required min="1" type="number" value={form.userId} onChange={(event) => setForm((current) => ({ ...current, userId: event.target.value }))} className={inputClass} placeholder="Nhập ID tài khoản nhận thông báo" /><span className="mt-1 block text-[11px] text-neutral-500">Backend yêu cầu userId; hệ thống hiện chưa có API danh sách người nhận riêng trong luồng thông báo.</span></label>
        <label className="block text-xs font-medium text-neutral-300">Chức năng <span className="text-rose-300">*</span><GlideSelect options={NOTIFICATION_TYPES} value={form.type} onChange={(type) => setForm((current) => ({ ...current, type }))} ariaLabel="Chức năng thông báo" showTags={false} size="md" accentColor="#fbbf24" surfaceColor="#0a0a0a" highlightColor="#262626" textColor="#e5e5e5" menuWidth={260} className="mt-1.5 w-full [&>button]:min-h-10 [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800" /></label>
        <label className="block text-xs font-medium text-neutral-300">Tiêu đề <span className="text-rose-300">*</span><input required maxLength={255} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className={inputClass} placeholder="Tiêu đề thông báo" /></label>
        <label className="block text-xs font-medium text-neutral-300">Nội dung <span className="text-rose-300">*</span><textarea required maxLength={255} rows={4} value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} className={`${inputClass} resize-y`} placeholder="Nội dung thông báo (tối đa 255 ký tự)" /><span className="mt-1 block text-right text-[11px] text-neutral-500">{form.message.length}/255</span></label>
        {notification && <div className="flex items-center gap-2 text-xs text-neutral-400">Trạng thái hiện tại: <StatusBadge status={notification.readAt ? 'read' : 'unread'} domain="notification" /></div>}
        <footer className="flex justify-end gap-2 border-t border-neutral-800 pt-4"><button type="button" disabled={saving} onClick={onClose} className="rounded-xl border border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800">Hủy</button><button type="submit" disabled={saving} className="rounded-xl bg-rose-500 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-rose-600 disabled:opacity-60">{saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo thông báo' : 'Lưu thay đổi'}</button></footer>
      </form>}
    </section>
  </div>;
}
