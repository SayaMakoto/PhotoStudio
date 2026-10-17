import { UserGroupIcon, TrophyIcon, CameraIcon, HeartIcon } from '@heroicons/react/24/solid';
import CountUp from '../../animations/CountUp';
import ScrollReveal from '../../animations/ScrollReveal';

export default function Stats() {
  const stats = [
    {
      icon: UserGroupIcon,
      value: 2500,
      suffix: '+',
      label: 'Khách Hàng Hài Lòng',
      description: 'Được phục vụ với nụ cười và cảm xúc trọn vẹn',
    },
    {
      icon: CameraIcon,
      value: 350,
      suffix: '+',
      label: 'Concept Chụp Độc Quyền',
      description: 'Từ Nàng Thơ, Cổ Điển đến High-End Fashion',
    },
    {
      icon: TrophyIcon,
      value: 5,
      suffix: '+',
      label: 'Năm Hoạt Động Nghệ Thuật',
      description: 'Kinh nghiệm chụp cưới và thương mại uy tín',
    },
    {
      icon: HeartIcon,
      value: 99,
      suffix: '%',
      label: 'Đánh Giá 5 Sao',
      description: 'Cam kết chất lượng hình ảnh và trải nghiệm dịch vụ',
    },
  ];

  return (
    <section className="relative py-16 bg-neutral-950 border-y border-white/10 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-neutral-900/40 to-amber-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal
                key={idx}
                direction="up"
                delay={idx * 0.1}
                duration={0.7}
              >
                <div className="group relative p-6 rounded-3xl bg-neutral-900/70 border border-white/10 hover:border-amber-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-13 h-13 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-neutral-950 transition-all duration-300 shadow-md">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                      <CountUp
                        from={0}
                        to={stat.value}
                        duration={2.2}
                        delay={idx * 0.12}
                        separator=","
                        suffix={stat.suffix}
                      />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-neutral-100 mb-1 group-hover:text-amber-300 transition-colors">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
