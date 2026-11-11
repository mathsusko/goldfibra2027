"use client";

import { ScrollTrigger, useGSAP } from "@/lib/gsap";

const DARK = new Set(["#0e1c29"]);

/**
 * Troca suave da cor de fundo da página conforme a seção que chega perto do centro
 * da tela (atributo data-bg). Marca data-tone="dark" no <html> para o header se adaptar.
 */
export default function BackgroundShift() {
  useGSAP(() => {
    const root = document.documentElement;
    document.querySelectorAll<HTMLElement>("[data-bg]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 70%",
        onToggle: (self) => {
          if (!self.isActive) return;
          const bg = section.dataset.bg ?? "";
          root.style.setProperty("--page-bg", bg);
          root.dataset.tone = DARK.has(bg) ? "dark" : "light";
        },
      });
    });
  });
  return null;
}
