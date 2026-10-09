import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import type { ReactNode } from 'react';

interface VelocitySkewProps {
  children: ReactNode;
  className?: string;
}

/** Incline le contenu selon la vitesse de scroll (max ±8°), retombe à 0 à l'arrêt. */
export const VelocitySkew = ({ children, className = '' }: VelocitySkewProps) => {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 200, damping: 40 });
  const skewX = useTransform(smooth, [-3000, 3000], [-8, 8], { clamp: true });

  return (
    <motion.div className={className} style={reduce ? undefined : { skewX }}>
      {children}
    </motion.div>
  );
};