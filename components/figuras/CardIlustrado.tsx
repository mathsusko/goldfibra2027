"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Cartao, { dizer } from "./Cartao";

/** Área da ilustração (recorte das referências, em px da imagem). */
export const VW = 984;
export const VH = 680;

type Props = {
  fig: string;
  titulo: string;
  dica: string;
  leitura: string;
  rotulo: string;
  src: string;
  alt: string;
  /** Camadas animadas desenhadas por cima da arte, no mesmo sistema de coordenadas (VW × VH). */
  children?: ReactNode;
  onAtivar?: (stage: HTMLElement) => void;
  onPasso?: (stage: HTMLElement, sobre: boolean) => void;
};

/**
 * Card com a ilustração isométrica e animações por cima. O conjunto inclina em 3D seguindo
 * o cursor; cada card acrescenta suas camadas (luz, pulsos, ícones flutuando).
 */
export default function CardIlustrado({ fig, titulo, dica, leitura, rotulo, src, alt, children, onAtivar, onPasso }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const cena = useRef<HTMLDivElement>(null);
  const alvo = useRef({ x: 0, y: 0, sobre: false });

  useEffect(() => {
    const el = stage.current;
    const inner = cena.current;
    if (!el || !inner) return;
    const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calmo) return;
    let raf = 0;
    const atual = { x: 0, y: 0 };
    const loop = () => {
      const a = alvo.current;
      atual.x += (a.x - atual.x) * 0.08;
      atual.y += (a.y - atual.y) * 0.08;
      inner.style.transform = `rotateX(${(-atual.y * 6).toFixed(2)}deg) rotateY(${(atual.x * 8).toFixed(2)}deg) scale(${1 + (a.sobre ? 0.02 : 0)})`;
      onPasso?.(el, a.sobre);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
      if (!e.isIntersecting) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [onPasso]);

  return (
    <Cartao
      fig={fig}
      titulo={titulo}
      dica={dica}
      leitura={leitura}
      rotulo={rotulo}
      stageRef={stage}
      stageProps={{
        tabIndex: 0,
        role: onAtivar ? "button" : "group",
        style: { perspective: "900px", cursor: onAtivar ? "pointer" : undefined },
        onPointerMove: (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          alvo.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5, sobre: true };
        },
        onPointerLeave: () => {
          alvo.current = { x: 0, y: 0, sobre: false };
        },
        onClick: (e) => onAtivar?.(e.currentTarget),
        onKeyDown: (e) => {
          if (!onAtivar || (e.key !== "Enter" && e.key !== " ")) return;
          e.preventDefault();
          onAtivar(e.currentTarget);
        },
      }}
    >
      <div ref={cena} className="gf-cena relative" style={{ transformStyle: "preserve-3d", willChange: "transform" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={VW} height={VH} loading="lazy" className="block h-auto w-full select-none" draggable={false} />
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          {children}
          {/* esconde a borda do card original que ficou nas laterais do recorte */}
          <rect x={0} y={0} width={18} height={VH} fill="#fff" />
          <rect x={VW - 18} y={0} width={18} height={VH} fill="#fff" />
        </svg>
      </div>
    </Cartao>
  );
}

/**
 * Recorte da própria arte que se move sozinho: cobre o lugar original com branco
 * (o fundo da ilustração é branco puro) e desenha o mesmo pedaço por cima, animado.
 */
export function Recorte({
  src,
  x,
  y,
  w,
  h,
  className,
  redondo = false,
}: {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  className: string;
  redondo?: boolean;
}) {
  const id = `rc-${x}-${y}-${w}-${h}`;
  return (
    <>
      {redondo ? (
        <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 2} fill="#fff" />
      ) : (
        <rect x={x} y={y} width={w} height={h} fill="#fff" />
      )}
      <g className={className} style={{ transformBox: "view-box", transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}>
        <clipPath id={id}>
          {redondo ? <circle cx={x + w / 2} cy={y + h / 2} r={Math.min(w, h) / 2} /> : <rect x={x} y={y} width={w} height={h} />}
        </clipPath>
        <image href={src} x={0} y={0} width={VW} height={VH} clipPath={`url(#${id})`} />
      </g>
    </>
  );
}

export { dizer };
