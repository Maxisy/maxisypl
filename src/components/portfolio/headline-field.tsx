import { useEffect, useRef } from "react";

const SIGNAL = "226, 255, 77";
const PAPER = "244, 241, 234";
const GAP = 26;
const REACH = 148;

type Dot = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  phase: number;
};

function unit(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function HeadlineField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false };
    let dots: Dot[] = [];
    let raf = 0;
    let visible = true;

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const next: Dot[] = [];
      const cols = Math.ceil(rect.width / GAP) + 2;
      const rows = Math.ceil(rect.height / GAP) + 2;
      let index = 0;
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const ox = col * GAP + (row % 2) * (GAP / 2) + (unit(index) - 0.5) * 6;
          const oy = row * GAP + (unit(index + 19) - 0.5) * 6;
          next.push({ ox, oy, x: ox, y: oy, phase: unit(index + 7) * Math.PI * 2 });
          index += 1;
        }
      }
      dots = next;
    };

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && !pointer.inside) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.inside = inside;
      if (inside) {
        pointer.tx = x;
        pointer.ty = y;
      }
    };

    const draw = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const seconds = time / 1000;
      const reach = w < 640 ? 110 : REACH;

      if (pointer.inside) {
        pointer.x += (pointer.tx - pointer.x) * 0.22;
        pointer.y += (pointer.ty - pointer.y) * 0.22;
      }

      ctx.clearRect(0, 0, w, h);

      if (pointer.inside) {
        const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, reach);
        glow.addColorStop(0, `rgba(${SIGNAL}, 0.09)`);
        glow.addColorStop(1, `rgba(${SIGNAL}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, reach, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const dot of dots) {
        const drift = reduced ? 0 : Math.sin(seconds * 0.55 + dot.phase) * 1.6;
        let tx = dot.ox + drift;
        let ty = dot.oy + Math.cos(seconds * 0.45 + dot.phase) * (reduced ? 0 : 1.6);
        let influence = 0;

        if (pointer.inside) {
          const dx = dot.ox - pointer.x;
          const dy = dot.oy - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          influence = Math.max(0, 1 - dist / reach);
          const push = influence * influence * 16;
          tx += (dx / dist) * push;
          ty += (dy / dist) * push;
        }

        dot.x += (tx - dot.x) * (reduced ? 1 : 0.14);
        dot.y += (ty - dot.y) * (reduced ? 1 : 0.14);

        ctx.beginPath();
        ctx.fillStyle = `rgba(${PAPER}, 0.2)`;
        ctx.arc(dot.x, dot.y, 1.15, 0, Math.PI * 2);
        ctx.fill();

        if (influence > 0.02) {
          ctx.beginPath();
          ctx.globalAlpha = influence * 0.9;
          ctx.fillStyle = `rgb(${SIGNAL})`;
          ctx.arc(dot.x, dot.y, 1.15 + influence * 1.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    };

    const loop = (time: number) => {
      draw(time);
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    };

    layout();
    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (reduced) draw(performance.now());
    });
    resizeObserver.observe(canvas);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }
    });
    visibilityObserver.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="headline-field pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
