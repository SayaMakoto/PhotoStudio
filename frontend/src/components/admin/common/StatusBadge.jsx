import { getStatusDefinition } from "./statusConfig";

export default function StatusBadge({
  status,
  domain,
  onClick,
  disabled = false,
}) {
  const definition = getStatusDefinition(status, domain);
  const className = `inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none ${definition.className}`;

  if (!onClick) {
    return <span className={className}>{definition.label}</span>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Đổi trạng thái hiện tại: ${definition.label}`}
      title="Nhấn để đổi trạng thái"
      className={`${className} transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {definition.label}
    </button>
  );
}
