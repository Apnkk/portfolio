import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  spotlight?: boolean;
  spotlightColor?: string;
  onClick?: () => void;
}

export const TiltCard = ({
  children,
  className = '',
  scale = 1.012,
  spotlight = true,
  spotlightColor = 'rgba(255, 30, 56, 0.12)',
  onClick,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = rectRef.current || cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    cardRef.current.style.setProperty('--mouse-x', `${px}px`);
    cardRef.current.style.setProperty('--mouse-y', `${py}px`);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ y: -4, scale }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`relative ${className}`}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      {/* Dynamic Cursor Spotlight Sheen (Behind text to prevent any text washout) */}
      {spotlight && (
        <div
          className={`pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-0 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(460px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 65%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Surface Content - completely flat 2D rendering for razor-sharp typography */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};
