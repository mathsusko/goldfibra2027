"use client";

import { useCallback, useRef } from "react";
import CardIlustrado, { dizer } from "./CardIlustrado";

const SRC = "/media/diferencial-games.webp";

// colunas de dados subindo em volta do controle (coordenadas do recorte)
const BARRAS = [
  [345, 300],
  [395, 280],
  [490, 245],
  [540, 262],
  [610, 320],
  [636, 318],
];

/** Fig 3 · Baixa latência: o controle "respira" em ciano, dados sobem em colunas; o ping oscila entre 2 e 3 ms. */
export default function CardGames() {
  const ultimo = useRef("");
  const proximo = useRef(0);

  const passo = useCallback((stage: HTMLElement, sobre: boolean) => {
    const agora = performance.now();
    if (agora < proximo.current) return;
    proximo.current = agora + (sobre ? 450 : 1400);
    const ping = sobre ? (Math.random() < 0.7 ? 2 : 3) : 2;
    const t = sobre ? `Ping · ${ping} ms` : "Latência · Mínima";
    if (t !== ultimo.current) {
      ultimo.current = t;
      dizer(stage, t);
    }
  }, []);

  return (
    <CardIlustrado
      fig="Fig 3"
      titulo="Ping reduzido"
      dica="Passe o mouse"
      leitura="Latência · Mínima"
      rotulo="Ilustração: controle de videogame com ping baixo"
      src={SRC}
      alt="Ilustração isométrica de um controle de videogame branco com brilho ciano sobre uma base, com uma etiqueta flutuante mostrando Latência Baixa, Ping 2 ms."
      onPasso={passo}
    >
      <ellipse cx={490} cy={392} rx={190} ry={118} className="gf-aura" />
      {BARRAS.map(([x, y], i) => (
        <g key={i} className="gf-dados" style={{ animationDelay: `${i * -0.42}s` }}>
          <rect x={x} y={y} width={4} height={14} rx={2} />
          <rect x={x} y={y - 22} width={4} height={8} rx={2} />
        </g>
      ))}
    </CardIlustrado>
  );
}
