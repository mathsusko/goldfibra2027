"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import "@/components/iso/iso.css";
import "./figuras.css";

type Props = {
  fig: string;
  titulo: string;
  dica: string;
  leitura: string;
  rotulo: string;
  children: ReactNode;
  stageRef?: RefObject<HTMLDivElement | null>;
  stageProps?: React.HTMLAttributes<HTMLDivElement>;
};

/** Moldura do card no padrão da anatomy: Fig no topo esquerdo, título à direita, dica e leitura embaixo. */
export default function Cartao({ fig, titulo, dica, leitura, rotulo, children, stageRef, stageProps }: Props) {
  return (
    <figure className="iso gf-iso" data-theme="light">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">
            {fig}
          </span>
          <span className="iso-plate-corner" data-corner="title">
            {titulo}
          </span>
          <span className="iso-plate-corner" data-corner="hint">
            {dica}
          </span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">
            {leitura}
          </span>
        </div>
        <div ref={stageRef} className="iso-stage" aria-label={rotulo} {...stageProps}>
          {children}
        </div>
      </div>
    </figure>
  );
}

/** Roda `tick` a cada quadro enquanto o elemento está na tela; para sob movimento reduzido depois do primeiro quadro. */
export function useQuadros(alvo: RefObject<HTMLElement | null>, tick: (dt: number, calmo: boolean) => void) {
  const latest = useRef(tick);
  latest.current = tick;
  useEffect(() => {
    const el = alvo.current;
    if (!el) return;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let visivel = false;
    const step = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      latest.current(dt, calmo.matches);
      raf = visivel && !calmo.matches ? requestAnimationFrame(step) : 0;
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visivel = e.isIntersecting;
        if (visivel && !raf) {
          last = 0;
          raf = requestAnimationFrame(step);
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [alvo]);
}

export function dizer(alvo: HTMLElement | null, texto: string) {
  const slot = alvo?.closest(".iso-plate")?.querySelector("[data-readout]");
  if (slot && slot.textContent !== texto) slot.textContent = texto;
}
