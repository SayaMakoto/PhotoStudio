import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, X } from "lucide-react";
import StatusBadge from "./StatusBadge";

const PAGE_SIZE = 10;

function readValue(row, key) {
  if (typeof key === "function") return key(row);
  if (typeof key !== "string" || !key) return undefined;
  return key.split(".").reduce((value, part) => value?.[part], row);
}

function getRowId(row, rowKey, index) {
  if (typeof rowKey === "function") return rowKey(row, index);
  return readValue(row, rowKey) ?? index;
}

function getPageNumbers(currentPage, totalPages) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function AdminTable({
  columns = [],
  data = [],
  rowKey = "id",
  actions = {},
  onDetail,
  onEdit,
  onDelete,
  handleDetail,
  handleEdit,
  handleDelete,
  onStatusChange,
  emptyMessage = "Không có dữ liệu để hiển thị.",
  className = "",
}) {
  const [page, setPage] = useState(1);
  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const detailHandler = onDetail ?? handleDetail;
  const editHandler = onEdit ?? handleEdit;
  const deleteHandler = onDelete ?? handleDelete;

  const actionItems = [
    {
      key: "detail",
      label: "Xem chi tiết",
      icon: Eye,
      handler: detailHandler,
      colorClass: "text-sky-300 hover:bg-sky-500/10 hover:text-sky-200",
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: Pencil,
      handler: editHandler,
      colorClass: "text-amber-300 hover:bg-amber-500/10 hover:text-amber-200",
    },
    {
      key: "delete",
      label: "Xóa",
      icon: X,
      handler: deleteHandler,
      colorClass: "text-rose-300 hover:bg-rose-500/10 hover:text-rose-200",
    },
  ].filter(({ key, handler }) => Boolean(handler) && actions[key] !== false);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const firstRowIndex = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = useMemo(
    () => rows.slice(firstRowIndex, firstRowIndex + PAGE_SIZE),
    [rows, firstRowIndex],
  );
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const firstItem = rows.length === 0 ? 0 : firstRowIndex + 1;
  const lastItem = Math.min(firstRowIndex + PAGE_SIZE, rows.length);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left text-xs text-neutral-300">
          <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <tr>
              {columns.map((column) => (
                <th
                  key={
                    column.key ??
                    column.accessorKey ??
                    column.label ??
                    column.title
                  }
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3.5 ${column.headerClassName ?? ""}`}
                >
                  {column.label ?? column.title ?? column.header}
                </th>
              ))}
              {actionItems.length > 0 && (
                <th
                  scope="col"
                  className="whitespace-nowrap px-4 py-3.5 text-center"
                >
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {visibleRows.map((row, visibleIndex) => {
              const rowId = getRowId(row, rowKey, firstRowIndex + visibleIndex);

              return (
                <tr
                  key={rowId}
                  className="transition-colors hover:bg-neutral-850/50"
                >
                  {columns.map((column) => {
                    const value = readValue(
                      row,
                      column.key ?? column.accessorKey,
                    );
                    const cellClassName = `px-4 py-3.5 ${column.cellClassName ?? ""}`;
                    const normalizedStatus = String(value ?? "").toLowerCase();
                    const togglePair = column.togglePair ?? {
                      active: "inactive",
                      inactive: "active",
                    };
                    const canToggleStatus =
                      column.toggleable &&
                      onStatusChange &&
                      Object.hasOwn(togglePair, normalizedStatus);

                    return (
                      <td
                        key={
                          column.key ??
                          column.accessorKey ??
                          column.label ??
                          column.title
                        }
                        className={cellClassName}
                      >
                        {column.render ? (
                          column.render(value, row)
                        ) : column.type === "status" ? (
                          <StatusBadge
                            status={value}
                            domain={column.statusDomain}
                            onClick={
                              canToggleStatus
                                ? () =>
                                    onStatusChange(
                                      row,
                                      togglePair[normalizedStatus],
                                      column,
                                    )
                                : undefined
                            }
                          />
                        ) : (
                          (value ?? "—")
                        )}
                      </td>
                    );
                  })}

                  {actionItems.length > 0 && (
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1">
                        {actionItems.map(
                          ({ key, label, icon: Icon, handler, colorClass }) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handler(row)}
                              aria-label={`${label}: ${row.name ?? row.title ?? rowId}`}
                              title={label}
                              className={`rounded-lg p-2 transition-colors ${colorClass}`}
                            >
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          ),
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={Math.max(
                    1,
                    columns.length + (actionItems.length > 0 ? 1 : 0),
                  )}
                  className="px-4 py-12 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>
            Hiển thị{" "}
            <span className="font-medium text-neutral-200">
              {firstItem}–{lastItem}
            </span>{" "}
            trong {rows.length}
          </span>
        </div>

        <nav className="flex items-center gap-1" aria-label="Phân trang bảng">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="Trang trước"
            className="rounded-lg border border-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                currentPage === pageNumber
                  ? "border-amber-400/40 bg-amber-500/15 font-semibold text-amber-300"
                  : "border-transparent text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="Trang sau"
            className="rounded-lg border border-neutral-800 p-2 text-neutral-300 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  );
}
