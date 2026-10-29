import { useEffect, useState, type FormEvent } from "react";
import {
  EMAIL,
  chapters,
  collaborations,
  projectKinds,
  projects,
  ribbon,
  socials,
  stackGroups,
  stackItems,
  type ProjectId,
} from "./content";
import { CommandMenu } from "./command-menu";
import { HeadlineField } from "./headline-field";
import { ProjectVisual } from "./visuals";

function useClock() {
  const [time, setTime] = useState("—:—");
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Europe/Warsaw",
      }).format(new Date());
    const tick = () => setTime(format());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Portfolio() {
  const time = useClock();
  const [menuOpen, setMenuOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const [openId, setOpenId] = useState<ProjectId>("surfaces");
  const [group, setGroup] = useState<(typeof stackGroups)[number]>("All");
  const [tech, setTech] = useState<(typeof stackItems)[number]["name"]>("TypeScript");
  const [copied, setCopied] = useState(false);
  const [delivery, setDelivery] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const selected = stackItems.find((item) => item.name === tech) ?? stackItems[0];
  const visibleStack = stackItems.filter((item) => group === "All" || item.group === group);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? window.scrollY / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIndexOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (delivery === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("company") ?? "").trim()) {
      setDelivery("sent");
      form.reset();
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const kind = String(data.get("kind") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setDelivery("error");
      return;
    }

    setDelivery("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          project: kind,
          message,
          subject: `Project — ${kind} — ${name}`,
          from_name: "maxisy.pl",
          botcheck: false,
        }),
      });
      const payload = (await response.json()) as { success?: boolean };
      if (!response.ok || payload.success !== true) {
        setDelivery("error");
        return;
      }
      setDelivery("sent");
      form.reset();
    } catch {
      setDelivery("error");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div id="top" className="min-h-screen bg-ink text-fg">
      <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
        <div
          className="absolute inset-x-0 top-0 h-px origin-left bg-signal"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
          <a href="#top" className="flex min-h-11 items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-signal font-display text-lg text-signal-ink">
              M
            </span>
            <span className="label text-fg">Maxisy</span>
          </a>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {[
              ["work", "Work"],
              ["practice", "Practice"],
              ["stack", "Stack"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="inline-flex min-h-11 items-center px-3 text-sm text-muted hover:text-fg">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <p className="hidden text-xs text-muted tabular-nums sm:block">
              <span className="text-fg">{time}</span> CET
            </p>
            <button
              type="button"
              className="hidden min-h-11 items-center rounded-full border border-line px-4 text-sm text-fg hover:border-muted lg:inline-flex"
              onClick={() => setIndexOpen(true)}
            >
              Index
            </button>
            <a
              href="#contact"
              className="hidden min-h-11 items-center rounded-full bg-signal px-4 text-sm font-medium text-signal-ink transition-transform duration-150 ease-out active:scale-[0.96] sm:inline-flex"
            >
              Start a project
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
                <span className={menuOpen ? "h-px w-4 origin-center rotate-45 bg-fg" : "h-px w-4 bg-fg"} />
                <span className={menuOpen ? "h-px w-4 origin-center -translate-y-[3px] -rotate-45 bg-fg" : "h-px w-4 bg-fg"} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-30 flex flex-col bg-ink px-6 pt-24 lg:hidden">
          {[
            ["work", "Work"],
            ["practice", "Practice"],
            ["stack", "Stack"],
            ["contact", "Contact"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="title border-b border-line py-4 text-fg"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            className="mt-8 min-h-11 text-left text-sm text-muted"
            onClick={() => {
              setMenuOpen(false);
              setIndexOpen(true);
            }}
          >
            Open index
          </button>
        </div>
      ) : null}

      <main>
        <section className="relative overflow-hidden">
          <HeadlineField />
          <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 md:px-8 md:pt-28 md:pb-32">
            <div className="max-w-3xl">
              <p className="rise label flex items-center gap-3 text-muted">
                <span className="live-dot inline-block size-1.5 rounded-full bg-signal" />
                Open for select work
              </p>
              <h1 className="display rise mt-6 text-balance text-fg" style={{ animationDelay: "80ms" }}>
                Sites that feel <em className="text-signal italic">inevitable.</em>
              </h1>
              <p
                className="rise mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted"
                style={{ animationDelay: "160ms" }}
              >
                I design and build the surface — React, Next.js, TypeScript, Tailwind — and the machinery under it.
                Node, Python, Java, Solana, Discord bots. One practice, from the first pixel to the script that runs at 3am.
              </p>
              <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "240ms" }}>
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center rounded-full bg-signal px-5 text-sm font-medium text-signal-ink transition-transform duration-150 ease-out active:scale-[0.96]"
                >
                  See the work
                </a>
                <button
                  type="button"
                  onClick={() => void copyEmail()}
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm text-fg hover:border-muted"
                >
                  {copied ? "Email copied" : "maxisy@maxisy.pl"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker border-y border-signal bg-signal text-signal-ink">
          <div className="ticker-track flex w-max items-center gap-0 py-4">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {ribbon.map((item) => (
                  <li key={`${copy}-${item}`} className="label flex items-center px-4">
                    <span className="mr-8 inline-block size-1.5 rounded-full bg-signal-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section id="work" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="label text-muted">Selected work</p>
              <h2 className="title mt-4 max-w-xl text-balance text-fg">Systems I’ve actually shipped.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-pretty text-muted">
              No invented metrics. The work below is the practice: interfaces now, chain and community tooling since 2021, scripts since the beginning.
            </p>
          </div>

          <div className="mt-12 border-t border-line">
            {projects.map((project) => {
              const open = openId === project.id;
              return (
                <article key={project.id} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 py-5 text-left md:gap-8 md:py-6"
                      onClick={() => setOpenId(project.id)}
                    >
                      <span className={open ? "font-display text-2xl text-signal tabular-nums" : "font-display text-2xl text-muted tabular-nums"}>
                        {project.index}
                      </span>
                      <span className="font-display text-2xl tracking-tight text-fg md:text-4xl">{project.title}</span>
                      <span className="ml-auto hidden text-sm text-muted sm:block">{project.era}</span>
                      <span className={open ? "text-signal" : "text-muted"} aria-hidden="true">
                        {open ? "–" : "+"}
                      </span>
                    </button>
                  </h3>
                  <div className={open ? "fold open" : "fold"}>
                    <div className="overflow-hidden">
                      <div
                        className="spot grid gap-8 pb-8 md:grid-cols-2 md:pb-10"
                        onMouseMove={(event) => {
                          const rect = event.currentTarget.getBoundingClientRect();
                          event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
                          event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
                        }}
                      >
                        <ProjectVisual id={project.id} />
                        <div>
                          <p className="text-lg leading-relaxed text-pretty text-fg">{project.summary}</p>
                          <ul className="mt-5 space-y-3">
                            {project.details.map((detail) => (
                              <li key={detail} className="flex gap-3 text-sm leading-relaxed text-pretty text-muted">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                          <ul className="mt-6 flex flex-wrap gap-2">
                            {project.stack.map((item) => (
                              <li key={item} className="rounded-full border border-line px-3 py-1 text-xs text-fg">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10">
            <p className="label text-muted">Selected collaborations</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {collaborations.map((client) => (
                <li key={client.name}>
                  <a
                    href={client.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center text-sm text-fg underline decoration-line underline-offset-4 hover:decoration-signal"
                  >
                    {client.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="practice" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label text-muted">Practice</p>
              <h2 className="title mt-4 text-balance text-fg">Nine years, pointed at harder problems.</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-pretty text-muted">
                Java since 2017. Python since 2020. Solana since 2021 — programs, drops, mint pages, and the bots beside them.
                The interface work is the part I want judged in public.
              </p>
            </div>
            <ol className="lg:col-span-7">
              {chapters.map((chapter, index) => (
                <li key={chapter.year} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line py-6 md:grid-cols-[6rem_1fr]">
                  <p className="font-display text-xl text-signal tabular-nums">{chapter.year}</p>
                  <div>
                    <h3 className="text-lg text-fg">
                      <span className="mr-3 text-muted tabular-nums">0{index + 1}</span>
                      {chapter.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-pretty text-muted">{chapter.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="stack" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="label text-muted">Stack</p>
            <h2 className="title mt-4 max-w-2xl text-balance text-fg">Pick a tool. I’ll tell you what I do with it.</h2>
            <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Stack groups">
              {stackGroups.map((name) => {
                const on = group === name;
                return (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={
                      on
                        ? "min-h-11 rounded-full bg-fg px-4 text-sm font-medium text-ink"
                        : "min-h-11 rounded-full border border-line px-4 text-sm text-muted hover:text-fg"
                    }
                    onClick={() => {
                      setGroup(name);
                      const next = stackItems.find((item) => name === "All" || item.group === name);
                      if (next && !stackItems.some((item) => item.name === tech && (name === "All" || item.group === name))) {
                        setTech(next.name);
                      }
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              <div className="flex flex-wrap content-start gap-2 lg:col-span-7" role="tablist" aria-label="Technologies">
                {visibleStack.map((item) => {
                  const on = tech === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      className={
                        on
                          ? "min-h-11 rounded-full bg-signal px-4 text-sm font-medium text-signal-ink"
                          : "min-h-11 rounded-full border border-line px-4 text-sm text-fg hover:border-muted"
                      }
                      onClick={() => setTech(item.name)}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-card border border-line bg-ink-raised p-6 lg:col-span-5" role="tabpanel">
                <p className="label text-signal">{selected.group}</p>
                <h3 className="mt-4 font-display text-4xl tracking-tight text-fg">{selected.name}</h3>
                <p className="mt-4 text-base leading-relaxed text-pretty text-muted">{selected.line}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <div className="paper rounded-card bg-paper px-5 py-10 text-ink md:px-12 md:py-14">
              <p className="label text-ink/60">Contact</p>
              <h2 className="title mt-4 max-w-3xl text-balance">
                If it has to feel finished, <em className="italic">send it here.</em>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-ink/70">
                Websites, web apps, Solana tooling, Discord bots, scripts. Tell me the constraint and the deadline.
              </p>
              <form className="mt-10 grid gap-6 md:grid-cols-2" onSubmit={(event) => void sendMessage(event)}>
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <label className="block">
                  <span className="label text-ink/50">Name</span>
                  <input
                    required
                    name="name"
                    autoComplete="name"
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-ink"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="label text-ink/50">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    autoComplete="email"
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink outline-none placeholder:text-ink/35 focus:border-ink"
                    placeholder="you@studio.com"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="label text-ink/50">What are we building</span>
                  <select
                    name="kind"
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-3 text-base text-ink outline-none focus:border-ink"
                    defaultValue="Website"
                  >
                    {projectKinds.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block md:col-span-2">
                  <span className="label text-ink/50">The short version</span>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    className="mt-2 w-full resize-y border-b border-ink/20 bg-transparent py-3 text-base leading-relaxed text-ink outline-none placeholder:text-ink/35 focus:border-ink"
                    placeholder="What it is, who it’s for, and when you need it."
                  />
                </label>
                <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                  <button
                    type="submit"
                    disabled={delivery === "sending"}
                    className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-transform duration-150 ease-out active:scale-[0.96] disabled:cursor-wait disabled:opacity-60"
                  >
                    {delivery === "sending" ? "Sending" : "Send"}
                  </button>
                  <button type="button" onClick={() => void copyEmail()} className="min-h-11 text-sm text-ink underline decoration-ink/30 underline-offset-4">
                    {copied ? "Copied" : "Copy the address instead"}
                  </button>
                </div>
                {delivery === "sent" ? (
                  <p className="text-sm text-ink/70 md:col-span-2" role="status">
                    Sent. I’ll reply from {EMAIL}.
                  </p>
                ) : null}
                {delivery === "error" ? (
                  <p className="text-sm text-ink/70 md:col-span-2" role="status">
                    {import.meta.env.DEV && !import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
                      ? "Add VITE_WEB3FORMS_ACCESS_KEY to .env.local, then restart the dev server."
                      : "That didn’t go through. Copy the address and write directly."}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="label text-muted">Maxisy · maxisy.pl</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-sm text-fg"
                  {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            Press <kbd className="text-fg">Ctrl</kbd> <kbd className="text-fg">K</kbd> to jump
          </p>
        </div>
      </footer>

      <CommandMenu open={indexOpen} onOpenChange={setIndexOpen} />
    </div>
  );
}
