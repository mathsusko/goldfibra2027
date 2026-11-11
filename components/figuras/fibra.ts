import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3 } from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { bancada, byDepth, D, fit, L, PLATE_H, FOOT_H, S } from "./comum";

/*
 * Fig 1 · Internet de qualidade.
 * Uma bobina de fibra alimenta, por um cabo onde correm pulsos de luz, uma ONT
 * sobre a bancada. O medidor no topo da ONT marca a velocidade contratada:
 * 600, 800 ou 1000 Mbps, numa escala de 0 a 1000 em 270°.
 */

export const PLANOS_MBPS = [600, 800, 1000] as const;
export const ESCALA_MAX = 1000;

const PLATE: Plan = { x: -96, y: -50, w: 192, d: 100, r: 7 };

const SPOOL: [number, number] = [-54, -6];
const FLANGE_R = 24;
const HUB_R = 12;
const FLANGE_H = 3;
const HUB_TOP = FLANGE_H + 16;
const SPOOL_TOP = HUB_TOP + FLANGE_H;

const ONT: Plan = { x: 12, y: -28, w: 68, d: 46, r: 4 };
const ONT_H = 20;
export const DIAL: [number, number] = [50, -5];
export const DIAL_R = 13;
const DIAL_Z = ONT_H;
const DIAL_H = 3;
export const DIAL_TOP = DIAL_Z + DIAL_H;
export const SPAN = Math.PI * 1.5;
export const FROM = -Math.PI * 0.75;
const ANTENNAS: [number, number][] = [
  [18, -23],
  [74, -23],
];
const ANT_TOP = 46;

export const P = fit(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...ANTENNAS.map(([x, y]) => [x, y, ANT_TOP + 3] as Point3),
    [SPOOL[0], SPOOL[1], SPOOL_TOP + 4],
  ],
  40,
);

const at = (p: Point3) => k.iso(p, P);

/* ---------- bobina ---------- */
function bobinaBase() {
  const [x, y] = SPOOL;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: x - FLANGE_R, y: y - FLANGE_R, w: FLANGE_R * 2, d: FLANGE_R * 2, r: FLANGE_R }, 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.cylinder(x, y, FLANGE_R, 0, FLANGE_H, P, 64, 0.8), { tone: "mid" }));
  out.push(L(k.ring(x, y, FLANGE_R - 3, FLANGE_H, P, 64), { tone: "faint" }));
  // camadas de fibra enroladas no cubo
  const voltas = [5, 7, 9, 11, 13, 15, 17].map((z) => k.sideArc(x, y, HUB_R + 0.4, z, P, 32)).join("");
  out.push(S(k.cylinder(x, y, HUB_R, FLANGE_H, HUB_TOP - FLANGE_H, P, 48), { tone: "hi", inner: L(voltas, { tone: "lo" }) }));
  return out.join("");
}

function bobinaTopo() {
  const [x, y] = SPOOL;
  const out = [S(k.cylinder(x, y, FLANGE_R, HUB_TOP, FLANGE_H, P, 64, 0.8), { tone: "mid" })];
  out.push(L(k.ring(x, y, FLANGE_R - 3, SPOOL_TOP, P, 64), { tone: "faint" }));
  // círculo de parafusos e furos de alívio na flange
  const bolts = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return [x + Math.cos(a) * 17, y + Math.sin(a) * 17, SPOOL_TOP] as Point3;
  });
  out.push(D(bolts.map(at), { size: 0.5 }));
  for (const a of [0.4, 2.5, 4.6]) out.push(L(k.ring(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 2.6, SPOOL_TOP, P, 20), { tone: "lo" }));
  // eixo com porca serrilhada
  out.push(S(k.cylinder(x, y, 4.2, SPOOL_TOP, 3, P, 28), { tone: "mid" }));
  out.push(L(k.knurl(x, y, 4.2, SPOOL_TOP, SPOOL_TOP + 3, 22, P), { tone: "lo" }));
  out.push(S(k.cylinder(x, y, 1.6, SPOOL_TOP + 3, 2, P, 16), { tone: "hi" }));
  return out.join("");
}

/* ---------- cabo de fibra ---------- */
const PORT: Plan = { x: 24, y: ONT.y + ONT.d, w: 9, d: 3, r: 0.8 };
const PORT_Z = 5;
const PORT_H = 7;
const exitA = Math.PI * 0.04;
const ROUTE: Point3[] = G.fillet(
  [
    [SPOOL[0] + Math.cos(exitA) * HUB_R, SPOOL[1] + Math.sin(exitA) * HUB_R, 10],
    [SPOOL[0] + Math.cos(exitA) * (FLANGE_R + 4), SPOOL[1] + Math.sin(exitA) * (FLANGE_R + 4), 10],
    [SPOOL[0] + Math.cos(exitA) * (FLANGE_R + 9), SPOOL[1] + Math.sin(exitA) * (FLANGE_R + 9), 1.2],
    [-12, 6, 1.2],
    [-6, 33, 1.2],
    [PORT.x + PORT.w / 2, 33, 1.2],
    [PORT.x + PORT.w / 2, 33, PORT_Z + PORT_H / 2],
    [PORT.x + PORT.w / 2, PORT.y + PORT.d, PORT_Z + PORT_H / 2],
  ] as Point3[],
  4,
);
const SPLIT = 8; // pontos do cabo que ficam entre as flanges (desenhados antes da flange de cima)
const cabo = (pts: Point3[]) => k.pathOf(pts.map(at));
const CABO_A = cabo(ROUTE.slice(0, SPLIT));
const CABO_B = cabo(ROUTE.slice(SPLIT - 1));

