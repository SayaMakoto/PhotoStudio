import { RotateCcw, Search } from "lucide-react";

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
          <Search className="pointer-events-none absolute left-3 top-[2.15rem] h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-9 pr-3 text-xs text-neutral-200 outline-none placeholder:text-neutral-500 focus:border-amber-400/60"
          />
        </label>
      )}

      {filters.map((filter) => (
        <label key={filter.key} className="block min-w-40 flex-1 sm:flex-none">
          <span className="mb-1.5 block text-[11px] font-medium text-neutral-400">
            {filter.label}
          </span>
          <select
            value={filter.value ?? ""}
            onChange={(event) => filter.onChange?.(event.target.value)}
            aria-label={filter.label}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-400/60"
          >
            <option value="">{filter.allLabel || "Tất cả"}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {onSortChange && (
        <label className="block min-w-40 flex-1 sm:flex-none">
          <span className="mb-1.5 block text-[11px] font-medium text-neutral-400">
            Sắp xếp theo thời gian
          </span>
          <select
            value={sortValue}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sắp xếp theo thời gian"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2.5 text-xs text-neutral-200 outline-none focus:border-amber-400/60"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-700 px-3.5 py-2.5 text-xs font-medium text-neutral-300 transition-colors hover:border-amber-400/40 hover:bg-neutral-800 hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Đặt lại
        </button>
      )}
    </div>
  );
}
