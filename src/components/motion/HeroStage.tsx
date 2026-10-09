import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface HeroStageProps {
  children: ReactNode;
}

const BEAMS = [12, 31, 50, 69, 88];

const GRID_IMAGE =
  'linear-gradient(rgba(255,30,56,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,30,56,0.55) 1px, transparent 1px)';
const GRID_MASK = 'linear-gradient(to top, #000 0%, transparent 85%)';

/**
 * Scène d'ouverture : grille rouge en perspective qui défile avec le scroll,
 * faisceaux verticaux qui se rétractent, et hero qui recule (scale + fade)
 * quand on descend. Désactivé si prefers-reduced-motion.
 */
export const HeroStage = ({ children }: HeroStageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  const scale = useTransform(p, [0, 1], [1, 0.88]);
  const opacity = useTransform(p, [0, 0.8, 1], [1, 0.35, 0]);
  const y = useTransform(p, [0, 1], [0, 120]);
  const overlayOpacity = useTransform(p, [0, 0.7], [1, 0]);
  const beamScale = useTransform(p, [0, 0.6], [1, 0]);
  const gridShift = useTransform(p, [0, 1], [0, 900]);
  const gridPos = useTransform(gridShift, (v) => `0px ${v}px`);

  return (
    <div ref={ref} className="relative isolate">
      <motion.div
        style={reduce ? undefined : { scale, opacity, y, transformOrigin: '50% 100%' }}
      >
        {children}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden mix-blend-screen"
          style={reduce ? undefined : { opacity: overlayOpacity }}
        >
          {BEAMS.map((left) => (
            <motion.div
              key={left}
              className="absolute top-0 h-full w-px bg-gradient-to-b from-transparent via-[rgba(255,30,56,0.5)] to-transparent"
              style={{
                left: `${left}%`,
                transformOrigin: '50% 0%',
                scaleY: reduce ? 1 : beamScale,
              }}
            />
          ))}

          <div className="absolute inset-x-0 bottom-0 h-[70%] overflow-hidden">
            <motion.div
              className="absolute -inset-x-1/2 bottom-0 h-[160%]"
              style={{
                transform: 'perspective(520px) rotateX(62deg)',
                transformOrigin: '50% 100%',
                backgroundImage: GRID_IMAGE,
                backgroundSize: '64px 64px',
                backgroundPosition: reduce ? '0px 0px' : gridPos,
                maskImage: GRID_MASK,
                WebkitMaskImage: GRID_MASK,
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};