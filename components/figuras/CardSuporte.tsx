"use client";

import { useCallback, useRef } from "react";
import CardIlustrado, { Recorte, dizer } from "./CardIlustrado";

const SRC = "/media/diferencial-suporte.webp";

/** Fig 2 · Suporte exclusivo: engrenagem girando, balão de dúvida flutuando, Wi-Fi pulsando; clique chama o técnico. */
export default function CardSuporte() {
  const ate = useRef(0);
  const ultimo = useRef("");

  const ativar = useCallback((stage: HTMLElement) => {
    ate.current = performance.now() + 2600;
    stage.querySelector(".gf-balao")?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 520, easing: "cubic-bezier(.34,1.56,.64,1)" },
    );
  }, []);

  const passo = useCallback((stage: HTMLElement) => {
    const t = performance.now() < ate.current ? "Técnico a caminho" : "Técnicos online · 24h";
    if (t !== ultimo.current) {
      ultimo.current = t;
      dizer(stage, t);
    }
  }, []);

  return (
    <CardIlustrado
      fig="Fig 2"
      titulo="Suporte exclusivo"
      dica="Clique para chamar"
      leitura="Técnicos online · 24h"
      rotulo="Ilustração: técnico de suporte. Clique ou Enter para chamar."
      src={SRC}
      alt="Ilustração isométrica de um técnico de uniforme azul e capacete, com uma chave inglesa, ao lado de um poste com caixa de fibra, uma maleta de ferramentas aberta e um cone, com uma engrenagem, um balão de dúvida e um sinal de Wi-Fi flutuando."
      onAtivar={ativar}
      onPasso={passo}
    >
      <Recorte src={SRC} x={505} y={68} w={55} h={65} className="gf-gira" redondo />
      <Recorte src={SRC} x={610} y={56} w={80} h={94} className="gf-flutua gf-balao gf-atraso-1" />
      <Recorte src={SRC} x={706} y={174} w={84} h={86} className="gf-wifi" />
      <circle cx={386} cy={236} r={5} className="gf-led-pisca" />
    </CardIlustrado>
  );
}
