import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { EMAIL, socials } from "./content";

type Action = {
  id: string;
  group: string;
  label: string;
  run: () => void;
};

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const actions = useMemo<Action[]>(
    () => [
      { id: "work", group: "Go", label: "Selected work", run: () => go("work") },
      { id: "practice", group: "Practice", label: "Practice", run: () => go("practice") },
      { id: "stack", group: "Stack", label: "Stack", run: () => go("stack") },
      { id: "contact", group: "Contact", label: "Start a project", run: () => go("contact") },
      {
        id: "email",
        group: "Act",
        label: "Copy email",
        run: () => {
          void navigator.clipboard?.writeText(EMAIL).then(
            () => setNote("Copied maxisy@maxisy.pl"),
            () => setNote(EMAIL),
          );
        },
      },
      {
        id: "github",
        group: "Open",
        label: "GitHub",
        run: () => window.open(socials[0].href, "_blank", "noopener,noreferrer"),
      },
      {
        id: "x",
        group: "Open",
        label: "X",
        run: () => window.open(socials[1].href, "_blank", "noopener,noreferrer"),
      },
    ],
    [],
  );

  const filtered = actions.filter((action) => action.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setNote(null);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/80" />
        <Dialog.Content
          className="fixed top-[14vh] left-1/2 z-50 w-[min(36rem,calc(100%-2.5rem))] -translate-x-1/2 overflow-hidden rounded-card border border-line bg-ink-raised"
          aria-describedby={undefined}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActive((value) => (filtered.length ? (value + 1) % filtered.length : 0));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => (filtered.length ? (value - 1 + filtered.length) % filtered.length : 0));
            } else if (event.key === "Enter" && filtered[active]) {
              event.preventDefault();
              filtered[active].run();
              if (filtered[active].id !== "email") onOpenChange(false);
            }
          }}
        >
          <Dialog.Title className="sr-only">Site index</Dialog.Title>
          <label className="block border-b border-line">
            <span className="sr-only">Search the site</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Jump, copy, open…"
              className="w-full bg-transparent px-4 py-4 text-base text-fg outline-none placeholder:text-muted"
            />
          </label>
          <ul className="max-h-80 overflow-auto p-2">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-sm text-muted">Nothing under that name.</li>
            ) : (
              filtered.map((action, index) => (
                <li key={action.id}>
                  <button
                    type="button"
                    className={
                      index === active
                        ? "flex min-h-11 w-full items-center justify-between rounded-lg bg-signal px-3 text-left text-sm text-signal-ink"
                        : "flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-fg hover:bg-ink"
                    }
                    onMouseEnter={() => setActive(index)}
                    onClick={() => {
                      action.run();
                      if (action.id !== "email") onOpenChange(false);
                    }}
                  >
                    <span>{action.label}</span>
                    <span className={index === active ? "label text-signal-ink/70" : "label text-muted"}>
                      {action.group}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-muted">
            <span>{note ?? "Arrows to move · Enter to run"}</span>
            <span className="label">Esc</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
