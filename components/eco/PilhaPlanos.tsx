"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduzido } from "@/lib/gsap";
import { PLANOS, zap, type Plano } from "@/lib/conteudo";
import { BotaoSeta } from "./Botoes";

/** Elipses concêntricas e eixos: a moldura decorativa acima e abaixo da pilha. */
function Elipses({ invertido = false }: { invertido?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1674 821"
      className={`pointer-events-none absolute left-1/2 top-0 h-[821px] w-[1674px] -translate-x-1/2 ${invertido ? "rotate-180" : ""}`}
    >
      <g fill="none" stroke="#212121">
        <ellipse cx="837" cy="410" rx="837" ry="410" />
        <ellipse cx="837" cy="410" rx="529" ry="410" />
        <ellipse cx="837" cy="410" rx="346" ry="410" />
        <ellipse cx="837" cy="410" rx="209" ry="410" />
        <path d="M837 0V821M1388 100H285" />
      </g>
    </svg>
  );
}

function Lateral({ className = "" }: { className?: string }) {
  return <div className={`w-[20px] shrink-0 border-[#212121] md:w-[60px] ${className}`} />;
}

function CartaoPlano({ p, i }: { p: Plano; i: number }) {
  const imagemPrimeiro = i % 2 === 1;
  return (
    <article
      id={`plano-${p.id}`}
      className="cartao flex h-full scroll-mt-24 flex-col bg-black md:flex-row"
      aria-labelledby={`plano-${p.id}-titulo`}
    >
      <div className={`flex flex-1 flex-col justify-between gap-8 p-6 md:p-10 ${imagemPrimeiro ? "md:order-2" : ""}`}>
        <div className="flex flex-col gap-3">
          {p.selo && <span className="mono w-fit rounded-[4px] bg-white/10 px-2 py-1 text-[11px] text-white/80">{p.selo}</span>}
          <h3 id={`plano-${p.id}-titulo`} className="text-[30px] tracking-[-0.02em] text-white md:text-[38px]">
            {p.nome}
          </h3>
          {p.texto.map((t) => (
            <p key={t} className="max-w-[46ch] tracking-[-0.02em] text-[#999]">
              {t}
            </p>
          ))}
          <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="tabular text-[28px] tracking-[-0.03em] text-white">R${p.preco}</span>
            <span className="text-[#999]">/mês</span>
            <span className="tabular text-[#999]">· R${p.precoEmDia} pagando em dia</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BotaoSeta href={zap(`Olá! Quero contratar o plano ${p.nome}.`)}>Contratar</BotaoSeta>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2">
            {p.beneficios.map((b) => (
              <li key={b} className="mono text-[12px] text-white/60">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={`flex-1 p-3 md:p-5 ${imagemPrimeiro ? "md:order-1 md:pr-0" : "md:pl-0"}`}>
        <a
          href={zap(`Olá! Quero contratar o plano ${p.nome}.`)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          className="relative block aspect-[16/10] h-full w-full overflow-hidden rounded-[6px] md:aspect-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.imagem}
            alt=""
            width={2560}
            height={1440}
            loading="lazy"
            className="cartao-foto absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.03]"
          />
        </a>
      </div>
    </article>
  );
}

/**
 * "Move Money Smarter" à moda Goldfibra: título fixo e uma moldura de linhas; no desktop
 * a seção fica presa enquanto cada plano sobe por cima do anterior, revelado por um recorte.
 */
export default function PilhaPlanos() {
  const root = useRef<HTMLElement>(null);
  const palco = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduzido()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 810px)", () => {
        const camadas = gsap.utils.toArray<HTMLElement>(".camada");
        // estado inicial das camadas de cima: abaixo da moldura e recortadas (o opacity-0 do CSS só evita o piscar antes do JS)
        gsap.set(camadas.slice(1), { opacity: 1, yPercent: 100, clipPath: "inset(0% 0% 100% 0%)" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: palco.current,
            start: "top 72px",
            end: `+=${(camadas.length - 1) * 110}%`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
        camadas.slice(1).forEach((c, k) => {
          const anterior = camadas[k];
          tl.fromTo(
            c,
            { yPercent: 100, clipPath: "inset(0% 0% 100% 0%)", immediateRender: false },
            { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)", ease: "power1.inOut", duration: 1 },
          ).to(anterior.querySelector(".cartao"), { opacity: 0.35, scale: 0.97, ease: "none", duration: 1 }, "<");
          tl.to({}, { duration: 0.25 });
        });
      });
      gsap.from(".pilha-cabeca > *", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="planos" data-nav="escuro" className="relative z-[1] bg-black pt-[112px] md:pt-[140px]">
      <div ref={palco} className="bg-black">
        <div className="pilha-cabeca gutter flex flex-col items-center gap-3 pb-10 pt-6 text-center">
          <p className="mono text-[14px] leading-[0.9] text-white/80 md:text-[18px]">Internet 100% fibra para cada rotina</p>
          <h2 className="titulo text-[40px] text-white md:text-[55px]">Escolha seu plano</h2>
          <p className="max-w-[44ch] text-[15px] tracking-[-0.02em] text-[#999]">
            Pagando em dia, você ganha R$20,00 de desconto na sua fatura todo mês.
          </p>
        </div>

        <div className="flex w-full">
          <Lateral className="border-y" />
          <div className="relative h-[70px] flex-1 overflow-hidden border border-[#212121] md:h-[100px]">
            <Elipses />
          </div>
          <Lateral className="border-y" />
        </div>

        <div className="flex w-full">
          <Lateral className="border-b" />
          <div className="relative flex-1 border-x border-b border-[#212121] md:h-[min(460px,calc(100svh-400px))] md:min-h-[400px] md:overflow-hidden">
            {PLANOS.map((p, i) => (
              <div
                key={p.id}
                className={`camada border-[#212121] bg-black max-md:border-t max-md:first:border-t-0 md:absolute md:inset-0 ${i ? "md:opacity-0" : ""}`}
                style={{ zIndex: i + 1 }}
              >
                <CartaoPlano p={p} i={i} />
              </div>
            ))}
          </div>
          <Lateral className="border-b" />
        </div>

        <div className="flex w-full">
          <Lateral className="border-b" />
          <div className="relative h-[70px] flex-1 overflow-hidden border-x border-b border-[#212121] md:h-[100px]">
            <div className="absolute inset-x-0 bottom-0 h-[821px]">
              <Elipses invertido />
            </div>
          </div>
          <Lateral className="border-b" />
        </div>
      </div>
    </section>
  );
}
