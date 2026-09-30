import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /**
   * Amplitude du déplacement vertical (px) sur toute la traversée du viewport.
   * Positif = l'élément monte plus lentement que le scroll (effet de recul).
   */
  offset?: number;
}

/**
 * Applique une parallaxe verticale douce à son contenu, pilotée par la
 * progression du scroll pendant que l'élément traverse le viewport.
 * Respecte prefers-reduced-motion (aucun déplacement si activé).
 */
export const Parallax = ({ children, className = '', offset = 60 }: ParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // De +offset/2 (élément en bas du viewport) à -offset/2 (en haut).
  const y = useTransform(scrollYProgress, [0, 1], [offset / 2, -offset / 2]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
};
