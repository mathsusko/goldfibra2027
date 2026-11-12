"use client";

import { forwardRef, useEffect, useRef } from "react";

/** Tamanho de desenho da tela do celular (proporção da tela na foto). */
export const TELA_W = 220;
export const TELA_H = 492;

const R = 74;
const CX = TELA_W / 2;
const CY = 214;
const ARCO = Math.PI * 1.5; // 270°
const INICIO = Math.PI * 0.75;
const MAX = 1000;

const ponto = (a: number, r = R) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
const arco = (frac: number) => {
  const a1 = INICIO + ARCO * Math.max(0.0001, Math.min(1, frac));
  const [x0, y0] = ponto(INICIO);
  const [x1, y1] = ponto(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${a1 - INICIO > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

/**
 * Medidor de velocidade dentro da tela: mede o ping, depois o download (sobe até ~970 Mbps)
 * e o upload (~510 Mbps), mostra o resultado e recomeça.
 */
const Medidor = forwardRef<HTMLDivElement, { className?: string; style?: React.CSSProperties }>(function Medidor(props, ref) {
  const prog = useRef<SVGPathElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const fase = useRef<HTMLSpanElement>(null);
  const down = useRef<HTMLSpanElement>(null);
  const up = useRef<HTMLSpanElement>(null);
  const ping = useRef<HTMLSpanElement>(null);
  const agulha = useRef<SVGLineElement>(null);

  useEffect(() => {
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ciclo = { ping: 1.2, down: 3.2, pausa: 0.6, up: 2.6, fim: 3.4 };
    const total = ciclo.ping + ciclo.down + ciclo.pausa + ciclo.up + ciclo.fim;
    let alvoDown = 970;
    let alvoUp = 512;
    let raf = 0;
    let t0 = performance.now();
    let volta = -1;

    const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
    const ruido = (t: number) => Math.sin(t * 23) * 6 + Math.sin(t * 41) * 4;

    const pintar = (valor: number, rotulo: string, d: number | null, u: number | null, p: number | null) => {
      const frac = valor / MAX;
      prog.current?.setAttribute("d", arco(frac));
      const a = INICIO + ARCO * Math.min(1, frac);
      const [x2, y2] = ponto(a, R - 16);
      agulha.current?.setAttribute("x2", x2.toFixed(2));
      agulha.current?.setAttribute("y2", y2.toFixed(2));
      if (num.current) num.current.textContent = valor < 1 ? "0" : Math.round(valor).toString();
      if (fase.current) fase.current.textContent = rotulo;
      if (down.current) down.current.textContent = d === null ? "—" : Math.round(d).toString();
      if (up.current) up.current.textContent = u === null ? "—" : Math.round(u).toString();
      if (ping.current) ping.current.textContent = p === null ? "—" : `${p}`;
    };

    if (calmo) {
      pintar(alvoDown, "Download · Mbps", alvoDown, alvoUp, 2);
      return;
    }

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const n = Math.floor(t / total);
      if (n !== volta) {
        volta = n;
        alvoDown = 940 + Math.round(Math.random() * 45);
        alvoUp = 490 + Math.round(Math.random() * 40);
      }
      let s = t - n * total;
      if (s < ciclo.ping) {
        pintar(0, "Medindo o ping…", null, null, s > ciclo.ping * 0.6 ? 2 : null);
      } else if ((s -= ciclo.ping) < ciclo.down) {
        const v = ease(s / (ciclo.down * 0.7)) * alvoDown + (s > ciclo.down * 0.7 ? ruido(t) : 0);
        pintar(v, "Download · Mbps", null, null, 2);
      } else if ((s -= ciclo.down) < ciclo.pausa) {
        pintar(alvoDown * (1 - ease(s / ciclo.pausa)), "Download · Mbps", alvoDown, null, 2);
      } else if ((s -= ciclo.pausa) < ciclo.up) {
        const v = ease(s / (ciclo.up * 0.7)) * alvoUp + (s > ciclo.up * 0.7 ? ruido(t) * 0.6 : 0);
        pintar(v, "Upload · Mbps", alvoDown, null, 2);
      } else {
        pintar(alvoDown, "Download · Mbps", alvoDown, alvoUp, 2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      {...props}
      aria-hidden="true"
      className={`gf-medidor absolute left-0 top-0 origin-top-left overflow-hidden ${props.className ?? ""}`}
      style={{ width: TELA_W, height: TELA_H, borderRadius: 26, ...props.style }}
    >
      {/* barra de status e ilha */}
      <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-semibold text-white/85">
        <span className="tabular">19:04</span>
        <span className="h-[18px] w-[64px] rounded-full bg-black" />
        <span className="flex items-center gap-1">
          <span className="text-[8px]">5G</span>
          <span className="h-[8px] w-[16px] rounded-[3px] border border-white/70 p-[1px]">
            <span className="block h-full w-[75%] rounded-[1px] bg-white/85" />
          </span>
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between px-5">
        <span className="text-[11px] font-semibold tracking-wide text-white">Goldfibra</span>
        <span className="rounded-full bg-white/10 px-2 py-[2px] text-[8px] font-medium uppercase tracking-wider text-[#7fe3ff]">
          Teste de velocidade
        </span>
      </div>

      <svg viewBox={`0 0 ${TELA_W} ${TELA_H}`} className="absolute inset-0">
        <defs>
          <linearGradient id="gf-med-grad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#2a3bff" />
            <stop offset="1" stopColor="#7fe3ff" />
          </linearGradient>
        </defs>
        <path d={arco(1)} fill="none" stroke="#1d2c40" strokeWidth={12} strokeLinecap="round" />
        <path ref={prog} d={arco(0)} fill="none" stroke="url(#gf-med-grad)" strokeWidth={12} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #4f7bff)" }} />
        {Array.from({ length: 11 }, (_, i) => {
          const a = INICIO + (ARCO * i) / 10;
          const [xa, ya] = ponto(a, R - 13);
          const [xb, yb] = ponto(a, R - (i % 5 === 0 ? 20 : 17));
          return <line key={i} x1={xa} y1={ya} x2={xb} y2={yb} stroke="#ffffff" strokeOpacity={0.35} strokeWidth={1.2} />;
        })}
        <line ref={agulha} x1={CX} y1={CY} x2={CX} y2={CY} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={4} fill="#ffffff" />
      </svg>

      <div className="absolute inset-x-0 text-center" style={{ top: CY + 34 }}>
        <span ref={num} className="tabular block text-[40px] font-semibold leading-none tracking-tight text-white">
          0
        </span>
        <span ref={fase} className="mt-1 block text-[9px] uppercase tracking-[0.12em] text-white/60">
          Medindo o ping…
        </span>
      </div>

      <div className="absolute inset-x-4 bottom-[86px] grid grid-cols-3 gap-1 rounded-2xl bg-white/[0.06] px-2 py-3 text-center">
        {[
          ["Download", down, "Mbps"],
          ["Upload", up, "Mbps"],
          ["Ping", ping, "ms"],
        ].map(([rot, r, uni]) => (
          <div key={rot as string} className="flex flex-col gap-[2px]">
            <span className="text-[7.5px] uppercase tracking-wider text-white/50">{rot as string}</span>
            <span ref={r as React.RefObject<HTMLSpanElement>} className="tabular text-[13px] font-semibold text-white">
              —
            </span>
            <span className="text-[7px] text-white/40">{uni as string}</span>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-4 bottom-8 flex h-9 items-center justify-center rounded-full bg-[#2a3bff] text-[10px] font-semibold uppercase tracking-wider text-white">
        Fibra 1 Giga
      </div>
      <span className="absolute bottom-2 left-1/2 h-[4px] w-[70px] -translate-x-1/2 rounded-full bg-white/60" />
    </div>
  );
});

export default Medidor;
