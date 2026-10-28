/**
 * Cành hoa đào / hoa mộc lan nghệ thuật trang trí các góc (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
 */
export function FloralBranchCorner({ position = 'top-left', className = '', opacity = 'opacity-85' }) {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scale-x-[-1]';
      case 'bottom-left':
        return 'scale-y-[-1]';
      case 'bottom-right':
        return 'scale-x-[-1] scale-y-[-1]';
      default:
        return '';
    }
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      default:
        return 'top-0 left-0';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClass()} pointer-events-none select-none z-0 ${opacity} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 320 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-48 sm:w-64 md:w-80 h-auto ${getTransform()}`}
      >
        <defs>
          <linearGradient id="branchPetal1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2F4" />
            <stop offset="60%" stopColor="#F8BAC6" />
            <stop offset="100%" stopColor="#E37A90" />
          </linearGradient>
          <linearGradient id="branchPetal2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF8F9" />
            <stop offset="50%" stopColor="#F9CCD5" />
            <stop offset="100%" stopColor="#EA8DA0" />
          </linearGradient>
          <linearGradient id="branchLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D5B0B8" />
            <stop offset="100%" stopColor="#8A606A" />
          </linearGradient>
          <filter id="branchSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Cành cây */}
        <path
          d="M-20 -15 C 40 25, 80 85, 110 160 C 130 205, 175 235, 230 250"
          stroke="#5C4247"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M60 55 C 95 40, 145 55, 175 80"
          stroke="#68484E"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M110 160 C 140 145, 185 155, 210 175"
          stroke="#68484E"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M30 20 C 50 5, 85 10, 105 25"
          stroke="#7A565C"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Lá non */}
        <path
          d="M80 50 C 95 35, 120 40, 115 55 C 110 70, 85 65, 80 50 Z"
          fill="url(#branchLeaf)"
          opacity="0.75"
        />
        <path
          d="M135 145 C 150 130, 170 135, 165 150 C 160 165, 140 160, 135 145 Z"
          fill="url(#branchLeaf)"
          opacity="0.7"
        />
        <path
          d="M190 225 C 205 215, 225 220, 220 235 C 215 245, 195 240, 190 225 Z"
          fill="url(#branchLeaf)"
          opacity="0.7"
        />

        {/* Bông hoa lớn 1 */}
        <g transform="translate(108, 155)" filter="url(#branchSoftGlow)">
          <ellipse cx="0" cy="-22" rx="14" ry="20" fill="url(#branchPetal1)" opacity="0.95" />
          <ellipse cx="20" cy="-8" rx="19" ry="14" fill="url(#branchPetal2)" opacity="0.92" />
          <ellipse cx="14" cy="18" rx="15" ry="19" fill="url(#branchPetal1)" opacity="0.94" />
          <ellipse cx="-16" cy="16" rx="18" ry="14" fill="url(#branchPetal2)" opacity="0.93" />
          <ellipse cx="-20" cy="-10" rx="14" ry="18" fill="url(#branchPetal1)" opacity="0.92" />
          <circle cx="0" cy="0" r="6" fill="#F4A261" opacity="0.95" />
          <circle cx="-2" cy="-3" r="1.5" fill="#FFE3A8" />
          <circle cx="3" cy="-2" r="1.5" fill="#FFE3A8" />
          <circle cx="2" cy="3" r="1.5" fill="#FFE3A8" />
          <circle cx="-3" cy="2" r="1.5" fill="#FFE3A8" />
        </g>

        {/* Bông hoa vừa 2 */}
        <g transform="translate(175, 80)">
          <ellipse cx="0" cy="-16" rx="11" ry="15" fill="url(#branchPetal1)" opacity="0.93" />
          <ellipse cx="15" cy="-5" rx="14" ry="11" fill="url(#branchPetal2)" opacity="0.9" />
          <ellipse cx="10" cy="13" rx="11" ry="14" fill="url(#branchPetal1)" opacity="0.92" />
          <ellipse cx="-12" cy="11" rx="14" ry="11" fill="url(#branchPetal2)" opacity="0.9" />
          <ellipse cx="-14" cy="-7" rx="11" ry="14" fill="url(#branchPetal1)" opacity="0.9" />
          <circle cx="0" cy="0" r="4.5" fill="#F4A261" />
          <circle cx="1" cy="-1" r="1.2" fill="#FFE3A8" />
        </g>

        {/* Bông hoa nở rộ 3 */}
        <g transform="translate(230, 245)">
          <ellipse cx="0" cy="-15" rx="10" ry="14" fill="url(#branchPetal2)" opacity="0.9" />
          <ellipse cx="14" cy="-5" rx="13" ry="10" fill="url(#branchPetal1)" opacity="0.88" />
          <ellipse cx="9" cy="12" rx="10" ry="13" fill="url(#branchPetal2)" opacity="0.9" />
          <ellipse cx="-11" cy="10" rx="13" ry="10" fill="url(#branchPetal1)" opacity="0.88" />
          <ellipse cx="-13" cy="-7" rx="10" ry="13" fill="url(#branchPetal2)" opacity="0.88" />
          <circle cx="0" cy="0" r="4" fill="#F4A261" />
        </g>

        {/* Nụ hoa chớm nở */}
        <g transform="translate(50, 20)">
          <ellipse cx="0" cy="0" rx="8" ry="12" fill="url(#branchPetal1)" transform="rotate(-30 0 0)" opacity="0.9" />
          <ellipse cx="5" cy="2" rx="6" ry="10" fill="url(#branchPetal2)" transform="rotate(15 5 2)" opacity="0.85" />
          <path d="M-4 8 C -2 14, 2 15, 4 12" stroke="#68484E" strokeWidth="1.5" fill="none" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Cánh hoa đào đơn lẻ chân thực (SVG chuẩn đường cong cánh hoa đào với rãnh tim mềm mại)
 */
export function SinglePetal({
  size = 24,
  rotate = 0,
  opacity = 0.88,
  style = {},
  className = '',
}) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: (size * 1.25),
        transform: `rotate(${rotate}deg)`,
        opacity,
        filter: 'drop-shadow(0 2.5px 6px rgba(184,80,100,0.22))',
        ...style,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 32 40" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="singlePetalGrad" x1="20%" y1="100%" x2="80%" y2="0%">
            <stop offset="0%" stopColor="#FFF2F5" />
            <stop offset="35%" stopColor="#FBAFBF" />
            <stop offset="75%" stopColor="#EE6583" />
            <stop offset="100%" stopColor="#D44363" />
          </linearGradient>
          <linearGradient id="singlePetalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E27A90" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Thân cánh hoa cong mềm mại với rãnh chẻ tim nhẹ ở đầu cánh */}
        <path
          d="M16 38 C 11 32, 2 24, 2 14 C 2 6, 8 2, 14 3 C 15.5 3.5, 16 5, 16 5 C 16 5, 16.5 3.5, 18 3 C 24 2, 30 6, 30 14 C 30 24, 21 32, 16 38 Z"
          fill="url(#singlePetalGrad)"
        />

        {/* Lớp viền phản chiếu ánh sáng tự nhiên */}
        <path
          d="M14 6 C 8 7, 5 12, 5 16 C 5 22, 11 28, 14 32"
          stroke="url(#singlePetalGlow)"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gân cánh hoa mờ tinh tế */}
        <path
          d="M16 10 Q 16 22, 16 34"
          stroke="#C8526B"
          strokeWidth="0.8"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Cụm 2 cánh hoa đào bay quấn quýt
 */
export function PetalPair({
  size = 32,
  rotate = 25,
  opacity = 0.88,
  style = {},
  className = '',
}) {
  return (
    <div
      className={`pointer-events-none select-none relative ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <SinglePetal
        size={size * 0.78}
        rotate={-18}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <SinglePetal
        size={size * 0.62}
        rotate={42}
        style={{ position: 'absolute', bottom: 0, right: 1 }}
      />
    </div>
  );
}

