"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitReveal from "./SplitReveal";
import Roll from "./Roll";
import { SEGMENTOS, WHATSAPP_URL } from "@/lib/content";

/** Lista grande de tipos de cliente; no desktop, uma imagem segue o cursor sobre a linha ativa. */
export default function Segmentos() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { contextSafe } = useGSAP({ scope: root });

  const onMove = contextSafe((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !preview.current || !root.current) return;
    const box = root.current.getBoundingClientRect();
    gsap.to(preview.current, {
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      duration: 0.6,
      ease: "power3.out",
    });
  });

  const show = contextSafe((i: number | null) => {
    setActive(i);
    gsap.to(preview.current, {
      scale: i === null ? 0.6 : 1,
      autoAlpha: i === null ? 0 : 1,
      duration: 0.45,
      ease: "power3.out",
    });
  });

  return (
    <section
      ref={root}
      id="para-quem"
      data-bg="#0e1c29"
      onPointerMove={onMove}
      onPointerLeave={() => show(null)}
      className="gutter relative scroll-mt-24 py-24 text-papel md:py-36"
    >
      <div>
        <SplitReveal className="display max-w-[14ch] text-[clamp(2.5rem,6.5vw,6.5rem)]">
          Uma conexão para cada rotina
        </SplitReveal>

        <ul className="mt-14 md:mt-20">
          {SEGMENTOS.map((s, i) => (
            <li key={s.nome} className="border-t border-papel/15 last:border-b">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => show(i)}
                onFocus={() => show(i)}
                onBlur={() => show(null)}
                className="group grid items-baseline gap-2 py-6 md:grid-cols-[1fr_auto] md:py-8"
              >
                <span
                  className={`display text-[clamp(2.5rem,7vw,6rem)] transition-colors duration-500 ${
                    active === null || active === i ? "text-papel" : "text-papel/30"
                  }`}
                >
                  <Roll>{s.nome}</Roll>
                </span>
                <span className="text-papel/70 md:text-right md:text-lg">{s.frase}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden aspect-[3/4] w-64 -translate-x-1/2 -translate-y-1/2 scale-60 overflow-hidden rounded-2xl opacity-0 md:block lg:w-80"
      >
        {SEGMENTOS.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.nome}
            src={s.imagem}
            alt=""
            width={1536}
            height={2048}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
