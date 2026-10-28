import GlideSelect from '../../../components/admin/common/GlideSelect';
import { BOOKING_STATUS_OPTIONS } from './bookingConfig';

export default function BookingStatusSelect({ value, onChange, disabled = false, compact = false }) {
  return <GlideSelect
    options={BOOKING_STATUS_OPTIONS}
    value={value || 'pending'}
    onChange={onChange}
    disabled={disabled}
    ariaLabel="Cập nhật trạng thái đơn đặt lịch"
    showTags={false}
    size={compact ? 'sm' : 'md'}
    accentColor="#fbbf24"
    surfaceColor="#0a0a0a"
    highlightColor="#262626"
    textColor="#e5e5e5"
    menuWidth={200}
    className={compact ? 'w-44 [&>button]:w-full [&>button]:justify-between' : 'w-full [&>button]:w-full [&>button]:justify-between'}
  />;
}
