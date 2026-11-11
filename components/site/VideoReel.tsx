"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Crosshairs from "./Crosshairs";
import { REEL_POSTER, REEL_VIDEO } from "@/lib/content";

/**
 * Card de vídeo que começa pequeno e inclinado e se endireita até ocupar a largura
 * conforme a rolagem. As palavras laterais se afastam do centro.
 */
export default function VideoReel() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      video.current?.pause();
      setPlaying(false);
    }
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: 1 },
      });
      tl.fromTo(
        ".reel-card",
        { scale: 0.55, rotate: -6, skewX: 8, borderRadius: "3rem" },
        { scale: 1, rotate: 0, skewX: 0, borderRadius: "1.75rem", ease: "power2.out" },
        0,
      )
        .fromTo(".reel-word-l", { xPercent: 40 }, { xPercent: 0, ease: "power2.out" }, 0)
        .fromTo(".reel-word-r", { xPercent: -40 }, { xPercent: 0, ease: "power2.out" }, 0);
    },
    { scope: root },
  );

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section ref={root} data-bg="#e4e7ff" className="gutter py-16 md:py-24">
      <Crosshairs />
      <div className="reel-card relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-tinta will-change-transform md:aspect-[16/8]">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={REEL_VIDEO ?? undefined}
          poster={REEL_POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Vídeo: a luz de um cabo de fibra óptica se espalha pelas casas de um bairro à noite"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-tinta/50 via-transparent to-tinta/20" />

        <div className="absolute inset-0 flex items-center justify-center gap-3 px-4 text-papel md:gap-8">
          <span aria-hidden="true" className="reel-word-l display text-[clamp(3rem,11vw,11rem)]">
            Fibra
          </span>
          {REEL_VIDEO ? (
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            className="grid h-14 w-24 shrink-0 place-items-center rounded-full bg-papel text-tinta transition-transform duration-300 hover:scale-105 md:h-20 md:w-32"
          >
            {playing ? <Pause className="size-5 md:size-6" /> : <Play className="size-5 md:size-6" />}
          </button>
          ) : (
            <span aria-hidden="true" className="h-14 w-24 shrink-0 rounded-full bg-papel md:h-20 md:w-32" />
          )}
          <span aria-hidden="true" className="reel-word-r display text-[clamp(3rem,11vw,11rem)]">
            pura
          </span>
        </div>
      </div>
      <Crosshairs />
    </section>
  );
}
