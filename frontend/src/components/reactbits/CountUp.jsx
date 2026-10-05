import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  suffix = '',
  prefix = '',
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });
  const [displayValue, setDisplayValue] = useState(from);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof delay === 'number' && delay > 0) {
        const timer = setTimeout(() => {
          motionValue.set(direction === 'down' ? from : to);
        }, delay * 1000);
        return () => clearTimeout(timer);
      } else {
        motionValue.set(direction === 'down' ? from : to);
      }
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springValue]);

  const formattedNumber = separator
    ? displayValue.toLocaleString('en-US').replace(/,/g, separator)
    : displayValue.toString();

  return (
    <span className={`inline-block tabular-nums ${className}`} ref={ref}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
