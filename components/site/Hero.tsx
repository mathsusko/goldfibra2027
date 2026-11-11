"use client";

import dynamic from "next/dynamic";
import SplitReveal from "./SplitReveal";
import Crosshairs from "./Crosshairs";

const LightWave = dynamic(() => import("./LightWave"), { ssr: false });

/** Hero em tela cheia: a onda de luz ocupa toda a viewport, sobre o fundo claro do site. */
export default function Hero() {
  return (
    <section
      id="inicio"
      data-bg="#eef0f8"
      data-cursor
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-nevoa"
    >
      <LightWave />

      {/* texto em "difference": escuro sobre o fundo claro, claro quando a onda passa por trás */}
      <div className="gutter pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 pb-16 text-white mix-blend-difference md:flex-row md:items-end md:justify-between md:pb-20">
        <SplitReveal as="h1" trigger="ready" className="display max-w-[14ch] text-[clamp(2.75rem,7.4vw,7.5rem)]">
          Internet de qualidade, sem enganos.
        </SplitReveal>
        <SplitReveal as="p" trigger="ready" by="lines" delay={0.35} className="max-w-[32ch] text-base leading-relaxed md:text-lg">
          Fibra óptica em Arapongas e região, com planos para casa, empresa e condomínio.
        </SplitReveal>
      </div>

      <div className="gutter absolute inset-x-0 bottom-0">
        <Crosshairs>Role para explorar</Crosshairs>
      </div>
    </section>
  );
}
