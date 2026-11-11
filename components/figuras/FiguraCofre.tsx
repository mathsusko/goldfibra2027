"use client";

import { useRef } from "react";
import Cartao, { dizer, useQuadros } from "./Cartao";
import { W, H } from "./comum";
import { FRENTE, FUNDO, ponteiro } from "./cofre";

const DIA_EM_SEGUNDOS = 14; // uma volta de 24 h no mostrador leva 14 s
const hora = (h: number) => {
  const total = Math.floor(((h % 24) + 24) % 24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}h${String(total % 60).padStart(2, "0")}`;
};

/** Fig 2: o ponteiro dá a volta de 24 h; o mouse (ou as setas) percorre o dia. */
export default function FiguraCofre() {
  const stage = useRef<HTMLDivElement>(null);
  const agulha = useRef<SVGPathElement>(null);
  const s = useRef({ h: 8, alvo: 8, tour: true, parado: 0 });

  useQuadros(stage, (dt, calmo) => {
    const st = s.current;
    if (st.tour) st.alvo += (dt / DIA_EM_SEGUNDOS) * 24;
    else if ((st.parado += dt) > 4) st.tour = true;
    st.h = calmo ? st.alvo : st.h + (st.alvo - st.h) * (1 - Math.exp(-dt / 0.18));
    agulha.current?.setAttribute("d", ponteiro(st.h));
    dizer(stage.current, `Vigiando · ${hora(st.h)}`);
  });

  const irPara = (h: number) => {
    const st = s.current;
    st.tour = false;
    st.parado = 0;
    // caminho mais curto no mostrador
    const base = Math.floor(st.h / 24) * 24;
    let alvo = base + h;
    if (alvo - st.h > 12) alvo -= 24;
    if (st.h - alvo > 12) alvo += 24;
    st.alvo = alvo;
  };

  return (
    <Cartao
      fig="Fig 2"
      titulo="Cofre 24h"
      dica="Passe o mouse"
      leitura="Vigiando · 08h00"
      rotulo="Cofre com mostrador de 24 horas: setas avançam o relógio"
      stageRef={stage}
      stageProps={{
        tabIndex: 0,
        role: "group",
        onPointerMove: (e) => {
          const box = e.currentTarget.getBoundingClientRect();
          irPara(((e.clientX - box.left) / box.width) * 24);
        },
        onKeyDown: (e) => {
          const atual = ((s.current.alvo % 24) + 24) % 24;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") irPara(Math.round(atual) + 1);
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") irPara(Math.round(atual) - 1);
          else return;
          e.preventDefault();
        },
      }}
    >
      <svg
        className="iso-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Um cofre na bancada, vigiado por uma câmera num poste. A porta tem um mostrador de 24 horas cujo ponteiro dá a volta no dia, e uma lâmpada de status pulsa no topo."
      >
        <g dangerouslySetInnerHTML={{ __html: FUNDO }} />
        <path ref={agulha} className="iso-line" data-tone="lit" data-free="start" d={ponteiro(8)} style={{ strokeWidth: 1.4 }} />
        <g dangerouslySetInnerHTML={{ __html: FRENTE }} />
      </svg>
    </Cartao>
  );
}
