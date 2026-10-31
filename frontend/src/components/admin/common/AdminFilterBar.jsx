import { RotateCcw } from "lucide-react";
import GlideSelect from "./GlideSelect";
import CurvedInput from "./CurvedInput";

const DEFAULT_SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
];

export default function AdminFilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  sortValue = "newest",
  onSortChange,
  sortOptions = DEFAULT_SORT_OPTIONS,
  onReset,
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 sm:flex-row sm:flex-wrap sm:items-end">
      {onSearchChange && (
        <label className="relative block min-w-56 flex-1">
          <span className="mb-1.5 block text-[11px] font-medium text-neutral-400">
            Tìm kiếm
          </span>
          <CurvedInput
            type="search"
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            ariaLabel="Tìm kiếm"
            width="100%"
            height={30}
            bend={0}
            cornerRadius={12}
            fontSize={12}
            borderWidth={1.5}
            backgroundColor="#0a0a0a"
            textColor="#e5e5e5"
            placeholderColor="#737373"
            borderColor="#262626"
            buttonColor="#fbbf24"
            showButton={false}
            showIcon
            icon={
              <g
                fill="none"
                stroke="#fbbf24"
                strokeLinecap="round"
                strokeWidth="1.8"
              >
                <circle cx="-1.5" cy="-1.5" r="4.5" />
                <path d="m2 2 3.2 3.2" />
              </g>
            }
            className="w-full"
          />
        </label>
      )}

      {filters.map((filter) => (
        <label key={filter.key} className="block min-w-40 flex-1 sm:flex-none">
          <span className="mb-1.5 block text-[11px] font-medium text-neutral-400">
            {filter.label}
          </span>
          <GlideSelect
            options={[
              { value: "", label: filter.allLabel || "Tất cả" },
              ...(filter.options || []),
            ]}
            value={filter.value ?? ""}
            onChange={(value) => filter.onChange?.(value)}
            placeholder={filter.allLabel || "Tất cả"}
            ariaLabel={filter.label}
            showTags={false}
            size="lg"
            accentColor="#fbbf24"
            surfaceColor="#0a0a0a"
            highlightColor="#262626"
            textColor="#e5e5e5"
            menuWidth={220}
            className="w-full [&>button]:w-full [&>button]:justify-between"
          />
        </label>
      ))}

      {onSortChange && (
        <label className="block min-w-40 flex-1 sm:flex-none">
          <span className="mb-1.5 block text-[11px] font-medium text-neutral-400">
            Sắp xếp theo thời gian
          </span>
          <GlideSelect
            options={sortOptions}
            value={sortValue}
            onChange={(value) => onSortChange(value)}
            ariaLabel="Sắp xếp theo thời gian"
            showTags={false}
            size="lg"
            accentColor="#fbbf24"
            surfaceColor="#0a0a0a"
            highlightColor="#262626"
            textColor="#e5e5e5"
            menuWidth={220}
            className="w-full [&>button]:w-full [&>button]:justify-between"
          />
        </label>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-neutral-700 px-3.5 text-xs font-medium text-neutral-300 transition-colors hover:border-rose-400/40 hover:bg-neutral-800 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Đặt lại
        </button>
      )}
    </div>
  );
}
