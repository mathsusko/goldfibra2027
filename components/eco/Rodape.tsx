"use client";

import { useState } from "react";
import { CNPJ, ENDERECO, FACEBOOK, INSTAGRAM, MAPA, MENU, TELEFONE, TELEFONE_LINK, WHATSAPP, zap } from "@/lib/conteudo";
import { rolarPara } from "./Rolagem";

const COLUNAS = [
  ...MENU.map((g) => ({ rotulo: g.rotulo, links: g.itens.map((i) => ({ texto: i.titulo, href: i.href })) })),
  {
    rotulo: "Contato",
    links: [
      { texto: TELEFONE, href: TELEFONE_LINK },
      { texto: "WhatsApp", href: WHATSAPP },
      { texto: `${ENDERECO[0]}, ${ENDERECO[1]}`, href: MAPA },
    ],
  },
  {
    rotulo: "Social",
    links: [
      { texto: "Instagram", href: INSTAGRAM },
      { texto: "Facebook", href: FACEBOOK },
    ],
  },
];

/** Rodapé preto: chamada com campo que abre o WhatsApp, colunas de links e linha final. */
export default function Rodape() {
  const [nome, setNome] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const quem = nome.trim();
    window.open(zap(quem ? `Olá! Meu nome é ${quem} e quero assinar a Goldfibra.` : "Olá! Quero assinar a Goldfibra."), "_blank", "noopener");
  };

  return (
    <footer data-nav="escuro" className="bg-black">
      <div className="gutter border-b border-[#171717] py-12 md:py-[60px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:flex-wrap lg:gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-7 lg:min-w-[320px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/header/logo.svg" alt="Goldfibra" width={127} height={16} loading="lazy" className="h-4 w-auto self-start" />
            <div className="flex max-w-[440px] flex-col gap-4">
              <p className="text-[24px] leading-[1.2] tracking-[-0.03em] text-white">
                Fale com a Goldfibra
                <br />e assine em poucos minutos
              </p>
              <form onSubmit={enviar} className="flex h-[60px] max-w-[420px] items-center gap-2.5 rounded-[6px] bg-[#161616] pl-5 pr-3">
                <label htmlFor="rodape-nome" className="sr-only">
                  Seu nome
                </label>
                <input
                  id="rodape-nome"
                  name="nome"
                  autoComplete="name"
                  placeholder="Seu nome…"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-[16px] tracking-[-0.02em] text-white outline-none placeholder:text-[#868686]"
                />
                <button type="submit" className="mono h-10 rounded-[6px] bg-white px-3.5 text-[14px] leading-[0.9] text-black shadow-[inset_0_4px_4px_#ffffff1f] transition-opacity hover:opacity-85">
                  Chamar no WhatsApp
                </button>
              </form>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:min-w-[640px] lg:max-w-[760px] lg:gap-x-16 lg:gap-y-11">
            {COLUNAS.map((c) => (
              <div key={c.rotulo} className="apagaveis flex flex-col gap-4">
                <p className="mono text-[14px] text-[#7c7c7c]">{c.rotulo}</p>
                <ul className="flex flex-col gap-2.5">
                  {c.links.map((l) => (
                    <li key={l.texto}>
                      <a
                        href={l.href}
                        onClick={(e) => {
                          if (l.href.startsWith("#")) {
                            e.preventDefault();
                            rolarPara(l.href);
                          }
                        }}
                        {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[14px] leading-[1.3] tracking-[-0.02em] text-white"
                      >
                        {l.texto}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="gutter flex flex-col gap-4 py-5 text-[14px] tracking-[-0.02em] text-[#7c7c7c] md:flex-row md:items-center md:justify-between md:py-6">
        <p>© {new Date().getFullYear()} Goldfibra Telecomunicações LTDA. Todos os direitos reservados.</p>
        <p className="tabular">CNPJ {CNPJ}</p>
      </div>
    </footer>
  );
}
