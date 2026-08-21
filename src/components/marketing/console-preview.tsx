import { useEffect, useState } from "react";

const cells = [
  1, 0.4, 0, 1, 0, 0.6, 1, 1, 0.2, 0, 0, 0,
];

/** Animated hero console: a live-looking simulation round ticker. */
export function ConsolePreview() {
  const [round, setRound] = useState(14);
  const [sentiment, setSentiment] = useState(66);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRound((r) => (r >= 24 ? 12 : r + 1));
      setSentiment((s) => 52 + ((s + 7) % 34));
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl bg-console p-1 shadow-2xl ring-1 ring-foreground/10">
      <div className="flex aspect-video flex-col rounded-lg border border-console-line bg-console-panel/50">
        <div className="flex h-8 items-center justify-between border-b border-console-line px-4">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-console-line" />
            <span className="size-2 rounded-full bg-console-line" />
            <span className="size-2 rounded-full bg-console-line" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-console-foreground/50">
            Simulation active: round {round}
          </span>
        </div>

        <div className="grid flex-1 grid-cols-6 gap-2 p-4 sm:p-6">
          <div className="col-span-full mb-2 grid grid-cols-12 gap-1">
            {cells.map((v, i) => (
              <div
                key={i}
                className="flex h-9 items-center justify-center rounded border border-console-line bg-console-line/30 sm:h-12"
              >
                <span
                  className="size-1.5 rounded-full bg-brand"
                  style={{
                    opacity: v === 0 ? 0.18 : v,
                    animation:
                      v === 1 && i % 5 === 0
                        ? "status-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite"
                        : undefined,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="col-span-4 rounded border border-console-line bg-console-panel p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-console-foreground/50">
              Market sentiment
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-console-line">
              <div
                className="h-full bg-brand transition-[width] duration-1000 ease-out"
                style={{ width: `${sentiment}%` }}
              />
            </div>
          </div>
          <div className="col-span-2 rounded border border-console-line bg-console-panel p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-console-foreground/50">
              Risk score
            </p>
            <p className="mt-1 font-mono text-xl text-console-foreground sm:text-2xl">0.24</p>
          </div>
        </div>
      </div>
    </div>
  );
}
