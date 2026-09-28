import { useId } from 'react';
import { motion } from 'framer-motion';

interface BorderBeamProps {
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export const BorderBeam = ({
  duration = 9,
  borderWidth = 1.5,
  colorFrom = '#ff1e38',
  colorTo = 'rgba(255, 30, 56, 0.25)',
  className = '',
}: BorderBeamProps) => {
  const id = useId();
  const safeId = id.replace(/:/g, '-');

  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-20 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id={`beam-${safeId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.rect
          x="1"
          y="1"
          style={{
            width: 'calc(100% - 2px)',
            height: 'calc(100% - 2px)',
          }}
          rx="15"
          ry="15"
          fill="none"
          stroke={`url(#beam-${safeId})`}
          strokeWidth={borderWidth}
          strokeDasharray="160 520"
          animate={{
            strokeDashoffset: [0, -680],
          }}
          transition={{
            repeat: Infinity,
            duration,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
};
