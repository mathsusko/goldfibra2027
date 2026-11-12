"use client";

import { useEffect, useRef } from "react";
import { Download, Gamepad2, Gauge, Heart, House, MessageCircle, Play, Router, Wifi, Zap, type LucideIcon } from "lucide-react";

type Moeda = { Icone: LucideIcon; x: number; y: number; tam: number; prof: number; giro: number; mobile?: boolean };

/* posição em % do hero, tamanho em px, profundidade (0 = fundo, 1 = perto) e inclinação base */
const MOEDAS: Moeda[] = [
  { Icone: Wifi, x: 6, y: 15, tam: 112, prof: 0.95, giro: -18, mobile: true },
  { Icone: Gamepad2, x: 25, y: 7, tam: 74, prof: 0.5, giro: 14 },
  { Icone: Gauge, x: 20, y: 34, tam: 86, prof: 0.65, giro: -8, mobile: true },
  { Icone: MessageCircle, x: 9, y: 50, tam: 64, prof: 0.4, giro: 20 },
  { Icone: Play, x: 58, y: 10, tam: 96, prof: 0.8, giro: 16, mobile: true },
  { Icone: Download, x: 86, y: 13, tam: 120, prof: 1, giro: -12, mobile: true },
  { Icone: Zap, x: 56, y: 56, tam: 66, prof: 0.45, giro: -22 },
  { Icone: House, x: 90, y: 50, tam: 86, prof: 0.7, giro: 10 },
  { Icone: Router, x: 87, y: 68, tam: 92, prof: 0.9, giro: -16 },
  { Icone: Heart, x: 60, y: 87, tam: 54, prof: 0.35, giro: 18 },
];

/**
 * Moedas 3D com ícones flutuando sobre a foto. Cada uma balança sozinha, se desloca com o mouse
 * conforme a profundidade (parallax), foge do cursor quando ele chega perto e gira ao ser clicada.
 */
export default function Icones() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const itens = Array.from(el.querySelectorAll<HTMLElement>("[data-moeda]"));
    const st = itens.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, rx: 0, ry: 0 }));
    const mouse = { x: -9999, y: -9999, nx: 0, ny: 0, dentro: false };
    const host = el.parentElement ?? el;

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.nx = mouse.x / r.width - 0.5;
      mouse.ny = mouse.y / r.height - 0.5;
      mouse.dentro = true;
    };
    const onLeave = () => {
      mouse.dentro = false;
      mouse.x = mouse.y = -9999;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let prev = 0;
    const tick = (now: number) => {
      const dt = prev ? Math.min((now - prev) / 1000, 1 / 30) : 1 / 60;
      prev = now;
      const t = now / 1000;
      itens.forEach((it, i) => {
        const m = MOEDAS[i];
        const s = st[i];
        const prof = m.prof;
        // alvo: parallax pelo mouse + balanço próprio
        let tx = (mouse.dentro ? -mouse.nx : 0) * 60 * prof + Math.sin(t * 0.9 + i * 1.7) * 7 * prof;
        let ty = (mouse.dentro ? -mouse.ny : 0) * 40 * prof + Math.cos(t * 0.7 + i * 2.3) * 10 * prof;
        // repulsão quando o cursor chega perto
        const cx = it.offsetLeft + it.offsetWidth / 2 + s.x;
        const cy = it.offsetTop + it.offsetHeight / 2 + s.y;
        const dx = cx - mouse.x;
        const dy = cy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const raio = 170 + m.tam * 0.6;
        if (dist < raio && dist > 0.01) {
          const f = Math.pow(1 - dist / raio, 1.6) * 140 * (0.5 + prof);
          tx += (dx / dist) * f;
          ty += (dy / dist) * f;
        }
        // mola
        s.vx += ((tx - s.x) * 60 - s.vx * 11) * dt;
        s.vy += ((ty - s.y) * 60 - s.vy * 11) * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.ry = s.vx * 0.06 + (mouse.dentro ? mouse.nx * 24 : 0);
        s.rx = -s.vy * 0.06 + (mouse.dentro ? -mouse.ny * 18 : 0);
        it.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
        const disco = it.firstElementChild as HTMLElement | null;
        if (disco)
          disco.style.transform = `rotateX(${(28 + s.rx).toFixed(2)}deg) rotateY(${(m.giro + s.ry).toFixed(2)}deg)`;
      });
      raf = requestAnimationFrame(tick);
    };

    let ativo = false;
    const io = new IntersectionObserver(([e]) => {
      if (calmo) return;
      if (e.isIntersecting && !ativo) {
        ativo = true;
        prev = 0;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && ativo) {
        ativo = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const girar = (e: React.MouseEvent<HTMLButtonElement>) => {
    const face = e.currentTarget.querySelector(".gf-moeda-giro");
    face?.animate(
      [{ transform: "rotateY(0deg) scale(1)" }, { transform: "rotateY(200deg) scale(1.18)" }, { transform: "rotateY(360deg) scale(1)" }],
      { duration: 900, easing: "cubic-bezier(.22,1,.36,1)" },
    );
  };

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {MOEDAS.map((m, i) => {
        const Icone = m.Icone;
        return (
          <div
            key={i}
            data-moeda
            className={`absolute size-[calc(var(--tam)*0.6)] will-change-transform md:size-(--tam) ${m.mobile ? "" : "hidden md:block"}`}
            style={{ left: `${m.x}%`, top: `${m.y}%`, ["--tam" as string]: `${m.tam}px` }}
          >
            <div className="gf-moeda h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              <button
                type="button"
                tabIndex={-1}
                onClick={girar}
                className="gf-moeda-giro pointer-events-auto relative block h-full w-full cursor-pointer rounded-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <span className="gf-moeda-borda" />
                <span className="gf-moeda-face">
                  <Icone strokeWidth={2.4} className="h-[46%] w-[46%]" />
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
