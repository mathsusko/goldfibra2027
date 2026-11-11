"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Pill from "./Pill";
import Roll from "./Roll";
import {
  ADDRESS_LINE_1,
  ADDRESS_LINE_2,
  CNPJ,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  MAPS_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
} from "@/lib/content";

export default function Rodape() {
  const root = useRef<HTMLElement>(null);

  // Faixa de texto gigante que corre na horizontal conforme a rolagem.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".rodape-faixa",
        { xPercent: 0 },
        {
          xPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const ano = new Date().getFullYear();

  return (
    <footer ref={root} id="contato" data-bg="#0e1c29" className="scroll-mt-24 overflow-hidden pb-8 pt-24 text-papel md:pt-36">
      <div className="gutter flex flex-col items-start gap-8">
        <p className="micro text-papel/60">Pronto para trocar de internet?</p>
        <Pill href={WHATSAPP_URL} label="Chamar no WhatsApp" tone="eletrico" className="h-14 px-7 text-sm" />
      </div>

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-12 block whitespace-nowrap md:mt-16"
        aria-label="Vamos conectar sua casa? Chamar no WhatsApp"
      >
        <span aria-hidden="true" className="rodape-faixa display inline-block text-[clamp(5rem,16vw,17rem)] leading-none">
          <Roll>Vamos conectar sua casa?</Roll>
        </span>
      </a>

      <div className="gutter mt-16 grid gap-10 border-t border-papel/15 pt-10 md:mt-24 md:grid-cols-4">
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/header/logo.svg" alt="Goldfibra" width={190} height={24} loading="lazy" className="w-44" />
          <p className="text-sm text-papel/60">Goldfibra Telecomunicações LTDA. Atendimento em Arapongas e região.</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="micro text-papel/50">Endereço</span>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="hover:text-luz">
            <address className="not-italic">
              {ADDRESS_LINE_1}
              <br />
              {ADDRESS_LINE_2}
            </address>
          </a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="micro text-papel/50">Contato</span>
          <a href={PHONE_TEL} className="tabular hover:text-luz">
            {PHONE_DISPLAY} (fixo e WhatsApp)
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-luz">
            Suporte e financeiro
          </a>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="micro text-papel/50">Redes</span>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-luz">
            Instagram
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-luz">
            Facebook
          </a>
        </div>
      </div>

      <p className="gutter mt-14 text-xs text-papel/50">
        CNPJ {CNPJ}. © {ano} Goldfibra Telecomunicações LTDA. Todos os direitos reservados.
      </p>
    </footer>
  );
}
