import { useEffect, useRef } from 'react';

interface MarqueeTickerProps {
  scrollVelocity?: number;
}

export const MarqueeTicker = ({ scrollVelocity = 0 }: MarqueeTickerProps) => {
  const stackItems = [
    'REACT 19',
    'TYPESCRIPT',
    'NEXT.JS',
    'NODE 22',
    'POSTGRESQL',
    'REDIS',
    'TAILWIND 4',
    'RUST / WASM',
    'REACT NATIVE',
    'DOCKER',
    'FASTAPI',
    'CLOUDFLARE',
    'WEBSOCKETS',
    'DRIZZLE ORM',
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    velocityRef.current = scrollVelocity;
  }, [scrollVelocity]);

  // Velocity-driven smooth scrubbing loop
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let smoothedExtra = 0;
    const baseSpeed = 0.75; // constant elegant drift

    const onScrollEvent = (e: Event) => {
      const custom = e as CustomEvent<{ velocity: number }>;
      if (custom.detail?.velocity !== undefined) {
        velocityRef.current = custom.detail.velocity;
      }
    };
    window.addEventListener('portfolio-scroll', onScrollEvent);

    const update = () => {
      // Smoothly interpolate scroll velocity contribution
      smoothedExtra += (velocityRef.current * 1.8 - smoothedExtra) * 0.12;

      // Decay raw velocity
      velocityRef.current *= 0.92;

      const delta = baseSpeed + smoothedExtra;
      offsetRef.current -= delta;

      // Halfway reset for seamless infinite loop
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        if (offsetRef.current <= -halfWidth) {
          offsetRef.current += halfWidth;
        } else if (offsetRef.current > 0) {
          offsetRef.current -= halfWidth;
        }
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      animRef.current = requestAnimationFrame(update);
    };

    animRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('portfolio-scroll', onScrollEvent);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const content = stackItems.map((item, idx) => (
    <span key={idx} className="mono text-[0.78rem] tracking-[0.14em] text-[#837e6f] px-3 shrink-0">
      <strong className="text-[#f2a33c] font-normal mr-3">{item}</strong>—
    </span>
  ));

  return (
    <div
      className="overflow-hidden border-y border-[rgba(237,232,221,0.08)] py-3.5 bg-[#050506] select-none relative"
      aria-hidden="true"
    >
      {/* Edge gradient masks for film reel fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050506] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050506] to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: 'max-content' }}
      >
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center">{content}</div>
      </div>
    </div>
  );
};
