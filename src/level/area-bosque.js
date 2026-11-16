// level/area-bosque.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { E as Ut, I as tt, Q, V as P, Y as vt, Z as Ae, a0 as Na, a1 as Ri, a2 as I0, o as B } from "three-vendor";
import { ms } from "./builder.js";

const St = -90,
  Ot = -22.6,
  nt = -30,
  ct = 80,
  ho = -22.45,
  ds = { x: -22.5, z: 22 },
  An = {
    forest_burnt: {
      tex: "ground_burnt",
      tint: 2895152,
      normal: 1.4,
      roughness: 1.75,
      tile: 3.2,
      surface: "dirt",
    },
    forest_mud: {
      tex: "mud_wet",
      tint: 2500135,
      normal: 1.3,
      roughness: 1.6,
      tile: 2.6,
      surface: "dirt",
    },
    forest_leaves: {
      tex: "ground_leaves",
      tint: 6968372,
      normal: 1.3,
      roughness: 1.5,
      tile: 2.6,
      surface: "soft",
    },
    forest_floor: {
      tex: "ground_forest",
      tint: 5589310,
      normal: 1.2,
      roughness: 1.2,
      tile: 3,
      surface: "dirt",
    },
    forest_far: {
      tex: "ground_leaves",
      tint: 3812382,
      normal: 1,
      roughness: 1.6,
      tile: 3,
      surface: "soft",
    },
    forest_water: {
      tex: "metal_galv",
      tint: 1382427,
      metal: !1,
      roughness: 0.03,
      normal: 0.08,
      tile: 5,
      surface: "water",
    },
    log_charred: {
      tex: "bark_pine",
      tint: 1512981,
      normal: 1.6,
      roughness: 1.3,
      tile: 1.4,
      surface: "wood",
    },
    log_moss: {
      tex: "bark",
      tint: 6054466,
      normal: 1.5,
      roughness: 1.4,
      tile: 1.4,
      surface: "wood",
    },
    greenhouse_rust: {
      tex: "metal_rust",
      tint: 3812130,
      metal: !1,
      roughness: 2.3,
      normal: 0.6,
      tile: 1.2,
      surface: "metal",
    },
    forest_wall: {
      tex: "ground_mud",
      tint: 3355443,
      roughness: 1,
      tile: 4,
      surface: "dirt",
    },
  };
function Zo(a, t) {
  const e = Math.sin(a * 127.1 + t * 311.7) * 43758.5453;
  return e - Math.floor(e);
}
function mt(a, t) {
  const e = Math.floor(a),
    o = Math.floor(t);
  let s = a - e,
    i = t - o;
  ((s = s * s * (3 - 2 * s)), (i = i * i * (3 - 2 * i)));
  const n = Zo(e, o),
    r = Zo(e + 1, o),
    l = Zo(e, o + 1),
    u = Zo(e + 1, o + 1);
  return n + (r - n) * s + (l - n) * i + (n - r - l + u) * s * i;
}
function Pn(a, t) {
  return (
    mt(a, t) * 0.55 +
    mt(a * 2.03 + 17.1, t * 2.03 - 4.7) * 0.3 +
    mt(a * 4.1 - 9.3, t * 4.1 + 2.2) * 0.15
  );
}
const Ne = (a, t, e) => {
    const o = Math.max(0, Math.min(1, (e - a) / (t - a)));
    return o * o * (3 - 2 * o);
  },
  at = (a, t, e) => a + (t - a) * e;
