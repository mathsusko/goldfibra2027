import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3 } from "@/components/iso/iso-kit";
import * as G from "@/components/iso/lathe.mjs";
import { bancada, D, fit, L, PLATE_H, FOOT_H, S } from "./comum";

/*
 * Fig 2 · Segurança 24h.
 * Um cofre na bancada, vigiado por uma câmera num poste. O mostrador da porta
 * tem 24 divisões (uma por hora, maiores a cada 6 h) e o ponteiro dá a volta
 * completa no dia; a lâmpada de status no topo pulsa enquanto o sistema vigia.
 */

const PLATE: Plan = { x: -86, y: -58, w: 172, d: 112, r: 7 };
const SAFE: Plan = { x: -34, y: -32, w: 64, d: 60, r: 4 };
const PLINTH = k.insetPlan(SAFE, -3);
const PLINTH_H = 4;
const SAFE_TOP = 70;

const FACE_X = SAFE.x + SAFE.w; // face da frente (+x)
const DOOR: Plan = { x: FACE_X, y: -24, w: 2.4, d: 46, r: 0.8 };
const DOOR_Z = 10;
const DOOR_TOP = 62;
const DOOR_FACE = FACE_X + DOOR.w;

export const DIAL_C: Point3 = [DOOR_FACE, -1, 44];
export const DIAL_R = 10;
const BEZEL_R = 12.4;
const DIAL_S = 3.6;
export const DIAL_FACE_X = DOOR_FACE + DIAL_S;

const HANDLE_C: Point3 = [DOOR_FACE, -1, 23];

const POST: [number, number] = [-62, -46];
const POST_TOP = 90;
const CAM: Plan = { x: -66, y: -51, w: 20, d: 10, r: 2.4 };
const CAM_Z = POST_TOP;
const CAM_H = 8;

export const LAMP: Point3 = [-2, -2, SAFE_TOP];

export const P = fit(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), [LAMP[0], LAMP[1], SAFE_TOP + 9], [CAM.x, CAM.y, CAM_Z + CAM_H + 1], ...k.boxCorners(SAFE, 0, SAFE_TOP)],
  32,
);

const at = (p: Point3) => k.iso(p, P);
const onDoor = (y: number, z: number, x = DOOR_FACE): Point3 => [x + 0.05, y, z];
const poly = (pts: Point3[], closed = false) => k.pathOf(pts.map(at), closed);

function camera() {
  const [x, y] = POST;
  const out = [S(k.cylinder(x, y, 5, 0, 2, P, 28, 0.4), { tone: "lo" })];
  out.push(D([0, 1, 2].map((i) => at([x + Math.cos(i * 2.1) * 3.6, y + Math.sin(i * 2.1) * 3.6, 2])), { size: 0.4 }));
  out.push(S(k.cylinder(x, y, 2.2, 2, POST_TOP - 2, P, 20), { tone: "mid", crease: "none" }));
  out.push(L([24, 48, 72].map((z) => k.sideArc(x, y, 2.2, z, P, 12)).join(""), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 3.4, POST_TOP - 3, 3, P, 24), { tone: "mid" }));
  out.push(S(k.slabOf(CAM, CAM_Z, CAM_H, P, 4, 0.5), { tone: "hi", inner: L(k.sideSeam(CAM, CAM_Z + 2.4, P, 4), { tone: "faint" }) }));
  // capuz e lente apontando para o cofre
  const F = G.frameAlong([CAM.x + CAM.w, CAM.y + CAM.d / 2, CAM_Z + CAM_H / 2], [1, 0.45, -0.42]);
  out.push(S(G.disc(0, 2.4, 3.8, F, P), { tone: "mid" }));
  out.push(S(G.disc(2.4, 3, 2.6, F, P), { tone: "hi" }));
  out.push(L(G.circleOf(F, 3, 1.4, P), { tone: "lo" }));
  out.push(`<g class="gf-rec">${D([at([CAM.x + CAM.w - 4, CAM.y + 3, CAM_Z + CAM_H])], { size: 0.9, tone: "hi" })}</g>`);
  return out.join("");
}

function corpo() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLINTH, 0, 2, P)}"/>`];
  out.push(S(k.slabOf(PLINTH, 0, PLINTH_H, P, 6, 0.6), { tone: "lo" }));
  out.push(
    S(k.slabOf(SAFE, PLINTH_H, SAFE_TOP - PLINTH_H, P, 6, 1.2), {
      tone: "mid",
      inner: L(k.sideSeam(SAFE, PLINTH_H + 4, P, 6) + k.sideSeam(SAFE, SAFE_TOP - 4, P, 6), { tone: "faint" }),
    }),
  );
  out.push(L(k.planOutline(k.insetPlan(SAFE, 4), SAFE_TOP, P, 4), { tone: "faint" }));
  out.push(D(k.corners(SAFE, 7).map(([x, y]) => at([x, y, SAFE_TOP])), { size: 0.5 }));
  // grade de ventilação na lateral (+y), fendas fechadas
  for (let i = 0; i < 5; i++) {
    const z = 50 + i * 3;
    out.push(L(poly([[-22, SAFE.y + SAFE.d + 0.05, z], [6, SAFE.y + SAFE.d + 0.05, z], [6, SAFE.y + SAFE.d + 0.05, z + 1.1], [-22, SAFE.y + SAFE.d + 0.05, z + 1.1]], true), { tone: "lo" }));
  }
  return out.join("");
}

