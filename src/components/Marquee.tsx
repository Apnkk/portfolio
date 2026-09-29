export const Marquee = () => {
  const items = [
    'REACT 19',
    'TYPESCRIPT',
    'NODE 22',
    'TAURI / RUST',
    'SWIFT',
    'LIQUID GLASS',
    'TAILWIND 4',
    'THREE.JS',
    'DOCKER',
    'CLOUDFLARE',
    'REVERSE APIS',
    'HLS STREAMING',
  ];

  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="relative w-full overflow-hidden border-y border-[var(--line)] py-3.5 bg-[var(--bg-2)] select-none"
      aria-label="Technologies"
    >
      <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
        {repeated.map((tech, i) => (
          <span key={i} className="flex items-center gap-6 font-mono text-[0.72rem] tracking-wider text-[var(--cream-dim)] uppercase">
            <span>{tech}</span>
            <span className="text-[var(--amber)] select-none opacity-80">—</span>
          </span>
        ))}
      </div>
    </div>
  );
};