function gs(a) {
  let t = (a * 2654435761) >>> 0;
  return () => {
    t = (t + 1831565813) | 0;
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
const ul = [
  [
    [-21.5, 22],
    [-28, 22.3],
    [-35, 19.5],
    [-44, 15],
    [-54, 11],
    [-61, 18],
    [-62, 30],
    [-58, 42],
    [-54, 53],
    [-51, 62],
    [-47, 72],
    [-45, 82],
  ],
  [
    [-44, 15],
    [-40, 4],
    [-42, -8],
    [-48, -18],
    [-52, -32],
  ],
  [
    [-61, 18],
    [-72, 12],
    [-82, 6],
    [-94, 2],
  ],
];
function dl(a, t, e, o) {
  const s = o[0] - e[0],
    i = o[1] - e[1],
    n = Math.max(
      0,
      Math.min(1, ((a - e[0]) * s + (t - e[1]) * i) / (s * s + i * i)),
    );
  return Math.hypot(a - e[0] - s * n, t - e[1] - i * n);
}
function T0(a, t) {
  let e = 1e9;
  for (const o of ul)
    for (let s = 0; s < o.length - 1; s++)
      e = Math.min(e, dl(a, t, o[s], o[s + 1]));
  return e + (mt(a * 0.4, t * 0.4) - 0.5) * 0.9;
}
const Xe = [
  { x: -33.5, z: 22.6, rx: 4.6, rz: 1.5, a: 0.06 },
  { x: -30.2, z: 19.3, rx: 1.6, rz: 0.9, a: 0.5 },
  { x: -42.5, z: 18.8, rx: 3.2, rz: 1.9, a: -0.4 },
  { x: -52, z: 25, rx: 5, rz: 2.3, a: 0.3 },
  { x: -60.5, z: 4, rx: 3.6, rz: 2, a: 1.1 },
  { x: -39, z: -11, rx: 4.2, rz: 2, a: -0.2 },
  { x: -30, z: -2, rx: 2.4, rz: 1.5, a: 0.8 },
  { x: -71, z: 22, rx: 3, rz: 2.6, a: 0 },
  { x: -76, z: -14, rx: 4.4, rz: 2.1, a: 0.5 },
  { x: -57, z: 36, rx: 2.6, rz: 1.6, a: -0.7 },
];
for (const a of Xe) ((a.c = Math.cos(a.a)), (a.s = Math.sin(a.a)));
function Hs(a, t, e) {
  const o = t - a.x,
    s = e - a.z,
    i = o * a.c + s * a.s,
    n = -o * a.s + s * a.c;
  return (
    Math.hypot(i / a.rx, n / a.rz) *
    (1 +
      (mt(t * 0.55 + 9.1, e * 0.55 - 3.7) - 0.5) * 0.4 +
      (mt(t * 1.6, e * 1.6) - 0.5) * 0.12)
  );
}
const Bo = { x0: -44.5, x1: -31.5, zc: 29.8, w: 3.6, h: 4.9 };
function A0(a, t) {
  const e = Math.max(St - a, 0, a - Ot),
    o = Math.max(nt - t, 0, t - ct);
  return Math.hypot(e, o);
}
function Di(a, t) {
  let e = (Pn(a * 0.03 + 3.1, t * 0.03 - 7.7) - 0.5) * 2.6;
  e += (mt(a * 0.11, t * 0.11) - 0.5) * 0.5;
  const o = Ne(40, 60, t);
  ((e += o * ((Pn(a * 0.05 - 11, t * 0.05 + 5) - 0.5) * 2.4)),
    (e = Math.max(-1.5, Math.min(1.5, e))));
  const s = Math.hypot(a - ds.x, (t - ds.z) * 0.8);
  let i = Ne(3.5, 17, s);
  (t > nt - 30 &&
    (i = Math.min(i, Ne(0, 7, ho - a) * 0.85 + 0.15 * Ne(0, 2, ho - a))),
    (e *= i));
  const n = T0(a, t);
  e = at(e * 0.55, e, Ne(0.8, 3, n));
  const r = A0(a, t);
  return (r > 0 && (e += 0.14 * Math.pow(r, 1.3)), e);
}
const pl = (a, t) =>
    (mt(a * 0.9 + 5.3, t * 0.9 - 1.1) - 0.5) * 0.09 +
    (mt(a * 2.3, t * 2.3) - 0.5) * 0.035,
  La = new Map();
function Ei(a) {
  let t = La.get(a);
  return (t === void 0 && ((t = Di(a.x, a.z) - 0.03), La.set(a, t)), t);
}
function it(a, t, e = !0) {
  let o = Di(a, t);
  const s = e ? pl(a, t) * Ne(2, 8, Math.hypot(a - ds.x, t - ds.z)) : 0;
  o += s;
  for (const i of Xe) {
    const n = Hs(i, a, t);
    if (n > 3) continue;
    const r = Ei(i),
      l = r + 0.03;
    if (((o = at(l + s * 0.3, o, Ne(1.5, 3, n))), n < 1.6)) {
      const u = e
          ? (mt(a * 1.7 + 7.7, t * 1.7 - 2.1) - 0.5) * 0.085 +
            (mt(a * 4.3, t * 4.3) - 0.5) * 0.03
          : 0,
        h = n < 1 ? r - 0.012 - 0.07 * (1 - n * n) : r - 0.012 + 0.3 * (n - 1);
      o = n < 1 ? h + u : Math.min(o, h + u);
    }
  }
  return o;
}
function He(a, t) {
  return (
    (49 - t) / 6 +
    (mt(a * 0.06 + 2, t * 0.06 - 3) - 0.5) * 2.4 +
    (mt(a * 0.25, t * 0.25) - 0.5) * 0.9 +
    (mt(a * 0.8 + 3.3, t * 0.8 + 1.7) - 0.5) * 0.9 +
    (mt(a * 2.1, t * 2.1) - 0.5) * 0.35
  );
}
function fl(a, t) {
  const e = He(a, t);
  if (e > -0.3) {
    let s =
      -0.6 +
      (mt(a * 0.13 - 7, t * 0.13 + 1) - 0.5) * 1.2 +
      (mt(a * 0.5, t * 0.5) - 0.5) * 0.5 +
      (mt(a * 1.7, t * 1.7) - 0.5) * 0.3;
    for (const i of Xe) {
      const n = Hs(i, a, t);
      n < 2.4 && (s = Math.max(s, (1.7 - n) * 1.2));
    }
    return (
      (s = Math.max(
        s,
        (0.9 - T0(a, t)) * 0.8 + (mt(a * 0.3 + 4, t * 0.3) - 0.5) * 0.8,
      )),
      e > 0.3
        ? s
        : at(s, 0.4 + (mt(a * 0.09, t * 0.09) - 0.45) * 2, Ne(0.3, -0.3, e))
    );
  }
  let o =
    0.75 +
    (mt(a * 0.09, t * 0.09) - 0.45) * 2 +
    (mt(a * 0.4, t * 0.4) - 0.5) * 0.3;
  return ((o = Math.min(o, T0(a, t) - 0.6 + Ne(52, 62, t) * 2.5)), o);
}
const ml = (a, t) =>
  a >= 0
    ? t >= 0
      ? "forest_mud"
      : "forest_burnt"
    : t >= 0
      ? "forest_leaves"
      : "forest_floor";
function gl(a, t, e = 0.3, o = !0) {
  const s = it(a + e, t, o) - it(a - e, t, o),
    i = it(a, t + e, o) - it(a, t - e, o);
  return new P(-s, 2 * e, -i).normalize();
}
function Wi(a, t, e) {
  return {
    x: at(a.x, t.x, e),
    y: at(a.y, t.y, e),
    z: at(a.z, t.z, e),
    nx: at(a.nx, t.nx, e),
    ny: at(a.ny, t.ny, e),
    nz: at(a.nz, t.nz, e),
    A: at(a.A, t.A, e),
    B: at(a.B, t.B, e),
    C: at(a.C, t.C, e),
  };
}
function Jo(a, t, e) {
  const o = [];
  for (let s = 0; s < a.length; s++) {
    const i = a[s],
      n = a[(s + 1) % a.length],
      r = i[t] * e,
      l = n[t] * e;
    (r >= 0 && o.push(i), r >= 0 != l >= 0 && o.push(Wi(i, n, r / (r - l))));
  }
  return o;
}
function To(a, t, e, o, s, i, n, r) {
  const l = Math.max(1, Math.round((e - t) / i)),
    u = Math.max(1, Math.round((s - o) / i)),
    h = (e - t) / l,
    c = (s - o) / u,
    d = (v, M) => {
      const _ = it(v, M, r) + n,
        S = gl(v, M, 0.3, r);
      let T = He(v, M),
        A = fl(v, M),
        z = A0(v, M) - 3.5 - mt(v * 0.3, M * 0.3) * 2.5;
      return (
        Math.abs(T) < 1e-5 && (T = 1e-5),
        Math.abs(A) < 1e-5 && (A = 1e-5),
        Math.abs(z) < 1e-5 && (z = -1e-5),
        { x: v, y: _, z: M, nx: S.x, ny: S.y, nz: S.z, A: T, B: A, C: z }
      );
    },
    p = [];
  for (let v = 0; v <= u; v++)
    for (let M = 0; M <= l; M++) p.push(d(t + M * h, o + v * c));
  const f = new Uint8Array(l * u);
  if (r)
    for (let v = 0; v < u; v++)
      for (let M = 0; M < l; M++) {
        const _ = t + (M + 0.5) * h,
          S = o + (v + 0.5) * c;
        for (const T of Xe)
          if (Hs(T, _, S) < 1.75) {
            f[v * l + M] = 1;
            break;
          }
      }
  const g = (v, M) => v >= 0 && M >= 0 && v < l && M < u && f[M * l + v] === 1,
    m = (v, M) => Wi(v, M, 0.5),
    w = (v, M) => M * (l + 1) + v,
    y = (v, M) => {
      const _ = a[v] || (a[v] = { pos: [], nor: [] });
      for (let S = 1; S < M.length - 1; S++)
        for (const T of [M[0], M[S], M[S + 1]])
          (_.pos.push(T.x, T.y, T.z), _.nor.push(T.nx, T.ny, T.nz));
    },
    x = (v) => {
      if (v.some((_) => _.C > 0)) {
        const _ = Jo(v, "C", 1);
        _.length >= 3 && y("forest_far", _);
      }
      const M = v.every((_) => _.C <= 0) ? v : Jo(v, "C", -1);
      if (!(M.length < 3))
        for (const _ of [1, -1]) {
          const S = Jo(M, "A", _);
          if (!(S.length < 3))
            for (const T of [1, -1]) {
              const A = Jo(S, "B", T);
              A.length < 3 || y(ml(_, T), A);
            }
        }
    },
    b = (v, M, _, S) => {
      Math.abs(v.y - S.y) < Math.abs(M.y - _.y)
        ? (x([v, _, S]), x([v, S, M]))
        : (x([v, _, M]), x([M, _, S]));
    };
  for (let v = 0; v < u; v++)
    for (let M = 0; M < l; M++) {
      const _ = p[w(M, v)],
        S = p[w(M + 1, v)],
        T = p[w(M, v + 1)],
        A = p[w(M + 1, v + 1)];
      if (!f[v * l + M]) {
        b(_, S, T, A);
        continue;
      }
      const z = t + M * h,
        R = o + v * c,
        k = g(M, v - 1) ? d(z + h / 2, R) : m(_, S),
        C = g(M, v + 1) ? d(z + h / 2, R + c) : m(T, A),
        O = g(M - 1, v) ? d(z, R + c / 2) : m(_, T),
        V = g(M + 1, v) ? d(z + h, R + c / 2) : m(S, A),
        F = d(z + h / 2, R + c / 2);
      (b(_, k, O, F), b(k, S, F, V), b(O, F, T, C), b(F, V, C, A));
    }
}
function wl(a) {
  const t = {};
  To(t, St - 0.6, ho, nt - 0.6, ct + 0.6, 0.6, 0, !0);
  const e = 1.2,
    o = -0.06;
  (To(t, -114, St - 0.6 + e, nt - 18, ct + 18, 2, o, !1),
    To(t, St - 0.6, ho, nt - 18, nt - 0.6 + e, 2, o, !1),
    To(t, St - 0.6, ho, ct + 0.6 - e, ct + 18, 2, o, !1),
    To(t, ho - 0.1, -4, nt - 18, -20.55, 2, o, !1));
  let s = 0;
  for (const [i, n] of Object.entries(t)) {
    const r = new Ut();
    (r.setAttribute("position", new tt(n.pos, 3)),
      r.setAttribute("normal", new tt(n.nor, 3)),
      a.geometry(i, r, null, { collide: !0, worldUV: !0 }),
      (s += n.pos.length / 9));
  }
  return s;
}
function yl(a) {
  const t = new B();
  for (const e of Xe) {
    const o = Ei(e),
      s = 24,
      i = [],
      n = [],
      r = [0.3, 0.55, 0.8, 1, 1.15, 1.3, 1.45],
      l = (c) => {
        const d = [];
        for (let p = 0; p < s; p++) {
          const f = (p / s) * Math.PI * 2;
          let g = c,
            m = 0,
            w = 0;
          for (let y = 0; y < 4; y++) {
            const x = Math.cos(f) * e.rx * g,
              b = Math.sin(f) * e.rz * g;
            ((m = e.x + x * e.c - b * e.s),
              (w = e.z + x * e.s + b * e.c),
              (g *= c / Math.max(0.05, Hs(e, m, w))));
          }
          d.push([m, w]);
        }
        return d;
      },
      u = r.map(l);
    for (let c = 0; c < s; c++) {
      const d = u[0][c],
        p = u[0][(c + 1) % s];
      i.push(e.x, o, e.z, p[0], o, p[1], d[0], o, d[1]);
    }
    for (let c = 0; c < r.length - 1; c++) {
      const d = u[c],
        p = u[c + 1];
      for (let f = 0; f < s; f++) {
        const g = (f + 1) % s;
        (i.push(d[f][0], o, d[f][1], d[g][0], o, d[g][1], p[g][0], o, p[g][1]),
          i.push(
            d[f][0],
            o,
            d[f][1],
            p[g][0],
            o,
            p[g][1],
            p[f][0],
            o,
            p[f][1],
          ));
      }
    }
    for (let c = 0; c < i.length / 3; c++) n.push(0, 1, 0);
    const h = new Ut();
    (h.setAttribute("position", new tt(i, 3)),
      h.setAttribute("normal", new tt(n, 3)),
      a.geometry("forest_water", h, t.identity(), { worldUV: !0 }));
  }
}
const ja = new P(0, 1, 0);
function ea(a, t, e, o, s, i, n, r, l, u) {
  const h = gs(l),
    c = Math.max(3, Math.ceil(i / 0.8)),
    d = [],
    p = Math.cos(s),
    f = Math.sin(s),
    g = (h() - 0.5) * 0.25;
  for (let M = 0; M <= c; M++) {
    const _ = M / c,
      S = (_ - 0.5) * i,
      T = e + p * S - f * g * 4 * _ * (1 - _) * i * 0.1,
      A = o + f * S + p * g * 4 * _ * (1 - _) * i * 0.1,
      z = at(n, r, _);
    d.push(new P(T, it(T, A) + z * 0.6, A));
  }
  const m = new Na(d),
    w = new Ri(m, c * 2, 1, 8, !1),
    y = w.attributes.position,
    x = c * 2 + 1,
    b = 9,
    v = new P();
  for (let M = 0; M < x; M++) {
    const _ = M / (x - 1);
    m.getPointAt(_, v);
    const S = at(n, r, _) * (0.92 + h() * 0.16);
    for (let T = 0; T < b; T++) {
      const A = M * b + T;
      y.setXYZ(
        A,
        v.x + (y.getX(A) - v.x) * S,
        v.y + (y.getY(A) - v.y) * S,
        v.z + (y.getZ(A) - v.z) * S,
      );
    }
  }
  (w.computeVertexNormals(),
    a.geometry(t, w, null, { worldUV: !0, collide: u }));
  for (const [M, _] of [
    [0, n],
    [1, r],
  ]) {
    const S = m.getPointAt(M),
      T = m.getTangentAt(M);
    M === 0 && T.negate();
    const A = new I0(_ * 0.97, 8),
      z = new B().compose(
        S,
        new Q().setFromUnitVectors(new P(0, 0, 1), T),
        new P(1, 1, 1),
      );
    a.geometry(t, A, z, { worldUV: !0 });
  }
  return (9 * 2 * c * 2 * 2) / 2 + 16;
}
function qi(a, t, e, o, s, i, n, r = 0.02) {
  const l = e - (Math.cos(s) * i) / 2,
    u = o - (Math.sin(s) * i) / 2,
    h = e + (Math.cos(s) * i) / 2,
    c = o + (Math.sin(s) * i) / 2,
    d = new P(l, it(l, u) + n + r, u),
    p = new P(h, it(h, c) + n * 0.7 + r, c),
    f = p.clone().sub(d),
    g = f.length();
  f.divideScalar(g);
  const m = new B().compose(
    d.clone().add(p).multiplyScalar(0.5),
    new Q().setFromUnitVectors(ja, f),
    new P(1, 1, 1),
  );
  a.geometry(t, new vt(n * 0.6, n, g, 5, 1, !0), m, { worldUV: !0 });
}
function P0(a, t, e, o, s, i, n = 6) {
  const r = new P(...e),
    l = new P(...o),
    u = l.clone().sub(r),
    h = u.length();
  if (h < 0.01) return;
  u.divideScalar(h);
  const c = new B().compose(
    r.clone().add(l).multiplyScalar(0.5),
    new Q().setFromUnitVectors(ja, u),
    new P(1, 1, 1),
  );
  a.geometry(t, new vt(i, s, h, n, 1, !0), c, { worldUV: !0 });
}
function xl(a, t, e, o, s, i, n = 4) {
  const r = gs(i),
    l = it(t, e) - 0.15,
    u = s + 0.15,
    h = new vt(o * 0.85, o, u, 10, 5, !0),
    c = h.attributes.position,
    d = r() * 6.28,
    p = 3 + ((r() * 3) | 0),
    f = [];
  for (let m = 0; m < 10; m++) f.push(r() * r() * s * 0.7);
  for (let m = 0; m < c.count; m++) {
    const w = c.getX(m),
      y = c.getZ(m),
      x = c.getY(m) + u / 2,
      b = Math.atan2(y, w),
      v =
        1 +
        0.75 * Math.exp(-x * 5) * (0.55 + 0.45 * Math.cos(p * b + d)) +
        (r() - 0.5) * 0.08;
    let M = x;
    if (x > u - 0.001) {
      const _ = Math.round(((b + Math.PI) / (2 * Math.PI)) * 10) % 10;
      M = x - f[_];
    }
    c.setXYZ(m, w * v, M, y * v);
  }
  (h.computeVertexNormals(),
    a.geometry("log_charred", h, new B().makeTranslation(t, l, e), {
      worldUV: !0,
    }));
  const g = new I0(o * 0.84, 10);
  a.geometry(
    "log_charred",
    g,
    new B()
      .makeTranslation(t, l + u - s * 0.35, e)
      .multiply(new B().makeRotationX(-Math.PI / 2)),
    { worldUV: !0 },
  );
  for (let m = 0; m < n; m++) {
    const w = d + (m / n) * 6.28 + (r() - 0.5) * 0.6,
      y = o * (2 + r() * 2.2),
      x = t + Math.cos(w) * y,
      b = e + Math.sin(w) * y,
      v = t + Math.cos(w) * o * 0.7,
      M = e + Math.sin(w) * o * 0.7,
      _ = t + Math.cos(w) * y * 0.45,
      S = e + Math.sin(w) * y * 0.45,
      T = o * (0.38 + r() * 0.15);
    (P0(
      a,
      "log_charred",
      [v, l + 0.15 + Math.min(s, 0.5) * 0.3, M],
      [_, it(_, S) + T * 0.3, S],
      T,
      T * 0.75,
    ),
      P0(
        a,
        "log_charred",
        [_, it(_, S) + T * 0.3, S],
        [x, it(x, b) - 0.08, b],
        T * 0.75,
        T * 0.3,
        5,
      ));
  }
  o > 0.15 &&
    a.box("forest_wall", [t, l + 0.15 + s / 2, e], [o * 1.8, s, o * 1.8], {
      collideOnly: !0,
    });
}
function bl(a, t, e, o, s = 3) {
  const i = gs(o);
  for (let n = 0; n < s; n++) {
    const r = i() * 6.28,
      l = 1.2 + i() * 2.2,
      u = 0.03 + i() * 0.035,
      h = t + (i() - 0.5) * 1.2,
      c = e + (i() - 0.5) * 1.2;
    if (!Xe.some((d) => Hs(d, h, c) < 1.5)) {
      qi(a, "log_charred", h, c, r, l, u, 0.03);
      for (let d = 0; d < 2; d++) {
        const p = (i() - 0.5) * l * 0.8,
          f = h + Math.cos(r) * p,
          g = c + Math.sin(r) * p,
          m = r + (i() < 0.5 ? 1 : -1) * (0.5 + i() * 0.6),
          w = 0.4 + i() * 0.8,
          y = it(f, g) + u + 0.03,
          x = f + Math.cos(m) * w,
          b = g + Math.sin(m) * w;
        P0(
          a,
          "log_charred",
          [f, y, g],
          [x, Math.max(it(x, b) + 0.02, y - 0.04 + i() * 0.1), b],
          u * 0.6,
          u * 0.25,
          4,
        );
      }
    }
  }
}
function es(a, t, e, o) {
  const s = new P(...t),
    i = new P(...e),
    n = i.clone().sub(s),
    r = n.length();
  if (r < 0.01) return;
  n.divideScalar(r);
  const l = new B().compose(
    s.clone().add(i).multiplyScalar(0.5),
    new Q().setFromUnitVectors(ja, n),
    new P(1, 1, 1),
  );
  a.geometry("greenhouse_rust", new vt(o, o, r, 6, 1, !0), l, { worldUV: !0 });
}
function vl(a) {
  const { x0: t, x1: e, zc: o, w: s, h: i } = Bo,
    n = 11,
    r = (e - t) / (n - 1),
    l = 14,
    u = (f) => [
      f * s,
      i * Math.pow(1 - Math.pow(Math.abs(f), 1.9), 0.62) -
        i * 0.05 * Math.abs(f),
    ],
    h = Math.min(it(t, o), it(e, o)) - 0.1,
    c = [],
    d = gs(77);
  for (let f = 0; f < n; f++) {
    const g = t + f * r,
      m = f === 3 ? 0.22 : f === 9 ? -0.35 : (d() - 0.5) * 0.06,
      w = f === 7 ? 0.55 : 0,
      y = f === 10,
      x = f === 5 ? 1 : 0,
      b = [];
    for (let v = 0; v <= l; v++) {
      const M = -1 + (2 * v) / l;
      let [_, S] = u(M);
      S -= w * Math.max(0, 1 - Math.abs(M) * 1.3) * 1.6;
      let T = g + Math.sin(m) * S,
        A = h + Math.cos(m) * S;
      (y && ((T = g + S * 0.9), (A = h + 0.12 + S * 0.08 + Math.abs(M) * 0.05)),
        b.push([T, A, o + _]));
    }
    c.push(b);
    for (let v = 0; v < l && !(x && v >= l / 2 - 1); v++)
      es(a, b[v], b[v + 1], 0.042);
    for (const v of [0, l]) {
      const M = b[v];
      es(a, [M[0], M[1] - 0.4, M[2]], M, 0.04);
    }
    if (!y)
      for (const v of [0, l])
        a.box("forest_wall", [b[v][0], h + 1, b[v][2]], [0.12, 2, 0.12], {
          collideOnly: !0,
        });
  }
  const p = [0, 2, 4, 7, 10, 12, 14];
  for (const f of p)
    for (let g = 0; g < n - 2; g++)
      (f === 4 && g === 6) ||
        (f === 10 && (g === 4 || g === 5)) ||
        (f === 7 && g >= 7) ||
        (f === 2 && g === 2) ||
        (g === 5 && f >= l / 2 - 1) ||
        es(a, c[g][f], c[g + 1][f], 0.028);
  for (const [f, g] of [
    [0, 3],
    [l, l - 3],
  ])
    (es(a, c[0][f], c[1][g], 0.018), es(a, c[0][g], c[1][f], 0.018));
  for (const f of [-0.45, 0.45]) {
    const [g, m] = u(f);
    (es(a, [e - r * 1, h - 0.2, o + g], [e - r * 1, h + m - 0.05, o + g], 0.03),
      es(a, [t, h - 0.2, o + g], [t, h + m - 0.05, o + g], 0.03));
  }
  {
    const [f] = u(0.45);
    es(a, [e - r, h + 2.1, o - f], [e - r, h + 2.1, o + f], 0.025);
  }
}
function Ml(a, t, e) {
  const o = [],
    s = gs(4242),
    i = (g, m, w) => {
      for (const y of o)
        if ((y.x - g) ** 2 + (y.z - m) ** 2 < Math.min(w, y.d) ** 2) return !1;
      return !0;
    },
    n = (g, m, w, y, x, b) => {
      (o.push({ x: m, z: w, d: x }),
        a.push({ type: g, pos: [m, it(m, w), w], scale: y, seed: b }));
    };
  (n("leafy", -51.6, 64.2, 1.75, 4, 2),
    n("leafy", -43.5, 66.5, 1.3, 4, 1),
    n("leafy", -58.5, 70.5, 1.45, 4, 3),
    n("conifer", -47, 74, 1.2, 3.5, 5),
    n("leafy", -56.5, 60.5, 1.15, 3.5, 6));
  for (const [g, m, w] of [
    [-36.6, 24.9, 1],
    [-40.5, 24.9, 1.05],
    [-31.5, 15.2, 1.1],
    [-46.5, 21.6, 0.95],
    [-36.5, 13.6, 1],
    [-48, 15.5, 1],
    [-28.6, 27.5, 0.95],
  ])
    n("burnt", g, m, w, 2.5, (g * 7 + m * 13) | 0);
  const r = (g, m, w) => {
    if (
      Math.hypot(g - ds.x, m - ds.z) < 5.5 ||
      (g > Bo.x0 - 1.5 && g < Bo.x1 + 1.5 && Math.abs(m - Bo.zc) < Bo.w + 1.4)
    )
      return !1;
    for (const y of Xe) if (Hs(y, g, m) < 1.25) return !1;
    if (T0(g, m) < w) return !1;
    for (const y of t) if (Math.hypot(g - y[0], m - y[1]) < y[2]) return !1;
    return !0;
  };
  let l = 0;
  const u = { burnt: 0, leafy: 0, conifer: 0, bare: 0, bare_young: 0 };
  for (; l++ < 9e3 && o.length < 165;) {
    const g = at(St + 0.8, Ot - 1, s()),
      m = at(nt + 0.8, ct - 0.8, s()),
      w = He(g, m),
      y = Math.min(g - St, Ot - g, m - nt, ct - m);
    let x = w > 0 ? 5.4 : 4;
    if ((y < 6 && (x *= 0.62), !r(g, m, 1.6) || !i(g, m, x))) continue;
    let b,
      v = 0.85 + s() * 0.35;
    (w > 0.5
      ? (b = "burnt")
      : w > -0.6
        ? (b = s() < 0.6 ? "burnt" : "bare")
        : w > -1.3 || m < 58 + (g + 60) * 0.12
          ? (b = s() < 0.45 ? "burnt" : s() < 0.6 ? "bare" : "bare_young")
          : (b =
              m > 72 || s() < 0.35 ? "conifer" : s() < 0.12 ? "bare" : "leafy"),
      b === "leafy" && (v = 0.95 + s() * 0.45),
      u[b]++,
      n(b, g, m, v, x, (s() * 1e6) | 0));
  }
  let h = 0;
  for (let g = 0; g < 4e3 && h < 110; g++) {
    const m = at(St + 0.6, Ot - 0.6, s()),
      w = at(54, ct - 0.5, s());
    if (
      He(m, w) > -1.5 ||
      w < 57 + (m + 60) * 0.12 ||
      !r(m, w, 1.2) ||
      !i(m, w, 2.2) ||
      Math.hypot(m + 50, w - 61.5) < 3.2
    )
      continue;
    const y = s() < 0.7;
    (n(
      y ? "conifer" : "bare_young",
      m,
      w,
      y ? 0.28 + s() * 0.22 : 0.8 + s() * 0.4,
      2.2,
      (s() * 1e6) | 0,
    ),
      h++);
  }
  u.understory = h;
  const c = (g, m, w, y, x, b) => {
      let v = 0,
        M = 0;
      for (; v < x && M++ < x * 40;) {
        const _ = at(g, m, s()),
          S = at(w, y, s());
        if (!i(_, S, 3.3)) continue;
        const T = b(_, S);
        (n(T, _, S, 0.9 + s() * 0.35, 3.3, (s() * 1e6) | 0), v++);
      }
    },
    d = (g, m) =>
      He(g, Math.max(nt, Math.min(ct, m))) > -1.3
        ? s() < 0.85
          ? "burnt"
          : "bare"
        : s() < 0.6
          ? "conifer"
          : "leafy";
  (c(-104, St - 1.2, nt - 12, ct + 12, 28, d),
    c(St - 1, Ot + 2, nt - 13, nt - 1.2, 18, d),
    c(St - 1, Ot - 1.5, ct + 1.2, ct + 12, 40, () =>
      s() < 0.75 ? "conifer" : "leafy",
    ),
    c(Ot + 0.6, -6, nt - 12, -22.5, 9, () => "burnt"));
  let p = 0;
  const f = (g, m, w) =>
    i(g, m, w)
      ? (o.push({ x: g, z: m, d: w }),
        _l(e, g, m, (s() * 1e6) | 0, A0(g, m) === 0),
        p++,
        !0)
      : !1;
  for (let g = 0, m = 0; g < 4e3 && m < 110; g++) {
    const w = at(St + 0.5, Ot - 0.5, s()),
      y = at(nt + 0.5, ct - 0.5, s());
    He(w, y) < 0.4 ||
      !r(w, y, 1.4) ||
      Math.hypot(w - ds.x, y - ds.z) < 9 ||
      (f(w, y, 2.6) && m++);
  }
  for (let g = 0, m = 0; g < 4e3 && m < 120; g++) {
    const w = at(-110, -4, s()),
      y = at(nt - 16, ct + 14, s());
    A0(w, y) < 0.8 ||
      (w > Ot && y > -20.6) ||
      He(w, Math.min(ct, y)) < 0.2 ||
      (f(w, y, 2.2) && m++);
  }
  return ((u.snags = p), u);
}
function _l(a, t, e, o, s) {
  const i = gs(o),
    n = 5 + i() * 11,
    r = 0.11 + i() * 0.13,
    l = new vt(r * (0.25 + i() * 0.3), r, n, 6, 2, !0),
    u = l.attributes.position;
  for (let d = 0; d < u.count; d++) {
    const p = u.getY(d) + n / 2,
      f = p / n;
    (u.setXYZ(
      d,
      u.getX(d) * (1 + (i() - 0.5) * 0.25),
      p,
      u.getZ(d) * (1 + (i() - 0.5) * 0.25),
    ),
      f > 0.99 && u.setY(d, p - i() * 0.6));
  }
  l.computeVertexNormals();
  const h = new Q().setFromEuler(
      new Ae((i() - 0.5) * 0.08, i() * 6.28, (i() - 0.5) * 0.08, "YXZ"),
    ),
    c = new B().compose(new P(t, it(t, e) - 0.3, e), h, new P(1, 1, 1));
  (a.geometry("log_charred", l, c, { worldUV: !0 }),
    s &&
      a.box("forest_wall", [t, it(t, e) + 1.5, e], [r * 1.7, 3, r * 1.7], {
        collideOnly: !0,
      }));
}
function Sl(a) {
  for (const [v, M] of Object.entries(An)) ms[v] = M.tile;
  const t = [],
    e = [],
    o = [],
    s = [],
    i = (v, M, _, S = 0, T = {}) => {
      const A =
        He(M, _) > 0 && /stump|root|dead_tree|dry_branches/.test(v)
          ? 3814706
          : void 0;
      t.push({
        model: v,
        pos: [M, it(M, _) + (T.dy || 0), _],
        rotY: S,
        ...(A ? { tint: A } : {}),
        ...T,
      });
    };
  La.clear();
  const n = wl(a);
  (yl(a),
    a.box(
      "forest_wall",
      [St - 0.3, 3, (nt + ct) / 2],
      [0.6, 12, ct - nt + 1.2],
      { collideOnly: !0 },
    ),
    a.box(
      "forest_wall",
      [(St + Ot) / 2, 3, nt - 0.3],
      [Ot - St + 1.2, 12, 0.6],
      { collideOnly: !0 },
    ),
    a.box(
      "forest_wall",
      [(St + Ot) / 2, 3, ct + 0.3],
      [Ot - St + 1.2, 12, 0.6],
      { collideOnly: !0 },
    ),
    a.box(
      "forest_wall",
      [Ot - 0.15, 3, (nt - 20) / 2],
      [0.3, 12, -20 - nt + 0.6],
      { collideOnly: !0 },
    ),
    a.box(
      "forest_wall",
      [Ot - 0.15, 3, (32 + ct) / 2],
      [0.3, 12, ct - 32 + 0.6],
      { collideOnly: !0 },
    ),
    vl(a));
  const r = [
    [-47, 5, 0.12, 11, 0.24, 0.12],
    [-29.5, 36.5, -0.3, 8, 0.2, 0.1],
    [-64, 12, 1.2, 9, 0.22, 0.14],
    [-58, -6, 0.4, 12, 0.26, 0.13],
    [-72, 30, -0.1, 10, 0.2, 0.12],
    [-44, -22, 0.9, 7, 0.18, 0.1],
    [-80, 2, 0.3, 9, 0.22, 0.12],
    [-29.5, 8.5, 1.4, 5.5, 0.16, 0.09],
    [-66, -24, -0.4, 10, 0.24, 0.12],
    [-50, 39, 0.2, 7, 0.18, 0.1],
  ];
  let l = 0;
  (r.forEach(([v, M, _, S, T, A], z) => {
    l += ea(a, "log_charred", v, M, _, S, T, A, 100 + z, T >= 0.2);
  }),
    [
      [-40, 66, 0.5, 9, 0.38, 0.2],
      [-62, 58, -0.8, 11, 0.42, 0.22],
      [-75, 72, 0.2, 8, 0.32, 0.18],
      [-33, 76, -0.3, 7, 0.3, 0.16],
      [-82, 50, 1.3, 9, 0.35, 0.2],
      [-46.5, 69.5, 2.4, 4.5, 0.2, 0.12],
    ].forEach(([v, M, _, S, T, A], z) => {
      l += ea(a, "log_moss", v, M, _, S, T, A, 200 + z, T >= 0.2);
    }));
  const h = gs(99);
  let c = 0;
  for (let v = 0; v < 520 && c < 260; v++) {
    const M = at(St + 1, Ot - 1, h()),
      _ = at(nt + 1, ct - 1, h());
    let S = !1;
    for (const R of Xe) Hs(R, M, _) < 1.1 && (S = !0);
    if (S) continue;
    const T = He(M, _) > 0;
    if (
      Math.hypot(M + 30, _ - 21) > 14 &&
      Math.hypot(M + 50, _ - 64) > 10 &&
      h() < 0.45
    )
      continue;
    const A = 0.5 + h() * h() * 2.2,
      z = 0.018 + h() * 0.03;
    (!T && h() < 0.6) ||
      (qi(
        a,
        T ? "log_charred" : "log_moss",
        M,
        _,
        h() * Math.PI * 2,
        T ? A : A * 0.7,
        T ? z : z * 0.6,
      ),
      c++);
  }
  const d = [
    [-29.6, 25, 0.2, 0.5, 1, 4],
    [-45.2, 9.5, 0.26, 0.75, 2, 5],
    [-66.5, 24.6, 0.3, 1.1, 3, 5],
    [-27.8, 16.4, 0.24, 0.35, 4, 6],
    [-38.2, 16.4, 0.18, 1.6, 5, 3],
    [-56, 14, 0.22, 0.6, 6, 4],
    [-49, 30.5, 0.2, 0.9, 7, 4],
    [-34, 6, 0.25, 0.45, 8, 5],
    [-70, 8, 0.24, 2.2, 9, 4],
    [-60, -10, 0.2, 0.7, 10, 4],
    [-43, -4, 0.28, 1.3, 11, 5],
    [-77, 26, 0.22, 0.5, 12, 4],
  ];
  for (const [v, M, _, S, T, A] of d) xl(a, v, M, _, S, 300 + T, A);
  for (const [v, M, _, S] of [
    [-29, 21, 1, 3],
    [-38, 24.6, 2, 2],
    [-41, 21.5, 3, 3],
    [-52, 7, 4, 3],
    [-63, 28.5, 5, 2],
    [-36.5, 14.6, 6, 2],
    [-47, 15.5, 7, 3],
  ])
    bl(a, v, M, 400 + _, S);
  l += ea(a, "log_charred", -36.8, 17.2, 0.5, 6.5, 0.3, 0.16, 150, !0);
  const p = (v, M, _, S, T) =>
    i("rock_moss_set_01", M, _, S, {
      filter: `^rock_moss_set_01_rock0${v}$`,
      fit: { h: T },
      dy: -T * 0.42,
    });
  (p(4, -55.5, 67.5, 0.4, 1),
    p(2, -47, 61.5, 1.3, 0.7),
    p(5, -49, 57, 2.2, 0.55),
    p(1, -62.5, 64.5, 0.8, 1.2),
    p(6, -41.5, 72.5, 2.9, 0.8),
    p(3, -70, 55, 1.7, 0.9),
    p(2, -36.5, 60, 4.1, 0.6),
    p(4, -78, 66, 5.1, 1.1),
    p(3, -45, 66, 0.6, 0.7),
    i("boulder_01", -57, 75.5, 2, { fit: { h: 0.9 }, dy: -0.2 }),
    p(5, -66, 50, 4, 0.5),
    i("tree_stump_01", -42, 55, 1, { fit: { h: 0.6 }, dy: -0.06 }),
    i("dead_tree_trunk_02", -38, 52, 0.7, { dy: -0.1 }),
    i("dry_branches_medium_01", -50, 67, 1.2, {
      collide: !1,
      filter: "^dry_branches_medium_01_a$",
    }),
    i("dry_branches_medium_01", -46, 63, 2.6, {
      collide: !1,
      filter: "^dry_branches_medium_01_b$",
    }),
    i("dry_branches_medium_01", -55.5, 66.5, 0.1, {
      collide: !1,
      filter: "^dry_branches_medium_01_c$",
    }));
  {
    const v = gs(512),
      M = -51.6,
      _ = 64.2;
    for (let S = 0; S < 5; S++) {
      const T = [-2.4, -0.75, -0.4, 0, 0.35][S] + (v() - 0.5) * 0.2,
        A = 1.4 + v() * 1.6;
      let z = M + Math.cos(T) * 0.95,
        R = _ + Math.sin(T) * 0.95,
        k = it(z, R) + 0.02,
        C = 0.13 + v() * 0.04;
      for (let O = 0; O < 3; O++) {
        const V = T + (v() - 0.5) * 0.9,
          F = A / 3,
          q = z + Math.cos(V) * F,
          I = R + Math.sin(V) * F,
          H = it(q, I) - C * (0.45 + O * 0.25);
        (P0(a, "log_moss", [z, k, R], [q, H, I], C, C * 0.8, 6),
          (z = q),
          (R = I),
          (k = H),
          (C *= 0.8));
      }
    }
  }
  const f = t
    .filter((v) => !/dry_branches/.test(v.model))
    .map((v) => [v.pos[0], v.pos[2], 1.6]);
  for (const [v, M] of d) f.push([v, M, 1.8]);
  f.push([-36.8, 17.2, 3.4]);
  const g = Ml(o, f, a),
    m = it(-25, 21.4),
    w = it(-50, 59.6),
    y = [
      {
        name: "bosque quemado (6.jpg)",
        pos: [-25, m, 21.4],
        yaw: Math.PI / 2 - 0.22,
        pitch: -0.2,
      },
      {
        name: "bosque oscuro (3.jpg)",
        pos: [-50, w, 59.6],
        yaw: 2.5,
        pitch: -0.3,
      },
    ],
    x = [
      {
        name: "bosque quemado",
        type: "outdoor",
        min: [St, -3, nt],
        max: [Ot, 30, 46],
      },
      {
        name: "bosque oscuro",
        type: "outdoor",
        min: [St, -3, 46],
        max: [Ot, 30, ct],
      },
    ],
    b = `BOSQUE x ${St}..${Ot}, z ${nt}..${ct} (muros invisibles de 12 m; faldón exterior hasta x=-114 y z ${nt - 18}..${ct + 18}, más x hasta -4 para z<-20.5). Terreno ${Math.round(n)} triángulos en 5 materiales recortados por isolíneas (incl. faldón oscuro forest_far). Árboles: ${o.length} (interior ${JSON.stringify(g)}). Charcos: ${Xe.length} (forest_water, sin colisión). Semántica de audio: 'forest' (exterior sin ecos de fachada). Exposición recomendada en 'bosque quemado': post.params.exposureBias ≈ 0.5.`;
  return {
    props: t,
    decals: e,
    trees: o,
    lights: s,
    zones: x,
    bench: y,
    materials: An,
    notes: b,
    heightAt: it,
  };
}

export { Sl };