/**
 * Cụm 3 cánh hoa đào bay lượn nhẹ nhàng trong gió
 */
export function PetalCluster({
  size = 38,
  rotate = 15,
  opacity = 0.88,
  style = {},
  className = '',
}) {
  return (
    <div
      className={`pointer-events-none select-none relative ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <SinglePetal
        size={size * 0.7}
        rotate={-20}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <SinglePetal
        size={size * 0.55}
        rotate={35}
        style={{ position: 'absolute', top: 3, right: 0 }}
      />
      <SinglePetal
        size={size * 0.45}
        rotate={80}
        style={{ position: 'absolute', bottom: 0, left: '32%' }}
      />
    </div>
  );
}

/**
 * RẢI CÁNH HOA ĐÀO NGHỆ THUẬT (THƯA THỚT, THANH THOÁT, KHÔNG DÀY ĐẶC)
 * Trải đều từ đỉnh trang xuống chân trang, phân bố tự nhiên hai bên lề
 */
export function ScatteredPetals({ className = '', density = 'normal' }) {
  // Bộ 30 cánh hoa rải thưa thớt, tự nhiên, trải đều suốt chiều cao trang từ trên xuống dưới
  const PETAL_DATA = [
    // 0% - 14% (Khu vực Hero & Đỉnh trang)
    { top: '2%', left: '4%', size: 28, rotate: -25, type: 'single' },
    { top: '5.5%', left: '91%', size: 32, rotate: 35, type: 'pair' },
    { top: '9%', left: '14%', size: 22, rotate: 15, type: 'single' },
    { top: '12.5%', left: '84%', size: 26, rotate: -40, type: 'single' },

    // 14% - 28% (Khu vực Thống kê & Giới thiệu)
    { top: '16%', left: '5%', size: 24, rotate: 45, type: 'single' },
    { top: '19.5%', left: '93%', size: 32, rotate: -20, type: 'pair' },
    { top: '23%', left: '11%', size: 22, rotate: 60, type: 'single' },
    { top: '26.5%', left: '87%', size: 26, rotate: 15, type: 'single' },

    // 28% - 42% (Khu vực Bảng giá & Gói chụp)
    { top: '30%', left: '4%', size: 30, rotate: -30, type: 'pair' },
    { top: '33.5%', left: '92%', size: 24, rotate: 40, type: 'single' },
    { top: '37%', left: '10%', size: 22, rotate: 75, type: 'single' },
    { top: '40.5%', left: '86%', size: 32, rotate: -15, type: 'pair' },

    // 42% - 56% (Khu vực Bộ sưu tập & Ảnh thực tế)
    { top: '44%', left: '5%', size: 26, rotate: 20, type: 'single' },
    { top: '47.5%', left: '94%', size: 24, rotate: -45, type: 'single' },
    { top: '51%', left: '13%', size: 30, rotate: 35, type: 'pair' },
    { top: '54.5%', left: '89%', size: 22, rotate: 10, type: 'single' },

    // 56% - 70% (Khu vực So sánh Trước/Sau & Studio)
    { top: '58%', left: '3%', size: 26, rotate: -20, type: 'single' },
    { top: '61.5%', left: '92%', size: 32, rotate: 40, type: 'pair' },
    { top: '65%', left: '8%', size: 22, rotate: 55, type: 'single' },
    { top: '68.5%', left: '87%', size: 26, rotate: -35, type: 'single' },

    // 70% - 84% (Khu vực Đánh giá khách hàng)
    { top: '72%', left: '11%', size: 30, rotate: 25, type: 'pair' },
    { top: '75.5%', left: '94%', size: 24, rotate: -15, type: 'single' },
    { top: '79%', left: '5%', size: 26, rotate: 65, type: 'single' },
    { top: '82.5%', left: '88%', size: 32, rotate: -30, type: 'pair' },

    // 84% - 99% (Khu vực Đặt lịch hẹn & Chân trang)
    { top: '86%', left: '9%', size: 24, rotate: 45, type: 'single' },
    { top: '89.5%', left: '93%', size: 28, rotate: -20, type: 'single' },
    { top: '93%', left: '4%', size: 30, rotate: 35, type: 'pair' },
    { top: '96%', left: '87%', size: 24, rotate: -40, type: 'single' },
    { top: '98.5%', left: '12%', size: 26, rotate: 20, type: 'single' },
  ];

  const items = density === 'sparse'
    ? PETAL_DATA.filter((_, i) => i % 2 === 0)
    : PETAL_DATA;

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-20 ${className}`}
      aria-hidden="true"
    >
      {items.map((p, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
          }}
        >
          {p.type === 'cluster' ? (
            <PetalCluster size={p.size} rotate={p.rotate} opacity={0.9} />
          ) : p.type === 'pair' ? (
            <PetalPair size={p.size} rotate={p.rotate} opacity={0.88} />
          ) : (
            <SinglePetal size={p.size} rotate={p.rotate} opacity={0.85} />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Cụm cánh hoa đào bay phất phơ (Tương thích ngược)
 */
export function FloatingPetals({ className = '', opacity = 'opacity-80' }) {
  return <ScatteredPetals className={`${className} ${opacity}`} />;
}

/**
 * Họa tiết hoa nghệ thuật đặt góc bên trong các khung (Khung đặt lịch, Khung tư vấn, Thẻ VIP)
 */
export function FloralCardCorner({ position = 'top-right', className = '', opacity = 'opacity-75' }) {
  const isRight = position.includes('right');
  const isBottom = position.includes('bottom');

  return (
    <div
      className={`absolute ${position === 'top-right' ? 'top-0 right-0' : position === 'bottom-left' ? 'bottom-0 left-0' : position === 'bottom-right' ? 'bottom-0 right-0' : 'top-0 left-0'} pointer-events-none select-none z-0 ${opacity} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-28 sm:w-36 h-auto ${isRight ? 'scale-x-[-1]' : ''} ${isBottom ? 'scale-y-[-1]' : ''}`}
      >
        <defs>
          <linearGradient id="cardPetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5F7" />
            <stop offset="50%" stopColor="#F8C1CC" />
            <stop offset="100%" stopColor="#E68297" />
          </linearGradient>
        </defs>

        {/* Nhành cuống hoa mini */}
        <path
          d="M-10 -10 C 20 15, 45 45, 65 90"
          stroke="#7A565C"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M30 30 C 50 25, 80 40, 95 55"
          stroke="#7A565C"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Bông hoa nở ở góc */}
        <g transform="translate(65, 88)">
          <ellipse cx="0" cy="-14" rx="10" ry="14" fill="url(#cardPetal)" opacity="0.92" />
          <ellipse cx="14" cy="-4" rx="13" ry="10" fill="url(#cardPetal)" opacity="0.9" />
          <ellipse cx="9" cy="12" rx="10" ry="13" fill="url(#cardPetal)" opacity="0.92" />
          <ellipse cx="-11" cy="10" rx="13" ry="10" fill="url(#cardPetal)" opacity="0.9" />
          <ellipse cx="-13" cy="-6" rx="10" ry="13" fill="url(#cardPetal)" opacity="0.9" />
          <circle cx="0" cy="0" r="4.5" fill="#F4A261" />
          <circle cx="-1" cy="-1" r="1.2" fill="#FFF2D6" />
        </g>

        {/* Nụ hoa nhỏ */}
        <g transform="translate(95, 55)">
          <ellipse cx="0" cy="0" rx="6" ry="9" fill="url(#cardPetal)" transform="rotate(-20 0 0)" opacity="0.88" />
        </g>

        {/* Cánh hoa rơi lả tả */}
        <ellipse cx="40" cy="80" rx="7" ry="4" fill="url(#cardPetal)" transform="rotate(30 40 80)" opacity="0.75" />
        <ellipse cx="110" cy="110" rx="8" ry="5" fill="url(#cardPetal)" transform="rotate(-25 110 110)" opacity="0.7" />
        <ellipse cx="85" cy="135" rx="6" ry="4" fill="url(#cardPetal)" transform="rotate(40 85 135)" opacity="0.65" />
      </svg>
    </div>
  );
}

export default {
  FloralBranchCorner,
  SinglePetal,
  PetalPair,
  PetalCluster,
  ScatteredPetals,
  FloatingPetals,
  FloralCardCorner,
};
