// world/trees.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { E as Ut, I as tt, L as $a, Q, V as P, Z as Ae, a3 as $t, a6 as S0, a7 as pr, a8 as fr, a9 as Oi, aa as mr, ab as gr, ac as Vi, ad as wr, ae as Se, af as yr, ag as xr, d as Tt, o as B, s as Eo, v as Te } from "three-vendor";

const pe = Math.PI * 2,
  Ua = new P(0, 1, 0),
  kt = {
    twigA: 0,
    twigB: 1,
    fine: 2,
    leafA: 3,
    leafB: 4,
    conifer: 5,
    dead: 6,
    mass: 7,
  },
  ee = 2048,
  Ye = 2048,
  bt = 512,
  Mt = 1024,
  Ln = { bare: 4, bare_young: 3, burnt: 6, leafy: 2, conifer: 3 },
  Fn = {
    bare: "decid",
    bare_young: "decid",
    leafy: "decid",
    conifer: "pine",
    burnt: "burnt",
  },
  Dl = 38;
function _e(a) {
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
class Gt {
  constructor() {
    ((this.pos = []),
      (this.nor = []),
      (this.uv = []),
      (this.col = []),
      (this.ao = []),
      (this.idx = []));
  }
  get count() {
    return this.pos.length / 3;
  }
  vert(t, e, o, s, i, n) {
    (this.pos.push(t.x, t.y, t.z),
      this.nor.push(e.x, e.y, e.z),
      this.uv.push(o, s),
      this.col.push(i[0], i[1], i[2]),
      this.ao.push(Math.round(n[0] * 255), Math.round(n[1] * 255)));
  }
  toGeometry() {
    const t = new Ut();
    return (
      t.setAttribute("position", new tt(this.pos, 3)),
      t.setAttribute("normal", new tt(this.nor, 3)),
      t.setAttribute("uv", new tt(this.uv, 2)),
      t.setAttribute(
        "color",
        new Se(
          new Uint8Array(
            this.col.map((e) =>
              Math.max(0, Math.min(255, Math.round(e * 255))),
            ),
          ),
          3,
          !0,
        ),
      ),
      t.setAttribute("bakedAO", new Se(new Uint8Array(this.ao), 2, !0)),
      t.setIndex(
        this.count > 65535 ? new yr(this.idx, 1) : new xr(this.idx, 1),
      ),
      t.computeBoundingBox(),
      t.computeBoundingSphere(),
      t
    );
  }
}
const Qt = new P(),
  Qo = new P(),
  Xs = new P(),
  t0 = new P(),
  cs = new P(),
  Bn = new P(),
  In = new P(),
  Un = new P(),
  Dn = [1, 1, 1];
function gt(a, t, e, o) {
  const s = t.length,
    i = o.radial,
    n = o.tex || 1.1,
    r = a.count,
    l = e[0],
    u = pe * l,
    h = l > 0.12 ? Math.max(1, Math.round(u / n)) : Math.max(0.12, u / n);
  let c = 0;
  for (let d = 0; d < s; d++) {
    const p = t[d];
    if (
      (d === 0
        ? Qt.subVectors(t[1], t[0]).normalize()
        : d === s - 1
          ? Qt.subVectors(t[s - 1], t[s - 2]).normalize()
          : Qt.subVectors(t[d + 1], t[d - 1]).normalize(),
      d === 0)
    )
      (Un.set(Math.abs(Qt.x) < 0.9 ? 1 : 0, Math.abs(Qt.x) < 0.9 ? 0 : 1, 0),
        Qo.crossVectors(Qt, Un).normalize());
    else {
      Xs.crossVectors(In, Qt);
      const w = Xs.length();
      (w > 1e-6 &&
        (Xs.multiplyScalar(1 / w),
        Qo.applyAxisAngle(Xs, Math.asin(Math.min(1, w)))),
        (c += t[d].distanceTo(t[d - 1])));
    }
    (In.copy(Qt), Xs.crossVectors(Qt, Qo).normalize());
    const f = d / (s - 1),
      g =
        d < s - 1
          ? (e[d] - e[d + 1]) / Math.max(0.01, t[d].distanceTo(t[d + 1]))
          : 0,
      m = o.ao ? o.ao(p.y, f) : [1, 1];
    for (let w = 0; w <= i; w++) {
      const y = (w / i) * pe;
      t0.copy(Qo).multiplyScalar(Math.cos(y)).addScaledVector(Xs, Math.sin(y));
      let x = e[d] * (o.shape ? o.shape(p.y, y, d) : 1);
      (cs.copy(p).addScaledVector(t0, x),
        o.jagged &&
          d === s - 1 &&
          cs.addScaledVector(Qt, o.rnd() ** 1.5 * o.jagged),
        Bn.copy(t0).addScaledVector(Qt, g).normalize());
      const b = o.color ? o.color(p.y, y, f, t0.y) : Dn;
      a.vert(cs, Bn, (w / i) * h, c / n, b, m);
    }
    if (d > 0) {
      const w = r + (d - 1) * (i + 1),
        y = r + d * (i + 1);
      for (let x = 0; x < i; x++)
        a.idx.push(w + x, w + x + 1, y + x + 1, w + x, y + x + 1, y + x);
    }
  }
  if (o.cap) {
    const d = r + (s - 1) * (i + 1),
      p = a.count;
    (cs.copy(t[s - 1]).addScaledVector(Qt, e[s - 1] * (o.jagged ? -0.3 : 0.3)),
      a.vert(
        cs,
        Qt,
        0.5,
        c / n,
        o.color ? o.color(cs.y, 0, 1, 1) : Dn,
        o.ao ? o.ao(cs.y, 1) : [1, 1],
      ));
    for (let f = 0; f < i; f++) a.idx.push(d + f, d + f + 1, p);
  }
}
function oe(
  a,
  t,
  e,
  o,
  s,
  i,
  n,
  { up: r = 0, wob: l = 0.1, droop: u = 0, kink: h = 0 } = {},
) {
  const c = [a.clone()],
    d = [o],
    p = t.clone().normalize(),
    f = a.clone(),
    g = e / i;
  for (let m = 1; m <= i; m++) {
    ((p.x += (n() - 0.5) * l),
      (p.y += (n() - 0.5) * l * 0.6 + r - u * (m / i)),
      (p.z += (n() - 0.5) * l),
      h && n() < 0.3 && ((p.x += (n() - 0.5) * h), (p.z += (n() - 0.5) * h)),
      p.normalize(),
      f.addScaledVector(p, g),
      c.push(f.clone()));
    const w = m / i;
    d.push(o + (s - o) * Math.pow(w, 0.8));
  }
  return {
    pts: c,
    rad: d,
    dirAt: (m) => {
      const w = Math.min(i - 1, Math.floor(m * i));
      return c[w + 1].clone().sub(c[w]).normalize();
    },
    at: (m) => El(c, m),
    radAt: (m) => Wl(d, m),
  };
}
function El(a, t) {
  const e = t * (a.length - 1),
    o = Math.min(a.length - 2, Math.floor(e));
  return a[o].clone().lerp(a[o + 1], e - o);
}
function Wl(a, t) {
  const e = t * (a.length - 1),
    o = Math.min(a.length - 2, Math.floor(e));
  return a[o] + (a[o + 1] - a[o]) * (e - o);
}
function z0(a, t = new P()) {
  const e = a() * 2 - 1,
    o = a() * pe,
    s = Math.sqrt(1 - e * e);
  return t.set(s * Math.cos(o), e, s * Math.sin(o));
}
function Ns(a, t) {
  return new P(
    Math.cos(a) * Math.cos(t),
    Math.sin(t),
    Math.sin(a) * Math.cos(t),
  );
}
const Zs = new P(),
  e0 = new P(),
  s0 = new P(),
  En = new P();
function Xt(
  a,
  t,
  e,
  o,
  s,
  i,
  n,
  r,
  { centered: l = !1, tint: u = 1, side: h = null, aoNear: c = null } = {},
) {
  (h ? Zs.copy(h) : (z0(n, En), Zs.crossVectors(e, En)),
    Zs.lengthSq() < 1e-6 && Zs.set(1, 0, 0),
    Zs.normalize());
  const d = i % 4,
    p = (i / 4) | 0,
    f = 2 / ee,
    g = 2 / Ye,
    m = (d * bt) / ee + f,
    w = ((d + 1) * bt) / ee - f,
    y = ((p + 1) * Mt) / Ye - g,
    x = (p * Mt) / Ye + g,
    b = a.count,
    v = [u, u, u];
  for (let M = 0; M < 4; M++) {
    const _ = M === 0 || M === 3 ? -0.5 : 0.5,
      S = M < 2 ? 0 : 1;
    (e0
      .copy(t)
      .addScaledVector(Zs, _ * o)
      .addScaledVector(e, l ? (S - 0.5) * s : S * s),
      s0.subVectors(e0, r.c),
      (s0.y *= 0.55),
      s0.normalize().addScaledVector(Ua, 0.35).normalize());
    const T = Math.min(1, e0.distanceTo(r.c) / r.r),
      A = c ?? 0.5 + 0.5 * T;
    a.vert(e0, s0, _ < 0 ? m : w, S ? x : y, v, [A, r.sky]);
  }
  a.idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
}
const je =
    (a = 0, t = 1.6) =>
    (e, o, s, i) => {
      const n =
          a *
          Math.max(0, 1 - e / t) *
          (0.6 + 0.4 * Math.max(0, Math.sin(o * 2 + 1.3))) *
          (0.7 + 0.3 * Math.max(0, i + 0.3)),
        r = 0.92 + 0.08 * Math.sin(e * 3.1 + o);
      return [r * (1 - n * 0.62), r * (1 - n * 0.12), r * (1 - n * 0.75)];
    },
  D0 = (a, t, e, o) => (s, i) =>
    1 +
    a *
      Math.exp(-Math.max(0, s) / t) *
      (1 + 0.45 * Math.sin(e * i + o) + 0.2 * Math.sin((e + 2) * i + o * 2));
function ql(a) {
  const t = _e(a * 31 + 7),
    e = new Gt(),
    o = new Gt(),
    s = new Gt(),
    i = 11 + t() * 6,
    n = 0.11 + t() * 0.07,
    r = { c: new P(0, i * 0.62, 0), r: i * 0.4, sky: 0.8 },
    l = oe(
      new P(0, -0.4, 0),
      new P((t() - 0.5) * 0.1, 1, (t() - 0.5) * 0.1),
      i,
      n,
      0.014,
      14,
      t,
      { up: 0.03, wob: 0.09, kink: 0.08 },
    ),
    u = {
      radial: 9,
      tex: 1.2,
      shape: D0(0.3, 0.45, 5, t() * 6),
      color: je(0.3),
      ao: (m) => [
        0.6 + 0.4 * Math.min(1, (m + 0.2) / 2.5),
        0.8 + 0.15 * Math.min(1, m / 4),
      ],
      cap: !1,
    };
  (gt(e, l.pts, l.rad, u), gt(o, l.pts, l.rad, { ...u, radial: 5 }));
  const h = () => [0.88, 0.92],
    c = [kt.twigA, kt.twigB],
    d = () => c[(t() * 2) | 0],
    p = 0.2 + t() * 0.1,
    f = 16 + Math.floor(t() * 8),
    g = new P();
  for (let m = 0; m < f; m++) {
    const w = p + (0.9 - p) * (m / f) + (t() - 0.5) * 0.03,
      y = l.at(w),
      x = l.radAt(w),
      b = m * 2.39996 + t() * 0.7,
      v = 0.75 + t() * 0.45 + w * 0.2,
      M = i * (0.2 + t() * 0.16) * (1 - 0.6 * Math.max(0, w - 0.5)),
      _ = Math.max(0.018, x * (0.4 + t() * 0.15)),
      S = oe(y, Ns(b, Math.min(1.4, v)), M, _, 0.008, 5, t, {
        up: 0.07,
        wob: 0.22,
        kink: 0.25,
      }),
      T = { radial: 5, tex: 1, color: je(0), ao: h };
    (gt(e, S.pts, S.rad, T), gt(o, S.pts, S.rad, { ...T, radial: 3 }));
    const A = 3 + Math.floor(M / 0.9);
    for (let R = 0; R < A; R++) {
      const k = R === A - 1 ? 0.9 : 0.3 + 0.55 * (R / A) + t() * 0.08;
      g.set((t() - 0.5) * 0.9, 0.55 + t() * 0.5, (t() - 0.5) * 0.9);
      const C = S.dirAt(k).add(g).normalize(),
        O = (R === A - 1 ? 1.9 : 1.35) * (0.75 + t() * 0.5);
      Xt(s, S.at(k), C, O * 0.62, O, d(), t, r, { tint: 0.85 + t() * 0.3 });
    }
    const z = 2 + Math.floor(t() * 2);
    for (let R = 0; R < z; R++) {
      const k = 0.25 + 0.55 * t(),
        C = S.at(k),
        O = S.dirAt(k)
          .addScaledVector(z0(t), 0.7)
          .add(g.set(0, 0.4, 0))
          .normalize(),
        V = oe(
          C,
          O,
          M * (0.3 + t() * 0.2),
          Math.max(0.008, S.radAt(k) * 0.6),
          0.005,
          3,
          t,
          { up: 0.08, wob: 0.35, kink: 0.4 },
        );
      (gt(e, V.pts, V.rad, { radial: 3, tex: 0.8, color: je(0), ao: h }),
        g.set((t() - 0.5) * 0.8, 0.5, (t() - 0.5) * 0.8));
      const F = 1 + t() * 0.6;
      Xt(
        s,
        V.at(0.8),
        V.dirAt(0.8).add(g).normalize(),
        F * 0.62,
        F,
        d(),
        t,
        r,
        { tint: 0.85 + t() * 0.3 },
      );
    }
  }
  for (let m = 0; m < 3; m++) {
    const w = new P((t() - 0.5) * 0.4, 1, (t() - 0.5) * 0.4).normalize(),
      y = 1.8 + t() * 1;
    Xt(s, l.at(0.84 + t() * 0.1), w, y * 0.6, y, c[m & 1], t, r);
  }
  for (let m = 0; m < 10; m++) {
    const w = p + t() * (0.85 - p),
      y = new P((t() - 0.5) * 0.5, 1, (t() - 0.5) * 0.5).normalize(),
      x = 1.4 + t() * 1.4;
    Xt(s, l.at(w), y, x * 0.45, x, kt.mass, t, r, { tint: 0.85 + t() * 0.2 });
  }
  return { wood: e, woodFar: o, cards: s, r: n * 1.15, h: i * 0.75 };
}
function $l(a) {
  const t = _e(a * 17 + 3),
    e = new Gt(),
    o = new Gt(),
    s = new Gt(),
    i = 3.6 + t() * 3.2,
    n = 0.035 + t() * 0.03,
    r = { c: new P(0, i * 0.7, 0), r: i * 0.35, sky: 0.92 },
    l = oe(
      new P(0, -0.2, 0),
      new P((t() - 0.5) * 0.2, 1, (t() - 0.5) * 0.2),
      i,
      n,
      0.006,
      9,
      t,
      { up: 0.02, wob: 0.12, kink: 0.1 },
    ),
    u = {
      radial: 6,
      tex: 0.7,
      color: je(0.15, 0.6),
      ao: (c) => [0.7 + 0.3 * Math.min(1, c / 1.5), 0.9],
    };
  (gt(e, l.pts, l.rad, u), gt(o, l.pts, l.rad, { ...u, radial: 4 }));
  const h = 7 + Math.floor(t() * 4);
  for (let c = 0; c < h; c++) {
    const d = 0.3 + 0.6 * (c / h) + t() * 0.05,
      p = l.at(d),
      f = oe(
        p,
        Ns(c * 2.4 + t(), 0.75 + t() * 0.5),
        i * (0.18 + t() * 0.18),
        Math.max(0.008, l.radAt(d) * 0.55),
        0.004,
        4,
        t,
        { up: 0.07, wob: 0.3, kink: 0.3 },
      );
    gt(e, f.pts, f.rad, {
      radial: 3,
      tex: 0.6,
      color: je(0),
      ao: () => [0.9, 0.92],
    });
    for (let g = 0; g < 3; g++) {
      const m = g === 2 ? 0.95 : 0.35 + g * 0.25,
        w = f
          .dirAt(m)
          .add(new P((t() - 0.5) * 0.6, 0.4, (t() - 0.5) * 0.6))
          .normalize(),
        y = 0.8 + t() * 0.7;
      Xt(s, f.at(m), w, y * 0.55, y, kt.fine, t, r, { tint: 0.9 + t() * 0.2 });
    }
  }
  for (let c = 0; c < 3; c++) {
    const d = new P((t() - 0.5) * 0.5, 1, (t() - 0.5) * 0.5).normalize();
    Xt(s, l.at(0.82 + c * 0.05), d, 0.6, 1.1 + t() * 0.5, kt.fine, t, r);
  }
  return { wood: e, woodFar: o, cards: s, r: Math.max(0.05, n), h: i * 0.6 };
}
function Gl(a) {
  const t = _e(a * 13 + 101),
    e = new Gt(),
    o = new Gt(),
    s = new Gt(),
    i = (a - 1) % 6,
    n = i === 3,
    r = i === 4,
    l = n ? 3.5 + t() * 3.5 : 13 + t() * 10,
    u = 0.12 + t() * 0.11,
    h = { c: new P(0, l * 0.8, 0), r: 3, sky: 0.95 },
    c = new P(
      (t() - 0.5) * (i === 5 ? 0.18 : 0.05),
      1,
      (t() - 0.5) * (i === 5 ? 0.18 : 0.05),
    ),
    d = n ? u * 0.8 : u * (0.18 + t() * 0.12),
    p = oe(new P(0, -0.3, 0), c, l, u, d, n ? 8 : 18, t, {
      wob: i === 5 ? 0.04 : 0.018,
    }),
    f = t() * 6,
    g = 3 + ((t() * 2) | 0),
    m = (S, T, A) => {
      const z =
        Math.max(
          0,
          Math.sin(T * g + f + Math.sin(S * 0.7) * 1.5) *
            Math.sin(S * 2.3 + T * 2),
        ) ** 2;
      let R;
      return (
        r
          ? (R = 0.42 + 0.14 * z - 0.2 * Math.max(0, 1 - S / 2.5))
          : (R = 0.1 + 0.2 * z + 0.05 * A - 0.05 * Math.max(0, 1 - S / 1.2)),
        [R * 1.02, R, R * 0.95]
      );
    },
    w = [];
  for (let S = 0; S < 40; S++) w.push(0.94 + t() * 0.12);
  const y = (S, T, A) =>
      x(S, T) * w[(A * 3 + (((T % (pe - 1e-6)) * 1.6) | 0)) % 40],
    x = D0(0.3, 0.35, 4, t() * 6),
    b = {
      radial: 10,
      tex: 1.4,
      shape: y,
      color: m,
      ao: (S) => [0.6 + 0.4 * Math.min(1, (S + 0.2) / 1.6), 0.95],
      cap: !0,
      jagged: n ? u * 3.5 : u * 3,
      rnd: t,
    };
  (gt(e, p.pts, p.rad, b), gt(o, p.pts, p.rad, { ...b, radial: 6 }));
  const v = p.pts[p.pts.length - 1],
    M = 1 + ((t() * 2) | 0);
  for (let S = 0; S < M; S++) {
    const T = p
        .dirAt(0.99)
        .add(new P((t() - 0.5) * 0.25, 0, (t() - 0.5) * 0.25))
        .normalize(),
      A = v.clone().add(new P((t() - 0.5) * d, -0.05, (t() - 0.5) * d)),
      z = oe(
        A,
        T,
        (n ? 0.6 : 0.3) + t() * (n ? 1.4 : 1.6),
        d * 0.55,
        0.004,
        3,
        t,
        { wob: 0.1 },
      );
    (gt(e, z.pts, z.rad, {
      radial: 4,
      tex: 0.6,
      color: m,
      ao: () => [0.9, 0.95],
    }),
      gt(o, z.pts, z.rad, {
        radial: 3,
        tex: 0.6,
        color: m,
        ao: () => [0.9, 0.95],
      }));
  }
  const _ = n ? 3 + Math.floor(t() * 3) : 8 + Math.floor(t() * 8);
  for (let S = 0; S < _; S++) {
    const T = 0.25 + t() * 0.72,
      A = p.at(T),
      z = p.radAt(T),
      R = !n && T > 0.55 && t() < 0.35,
      k = Ns(t() * pe, R ? -0.1 + t() * 0.5 : -0.3 + t() * 0.5),
      C = R ? 0.8 + t() * 1.6 : 0.08 + t() * 0.45,
      O = oe(
        A,
        k,
        C,
        Math.max(0.012, z * (R ? 0.18 : 0.3 + t() * 0.15)),
        R ? 0.004 : 0.01,
        R ? 4 : 2,
        t,
        { droop: R ? 0.25 : 0.1, wob: 0.25, kink: R ? 0.5 : 0 },
      );
    if (
      (gt(e, O.pts, O.rad, {
        radial: R ? 3 : 4,
        tex: 0.6,
        color: m,
        ao: () => [0.85, 0.95],
        cap: !R,
        jagged: 0.03,
        rnd: t,
      }),
      R &&
        gt(o, O.pts, O.rad, {
          radial: 3,
          tex: 0.6,
          color: m,
          ao: () => [0.85, 0.95],
        }),
      R && t() < 0.6)
    ) {
      const V = O.dirAt(0.8)
        .add(new P(0, 0.3, 0))
        .normalize();
      Xt(s, O.at(0.7), V, 0.45, 0.8 + t() * 0.5, kt.dead, t, h, {
        tint: r ? 2.2 : 1,
        aoNear: 0.9,
      });
    }
  }
  return { wood: e, woodFar: o, cards: s, r: u * 1.1, h: l };
}
function Nl(a) {
  const t = _e(a * 19 + 55),
    e = new Gt(),
    o = new Gt(),
    s = new Gt(),
    i = 16 + t() * 6,
    n = 0.4 + t() * 0.15,
    r = { c: new P(0, i * 0.68, 0), r: i * 0.33, sky: 0.55 },
    l = oe(
      new P(0, -0.5, 0),
      new P((t() - 0.5) * 0.1, 1, (t() - 0.5) * 0.1),
      i * 0.6,
      n,
      n * 0.45,
      16,
      t,
      { wob: 0.05 },
    ),
    u = je(1, 2.2),
    h = {
      radial: 16,
      tex: 1.3,
      shape: D0(0.85, 0.6, 5, t() * 6),
      color: u,
      ao: (f) => [
        0.5 + 0.5 * Math.min(1, (f + 0.4) / 3),
        0.62 + 0.25 * Math.min(1, f / 8),
      ],
    };
  (gt(e, l.pts, l.rad, h), gt(o, l.pts, l.rad, { ...h, radial: 10 }));
  const c = 7 + Math.floor(t() * 3);
  for (let f = 0; f < c; f++) {
    const g = (f / c) * pe + t() * 0.5,
      m = new P(
        Math.cos(g) * n * 0.3,
        0.45 + t() * 0.25,
        Math.sin(g) * n * 0.3,
      ),
      w = oe(
        m,
        Ns(g, -0.42),
        0.9 + t() * 0.8,
        n * (0.42 + t() * 0.1),
        0.04,
        6,
        t,
        { droop: 0.3, wob: 0.2 },
      ),
      y = { radial: 7, tex: 0.9, color: u, ao: () => [0.6, 0.62] };
    (gt(e, w.pts, w.rad, y), gt(o, w.pts, w.rad, { ...y, radial: 5 }));
  }
  l.pts[l.pts.length - 1];
  const d = [kt.leafA, kt.leafB],
    p = 7 + Math.floor(t() * 4);
  for (let f = 0; f < p; f++) {
    const g = 0.55 + 0.45 * (f / p),
      m = l.at(Math.min(1, g)),
      w = l.radAt(Math.min(1, g)),
      y = f * 2.39996 + t() * 0.5,
      x = i * (0.32 + t() * 0.14),
      b = oe(m, Ns(y, 0.55 + t() * 0.45), x, w * 0.55, 0.03, 7, t, {
        up: 0.04,
        wob: 0.18,
        kink: 0.15,
      }),
      v = {
        radial: 8,
        tex: 1.1,
        color: je(0.25, i),
        ao: () => [0.75, 0.5],
        cap: !0,
      };
    (gt(e, b.pts, b.rad, v), gt(o, b.pts, b.rad, { ...v, radial: 5 }));
    const M = 3 + Math.floor(t() * 2);
    for (let _ = 0; _ < M; _++) {
      const S = 0.35 + 0.6 * (_ / M),
        T = b.at(S),
        A = new P(T.x, 0, T.z).normalize(),
        z = b
          .dirAt(S)
          .addScaledVector(A, 0.6)
          .addScaledVector(z0(t), 0.5)
          .normalize(),
        R = oe(T, z, x * (0.3 + t() * 0.2), b.radAt(S) * 0.6, 0.01, 3, t, {
          wob: 0.3,
          droop: 0.1,
        });
      gt(e, R.pts, R.rad, {
        radial: 4,
        tex: 0.8,
        color: je(0),
        ao: () => [0.7, 0.5],
      });
      for (let k = 0; k < 4; k++) {
        const C = 0.4 + 0.6 * (k / 3),
          O = R.dirAt(C)
            .add(new P(t() - 0.5, 0.2 + t() * 0.4, t() - 0.5))
            .normalize(),
          V = 2 + t() * 1.4;
        Xt(s, R.at(C), O, V * 0.75, V, d[(t() * 2) | 0], t, r, {
          tint: 0.75 + t() * 0.4,
        });
      }
    }
  }
  for (let f = 0; f < 26; f++) {
    const g = r.c
        .clone()
        .add(
          new P(
            (t() - 0.5) * r.r * 1.6,
            (t() - 0.4) * r.r * 0.9,
            (t() - 0.5) * r.r * 1.6,
          ),
        ),
      m = 2.6 + t() * 1.4;
    Xt(
      s,
      g,
      z0(t)
        .add(new P(0, 0.6, 0))
        .normalize(),
      m * 0.75,
      m,
      d[f & 1],
      t,
      r,
      { centered: !0, tint: 0.65 + t() * 0.3 },
    );
  }
  return { wood: e, woodFar: o, cards: s, r: n * 1.25, h: i * 0.6 };
}
function Hl(a) {
  const t = _e(a * 23 + 9),
    e = new Gt(),
    o = new Gt(),
    s = new Gt(),
    i = 14 + t() * 9,
    n = 0.2 + t() * 0.1,
    r = { c: new P(0, i * 0.5, 0), r: i * 0.35, sky: 0.6 },
    l = oe(new P(0, -0.3, 0), new P(0, 1, 0), i, n, 0.02, 12, t, { wob: 0.02 }),
    u = {
      radial: 8,
      tex: 1.2,
      shape: D0(0.3, 0.4, 5, t() * 6),
      color: je(0.3, 1.2),
      ao: (d) => [0.55 + 0.45 * Math.min(1, (d + 0.2) / 3), 0.65],
    };
  (gt(e, l.pts, l.rad, u), gt(o, l.pts, l.rad, { ...u, radial: 6 }));
  const h = 2.2 + t() * 1.5;
  let c = t() * pe;
  for (let d = h; d < i - 0.4; d += 0.36 + t() * 0.18) {
    const p = (d - h) / (i - h),
      f = 0.35 + (2.6 + t() * 0.8) * Math.pow(1 - p, 0.95),
      g = 5 + ((t() * 2) | 0);
    c += 0.7;
    for (let m = 0; m < g; m++) {
      const w = c + (m / g) * pe + t() * 0.4,
        y = 0.1 - 0.35 * (1 - p) + t() * 0.15,
        x = Ns(w, y),
        b = l.at(Math.min(1, (d + 0.3) / i)),
        v = new P(-Math.sin(w), 0, Math.cos(w)),
        M = 0.7 + t() * 0.35,
        _ = 0.45 + 0.35 * p;
      (v.applyAxisAngle(x, (t() - 0.5) * 0.5),
        Xt(s, b, x, f * 0.8, f, kt.conifer, t, r, {
          side: v,
          tint: M,
          aoNear: _,
        }),
        Xt(s, b, x, f * 0.6, f * 0.95, kt.conifer, t, r, {
          side: cs.crossVectors(x, v).normalize().clone(),
          tint: M * 0.9,
          aoNear: _ * 0.9,
        }));
    }
  }
  (Xt(s, l.at(0.93), Ua, 0.8, 1.6, kt.conifer, t, r, {
    tint: 0.9,
    aoNear: 0.85,
  }),
    Xt(s, l.at(0.93), Ua, 0.8, 1.6, kt.conifer, t, r, {
      tint: 0.9,
      aoNear: 0.85,
    }));
  for (let d = 0; d < 4; d++) {
    const p = t() * pe,
      f = Ns(p, -0.1);
    Xt(s, l.at((1 + t() * (h - 1)) / i), f, 0.6, 1 + t() * 0.6, kt.dead, t, r, {
      tint: 1.4,
      aoNear: 0.6,
    });
  }
  return { wood: e, woodFar: o, cards: s, r: n * 1.15, h: i * 0.7 };
}
const Wn = { bare: ql, bare_young: $l, burnt: Gl, leafy: Nl, conifer: Hl };
function Yl(a, t, e) {
  return `rgb(${(a[0] + (t[0] - a[0]) * e) | 0},${(a[1] + (t[1] - a[1]) * e) | 0},${(a[2] + (t[2] - a[2]) * e) | 0})`;
}
function Hi() {
  const a = document.createElement("canvas");
  ((a.width = ee), (a.height = Ye));
  const t = a.getContext("2d", { willReadFrequently: !0 });
  ((t.lineCap = "round"), (t.lineJoin = "round"));
  const e = (h) => ({ x: (h % 4) * bt, y: ((h / 4) | 0) * Mt });
  function o(h, c, d, p, f, g, m, w, y) {
    const x = y.seg[0] + h() * y.seg[1],
      b = Math.max(2, Math.round(g / x));
    let v = h() < 0.5 ? 1 : -1;
    for (let M = 0; M < b; M++) {
      const _ = M / b;
      ((f += v * y.zig * (0.5 + h()) + (h() - 0.5) * y.wob),
        (f += (y.target - f) * y.pull));
      const S = 34;
      (d < c.x + S &&
        (f += 0.35 * (f < -Math.PI / 2 ? 1 : 0.3) * ((c.x + S - d) / S)),
        d > c.x + bt - S && (f -= 0.35 * ((d - (c.x + bt - S)) / S)));
      const T = d + Math.cos(f) * x,
        A = p + Math.sin(f) * x;
      if (A < c.y + 14 || T < c.x + 6 || T > c.x + bt - 6) return;
      const z = Math.max(y.minW, m * (1 - _ * y.taper));
      if (
        ((t.strokeStyle = Yl(
          y.cBase,
          y.cTip,
          Math.min(1, ((y.depth0 - w) / y.depth0) * 0.7 + _ * 0.3) *
            (0.8 + h() * 0.4),
        )),
        (t.lineWidth = z),
        t.beginPath(),
        t.moveTo(d, p),
        t.lineTo(T, A),
        t.stroke(),
        y.leaf && w <= y.leafDepth && h() < y.leaf && y.leafFn(h, T, A, f),
        w > 0 && M > 0 && h() < y.branch)
      ) {
        const R = f + v * (y.spread[0] + h() * y.spread[1]);
        o(
          h,
          c,
          T,
          A,
          R,
          (g - M * x) * (y.childLen[0] + h() * y.childLen[1]),
          z * y.childW,
          w - 1,
          y,
        );
      }
      ((v = -v), (d = T), (p = A));
    }
    y.leaf && y.leafFn && y.leafFn(h, d, p, f, !0);
  }
  function s(h, c, d, p, f, g, m, w, y) {
    const x = Math.max(3, Math.round(g / 14)),
      b = g / x;
    let v = h() < 0.5 ? 1 : -1,
      M = (y.latStart + h() * 0.15) * x;
    for (let _ = 0; _ < x; _++) {
      const S = _ / x;
      f += (h() - 0.5) * y.wob + (y.target - f) * y.pull;
      const T = 20;
      d < c.x + T ? (f += 0.25) : d > c.x + bt - T && (f -= 0.25);
      const A = d + Math.cos(f) * b,
        z = p + Math.sin(f) * b;
      if (z < c.y + 6) return;
      const R = Math.max(y.minW, m * (1 - S * 0.55)),
        k = (0.82 + h() * 0.3) * (1 - (w / (y.depth0 + 1)) * 0.25),
        C = y.depth0 - w,
        O = y.cBase.map(
          (V, F) =>
            Math.min(
              255,
              (V + (y.cTip[F] - V) * Math.min(1, C / y.depth0)) * k,
            ) | 0,
        );
      if (
        ((t.strokeStyle = `rgb(${O[0]},${O[1]},${O[2]})`),
        (t.lineWidth = R),
        t.beginPath(),
        t.moveTo(d, p),
        t.lineTo(A, z),
        t.stroke(),
        y.leafFn && w <= y.leafDepth && h() < y.leaf && y.leafFn(h, A, z, f),
        w > 0 && _ >= M)
      ) {
        const V = 1 - S,
          F = f + v * (y.spread[0] + h() * y.spread[1]);
        (s(
          h,
          c,
          A,
          z,
          F,
          g * V * (y.childLen[0] + h() * y.childLen[1]) + 10,
          R * y.childW,
          w - 1,
          y,
        ),
          (v = -v),
          (M =
            _ +
            Math.max(1, Math.round(x * (y.latGap[0] + h() * y.latGap[1])))));
      }
      ((d = A), (p = z));
    }
    y.leafFn && y.leafFn(h, d, p, f, !0);
  }
  const i = (h = {}) => ({
      target: -Math.PI / 2,
      pull: 0.1,
      wob: 0.28,
      minW: 1.15,
      latStart: 0.12,
      latGap: [0.1, 0.12],
      cBase: [86, 77, 69],
      cTip: [128, 114, 102],
      spread: [0.32, 0.4],
      childLen: [0.55, 0.3],
      childW: 0.7,
      depth0: 4,
      leaf: 0,
      leafDepth: 0,
      leafFn: null,
      ...h,
    }),
    n = (h, c, d, p) => {
      const f = e(h),
        g = _e(c);
      (t.save(),
        t.beginPath(),
        t.rect(f.x, f.y, bt, Mt),
        t.clip(),
        (t.lineCap = "round"));
      const m = i(d);
      for (const [w, y, x, b, v, M] of p)
        s(
          g,
          f,
          f.x + bt * w,
          f.y + Mt * y,
          -Math.PI / 2 + x,
          Mt * b,
          v,
          M ?? m.depth0,
          m,
        );
      t.restore();
    };
  (n(kt.twigA, 11, {}, [
    [0.5, 0.995, 0, 0.97, 6],
    [0.5, 0.8, -0.35, 0.6, 3.5, 3],
    [0.5, 0.7, 0.4, 0.55, 3.2, 3],
  ]),
    n(kt.twigB, 23, { spread: [0.45, 0.45], pull: 0.07, latGap: [0.08, 0.1] }, [
      [0.5, 0.995, -0.1, 0.95, 5.5],
      [0.5, 0.9, 0.5, 0.65, 3.5, 3],
      [0.5, 0.85, -0.6, 0.55, 3, 3],
    ]),
    n(
      kt.fine,
      37,
      {
        depth0: 3,
        minW: 1.05,
        spread: [0.25, 0.3],
        pull: 0.14,
        wob: 0.18,
        childLen: [0.6, 0.3],
        cBase: [90, 80, 72],
        cTip: [132, 116, 104],
      },
      [
        [0.5, 0.995, 0, 0.97, 4.5],
        [0.5, 0.75, 0.3, 0.6, 2.6, 2],
      ],
    ));
  {
    const h = e(kt.mass),
      c = _e(71);
    (t.save(), t.beginPath(), t.rect(h.x, h.y, bt, Mt), t.clip());
    const d = i({
      depth0: 2,
      pull: 0.16,
      wob: 0.16,
      spread: [0.2, 0.25],
      latGap: [0.15, 0.15],
      childLen: [0.5, 0.3],
    });
    for (let p = 0; p < 7; p++) {
      const f = 0.15 + c() * 0.7,
        g = 0.75 + c() * 0.24;
      s(
        c,
        h,
        h.x + bt * f,
        h.y + Mt * g,
        -Math.PI / 2 + (f - 0.5) * 0.5 + (c() - 0.5) * 0.2,
        Mt * (0.45 + c() * 0.45),
        2.6,
        2,
        d,
      );
    }
    t.restore();
  }
  const r = (h = {}) => ({
    seg: [9, 8],
    zig: 0.13,
    wob: 0.22,
    target: -Math.PI / 2,
    pull: 0.08,
    taper: 0.7,
    minW: 1.25,
    cBase: [62, 56, 51],
    cTip: [112, 98, 90],
    branch: 0.55,
    spread: [0.35, 0.55],
    childLen: [0.45, 0.35],
    childW: 0.72,
    depth0: 5,
    ...h,
  });
  {
    const h = e(kt.dead),
      c = _e(91);
    (t.save(), t.beginPath(), t.rect(h.x, h.y, bt, Mt), t.clip());
    const d = r({
      cBase: [22, 20, 19],
      cTip: [48, 44, 41],
      branch: 0.35,
      depth0: 3,
      seg: [20, 18],
      zig: 0.25,
      pull: 0.03,
      spread: [0.5, 0.7],
      childLen: [0.25, 0.3],
      minW: 1.6,
    });
    (o(c, h, h.x + bt / 2, h.y + Mt - 6, -Math.PI / 2, Mt * 0.85, 9, 3, d),
      t.restore());
  }
  const l = [
      [30, 44, 20],
      [40, 58, 24],
      [52, 72, 30],
      [66, 86, 36],
      [86, 104, 44],
      [108, 122, 54],
    ],
    u = (h, c, d) => {
      const p = e(h),
        f = _e(c);
      (t.save(), t.beginPath(), t.rect(p.x, p.y, bt, Mt), t.clip());
      const g = p.x + bt / 2,
        m = p.y + Mt - 4,
        w = [],
        y = 12 + ((f() * 4) | 0);
      for (let x = 0; x < y; x++) {
        const b = 0.2 + 0.72 * (x / y) + f() * 0.05,
          v = Math.sin(Math.PI * Math.min(1, b * 1.05)) * 0.8 + 0.2,
          M = g + (f() - 0.5) * bt * 0.78 * v,
          _ = m - Mt * b;
        w.push([M, _, (38 + f() * 44) * (0.7 + 0.5 * v)]);
      }
      t.lineCap = "round";
      for (const [x, b] of w)
        ((t.strokeStyle = "rgb(58,50,42)"),
          (t.lineWidth = 3),
          t.beginPath(),
          t.moveTo(g, m),
          t.quadraticCurveTo(g + (x - g) * 0.2, (m + b) / 2, x, b),
          t.stroke());
      for (const [x, b, v] of w) {
        const M = ((v * v) / 24) | 0;
        for (let _ = 0; _ < M; _++) {
          const S = f() * pe,
            T = v * Math.sqrt(f()) * (0.7 + 0.5 * f()),
            A = x + Math.cos(S) * T * 1.15,
            z = b + Math.sin(S) * T * 0.75,
            R = 15 + f() * 11,
            k = R * (0.4 + f() * 0.14),
            C = Math.max(0, Math.min(1, 0.5 - (z - b) / (2 * v))),
            O = Math.min(
              l.length - 1,
              Math.max(0, ((f() * 3.2 + C * 2.6) | 0) + d),
            ),
            V = l[O],
            F = 0.85 + f() * 0.3;
          (t.save(),
            t.translate(A, z),
            t.rotate(S + (f() - 0.5) * 1.5),
            (t.fillStyle = `rgb(${(V[0] * F) | 0},${(V[1] * F) | 0},${(V[2] * F) | 0})`),
            t.beginPath(),
            t.ellipse(0, -R / 2, k / 2, R / 2, 0, 0, pe),
            t.fill(),
            t.restore());
        }
      }
      t.restore();
    };
  (u(kt.leafA, 41, 0), u(kt.leafB, 53, 1));
  {
    const h = e(kt.conifer),
      c = _e(61);
    (t.save(),
      t.beginPath(),
      t.rect(h.x, h.y, bt, Mt),
      t.clip(),
      (t.lineCap = "round"));
    const d = (w, y, x, b, v, M) => {
        const _ = Math.max(2, (b / 3) | 0),
          S = Math.cos(x),
          T = Math.sin(x);
        for (let A = 0; A < _; A++) {
          const z = A / _,
            R = w + S * b * z,
            k = y + T * b * z,
            C = (8 + c() * 6) * (1 - z * 0.3);
          for (let O = -1; O <= 1; O += 2) {
            const V = x + O * (0.7 + c() * 0.5),
              F = 26 + c() * 34 + (O < 0 ? 8 : 0);
            ((t.strokeStyle = `rgb(${(F * 0.55) | 0},${F | 0},${(F * 0.5) | 0})`),
              (t.lineWidth = 1.7),
              t.beginPath(),
              t.moveTo(R, k),
              t.lineTo(R + Math.cos(V) * C, k + Math.sin(V) * C),
              t.stroke());
          }
        }
        if (
          ((t.strokeStyle = "rgb(46,36,26)"),
          (t.lineWidth = v),
          t.beginPath(),
          t.moveTo(w, y),
          t.lineTo(w + S * b, y + T * b),
          t.stroke(),
          M > 0)
        ) {
          let A = 1;
          for (let z = 0.12; z < 0.9; z += 0.11 + c() * 0.05) {
            const R = x + A * (0.75 + c() * 0.3);
            (d(
              w + S * b * z,
              y + T * b * z,
              R,
              b * (0.42 - 0.3 * z) * (0.8 + c() * 0.4),
              v * 0.6,
              M - 1,
            ),
              (A = -A));
          }
        }
      },
      p = h.x + bt / 2,
      f = h.y + Mt - 4,
      g = Mt * 0.96;
    let m = 1;
    for (let w = 0.02; w < 0.93; w += 0.045 + c() * 0.02) {
      const y = f - g * w,
        x = p + Math.sin(w * 4) * 5,
        b = bt * 0.47 * (1 - w * 0.75) * (0.75 + c() * 0.3) + 12;
      (d(x, y, -Math.PI / 2 + m * (0.8 + c() * 0.3), b, 2.4, 1), (m = -m));
    }
    (d(p, f, -Math.PI / 2, g, 4.5, 0), t.restore());
  }
  return Hi.debug ? a : t.getImageData(0, 0, ee, Ye).data;
}
function jl(a = !1) {
  const t = Hi(),
    e = ee * Ye,
    o = new Float64Array(8 * 4);
  for (let h = 0; h < e; h++) {
    if (t[h * 4 + 3] < 128) continue;
    const d = h % ee,
      p = (h / ee) | 0,
      f = ((p / Mt) | 0) * 4 + ((d / bt) | 0);
    ((o[f * 4] += t[h * 4]),
      (o[f * 4 + 1] += t[h * 4 + 1]),
      (o[f * 4 + 2] += t[h * 4 + 2]),
      o[f * 4 + 3]++);
  }
  const s = new Float64Array(8);
  for (let h = 0; h < 8; h++) s[h] = o[h * 4 + 3] / (bt * Mt);
  for (let h = 0; h < e; h++) {
    if (t[h * 4 + 3] > 0) continue;
    const c = h % ee,
      d = (h / ee) | 0,
      p = ((d / Mt) | 0) * 4 + ((c / bt) | 0),
      f = Math.max(1, o[p * 4 + 3]);
    ((t[h * 4] = o[p * 4] / f),
      (t[h * 4 + 1] = o[p * 4 + 1] / f),
      (t[h * 4 + 2] = o[p * 4 + 2] / f));
  }
  const i = [
    { data: new Uint8Array(t.buffer.slice(0)), width: ee, height: Ye },
  ];
  let n = new Float32Array(e * 4);
  for (let h = 0; h < e * 4; h++) n[h] = t[h];
  let r = ee,
    l = Ye;
  for (; r > 1 || l > 1;) {
    const h = Math.max(1, r >> 1),
      c = Math.max(1, l >> 1),
      d = new Float32Array(h * c * 4);
    for (let m = 0; m < c; m++)
      for (let w = 0; w < h; w++) {
        let y = 0,
          x = 0,
          b = 0,
          v = 0,
          M = 0,
          _ = 0,
          S = 0;
        for (let A = 0; A < 2; A++)
          for (let z = 0; z < 2; z++) {
            const R = Math.min(r - 1, w * 2 + z),
              k = Math.min(l - 1, m * 2 + A),
              C = (k * r + R) * 4,
              O = n[C + 3];
            ((y += n[C] * O),
              (x += n[C + 1] * O),
              (b += n[C + 2] * O),
              (v += O),
              (M += n[C]),
              (_ += n[C + 1]),
              (S += n[C + 2]));
          }
        const T = (m * h + w) * 4;
        (v > 0
          ? ((d[T] = y / v), (d[T + 1] = x / v), (d[T + 2] = b / v))
          : ((d[T] = M / 4), (d[T + 1] = _ / 4), (d[T + 2] = S / 4)),
          (d[T + 3] = v / 4));
      }
    ((n = d), (r = h), (l = c));
    const p = new Uint8Array(r * l * 4),
      f = Math.max(1, r / 4),
      g = Math.max(1, l / 2);
    for (let m = 0; m < 8; m++) {
      const w = Math.floor((m % 4) * f),
        y = Math.floor(((m / 4) | 0) * g),
        x = Math.max(w + 1, Math.floor(((m % 4) + 1) * f)),
        b = Math.max(y + 1, Math.floor((((m / 4) | 0) + 1) * g)),
        v = s[m] * (x - w) * (b - y);
      let M = 1,
        _ = 6;
      for (let T = 0; T < (a ? 0 : 12); T++) {
        const A = (M + _) / 2;
        let z = 0;
        for (let R = y; R < b && R < l; R++)
          for (let k = w; k < x && k < r; k++)
            n[(R * r + k) * 4 + 3] * A >= 127.5 && z++;
        z < v ? (M = A) : (_ = A);
      }
      const S = a ? 1.6 : Math.min(6, (M + _) / 2);
      for (let T = y; T < b && T < l; T++)
        for (let A = w; A < x && A < r; A++) {
          const z = (T * r + A) * 4;
          ((p[z] = n[z]),
            (p[z + 1] = n[z + 1]),
            (p[z + 2] = n[z + 2]),
            (p[z + 3] = Math.min(255, n[z + 3] * S)));
        }
    }
    i.push({ data: p, width: r, height: l });
  }
  const u = new gr(i[0].data, ee, Ye, Vi, wr);
  return (
    (u.mipmaps = i),
    (u.generateMipmaps = !1),
    (u.minFilter = $a),
    (u.magFilter = Eo),
    (u.colorSpace = Te),
    (u.anisotropy = 4),
    (u.needsUpdate = !0),
    u
  );
}
const oa = new B(),
  Kl = new Q(),
  Xl = new P(),
  Zl = new P(),
  qn = new Ae();
class Jl {
  constructor(t, e) {
    ((this.assets = t),
      (this.quality = e || {}),
      (this.list = []),
      (this.meshes = []),
      (this._colliders = []),
      (this.uniforms = { uTreeTime: { value: 0 } }),
      (this._lodT = 0),
      (this._lodIdx = 0),
      (this.lod = []));
  }
  add(t, e, o, s, i = 1, n = 1) {
    if (!Wn[t]) {
      console.warn("Trees: tipo desconocido", t);
      return;
    }
    this.list.push({ type: t, x: e, y: o, z: s, scale: i, seed: n | 0 });
  }
  get colliders() {
    return this._colliders;
  }
  _materials() {
    const t = this.assets,
      e = this.uniforms,
      o = (c, d) => {
        const p = t.pbr(c, { normal: 1.4, bakedAO: !1 }).clone();
        ((p.vertexColors = !0), S0(p));
        const f = p.onBeforeCompile;
        return (
          (p.onBeforeCompile = (g) => {
            (f(g),
              d &&
                (g.fragmentShader = g.fragmentShader.replace(
                  "#include <map_fragment>",
                  `#include <map_fragment>
` + d,
                )));
          }),
          (p.customProgramCacheKey = () => "treeWood" + c + (d ? "x" : "")),
          p
        );
      },
      s = o("bark"),
      i = o("bark_pine"),
      n = o(
        "bark_pine",
        "diffuseColor.rgb = mix(vec3(dot(diffuseColor.rgb, vec3(0.3,0.59,0.11))), diffuseColor.rgb, 0.2) * 0.8;",
      );
    n.roughness = 0.85;
    const r = (this.quality.msaa || 0) > 0,
      l = jl(r);
    ((l.anisotropy = this.quality.aniso || 4), (this.atlas = l));
    const u = new Tt({
      map: l,
      alphaTest: r ? 0 : 0.5,
      side: $t,
      roughness: 1,
      metalness: 0,
      vertexColors: !0,
    });
    ((u.envMapIntensity = 0.8),
      (u.alphaToCoverage = r),
      S0(u),
      (this.cardDepth = new pr({
        depthPacking: fr,
        map: l,
        alphaTest: 0.45,
        side: $t,
      })));
    const h = u.onBeforeCompile;
    return (
      (u.onBeforeCompile = (c) => {
        (h(c),
          (c.uniforms.uTreeTime = e.uTreeTime),
          (c.vertexShader = c.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
uniform float uTreeTime;`,
            )
            .replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
          {
            #ifdef USE_BATCHING
              vec3 bp = batchingMatrix[3].xyz;
            #else
              vec3 bp = vec3(0.0);
            #endif
            float ph = bp.x * 0.37 + bp.z * 0.21 + position.y * 0.11;
            float k = clamp(length(position.xz) * 0.22 + position.y * 0.025, 0.0, 1.4);
            float sw = (sin(uTreeTime * 1.3 + ph) * 0.65 + sin(uTreeTime * 2.9 + ph * 1.7) * 0.35) * 0.045 * k;
            transformed.x += sw; transformed.z += sw * 0.6;
          }`,
            )),
          (c.fragmentShader = c.fragmentShader.replace(
            "#include <normal_fragment_begin>",
            Oi.normal_fragment_begin.replace("normal *= faceDirection;", ""),
          )),
          r &&
            (c.fragmentShader = c.fragmentShader.replace(
              "#include <alphatest_fragment>",
              "diffuseColor.a = clamp((diffuseColor.a - 0.5) / max(fwidth(diffuseColor.a), 1e-4) + 0.5, 0.0, 1.0); if (diffuseColor.a < 0.04) discard;",
            )));
      }),
      (u.customProgramCacheKey = () => "treeCards2" + r),
      { decid: s, pine: i, burnt: n, cards: u }
    );
  }
  build(t) {
    const e = this._materials(),
      o = new Map();
    for (const c of this.list) {
      const d = c.seed % Ln[c.type],
        p = c.type + d;
      if (!o.has(p)) {
        const f = Wn[c.type](d + 1),
          g = {
            type: c.type,
            wood: f.wood.toGeometry(),
            woodFar: f.woodFar.toGeometry(),
            cards: f.cards.count ? f.cards.toGeometry() : null,
            r: f.r,
            h: f.h,
          };
        ((g.tris = {
          wood: g.wood.index.count / 3,
          woodFar: g.woodFar.index.count / 3,
          cards: g.cards ? g.cards.index.count / 3 : 0,
        }),
          o.set(p, g));
      }
    }
    const s = { decid: [], pine: [], burnt: [], cards: [] },
      i = [];
    for (const c of this.list) {
      const d = c.seed % Ln[c.type],
        p = o.get(c.type + d);
      (i.push({ t: c, G: p }),
        s[Fn[c.type]].push(p),
        p.cards && s.cards.push(p));
    }
    const n = (c, d, p, f) => {
        if (!p.length) return null;
        const g = [...new Set(p)];
        let m = 0,
          w = 0;
        for (const b of g)
          for (const v of f) {
            const M = b[v];
            M && ((m += M.attributes.position.count), (w += M.index.count));
          }
        const y = new mr(p.length, m, w, d);
        y.name = "trees_" + c;
        const x = new Map();
        for (const b of g) {
          const v = {};
          for (const M of f) b[M] && (v[M] = y.addGeometry(b[M]));
          x.set(b, v);
        }
        return (
          (y.castShadow = !0),
          (y.receiveShadow = !0),
          (y.userData.surface = "wood"),
          t.add(y),
          this.meshes.push(y),
          { bm: y, ids: x }
        );
      },
      r = {
        decid: n("decid", e.decid, s.decid, ["wood", "woodFar"]),
        pine: n("pine", e.pine, s.pine, ["wood", "woodFar"]),
        burnt: n("burnt", e.burnt, s.burnt, ["wood", "woodFar"]),
        cards: n("cards", e.cards, s.cards, ["cards"]),
      };
    r.cards &&
      ((r.cards.bm.userData.surface = "foliage"),
      (r.cards.bm.receiveShadow = !0),
      (r.cards.bm.customDepthMaterial = this.cardDepth));
    let l = 0,
      u = 0;
    for (const { t: c, G: d } of i) {
      const p = _e(c.seed * 977 + 5),
        f = c.scale * (0.9 + p() * 0.2);
      (qn.set((p() - 0.5) * 0.03, p() * pe, (p() - 0.5) * 0.03),
        oa.compose(
          Xl.set(c.x, c.y, c.z),
          Kl.setFromEuler(qn),
          Zl.set(f, f, f),
        ));
      const g = r[Fn[c.type]],
        m = g.ids.get(d),
        w = g.bm.addInstance(m.wood);
      if (
        (g.bm.setMatrixAt(w, oa),
        this.lod.push({
          bm: g.bm,
          id: w,
          near: m.wood,
          far: m.woodFar,
          x: c.x,
          y: c.y,
          z: c.z,
          s: f,
          far2: (Dl * Math.max(1, f)) ** 2,
          isFar: !1,
        }),
        (l += d.wood.index.count / 3),
        d.cards)
      ) {
        const y = r.cards,
          x = y.bm.addInstance(y.ids.get(d).cards);
        (y.bm.setMatrixAt(x, oa), (l += d.cards.index.count / 3));
      }
      (this._colliders.push({ x: c.x, y: c.y, z: c.z, r: d.r * f, h: d.h * f }),
        u++);
    }
    for (const c of this.meshes)
      (c.computeBoundingBox(), c.computeBoundingSphere());
    const h = {};
    for (const [c, d] of o) h[c] = d.tris;
    return (
      (this.stats = {
        triangles: Math.round(l),
        drawCalls: this.meshes.length,
        instances: u,
        variants: o.size,
        perVariant: h,
      }),
      this.stats
    );
  }
  update(t, e = 1 / 60) {
    this.uniforms.uTreeTime.value += e;
    const o = this.lod;
    if (!o.length) return;
    const s = t.position,
      i = Math.ceil(o.length / 4);
    for (let n = 0; n < i; n++) {
      const r = o[this._lodIdx];
      this._lodIdx = (this._lodIdx + 1) % o.length;
      const l = r.x - s.x,
        u = r.z - s.z,
        h = l * l + u * u > r.far2;
      h !== r.isFar &&
        ((r.isFar = h), r.bm.setGeometryIdAt(r.id, h ? r.far : r.near));
    }
  }
}
function Ql(
  a,
  {
    wet: t = 0.7,
    puddle: e = 0.25,
    scale: o = 0.16,
    darken: s = 0.5,
    seed: i = 0,
  } = {},
) {
  const n = a.onBeforeCompile,
    r = a.customProgramCacheKey ? a.customProgramCacheKey.bind(a) : () => "",
    l = `wet:${t}:${e}:${o}:${s}:${i}`;
  return (
    (a.onBeforeCompile = (u, h) => {
      (n?.(u, h),
        (u.vertexShader = u.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWetPos;
varying float vWetUp;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
vWetPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
vWetUp = normalize(mat3(modelMatrix) * objectNormal).y;`,
          )),
        (u.fragmentShader = u.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWetPos; varying float vWetUp;
float wHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float wNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(wHash(i), wHash(i + vec2(1, 0)), f.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), f.x), f.y); }
float wFbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * wNoise(p); p = p * 2.03 + 17.1; a *= 0.5; } return v; }
float wetMask, pudMask;`,
          )
          .replace(
            "#include <map_fragment>",
            `#include <map_fragment>
{
  vec2 wp = vWetPos.xz * ${o.toFixed(4)} + ${(i * 13.7).toFixed(2)};
  float n = wFbm(wp);
  float up = smoothstep(0.55, 0.9, vWetUp);
  wetMask = smoothstep(0.62 - ${t.toFixed(3)} * 0.55, 0.78 - ${t.toFixed(3)} * 0.45, n + 0.08 * wFbm(wp * 7.0)) * up;
  pudMask = smoothstep(0.80 - ${e.toFixed(3)} * 0.3, 0.815 - ${e.toFixed(3)} * 0.3, n) * up;
  // el barro mojado se oscurece y satura ligeramente; el agua absorbe aún más
  vec3 wetCol = diffuseColor.rgb * ${s.toFixed(3)};
  wetCol = mix(vec3(dot(wetCol, vec3(0.333))), wetCol, 1.8) * vec3(1.06, 0.97, 0.88);
  diffuseColor.rgb = mix(diffuseColor.rgb, wetCol, wetMask);
  diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.32 + vec3(0.006, 0.007, 0.008), pudMask);
}`,
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, max(roughnessFactor * 0.55, 0.36), wetMask);
roughnessFactor = mix(roughnessFactor, 0.035, pudMask);`,
          )
          .replace(
            "#include <normal_fragment_maps>",
            `#include <normal_fragment_maps>
normal = normalize(mix(normal, nonPerturbedNormal, clamp(pudMask * 0.95 + wetMask * 0.12, 0.0, 1.0)));`,
          )));
    }),
    (a.customProgramCacheKey = () => r() + "|" + l),
    (a.needsUpdate = !0),
    a
  );
}

export { Jl, Ql };
