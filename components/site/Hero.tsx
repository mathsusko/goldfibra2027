"use client";

import { useEffect, useRef } from "react";
import SplitReveal from "./SplitReveal";
import Crosshairs from "./Crosshairs";
import Medidor, { TELA_H, TELA_W } from "./hero/Medidor";
import Icones from "./hero/Icones";
import { matrix3d, pontoCover } from "./hero/projecao";

/* cantos da tela do celular na foto original (2048 × 1536), um pouco além da borda para cobrir o arredondado */
const TELA: [[number, number], [number, number], [number, number], [number, number]] = [
  [1395, 568],
  [1630, 566],
  [1393, 1090],
  [1644, 1095],
];

/** Hero em tela cheia: foto real com um medidor de velocidade vivo na tela do celular e moedas 3D flutuando. */
export default function Hero() {
  const foto = useRef<HTMLImageElement>(null);
  const tela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = foto.current;
    const el = tela.current;
    if (!img || !el) return;
    const encaixar = () => {
      const pts = TELA.map((p) => pontoCover(img, p)) as typeof TELA;
      el.style.transform = matrix3d(TELA_W, TELA_H, pts);
      el.style.opacity = "1";
    };
    const ro = new ResizeObserver(encaixar);
    ro.observe(img);
    if (img.complete) encaixar();
    else img.addEventListener("load", encaixar, { once: true });
    return () => ro.disconnect();
  }, []);

  return (
    <section
      id="inicio"
      data-bg="#0e1c29"
      data-cursor
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-tinta"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={foto}
        src="/media/hero.webp"
        alt="Mulher sorrindo num café à noite, mostrando na tela do celular um teste de velocidade da Goldfibra"
        width={2048}
        height={1536}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[74%_40%] md:object-[60%_40%]"
      />
      <Medidor ref={tela} style={{ opacity: 0 }} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(14_28_41/0.7)_0%,rgb(14_28_41/0.15)_45%,rgb(14_28_41/0)_65%),linear-gradient(0deg,rgb(14_28_41/0.85)_0%,rgb(14_28_41/0)_42%)]"
      />

      <Icones />

      <div className="gutter pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 pb-16 text-papel md:flex-row md:items-end md:justify-between md:pb-20">
        <SplitReveal as="h1" trigger="ready" className="display max-w-[16ch] text-[clamp(2.25rem,6.4vw,6.6rem)]">
          Internet de qualidade, sem enganos.
        </SplitReveal>
        <SplitReveal as="p" trigger="ready" by="lines" delay={0.35} className="hidden max-w-[30ch] text-base leading-relaxed text-papel/85 sm:block md:text-lg">
          Fibra óptica em Arapongas e região, com planos para casa, empresa e condomínio.
        </SplitReveal>
      </div>

      <div className="gutter absolute inset-x-0 bottom-0 text-papel [&_*]:text-papel/70">
        <Crosshairs>Role para explorar</Crosshairs>
      </div>
    </section>
  );
}
