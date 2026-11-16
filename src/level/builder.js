// level/builder.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, E as Ut, I as tt, J as Do, Q, V as P, o as B, z as Ga } from "three-vendor";

const ms = {
    plaster_damaged: 2.5,
    plaster_peeling: 2.5,
    plaster_mossy: 2.5,
    plaster_white: 2,
    concrete_wall: 3,
    concrete_rough: 2,
    concrete_rebar: 2,
    concrete_floor: 3,
    ground_debris: 3.5,
    ground_rubble: 2,
    ground_mud: 3,
    brick_broken: 2,
    brick_wall: 2,
    wood_weathered: 1.5,
    metal_rust: 1.5,
    metal_corrugated: 1.6,
    metal_red: 1,
    plaster_pink: 2.5,
    bark: 1.5,
    metal_grate: 1,
    tiles_dirty: 1.5,
  },
  Yo = new B(),
  ln = new Q(),
  cn = new P(),
  Ie = new P(),
  hn = new Ga();
function un(a, t, e) {
  const o = Math.sin(a * 12.9898 + t * 78.233 + e * 37.719) * 43758.5453;
  return o - Math.floor(o);
}
class dn {
  constructor() {
    ((this.parts = new Map()),
      (this.collide = []),
      (this.cell = 1.25),
      (this.surfaces = []));
  }
  _bucket(t) {
    return (
      this.parts.has(t) || this.parts.set(t, { pos: [], nor: [], uv: [] }),
      this.parts.get(t)
    );
  }
  box(t, e, o, s = {}) {
    const [i, n, r] = o,
      l = s.rotY || 0,
      u = s.tile || ms[t] || 2,
      h = s.sub ?? !0,
      c = s.uvOffset ?? un(e[0], e[1], e[2]) * 7,
      d = s.uvOffset ?? un(e[2], e[0], e[1]) * 7;
    (ln.setFromAxisAngle(cn.set(0, 1, 0), l),
      Yo.compose(new P(...e), ln, new P(1, 1, 1)),
      hn.getNormalMatrix(Yo));
    const p = s.collideOnly ? null : this._bucket(t),
      f = i / 2,
      g = n / 2,
      m = r / 2,
      w = [
        {
          n: [1, 0, 0],
          u: [0, 0, -1],
          v: [0, 1, 0],
          su: r,
          sv: n,
          c: [f, 0, 0],
        },
        {
          n: [-1, 0, 0],
          u: [0, 0, 1],
          v: [0, 1, 0],
          su: r,
          sv: n,
          c: [-f, 0, 0],
        },
        {
          n: [0, 1, 0],
          u: [1, 0, 0],
          v: [0, 0, -1],
          su: i,
          sv: r,
          c: [0, g, 0],
        },
        {
          n: [0, -1, 0],
          u: [1, 0, 0],
          v: [0, 0, 1],
          su: i,
          sv: r,
          c: [0, -g, 0],
        },
        {
          n: [0, 0, 1],
          u: [1, 0, 0],
          v: [0, 1, 0],
          su: i,
          sv: n,
          c: [0, 0, m],
        },
        {
          n: [0, 0, -1],
          u: [-1, 0, 0],
          v: [0, 1, 0],
          su: i,
          sv: n,
          c: [0, 0, -m],
        },
      ],
      y = s.skipFaces || [],
      x = Math.abs(Math.sin(2 * l)) < 0.001;
    if (
      (w.forEach((b, v) => {
        if (y.includes(v)) return;
        const M = h ? Math.max(1, Math.ceil(b.su / this.cell)) : 1,
          _ = h ? Math.max(1, Math.ceil(b.sv / this.cell)) : 1,
          S = (A, z) => {
            const R =
                b.c[0] + b.u[0] * (A - 0.5) * b.su + b.v[0] * (z - 0.5) * b.sv,
              k =
                b.c[1] + b.u[1] * (A - 0.5) * b.su + b.v[1] * (z - 0.5) * b.sv,
              C =
                b.c[2] + b.u[2] * (A - 0.5) * b.su + b.v[2] * (z - 0.5) * b.sv;
            return cn.set(R, k, C).applyMatrix4(Yo).toArray();
          };
        Ie.set(...b.n)
          .applyMatrix3(hn)
          .normalize();
        const T = (A) =>
          Math.abs(Ie.y) > 0.5
            ? [A[0] / u + c * 0, -A[2] / u]
            : [
                (Math.abs(Ie.x) > Math.abs(Ie.z)
                  ? -A[2] * Math.sign(Ie.x)
                  : A[0] * Math.sign(Ie.z)) / u,
                A[1] / u,
              ];
        for (let A = 0; A < M; A++)
          for (let z = 0; z < _; z++) {
            const R = A / M,
              k = (A + 1) / M,
              C = z / _,
              O = (z + 1) / _,
              V = [
                [R, C],
                [k, C],
                [k, O],
                [R, C],
                [k, O],
                [R, O],
              ];
            for (const [F, q] of V) {
              if (!p) continue;
              const I = S(F, q);
              (p.pos.push(...I), p.nor.push(Ie.x, Ie.y, Ie.z));
              const H =
                s.localUV || !x
                  ? [(F * b.su) / u + c, (q * b.sv) / u + d]
                  : T(I);
              p.uv.push(H[0] + (s.u0 || 0), H[1] + (s.v0 || 0));
            }
          }
      }),
      s.collide !== !1 && !s.noCollide)
    ) {
      const b = new Z(i, n, r).toNonIndexed();
      (b.deleteAttribute("normal"),
        b.deleteAttribute("uv"),
        b.applyMatrix4(Yo),
        this.collide.push(b));
    }
  }
  geometry(t, e, o, s = {}) {
    let i = e.index ? e.toNonIndexed() : e.clone();
    if ((o && i.applyMatrix4(o), !s.collideOnly)) {
      const n = this._bucket(t),
        r = i.attributes.position.array,
        l = i.attributes.normal.array,
        u = i.attributes.uv ? i.attributes.uv.array : null,
        h = s.uvScale || 1;
      for (let c = 0; c < r.length / 3; c++)
        if (
          (n.pos.push(r[c * 3], r[c * 3 + 1], r[c * 3 + 2]),
          n.nor.push(l[c * 3], l[c * 3 + 1], l[c * 3 + 2]),
          s.worldUV)
        ) {
          const d = ms[t] || 2,
            p = Math.abs(l[c * 3]),
            f = Math.abs(l[c * 3 + 1]),
            g = Math.abs(l[c * 3 + 2]);
          f >= p && f >= g
            ? n.uv.push(r[c * 3] / d, r[c * 3 + 2] / d)
            : p >= g
              ? n.uv.push(r[c * 3 + 2] / d, r[c * 3 + 1] / d)
              : n.uv.push(r[c * 3] / d, r[c * 3 + 1] / d);
        } else n.uv.push(u ? u[c * 2] * h : 0, u ? u[c * 2 + 1] * h : 0);
    }
    if (s.collide) {
      const n = new Ut();
      (n.setAttribute("position", i.attributes.position.clone()),
        this.collide.push(n));
    }
  }
  wall(t, e, o, s, i, n, r, l, u = [], h = {}) {
    const c = Math.hypot(s - e, i - o),
      d = (s - e) / c,
      p = (i - o) / c,
      f = Math.atan2(-p, d),
      g = (x, b, v, M) => {
        if (b - x < 0.01 || M - v < 0.01) return;
        const _ = (x + b) / 2;
        this.box(t, [e + d * _, (v + M) / 2, o + p * _], [b - x, M - v, l], {
          ...h,
          rotY: f,
        });
      },
      m = [...u].sort((x, b) => x.at - b.at);
    let w = 0;
    const y = n + r;
    for (const x of m) {
      const b = x.at - x.w / 2,
        v = x.at + x.w / 2;
      g(w, b, n, y);
      const M = n + (x.y || 0),
        _ = x.h;
      (g(b, v, n, M), g(b, v, M + _, y), (w = v));
    }
    g(w, c, n, y);
  }
  build() {
    const t = new Map();
    for (const [o, s] of this.parts) {
      const i = new Ut();
      (i.setAttribute("position", new tt(s.pos, 3)),
        i.setAttribute("normal", new tt(s.nor, 3)),
        i.setAttribute("uv", new tt(s.uv, 2)),
        t.set(o, i));
    }
    const e = this.collide.length
      ? Do(
          this.collide.map((o) => {
            const s = new Ut();
            return (s.setAttribute("position", o.attributes.position), s);
          }),
          !1,
        )
      : null;
    return { visual: t, collision: e };
  }
}

export { dn, ms };
