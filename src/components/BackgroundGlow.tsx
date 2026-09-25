import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const BackgroundGlow = () => {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Smooth spring physics for cursor follow
  const springX = useSpring(mouseX, { damping: 40, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 40, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Static ambient gradient glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-purple-600/10 to-transparent blur-[120px] rounded-full" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[500px] bg-cyan-600/10 blur-[140px] rounded-full" />

      {/* Dynamic mouse-following ambient torch */}
      <motion.div
        className="hidden md:block absolute w-[450px] h-[450px] rounded-full bg-radial from-cyan-500/12 via-indigo-500/6 to-transparent blur-3xl"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  );
};
