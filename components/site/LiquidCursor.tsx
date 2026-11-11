"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const DOTS = 10;

/**
 * Rastro "líquido" do cursor: gotas que seguem o ponteiro com atraso crescente,
 * fundidas por um filtro SVG (goo) e invertendo as cores por baixo.
 * Só em mouse (pointer: fine) e sem movimento reduzido.
 */
export default function LiquidCursor() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const el = wrap.current;
    if (!el) return;
    el.style.display = "block";

    const dots = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-dot]"));
    const pos = dots.map(() => ({ x: -100, y: -100 }));
    const mouse = { x: -100, y: -100 };
    let raf = 0;
    let hovering = false;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hovering = !!(e.target as HTMLElement).closest("a, button, [data-cursor]");
    };

    const loop = () => {
      pos.forEach((p, i) => {
        const lead = i === 0 ? mouse : pos[i - 1];
        const k = i === 0 ? 0.4 : 0.55;
        p.x += (lead.x - p.x) * k;
        p.y += (lead.y - p.y) * k;
        const scale = (hovering ? 1.9 : 1) * (1 - i / (DOTS * 1.25));
        dots[i].style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <svg aria-hidden="true" className="pointer-events-none absolute size-0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
        </filter>
      </svg>
      <div
        ref={wrap}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[90] hidden mix-blend-difference"
        style={{ filter: "url(#goo)" }}
      >
        {Array.from({ length: DOTS }, (_, i) => (
          <span key={i} data-dot className="absolute left-0 top-0 size-8 rounded-full bg-white will-change-transform" />
        ))}
      </div>
    </>
  );
}
