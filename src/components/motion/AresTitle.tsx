import { motion, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import './aresTitle.css';

const LETTERS = ['A', 'R', 'E', 'S'];
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Titre "ARES" : entrée lettre par lettre depuis un masque, reflet rouge
 * qui balaie les lettres en décalé, et projecteur rouge qui suit le curseur.
 * Animations coupées si prefers-reduced-motion.
 */
export const AresTitle = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (e: PointerEvent<HTMLHeadingElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
    el.style.setProperty('--spot', '1');
  };

  const handleLeave = () => {
    ref.current?.style.setProperty('--spot', '0');
  };

  return (
    <h1
      ref={ref}
      className="ares-title"
      aria-label="Ares"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <span className="ares-title__layer" aria-hidden="true">
        {LETTERS.map((ch, i) => (
          <span key={ch} className="ares-title__mask">
            <motion.span
              className={reduce ? 'ares-title__char ares-title__char--static' : 'ares-title__char'}
              style={{ animationDelay: `${i * 0.35}s` }}
              initial={reduce ? false : { y: '115%', rotate: 7, opacity: 0 }}
              animate={{ y: '0%', rotate: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.15 + i * 0.09, ease: EASE }}
            >
              {ch}
            </motion.span>
          </span>
        ))}
      </span>

      <span className="ares-title__layer ares-title__spot" aria-hidden="true">
        {LETTERS.map((ch) => (
          <span key={ch} className="ares-title__mask">
            <span className="ares-title__char ares-title__char--spot">{ch}</span>
          </span>
        ))}
      </span>
    </h1>
  );
};