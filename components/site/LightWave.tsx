"use client";

import { useEffect, useRef } from "react";

/*
 * Onda de luz com aberração cromática, a partir do "GLSL Sample027" de Yuki
 * (https://codepen.io/yukiloz7/pen/yLgYpWM, licença MIT dos pens públicos do CodePen).
 * O shader original é mantido (três senoides R, G, B com distorção radial) e ganha
 * interação: a onda é puxada até o cursor, a separação das cores cresce com a
 * velocidade do mouse e a luz fica mais forte perto dele.
 */

const VERT = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float xScale;
uniform float yScale;
uniform float distortion;
uniform vec2 mouse;     // posição do cursor no mesmo espaço de p
uniform float pull;     // 0..1: quanto a onda é atraída para o cursor
uniform float glow;     // 0..1: brilho extra perto do cursor

float wave(float x) {
  float base = -sin((x + time) * xScale) * yScale;
  float reach = exp(-pow(x - mouse.x, 2.0) * 3.0) * pull;
  return mix(base, mouse.y, reach);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float d = length(p) * distortion;

  float rx = p.x * (1.0 + d);
  float gx = p.x;
  float bx = p.x * (1.0 - d);

  float near = 1.0 + glow * 0.6 * exp(-dot(p - mouse, p - mouse) * 7.0);
  float w = 0.05 * near;

  float r = w / abs(p.y - wave(rx));
  float g = w / abs(p.y - wave(gx));
  float b = w / abs(p.y - wave(bx));

  gl_FragColor = vec4(r, g, b, 1.0);
}`;

export default function LightWave() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(prog, name);
    const U = {
      resolution: u("resolution"),
      time: u("time"),
      xScale: u("xScale"),
      yScale: u("yScale"),
      distortion: u("distortion"),
      mouse: u("mouse"),
      pull: u("pull"),
      glow: u("glow"),
    };
    gl.uniform1f(U.xScale, 1.0);
    gl.uniform1f(U.yScale, 0.5);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = {
      time: 0,
      mouse: [0, 0] as [number, number],
      target: [0, 0] as [number, number],
      inside: 0,
      pull: 0,
      glow: 0,
      speed: 0,
      distortion: 0.05,
      last: [0, 0] as [number, number],
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(el.clientWidth * dpr));
      const h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.resolution, w, h);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    // cursor no espaço do shader: centro = 0, menor lado vai de -1 a 1, y para cima
    const toShader = (cx: number, cy: number): [number, number] => {
      const r = el.getBoundingClientRect();
      const m = Math.min(r.width, r.height);
      return [((cx - r.left) * 2 - r.width) / m, -((cy - r.top) * 2 - r.height) / m];
    };
    const host = el.parentElement ?? el;
    const onMove = (e: PointerEvent) => {
      const p = toShader(e.clientX, e.clientY);
      state.speed += Math.hypot(p[0] - state.last[0], p[1] - state.last[1]);
      state.last = p;
      state.target = p;
      state.inside = 1;
    };
    const onLeave = () => {
      state.inside = 0;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let visible = true;
    let prev = 0;
    const draw = (now: number) => {
      const dt = prev ? Math.min((now - prev) / 1000, 1 / 20) : 1 / 60;
      prev = now;
      const k = (s: number) => 1 - Math.exp(-dt / s);

      state.time += dt * 0.6; // o original soma 0,01 por quadro (≈0,6/s a 60 fps)
      state.mouse[0] += (state.target[0] - state.mouse[0]) * k(0.12);
      state.mouse[1] += (state.target[1] - state.mouse[1]) * k(0.12);
      state.pull += (state.inside * 0.85 - state.pull) * k(state.inside ? 0.35 : 0.8);
      state.glow += (state.inside - state.glow) * k(0.5);
      state.speed *= Math.exp(-dt / 0.25);
      const wantDist = 0.05 + Math.min(state.speed * 0.35, 0.22);
      state.distortion += (wantDist - state.distortion) * k(0.15);

      gl.uniform1f(U.time, state.time);
      gl.uniform2f(U.mouse, state.mouse[0], state.mouse[1]);
      gl.uniform1f(U.pull, state.pull);
      gl.uniform1f(U.glow, state.glow);
      gl.uniform1f(U.distortion, state.distortion);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = visible && !reduced ? requestAnimationFrame(draw) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        prev = 0;
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(el);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
