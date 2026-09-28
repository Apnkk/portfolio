import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

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
  maxTilt = 6,
  scale = 1.012,
  spotlight = true,
  spotlightColor = 'rgba(255, 30, 56, 0.12)',
  onClick,
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates: -0.5 to +0.5
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Exact pixel coordinates for spotlight
  const pixelX = useMotionValue(0);
  const pixelY = useMotionValue(0);

  // Smooth spring physics for 3D rotation
  const smoothX = useSpring(rawX, { stiffness: 280, damping: 26 });
  const smoothY = useSpring(rawY, { stiffness: 280, damping: 26 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    pixelX.set(px);
    pixelY.set(py);

    rawX.set(px / rect.width - 0.5);
    rawY.set(py / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative will-change-transform ${className}`}
    >
      {/* Dynamic Cursor Spotlight Sheen */}
      {spotlight && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute -inset-px rounded-[inherit] z-30 transition-opacity"
          style={{
            background: `radial-gradient(420px circle at ${pixelX.get()}px ${pixelY.get()}px, ${spotlightColor}, transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Surface Depth Lighting */}
      <div style={{ transform: 'translateZ(15px)' }} className="h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};
