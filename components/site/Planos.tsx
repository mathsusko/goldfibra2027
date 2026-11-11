"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import SplitReveal from "./SplitReveal";
import Pill from "./Pill";
import { PLANOS, WHATSAPP_URL, type Plano } from "@/lib/content";

/**
 * Planos: uma faixa curta com o título e o desconto, seguida de uma seção de tela cheia por plano.
 * Cada seção abre a moldura (de cantos arredondados até a borda da tela) ao entrar,
 * e a foto corre mais devagar que a página (parallax).
 */
export default function Planos() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray<HTMLElement>(".plano-secao").forEach((secao) => {
        const moldura = secao.querySelector(".plano-moldura");
        const foto = secao.querySelector(".plano-foto");
        const conteudo = secao.querySelectorAll(".plano-entra");

        gsap.fromTo(
          moldura,
          { clipPath: "inset(7% 2.5% 0% 2.5% round 1.75rem)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0rem)",
            ease: "none",
            scrollTrigger: { trigger: secao, start: "top bottom", end: "top top", scrub: true },
          },
        );
        gsap.fromTo(
          foto,
          { yPercent: -12 },
          { yPercent: 12, ease: "none", scrollTrigger: { trigger: secao, start: "top bottom", end: "bottom top", scrub: true } },
        );
        gsap.from(conteudo, {
          y: 60,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: secao, start: "top 55%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} id="planos" className="scroll-mt-24">
      <section data-bg="#eef0f8" className="gutter flex flex-col gap-6 pb-14 pt-24 md:flex-row md:items-end md:justify-between md:pb-20 md:pt-36">
        <SplitReveal className="display text-[clamp(3rem,9vw,9rem)]">Planos</SplitReveal>
        <p className="max-w-[30ch] text-base leading-relaxed md:pb-4 md:text-right md:text-lg">
          Pagando em dia, você ganha <strong className="font-semibold text-sinal">R$20,00 de desconto</strong> na sua
          fatura todo mês.
        </p>
      </section>

      {PLANOS.map((p) => (
        <PlanoSecao key={p.id} plano={p} />
      ))}
    </div>
  );
}

function PlanoSecao({ plano: p }: { plano: Plano }) {
  return (
    <section data-bg="#0e1c29" aria-labelledby={`plano-${p.id}`} className="plano-secao relative">
      <div className="plano-moldura relative h-[100svh] min-h-[640px] overflow-hidden bg-tinta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.imagemLarga}
          alt=""
          width={2816}
          height={1584}
          loading="lazy"
          className="plano-foto absolute inset-x-0 -top-[12%] h-[124%] w-full object-cover object-[65%_center] will-change-transform"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(14_28_41/0.88)_0%,rgb(14_28_41/0.55)_38%,rgb(14_28_41/0)_70%),linear-gradient(0deg,rgb(14_28_41/0.7)_0%,rgb(14_28_41/0)_40%)]"
        />

        <div className="gutter relative flex h-full flex-col justify-end gap-10 pb-10 pt-28 text-papel md:pb-14">
          <div className="flex flex-col gap-5">
            {p.destaque && (
              <span className="plano-entra micro self-start rounded-full bg-sinal px-3 py-1.5 font-semibold">{p.destaque}</span>
            )}
            <h3 id={`plano-${p.id}`} className="plano-entra display whitespace-nowrap text-[clamp(3.25rem,8.5vw,8.5rem)]">
              {p.nome}
            </h3>
            <p className="plano-entra max-w-[36ch] text-lg text-papel/85 md:text-xl">{p.descricao}</p>
          </div>

          <div className="flex flex-col gap-8 border-t border-papel/20 pt-8 md:flex-row md:items-end md:justify-between">
            <ul className="plano-entra flex flex-wrap gap-x-6 gap-y-2">
              {p.beneficios.map((b) => (
                <li key={b} className="micro flex items-center gap-2 text-papel/85">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-luz" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="plano-entra flex flex-wrap items-end gap-6 md:gap-10">
              <div className="flex flex-col">
                <span className="tabular text-5xl font-semibold tracking-tight md:text-6xl">R${p.preco}</span>
                <span className="text-sm text-papel/70">por mês</span>
              </div>
              <div className="flex flex-col">
                <span className="tabular text-2xl font-semibold text-luz md:text-3xl">R${p.precoEmDia}</span>
                <span className="text-sm text-papel/70">pagando em dia</span>
              </div>
              <Pill href={WHATSAPP_URL} label={`Contratar ${p.nome}`} tone="papel" className="h-14 px-7 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
