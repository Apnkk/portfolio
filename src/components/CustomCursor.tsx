import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isInWindow, setIsInWindow] = useState(false);
  const [isVisible] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isVisible) return;

    // Hide default system Windows cursor
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

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible || !isInWindow) return null;

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Center Amber Dot */}
      <motion.div
        className="fixed top-0 left-0 w-[5px] h-[5px] rounded-full bg-[#f2a33c] pointer-events-none shadow-[0_0_8px_#f2a33ccc]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border pointer-events-none transition-[width,height,border-color,background-color] duration-200"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovered ? 48 : isPressed ? 20 : 30,
          height: isHovered ? 48 : isPressed ? 20 : 30,
          borderColor: isHovered
            ? 'rgba(242, 163, 60, 0.9)'
            : 'rgba(242, 163, 60, 0.35)',
          backgroundColor: isHovered
            ? 'rgba(242, 163, 60, 0.08)'
            : 'transparent',
        }}
      />
    </div>
  );
};
