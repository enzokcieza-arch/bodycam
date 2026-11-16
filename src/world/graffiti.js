// world/graffiti.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { L as $a, a as Rt, a5 as fe, a6 as S0, aq as Li, d as Tt, s as Eo, v as Te } from "three-vendor";
import { ms } from "../level/builder.js";

const a0 = [
    {
      name: "chrome-black",
      fill: ["#d3d5d2", "#9ea3a8", "#eeeeea"],
      outline: "#121315",
      hl: "#fbfbf7",
      block: "#2a3244",
      bg: "#46689a",
      tag: "#141414",
    },
    {
      name: "skyblue-navy",
      fill: ["#86c1dc", "#4f8fc4", "#c9e5ee"],
      outline: "#17213b",
      hl: "#f1f4f0",
      block: "#0d162b",
      bg: "#d9d5c9",
      tag: "#1b2848",
    },
    {
      name: "red-white",
      fill: ["#b52f29", "#8a211f", "#d4533b"],
      outline: "#e9e5da",
      hl: "#ffffff",
      block: "#2a1010",
      bg: "#1b1b1b",
      tag: "#a8181b",
    },
    {
      name: "yellow-black",
      fill: ["#dca624", "#bd7c18", "#ecc84d"],
      outline: "#121212",
      hl: "#f8efc4",
      block: "#4a3210",
      bg: "#5b5a57",
      tag: "#121212",
    },
    {
      name: "green-pink",
      fill: ["#62a956", "#3a8443", "#9ccb6f"],
      outline: "#c95888",
      hl: "#f4e2ea",
      block: "#2a1730",
      bg: "#1d1d1f",
      tag: "#c95888",
    },
    {
      name: "orange-blue",
      fill: ["#d0842e", "#a9532a", "#e5ad4d"],
      outline: "#213c88",
      hl: "#ece8dc",
      block: "#55281a",
      bg: "#3d874b",
      tag: "#213c88",
    },
    {
      name: "purple-teal",
      fill: ["#7656aa", "#523a88", "#a386cb"],
      outline: "#101013",
      hl: "#e8e1f2",
      block: "#1c5860",
      bg: "#3fa4a0",
      tag: "#2a1f3d",
    },
    {
      name: "black-white",
      fill: ["#161616", "#0d0d0d", "#2a2a2a"],
      outline: "#e9e8e3",
      hl: "#ffffff",
      block: "#5f5f5f",
      bg: "#8a8a86",
      tag: "#121212",
    },
    {
      name: "teal-black",
      fill: ["#47a39f", "#2c8287", "#7cc4bb"],
      outline: "#141414",
      hl: "#e9f3ef",
      block: "#173a3c",
      bg: "#d6d2c6",
      tag: "#1a4848",
    },
    {
      name: "burgundy-cream",
      fill: ["#7c2a30", "#5c1d25", "#9b3b39"],
      outline: "#e3dccb",
      hl: "#fff5e6",
      block: "#1a0e10",
      bg: "#c4b48a",
      tag: "#5f1d25",
    },
    {
      name: "silver-red",
      fill: ["#cdcfcb", "#a9acaa", "#e3e3df"],
      outline: "#981b1e",
      hl: "#ffffff",
      block: "#3a0c0e",
      bg: "#1a1a1a",
      tag: "#981b1e",
    },
    {
      name: "navy-purple-tags",
      fill: ["#2b2f55", "#3d2f63", "#4a4f7d"],
      outline: "#121218",
      hl: "#d8d6e6",
      block: "#121218",
      bg: "#6f78a8",
      tag: "#25284a",
    },
  ],
  hc = {
    A: "0,1 .36,0 .72,1|~.14,.64 .58,.64",
    B: "0,1 0,0 .42,0 .56,.1 .56,.36 .42,.47 0,.47|~.42,.47 .6,.58 .6,.88 .46,1 0,1",
    C: ".62,.14 .48,0 .15,0 0,.15 0,.85 .15,1 .48,1 .62,.86",
    D: "0,0 0,1 .36,1 .6,.78 .6,.22 .36,0*",
    E: ".6,0 0,0 0,1 .6,1|~0,.5 .45,.5",
    F: ".6,0 0,0 0,1|~0,.5 .45,.5",
    G: ".62,.14 .48,0 .15,0 0,.15 0,.85 .15,1 .48,1 .62,.86 .62,.56 .36,.56",
    H: "0,0 0,1|.6,0 .6,1|~0,.5 .6,.5",
    I: ".1,0 .1,1",
    J: ".56,0 .56,.82 .42,1 .14,1 0,.84",
    K: "0,0 0,1|.6,0 .02,.62|~.2,.46 .62,1",
    L: "0,0 0,1 .55,1",
    M: "0,1 0,0 .38,.56 .76,0 .76,1",
    N: "0,1 0,0 .62,1 .62,0",
    O: ".15,0 .47,0 .62,.15 .62,.85 .47,1 .15,1 0,.85 0,.15*",
    P: "0,1 0,0 .45,0 .6,.13 .6,.37 .45,.5 0,.5",
    Q: ".15,0 .47,0 .62,.15 .62,.85 .47,1 .15,1 0,.85 0,.15*|~.36,.7 .7,1.06",
    R: "0,1 0,0 .45,0 .6,.13 .6,.37 .45,.5 0,.5|~.26,.5 .64,1",
    S: ".6,.12 .46,0 .15,0 0,.14 0,.34 .15,.46 .45,.54 .6,.66 .6,.86 .45,1 .13,1 0,.88",
    T: "~0,0 .66,0|.33,0 .33,1",
    U: "0,0 0,.85 .15,1 .45,1 .6,.85 .6,0",
    V: "0,0 .33,1 .66,0",
    W: "0,0 .2,1 .42,.36 .64,1 .84,0",
    X: "0,0 .64,1|~.64,0 0,1",
    Y: "0,0 .32,.5 .64,0|.32,.5 .32,1",
    Z: "0,0 .62,0 0,1 .62,1",
    0: ".14,0 .42,0 .56,.15 .56,.85 .42,1 .14,1 0,.85 0,.15*",
    1: ".06,.2 .28,0 .28,1",
    2: "0,.15 .15,0 .45,0 .6,.15 .6,.38 0,1 .62,1",
    3: "0,.1 .15,0 .45,0 .6,.13 .6,.36 .45,.48 .2,.48|~.45,.48 .62,.6 .62,.87 .47,1 .15,1 0,.9",
    4: ".5,1 .5,0 0,.68 .66,.68",
    5: ".6,0 .05,0 0,.45 .4,.42 .6,.58 .6,.86 .45,1 .12,1 0,.9",
    6: ".55,.05 .35,0 .15,.05 0,.3 0,.85 .15,1 .45,1 .6,.85 .6,.6 .45,.47 .15,.47 0,.6",
    7: "0,0 .62,0 .22,1",
    8: ".3,.47 .08,.37 .08,.12 .2,0 .42,0 .54,.12 .54,.37 .3,.47 .04,.6 .04,.88 .18,1 .44,1 .6,.88 .6,.6 .3,.47",
    9: ".6,.4 .45,.53 .15,.53 0,.4 0,.15 .15,0 .45,0 .6,.15 .6,.7 .45,.95 .2,1",
    a: ".45,.56 .3,.47 .1,.5 0,.72 .05,.95 .22,1 .4,.9 .45,.56 .46,1",
    b: "0,0 0,1|~0,.62 .15,.48 .35,.48 .48,.62 .48,.86 .35,1 .12,1 0,.9",
    c: ".45,.55 .32,.47 .12,.5 0,.72 .05,.95 .22,1 .45,.94",
    d: ".48,0 .48,1|~.48,.62 .33,.48 .13,.48 0,.62 0,.86 .13,1 .36,1 .48,.9",
    e: "0,.74 .45,.74 .42,.55 .25,.47 .08,.53 0,.75 .06,.95 .25,1 .45,.92",
    f: ".4,.05 .3,0 .16,.05 .14,1|~0,.5 .35,.5",
    g: ".45,.55 .3,.47 .1,.5 0,.68 .08,.85 .3,.88 .45,.75|.45,.48 .45,1.15 .32,1.3 .1,1.3 0,1.2",
    h: "0,0 0,1|~0,.62 .15,.48 .35,.48 .46,.62 .46,1",
    i: ".05,.5 .05,1|.05,.27 .06,.3",
    j: ".2,.5 .2,1.2 .08,1.3 0,1.25|.2,.27 .21,.3",
    k: "0,0 0,1|~.4,.5 0,.78|~.12,.7 .42,1",
    l: ".05,0 .05,1",
    m: "0,.5 0,1|~0,.62 .1,.5 .22,.5 .3,.62 .3,1|~.3,.62 .4,.5 .52,.5 .6,.62 .6,1",
    n: "0,.5 0,1|~0,.62 .12,.5 .3,.5 .42,.62 .42,1",
    o: ".22,.47 .4,.52 .46,.73 .4,.95 .22,1 .05,.95 0,.73 .05,.52*",
    p: "0,.5 0,1.3|~0,.62 .15,.48 .35,.48 .48,.62 .48,.86 .35,1 .12,1 0,.9",
    q: ".48,.5 .48,1.3|~.48,.62 .33,.48 .13,.48 0,.62 0,.86 .13,1 .36,1 .48,.9",
    r: "0,.5 0,1|~0,.66 .12,.52 .3,.48 .38,.52",
    s: ".4,.52 .25,.47 .07,.52 .05,.67 .38,.8 .4,.93 .22,1 0,.95",
    t: ".15,.15 .15,.92 .25,1 .38,.97|~0,.5 .36,.5",
    u: "0,.5 0,.88 .1,1 .3,1 .42,.88|.42,.5 .42,1",
    v: "0,.5 .22,1 .44,.5",
    w: "0,.5 .14,1 .3,.62 .46,1 .6,.5",
    x: "0,.5 .42,1|~.42,.5 0,1",
    y: "0,.5 .22,1|.44,.5 .2,1.15 .1,1.3 0,1.28",
    z: "0,.5 .42,.5 0,1 .42,1",
    "-": "~0,.55 .4,.55",
    ".": ".04,.94 .06,.98",
    ",": ".06,.92 .02,1.08",
    "!": ".06,0 .06,.66|.06,.92 .07,.97",
    "?": "0,.18 .14,0 .42,0 .56,.16 .56,.34 .28,.55 .28,.7|.28,.92 .29,.97",
    "'": ".05,0 .03,.25",
    "·": ".05,.5 .07,.52",
    "/": "0,1 .5,0",
    "+": "~0,.55 .5,.55|~.25,.3 .25,.8",
    "*": "~0,.3 .5,.7|~.5,.3 0,.7|~.25,.2 .25,.8",
  },
  ia = {};
