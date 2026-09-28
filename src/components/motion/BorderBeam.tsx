import { motion } from 'framer-motion';

interface BorderBeamProps {
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export const BorderBeam = ({
  duration = 8,
  borderWidth = 1.5,
  colorFrom = '#ff1e38',
  colorTo = 'rgba(255, 30, 56, 0.2)',
  className = '',
}: BorderBeamProps) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="60%" stopColor={colorTo} stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={`calc(100% - ${borderWidth}px)`}
          height={`calc(100% - ${borderWidth}px)`}
          rx="16"
          ry="16"
          fill="none"
          stroke="url(#beam-gradient)"
          strokeWidth={borderWidth}
          strokeDasharray="180 400"
          animate={{
            strokeDashoffset: [0, -580],
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
