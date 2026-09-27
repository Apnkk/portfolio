import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isInWindow, setIsInWindow] = useState(false);
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine) and (min-width: 768px)').matches;
  });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 768px)');
    const updateEnabled = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsEnabled(e.matches);
      if (!e.matches) {
        document.documentElement.classList.remove('custom-cursor-active');
      }
    };

    mq.addEventListener('change', updateEnabled);
    return () => mq.removeEventListener('change', updateEnabled);
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      document.documentElement.classList.remove('custom-cursor-active');
      return;
    }

    // Hide default system cursor only when custom cursor is active
    document.documentElement.classList.add('custom-cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      setIsInWindow(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsInWindow(false);
    const onMouseEnter = () => setIsInWindow(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('.interactive'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isEnabled, mouseX, mouseY]);

  if (!isEnabled || !isInWindow) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Center Radiant Crimson Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[5px] h-[5px] rounded-full bg-[#ff1e38] pointer-events-none shadow-[0_0_12px_rgba(255,30,56,1)]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Trailing Ring with Crimson Neon Glow */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,border-color,background-color,box-shadow] duration-200"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 48 : isPressed ? 18 : 28,
          height: isHovered ? 48 : isPressed ? 18 : 28,
          borderColor: isHovered
            ? 'rgba(255, 30, 56, 0.95)'
            : 'rgba(255, 30, 56, 0.35)',
          backgroundColor: isHovered
            ? 'rgba(255, 30, 56, 0.1)'
            : 'transparent',
          boxShadow: isHovered
            ? '0 0 20px rgba(255, 30, 56, 0.45)'
            : 'none',
        }}
      />
    </div>
  );
};
