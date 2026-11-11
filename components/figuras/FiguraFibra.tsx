"use client";

import { useRef } from "react";
import Cartao, { dizer, useQuadros } from "./Cartao";
import { W, H } from "./comum";
import { CUBO_PONTEIRO, FRENTE, FUNDO, PLANOS_MBPS, ponteiro } from "./fibra";

const texto = (mbps: number) => `${mbps === 1000 ? "1 Giga" : `${mbps} Mega`} · estável`;

/** Fig 1: o ponteiro do medidor segue o plano escolhido (mouse ou setas); sem interação, percorre os três. */
export default function FiguraFibra() {
  const stage = useRef<HTMLDivElement>(null);
  const agulha = useRef<SVGPathElement>(null);
  const s = useRef({ alvo: 0, at: PLANOS_MBPS[0] as number, vel: 0, tour: true, relogio: 0, parado: 0 });

  useQuadros(stage, (dt, calmo) => {
    const st = s.current;
    if (st.tour) {
      st.relogio += dt;
      st.alvo = Math.floor(st.relogio / 2.6) % PLANOS_MBPS.length;
    } else if ((st.parado += dt) > 4) {
      st.tour = true;
      st.relogio = st.alvo * 2.6;
    }
    const want = PLANOS_MBPS[st.alvo];
    if (calmo) {
      st.at = want;
      st.vel = 0;
    } else {
      for (let i = 0; i < 4; i++) {
        st.vel += ((want - st.at) * 90 - st.vel * 11) * (dt / 4);
        st.at += st.vel * (dt / 4);
      }
    }
    agulha.current?.setAttribute("d", ponteiro(st.at));
    dizer(stage.current, texto(want));
    stage.current?.setAttribute("aria-valuenow", String(want));
  });

  const escolher = (i: number) => {
    const st = s.current;
    st.tour = false;
    st.parado = 0;
    st.alvo = Math.max(0, Math.min(PLANOS_MBPS.length - 1, i));
  };

  return (
    <Cartao
      fig="Fig 1"
      titulo="Medidor de fibra"
      dica="Passe o mouse"
      leitura={texto(PLANOS_MBPS[0])}
      rotulo="Medidor de fibra: setas escolhem o plano"
      stageRef={stage}
      stageProps={{
        tabIndex: 0,
        role: "slider",
        "aria-valuemin": 600,
        "aria-valuemax": 1000,
        "aria-valuenow": 600,
        onPointerMove: (e) => {
          const box = e.currentTarget.getBoundingClientRect();
          escolher(Math.floor(((e.clientX - box.left) / box.width) * PLANOS_MBPS.length));
        },
        onKeyDown: (e) => {
          const atual = s.current.alvo;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") escolher(atual + 1);
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") escolher(atual - 1);
          else return;
          e.preventDefault();
        },
      }}
    >
      <svg
        className="iso-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Uma bobina de fibra óptica ligada por um cabo, onde correm pulsos de luz, a uma ONT com antenas. No topo da ONT, um medidor de 0 a 1000 Mbps marca a velocidade do plano."
      >
        <g dangerouslySetInnerHTML={{ __html: FUNDO }} />
        <path ref={agulha} className="iso-line" data-tone="lit" data-free="start" d={ponteiro(PLANOS_MBPS[0])} style={{ strokeWidth: 1.4 }} />
        <path className="iso-line" data-tone="lit" d={CUBO_PONTEIRO} />
        <g dangerouslySetInnerHTML={{ __html: FRENTE }} />
      </svg>
    </Cartao>
  );
}
