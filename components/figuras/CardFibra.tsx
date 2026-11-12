"use client";

import { useCallback, useRef } from "react";
import CardIlustrado, { Recorte, dizer } from "./CardIlustrado";

const SRC = "/media/diferencial-fibra.webp";

// coordenadas no recorte da ilustração (984 × 680)
const FIBRA = { de: [792, 220], para: [540, 352] } as const;
const LEDS = [
  [411, 395],
  [430, 406],
  [448.5, 416.5],
  [466.5, 427],
];

/** Fig 1 · Internet Fibra Óptica: luz correndo pela fibra até o roteador, Wi-Fi pulsando, LEDs e ícones flutuando. */
export default function CardFibra() {
  const ultimo = useRef("");
  const passo = useCallback((stage: HTMLElement, sobre: boolean) => {
    const t = sobre ? "Download · 1 Giga" : "Conectado · 100%";
    if (t !== ultimo.current) {
      ultimo.current = t;
      dizer(stage, t);
    }
  }, []);

  const [x1, y1] = FIBRA.de;
  const [x2, y2] = FIBRA.para;
  const fios = [-7, -2.5, 2.5, 7];

  return (
    <CardIlustrado
      fig="Fig 1"
      titulo="Fibra óptica"
      dica="Passe o mouse"
      leitura="Conectado · 100%"
      rotulo="Ilustração: fibra óptica chegando ao roteador"
      src={SRC}
      alt="Ilustração isométrica de um roteador Wi-Fi com duas antenas recebendo um cabo de fibra óptica com luz azul, cercado por ícones de Wi-Fi, upload, download e nuvem e por um celular, um notebook e um mouse conectados."
      onPasso={passo}
    >
      {/* ícones flutuando */}
      <Recorte src={SRC} x={248} y={58} w={74} h={102} className="gf-flutua" />
      <Recorte src={SRC} x={373} y={69} w={72} h={102} className="gf-flutua gf-atraso-1" />
      <Recorte src={SRC} x={540} y={88} w={88} h={76} className="gf-flutua gf-atraso-2" />
      <Recorte src={SRC} x={163} y={231} w={73} h={103} className="gf-flutua gf-atraso-3" />

      {/* ondas de Wi-Fi pulsando */}
      <Recorte src={SRC} x={498} y={196} w={112} h={108} className="gf-wifi" />

      {/* pulsos de luz descendo a fibra até o roteador */}
      <g className="gf-fibra-luz">
        {fios.map((d, i) => (
          <line
            key={i}
            x1={x1 + d * 0.45}
            y1={y1 + d}
            x2={x2 + d * 0.45}
            y2={y2 + d}
            style={{ animationDelay: `${i * -0.35}s` }}
          />
        ))}
      </g>

      {/* LEDs do roteador */}
      {LEDS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={4.2} className="gf-led-pisca" style={{ animationDelay: `${i * 0.27}s` }} />
      ))}
      <ellipse cx={482.5} cy={477.5} rx={9} ry={6} className="gf-botao" />
    </CardIlustrado>
  );
}
