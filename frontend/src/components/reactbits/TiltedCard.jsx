import { useRef } from 'react';
import { motion, useSpring } from 'motion/react';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '360px',
  containerWidth = '100%',
  imageHeight = '100%',
  imageWidth = '100%',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showTooltip = true,
  overlayContent = null,
  className = '',
}) {
  const ref = useRef(null);

  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`relative [perspective:800px] flex flex-col items-center justify-center cursor-pointer select-none ${className}`}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl [transform-style:preserve-3d] will-change-transform bg-neutral-900"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {overlayContent && (
          <div className="absolute inset-0 p-5 flex flex-col justify-end z-10 pointer-events-none">
            {overlayContent}
          </div>
        )}
      </motion.div>

      {showTooltip && captionText && (
        <figcaption className="mt-2 text-xs font-medium text-neutral-400 tracking-wide">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
