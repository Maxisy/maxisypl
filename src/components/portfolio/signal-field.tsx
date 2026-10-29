import { useEffect, useRef } from "react";

const SIGNAL = "#e2ff4d";
const MUTED = "rgba(244, 241, 234, 0.28)";
const HAIR = "rgba(244, 241, 234, 0.14)";

export function SignalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const read = readRef.current;
    if (!canvas || !read) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, inside: false };
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      pointer.inside = inside;
      if (inside) {
        pointer.tx = x;
        pointer.ty = y;
      }
    };

    const onLeave = () => {
      pointer.inside = false;
    };

    const displace = (x: number, y: number, reach: number) => {
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d = Math.hypot(dx, dy) + 0.001;
      const force = Math.exp(-(d * d) / (2 * reach * reach));
      return {
        x: x + (dx / d) * force * 26,
        y: y + (dy / d) * force * 26,
        force,
      };
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (pointer.inside) {
        pointer.x += (pointer.tx - pointer.x) * 0.18;
        pointer.y += (pointer.ty - pointer.y) * 0.18;
      } else {
        pointer.x += (w * 0.5 - pointer.x) * 0.04;
        pointer.y += (h * 0.72 - pointer.y) * 0.04;
      }

      ctx.clearRect(0, 0, w, h);
      const cols = w < 480 ? 14 : 18;
      const rows = w < 480 ? 10 : 16;
      const reach = w < 480 ? 78 : 110;

      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c += 1) {
        ctx.beginPath();
        let hot = 0;
        for (let r = 0; r <= rows; r += 1) {
          const p = displace((c / cols) * w, (r / rows) * h, reach);
          hot = Math.max(hot, p.force);
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = hot > 0.35 ? SIGNAL : HAIR;
        ctx.globalAlpha = hot > 0.35 ? 0.9 : 1;
        ctx.stroke();
      }

      for (let r = 0; r <= rows; r += 1) {
        ctx.beginPath();
        let hot = 0;
        for (let c = 0; c <= cols; c += 1) {
          const p = displace((c / cols) * w, (r / rows) * h, reach);
          hot = Math.max(hot, p.force);
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = hot > 0.35 ? SIGNAL : HAIR;
        ctx.globalAlpha = hot > 0.35 ? 0.9 : 1;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      const nodes = w < 480 ? 7 : 9;
      for (let r = 0; r <= nodes; r += 1) {
        for (let c = 0; c <= nodes; c += 1) {
          const p = displace((c / nodes) * w, (r / nodes) * h, reach);
          ctx.beginPath();
          ctx.fillStyle = p.force > 0.28 ? SIGNAL : MUTED;
          ctx.arc(p.x, p.y, p.force > 0.45 ? 2.4 : 1.3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (pointer.inside && pointer.x > -100) {
        ctx.beginPath();
        ctx.strokeStyle = SIGNAL;
        ctx.lineWidth = 1;
        ctx.arc(pointer.x, pointer.y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = SIGNAL;
        ctx.arc(pointer.x, pointer.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      frame += 1;
      if (frame % 3 === 0 && pointer.inside) {
        const x = Math.max(0, Math.round(pointer.x)).toString().padStart(3, "0");
        const y = Math.max(0, Math.round(pointer.y)).toString().padStart(3, "0");
        read.textContent = `X ${x}   Y ${y}`;
      } else if (!pointer.inside && frame % 8 === 0) {
        read.textContent = "Move across the field";
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);

    const loop = () => {
      draw();
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div className="field-frame relative overflow-hidden rounded-card border border-line bg-ink-raised">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <span className="pointer-events-none absolute top-3 left-3 size-3 border-t border-l border-signal" />
      <span className="pointer-events-none absolute top-3 right-3 size-3 border-t border-r border-signal" />
      <span className="pointer-events-none absolute bottom-3 left-3 size-3 border-b border-l border-signal" />
      <span className="pointer-events-none absolute right-3 bottom-3 size-3 border-r border-b border-signal" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4">
        <p className="text-xs font-medium tracking-label text-muted uppercase">Pointer field</p>
        <p className="text-xs font-medium tracking-label text-signal uppercase">Live</p>
      </div>
      <p
        ref={readRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 px-5 py-4 text-xs tracking-widest text-fg tabular-nums"
      >
        Move across the field
      </p>
    </div>
  );
}
