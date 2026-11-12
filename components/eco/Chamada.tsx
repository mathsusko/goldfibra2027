"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduzido } from "@/lib/gsap";
import { TELEFONE, TELEFONE_LINK, zap } from "@/lib/conteudo";
import { BotaoSeta, BotaoVidro } from "./Botoes";

/** Cartão de chamada final ("Start building today" da eco) com a foto do bairro conectado. */
export default function Chamada() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduzido()) return;
      gsap.fromTo(
        ".chamada-foto",
        { scale: 1.15 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.from(".chamada-entra", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="escuro" className="gutter bg-black py-10 md:py-[60px]">
      <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[6px] px-5 py-16 text-center md:gap-6 md:px-10 md:py-[120px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/reel-poster.webp"
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
          className="chamada-foto absolute inset-0 h-full w-full object-cover object-top"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,rgb(0_0_0/0.25),rgb(0_0_0/0.65))]" />
        <h2 className="chamada-entra titulo relative text-[38px] text-white md:text-[50px]">Pronto para trocar de internet?</h2>
        <p className="chamada-entra relative max-w-[542px] leading-[1.3] tracking-[-0.02em] text-white/80">
          Fale com a gente no WhatsApp e agende sua instalação grátis em Arapongas e região.
        </p>
        <div className="chamada-entra relative flex w-full max-w-[320px] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <BotaoSeta tom="branco" href={zap("Olá! Quero assinar a Goldfibra.")} className="w-full sm:w-auto">
            Assinar agora
          </BotaoSeta>
          <BotaoVidro href={TELEFONE_LINK} borda className="tabular w-full sm:w-auto">
            {TELEFONE}
          </BotaoVidro>
        </div>
      </div>
    </section>
  );
}
