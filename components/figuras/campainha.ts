import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3 } from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { bancada, D, fit, L, PLATE_H, FOOT_H, S } from "./comum";

/*
 * Fig 3 · Suporte exclusivo.
 * Uma campainha de balcão: ao tocar, o êmbolo desce 3 unidades, o som se
 * espalha em anéis pela bancada e a fila de fichas de chamado anda uma casa —
 * a ficha da frente sai atendida e uma nova entra no fim do trilho.
 */

const PLATE: Plan = { x: -90, y: -54, w: 180, d: 106, r: 7 };
export const BELL: [number, number] = [-34, 4];
const BASE_R = 25;
const BASE_H = 5;
const DOME_TOP = BASE_H + 17;
const ROD_R = 1.1;
export const PRESS = 3;
const CAP_Z = DOME_TOP + 6;
const CAP_H = 2.2;

export const RING_FROM = 29;
export const RING_TO = 47;

const RAIL: Plan = { x: 12, y: -42, w: 60, d: 9, r: 1.4 };
const RAIL_H = 3.5;
export const CARD_STEP = 11;
export const CARD_X0 = 22;
export const CARDS = 5;
const CARD_H = 16;

export const P = fit([...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [BELL[0], BELL[1], CAP_Z + CAP_H + 1], [RAIL.x + RAIL.w, RAIL.y, RAIL_H + CARD_H + 1]], 40);

const at = (p: Point3) => k.iso(p, P);

function base() {
  const [x, y] = BELL;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - BASE_R, y: y - BASE_R, w: BASE_R * 2, d: BASE_R * 2, r: BASE_R }, 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.cylinder(x, y, BASE_R, 0, BASE_H, P, 72, 1), { tone: "mid", inner: L(k.sideArc(x, y, BASE_R, 1.6, P, 48), { tone: "faint" }) }));
  out.push(L(k.ring(x, y, BASE_R - 3, BASE_H, P, 72), { tone: "lo" }));
  out.push(D([0.6, 2.7, 4.8].map((a) => at([x + Math.cos(a) * 22.6, y + Math.sin(a) * 22.6, BASE_H])), { size: 0.5 }));
  return out.join("");
}

function cupula() {
  const [x, y] = BELL;
  const F = G.frameOf([x, y, BASE_H], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
  const profile = [
    [0, 20.4],
    [1.2, 20.4],
    [4, 19.4, 1],
    [8, 16.8, 1],
    [12, 12.4, 1],
    [15, 7.2, 1],
    [16.6, 2.6, 1],
    [17, 0],
  ];
  const out = [S(G.solidOf(profile, F, P), { tone: "hi", inner: L(G.arcOf(F, 1.2, 20.4, P), { tone: "faint" }) })];
  // bucha onde o êmbolo entra
  out.push(S(k.cylinder(x, y, 2.6, DOME_TOP - 0.6, 1.8, P, 20), { tone: "mid" }));
  return out.join("");
}

/** Êmbolo (haste + botão), construído em repouso e movido para baixo ao tocar. */
export const EMBOLO = (() => {
  const [x, y] = BELL;
  const out = [S(k.cylinder(x, y, ROD_R, DOME_TOP + 1.2, CAP_Z - DOME_TOP - 1.2, P, 14), { tone: "hi", crease: "none" })];
  out.push(S(k.cylinder(x, y, 4.6, CAP_Z, CAP_H, P, 32, 0.4), { tone: "hi", lit: true }));
  out.push(L(k.knurl(x, y, 4.6, CAP_Z, CAP_Z + CAP_H, 28, P, 0.2), { tone: "lo" }));
  return out.join("");
})();

function trilho() {
  const out = [S(k.slabOf({ x: RAIL.x - 3, y: RAIL.y - 2, w: 5, d: RAIL.d + 4, r: 1 }, 0, 9, P, 3, 0.4), { tone: "mid" })];
  out.push(S(k.slabOf(RAIL, 0, RAIL_H, P, 4, 0.5), { tone: "mid" }));
  out.push(L(k.lineOnTop([RAIL.x, RAIL.y + RAIL.d / 2], [RAIL.x + RAIL.w, RAIL.y + RAIL.d / 2], RAIL_H, P), { tone: "lo" }));
  const t = k.topTicks(RAIL.x + 4, RAIL.x + RAIL.w - 4, CARD_STEP / 2, 2, RAIL.y + RAIL.d - 2.2, RAIL_H, [1, 1.8], P);
  out.push(L(t.minor, { tone: "faint" }), L(t.major, { tone: "lo" }));
  out.push(D([at([RAIL.x + 2, RAIL.y + 1.6, RAIL_H]), at([RAIL.x + RAIL.w - 2, RAIL.y + 1.6, RAIL_H])], { size: 0.45 }));
  return out.join("");
}

export const BATENTE = S(k.slabOf({ x: RAIL.x + RAIL.w - 2, y: RAIL.y - 2, w: 5, d: RAIL.d + 4, r: 1 }, 0, 9, P, 3, 0.4), { tone: "mid" });

/** Uma ficha de chamado em pé no trilho, construída em x = 0 e movida ao longo de x. */
export const FICHA = (() => {
  const plan: Plan = { x: -0.8, y: RAIL.y + 0.8, w: 1.6, d: RAIL.d - 1.6, r: 0.4 };
  const z0 = RAIL_H;
  const out = [S(k.slabOf(plan, z0, CARD_H, P, 2, 0.2), { tone: "hi" })];
  const face = plan.x + plan.w + 0.05;
  const rule = (z: number, len: number) => k.pathOf([at([face, plan.y + 1.4, z]), at([face, plan.y + 1.4 + len, z])]);
  out.push(L(rule(z0 + CARD_H - 3, 5.2) + rule(z0 + CARD_H - 6, 3.6) + rule(z0 + CARD_H - 9, 4.4), { tone: "lo", free: true }));
  out.push(D([at([face, plan.y + plan.d / 2, z0 + 2.6])], { size: 0.6, tone: "mid" }));
  return out.join("");
})();

export const anel = (r: number) => k.ring(BELL[0], BELL[1], r, 0.2, P, 72);

export const FUNDO = [bancada(PLATE, P), "<g data-slot=\"aneis\"></g>"].join("");
export const CAMPAINHA = [base(), cupula()].join("");
export const TRILHO = trilho();
