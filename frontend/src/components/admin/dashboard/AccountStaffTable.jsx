import { Users, UserCheck } from "lucide-react";

export default function AccountStaffTable() {
  const accountStats = [
    {
      total: 1248,
      active: 1180,
      locked: 12,
    },
  ];

  const employeeStats = [
    {
      role: "Nhiếp ảnh gia",
      total: 14,
      onDuty: 14,
      inSession: 8,
      offDuty: 0,
      rating: "4.9/5.0",
    },
    {
      role: "Chuyên viên Trang điểm",
      total: 10,
      onDuty: 9,
      inSession: 6,
      offDuty: 1,
      rating: "4.85/5.0",
    },
    {
      role: "Kỹ thuật viên Hậu kỳ",
      total: 7,
      onDuty: 7,
      inSession: 7,
      offDuty: 0,
      rating: "4.95/5.0",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Tài Khoản Người Dùng Đang Hoạt Động
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 uppercase text-[11px] font-semibold text-neutral-400 tracking-wider border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-center">
                  Tổng số
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Đang hoạt động
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Bị khóa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {accountStats.map((acc, idx) => (
                <tr key={idx} className="hover:bg-neutral-850/50">
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-neutral-200">
                    {acc.total}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-emerald-400 font-bold">
                    {acc.active}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-rose-400">
                    {acc.locked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              Nhân Sự & Đội Ngũ Đang Hoạt Động
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-800/80">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-950/80 uppercase text-[11px] font-semibold text-neutral-400 tracking-wider border-b border-neutral-800">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Vị trí nhân sự
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Tổng nhân sự
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Đang ca trực
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Đang làm việc
                </th>
                <th scope="col" className="px-4 py-3 text-center">
                  Đánh giá TB
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {employeeStats.map((emp, idx) => (
                <tr key={idx} className="hover:bg-neutral-850/50">
                  <td className="px-4 py-3.5 font-semibold text-white">
                    {emp.role}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono font-bold text-neutral-200">
                    {emp.total}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-emerald-400 font-bold">
                    {emp.onDuty}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-amber-300 font-medium">
                    {emp.inSession}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-amber-400 font-semibold">
                    ⭐ {emp.rating}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
