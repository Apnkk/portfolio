export const MarqueeTicker = () => {
  const stackItems = [
    "REACT 19",
    "TYPESCRIPT",
    "NEXT.JS",
    "NODE 22",
    "POSTGRESQL",
    "REDIS",
    "TAILWIND 4",
    "RUST / WASM",
    "REACT NATIVE",
    "DOCKER",
    "FASTAPI",
    "CLOUDFLARE",
    "WEBSOCKETS",
    "DRIZZLE ORM",
  ];

  const content = stackItems.map((item, idx) => (
    <span key={idx} className="mono text-[0.78rem] tracking-[0.14em] text-[#837e6f] px-3">
      <strong className="text-[#f2a33c] font-normal mr-3">{item}</strong>—
    </span>
  ));

  return (
    <div className="overflow-hidden border-y border-[rgba(237,232,221,0.1)] py-3.5 bg-[#121008] select-none" aria-hidden="true">
      <div className="animate-marquee flex whitespace-nowrap">
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center">{content}</div>
        <div className="flex shrink-0 items-center">{content}</div>
      </div>
    </div>
  );
};
