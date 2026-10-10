import { motion } from 'motion/react';

export default function ScrollReveal({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none'
  distance = 24,
  duration = 0.5,
  delay = 0,
  className = '',
  scale = 1,
  amount = 0.1,
}) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'zoom':
        return { x: 0, y: 0, scale: 0.96 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  const variants = {
    hidden: {
      opacity: 0,
      scale: direction === 'zoom' ? 0.96 : scale,
      ...initialPos,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Crisp and snappy cubic-bezier
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }} // 2-way trigger, hiện rõ nét sắc sảo
      className={className}
    >
      {children}
    </motion.div>
  );
}
