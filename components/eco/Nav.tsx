"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { MENU, zap } from "@/lib/conteudo";
import { rolarPara } from "./Rolagem";

/**
 * Barra fixa: transparente sobre o hero; depois do hero ganha um desfoque progressivo
 * (claro sobre seções claras, escuro sobre as escuras). Menus abrem num cartão branco
 * sob o item; no celular viram um painel em tela cheia.
 */
export default function Nav() {
  const [aberto, setAberto] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [claro, setClaro] = useState(false);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const atualizar = () => {
      const hero = document.getElementById("hero");
      setRolou(window.scrollY > (hero ? hero.offsetHeight - 80 : 200));
      const sob = document.elementsFromPoint(window.innerWidth / 2, 36).find((el) => el.closest("[data-nav]"));
      setClaro(sob?.closest<HTMLElement>("[data-nav]")?.dataset.nav === "claro");
    };
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    window.addEventListener("resize", atualizar);
    return () => {
      window.removeEventListener("scroll", atualizar);
      window.removeEventListener("resize", atualizar);
    };
  }, []);

  useEffect(() => {
    const fora = (e: PointerEvent) => {
      if (!nav.current?.contains(e.target as Node)) setAberto(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(null);
        setMobile(false);
      }
    };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  const solido = aberto !== null || mobile;
  const escuroTexto = solido || claro;

  const ir = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setAberto(null);
    setMobile(false);
    rolarPara(href);
  };

  return (
    <header ref={nav} className="fixed inset-x-0 top-0 z-50">
      {/* desfoque progressivo depois do hero */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[100px] transition-opacity duration-500 ${rolou && !solido ? "opacity-100" : "opacity-0"}`}
      >
        <div className="absolute inset-0 backdrop-blur-[1.5px] [mask-image:linear-gradient(#000_0%,#000_56%,transparent_94%)]" />
        <div className="absolute inset-0 backdrop-blur-[4px] [mask-image:linear-gradient(#000_0%,#000_34%,transparent_72%)]" />
        <div className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(#000_0%,#000_14%,transparent_52%)]" />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${claro ? "opacity-100" : "opacity-0"} bg-[linear-gradient(180deg,rgb(255_255_255/.74)_30%,rgb(255_255_255/.37)_70%,transparent_100%)]`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${claro ? "opacity-0" : "opacity-100"} bg-[linear-gradient(180deg,rgb(0_0_0/.55)_30%,rgb(0_0_0/.27)_70%,transparent_100%)]`}
        />
      </div>
      {/* superfície branca quando um menu está aberto */}
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-[72px] border-b border-black/5 bg-white transition-opacity duration-200 ${solido ? "opacity-100" : "opacity-0"}`} />

      <div className="gutter relative flex h-[72px] items-center justify-between">
        <div className="flex items-stretch gap-[50px] self-stretch">
          <a href="#hero" onClick={ir("#hero")} aria-label="Goldfibra, início" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/header/logo.svg"
              alt="Goldfibra"
              width={206}
              height={26}
              className={`h-[22px] w-auto md:h-[26px] transition-[filter] duration-200 ${escuroTexto ? "brightness-0" : ""}`}
            />
          </a>
          <nav aria-label="Principal" className="hidden items-stretch gap-[30px] lg:flex">
            {MENU.map((grupo, i) => (
              <div key={grupo.rotulo} className="relative flex">
                <button
                  type="button"
                  aria-expanded={aberto === i}
                  onClick={() => setAberto(aberto === i ? null : i)}
                  onMouseEnter={() => setAberto(i)}
                  className={`mono relative flex items-center gap-3 text-[14px] leading-[0.9] transition-[color,opacity] duration-200 ${
                    escuroTexto ? "text-black" : "text-white"
                  } ${aberto !== null && aberto !== i ? "opacity-50" : ""}`}
                >
                  {grupo.rotulo}
                  <ChevronDown aria-hidden="true" className={`size-3 transition-transform duration-200 ${aberto === i ? "rotate-180 opacity-100" : "opacity-50"}`} />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-px bg-black transition-opacity duration-200 ${aberto === i ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
                <div
                  onMouseLeave={() => setAberto(null)}
                  className={`absolute left-[-24px] top-[calc(100%+8px)] w-max max-w-[640px] rounded-[10px] border border-black/[0.08] bg-white p-6 shadow-[0_16px_40px_#0000001f] transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                    aberto === i ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"
                  }`}
                >
                  <p className="mono mb-5 text-[14px] leading-[0.9] text-black/50">{grupo.rotulo}</p>
                  <ul className="grid grid-cols-2 gap-x-8 gap-y-5">
                    {grupo.itens.map((item) => (
                      <li key={item.titulo}>
                        <a
                          href={item.href}
                          onClick={ir(item.href)}
                          {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="flex flex-col gap-0.5 text-black transition-opacity hover:opacity-70"
                        >
                          <span className="text-[14px] leading-[17px] tracking-[-0.02em]">{item.titulo}</span>
                          <span className="text-[12px] leading-[15px] text-black/50">{item.desc}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={zap("Olá! Quero assinar a Goldfibra.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`mono flex h-10 items-center rounded-[6px] px-3.5 text-[14px] leading-[0.9] transition-[background-color,color,opacity] duration-200 hover:opacity-85 ${
              escuroTexto ? "bg-black text-white" : "bg-white text-black"
            }`}
          >
            Assinar
          </a>
          <button
            type="button"
            aria-label={mobile ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
            className={`flex size-10 flex-col items-center justify-center gap-1.5 rounded-[6px] border lg:hidden ${escuroTexto ? "border-black/10" : "border-white/25"}`}
          >
            <span className={`h-0 w-4 border-t-2 transition-transform duration-200 ${escuroTexto ? "border-black" : "border-white"} ${mobile ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`h-0 w-4 border-t-2 transition-transform duration-200 ${escuroTexto ? "border-black" : "border-white"} ${mobile ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* menu do celular */}
      <div
        className={`gutter absolute inset-x-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto bg-white pb-10 text-black transition-[opacity,transform,visibility] duration-300 lg:hidden ${
          mobile ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {MENU.map((grupo) => (
          <details key={grupo.rotulo} className="group border-b border-black/5">
            <summary className="mono flex cursor-pointer list-none items-center justify-between py-[22px] text-[14px] leading-[0.9]">
              {grupo.rotulo}
              <ChevronDown aria-hidden="true" className="size-3 opacity-50 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="flex flex-col gap-5 pb-7">
              {grupo.itens.map((item) => (
                <li key={item.titulo}>
                  <a
                    href={item.href}
                    onClick={ir(item.href)}
                    {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex flex-col gap-0.5"
                  >
                    <span className="text-[14px]">{item.titulo}</span>
                    <span className="text-[12px] text-black/50">{item.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </header>
  );
}
