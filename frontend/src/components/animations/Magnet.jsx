import { useState, useEffect, useRef } from 'react';

export default function Magnet({
  children,
  padding = 50,
  disabled = false,
  magnetStrength = 2,
  className = '',
  ...props
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef(null);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        setPosition((prev) => (prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [padding, disabled, magnetStrength]);

  const activePosition = disabled ? { x: 0, y: 0 } : position;
  const isMoved = activePosition.x !== 0 || activePosition.y !== 0;
  const transitionStyle = isMoved ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out';

  return (
    <div
      ref={magnetRef}
      className={`inline-block ${className}`}
      style={{
        position: 'relative',
        transform: `translate3d(${activePosition.x}px, ${activePosition.y}px, 0)`,
        transition: transitionStyle,
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
