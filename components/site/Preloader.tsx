"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";

/** Tela de abertura: contador 000→100, logo e saída em corte diagonal. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        setDone(true);
        window.dispatchEvent(new Event("goldfibra:ready"));
        return;
      }
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";

      const state = { n: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          lenis?.start();
          setDone(true);
        },
      });

      tl.to(state, {
        n: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(state.n)).padStart(3, "0");
        },
      })
        .to(".pl-bar-fill", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0)
        .to(".pl-bar", { autoAlpha: 0, duration: 0.25 })
        .fromTo(".pl-logo", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" })
        .add(() => window.dispatchEvent(new Event("goldfibra:ready")), "+=0.15")
        .to(
          root.current,
          {
            clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
            duration: 1,
            ease: "expo.inOut",
          },
          "+=0.1",
        );
    },
    { dependencies: [lenis], scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-tinta text-papel"
      style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
    >
      <div className="pl-bar absolute left-1/2 top-1/2 h-6 w-32 -translate-x-1/2 -translate-y-1/2 bg-papel/20">
        <div className="pl-bar-fill h-full origin-left scale-x-0 bg-papel" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/header/logo.svg"
        alt=""
        width={254}
        height={32}
        className="pl-logo invisible absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 md:w-72"
      />
      <span
        ref={counter}
        className="display tabular absolute bottom-4 left-4 text-[clamp(4rem,12vw,9rem)] md:bottom-8 md:left-10"
      >
        000
      </span>
    </div>
  );
}
