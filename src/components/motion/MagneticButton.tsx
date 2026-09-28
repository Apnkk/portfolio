import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  pullFactor?: number;
}

export const MagneticButton = ({
  children,
  className = '',
  pullFactor = 0.22,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Tuned damped spring physics for tactile magnetic cursor attraction
  const springX = useSpring(x, { stiffness: 320, damping: 22 });
  const springY = useSpring(y, { stiffness: 320, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = (e.clientX - centerX) * pullFactor;
    const distanceY = (e.clientY - centerY) * pullFactor;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: shouldReduceMotion ? 0 : springX, y: shouldReduceMotion ? 0 : springY }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', visualDuration: 0.2, bounce: 0.15 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};
