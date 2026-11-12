"use client";

import { useEffect, useRef } from "react";
import { Facebook, Instagram, MessageCircle } from "lucide-react";
import { gsap, useGSAP, reduzido } from "@/lib/gsap";
import { FACEBOOK, INSTAGRAM, WHATSAPP, zap } from "@/lib/conteudo";
import { BotaoSeta, BotaoVidro } from "./Botoes";
import { rolarPara } from "./Rolagem";

/** Gera uma textura de ruído em tons de cinza (o "chuvisco" de TV sobre o vídeo). */
function ruido() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}

const SOCIAIS = [
  { href: INSTAGRAM, rotulo: "Instagram", Icone: Instagram },
  { href: FACEBOOK, rotulo: "Facebook", Icone: Facebook },
  { href: WHATSAPP, rotulo: "WhatsApp", Icone: MessageCircle },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const estatica = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (estatica.current) estatica.current.style.backgroundImage = `url(${ruido()})`;
    if (reduzido()) video.current?.pause();
  }, []);

  useGSAP(
    () => {
      if (reduzido()) return;
      // entrada: textos sobem em sequência
      gsap.from(".hero-entra", { y: 28, autoAlpha: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, delay: 0.15 });
      // ao rolar, o hero se dissolve para o branco do bloco seguinte
      gsap.fromTo(
        ".hero-dissolve",
        { opacity: 0, scaleY: 0.22 },
        { opacity: 1, scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } },
      );
      gsap.to(".hero-conteudo, .hero-rodape", {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="hero" data-nav="escuro" className="gutter relative flex h-[100svh] min-h-[640px] flex-col items-center justify-between overflow-hidden pb-11 pt-[30px] md:pb-[60px]">
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/reel.mp4"
        poster="/media/reel-poster.webp"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div ref={estatica} className="estatica" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(#0000_0%,#000c_46%,#000c_100%)]" />
      <div
        aria-hidden="true"
        className="hero-dissolve pointer-events-none absolute inset-0 z-[4] origin-bottom bg-[linear-gradient(rgb(255_255_255/0)_0%,#fff_100%)] opacity-0"
      />

      <div className="h-[60px] w-full" aria-hidden="true" />

      <div className="hero-conteudo relative z-[3] flex w-full flex-col items-center gap-[18px] text-center md:w-[75%] md:gap-[30px]">
        <h1 className="hero-entra titulo text-[44px] font-normal text-white md:text-[70px]">Internet de qualidade, sem enganos.</h1>
        <p className="hero-entra max-w-[340px] text-[18px] leading-[1.3] tracking-[-0.02em] text-white/80 md:max-w-[760px] md:text-[24px]">
          Fibra óptica de verdade em Arapongas e região, com Wi-Fi 6G, instalação grátis e suporte de gente que resolve.
        </p>
        <div className="hero-entra flex w-[90%] flex-col gap-3 sm:w-auto sm:flex-row">
          <BotaoSeta href={zap("Olá! Quero assinar a Goldfibra.")} className="h-[46px] w-full sm:w-auto">
            Assinar agora
          </BotaoSeta>
          <BotaoVidro
            href="#planos"
            onClick={(e) => {
              e.preventDefault();
              rolarPara("#planos");
            }}
            className="w-full sm:w-auto"
          >
            Ver planos
          </BotaoVidro>
        </div>
      </div>

      <div className="hero-entra hero-rodape relative z-[3] flex w-full flex-col items-center justify-between gap-4 md:flex-row">
        <p className="mono text-[14px] text-white/80">Internet 100% fibra, sem enganos</p>
        <div className="hidden items-center gap-3 md:flex">
          {SOCIAIS.map(({ href, rotulo, Icone }) => (
            <a
              key={rotulo}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={rotulo}
              className="grid size-8 place-items-center rounded-[6px] bg-white/[0.08] text-white backdrop-blur-[6px] transition-colors hover:bg-white/20"
            >
              <Icone className="size-[14px]" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
