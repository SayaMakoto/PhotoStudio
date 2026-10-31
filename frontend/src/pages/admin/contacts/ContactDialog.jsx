import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Mail,
  Phone,
  User,
  X,
  MessageSquare,
  Send,
  Trash2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '../../../components/admin/common/StatusBadge';
import { CONTACT_STATUS_OPTIONS, formatContactDate, getContactErrorMessage } from './contactConfig';

function DetailRow({ label, icon: Icon, children }) {
  return (
    <div className="border-b border-neutral-800/80 py-3 last:border-0">
      <dt className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
        {Icon && <Icon className="h-3.5 w-3.5 text-neutral-400" />}
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-neutral-200">
        {children || '—'}
      </dd>
    </div>
  );
}

export default function ContactDialog({ contact, onClose, onUpdateStatus, onDelete }) {
  const [status, setStatus] = useState(contact.status || 'pending');
  const [replyMessage, setReplyMessage] = useState(contact.replyMessage || '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !saving && !deleting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving, deleting]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Tự động chuyển thành 'completed' nếu có phản hồi và trạng thái vẫn là 'pending'
      const finalStatus = (status === 'pending' && replyMessage.trim()) ? 'completed' : status;
      await onUpdateStatus(contact.id, finalStatus, replyMessage.trim());
    } catch (saveError) {
      setError(getContactErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thư liên hệ #${contact.id} từ "${contact.fullname}"?`)) {
      return;
    }
    setDeleting(true);
    setError('');
    try {
      await onDelete(contact.id);
    } catch (delError) {
      setError(getContactErrorMessage(delError));
      setDeleting(false);
    }
  };

  const mailtoUrl = `mailto:${encodeURIComponent(contact.email || '')}?subject=${encodeURIComponent(`[PhotoStudio] Phản hồi: ${contact.subject || 'Yêu cầu liên hệ'}`)}&body=${encodeURIComponent(`Kính gửi ${contact.fullname || 'Quý khách'},\n\nCảm ơn Quý khách đã liên hệ với PhotoStudio.\n\n${replyMessage || ''}\n\nTrân trọng,\nPhotoStudio Team`)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving && !deleting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl"
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
              Chi tiết liên hệ khách hàng
            </p>
            <h2 id="contact-dialog-title" className="mt-0.5 text-base font-semibold text-white">
              Yêu cầu #{contact.id}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="cursor-pointer rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Nội dung chi tiết */}
        <div className="space-y-5 px-6 py-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200"
            >
              {error}
            </div>
          )}

          {/* Thông tin người gửi */}
          <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Thông tin người gửi
            </h3>
            <dl className="grid gap-x-6 sm:grid-cols-2">
              <DetailRow label="Họ và tên" icon={User}>
                <span className="font-semibold text-white">{contact.fullname || 'Chưa cung cấp'}</span>
              </DetailRow>
              <DetailRow label="Trạng thái hiện tại">
                <StatusBadge status={contact.status} domain="contact" />
              </DetailRow>
              <DetailRow label="Địa chỉ Email" icon={Mail}>
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-1 text-sky-400 hover:underline"
                  >
                    {contact.email}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  '—'
                )}
              </DetailRow>
              <DetailRow label="Số điện thoại" icon={Phone}>
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="inline-flex items-center gap-1 font-mono text-emerald-400 hover:underline"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  '—'
                )}
              </DetailRow>
              <DetailRow label="Thời gian gửi" icon={CalendarDays}>
                {formatContactDate(contact.createdAt)}
              </DetailRow>
              <DetailRow label="Cập nhật lần cuối">
                {formatContactDate(contact.updatedAt || contact.createdAt)}
              </DetailRow>
            </dl>
          </section>

          {/* Tiêu đề & Nội dung thư */}
          <section className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Nội dung liên hệ & tư vấn
            </h3>
            <div>
              <span className="text-[11px] text-neutral-500">Chủ đề / Tiêu đề:</span>
              <p className="mt-0.5 text-sm font-semibold text-neutral-100">
                {contact.subject || 'Không có tiêu đề'}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500">Lời nhắn / Yêu cầu chi tiết:</span>
              <div className="mt-1 whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-900/80 p-3.5 text-xs text-neutral-300 leading-relaxed font-sans">
                {contact.message || 'Không có nội dung tin nhắn.'}
              </div>
            </div>
          </section>

          {/* Form Phản hồi & Cập nhật trạng thái */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-rose-500/25 bg-rose-500/5 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-100">
                  <MessageSquare className="h-4 w-4 text-rose-400" />
                  Xử lý & Phản hồi của Quản trị viên
                </h3>
                <p className="mt-0.5 text-[11px] text-neutral-400">
                  Cập nhật trạng thái xử lý và lưu ghi chú / nội dung phản hồi khách hàng.
                </p>
              </div>
            </div>

            {/* Trạng thái xử lý */}
            <div>
              <label
                htmlFor="contact-status-select"
                className="mb-1 block text-xs font-medium text-neutral-300"
              >
                Cập nhật trạng thái:
              </label>
              <select
                id="contact-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-rose-400"
              >
                {CONTACT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Nội dung phản hồi */}
            <div>
              <label
                htmlFor="contact-reply-textarea"
                className="mb-1 block text-xs font-medium text-neutral-300"
              >
                Nội dung câu trả lời / phản hồi:
              </label>
              <textarea
                id="contact-reply-textarea"
                rows={4}
                maxLength={2000}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Nhập nội dung phản hồi khách hàng hoặc ghi chú xử lý..."
                className="w-full resize-y rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 outline-none placeholder:text-neutral-600 focus:border-rose-400"
              />
              <div className="mt-1 flex justify-between text-[11px] text-neutral-500">
                <span>{replyMessage.length}/2000 ký tự</span>
                {contact.email && (
                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1 text-rose-400 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Send className="h-3 w-3" />
                    Mở email gửi trực tiếp
                  </a>
                )}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 disabled:opacity-40"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? 'Đang xóa...' : 'Xóa thư liên hệ'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer rounded-xl border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={saving || deleting}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-rose-600 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {saving ? 'Đang lưu...' : 'Lưu phản hồi & Trạng thái'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
