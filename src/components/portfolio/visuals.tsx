import type { ReactNode } from "react";
import type { ProjectId } from "./content";

export function ProjectVisual({ id }: { id: ProjectId }) {
  if (id === "surfaces") return <SurfaceVisual />;
  if (id === "chain") return <ChainVisual />;
  if (id === "bots") return <BotVisual />;
  return <ScriptVisual />;
}

function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-line" />
        <span className="size-2 rounded-full bg-signal" />
        <span className="ml-3 text-xs tracking-widest text-muted">maxisy.pl</span>
      </div>
      {children}
    </div>
  );
}

function SurfaceVisual() {
  return (
    <Chrome>
      <div className="grid gap-6 p-5 sm:grid-cols-5 sm:p-6">
        <div className="sm:col-span-3">
          <p className="label text-signal">Surface</p>
          <p className="mt-3 font-display text-3xl leading-none tracking-tight text-fg">
            The page is the product.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Type, space, and one accent. Nothing else has to shout.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-2 sm:col-span-2">
          <div className="h-2 w-full rounded-full bg-line" />
          <div className="h-2 w-4/5 rounded-full bg-line" />
          <div className="mt-3 h-9 w-28 rounded-full bg-signal" />
        </div>
      </div>
    </Chrome>
  );
}

function ChainVisual() {
  const rows = [
    ["7kF3…a91c", "0.42", "sent"],
    ["Hn2c…q0ee", "1.10", "sent"],
    ["9pLm…18aa", "0.08", "queued"],
    ["D4wR…c771", "2.00", "sent"],
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="label text-muted">Airdrop run</p>
        <p className="text-xs text-signal tabular-nums">4,812 holders</p>
      </div>
      <ul>
        {rows.map(([wallet, sol, status]) => (
          <li
            key={wallet}
            className="grid grid-cols-3 items-center border-b border-line px-4 py-3 text-sm last:border-b-0"
          >
            <span className="text-fg tabular-nums">{wallet}</span>
            <span className="text-center text-fg tabular-nums">{sol} SOL</span>
            <span className={status === "queued" ? "text-right text-muted" : "text-right text-signal"}>
              {status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BotVisual() {
  const lines = [
    { who: "you", text: "Snapshot holders and gate the role." },
    { who: "bot", text: "8,903 wallets. 6,411 qualified. Roles syncing." },
    { who: "you", text: "Start the raid-to-earn window." },
    { who: "bot", text: "Window open for 45 minutes. I’ll post the count." },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink">
      <div className="border-b border-line px-4 py-3">
        <p className="label text-muted">Community ops</p>
      </div>
      <ul className="space-y-3 p-4">
        {lines.map((line) => (
          <li key={line.text} className={line.who === "you" ? "text-right" : "text-left"}>
            <p className="label mb-1 text-muted">{line.who}</p>
            <p
              className={
                line.who === "bot"
                  ? "inline-block max-w-[90%] rounded-xl bg-ink-raised px-3 py-2 text-left text-sm leading-relaxed text-fg"
                  : "inline-block max-w-[90%] rounded-xl bg-signal px-3 py-2 text-left text-sm leading-relaxed text-signal-ink"
              }
            >
              {line.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScriptVisual() {
  const lines = [
    { tone: "muted", text: "$ python snapshot.py --mint 4nD…" },
    { tone: "fg", text: "reading 12,441 accounts" },
    { tone: "fg", text: "filtered 8,903 holders" },
    { tone: "signal", text: "wrote holders.csv    42ms" },
  ] as const;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-ink p-5">
      <p className="label mb-4 text-muted">pipeline</p>
      <pre className="space-y-2 text-sm leading-relaxed whitespace-pre-wrap">
        {lines.map((line) => (
          <code key={line.text} className={line.tone === "muted" ? "block text-muted" : line.tone === "signal" ? "block text-signal" : "block text-fg"}>
            {line.text}
          </code>
        ))}
      </pre>
    </div>
  );
}