function ra(a) {
  if (ia[a]) return ia[a];
  const t = hc[a];
  if (!t) return null;
  let e = 0;
  const o = t.split("|").map((s) => {
    let i = 1,
      n = !1;
    (s[0] === "~" && ((i = 0.78), (s = s.slice(1))),
      s.endsWith("*") && ((n = !0), (s = s.slice(0, -1))));
    const r = [];
    for (const l of s.trim().split(/\s+/)) {
      const [u, h] = l.split(",").map(Number);
      (r.push(u, h), (e = Math.max(e, u)));
    }
    return { pts: r, f: i, closed: n };
  });
  return (ia[a] = { w: Math.max(e, 0.1), strokes: o });
}
function Ki(a) {
  let t = a >>> 0 || 1;
  return () => {
    t = (t + 1831565813) >>> 0;
    let e = t;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
const uc = (a) => (a() + a() + a() - 1.5) * 2,
  Zt = (a, t) => t[Math.floor(a() * t.length) % t.length];
function dc(a) {
  let t = 2166136261;
  for (let e = 0; e < a.length; e++)
    ((t ^= a.charCodeAt(e)), (t = Math.imul(t, 16777619)));
  return t >>> 0;
}
function Xi(a) {
  const t = parseInt(a.slice(1), 16);
  return [(t >> 16) & 255, (t >> 8) & 255, t & 255];
}
function go(a, t) {
  const e = Xi(a);
  return `rgba(${e[0]},${e[1]},${e[2]},${t})`;
}
function C0(a, t) {
  const e = Xi(a).map((o) =>
    Math.max(
      0,
      Math.min(255, Math.round(t >= 0 ? o + (255 - o) * t : o * (1 + t))),
    ),
  );
  return (
    "#" + ((1 << 24) | (e[0] << 16) | (e[1] << 8) | e[2]).toString(16).slice(1)
  );
}
let n0 = null,
  la = null,
  ca = null;
function pc(a, t) {
  const e = () => document.createElement("canvas");
  n0 || ((n0 = e()), (la = e()), (ca = e()));
  for (const o of [n0, la, ca])
    o.width !== a || o.height !== t
      ? ((o.width = a), (o.height = t))
      : o.getContext("2d").clearRect(0, 0, a, t);
  return [n0.getContext("2d"), la.getContext("2d"), ca.getContext("2d")];
}
function Ze(a) {
  (a.setTransform(1, 0, 0, 1, 0, 0),
    (a.globalAlpha = 1),
    (a.globalCompositeOperation = "source-over"),
    a.clearRect(0, 0, a.canvas.width, a.canvas.height));
}
let ha = null;
const Qs = 256,
  Re = 255;
function fc() {
  if (ha) return ha;
  const a = new Float32Array(Qs * Qs),
    t = Ki(1337),
    e = [
      [64, 0.34],
      [32, 0.25],
      [16, 0.17],
      [8, 0.11],
      [4, 0.08],
      [2, 0.05],
    ];
  for (const [i, n] of e) {
    const r = Qs / i,
      l = new Float32Array(r * r);
    for (let u = 0; u < l.length; u++) l[u] = t();
    for (let u = 0; u < Qs; u++) {
      const h = u / i,
        c = h | 0,
        d = h - c,
        p = d * d * (3 - 2 * d),
        f = (c % r) * r,
        g = ((c + 1) % r) * r;
      for (let m = 0; m < Qs; m++) {
        const w = m / i,
          y = w | 0,
          x = w - y,
          b = x * x * (3 - 2 * x),
          v = y % r,
          M = (y + 1) % r,
          _ = l[f + v] + (l[f + M] - l[f + v]) * b,
          S = l[g + v] + (l[g + M] - l[g + v]) * b;
        a[u * Qs + m] += (_ + (S - _) * p) * n;
      }
    }
  }
  let o = 1e9,
    s = -1e9;
  for (let i = 0; i < a.length; i++)
    ((o = Math.min(o, a[i])), (s = Math.max(s, a[i])));
  for (let i = 0; i < a.length; i++) a[i] = (a[i] - o) / (s - o);
  return (ha = a);
}
function _o(a, t, e) {
  const o = [];
  let s = 0,
    i = 0,
    n = 0;
  const r = String(a).split(`
`);
  for (const l of r) {
    s = 0;
    let u = 0;
    for (const h of l) {
      if (h === " ") {
        s += t.space ?? 0.45;
        continue;
      }
      const c = t.upper ? h.toUpperCase() : h,
        d = ra(c) || ra(c.toUpperCase()) || ra(c.toLowerCase());
      if (!d) {
        s += 0.4;
        continue;
      }
      const p = 1 + (e() - 0.5) * 2 * (t.sJ || 0),
        f = p * (t.xScale || 1) * (1 + (e() - 0.5) * (t.wJ || 0)),
        g = (e() - 0.5) * 2 * (t.rotJ || 0) + u;
      u += (e() - 0.5) * (t.drift || 0);
      const m =
          (e() - 0.5) * 2 * (t.yJ || 0) +
          i * (t.lineH || 1.5) +
          (t.baseCurve ? t.baseCurve(n) : 0),
        w = d.w / 2,
        y = 0.5,
        x = Math.cos(g),
        b = Math.sin(g),
        v = s + (d.w * f) / 2,
        M = o.length;
      for (const _ of d.strokes) {
        const S = new Array(_.pts.length);
        for (let T = 0; T < _.pts.length; T += 2) {
          const A = (e() - 0.5) * (t.vJ || 0),
            z = (e() - 0.5) * (t.vJ || 0);
          let R = (_.pts[T] - w + A) * f,
            k = (_.pts[T + 1] - y + z) * p;
          const C = R * x - k * b;
          let V = R * b + k * x + y + m;
          ((S[T] = C + v + (t.slant || 0) * (1 - V)), (S[T + 1] = V));
        }
        o.push({
          pts: S,
          f: _.f * (1 + (e() - 0.5) * (t.fJ || 0)),
          closed: _.closed,
          g: n,
        });
      }
      if (t.connect && n > 0 && e() < t.connect) {
        const _ = o.filter((T) => T.g === n - 1 && !T.closed).pop(),
          S = o[M];
        if (_ && S && !S.closed) {
          const T = _.pts,
            A = S.pts,
            z = T[T.length - 2],
            R = T[T.length - 1],
            k = A[0],
            C = A[1];
          o.push({
            pts: [z, R, (z + k) / 2, Math.max(R, C) + 0.12, k, C],
            f: 0.7,
            closed: !1,
            g: n,
            conn: !0,
          });
        }
      }
      ((s += d.w * f + (t.track ?? 0.22)), n++);
    }
    i++;
  }
  return o;
}
function ws(a) {
  let t = 1e9,
    e = 1e9,
    o = -1e9,
    s = -1e9;
  for (const i of a)
    for (let n = 0; n < i.pts.length; n += 2) {
      const r = i.pts[n],
        l = i.pts[n + 1];
      (r < t && (t = r), r > o && (o = r), l < e && (e = l), l > s && (s = l));
    }
  return { x0: t, y0: e, x1: o, y1: s, w: o - t, h: s - e };
}
function So(a, t, e = 0) {
  const o = ws(a),
    s = Math.min(t.w / (o.w + e * 2), t.h / (o.h + e * 2)),
    i = t.x + t.w / 2 - (o.x0 + o.w / 2) * s,
    n = t.y + t.h / 2 - (o.y0 + o.h / 2) * s;
  for (const r of a)
    for (let l = 0; l < r.pts.length; l += 2)
      ((r.pts[l] = r.pts[l] * s + i), (r.pts[l + 1] = r.pts[l + 1] * s + n));
  return s;
}
function mc(a, t, e) {
  const o = a.pts,
    s = o.length / 2;
  if (s < 3) return;
  const i = (u) => {
      if (!a.closed && (u === 0 || u === s - 1)) return !0;
      const h = (u - 1 + s) % s,
        c = (u + 1) % s,
        d = o[u * 2] - o[h * 2],
        p = o[u * 2 + 1] - o[h * 2 + 1],
        f = o[c * 2] - o[u * 2],
        g = o[c * 2 + 1] - o[u * 2 + 1],
        m = Math.hypot(d, p) * Math.hypot(f, g) || 1;
      return (d * f + p * g) / m < t;
    },
    n = [],
    r = a.closed ? s : s - 1,
    l = (u) => (a.closed ? ((u % s) + s) % s : Math.max(0, Math.min(s - 1, u)));
  for (let u = 0; u < r; u++) {
    const h = l(u),
      c = l(u + 1),
      d = i(h) ? h : l(u - 1),
      p = i(c) ? c : l(u + 2);
    for (let f = 0; f < e; f++) {
      const g = f / e,
        m = g * g,
        w = m * g;
      for (let y = 0; y < 2; y++) {
        const x = o[d * 2 + y],
          b = o[h * 2 + y],
          v = o[c * 2 + y],
          M = o[p * 2 + y];
        n.push(
          0.5 *
            (2 * b +
              (-x + v) * g +
              (2 * x - 5 * b + 4 * v - M) * m +
              (-x + 3 * b - 3 * v + M) * w),
        );
      }
    }
  }
  (a.closed || n.push(o[(s - 1) * 2], o[(s - 1) * 2 + 1]), (a.pts = n));
}
function gc(a, t, e, o) {
  const s = a.pts;
  if (s.length / 2 < 2) return;
  const n = a.closed ? s.concat([s[0], s[1]]) : s,
    r = n.length / 2,
    l = o() * 6.28,
    u = o() * 6.28,
    h = (0.6 + o() * 0.8) / (t * 9),
    c = (0.8 + o() * 1.2) / (t * 3.5),
    d = [];
  let p = 0;
  for (let f = 0; f < r - 1; f++) {
    const g = n[f * 2],
      m = n[f * 2 + 1],
      w = n[f * 2 + 2],
      y = n[f * 2 + 3],
      x = Math.hypot(w - g, y - m);
    if (x < 1e-6) continue;
    const b = -(y - m) / x,
      v = (w - g) / x,
      M = Math.max(1, Math.ceil(x / t));
    for (let _ = 0; _ < M; _++) {
      const S = _ / M,
        T = p + S * x,
        A = (Math.sin(T * h + l) * 0.65 + Math.sin(T * c + u) * 0.35) * e;
      d.push(g + (w - g) * S + b * A, m + (y - m) * S + v * A);
    }
    p += x;
  }
  (a.closed || d.push(n[(r - 1) * 2], n[(r - 1) * 2 + 1]), (a.pts = d));
}
function wc(a, t, e = 0, o = 0, s = null) {
  a.beginPath();
  for (const i of t.strokes) {
    if (s !== null && i.f !== s) continue;
    const n = i.pts;
    (a.moveTo(n[0] + e, n[1] + o),
      n.length === 2 && a.lineTo(n[0] + e + 0.01, n[1] + o));
    for (let r = 2; r < n.length; r += 2) a.lineTo(n[r] + e, n[r + 1] + o);
    i.closed && a.closePath();
  }
}
function R0(a, t, e, o, s = 0, i = 0, n = "round", r = "round") {
  ((a.lineJoin = n), (a.lineCap = r), (a.miterLimit = 2.2));
  const l = new Set(t.strokes.map((u) => u.f));
  for (const u of l)
    (wc(a, t, s, i, u), (a.lineWidth = Math.max(0.5, e * u + o)), a.stroke());
  if (t.polys)
    for (const u of t.polys) {
      (a.beginPath(), a.moveTo(u[0] + s, u[1] + i));
      for (let h = 2; h < u.length; h += 2) a.lineTo(u[h] + s, u[h + 1] + i);
      (a.closePath(), a.fill(), o > 0 && ((a.lineWidth = o), a.stroke()));
    }
}
function Gs(a, t, e, o, s, i = 1, n = 0, r = 0, l, u) {
  ((a.fillStyle = a.strokeStyle = s),
    (a.globalAlpha = i),
    R0(a, t, e, o, n, r, l, u),
    (a.globalAlpha = 1));
}
const O0 = 3e4;
function E0(a, t, e, o, s, i, n, r, l) {
  (a.save(),
    (a.shadowColor = go(s, i)),
    (a.shadowBlur = n),
    (a.shadowOffsetX = O0),
    (a.shadowOffsetY = 0),
    (a.fillStyle = a.strokeStyle = "#000"),
    R0(a, t, e, o, -O0, 0, r, l),
    a.restore());
}
function ko(a, t, e, o, s, i, n, r = 1.2) {
  const l = t.strokes;
  if (l.length) {
    a.fillStyle = o;
    for (let u = 0; u < 3; u++) {
      ((a.globalAlpha = [0.18, 0.35, 0.6][u]), a.beginPath());
      const h = Math.round(s * [0.5, 0.33, 0.17][u]);
      for (let c = 0; c < h; c++) {
        const d = l[Math.floor(n() * l.length)],
          p = Math.floor((n() * d.pts.length) / 2) * 2,
          f = n() * 6.283,
          g = (e * d.f) / 2 + Math.abs(uc(n)) * i,
          m = r * (0.5 + n() * n() * 1.6);
        a.rect(
          d.pts[p] + Math.cos(f) * g,
          d.pts[p + 1] + Math.sin(f) * g,
          m,
          m,
        );
      }
      a.fill();
    }
    a.globalAlpha = 1;
  }
}
function W0(a, t, e, o, s, i, n, r = 0.95) {
  ((a.fillStyle = a.strokeStyle = i),
    (a.globalAlpha = r),
    (a.lineCap = "round"));
  const l = Math.max(3, Math.ceil(o / Math.max(1.5, s)));
  let u = t,
    h = e;
  const c = (n() - 0.5) * 0.08;
  (a.beginPath(),
    a.ellipse(t, e + s * 0.6, s * 1, s * 1.6, 0, 0, 6.283),
    a.fill());
  for (let p = 1; p <= l; p++) {
    const f = p / l,
      g = t + c * o * f + Math.sin(f * 9 + t) * s * 0.25,
      m = e + o * f;
    ((a.lineWidth = Math.max(0.6, s * (1 - 0.45 * f) * (0.9 + n() * 0.2))),
      a.beginPath(),
      a.moveTo(u, h),
      a.lineTo(g, m),
      a.stroke(),
      (u = g),
      (h = m));
  }
  const d = s * (0.75 + n() * 0.5) * (o > s * 8 ? 1.15 : 0.9);
  (a.beginPath(),
    a.ellipse(u, h + d * 0.25, d * 0.85, d * 1.25, 0, 0, 6.283),
    a.fill(),
    (a.globalAlpha = 1));
}
function Wo(a, t, e, o, s, i, n, r, l) {
  const u = t.strokes.filter((h) => h.pts.length >= 2);
  if (u.length)
    for (let h = 0; h < i; h++) {
      const c = u[Math.floor(r() * u.length)],
        d = Math.floor((r() * c.pts.length) / 2) * 2,
        p = (e * c.f + o) / 2,
        f = n * (0.08 + Math.pow(r(), 2.2) * 0.92);
      W0(
        a,
        c.pts[d] + (r() - 0.5) * p,
        c.pts[d + 1] + p * 0.8,
        f,
        l * (0.7 + r() * 0.6),
        s,
        r,
      );
    }
}
function qo(a, t, e, o, s, i) {
  const n = a.createRadialGradient(t, e, 0, t, e, o);
  (n.addColorStop(0, go(s, i)),
    n.addColorStop(0.55, go(s, i * 0.7)),
    n.addColorStop(1, go(s, 0)),
    (a.fillStyle = n),
    a.fillRect(t - o, e - o, o * 2, o * 2));
}
function yc(a, t, e, o, s) {
  ((a.fillStyle = s),
    (a.globalAlpha = 0.95),
    a.beginPath(),
    a.moveTo(t, e - o),
    a.quadraticCurveTo(t, e, t + o * 0.7, e),
    a.quadraticCurveTo(t, e, t, e + o),
    a.quadraticCurveTo(t, e, t - o * 0.7, e),
    a.quadraticCurveTo(t, e, t, e - o),
    a.fill(),
    qo(a, t, e, o * 0.45, s, 0.6),
    (a.globalAlpha = 1));
}
function Go(a, t, e, o) {
  for (const s of a)
    (e.smooth !== void 0 && mc(s, e.smooth, e.sub || 6),
      gc(s, Math.max(1.5, t * (e.step || 0.04)), t * (e.wob || 0.01), o));
  return { strokes: a, polys: [] };
}
function V0(a, t, e, o, s = {}) {
  const { r: i } = a,
    n = _o(
      e,
      {
        slant: s.slant ?? 0.22 + i() * 0.25,
        xScale: 0.62 + i() * 0.2,
        track: s.track ?? -0.02 + i() * 0.1,
        rotJ: 0.1,
        yJ: 0.09,
        sJ: 0.14,
        vJ: 0.07,
        connect: 0.55,
        upper: s.upper ?? i() < 0.6,
        wJ: 0.3,
      },
      i,
    ),
    r = ws(n);
  if (i() < 0.7) {
    const f = r.y1 + 0.12 + i() * 0.1,
      g = r.x0 - 0.1 + i() * 0.2,
      m = r.x1 + 0.2 + i() * 0.4;
    n.push({
      pts: [g, f + 0.05, (g + m) * 0.5, f - 0.04, m, f - 0.2 - i() * 0.2],
      f: 0.75,
      closed: !1,
      flick: !0,
    });
  }
  if (i() < 0.25) {
    const f = r.x0 + r.w * (0.2 + i() * 0.5);
    n.push({
      pts: [
        f,
        r.y0 - 0.15,
        f + 0.12,
        r.y0 - 0.4,
        f + 0.24,
        r.y0 - 0.18,
        f + 0.36,
        r.y0 - 0.42,
        f + 0.48,
        r.y0 - 0.15,
      ],
      f: 0.7,
      closed: !1,
    });
  }
  const l = So(n, t, 0.15),
    u = Go(n, l, { smooth: -0.2, sub: 5, step: 0.035, wob: 0.018 }, i),
    h = Math.max(1.6, l * (s.thick ?? 0.07 + i() * 0.05)),
    c = u.strokes.filter((f) => !f.conn && !f.flick).pop();
  if (c && c.pts.length >= 4) {
    const f = c.pts,
      g = f.length,
      m = f[g - 2] - f[g - 4],
      w = f[g - 1] - f[g - 3],
      y = Math.hypot(m, w) || 1,
      x = f[g - 2] + (m / y) * l * 0.45,
      b = f[g - 1] + (w / y) * l * 0.45 - l * 0.15;
    (c.pts.push(
      f[g - 2] + (m / y) * l * 0.2,
      f[g - 1] + (w / y) * l * 0.2,
      x,
      b,
    ),
      (c.flick = !0));
  }
  const d = a.l;
  (Ze(d),
    (d.strokeStyle = o),
    (d.fillStyle = o),
    (d.lineCap = "round"),
    (d.lineJoin = "round"));
  for (const f of u.strokes) {
    const g = f.pts,
      m = g.length / 2,
      w = i() * 6.28,
      y = 0.5 + i() * 0.7;
    for (let x = 1; x < m; x++) {
      const b = x / (m - 1);
      let v = h * f.f * (0.78 + 0.32 * Math.sin(x * 0.18 * y + w));
      (x < 3 && (v *= 1.25),
        f.flick && (v *= Math.max(0.15, 1 - Math.pow(b, 1.6))),
        (d.lineWidth = Math.max(0.7, v)),
        d.beginPath(),
        d.moveTo(g[x * 2 - 2], g[x * 2 - 1]),
        d.lineTo(g[x * 2], g[x * 2 + 1]),
        d.stroke());
    }
  }
  const p = Math.floor(i() * (s.drips ?? 3));
  for (let f = 0; f < p; f++) {
    const g = Zt(i, u.strokes);
    W0(
      d,
      g.pts[0],
      g.pts[1] + h * 0.4,
      l * (0.08 + i() * i() * 0.6),
      h * 0.45,
      o,
      i,
    );
  }
  return (
    E0(a.ctx, u, h, h * 0.4, o, 0.28 * (s.alpha ?? 1), h * 1.6),
    (a.ctx.globalAlpha = s.alpha ?? 0.94),
    a.ctx.drawImage(d.canvas, 0, 0),
    (a.ctx.globalAlpha = 1),
    ko(
      a.ctx,
      u,
      h,
      o,
      Math.min(1500, l * 3),
      h * 1.5,
      i,
      Math.max(0.8, h * 0.18),
    ),
    u
  );
}
function xc(a, t, e) {
  const { r: o, W: s, H: i } = a,
    n = e.tag,
    r = _o(
      t,
      {
        slant: 0.05 + o() * 0.1,
        xScale: 0.85 + o() * 0.2,
        track: 0.16,
        space: 0.5,
        rotJ: 0.09,
        yJ: 0.07,
        sJ: 0.16,
        vJ: 0.06,
        drift: 0.05,
        wJ: 0.25,
        baseCurve: (p) => Math.sin(p * 0.5 + o() * 0.3) * 0.06,
      },
      o,
    ),
    l = So(r, { x: s * 0.05, y: i * 0.1, w: s * 0.9, h: i * 0.55 }, 0.1),
    u = Go(r, l, { smooth: 0.1, sub: 5, step: 0.035, wob: 0.025 }, o),
    h = Math.max(2, l * (0.15 + o() * 0.05)),
    c = a.l;
  (Ze(c),
    (c.strokeStyle = c.fillStyle = n),
    (c.lineCap = "round"),
    (c.lineJoin = "round"));
  for (const p of u.strokes) {
    const f = p.pts,
      g = f.length / 2,
      m = o() * 6.28;
    for (let w = 1; w < g; w++)
      ((c.lineWidth = Math.max(
        0.8,
        h * p.f * (0.8 + 0.35 * Math.sin(w * 0.23 + m)) * (w < 3 ? 1.3 : 1),
      )),
        c.beginPath(),
        c.moveTo(f[w * 2 - 2], f[w * 2 - 1]),
        c.lineTo(f[w * 2], f[w * 2 + 1]),
        c.stroke());
  }
  const d = Math.round(t.length * (1.2 + o()));
  for (let p = 0; p < d; p++) {
    const f = Zt(o, u.strokes),
      g = Math.floor((o() * f.pts.length) / 2) * 2;
    W0(
      c,
      f.pts[g],
      f.pts[g + 1] + h * 0.3,
      Math.min(i * 0.4, l * (0.1 + Math.pow(o(), 1.7) * 1.1)),
      h * (0.35 + o() * 0.25),
      n,
      o,
    );
  }
  (E0(a.ctx, u, h, h * 0.8, n, 0.4, h * 2.4),
    (a.ctx.globalAlpha = 0.93),
    a.ctx.drawImage(c.canvas, 0, 0),
    (a.ctx.globalAlpha = 1),
    ko(
      a.ctx,
      u,
      h,
      n,
      Math.min(2500, l * 6),
      h * 2.2,
      o,
      Math.max(0.8, h * 0.15),
    ));
}
function bc(a, t, e, o) {
  const { ctx: s, r: i } = a,
    n = [],
    r = t.x0 - e * 0.25,
    l = t.x1 + e * 0.25,
    u = (t.y0 + t.y1) / 2;
  for (let c = r; c <= l; c += e * (0.28 + i() * 0.12))
    n.push([c, u + (i() - 0.5) * e * 0.35, e * (0.5 + i() * 0.3)]);
  const h = (c) => {
    s.beginPath();
    for (const [d, p, f] of n)
      (s.moveTo(d + f + c, p), s.arc(d, p, f + c, 0, 6.283));
    s.fill();
  };
  (s.save(),
    (s.shadowColor = go(o.bg, 0.4)),
    (s.shadowBlur = e * 0.08),
    (s.shadowOffsetX = O0),
    (s.fillStyle = "#000"),
    s.translate(-O0, 0),
    h(e * 0.02),
    s.restore(),
    (s.fillStyle = o.outline),
    (s.globalAlpha = 0.9),
    h(e * 0.03),
    (s.fillStyle = o.bg),
    (s.globalAlpha = 0.95),
    h(0),
    (s.globalCompositeOperation = "source-atop"));
  for (let c = 0; c < 14; c++) {
    const d = Zt(i, n);
    qo(
      s,
      d[0] + (i() - 0.5) * e * 0.5,
      d[1] + d[2] * 0.4,
      e * (0.2 + i() * 0.25),
      C0(o.bg, -0.25),
      0.45,
    );
  }
  ((s.globalCompositeOperation = "source-over"), (s.globalAlpha = 1));
  for (let c = 0; c < 6; c++) {
    const d = Zt(i, n),
      p = i() * 6.28,
      f = d[2] + e * (0.1 + i() * 0.2),
      g = e * (0.04 + i() * 0.08),
      m = d[0] + Math.cos(p) * f,
      w = d[1] + Math.sin(p) * f;
    (s.beginPath(),
      s.arc(m, w, g + e * 0.02, 0, 6.283),
      (s.fillStyle = o.outline),
      s.fill(),
      s.beginPath(),
      s.arc(m, w, g, 0, 6.283),
      (s.fillStyle = o.bg),
      s.fill(),
      s.beginPath(),
      s.arc(m - g * 0.35, w - g * 0.35, g * 0.25, 0, 6.283),
      (s.fillStyle = o.hl),
      s.fill());
  }
}
function vc(a, t, e, o, s) {
  const i = [];
  for (const l of a.strokes) {
    if (l.closed || l.pts.length < 6) continue;
    const u = l.pts,
      h = u.length;
    for (const c of [!1, !0]) {
      const d = c ? u[h - 2] : u[0],
        p = c ? u[h - 1] : u[1],
        f = c ? u[h - 6] : u[4],
        g = c ? u[h - 5] : u[5],
        m = d - f,
        w = p - g,
        y = Math.hypot(m, w) || 1;
      i.push({ ex: d, ey: p, dx: m / y, dy: w / y, s: l });
    }
  }
  const n = ws(a.strokes);
  i.sort((l, u) => r(u) - r(l));
  function r(l) {
    return (
      -l.dy * 1.2 +
      (l.ex - n.x0 < t * 0.6 ? -l.dx : 0) +
      (n.x1 - l.ex < t * 0.6 ? l.dx : 0) +
      (n.y1 - l.ey < t * 0.2 ? l.dy * 0.6 : 0) +
      s() * 0.8
    );
  }
  for (let l = 0; l < Math.min(o, i.length); l++) {
    const u = i[l],
      h = t * (0.22 + s() * 0.25),
      c = t * 0.26,
      d = e * 0.95,
      p = u.ex + u.dx * h,
      f = u.ey + u.dy * h;
    u.s.pts.push(u.ex + u.dx * h * 0.5, u.ey + u.dy * h * 0.5, p, f);
    const g = -u.dy,
      m = u.dx,
      w = [
        p + g * d,
        f + m * d,
        p + u.dx * c,
        f + u.dy * c,
        p - g * d,
        f - m * d,
      ];
    ((w.g = u.s.g), a.polys.push(w));
  }
}
function Zi(a) {
  return [...new Set(a.strokes.map((t) => t.g))];
}
function Ji(a, t) {
  return {
    strokes: a.strokes.filter((e) => e.g === t),
    polys: a.polys.filter((e) => e.g === t),
  };
}
function Hn(a, t, e) {
  const { ctx: o, r: s, W: i, H: n } = a,
    r = _o(
      t,
      {
        upper: !0,
        slant: (s() - 0.3) * 0.18,
        xScale: 0.92 + s() * 0.2,
        track: 0.17 + s() * 0.1,
        rotJ: 0.09,
        yJ: 0.07,
        sJ: 0.1,
        vJ: 0.035,
        wJ: 0.2,
        fJ: 0.15,
      },
      s,
    ),
    l = So(r, { x: i * 0.05, y: n * 0.14, w: i * 0.9, h: n * 0.6 }, 0.22),
    u = Go(r, l, { step: 0.03, wob: 0.008 }, s),
    h = l * (0.25 + s() * 0.05),
    c = l * (0.06 + s() * 0.025),
    d = l * 0.022;
  vc(u, l, h * 0.8, 1 + Math.floor(s() * 2.2), s);
  const p = ws(u.strokes),
    f = "miter",
    g = "butt";
  !a.floor && s() < 0.45 && bc(a, p, l, e);
  const m = s() < 0.65 ? 1 : -1,
    w = l * (0.1 + s() * 0.06),
    y = m * w * 0.75,
    x = w,
    b = Math.max(4, Math.ceil(w / 1.5));
  o.fillStyle = o.strokeStyle = e.outline;
  for (let C = 0; C <= b; C++)
    R0(o, u, h, c * 2, (y * C) / b, (x * C) / b, f, g);
  o.fillStyle = o.strokeStyle = e.block;
  for (let C = 1; C <= b; C++)
    R0(o, u, h, c * 0.6, (y * C) / b, (x * C) / b, f, g);
  E0(o, u, h, c, e.fill[0], 0.3, l * 0.06, f, g);
  const [v, M, _] = e.fill,
    S = p.y0 + (p.y1 - p.y0) * (0.5 + s() * 0.15),
    T = s(),
    A = p.x0 + (p.x1 - p.x0) * (0.35 + s() * 0.3),
    z = l * 0.6,
    R = a.l,
    k = a.l2;
  for (const C of Zi(u)) {
    const O = Ji(u, C),
      V = ws(O.strokes),
      F = V.x0 - h,
      q = V.x1 + h;
    (Ze(R),
      Wo(
        R,
        O,
        h,
        c * 2.4,
        M,
        Math.round(s() * 2.2),
        l * 0.6,
        s,
        Math.max(1.2, l * 0.018),
      ),
      Gs(R, O, h, c * 2 + d * 2, e.hl, 1, 0, 0, f, g),
      Gs(R, O, h, c * 2, e.outline, 1, 0, 0, f, g),
      s() < 0.35 &&
        Wo(
          R,
          O,
          h,
          c * 2 + d * 2,
          e.outline,
          1,
          l * 0.35,
          s,
          Math.max(1, l * 0.012),
        ),
      Ze(k),
      Gs(k, O, h, 0, "#fff", 1, 0, 0, f, g),
      (k.globalCompositeOperation = "source-atop"),
      (k.fillStyle = v),
      k.fillRect(F, 0, q - F, n),
      (k.fillStyle = M),
      k.fillRect(F, S + l * 0.12, q - F, n));
    for (let I = F; I < q; I += l * 0.1)
      qo(
        k,
        I,
        S + Math.sin(I * 0.02) * l * 0.05 + l * 0.08,
        l * (0.12 + s() * 0.08),
        M,
        0.7,
      );
    for (let I = F; I < q; I += l * 0.13)
      qo(k, I, p.y0 + l * 0.02, l * (0.12 + s() * 0.1), _, 0.55);
    if (T < 0.35)
      (k.beginPath(),
        k.moveTo(A - z, p.y1 + l),
        k.lineTo(A + z, p.y0 - l),
        k.lineTo(i + 10, p.y0 - l),
        k.lineTo(i + 10, p.y1 + l),
        k.closePath(),
        (k.fillStyle = go(_, 0.85)),
        k.fill(),
        (k.strokeStyle = e.hl),
        (k.lineWidth = Math.max(1.2, l * 0.02)),
        k.beginPath(),
        k.moveTo(A - z, p.y1 + l),
        k.lineTo(A + z, p.y0 - l),
        k.stroke());
    else if (T < 0.7)
      for (let I = 0; I < 2; I++) {
        const H = F + s() * (q - F),
          L = V.y0 + s() * V.h,
          D = l * (0.03 + s() * 0.06);
        ((k.strokeStyle = C0(M, -0.2)),
          (k.lineWidth = Math.max(1, l * 0.012)),
          k.beginPath(),
          k.arc(H, L, D, 0, 6.283),
          k.stroke(),
          (k.fillStyle = e.hl),
          k.beginPath(),
          k.arc(H - D * 0.35, L - D * 0.35, D * 0.22, 0, 6.283),
          k.fill());
      }
    ((k.strokeStyle = e.hl), (k.lineCap = "round"), (k.globalAlpha = 0.9));
    for (const I of O.strokes) {
      if (s() < 0.45 || I.pts.length < 8) continue;
      const H = I.pts.length / 2,
        L = Math.floor(H * s() * 0.5),
        D = Math.max(3, Math.floor(H * (0.15 + s() * 0.25)));
      ((k.lineWidth = Math.max(1, h * 0.075)), k.beginPath());
      for (let U = L; U < Math.min(H, L + D); U++)
        k.lineTo(I.pts[U * 2] - h * 0.27, I.pts[U * 2 + 1] - h * 0.28);
      k.stroke();
    }
    ((k.globalAlpha = 1),
      (k.globalCompositeOperation = "source-over"),
      R.drawImage(k.canvas, 0, 0),
      o.drawImage(R.canvas, 0, 0));
  }
  for (let C = 0; C < 2 + s() * 3; C++) {
    const O = Zt(s, u.strokes),
      V = Math.floor((s() * O.pts.length) / 2) * 2;
    yc(
      o,
      O.pts[V] - h * 0.4,
      O.pts[V + 1] - h * 0.45,
      l * (0.06 + s() * 0.06),
      e.hl,
    );
  }
  return (
    ko(o, u, h + c * 2, e.outline, Math.min(4e3, l * 8), l * 0.05, s),
    { sh: u, em: l, b: p }
  );
}
function Mc(a, t, e) {
  const { ctx: o, r: s, W: i, H: n } = a,
    r = _o(
      t,
      {
        upper: !0,
        slant: (s() - 0.4) * 0.15,
        xScale: 0.95 + s() * 0.2,
        track: 0.14 + s() * 0.08,
        rotJ: 0.1,
        yJ: 0.08,
        sJ: 0.12,
        vJ: 0.05,
        wJ: 0.25,
      },
      s,
    ),
    l = So(r, { x: i * 0.05, y: n * 0.08, w: i * 0.9, h: n * 0.72 }, 0.24),
    u = Go(r, l, { smooth: -2, sub: 6, step: 0.03, wob: 0.012 }, s),
    h = l * (0.3 + s() * 0.06),
    c = l * (0.06 + s() * 0.03),
    [d] = e.fill;
  E0(o, u, h, c * 2, e.outline, 0.3, l * 0.05);
  const p = ws(u.strokes),
    f = -0.9 - s() * 0.5,
    g = Math.cos(f),
    m = Math.sin(f),
    w = a.l,
    y = a.l2;
  for (const x of Zi(u)) {
    const b = Ji(u, x),
      v = ws(b.strokes);
    (Ze(w),
      Gs(w, b, h, c * 1.2, "#fff", 1),
      (w.globalCompositeOperation = "source-atop"),
      (w.fillStyle = d),
      (w.globalAlpha = 0.72 + s() * 0.18),
      w.fillRect(0, 0, i, n),
      (w.globalAlpha = 0.9),
      (w.strokeStyle = d),
      (w.lineCap = "round"),
      (w.lineJoin = "round"));
    const M = h * (0.22 + s() * 0.1);
    ((w.lineWidth = M), w.beginPath());
    let _ = !0,
      S = !0;
    for (let T = -h; T < v.w + h * 2; T += M * (0.45 + s() * 0.45)) {
      const A = v.x0 + T - h * 0.5,
        z = v.y1 + h,
        R = v.y0 - h,
        k = (z - R) / Math.abs(m),
        C = A + g * k * (_ ? 1 : -1) * 0.4,
        O = _ ? R : z;
      (S && (w.moveTo(A, _ ? z : R), (S = !1)), w.lineTo(C, O), (_ = !_));
    }
    (w.stroke(),
      (w.globalAlpha = 1),
      (w.globalCompositeOperation = "source-over"),
      Ze(y),
      Gs(y, b, h, c * 2, e.outline, 1),
      s() < 0.6 &&
        Wo(
          y,
          b,
          h,
          c * 2,
          e.outline,
          1 + Math.round(s() * 1.5),
          l * 0.5,
          s,
          Math.max(1.2, c * 0.35),
        ),
      (y.globalCompositeOperation = "destination-out"),
      Gs(y, b, h, 0, "#000", 1),
      (y.globalCompositeOperation = "source-over"),
      w.drawImage(y.canvas, 0, 0),
      o.drawImage(w.canvas, 0, 0));
  }
  ((o.strokeStyle = e.hl), (o.lineCap = "round"), (o.globalAlpha = 0.9));
  for (let x = 0; x < u.strokes.length; x++) {
    if (s() < 0.45) continue;
    const b = u.strokes[x],
      v = Math.floor(((0.1 + s() * 0.3) * b.pts.length) / 2) * 2;
    ((o.lineWidth = Math.max(1.2, h * 0.08)),
      o.beginPath(),
      o.arc(
        b.pts[v] - h * 0.12,
        b.pts[v + 1] - h * 0.1,
        h * 0.24,
        Math.PI * 1.05,
        Math.PI * 1.55,
      ),
      o.stroke());
  }
  return (
    (o.globalAlpha = 1),
    ko(o, u, h + c * 2, e.outline, Math.min(4e3, l * 6), l * 0.05, s),
    { sh: u, em: l, b: p }
  );
}
function _c(a, t, e, o, s, i, n, r) {
  const l = Math.hypot(o - t, s - e);
  if (l < 1) return;
  (a.save(),
    a.translate(t, e),
    a.rotate(Math.atan2(s - e, o - t)),
    (a.fillStyle = n));
  const u = Math.max(6, Math.round(i / 1.5)),
    h = i / u,
    c = (r() - 0.5) * i * 0.15,
    d = 0.55 + r() * 0.4;
  for (let p = 0; p < u; p++) {
    const f = -i / 2 + p * h,
      g = 0.72 + r() * 0.28 * (p % 3 ? 1 : 0.6),
      m = -i * 0.45 + c + (r() - 0.5) * i * 0.06,
      w = l + i * 0.45 - (r() < 0.2 ? r() * i * 0.6 : r() * i * 0.08);
    ((a.globalAlpha = g), a.fillRect(m, f, (w - m) * d, h + 0.6));
    let y = m + (w - m) * d;
    for (; y < w;) {
      const x = i * (0.05 + r() * 0.4);
      ((a.globalAlpha = g * (0.3 + r() * 0.5)),
        a.fillRect(y, f, Math.min(x, w - y), h + 0.6),
        (y += x + i * r() * 0.15));
    }
  }
  (a.restore(), (a.globalAlpha = 1));
}
function Sc(a, t, e) {
  const { ctx: o, r: s, W: i, H: n } = a,
    r = _o(
      t,
      {
        upper: !0,
        slant: (s() - 0.5) * 0.08,
        xScale: 0.8 + s() * 0.2,
        track: 0.12,
        rotJ: 0.03,
        yJ: 0.03,
        sJ: 0.05,
        vJ: 0.02,
      },
      s,
    ),
    l = So(r, { x: i * 0.04, y: n * 0.08, w: i * 0.92, h: n * 0.72 }, 0.15),
    u = Go(r, l, { step: 0.05, wob: 0.006 }, s),
    h = l * (0.17 + s() * 0.04),
    c = s() < 0.5 ? e.tag : e.fill[0],
    d = a.l;
  Ze(d);
  for (const f of r) {
    const g = f.pts,
      m = g.length / 2,
      w = [0];
    for (let y = 1; y < m - 1; y++) {
      const x = g[y * 2] - g[w[w.length - 1] * 2],
        b = g[y * 2 + 1] - g[w[w.length - 1] * 2 + 1],
        v = g[y * 2 + 2] - g[y * 2],
        M = g[y * 2 + 3] - g[y * 2 + 1];
      (x * v + b * M) / (Math.hypot(x, b) * Math.hypot(v, M) || 1) < 0.94 &&
        w.push(y);
    }
    (w.push(m - 1), f.closed && w.push(0));
    for (let y = 1; y < w.length; y++)
      _c(
        d,
        g[w[y - 1] * 2],
        g[w[y - 1] * 2 + 1],
        g[w[y] * 2],
        g[w[y] * 2 + 1],
        h * f.f,
        c,
        s,
      );
  }
  const p = Math.round(4 + s() * 8);
  return (
    Wo(d, u, h, 0, c, p, l * 0.9, s, Math.max(1, h * 0.05)),
    (o.globalAlpha = 0.96),
    o.drawImage(d.canvas, 0, 0),
    (o.globalAlpha = 1),
    ko(o, u, h, c, Math.min(3e3, l * 5), h * 0.6, s, Math.max(1, h * 0.04)),
    { sh: u, em: l }
  );
}
function kc(a, t, e) {
  const { ctx: o, r: s, W: i, H: n } = a,
    r = _o(
      t,
      { upper: !0, xScale: 0.9, track: 0.28, rotJ: 0.005, yJ: 0, sJ: 0, vJ: 0 },
      s,
    ),
    l = String(t).split(`
`).length,
    u = So(r, { x: i * 0.12, y: n * 0.2, w: i * 0.76, h: n * 0.6 }, 0.1),
    h = { strokes: r, polys: [] },
    c = u * 0.2,
    d = e.tag,
    p = ws(r),
    f = u * 0.35;
  ((o.fillStyle = d),
    (o.globalAlpha = 0.07 + s() * 0.06),
    o.fillRect(p.x0 - f, p.y0 - f, p.w + f * 2, p.h + f * 2),
    (o.globalAlpha = 1));
  const g = a.l;
  (Ze(g),
    Gs(g, h, c, 0, d, 1, 0, 0, "miter", "butt"),
    (g.globalCompositeOperation = "destination-out"),
    (g.fillStyle = "#000"));
  for (const w of r) {
    const y = w.pts,
      x = y.length / 2;
    if (x < 2) continue;
    const b = w.closed ? 2 : x > 3 && s() < 0.6 ? 1 : 0;
    for (let v = 0; v < b; v++) {
      const M = w.closed
          ? v === 0
            ? 0
            : Math.floor(x / 2)
          : 1 + Math.floor(s() * (x - 2)),
        _ = Math.min(x - 1, M + 1),
        S = (y[M * 2] + y[_ * 2]) / 2,
        T = (y[M * 2 + 1] + y[_ * 2 + 1]) / 2,
        A = Math.atan2(y[_ * 2 + 1] - y[M * 2 + 1], y[_ * 2] - y[M * 2]);
      (g.save(),
        g.translate(S, T),
        g.rotate(A),
        g.fillRect(-u * 0.02, -c, u * 0.04, c * 2),
        g.restore());
    }
  }
  ((g.globalCompositeOperation = "source-over"),
    (g.globalCompositeOperation = "destination-in"));
  const m = g.createRadialGradient(
    (p.x0 + p.x1) / 2,
    (p.y0 + p.y1) / 2,
    0,
    (p.x0 + p.x1) / 2,
    (p.y0 + p.y1) / 2,
    Math.max(p.w, p.h) * 0.7,
  );
  (m.addColorStop(0, "rgba(0,0,0,1)"),
    m.addColorStop(0.7, "rgba(0,0,0,0.85)"),
    m.addColorStop(1, "rgba(0,0,0,0.55)"),
    (g.fillStyle = m),
    g.fillRect(0, 0, i, n),
    (g.globalCompositeOperation = "source-over"),
    Wo(
      g,
      h,
      c,
      0,
      d,
      Math.round(s() * 3 * l),
      u * 0.3,
      s,
      Math.max(1, c * 0.08),
    ),
    o.drawImage(g.canvas, 0, 0),
    ko(o, h, c, d, Math.min(2e3, u * 3), u * 0.04, s, 1));
}
const q0 = [
  "SEKT",
  "KOYE",
  "DUNK",
  "RIZE",
  "NOX",
  "AKEM",
  "VEXA",
  "TOWS",
  "ODER",
  "KRUZ",
  "MOSK",
  "ZEDS",
  "PURE",
  "HAZE",
  "BLEK",
  "SNUF",
  "TRAK",
  "YESO",
  "nemo",
  "kast",
  "rote",
  "ufo",
  "derp",
  "gaz",
  "1312",
  "ACAB",
  "BFZ",
];
function Tc(a, t) {
  const { r: e, W: o, H: s, ppm: i } = a,
    n = [
      t.tag,
      t.outline,
      "#1f2a55",
      "#3b2c5c",
      "#141414",
      "#2b4a7a",
      "#5a3c6e",
      "#25303a",
    ],
    r = Math.round(Math.max(6, ((o * s) / (i * i)) * (3.5 + e() * 1.5)));
  for (let l = 0; l < 1 + e() * 2; l++)
    for (let u = 0; u < 5; u++) {
      const h = e() * o,
        c = e() * s;
      for (let d = 0; d < 6; d++)
        qo(
          a.ctx,
          h + (e() - 0.5) * i * 0.6,
          c + (e() - 0.5) * i * 0.4,
          i * (0.12 + e() * 0.2),
          Zt(e, ["#6aa57a", "#8fa6c9", "#a585b5", "#7b8d9e"]),
          0.1,
        );
    }
  for (let l = 0; l < r; l++) {
    const u = i * (0.22 + e() * e() * 0.5),
      h = u * (2.2 + e() * 2.5),
      c = e() * (o - h * 0.6) - h * 0.2,
      d = u * 0.5 + e() * (s - u * 1.6);
    V0(a, { x: c, y: d, w: h, h: u }, Zt(e, q0), Zt(e, n), {
      alpha: 0.55 + e() * 0.42,
      drips: 2,
      thick: 0.075 + e() * 0.06,
    });
  }
}
function Yn(a, t, e) {
  const { r: o, W: s, H: i } = a;
  for (let n = 0; n < t; n++) {
    const r = i * (0.1 + o() * 0.12),
      l = Math.min(s * 0.4, r * (2.5 + o() * 2));
    V0(
      a,
      { x: o() * (s - l), y: i * 0.05 + o() * (i * 0.8 - r), w: l, h: r },
      Zt(o, q0),
      Zt(o, [
        "#141414",
        e.outline === "#141414" ? "#a8181b" : "#141414",
        "#2b3b6a",
        "#c9c7c0",
      ]),
      { drips: 2, alpha: 0.9 },
    );
  }
}
function Ac(a, t, e) {
  const { ctx: o, r: s, W: i, H: n, ppm: r } = a,
    l = e ? e.x0 : i * 0.1,
    u = e ? e.x1 : i * 0.9,
    h = (u - l) * (0.18 + s() * 0.25),
    c = n * (0.55 + s() * 0.5),
    p = s() < 0.5 ? l - h * 0.4 : u - h * 0.6,
    f = n * 0.5 - c / 2 + (s() - 0.5) * n * 0.2,
    g = t || Zt(s, ["#7f7b74", "#8d887e", "#6e6c68", "#9a9385", "#7a7d7c"]);
  ((o.fillStyle = g), (o.globalAlpha = 0.9), o.beginPath());
  const m = r * 0.05,
    w = s() * 6,
    y = s() * 6,
    x = r * 0.04,
    b = (M, _) =>
      (Math.sin(M / (r * 0.21) + _) * 0.6 +
        Math.sin(M / (r * 0.07) + _ * 2) * 0.3) *
        x +
      (s() - 0.5) * x * 0.25;
  for (let M = 0; M <= h; M += m) o.lineTo(p + M, f + b(M, w));
  for (let M = 0; M <= c; M += m) o.lineTo(p + h + b(M, y), f + M);
  for (let M = h; M >= 0; M -= m) o.lineTo(p + M, f + c + b(M, w + 2) * 1.5);
  for (let M = c; M >= 0; M -= m) o.lineTo(p + b(M, y + 3), f + M);
  (o.closePath(), o.fill(), o.save(), o.clip());
  const v = r * 0.22;
  for (let M = p; M < p + h; M += v * (0.8 + s() * 0.3))
    ((o.globalAlpha = 0.06 + s() * 0.07),
      (o.fillStyle = s() < 0.5 ? C0(g, 0.15) : C0(g, -0.12)),
      o.fillRect(M, f - 5, v * (0.3 + s() * 0.5), c + 10));
  (o.restore(), (o.globalAlpha = 1));
  for (let M = 0; M < 3; M++)
    W0(
      o,
      p + s() * h,
      f + c - 2,
      r * (0.03 + s() * 0.15),
      Math.max(1, r * 0.008),
      g,
      s,
      0.9,
    );
}
function Pc(a, t, e, o, s) {
  const i = a.getImageData(0, 0, t, e),
    n = i.data,
    r = fc(),
    l = Math.min(1, 64 / (0.55 * o.ppm)),
    u = s() * 256,
    h = s() * 256,
    c = (s() * 256) | 0,
    d = (s() * 256) | 0,
    p = (s() * 256) | 0,
    f = (s() * 256) | 0,
    g = o.wear,
    m = o.uneven,
    w = o.floor,
    y = 0.1 + g * 0.5,
    x = g * 0.32,
    b = Math.min(0.85, g * 0.75),
    v = 0.06 + g * 0.3 + (w ? 0.2 : 0),
    M = 1 / e;
  for (let S = 0; S < e; S++) {
    const T = S * M,
      A = S * l + h,
      z = A | 0,
      R = A - z,
      k = (z & Re) << 8,
      C = ((z + 1) & Re) << 8,
      O = ((S + d) & Re) << 8,
      V = ((((S * 2.3) | 0) + f) & Re) << 8,
      F = (((S * 0.04) | 0) & Re) << 8;
    for (let q = 0; q < t; q++) {
      const I = (S * t + q) << 2;
      let H = n[I + 3];
      if (H === 0) continue;
      const L = q * l + u,
        D = L | 0,
        U = L - D,
        Y = D & Re,
        et = (D + 1) & Re,
        G = r[k | Y],
        j = r[k | et],
        wt = r[C | Y],
        me = r[C | et],
        Vt = G + (j - G) * U,
        At = wt + (me - wt) * U,
        Ht = Vt + (At - Vt) * R,
        ys = r[O | ((q + c) & Re)],
        Ys = r[V | ((((q * 2.3) | 0) + p) & Re)];
      let Je = H / 255;
      Je *=
        1 -
        m *
          (1 - Math.min(1, Math.max(0, (ys * 0.65 + Ht * 0.35 - 0.22) * 2.2)));
      const No =
        Ht * 0.55 +
        ys * 0.35 +
        Ys * 0.1 +
        (w ? 0 : (0.5 - T) * 0.12 * (T > 0.75 ? 2 : 1));
      if (
        (No < y + 0.05 && (Je *= Math.max(0, (No - (y - 0.05)) * 10)),
        Ys < x * (1.5 - Ht) && (Je *= 0.08),
        Je <= 0.004)
      ) {
        n[I + 3] = 0;
        continue;
      }
      let xs = n[I],
        bs = n[I + 1],
        vs = n[I + 2];
      const Pe = b * (0.45 + Ht * 0.8),
        ze = (xs * 0.3 + bs * 0.59 + vs * 0.11) * 0.8 + 45;
      ((xs += (ze - xs) * Pe * 0.6),
        (bs += (ze - bs) * Pe * 0.6),
        (vs += (ze - vs) * Pe * 0.6));
      const Ho = r[F | ((q * 0.9 + c) & Re)];
      let js =
        v * (Math.max(0, Ho - 0.45) * 1.6 + T * T * 0.6 + (1 - Ht) * 0.25);
      (Ys > 0.86 && (js += 0.25),
        (js = Math.min(0.6, js)),
        (xs *= 1 - js),
        (bs *= 1 - js * 1.05),
        (vs *= 1 - js * 1.15),
        (n[I] = xs),
        (n[I + 1] = bs),
        (n[I + 2] = vs),
        (n[I + 3] = Math.min(255, Je * 255 + 0.5)));
    }
  }
  const _ = new Int32Array(t);
  for (let S = 0; S < e; S++) {
    const T = S * t;
    let A = -1,
      z = 0,
      R = 0,
      k = 1e9;
    for (let C = 0; C < t; C++) {
      const O = (T + C) << 2;
      if (n[O + 3] > 8) {
        ((A = n[O]), (z = n[O + 1]), (R = n[O + 2]), (k = 0), (_[C] = 0));
        continue;
      }
      (k++,
        (_[C] = n[O + 3] > 0 ? 0 : k),
        n[O + 3] === 0 &&
          A >= 0 &&
          ((n[O] = A), (n[O + 1] = z), (n[O + 2] = R)));
    }
    ((A = -1), (k = 1e9));
    for (let C = t - 1; C >= 0; C--) {
      const O = (T + C) << 2;
      if (n[O + 3] > 8) {
        ((A = n[O]), (z = n[O + 1]), (R = n[O + 2]), (k = 0));
        continue;
      }
      (k++,
        n[O + 3] === 0 &&
          A >= 0 &&
          k < _[C] &&
          ((n[O] = A), (n[O + 1] = z), (n[O + 2] = R)));
    }
  }
  return i;
}
const jn = {
    piece: [
      "DEADYARD",
      "KAOS",
      "URBEX",
      "SKOR",
      "VAPOR",
      "RIOT",
      "SEKTA",
      "DION",
    ],
    throwup: ["DIP", "OK", "BFZ", "NOX", "ZEK", "MOK", "RAW"],
    tag: q0,
    scrawl: [
      "Do not enter",
      "KEEP OUT",
      "no entry",
      "DANGER",
      "go home",
      "they watch",
    ],
    roller: ["NO", "KOS", "LEAVE", "DIE"],
    stencil: ["NO ENTRY", "ZONE 4", "B-12", "KEEP OUT"],
    tagwall: [""],
  },
  zc = {
    piece: 190,
    throwup: 170,
    tag: 260,
    scrawl: 220,
    roller: 110,
    stencil: 200,
    tagwall: 210,
  };
function Cc({
  style: a = "piece",
  text: t,
  palette: e = 0,
  seed: o = 1,
  width: s = 3,
  height: i = 2,
  wear: n = 0.3,
  floor: r = !1,
  wallTone: l = null,
} = {}) {
  const u = performance.now(),
    h =
      typeof e == "object" ? e : a0[((e % a0.length) + a0.length) % a0.length],
    c = Ki((o * 7919) ^ dc(a + "|" + (t || "")));
  t == null && (t = Zt(c, jn[a] || jn.piece));
  let d = zc[a] || 180;
  const p = Math.max(s, i) * d;
  p > 2048 && (d *= 2048 / p);
  const f = Math.max(32, Math.min(2048, Math.round(s * d))),
    g = Math.max(32, Math.min(2048, Math.round(i * d))),
    [m, w, y] = pc(f, g);
  for (const S of [m, w, y]) Ze(S);
  const x = { ctx: m, l: w, l2: y, r: c, W: f, H: g, ppm: d, floor: r };
  let b = 0.3,
    v = null;
  if (
    (a === "piece" || a === "throwup" || a === "roller") &&
    n > 0.35 &&
    c() < 0.7
  )
    for (let S = 0; S < 1 + c() * 2; S++) {
      const T = g * (0.12 + c() * 0.15),
        A = T * 3;
      V0(
        x,
        { x: c() * (f - A), y: c() * (g - T), w: A, h: T },
        Zt(c, q0),
        Zt(c, ["#2b3b6a", "#141414", "#5a3c6e"]),
        { alpha: 0.35, drips: 1 },
      );
    }
  switch (a) {
    case "piece":
      ((v = Hn(x, t, h).b),
        (b = 0.18),
        c() < 0.6 && Yn(x, 1 + Math.floor(c() * 2 * (0.5 + n)), h));
      break;
    case "throwup":
      ((v = Mc(x, t, h).b), (b = 0.32), c() < 0.4 && Yn(x, 1, h));
      break;
    case "tag":
      (V0(
        x,
        { x: f * 0.06, y: g * 0.12, w: f * 0.88, h: g * 0.7 },
        t,
        h.tag,
        {},
      ),
        (b = 0.25));
      break;
    case "scrawl":
      (xc(x, t, h), (b = 0.3));
      break;
    case "roller":
      (Sc(x, t, h), (b = 0.15));
      break;
    case "stencil":
      (kc(x, t, h), (b = 0.35));
      break;
    case "tagwall":
      (Tc(x, h), (b = 0.3));
      break;
    default:
      Hn(x, t, h);
  }
  (a === "piece" || a === "tagwall") && n > 0.4 && c() < n * 0.6 && Ac(x, l, v);
  const M = Pc(m, f, g, { ppm: d, wear: n, uneven: b, floor: r }, c),
    _ = new fe(M);
  return (
    (_.colorSpace = Te),
    (_.generateMipmaps = !0),
    (_.minFilter = $a),
    (_.magFilter = Eo),
    (_.wrapS = _.wrapT = Li),
    (_.anisotropy = 4),
    (_.name = `graffiti:${a}:${t}`),
    (_.userData.graffiti = {
      style: a,
      text: t,
      W: f,
      H: g,
      ms: performance.now() - u,
      bytes: Math.round(f * g * 4 * 1.333),
    }),
    (_.onUpdate = () => {
      ((_.userData.uploaded = !0),
        (_.image = { width: f, height: g, data: null }),
        (_.onUpdate = null));
    }),
    _
  );
}
const Kn = {
  metal_red: "metal_rust",
  concrete_rebar: "concrete_wall",
  plaster_pink: "concrete_rebar",
};
function Rc(
  a,
  {
    assets: t,
    wallKey: e,
    tile: o,
    floor: s = !1,
    normalScale: i = 1.2,
    paintRough: n = 0.8,
    thin: r = 0.55,
    stain: l = 0.25,
  } = {},
) {
  let u = e;
  for (let y = 0; y < 3 && Kn[u] && !t?.manifest?.textures?.[u]; y++) u = Kn[u];
  const h = t?.manifest?.textures?.[u],
    c = h?.nor ? t.texture(h.nor) : null,
    d = h?.arm ? t.texture(h.arm) : null,
    p = h?.diff ? t.texture(h.diff, !0) : null,
    f = o || ms[e] || 2,
    g = new Tt({
      map: a,
      normalMap: c,
      roughnessMap: d,
      roughness: 1,
      metalness: 0,
      normalScale: new Rt(i, i),
      transparent: !0,
      depthWrite: !1,
      alphaTest: 0.004,
      polygonOffset: !0,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -4,
    });
  ((g.name = "graffiti:" + (e || "none")), S0(g));
  const m = g.onBeforeCompile,
    w = {
      gTileInv: { value: 1 / f },
      gWallDiff: { value: p },
      gThin: { value: r },
      gStain: { value: l },
      gRoughMul: { value: n },
    };
  return (
    (g.userData.graffitiUniforms = w),
    (g.onBeforeCompile = (y, x) => {
      (m(y, x),
        Object.assign(y.uniforms, w),
        (y.vertexShader = y.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
uniform float gTileInv;
varying vec2 vGWallUv;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
        // UV del muro en espacio mundo (convenio GeoBuilder.box: verticales u=a lo largo/tile, v=y/tile; suelos u=x, v=-z)
        vec3 gWP = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vec3 gWN = normalize(mat3(modelMatrix) * objectNormal);
        vec2 gUV;
        ${
          s
            ? "gUV = vec2(gWP.x, -gWP.z);"
            : `
        if (abs(gWN.y) > 0.5) gUV = vec2(gWP.x, -gWP.z);
        else if (abs(gWN.x) > abs(gWN.z)) gUV = vec2(-gWP.z * sign(gWN.x), gWP.y);
        else gUV = vec2(gWP.x * sign(gWN.z), gWP.y);`
        }
        gUV *= gTileInv;
        vGWallUv = gUV;
        #ifdef USE_NORMALMAP
          vNormalMapUv = gUV;
        #endif
        #ifdef USE_ROUGHNESSMAP
          vRoughnessMapUv = gUV;
        #endif
      `,
          )),
        (y.fragmentShader = y.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
        varying vec2 vGWallUv;
        uniform float gThin; uniform float gStain; uniform float gRoughMul;
        ${p ? "uniform sampler2D gWallDiff;" : ""}`,
          )
          .replace(
            "#include <map_fragment>",
            `#include <map_fragment>
        #ifdef USE_ROUGHNESSMAP
          // cavidades del muro (AO del ARM bajo) → la pintura no llega bien: más fina
          float gAO = texture2D(roughnessMap, vRoughnessMapUv).r;
          diffuseColor.a *= mix(1.0 - gThin, 1.0, smoothstep(0.35, 0.9, gAO));
        #endif
        ${
          p
            ? `
          // manchas/variación del muro que transparentan a través de la pintura
          vec3 gW = texture2D(gWallDiff, vGWallUv).rgb;
          vec3 gAvg = textureLod(gWallDiff, vGWallUv, 10.0).rgb;
          float gL = dot(gW, vec3(0.2126, 0.7152, 0.0722)) / max(0.02, dot(gAvg, vec3(0.2126, 0.7152, 0.0722)));
          diffuseColor.rgb *= mix(1.0, clamp(gL, 0.55, 1.3), gStain);`
            : ""
        }
      `,
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * gRoughMul, 0.42, 1.0);
      `,
          )));
    }),
    (g.customProgramCacheKey = () =>
      "graffiti|bakedAO|" + (s ? "f" : "w") + (p ? "d" : "")),
    g
  );
}
const Oc = {
    plaster_damaged: "plaster",
    plaster_peeling: "plaster",
    plaster_pink: "plaster",
    plaster_mossy: "plaster",
    plaster_white: "plaster",
    concrete_wall: "concrete",
    concrete_rough: "concrete",
    concrete_rebar: "concrete",
    concrete_floor: "concrete",
    tiles_dirty: "concrete",
    ground_debris: "gravel",
    ground_rubble: "gravel",
    ground_mud: "dirt",
    brick_broken: "brick",
    brick_wall: "brick",
    wood_weathered: "wood",
    bark: "wood",
    metal_rust: "metal",
    metal_red: "metal",
    metal_corrugated: "metal",
    metal_grate: "metal",
  },
  Vc = {
    covered_car: "metal",
    Barrel_01: "metal",
    barrel_03: "metal",
    metal_trash_can: "metal",
    propane_tank: "metal",
    metal_jerrycan: "metal",
    utility_box_01: "metal",
    power_box_01: "metal",
    exterior_aircon_unit: "metal",
    rollershutter_door: "metal",
    steel_frame_shelves_01: "metal",
    concrete_road_barrier: "concrete",
    concrete_road_barrier_02: "concrete",
    boulder_01: "concrete",
    rock_moss_set_01: "concrete",
    trashbag: "soft",
    cement_bag: "soft",
    cardboard_box_01: "soft",
    old_bed_frame: "metal",
    old_tyre: "soft",
  },
  Xn = {
    ground_mud: { wet: 0.75, puddle: 0.35, darken: 0.6, scale: 0.12, seed: 1 },
    yard_track: { wet: 0.7, puddle: 0.4, darken: 0.42, scale: 0.18, seed: 2 },
    yard_outer: { wet: 0.65, puddle: 0.2, darken: 0.55, scale: 0.12, seed: 3 },
    yard_gravel: { wet: 0.45, puddle: 0.3, darken: 0.55, scale: 0.15, seed: 4 },
    ground_debris: { wet: 0.5, puddle: 0.2, darken: 0.6, scale: 0.15, seed: 5 },
    ground_rubble: { wet: 0.35, puddle: 0, darken: 0.65, scale: 0.2, seed: 6 },
    ground_burnt: {
      wet: 0.7,
      puddle: 0.15,
      darken: 0.55,
      scale: 0.13,
      seed: 7,
    },
  },
  Zn = {
    ground_mud: 0.16,
    yard_track: 0.14,
    yard_outer: 0.12,
    yard_gravel: 0.07,
    ground_debris: 0.06,
    ground_rubble: 0.1,
  };
function i0(a, t) {
  const e = Math.sin(a * 127.1 + t * 311.7) * 43758.5453;
  return e - Math.floor(e);
}
function ua(a, t) {
  const e = Math.floor(a),
    o = Math.floor(t),
    s = a - e,
    i = t - o,
    n = s * s * (3 - 2 * s),
    r = i * i * (3 - 2 * i),
    l = i0(e, o),
    u = i0(e + 1, o),
    h = i0(e, o + 1),
    c = i0(e + 1, o + 1);
  return l + (u - l) * n + (h - l) * r + (l - u - h + c) * n * r;
}
function Lc(a, t) {
  return (
    (ua(a * 0.35, t * 0.35) - 0.5) * 1 +
    (ua(a * 1.1 + 7, t * 1.1 + 3) - 0.5) * 0.45 +
    (ua(a * 2.7, t * 2.7) - 0.5) * 0.18
  );
}
function Fc(a, t) {
  const e = a.attributes.position,
    o = a.attributes.normal;
  for (let s = 0; s < e.count; s++) {
    if (o.getY(s) < 0.95) continue;
    const i = e.getY(s);
    if (i > 0.25 || i < -0.25) continue;
    const n = e.getX(s),
      r = e.getZ(s);
    e.setY(s, i + Lc(n, r) * t + t * 0.35);
  }
  ((e.needsUpdate = !0), a.computeVertexNormals());
}
const da = {
  metal_rust: { metal: !0, roughness: 1 },
  metal_red: { metal: !0, tint: 11545118 },
  metal_corrugated: { metal: !0, tint: 12169894 },
  metal_grate: { metal: !0 },
  concrete_rebar: { tint: 11118498 },
  ground_debris: { normal: 1, tint: 9407107 },
  ground_rubble: { normal: 1.4, tint: 10130830 },
  concrete_floor: { tint: 11578018 },
  plaster_pink: { tint: 14272960 },
  plaster_peeling: { tint: 15262422 },
  bark: { tint: 9075304 },
};

export { Cc, Fc, Oc, Rc, Vc, Xn, Zn, da };
