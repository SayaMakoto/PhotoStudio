import { UserCheck, Users } from "lucide-react";

function TableMessage({ children, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-8 text-center text-xs text-neutral-500">
        {children}
      </td>
    </tr>
  );
}

export default function AccountStaffTable({
  accountStats,
  employeeStats,
  loading = false,
  error = "",
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-white">Tài khoản người dùng</h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <tr>
                <th scope="col" className="px-3 py-3 text-center">Tổng số</th>
                <th scope="col" className="px-3 py-3 text-center">Hoạt động</th>
                <th scope="col" className="px-3 py-3 text-center">Ngừng HĐ</th>
                <th scope="col" className="px-3 py-3 text-center">Đã khóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {loading ? (
                <TableMessage colSpan={4}>Đang tải dữ liệu tài khoản…</TableMessage>
              ) : error ? (
                <TableMessage colSpan={4}>{error}</TableMessage>
              ) : accountStats ? (
                <tr className="hover:bg-neutral-850/50">
                  <td className="px-3 py-4 text-center font-mono font-bold text-neutral-200">
                    {accountStats.total}
                  </td>
                  <td className="px-3 py-4 text-center font-mono font-bold text-emerald-400">
                    {accountStats.active}
                  </td>
                  <td className="px-3 py-4 text-center font-mono text-neutral-300">
                    {accountStats.inactive}
                  </td>
                  <td className="px-3 py-4 text-center font-mono text-rose-400">
                    {accountStats.locked}
                  </td>
                </tr>
              ) : (
                <TableMessage colSpan={4}>Chưa có dữ liệu tài khoản.</TableMessage>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <UserCheck className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-white">Nhân sự theo vị trí</h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              <tr>
                <th scope="col" className="px-3 py-3">Vị trí</th>
                <th scope="col" className="px-3 py-3 text-center">Tổng</th>
                <th scope="col" className="px-3 py-3 text-center">Đang làm</th>
                <th scope="col" className="px-3 py-3 text-center">Nghỉ phép</th>
                <th scope="col" className="px-3 py-3 text-center">Ngừng HĐ</th>
                <th scope="col" className="px-3 py-3 text-center">Đánh giá TB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {loading ? (
                <TableMessage colSpan={6}>Đang tải dữ liệu nhân viên…</TableMessage>
              ) : error ? (
                <TableMessage colSpan={6}>{error}</TableMessage>
              ) : employeeStats?.length ? (
                employeeStats.map((employee) => (
                  <tr key={employee.role} className="transition-colors hover:bg-neutral-850/50">
                    <td className="px-3 py-3.5 font-medium text-neutral-100">
                      {employee.role}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-neutral-200">
                      {employee.total}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono font-bold text-emerald-400">
                      {employee.active}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-amber-300">
                      {employee.onLeave}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-neutral-400">
                      {employee.inactive}
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-amber-400">
                      {employee.rating == null ? "—" : `${employee.rating.toFixed(1)} / 5`}
                    </td>
                  </tr>
                ))
              ) : (
                <TableMessage colSpan={6}>Chưa có hồ sơ nhân viên.</TableMessage>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
