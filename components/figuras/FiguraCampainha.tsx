"use client";

import { useRef } from "react";
import { translateAlong } from "@/components/iso/iso-kit";
import Cartao, { dizer, useQuadros } from "./Cartao";
import { W, H } from "./comum";
import { anel, BATENTE, CAMPAINHA, CARD_STEP, CARD_X0, CARDS, EMBOLO, FICHA, FUNDO, P, PRESS, RING_FROM, RING_TO, TRILHO } from "./campainha";

const ANEIS = 3;
const ciclo = 3.4; // segundos entre toques automáticos

/**
 * Fig 3: tocar a campainha (clique, Enter ou espaço; sozinha a cada 3,4 s) afunda o êmbolo,
 * solta três anéis de som pela bancada e anda a fila de fichas: a da frente sai atendida.
 */
export default function FiguraCampainha() {
  const stage = useRef<HTMLDivElement>(null);
  const embolo = useRef<SVGGElement>(null);
  const aneis = useRef<(SVGPathElement | null)[]>([]);
  const fichas = useRef<(SVGGElement | null)[]>([]);
  const s = useRef({ t: 99, desde: 0, chamado: 23, auto: 0 });

  const tocar = () => {
    const st = s.current;
    if (st.t < 1.1) return;
    st.t = 0;
    st.chamado += 1;
  };

  useQuadros(stage, (dt, calmo) => {
    const st = s.current;
    st.auto += dt;
    if (st.auto > ciclo) {
      st.auto = 0;
      tocar();
    }
    st.t += dt;
    const t = st.t;

    // êmbolo: desce rápido, volta com mola
    const press = t < 0.08 ? t / 0.08 : Math.max(0, Math.exp(-(t - 0.08) * 9) * Math.cos((t - 0.08) * 14));
    embolo.current?.setAttribute("transform", translateAlong(P, [0, 0, -PRESS * (calmo ? 0 : press)]));

    // anéis: cada um nasce 0,12 s depois do anterior e some antes da borda da bancada
    aneis.current.forEach((el, i) => {
      if (!el) return;
      const u = (t - i * 0.12) / 1.3;
      if (calmo || u < 0 || u > 1) {
        el.setAttribute("opacity", "0");
        return;
      }
      el.setAttribute("d", anel(RING_FROM + (RING_TO - RING_FROM) * u));
      el.setAttribute("opacity", (Math.sin(u * Math.PI) * 0.9).toFixed(3));
    });

    // fila de fichas: anda uma casa entre 0,15 s e 0,9 s depois do toque
    const v = calmo ? 1 : Math.min(1, Math.max(0, (t - 0.15) / 0.75));
    const e = v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
    fichas.current.forEach((el, i) => {
      if (!el) return;
      let x = CARD_X0 + i * CARD_STEP - CARD_STEP * e;
      let z = 0;
      let alpha = 1;
      if (i === 0) {
        // a ficha da frente sobe e sai: atendida
        x = CARD_X0;
        z = 14 * e;
        alpha = 1 - e;
      }
      if (i === CARDS - 1) alpha = Math.min(1, e * 1.4 + (t > 5 ? 1 : 0));
      el.setAttribute("transform", translateAlong(P, [x, 0, z]));
      el.setAttribute("opacity", alpha.toFixed(3));
    });

    dizer(stage.current, t < 1.4 ? `Chamado #${st.chamado} · atendido` : `Fila · ${CARDS - 1} chamados`);
  });

  return (
    <Cartao
      fig="Fig 3"
      titulo="Campainha de suporte"
      dica="Clique para tocar"
      leitura={`Fila · ${CARDS - 1} chamados`}
      rotulo="Campainha de suporte: clique, Enter ou espaço para tocar"
      stageRef={stage}
      stageProps={{
        tabIndex: 0,
        role: "button",
        onClick: () => {
          s.current.auto = 0;
          tocar();
        },
        onKeyDown: (e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          s.current.auto = 0;
          tocar();
        },
        style: { cursor: "pointer" },
      }}
    >
      <svg
        className="iso-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Uma campainha de balcão ao lado de um trilho com fichas de chamado. Ao tocar, o som se espalha em anéis e a fila anda: a ficha da frente sai atendida."
      >
        <g dangerouslySetInnerHTML={{ __html: FUNDO }} />
        {Array.from({ length: ANEIS }, (_, i) => (
          <path
            key={i}
            ref={(el) => {
              aneis.current[i] = el;
            }}
            className="gf-anel"
            opacity={0}
            d=""
          />
        ))}
        <g dangerouslySetInnerHTML={{ __html: CAMPAINHA }} />
        <g
          ref={embolo}
          dangerouslySetInnerHTML={{ __html: EMBOLO }}
        />
        <g dangerouslySetInnerHTML={{ __html: TRILHO }} />
        {Array.from({ length: CARDS }, (_, i) => (
          <g
            key={i}
            ref={(el) => {
              fichas.current[i] = el;
            }}
            transform={translateAlong(P, [CARD_X0 + i * CARD_STEP, 0, 0])}
            opacity={i === CARDS - 1 ? 1 : 1}
            dangerouslySetInnerHTML={{ __html: FICHA }}
          />
        ))}
        <g dangerouslySetInnerHTML={{ __html: BATENTE }} />
      </svg>
    </Cartao>
  );
}
