"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SplitReveal from "./SplitReveal";
import Pill from "./Pill";
import { DIFERENCIAIS, WHATSAPP_URL } from "@/lib/content";
import FiguraFibra from "@/components/figuras/FiguraFibra";
import FiguraCofre from "@/components/figuras/FiguraCofre";
import FiguraCampainha from "@/components/figuras/FiguraCampainha";

const FIGURAS = [FiguraFibra, FiguraCofre, FiguraCampainha];

/** Manifesto com a "linha de fibra" que se desenha conforme a rolagem e um pulso de luz que corre por ela. */
export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const path = root.current?.querySelector<SVGPathElement>(".fiber-path");
      const pulse = root.current?.querySelector<SVGPathElement>(".fiber-pulse");
      if (!path || !pulse) return;
      const len = path.getTotalLength();
      gsap.set([path, pulse], { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(pulse, { strokeDasharray: `60 ${len}` });

      if (prefersReducedMotion()) {
        gsap.set(path, { strokeDashoffset: 0 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 30%", scrub: 1 },
      });
      tl.to(path, { strokeDashoffset: 0, ease: "none" }, 0).fromTo(
        pulse,
        { strokeDashoffset: 60 },
        { strokeDashoffset: -len, ease: "none" },
        0,
      );

      gsap.utils.toArray<HTMLElement>(".diferencial").forEach((el, i) => {
        gsap.from(el, {
          y: 70,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-bg="#eef0f8" className="gutter relative overflow-hidden py-28 md:py-40">
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 1400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          className="fiber-path"
          d="M 1500 70 C 1160 40, 930 190, 1050 330 C 1170 470, 1400 430, 1330 300 C 1260 170, 1010 330, 1500 480"
          fill="none"
          stroke="var(--eletrico)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          className="fiber-pulse"
          d="M 1500 70 C 1160 40, 930 190, 1050 330 C 1170 470, 1400 430, 1330 300 C 1260 170, 1010 330, 1500 480"
          fill="none"
          stroke="var(--luz)"
          strokeWidth="10"
          strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 10px var(--luz))" }}
        />
      </svg>

      <div className="relative">
        <SplitReveal className="display max-w-[16ch] text-[clamp(2.75rem,8vw,8.5rem)]">
          Por que escolher a Goldfibra?
        </SplitReveal>

        <div className="mt-10 flex flex-col gap-8 md:mt-14 md:flex-row md:items-end md:justify-between">
          <SplitReveal as="p" by="lines" className="max-w-[46ch] text-lg leading-relaxed md:text-xl">
            Benefícios pensados para uma experiência integrada, segura e acessível. Do primeiro contato à
            instalação, você fala com gente de Arapongas que resolve.
          </SplitReveal>
          <Pill href={WHATSAPP_URL} label="Falar com a gente" tone="papel" className="self-start md:self-auto" />
        </div>

        <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-4 lg:gap-6">
          {DIFERENCIAIS.map((d, i) => {
            const Figura = FIGURAS[i];
            return (
              <li key={d.titulo} className="diferencial flex flex-col gap-5">
                <Figura />
                <div className="flex flex-col gap-2 px-1">
                  <h3 className="text-xl font-semibold md:text-2xl">{d.titulo}</h3>
                  <p className="max-w-[40ch] text-muted-foreground">{d.texto}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
