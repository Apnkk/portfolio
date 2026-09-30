import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Décalage vertical initial (px). Négatif = vient d'en bas. */
  y?: number;
  /** Délai avant démarrage (s) — utile pour une cascade. */
  delay?: number;
  /** Durée de l'animation (s). */
  duration?: number;
  /** Flou initial (px) qui se lève à l'entrée. 0 pour désactiver. */
  blur?: number;
  /** Balise HTML rendue (div par défaut). */
  as?: 'div' | 'section' | 'li' | 'span';
  /** Marge de déclenchement : négatif = déclenche un peu avant l'entrée. */
  amount?: number;
}

/**
 * Révèle son contenu quand il entre dans le viewport : fondu + glissement
 * vertical + léger flou qui se lève. L'animation ne joue qu'une fois
 * (viewport.once) et respecte prefers-reduced-motion.
 */
export const ScrollReveal = ({
  children,
  className = '',
  y = 32,
  delay = 0,
  duration = 0.8,
  blur = 6,
  as = 'div',
  amount = 0.2,
}: ScrollRevealProps) => {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    // Pas d'animation : on rend le contenu tel quel, pleinement visible.
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: blur > 0 ? `blur(${blur}px)` : 'blur(0px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
};
