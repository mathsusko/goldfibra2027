"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitReveal from "./SplitReveal";
import Crosshairs from "./Crosshairs";

const LightWave = dynamic(() => import("./LightWave"), { ssr: false });

export default function Hero() {
  const frame = useRef<HTMLDivElement>(null);

  // A moldura encolhe levemente e arredonda mais conforme a página desce, como uma janela se afastando.
  useGSAP(() => {
    gsap.to(frame.current, {
      scale: 0.94,
      borderRadius: "2.5rem",
      ease: "none",
      scrollTrigger: { trigger: frame.current, start: "top top", end: "bottom top", scrub: true },
    });
  });

  return (
    <section id="inicio" data-bg="#eef0f8" className="gutter pt-24 md:pt-28">
      <div
        ref={frame}
        data-cursor
        className="relative h-[78svh] min-h-[520px] overflow-hidden rounded-[1.75rem] bg-black will-change-transform"
      >
        <LightWave />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.7)_0%,rgb(0_0_0/0)_40%)]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-6 p-5 text-papel md:flex-row md:items-end md:justify-between md:p-10">
          <SplitReveal as="h1" trigger="ready" className="display max-w-[14ch] text-[clamp(2.75rem,7.4vw,7.5rem)]">
            Internet de qualidade, sem enganos.
          </SplitReveal>
          <SplitReveal
            as="p"
            trigger="ready"
            by="lines"
            delay={0.35}
            className="max-w-[32ch] text-base leading-relaxed text-papel/80 md:text-lg"
          >
            Fibra óptica em Arapongas e região, com planos para casa, empresa e condomínio.
          </SplitReveal>
        </div>
      </div>
      <Crosshairs>Role para explorar</Crosshairs>
    </section>
  );
}
