import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface ScrollSceneProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enveloppe une section : elle monte et passe de 0.92 à 1 d'échelle pendant
 * son entrée, et une ligne rouge se dessine sur son bord haut.
 * Aucun transform résiduel une fois la section en place (scale 1, y 0).
 */
export const ScrollScene = ({ children, className = '' }: ScrollSceneProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const line = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={reduce ? undefined : { scale, y, transformOrigin: '50% 0%' }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-px bg-[var(--amber)]"
        style={{ scaleX: reduce ? 1 : line, transformOrigin: '0% 50%' }}
      />
      {children}
    </motion.div>
  );
};