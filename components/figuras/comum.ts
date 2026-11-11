import * as k from "@/components/iso/iso-kit";
import type { Plan, Point3, Projection, Plane } from "@/components/iso/iso-kit";

/** Tamanho comum das três figuras (mesma escala visual no conjunto). */
export const W = 380;
export const H = 260;

export const S = k.solidSvg;
export const L = k.lineSvg;
export const D = k.dotsSvg;

export const PLATE_H = 8;
export const FOOT_H = 4;

export function byDepth(points: Plane[], P: Projection) {
  return [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
}

/**
 * Bancada comum: chapa com pés, ranhura, parafusos de canto com anel,
 * régua na borda da frente e plaqueta de identificação com três linhas.
 */
export function bancada(plate: Plan, P: Projection) {
  const at = (p: Point3) => k.iso(p, P);
  const out = [`<path class="iso-halo" d="${k.haloOf(plate, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(plate, 16), P)) {
    out.push(S(k.cylinder(x, y, 6, -PLATE_H - FOOT_H, 1.4, P, 24), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 4.6, -PLATE_H - FOOT_H + 1.4, FOOT_H - 1.4, P, 24), { tone: "mid" }));
  }
  out.push(S(k.slabOf(plate, -PLATE_H, PLATE_H, P, 8, 1.4), { tone: "mid", inner: L(k.sideSeam(plate, -PLATE_H + 2.4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(plate, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(plate, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

  // régua na borda da frente (+y)
  const strip: Plan = { x: plate.x + 18, y: plate.y + plate.d - 13, w: plate.w * 0.46, d: 6, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.x + 3, strip.x + strip.w - 3, 3, 5, strip.y + 0.6, 0.6, [1.8, 3.4], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([strip.x + 1.6, strip.y + 3, 0.6]), at([strip.x + strip.w - 1.6, strip.y + 3, 0.6])], { size: 0.45 }));

  // plaqueta de identificação
  const tag: Plan = { x: plate.x + plate.w - 44, y: plate.y + plate.d - 15, w: 30, d: 9, r: 1.2 };
  out.push(S(k.slabOf(tag, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }));
  for (const [i, len] of [0.72, 0.5, 0.62].entries()) {
    const y = tag.y + 2.4 + i * 2.2;
    out.push(L(k.lineOnTop([tag.x + 3, y], [tag.x + 3 + (tag.w - 6) * len, y], 0.8, P), { tone: "faint", free: true }));
  }
  out.push(D([at([tag.x + 1.6, tag.y + tag.d / 2, 0.8]), at([tag.x + tag.w - 1.6, tag.y + tag.d / 2, 0.8])], { size: 0.4 }));
  return out.join("");
}

export const fit = (points: Point3[], azimuth: number, pad = 14) => k.fitProjection(points, W, H, { pad, azimuth });
