import { DollarSign, Users, UserCheck, Layers } from "lucide-react";
import SpotlightCard from "../../cards/SpotlightCard";
import CountUp from "../../animations/CountUp";

export default function SummaryCards({
  totalRevenue = 285400000,
  activeUsers = 1248,
  activeEmployees = 36,
  activeResources = 420,
}) {
  const cards = [
    {
      title: "Tổng doanh thu",
      rawValue: totalRevenue,
      isCurrency: true,
      icon: DollarSign,
      trendType: "positive",
      color: "amber",
      spotlight: "rgba(245, 158, 11, 0.15)",
    },
    {
      title: "Tài khoản hoạt động",
      rawValue: activeUsers,
      isCurrency: false,
      icon: Users,
      trend: "+45 tuần này",
      trendType: "positive",
      subtext: "Khách hàng thành viên",
      color: "blue",
      spotlight: "rgba(59, 130, 246, 0.15)",
    },
    {
      title: "Nhân viên đang làm việc",
      rawValue: activeEmployees,
      isCurrency: false,
      icon: UserCheck,
      trend: "100% ca trực",
      trendType: "neutral",
      subtext: "Photo, Makeup, Retouch, Tiếp tân",
      color: "emerald",
      spotlight: "rgba(16, 185, 129, 0.15)",
    },
    {
      title: "Tài nguyên đang hoạt động",
      rawValue: activeResources,
      isCurrency: false,
      icon: Layers,
      trend: "91.3% khả dụng",
      trendType: "positive",
      subtext: "Thiết bị, phòng, bối cảnh, phục trang",
      color: "purple",
      spotlight: "rgba(168, 85, 247, 0.15)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <SpotlightCard
            key={idx}
            spotlightColor={card.spotlight}
            className="p-5 border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-400">
                {card.title}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-800/80 text-amber-400 border border-neutral-700/60 shadow-sm">
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-2xl font-bold tracking-tight text-white font-mono">
                {card.isCurrency ? (
                  <>
                    <CountUp
                      to={card.rawValue / 1000000}
                      duration={1.5}
                      separator="."
                    />
                    <span className="text-base text-amber-400 ml-1 font-sans font-semibold">
                      Triệu đồng
                    </span>
                  </>
                ) : (
                  <CountUp to={card.rawValue} duration={1.5} separator="," />
                )}
              </div>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
