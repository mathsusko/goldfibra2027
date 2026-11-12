/** Homografia: leva um retângulo w×h aos quatro pontos da tela do celular (TL, TR, BL, BR). */
type P = [number, number];

const adj = (m: number[]) => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
];
const mm = (a: number[], b: number[]) => {
  const c = new Array(9).fill(0);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) c[3 * i + j] += a[3 * i + k] * b[3 * k + j];
  return c;
};
const mv = (m: number[], v: number[]) => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
];
const base = ([a, b, c, d]: P[]) => {
  const m = [a[0], b[0], c[0], a[1], b[1], c[1], 1, 1, 1];
  const v = mv(adj(m), [d[0], d[1], 1]);
  return mm(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]);
};

export function matrix3d(w: number, h: number, dst: [P, P, P, P]) {
  const s = base([[0, 0], [w, 0], [0, h], [w, h]]);
  const d = base(dst);
  const t = mm(d, adj(s)).map((x, _, arr) => x / arr[8]);
  return `matrix3d(${[t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].map((n) => +n.toFixed(8)).join(",")})`;
}

/** Converte um ponto da imagem original para px do contêiner, respeitando object-fit: cover e object-position. */
export function pontoCover(img: HTMLImageElement, [x, y]: P): P {
  const cw = img.clientWidth;
  const ch = img.clientHeight;
  const iw = img.naturalWidth || 2048;
  const ih = img.naturalHeight || 1536;
  const k = Math.max(cw / iw, ch / ih);
  const [px, py] = getComputedStyle(img)
    .objectPosition.split(" ")
    .map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
  return [x * k + (cw - iw * k) * px, y * k + (ch - ih * k) * py];
}
