import GlideSelect from '../../../components/admin/common/GlideSelect';
import { BOOKING_STATUS_OPTIONS } from './bookingConfig';

export default function BookingStatusSelect({ nextStatus, onChange, disabled = false }) {
  const nextOption = BOOKING_STATUS_OPTIONS.find((option) => option.value === nextStatus);
  if (!nextOption) return null;

  return <GlideSelect
    options={[nextOption]}
    value=""
    onChange={onChange}
    disabled={disabled}
    ariaLabel={`Chuyển sang trạng thái ${nextOption.label}`}
    placeholder="Chọn trạng thái tiếp theo"
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
