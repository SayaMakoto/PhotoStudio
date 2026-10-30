import GlideSelect from '../../../components/admin/common/GlideSelect';
import { BOOKING_STATUS_OPTIONS } from './bookingConfig';

export default function BookingStatusSelect({ options = BOOKING_STATUS_OPTIONS, onChange, disabled = false }) {
  if (!options.length) return null;

  return <GlideSelect
    options={options}
    value=""
    onChange={onChange}
    disabled={disabled}
    ariaLabel="Chọn quyết định cho đơn đặt lịch"
    placeholder="Chọn xác nhận hoặc từ chối"
    showTags={false}
    size="md"
    accentColor="#fbbf24"
    surfaceColor="#0a0a0a"
    highlightColor="#262626"
    textColor="#e5e5e5"
    menuWidth={220}
    className="w-full [&>button]:w-full [&>button]:justify-between [&>button]:border [&>button]:border-neutral-800"
  />;
}