function porta() {
  const out: string[] = [];
  // dobradiças no lado de trás da porta
  for (const z of [16, 48]) {
    out.push(S(k.cylinder(FACE_X + 1, DOOR.y - 1.8, 1.8, z, 10, P, 16), { tone: "mid" }));
    out.push(S(k.cylinder(FACE_X + 1, DOOR.y - 1.8, 1.1, z + 10, 1.2, P, 12), { tone: "hi" }));
  }
  out.push(S(k.slabOf(DOOR, DOOR_Z, DOOR_TOP - DOOR_Z, P, 2, 0.4), { tone: "hi" }));
  // moldura rebaixada e parafusos da porta
  const y0 = DOOR.y + 3;
  const y1 = DOOR.y + DOOR.d - 3;
  out.push(L(poly([onDoor(y0, DOOR_Z + 3), onDoor(y1, DOOR_Z + 3), onDoor(y1, DOOR_TOP - 3), onDoor(y0, DOOR_TOP - 3)], true), { tone: "lo" }));
  out.push(D([onDoor(y0 + 2, DOOR_Z + 5), onDoor(y1 - 2, DOOR_Z + 5), onDoor(y0 + 2, DOOR_TOP - 5), onDoor(y1 - 2, DOOR_TOP - 5)].map(at), { size: 0.5 }));
  return out.join("");
}

function mostrador() {
  const F = G.frameAlong(DIAL_C, [1, 0, 0]);
  const out = [S(G.disc(0, 1.6, BEZEL_R, F, P), { tone: "mid" })];
  out.push(S(G.disc(1.6, DIAL_S, DIAL_R + 0.6, F, P), { tone: "hi" }));
  out.push(L(G.circleOf(F, DIAL_S, DIAL_R - 1, P), { tone: "lo" }));
  const minor: string[] = [];
  const major: string[] = [];
  for (let h = 0; h < 24; h++) {
    const a = (h / 24) * Math.PI * 2;
    const big = h % 6 === 0;
    const r0 = DIAL_R - 1 - (big ? 2.6 : 1.3);
    const p = (r: number): Point3 => [DIAL_FACE_X + 0.05, DIAL_C[1] + Math.sin(a) * r, DIAL_C[2] + Math.cos(a) * r];
    (big ? major : minor).push(k.pathOf([at(p(r0)), at(p(DIAL_R - 1))]));
  }
  out.push(L(minor.join(""), { tone: "lo" }), L(major.join(""), { tone: "mid" }));
  return out.join("");
}

export function ponteiro(horas: number) {
  const a = (horas / 24) * Math.PI * 2;
  const p = (r: number): Point3 => [DIAL_FACE_X + 0.1, DIAL_C[1] + Math.sin(a) * r, DIAL_C[2] + Math.cos(a) * r];
  return k.pathOf([at(p(-2)), at(p(DIAL_R - 2.4))]);
}

export const CUBO = (() => {
  const F = G.frameAlong(DIAL_C, [1, 0, 0]);
  return S(G.disc(DIAL_S, DIAL_S + 0.8, 1.6, F, P), { tone: "hi" });
})();

function macaneta() {
  const F = G.frameAlong(HANDLE_C, [1, 0, 0]);
  const out = [S(G.disc(0, 1.2, 5, F, P), { tone: "mid" })];
  out.push(S(G.disc(1.2, 4.4, 2.6, F, P), { tone: "hi" }));
  const bar: Plan = { x: DOOR_FACE + 3.2, y: HANDLE_C[1] - 11, w: 2.6, d: 22, r: 1.2 };
  out.push(S(k.slabOf(bar, HANDLE_C[2] - 1.3, 2.6, P, 3, 0.3), { tone: "hi" }));
  out.push(S(G.sphereOf([bar.x + 1.3, bar.y - 0.6, HANDLE_C[2]], 2.2, P), { tone: "mid" }));
  out.push(S(G.sphereOf([bar.x + 1.3, bar.y + bar.d + 0.6, HANDLE_C[2]], 2.2, P), { tone: "mid" }));
  return out.join("");
}

function lampada() {
  const [x, y, z] = LAMP;
  const out = [S(k.cylinder(x, y, 5.4, z, 1.6, P, 32, 0.4), { tone: "mid" })];
  out.push(S(k.cylinder(x, y, 4, z + 1.6, 1.4, P, 28), { tone: "hi" }));
  out.push(`<circle class="gf-lampada" cx="${at([x, y, z + 6])[0].toFixed(1)}" cy="${at([x, y, z + 6])[1].toFixed(1)}" r="7"/>`);
  out.push(S(G.sphereOf([x, y, z + 6], 3.4, P), { tone: "hi", lit: true }));
  return out.join("");
}

export const FUNDO = [bancada(PLATE, P), camera(), corpo(), porta(), mostrador()].join("");
export const FRENTE = [CUBO, macaneta(), lampada()].join("");