function caboSvg(d: string) {
  return `<path class="gf-cabo" d="${d}"/><path class="gf-pulso" d="${d}"/>`;
}

/* ---------- ONT ---------- */
function ont() {
  const out = [`<path class="iso-halo" d="${k.haloOf(ONT, 0, 1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(k.slabOf(ONT, 0, ONT_H, P, 6, 1), { tone: "mid", inner: L(k.sideSeam(ONT, 4, P, 6), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(ONT, 3), ONT_H, P, 4), { tone: "faint" }));
  // grade de ventilação (fendas fechadas)
  for (let i = 0; i < 6; i++) out.push(L(k.planOutline({ x: 18 + i * 2.6, y: -16, w: 1.2, d: 28, r: 0.6 }, ONT_H, P, 2), { tone: "lo" }));
  out.push(D(k.corners(ONT, 6).map(([x, y]) => at([x, y, ONT_H])), { size: 0.45 }));
  // antenas atrás do medidor
  for (const [x, y] of byDepth(ANTENNAS, P)) {
    out.push(S(k.cylinder(x, y, 3.2, ONT_H, 2.4, P, 24), { tone: "mid" }));
    out.push(S(k.cylinder(x, y, 1.5, ONT_H + 2.4, ANT_TOP - ONT_H - 2.4, P, 16), { tone: "hi", crease: "none" }));
    out.push(L(k.sideArc(x, y, 1.5, ONT_H + 14, P, 10), { tone: "faint" }));
    out.push(S(k.cylinder(x, y, 2.1, ANT_TOP, 3, P, 16), { tone: "mid" }));
  }
  return out.join("");
}

/* ---------- medidor ---------- */
function medidor() {
  const [x, y] = DIAL;
  const out = [S(k.cylinder(x, y, DIAL_R + 2.4, DIAL_Z, 1.2, P, 56), { tone: "mid" })];
  out.push(S(k.cylinder(x, y, DIAL_R, DIAL_Z + 1.2, DIAL_H - 1.2, P, 64, 0.6), { tone: "hi" }));
  out.push(L(k.knurl(x, y, DIAL_R + 2.4, DIAL_Z, DIAL_Z + 1.2, 48, P, 0.2), { tone: "lo" }));
  out.push(L(k.ring(x, y, DIAL_R - 1.8, DIAL_TOP, P, 64), { tone: "lo" }));
  const t = k.radialTicks(x, y, DIAL_R - 2.4, 20, 5, DIAL_TOP, [1.4, 2.8], P, FROM, SPAN);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(k.faceTextSvg(k.topMatrix([x, y + 6.4], DIAL_TOP, P, "x"), "Mbps", { size: 2.2, tone: "lo", anchor: "middle" }));
  return out.join("");
}

export function ponteiro(mbps: number) {
  const a = FROM + (Math.min(mbps, ESCALA_MAX) / ESCALA_MAX) * SPAN;
  const [x, y] = DIAL;
  const s = Math.sin(a);
  const c = Math.cos(a);
  return k.lineOnTop([x - s * 2.6, y + c * 2.6], [x + s * (DIAL_R - 3.4), y - c * (DIAL_R - 3.4)], DIAL_TOP + 0.2, P);
}

export const CUBO_PONTEIRO = k.ring(DIAL[0], DIAL[1], 1.2, DIAL_TOP + 0.2, P, 14);

function frenteOnt() {
  const out = [S(k.slabOf(PORT, PORT_Z, PORT_H, P, 2, 0.3), { tone: "mid" })];
  out.push(L(k.sideRing([PORT.x + PORT.w / 2, PORT.y + PORT.d, PORT_Z + PORT_H / 2], 1.8, "y", P, 16), { tone: "lo" }));
  // LEDs na face da frente: o primeiro (PON) é a luz da fibra
  const leds = [44, 50, 56, 62].map((x) => at([x, ONT.y + ONT.d, 12]));
  out.push(`<g class="gf-led">${D([leds[0]], { size: 1.1, tone: "hi" })}</g>`);
  out.push(D(leds.slice(1), { size: 0.8, tone: "mid" }));
  return out.join("");
}

export const FUNDO = [bancada(PLATE, P), bobinaBase(), caboSvg(CABO_A), bobinaTopo(), ont(), medidor()].join("");
export const FRENTE = [frenteOnt(), caboSvg(CABO_B)].join("");
