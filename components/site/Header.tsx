"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";
import Pill from "./Pill";
import Roll from "./Roll";
import { ADDRESS_LINE_1, ADDRESS_LINE_2, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from "@/lib/content";

const LINKS = [
  { href: "#inicio", label: "Início" },
  { href: "#planos", label: "Planos" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!menu.current) return;
      if (open) {
        gsap.set(menu.current, { display: "flex" });
        gsap.fromTo(
          menu.current,
          { clipPath: "inset(0% 0% 100% 0% round 1.5rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 1.5rem)", duration: 0.7, ease: "expo.out" },
        );
        gsap.fromTo(
          ".menu-link",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.05, delay: 0.1 },
        );
      } else {
        gsap.to(menu.current, {
          clipPath: "inset(0% 0% 100% 0% round 1.5rem)",
          duration: 0.5,
          ease: "expo.in",
          onComplete: () => {
            if (menu.current) gsap.set(menu.current, { display: "none" });
          },
        });
      }
    },
    { dependencies: [open], scope: menu },
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const go = (href: string) => {
    setOpen(false);
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -24, duration: 1.4 });
    else target.scrollIntoView();
  };

  return (
    <header className="gutter fixed inset-x-0 top-0 z-50 flex items-center justify-between py-5 md:py-7">
      <a href="#inicio" onClick={(e) => (e.preventDefault(), go("#inicio"))} aria-label="Goldfibra, voltar ao início">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/header/logo.svg" alt="Goldfibra" width={190} height={24} className="w-36 brightness-0 transition-[filter] duration-500 in-data-[tone=dark]:brightness-100 md:w-48" />
      </a>

      <nav className="flex items-center gap-2" aria-label="Principal">
        <Pill href={WHATSAPP_URL} label="Assinar" className="hidden transition-colors duration-500 in-data-[tone=dark]:bg-eletrico sm:inline-flex" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-principal"
          className="group inline-flex h-11 items-center gap-3 rounded-full bg-papel/80 px-5 text-[0.8125rem] font-semibold uppercase tracking-wide text-tinta backdrop-blur transition-transform duration-300 hover:scale-[1.03]"
        >
          <Roll>{open ? "Fechar" : "Menu"}</Roll>
          <span aria-hidden="true" className="flex gap-0.5">
            <span className={`size-1.5 rounded-full bg-tinta transition-transform duration-300 ${open ? "translate-x-1" : ""}`} />
            <span className={`size-1.5 rounded-full bg-tinta transition-transform duration-300 ${open ? "-translate-x-1" : ""}`} />
          </span>
        </button>
      </nav>

      <div
        ref={menu}
        id="menu-principal"
        className="absolute right-4 top-20 hidden w-[min(26rem,calc(100vw-2rem))] flex-col gap-8 rounded-3xl bg-papel p-6 shadow-[0_30px_80px_-30px_rgb(14_28_41/0.45)] md:right-10 md:top-24 md:p-8"
      >
        <ul className="flex flex-col gap-1">
          {LINKS.map((link) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => (e.preventDefault(), go(link.href))}
                className="menu-link group display flex items-center justify-between py-1 text-4xl md:text-5xl"
              >
                <Roll>{link.label}</Roll>
                <span aria-hidden="true" className="size-2 rounded-full bg-eletrico opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t pt-5 text-sm">
          <a href={PHONE_TEL} className="font-semibold tabular hover:text-eletrico">
            {PHONE_DISPLAY}
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-eletrico">
            {ADDRESS_LINE_1}, {ADDRESS_LINE_2}
          </a>
        </div>
        <Pill href={WHATSAPP_URL} label="Falar no WhatsApp" tone="eletrico" className="self-start sm:hidden" />
      </div>
    </header>
  );
}
