"use client";

import { useRef } from "react";
import { gsap, useGSAP, reduzido } from "@/lib/gsap";

const PARAGRAFOS = [
  "A Goldfibra leva fibra óptica de ponta a ponta até a sua casa em Arapongas.",
  "Famílias, gamers, empresas e condomínios usam a Goldfibra para navegar, jogar e trabalhar, com Wi-Fi 6G, instalação grátis e suporte sempre por perto.",
];

/**
 * Bloco fixo de tela cheia em fundo branco: enquanto a página rola, cada palavra
 * passa de cinza-claro a preto, uma depois da outra. No fim, o painel escurece
 * para emendar com a seção preta seguinte.
 */
export default function TextoRevelado() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const palavras = gsap.utils.toArray<HTMLElement>(".palavra");
      if (reduzido()) {
        gsap.set(palavras, { color: "#0c0c0c" });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          // quando o painel escurece, a barra de navegação passa a tratar o bloco como escuro
          onUpdate: (self) => {
            if (root.current) root.current.dataset.nav = self.progress > 0.9 ? "escuro" : "claro";
          },
        },
      });
      tl.fromTo(".revela-bloco", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0)
        .to(palavras, { color: "#0c0c0c", stagger: 0.7 / palavras.length, duration: 0.06, ease: "none" }, 0.06)
        .to(".revela-escuro", { opacity: 1, duration: 0.12, ease: "none" }, 0.86)
        .to(".revela-bloco", { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.88);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="claro" className="relative h-[200vh] bg-white md:h-[250vh]">
      <div className="gutter sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div aria-hidden="true" className="revela-escuro pointer-events-none absolute inset-0 bg-black opacity-0" />
        <div className="revela-bloco relative w-full md:w-[75%]">
          {PARAGRAFOS.map((p, i) => (
            <p key={i} className={`titulo text-center text-[34px] leading-[1.05] text-[#dedede] md:text-[64px] ${i ? "mt-6 md:mt-8" : ""}`}>
              {p.split(" ").map((w, j) => (
                <span key={j} className="palavra">
                  {w}{" "}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
