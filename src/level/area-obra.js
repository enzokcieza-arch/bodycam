// level/area-obra.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { $ as B0, B as Z, E as Ut, I as tt, K as vo, Q, V as P, X as Ci, Y as vt, Z as Ae, _ as Mo, a0 as Na, a1 as Ri, o as B } from "three-vendor";
import { ms } from "./builder.js";
import { $e } from "./area-urbex.js";

const Ve = { x0: -21.2, x1: 3, z0: 32.6, z1: 43.5 },
  pt = 3.1,
  ft = 6,
  Et = 5.6,
  ut = { w: -21.6, e: 30.8, s: 57.1, n: 32.4 },
  pn = {
    yard_gravel: {
      tex: "ground_debris",
      tint: 13485238,
      normal: 1.4,
      roughness: 1,
      tile: 2.2,
      surface: "gravel",
    },
    yard_outer: {
      tex: "ground_debris",
      tint: 11774877,
      normal: 1,
      roughness: 1,
      tile: 3,
      surface: "dirt",
    },
    yard_track: {
      tex: "ground_mud",
      tint: 6183508,
      normal: 1,
      roughness: 1,
      tile: 2.4,
      surface: "dirt",
    },
    fence_post: {
      tex: "concrete_wall",
      tint: 11841704,
      normal: 1,
      roughness: 1,
      tile: 2,
      surface: "concrete",
    },
    pillar_conc: {
      tex: "concrete_wall",
      tint: 12894392,
      normal: 1.4,
      roughness: 1,
      tile: 1.6,
      surface: "concrete",
    },
    brick_white: {
      tex: "brick_white",
      tint: 15920870,
      normal: 1.2,
      roughness: 1,
      tile: 2.4,
      surface: "brick",
    },
    roof_paver: {
      tex: "concrete_wall",
      tint: 9738898,
      normal: 1.4,
      roughness: 1,
      tile: 1.3,
      surface: "concrete",
    },
    roof_paver_b: {
      tex: "concrete_rough",
      tint: 8357244,
      normal: 1.2,
      roughness: 1,
      tile: 1.3,
      surface: "concrete",
    },
    roof_base: {
      tex: "concrete_rough",
      tint: 3816760,
      normal: 1,
      roughness: 1,
      tile: 2,
      surface: "concrete",
    },
    metal_galv_tube: {
      tex: "concrete_rough",
      tint: 12765899,
      metal: !1,
      roughness: 0.5,
      normal: 0.35,
      tile: 1.1,
      surface: "metal",
    },
    scaf_board: {
      tex: "concrete_rough",
      tint: 10661554,
      metal: !1,
      roughness: 0.9,
      normal: 0.8,
      tile: 1.4,
      surface: "metal",
    },
    timber_pale: {
      tex: "plywood",
      tint: 12366498,
      roughness: 1,
      normal: 1,
      tile: 1.2,
      surface: "wood",
    },
    plywood_sheet: {
      tex: "plywood",
      tint: 10123352,
      roughness: 1,
      normal: 1,
      tile: 1.6,
      surface: "wood",
    },
    toilet_plastic: {
      tex: "metal_corrugated",
      tint: 3817804,
      roughness: 0.55,
      normal: 0.8,
      tile: 0.5,
      surface: "soft",
    },
    toilet_roof: {
      tex: "concrete_wall",
      tint: 10396840,
      roughness: 0.5,
      normal: 0.3,
      tile: 1.5,
      surface: "soft",
    },
    container_green: {
      tex: "concrete_rough",
      tint: 5201472,
      roughness: 0.7,
      normal: 0.5,
      tile: 1.6,
      surface: "metal",
    },
    fence_panel: {
      tex: "concrete_wall",
      tint: 14605268,
      normal: 1,
      roughness: 1,
      tile: 2,
      surface: "concrete",
    },
    container_frame: {
      tex: "concrete_rough",
      tint: 4477242,
      roughness: 0.8,
      normal: 0.8,
      tile: 1.5,
      surface: "metal",
    },
    gen_yellow: {
      tex: "concrete_wall",
      tint: 14467194,
      roughness: 0.55,
      normal: 0.3,
      tile: 1.6,
      surface: "metal",
    },
    rubber_black: {
      tex: "concrete_rough",
      tint: 1842204,
      roughness: 0.9,
      normal: 0.6,
      tile: 1,
      surface: "soft",
    },
    flashing: {
      tex: "metal_rust",
      tint: 5523261,
      metal: !1,
      roughness: 0.85,
      normal: 0.6,
      tile: 1.2,
      surface: "metal",
    },
    yard_rubble: {
      tex: "ground_rubble",
      tint: 10131087,
      normal: 1.4,
      roughness: 1,
      tile: 2,
      surface: "gravel",
    },
    barrier_conc: {
      tex: "concrete_rough",
      tint: 10197136,
      normal: 1.2,
      roughness: 1,
      tile: 1.5,
      surface: "concrete",
    },
    dark_metal: {
      tex: "metal_rust",
      tint: 3816508,
      metal: !0,
      roughness: 0.8,
      normal: 0.6,
      tile: 1,
      surface: "metal",
    },
    cable_black: {
      tex: "metal_rust",
      tint: 1184274,
      roughness: 0.5,
      normal: 0,
      tile: 1,
      surface: "metal",
    },
    pylon_steel: {
      tex: "concrete_rough",
      tint: 11844282,
      metal: !1,
      roughness: 0.7,
      normal: 0.4,
      tile: 2,
      surface: "metal",
    },
    block_conc: {
      tex: "concrete_rough",
      tint: 10328724,
      roughness: 1,
      normal: 1.2,
      tile: 1,
      surface: "concrete",
    },
  },
  Yr = new P(0, 1, 0),
  N0 = new P(),
  H0 = new P(),
  jo = new P(),
  fn = new P(),
  mn = new Q(),
  jr = new P(1, 1, 1),
  _0 = new B();
function mo(a) {
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
function Ii(a, t) {
  (N0.set(...a), H0.set(...t), jo.subVectors(H0, N0));
  const e = jo.length();
  return (
    jo.divideScalar(e),
    mn.setFromUnitVectors(Yr, jo),
    fn.addVectors(N0, H0).multiplyScalar(0.5),
    { m: _0.compose(fn, mn, jr), len: e }
  );
}
function ce(a, t, e, o, s = 0.024, i = 6, n = {}) {
  const { m: r, len: l } = Ii(e, o),
    u = new vt(s, s, l, i, 1, !0);
  a.geometry(t, u, r, { worldUV: !0, ...n });
}
function Me(a, t, e, o, s = 0.08, i = {}) {
  const { m: n, len: r } = Ii(e, o);
  a.geometry(t, new Z(s, r, s), n, { worldUV: !0, ...i });
}
function Ue(a, t, e, o, s, i) {
  const n = o[0] - e[0],
    r = o[1] - e[1],
    l = o[2] - e[2],
    u = Math.hypot(n, r, l),
    h = Math.min(i, u * 0.3) / u;
  Me(
    a,
    t,
    [e[0] + n * h, e[1] + r * h, e[2] + l * h],
    [o[0] - n * h, o[1] - r * h, o[2] - l * h],
    s,
  );
}
function Ms(a, t, e, o, s = 0, i = 0, n = 0, r = {}) {
  const l = new B()
    .makeRotationFromEuler(new Ae(s, i, n, "YXZ"))
    .setPosition(...e);
  a.geometry(t, new Z(...o), l, { worldUV: !0, ...r });
}
function Ks(a, t, e, o = 0.6, s = 0.013) {
  const i = [];
  for (let l = 0; l <= 12; l++) {
    const u = l / 12;
    i.push(
      new P(
        t[0] + (e[0] - t[0]) * u,
        t[1] + (e[1] - t[1]) * u - o * 4 * u * (1 - u),
        t[2] + (e[2] - t[2]) * u,
      ),
    );
  }
  const r = new Ri(new Na(i), 12 * 2, s, 4, !1);
  a.geometry("cable_black", r, null, {});
}
function Ui(a, t, e, o, s, i, n) {
  const r = i - o,
    l = Math.hypot(r, n - s),
    u = Math.atan2(n - s, Math.abs(r)),
    h = new Z(e, 0.1, l + 0.1);
  (_0.makeRotationX(r > 0 ? -u : u),
    _0.setPosition(t, (s + n) / 2 - 0.05, (o + i) / 2),
    a.geometry("metal_galv_tube", h, _0, { collideOnly: !0, collide: !0 }));
}
const te = (a, t, e) => a.box("fence_post", t, e, { collideOnly: !0 });
function Y0(a, t, e, o, s, i = 2.2) {
  const n = Math.hypot(o - t, s - e),
    r = (o - t) / n,
    l = (s - e) / n,
    u = Math.atan2(-l, r),
    h = Math.round(n / 2),
    c = n / h,
    d = mo((t * 31 + e * 17) | 0),
    p = c - 0.175;
  for (let f = 0; f < h; f++) {
    const g = (f + 0.5) * c,
      m = t + r * g,
      w = e + l * g,
      y = (b, v, M = 0) => [m + r * b - l * M, v, w + l * b + r * M];
    for (let b = 0; b < 3; b++) {
      const v = 0.25 + b * 0.5,
        M = (d() - 0.5) * 0.012;
      a.box("fence_panel", y(0, v, M), [p, 0.485, 0.06], {
        rotY: u,
        noCollide: !0,
      });
    }
    (a.box("roof_base", y(0, 0.75, 0), [p, 1.5, 0.02], {
      rotY: u,
      noCollide: !0,
      sub: !1,
    }),
      a.box("fence_panel", y(0, 1.535, 0), [p, 0.07, 0.06], {
        rotY: u,
        noCollide: !0,
        sub: !1,
      }),
      a.box("fence_panel", y(0, i - 0.1, 0), [p, 0.08, 0.06], {
        rotY: u,
        noCollide: !0,
        sub: !1,
      }));
    const x = Math.round(p / 0.17);
    for (let b = 0; b < x; b++) {
      const v = -p / 2 + (b + 0.5) * (p / x);
      d() < 0.04 ||
        a.box(
          "fence_panel",
          y(v, (1.57 + i - 0.14) / 2, 0),
          [0.06, i - 0.14 - 1.57, 0.05],
          { rotY: u, noCollide: !0, sub: !1 },
        );
    }
  }
  for (let f = 0; f <= h; f++) {
    const g = f * c,
      m = t + r * g,
      w = e + l * g;
    (a.box("fence_post", [m, (i + 0.06) / 2, w], [0.16, i + 0.06, 0.16], {
      rotY: u,
      sub: !1,
      noCollide: !0,
    }),
      a.box(
        "fence_post",
        [m - l * 0.05, 0.81, w + r * 0.05],
        [0.26, 1.6, 0.02],
        { rotY: u, sub: !1, noCollide: !0 },
      ));
  }
  a.box("fence_post", [(t + o) / 2, 2, (e + s) / 2], [n, 4, 0.3], {
    rotY: u,
    collideOnly: !0,
  });
}
function j0(a, t, e = 0.28, o = 0.04) {
  const s = Math.round(a / e),
    i = a / s,
    n = [],
    r = [];
  for (let d = 0; d < s; d++) {
    const p = -a / 2 + d * i;
    (n.push(p, p + i * 0.2, p + i * 0.5, p + i * 0.7), r.push(0, o, o, 0));
  }
  (n.push(a / 2), r.push(0));
  const l = [],
    u = [],
    h = [];
  for (let d = 0; d < n.length - 1; d++) {
    const p = n[d],
      f = n[d + 1],
      g = r[d],
      m = r[d + 1],
      w = f - p,
      y = m - g,
      x = Math.hypot(w, y),
      b = -y / x,
      v = w / x,
      M = [
        [p, -t / 2, g],
        [f, -t / 2, m],
        [f, t / 2, m],
        [p, -t / 2, g],
        [f, t / 2, m],
        [p, t / 2, g],
      ];
    for (const _ of M) (l.push(..._), u.push(b, 0, v), h.push(_[0], _[1]));
  }
  const c = new Ut();
  return (
    c.setAttribute("position", new tt(l, 3)),
    c.setAttribute("normal", new tt(u, 3)),
    c.setAttribute("uv", new tt(h, 2)),
    c
  );
}
function gn(a, t, e, o) {
  a.box("dark_metal", [t, e, o], [0.085, 0.085, 0.085], {
    noCollide: !0,
    sub: !1,
  });
}
function Kr(a, t, e, o, s, i) {
  const n = "metal_galv_tube";
  for (const c of t)
    for (const d of e)
      (ce(a, n, [c, 0.04, d], [c, s, d], 0.026, 6),
        a.box("dark_metal", [c, 0.02, d], [0.16, 0.04, 0.16], {
          noCollide: !0,
          sub: !1,
        }),
        a.box(n, [c, s / 2, d], [0.08, s, 0.08], { collideOnly: !0 }));
  const r = t[0],
    l = t[t.length - 1],
    u = e[0],
    h = e[e.length - 1];
  for (const c of o) {
    for (const d of e) {
      ce(a, n, [r - 0.15, c, d + 0.05], [l + 0.15, c, d + 0.05], 0.024, 6);
      for (const p of t) gn(a, p, c, d + 0.05);
    }
    for (const d of t) {
      ce(
        a,
        n,
        [d - 0.05, c + 0.07, u - 0.15],
        [d - 0.05, c + 0.07, h + 0.15],
        0.024,
        6,
      );
      for (const p of e) gn(a, d - 0.05, c + 0.07, p);
    }
  }
  for (let c = 0; c < t.length - 1; c += 2)
    (ce(
      a,
      n,
      [t[c], 0.2, h + 0.1],
      [t[c + 1], o[2] ?? s - 1, h + 0.1],
      0.024,
      6,
    ),
      ce(
        a,
        n,
        [t[c + 1], o[2] ?? s - 1, h + 0.1],
        [Math.min(t[c + 1] + (t[c + 1] - t[c]), l), Et + 1, h + 0.1],
        0.024,
        6,
      ));
  ce(a, n, [r - 0.1, 0.2, u], [r - 0.1, o[2], h], 0.024, 6);
  for (const c of i) {
    const d = Math.floor((c.z1 - c.z0) / 0.255);
    for (let p = 0; p < d; p++) {
      const f = c.z0 + 0.13 + p * 0.255,
        g = Math.sin(p * 7.1) * 0.012;
      a.box(
        "scaf_board",
        [(c.x0 + c.x1) / 2, c.y - 0.025 + g * 0.3, f],
        [c.x1 - c.x0, 0.045, 0.24],
        { noCollide: !0 },
      );
    }
    (a.box(
      "scaf_board",
      [(c.x0 + c.x1) / 2, c.y + 0.08, c.z1 - 0.02],
      [c.x1 - c.x0, 0.16, 0.03],
      { noCollide: !0, sub: !1 },
    ),
      a.box(
        n,
        [(c.x0 + c.x1) / 2, c.y - 0.05, (c.z0 + c.z1) / 2],
        [c.x1 - c.x0, 0.1, c.z1 - c.z0],
        { collideOnly: !0 },
      ));
  }
}
function wn(a, t, e, o, s, i, n, r) {
  const l = Math.sign(s - o),
    u = Math.abs(s - o),
    h = (n - i) / r,
    c = u / r,
    d = (t + e) / 2;
  for (let p = 0; p < r; p++) {
    const f = i + h * (p + 1),
      g = o + l * c * (p + 0.5);
    a.box("scaf_board", [d, f - 0.02, g], [e - t - 0.08, 0.04, c + 0.02], {
      noCollide: !0,
      sub: !1,
    });
  }
  for (const p of [t + 0.03, e - 0.03])
    Me(a, "dark_metal", [p, i - 0.05, o], [p, n - 0.05, s], 0.05, {});
  (Me(a, "metal_galv_tube", [t, i + 1, o], [t, n + 1, s], 0.045, {}),
    Me(a, "metal_galv_tube", [e, i + 1, o], [e, n + 1, s], 0.045, {}),
    Ui(a, d, e - t, o - l * 0.05, i, s + l * 0.05, n));
}
function yn(a, t, e, o) {
  const s = Math.cos(o),
    i = Math.sin(o),
    n = (r, l, u) => [t + r * s + u * i, l, e - r * i + u * s];
  (a.box("toilet_plastic", n(0, 1.12, 0), [1.12, 2.16, 1.16], {
    rotY: o,
    localUV: !0,
    tile: 0.5,
  }),
    a.box("toilet_roof", n(0, 2.26, 0), [1.24, 0.12, 1.28], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    }));
  {
    const r = new vt(0.64, 0.64, 1.24, 14, 1, !1, -Math.PI / 2, Math.PI),
      l = new B()
        .makeRotationY(o)
        .multiply(new B().makeRotationZ(Math.PI / 2))
        .multiply(new B().makeScale(0.32, 1, 1));
    (l.setPosition(...n(0, 2.31, 0)),
      a.geometry("toilet_roof", r, l, { worldUV: !0 }));
  }
  (a.box("toilet_plastic", n(0, 0.06, 0), [1.2, 0.12, 1.22], {
    rotY: o,
    noCollide: !0,
    sub: !1,
  }),
    a.box("toilet_plastic", n(0, 1.08, -0.6), [0.84, 1.95, 0.05], {
      rotY: o,
      localUV: !0,
      tile: 0.42,
      noCollide: !0,
    }),
    a.box("dark_metal", n(0.3, 1.1, -0.64), [0.04, 0.16, 0.04], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    }),
    a.box("toilet_roof", n(0, 1.9, -0.635), [0.3, 0.08, 0.02], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    }));
  for (let r = 0; r < 4; r++)
    a.box("dark_metal", n(-0.57, 1.85 + r * 0.06, 0), [0.03, 0.025, 0.5], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    });
  ce(a, "toilet_plastic", n(0.4, 2.3, 0.4), n(0.4, 2.62, 0.4), 0.05, 8);
}
function Xr(a, t, e, o) {
  const r = Math.cos(o),
    l = Math.sin(o),
    u = (h, c, d) => [t + h * r + d * l, c, e - h * l + d * r];
  (a.box(
    "container_frame",
    u(0, 2.59 / 2 + 0.05, 0),
    [6.06 - 0.6, 2.59 - 0.3, 2.44 - 0.42],
    { rotY: o, noCollide: !0, sub: !1 },
  ),
    a.box("container_frame", u(0, 2.59 / 2, 0), [6.06, 2.59, 2.44], {
      rotY: o,
      collideOnly: !0,
    }));
  for (const h of [-1, 1]) {
    const c = new B().makeRotationY(o + (h < 0 ? Math.PI : 0));
    (c.setPosition(...u(0, 2.59 / 2 + 0.05, h * (2.44 / 2 - 0.08))),
      a.geometry(
        "container_green",
        j0(6.06 - 0.3, 2.59 - 0.36, 0.28, 0.035),
        c,
        { worldUV: !0 },
      ));
  }
  {
    const h = new B().makeRotationY(o - Math.PI / 2);
    (h.setPosition(...u(-2.9299999999999997, 2.59 / 2 + 0.05, 0)),
      a.geometry(
        "container_green",
        j0(2.44 - 0.3, 2.59 - 0.36, 0.28, 0.035),
        h,
        { worldUV: !0 },
      ));
  }
  (a.box(
    "container_green",
    u(0, 2.59 + 0.01, 0),
    [6.06 - 0.2, 0.04, 2.44 - 0.12],
    { rotY: o, noCollide: !0, sub: !1 },
  ),
    a.box("timber_pale", u(-1, 2.59 + 0.12, 0.1), [3.2, 0.06, 0.3], {
      rotY: o + 0.05,
      noCollide: !0,
      sub: !1,
    }),
    a.box("timber_pale", u(-0.8, 2.59 + 0.18, -0.15), [2.4, 0.06, 0.25], {
      rotY: o - 0.08,
      noCollide: !0,
      sub: !1,
    }));
  for (const h of [0.08, 2.59 - 0.02])
    for (const c of [-1, 1])
      a.box(
        "container_frame",
        u(0, h, c * (2.44 / 2 - 0.05)),
        [6.06, 0.16, 0.12],
        { rotY: o, noCollide: !0, sub: !1 },
      );
  for (const h of [-1, 1])
    for (const c of [-1, 1])
      a.box(
        "container_frame",
        u(h * (6.06 / 2 - 0.08), 2.59 / 2 + 0.03, c * (2.44 / 2 - 0.08)),
        [0.16, 2.59 + 0.06, 0.16],
        { rotY: o, noCollide: !0, sub: !1 },
      );
  for (const h of [-1, 1])
    for (const c of [0.08, 2.59 - 0.02])
      a.box(
        "container_frame",
        u(h * (6.06 / 2 - 0.05), c, 0),
        [0.12, 0.16, 2.44],
        { rotY: o, noCollide: !0, sub: !1 },
      );
  {
    const h = new B().makeRotationY(o + Math.PI / 2);
    (h.setPosition(...u(6.06 / 2 - 0.1, 2.59 / 2 + 0.05, 0)),
      a.geometry(
        "container_green",
        j0(2.44 - 0.3, 2.59 - 0.36, 0.2, 0.025),
        h,
        { worldUV: !0 },
      ));
  }
  for (const h of [-0.95, -0.4, 0.4, 0.95])
    (ce(
      a,
      "container_frame",
      u(6.06 / 2 - 0.02, 0.25, h),
      u(6.06 / 2 - 0.02, 2.59 - 0.15, h),
      0.022,
      6,
    ),
      a.box("dark_metal", u(6.06 / 2 + 0, 1.2, h + 0.08), [0.04, 0.05, 0.22], {
        rotY: o,
        noCollide: !0,
        sub: !1,
      }));
}
function Zr(a, t, e, o, s) {
  const i = Math.cos(o),
    n = Math.sin(o),
    r = (h, c, d) => [t + h * i + d * n, c, e - h * n + d * i];
  (a.box("dark_metal", r(0, 0.42, 0), [2.5, 0.12, 1.2], {
    rotY: o,
    noCollide: !0,
    sub: !1,
  }),
    a.box("gen_yellow", r(0.05, 1.08, 0), [2.25, 1.2, 1.25], {
      rotY: o,
      localUV: !0,
    }),
    a.box("gen_yellow", r(0.05, 1.71, 0), [2.3, 0.06, 1.3], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    }),
    a.box("dark_metal", r(-0.45, 1.05, -0.63), [0.7, 0.7, 0.02], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    }));
  for (let h = 0; h < 6; h++)
    a.box("gen_yellow", r(-0.45, 0.76 + h * 0.11, -0.645), [0.7, 0.025, 0.02], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    });
  a.box("dark_metal", r(0.75, 1.25, -0.635), [0.35, 0.25, 0.02], {
    rotY: o,
    noCollide: !0,
    sub: !1,
  });
  for (const h of [-0.72, 0.72]) {
    const c = new vt(0.33, 0.33, 0.2, 14),
      d = new B()
        .makeRotationY(-o)
        .multiply(new B().makeRotationX(Math.PI / 2));
    (d.setPosition(...r(-0.25, 0.33, h)),
      a.geometry("rubber_black", c, d, { worldUV: !0 }),
      a.box("gen_yellow", r(-0.25, 0.7, h * 1.02), [0.8, 0.06, 0.24], {
        rotY: o,
        noCollide: !0,
        sub: !1,
      }));
  }
  (Me(a, "dark_metal", r(1.2, 0.42, 0), r(2.3, 0.4, 0), 0.08),
    Me(a, "dark_metal", r(2.3, 0.18, 0), r(2.3, 0.45, 0), 0.06));
  for (const h of [-1.15, 1.1])
    Me(a, "dark_metal", r(h, 0.05, 0), r(h, 0.45, 0), 0.07);
  const l = -1,
    u = 5.4;
  (Me(a, "gen_yellow", r(l, 1.7, 0), r(l, 3.4, 0), 0.14),
    Me(a, "metal_galv_tube", r(l, 3.4, 0), r(l, u, 0), 0.09),
    Me(a, "dark_metal", r(l, u, -0.6), r(l, u, 0.6), 0.06),
    s.push({
      model: "flood_lights",
      pos: r(l, u + 0.02, 0),
      rotY: o + Math.PI / 2,
      filter: "floor_double_a_(light|support|bar)",
      fit: { w: 1.3 },
      collide: !1,
    }),
    a.box("gen_yellow", r(0.05, 0.9, 0), [2.7, 1.8, 1.4], {
      rotY: o,
      collideOnly: !0,
    }));
}
function Jr(a, t, e, o = 0) {
  const s = "pylon_steel",
    i = Math.cos(o),
    n = Math.sin(o),
    r = (f, g, m) => [t + f * i + m * n, g, e - f * n + m * i],
    l = [0, 5, 10, 14.5, 18.5, 22, 25, 27.5, 30, 32.5, 35],
    u = (f) =>
      f <= 25 ? 4.2 - (4.2 - 1.25) * (f / 25) : 1.25 - (f - 25) * 0.04,
    h = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ];
  for (let f = 0; f < l.length - 1; f++) {
    const g = l[f],
      m = l[f + 1],
      w = u(g),
      y = u(m);
    for (let x = 0; x < 4; x++) {
      const [b, v] = h[x],
        [M, _] = h[(x + 1) % 4];
      (Ue(
        a,
        s,
        r(b * w, g, v * w),
        r(b * y, m, v * y),
        f < 4 ? 0.26 : 0.18,
        0.06,
      ),
        Ue(a, s, r(b * y, m, v * y), r(M * y, m, _ * y), 0.1, 0.17),
        Ue(a, s, r(b * w, g, v * w), r(M * y, m, _ * y), 0.085, 0.17),
        Ue(a, s, r(M * w, g, _ * w), r(b * y, m, v * y), 0.085, 0.17));
    }
  }
  const c = l[l.length - 1],
    d = u(c);
  for (const [f, g] of h)
    Ue(a, s, r(f * d, c, g * d), r(0, c + 4, 0), 0.12, 0.17);
  const p = [];
  for (const [f, g] of [
    [25, 8],
    [30, 6.2],
  ]) {
    const m = u(f),
      w = u(f + 2.5);
    for (const y of [-1, 1]) {
      const x = r(y * g, f + 0.3, 0);
      for (const b of [-1, 1]) {
        (Ue(a, s, r(y * m, f, b * m), x, 0.12, 0.17),
          Ue(a, s, r(y * w, f + 2.5, b * w), x, 0.1, 0.17));
        for (let v = 0.25; v < 0.9; v += 0.25) {
          const M = r(y * (m + (g - m) * v), f + 0.3 * v, b * m * (1 - v)),
            _ = r(
              y * (w + (g - w) * (v + 0.12)),
              f + 2.5 - 2.2 * (v + 0.12),
              b * w * (1 - v - 0.12),
            );
          Ue(a, s, M, _, 0.06, 0.17);
        }
      }
      (Ue(a, s, r(y * m, f, m), r(y * m, f, -m), 0.1, 0.17),
        Me(a, "dark_metal", x, [x[0], x[1] - 2, x[2]], 0.12),
        p.push([x[0], x[1] - 2, x[2]]));
    }
  }
  return (p.push(r(0, c + 4, 0)), p);
}
function Qr(a, t, e) {
  const { x0: o, x1: s, z0: i, z1: n } = Ve,
    r = 0.3,
    l = "brick_white";
  a.box(
    "concrete_floor",
    [(o + s) / 2, 0.01, (i + n) / 2],
    [s - o - 0.2, 0.04, n - i - 0.2],
    {},
  );
  const u = (M) => ({ at: M, w: 1.7, y: 0.9, h: 1.55 });
  (a.wall(l, o, n - r / 2, s, n - r / 2, 0, pt, r, [
    u(1.8),
    u(5),
    { at: 7.8, w: 1.3, y: 0, h: 2.3 },
    u(19),
    u(22.3),
  ]),
    a.wall(
      l,
      o,
      n - r / 2,
      s,
      n - r / 2,
      pt,
      ft - pt,
      r,
      [1.8, 5, 8.2, 11.4, 14.6, 17.8, 21].map((M) => ({
        at: M,
        w: 1.7,
        y: 0.8,
        h: 1.6,
      })),
    ),
    a.wall(l, s - r / 2, i, s - r / 2, n, 0, pt, r, [
      { at: 3, w: 1.6, y: 0.9, h: 1.5 },
      { at: 6.6, w: 1.3, y: 0, h: 2.3 },
    ]),
    a.wall(l, s - r / 2, i, s - r / 2, n, pt, ft - pt, r, [
      { at: 3, w: 1.6, y: 0.8, h: 1.6 },
      { at: 7.4, w: 1.6, y: 0.8, h: 1.6 },
    ]),
    a.wall(l, o + r / 2, i, o + r / 2, n, 0, pt, r, [
      { at: 5.5, w: 1.6, y: 0.9, h: 1.5 },
    ]),
    a.wall(l, o + r / 2, i, o + r / 2, n, pt, ft - pt, r, [
      { at: 3, w: 1.6, y: 0.8, h: 1.6 },
      { at: 7.6, w: 1.6, y: 0.8, h: 1.6 },
    ]),
    a.wall(l, o, i + r / 2, s, i + r / 2, 0, ft, r, []),
    a.box(
      "concrete_wall",
      [(o + s) / 2, pt - 0.08, n + 0.03],
      [s - o + 0.06, 0.22, 0.06],
      { noCollide: !0, sub: !1 },
    ),
    a.box(
      "concrete_wall",
      [s + 0.03, pt - 0.08, (i + n) / 2],
      [0.06, 0.22, n - i],
      { noCollide: !0, sub: !1 },
    ),
    $e(a, "concrete_wall", o + r, s - r, i + r, n - r, pt - 0.25, 0.25, []),
    $e(a, "concrete_wall", o + r, s - r, i + r, n - r, ft - 0.25, 0.25, []),
    a.wall("plaster_damaged", -9, i + r, -9, n - r, 0, pt - 0.25, 0.18, [
      { at: 6, w: 1, y: 0, h: 2.1 },
    ]),
    a.wall("plaster_peeling", -9, i + r, -9, n - r, pt, ft - pt - 0.25, 0.18, [
      { at: 3, w: 1, y: 0, h: 2.1 },
    ]),
    a.box(
      "plaster_damaged",
      [(o + s) / 2, pt - 0.4, i + r + 0.01],
      [s - o - 2 * r, 0.6, 0.02],
      { noCollide: !0 },
    ));
  const h = ft + 0.04;
  (a.box(l, [(o + s) / 2, h, n - 0.15], [s - o, 0.08, 0.3], { sub: !1 }),
    a.box(l, [(o + s) / 2, h, i + 0.15], [s - o, 0.08, 0.3], { sub: !1 }),
    a.box(l, [o + 0.15, h, (i + n) / 2], [0.3, 0.08, n - i - 0.6], { sub: !1 }),
    a.box(l, [s - 0.15, h, (i + n) / 2], [0.3, 0.08, n - i - 0.6], { sub: !1 }),
    a.box(
      "flashing",
      [(o + s) / 2, h + 0.05, n - 0.1],
      [s - o + 0.04, 0.02, 0.24],
      { noCollide: !0, sub: !1 },
    ),
    a.box(
      "flashing",
      [(o + s) / 2, h - 0.02, n + 0.035],
      [s - o + 0.04, 0.16, 0.02],
      { noCollide: !0, sub: !1 },
    ),
    a.box("flashing", [s + 0.035, h - 0.02, (i + n) / 2], [0.02, 0.16, n - i], {
      noCollide: !0,
      sub: !1,
    }),
    a.box("flashing", [s - 0.14, h + 0.05, (i + n) / 2], [0.36, 0.02, n - i], {
      noCollide: !0,
      sub: !1,
    }));
  const c = -2.35,
    d = -1.05;
  (te(a, [(o + c) / 2, ft + 0.6, n - 0.1], [c - o, 1.2, 0.2]),
    te(a, [(d + s) / 2, ft + 0.6, n - 0.1], [s - d, 1.2, 0.2]),
    te(a, [(o + s) / 2, ft + 0.6, i + 0.1], [s - o, 1.2, 0.2]),
    te(a, [o + 0.1, ft + 0.6, (i + n) / 2], [0.2, 1.2, n - i]),
    te(a, [s - 0.1, ft + 0.6, (i + n) / 2], [0.2, 1.2, n - i]));
  const p = mo(17);
  a.box(
    "roof_base",
    [(o + s) / 2, ft + 0.005, (i + n) / 2],
    [s - o - 0.6, 0.01, n - i - 0.6],
    { noCollide: !0, sub: !1 },
  );
  const f = o + 0.32,
    g = s - 0.32,
    m = i + 0.32,
    w = n - 0.32;
  let y = 0;
  for (let M = w - 0.16; M > m + 0.16; M -= 0.33, y++) {
    const _ = (y & 1) * 0.25;
    for (let S = f + _; S < g - 0.05; S += 0.51) {
      const T = Math.min(0.49, g - S);
      if (T < 0.12 || p() < 0.015) continue;
      const A = p() < 0.38 ? "roof_paver_b" : "roof_paver",
        z = (p() - 0.5) * 0.012;
      a.box(A, [S + T / 2, ft + 0.025 + z, M], [T, 0.04, 0.315], {
        noCollide: !0,
        sub: !1,
        skipFaces: [3],
        localUV: !0,
        tile: 1.3,
      });
    }
  }
  (a.box(
    "roof_base",
    [(o + s) / 2, ft + 0.03, (i + n) / 2],
    [s - o - 0.6, 0.06, n - i - 0.6],
    { collideOnly: !0 },
  ),
    a.box(l, [-17.5, ft + 0.45, 35], [0.9, 0.9, 0.9], {}),
    a.box("metal_rust", [-17.5, ft + 0.93, 35], [1.05, 0.06, 1.05], {
      noCollide: !0,
      sub: !1,
    }),
    ce(a, "metal_galv_tube", [-12, ft, 34], [-12, ft + 0.9, 34], 0.06, 8));
  const x = (M, _, S, T, A, z, R, k) => {
      const V = (q, I) =>
          a.box("wood_weathered", q, z ? I : [I[2], I[1], I[0]], {
            noCollide: !0,
            sub: !1,
          }),
        F = (q, I) => (z ? [M + q, _ + I, S] : [M, _ + I, S + q]);
      if (R) {
        a.box(
          "plywood_sheet",
          z ? [M, _, S + 0.17] : [M + 0.17, _, S],
          z ? [T + 0.2, A + 0.15, 0.02] : [0.02, A + 0.15, T + 0.2],
          { noCollide: !0, localUV: !0 },
        );
        return;
      }
      (V(F(0, A / 2 - 0.06 / 2), [T, 0.06, 0.08]),
        V(F(0, -A / 2 + 0.06 / 2), [T, 0.06, 0.08]),
        V(F(-T / 2 + 0.06 / 2, 0), [0.06, A, 0.08]),
        V(F(T / 2 - 0.06 / 2, 0), [0.06, A, 0.08]),
        k
          ? V(F(-0.1, 0.1), [0.06, A * 0.55, 0.08])
          : V(F(0, 0.15), [T, 0.06 * 0.8, 0.08 * 0.8]));
    },
    b = n - 0.12;
  ([1.8, 5, 19, 22.3].forEach((M, _) =>
    x(o + M, 0.9 + 0.775, b, 1.7, 1.55, !0, _ === 1, _ === 2),
  ),
    [1.8, 5, 8.2, 11.4, 14.6, 17.8, 21].forEach((M, _) =>
      x(
        o + M,
        pt + 0.8 + 0.8,
        b,
        1.7,
        1.6,
        !0,
        _ === 3 || _ === 6,
        _ % 2 === 0,
      ),
    ),
    x(s - 0.12, 0.9 + 0.75, i + 3, 1.6, 1.5, !1, !1, !0),
    x(s - 0.12, pt + 1.6, i + 3, 1.6, 1.6, !1, !0, !1),
    x(s - 0.12, pt + 1.6, i + 7.4, 1.6, 1.6, !1, !1, !1));
  const v = n + 0.01;
  (t.push({
    pos: [o + 13, 1.55, v],
    normal: [0, 0, 1],
    size: [7, 2.5],
    wallKey: l,
    spec: { style: "piece", text: "DEADYARD", palette: 1, seed: 41 },
  }),
    t.push({
      pos: [o + 10, 0.75, v],
      normal: [0, 0, 1],
      size: [1.6, 0.8],
      wallKey: l,
      spec: { style: "tag", text: "KRS", palette: 7, seed: 5 },
    }),
    t.push({
      pos: [o + 16.6, 4.25, v],
      normal: [0, 0, 1],
      size: [1.6, 0.8],
      wallKey: l,
      spec: { style: "throwup", text: "OVR", palette: 0, seed: 9 },
    }),
    t.push({
      pos: [s + 0.01, 1.45, i + 9.15],
      normal: [1, 0, 0],
      size: [3.4, 1.7],
      wallKey: l,
      spec: { style: "piece", text: "NOIZ", palette: 3, seed: 12 },
    }),
    t.push({
      pos: [s + 0.01, 1.25, i + 4.85],
      normal: [1, 0, 0],
      size: [2, 1.7],
      wallKey: l,
      spec: { style: "tagwall", palette: 11, seed: 13 },
    }),
    t.push({
      pos: [s + 0.01, pt + 1.5, i + 5.2],
      normal: [1, 0, 0],
      size: [2.6, 1.3],
      wallKey: l,
      spec: { style: "throwup", text: "SKAM", palette: 6, seed: 14 },
    }),
    t.push({
      pos: [o + 4.4, 0.6, v],
      normal: [0, 0, 1],
      size: [2.6, 1],
      wallKey: l,
      spec: { style: "tagwall", palette: 11, seed: 15 },
    }),
    e.push({
      pos: [-14, pt - 0.4, 38],
      color: 14674175,
      intensity: 3.5,
      distance: 9,
      flicker: 1,
      zone: "indoor",
    }));
}
function De(a, t, e, o, s) {
  const i = new vt(0.34, 0.35, o, 18, Math.max(1, Math.round(o / 1.2)), !1);
  if (
    (a.geometry("pillar_conc", i, new B().makeTranslation(t, o / 2, e), {
      worldUV: !0,
      collide: !0,
    }),
    s)
  ) {
    const n = new vt(0.38, 0.38, 0.12, 18, 1, !1);
    a.geometry("pillar_conc", n, new B().makeTranslation(t, o + 0.06, e), {
      worldUV: !0,
    });
  }
}
function K0(a, t, e = 1.6, o = 0.32) {
  const s = new Na(t.map((n) => new P(n[0], 0, n[1]))),
    i = Math.ceil(s.getLength() / 0.8);
  for (const n of [-1, 1]) {
    const r = [],
      l = [],
      u = [];
    let h = null,
      c = null,
      d = 0;
    const p = new P(),
      f = new P(),
      g = new P();
    for (let w = 0; w <= i; w++) {
      const y = w / i;
      (s.getPointAt(y, g),
        s.getTangentAt(y, p),
        f.set(-p.z, 0, p.x).normalize());
      const x = (n * e) / 2 + Math.sin(w * 1.7 + n) * 0.03,
        b = (o / 2) * (0.8 + 0.2 * Math.sin(w * 0.9)),
        v = [g.x + f.x * (x - b), 0.004, g.z + f.z * (x - b)],
        M = [g.x + f.x * (x + b), 0.004, g.z + f.z * (x + b)];
      if (h) {
        const _ = d / 2.4,
          S = (d + 0.8) / 2.4;
        (r.push(...h, ...M, ...c, ...h, ...v, ...M),
          u.push(0, _, 0.15, S, 0.15, _, 0, _, 0, S, 0.15, S));
        for (let T = 0; T < 6; T++) l.push(0, 1, 0);
        d += 0.8;
      }
      ((h = v), (c = M));
    }
    const m = new Ut();
    (m.setAttribute("position", new tt(r, 3)),
      m.setAttribute("normal", new tt(l, 3)),
      m.setAttribute("uv", new tt(u, 2)),
      a.geometry("yard_track", m, null, {}));
  }
}
function X0(a, t, e, o, s, i, n = 0.006) {
  const r = mo(i),
    l = new vo(),
    u = 14;
  for (let c = 0; c < u; c++) {
    const d = (c / u) * Math.PI * 2,
      p = s * (0.65 + r() * 0.5),
      f = Math.cos(d) * p * 1.5,
      g = Math.sin(d) * p;
    c === 0 ? l.moveTo(f, g) : l.lineTo(f, g);
  }
  const h = new B0(l);
  (h.rotateX(-Math.PI / 2),
    a.geometry(t, h, new B().makeTranslation(e, n, o), { worldUV: !0 }));
}
function tl(a) {
  for (const [k, C] of Object.entries(pn)) ms[k] = C.tile;
  const t = [],
    e = [],
    o = [],
    s = [],
    i = (k, C, O, V, F = 0, q = {}) =>
      t.push({ model: k, pos: [C, O, V], rotY: F, ...q }),
    n = ut.w,
    r = ut.e,
    l = ut.n,
    u = ut.s;
  (a.box(
    "yard_gravel",
    [(n + r) / 2, -0.15, (l + u) / 2],
    [r - n, 0.3, u - l],
    {},
  ),
    a.box(
      "yard_outer",
      [16 / 2, -0.17, (u + 118) / 2 + 0.1],
      [108, 0.3, 118 - u],
      { noCollide: !0, sub: !1 },
    ),
    a.box(
      "yard_outer",
      [(r + 62) / 2 + 0.1, -0.17, (l + u) / 2],
      [62 - r, 0.3, u - l],
      { noCollide: !0, sub: !1 },
    ),
    a.box(
      "yard_outer",
      [(n - 46) / 2 - 0.1, -0.17, (l + u) / 2],
      [n + 46, 0.3, u - l],
      { noCollide: !0, sub: !1 },
    ),
    Y0(a, n, u, r, u),
    Y0(a, n, l, n, u),
    Y0(a, r, l, r, u),
    Qr(a, e, s),
    Kr(
      a,
      [-3, -1, 1, 3],
      [43.9, 45.9, 47.9, 49.9],
      [0.2, 2, 3.8, Et - 0.07, Et + 0.55, Et + 1.05, 8.2],
      8.9,
      [{ x0: -3, x1: 3, z0: 43.9, z1: 49.9, y: Et }],
    ));
  const h = "metal_galv_tube";
  for (const k of [3, 4.3, 5.65])
    for (const C of [42.95, 45.6, 48.35])
      (k === 3 && C === 45.6) ||
        (ce(a, h, [k, 0.04, C], [k, 7, C], 0.026, 6),
        a.box(h, [k, 3.5, C], [0.08, 7, 0.08], { collideOnly: !0 }));
  for (const k of [1, 2.8, 3.8, Et - 0.07, Et + 1.05])
    (ce(a, h, [5.65, k, 42.8], [5.65, k, 48.5], 0.024, 6),
      ce(a, h, [2.95, k, 42.95], [5.8, k, 42.95], 0.024, 6));
  (wn(a, 4.35, 5.55, 48.35, 44.1, 0, 2.8, 14),
    wn(a, 3.05, 4.25, 44.1, 48.35, 2.8, Et, 14));
  const c = { x0: 3.05, x1: 5.6, z0: 43, z1: 44.12 };
  for (let k = c.x0 + 0.13; k < c.x1; k += 0.255)
    a.box(
      "scaf_board",
      [k, 2.8 - 0.025, (c.z0 + c.z1) / 2],
      [0.24, 0.045, c.z1 - c.z0],
      { noCollide: !0, sub: !1 },
    );
  a.box(
    h,
    [(c.x0 + c.x1) / 2, 2.75, (c.z0 + c.z1) / 2],
    [c.x1 - c.x0, 0.1, c.z1 - c.z0],
    { collideOnly: !0 },
  );
  for (let k = 3.05 + 0.13; k < 4.3; k += 0.255)
    a.box("scaf_board", [k, Et - 0.025, 49.12], [0.24, 0.045, 1.55], {
      noCollide: !0,
      sub: !1,
    });
  (a.box(h, [3.68, Et - 0.05, 49.12], [1.3, 0.1, 1.6], { collideOnly: !0 }),
    te(a, [5.75, 3.6, 45.7], [0.1, 7.2, 5.6]),
    te(a, [4.3, 3.6, 42.88], [3, 7.2, 0.1]),
    te(a, [2.98, 2.8 + 2, 46], [0.06, 4, 4.1]),
    te(a, [4.3, Et + 0.6, 49.95], [0.1, 1.2, 1.7]),
    te(a, [3.65, Et + 0.6, 50], [1.3, 1.2, 0.1]),
    te(a, [-3.05, Et + 0.6, 46.9], [0.1, 1.2, 6]),
    te(a, [0, Et + 0.6, 49.98], [6.1, 1.2, 0.1]),
    te(a, [3.05, Et + 0.6, 45.6], [0.1, 1.2, 3.4]));
  {
    const C = Et + 0.02,
      O = 42.6,
      V = ft + 0.17,
      F = new Z(0.62, 0.05, Math.hypot(46.2 - O, C - V) + 0.2),
      q = Math.atan2(V - C, 46.2 - O),
      I = new B().makeRotationY(-0.06).multiply(new B().makeRotationX(q));
    (I.setPosition(-1.7, (C + V) / 2 + 0.02, (46.2 + O) / 2),
      a.geometry("wood_weathered", F, I, { worldUV: !0 }),
      Ui(a, -1.7, 1.2, 46.2, C, O, V));
  }
  (Zr(a, -2.9, 52.9, 0.1, t),
    De(a, -6.6, 50.1, 3.7, !1),
    De(a, 5.2, 55.42, 3.3, !0),
    De(a, -4.4, 55.42, 3.4, !1),
    De(a, -10.6, 55.42, 3.2, !1),
    De(a, -15.4, 54.93, 2.9, !0),
    De(a, 12.5, 54.86, 3.5, !1),
    De(a, 17.8, 49.54, 2.6, !0),
    De(a, 24.6, 52.2, 3.1, !1),
    De(a, -1.2, 55.7, 3, !0),
    yn(a, -6.55, ut.s - 0.75, 0.03),
    yn(a, -7.9, ut.s - 0.72, -0.04),
    Xr(a, -18.2, ut.s - 1.35, 0),
    e.push({
      pos: [-16.1, 2.05, ut.s - 1.35 - 1.24],
      normal: [0, 0, -1],
      size: [1.3, 0.55],
      wallKey: "container_green",
      spec: { style: "stencil", text: "EF 2581", palette: 7, seed: 3 },
    }),
    e.push({
      pos: [-19.6, 1.2, ut.s - 1.35 - 1.24],
      normal: [0, 0, -1],
      size: [2, 1],
      wallKey: "container_green",
      spec: { style: "tag", text: "RIP", palette: 2, seed: 77 },
    }));
  {
    a.box("wood_weathered", [-13, 0.07, 55.42], [1.2, 0.14, 1], {});
    for (let O = 0; O < 3; O++)
      for (let V = 0; V < 2; V++)
        for (let F = 0; F < 4; F++)
          a.box(
            "block_conc",
            [-13 - 0.4 + O * 0.4, 0.14 + 0.1 + F * 0.2, 55.42 - 0.25 + V * 0.5],
            [0.39, 0.19, 0.48],
            { noCollide: !0, sub: !1 },
          );
    (a.box("block_conc", [-13, 0.55, 55.42], [1.2, 0.85, 1], {
      collideOnly: !0,
    }),
      Ms(
        a,
        "block_conc",
        [-12, 0.1, 55.42 - 0.7],
        [0.39, 0.19, 0.48],
        0,
        0.6,
        0,
      ),
      Ms(
        a,
        "block_conc",
        [-13 + 0.9, 0.14, 55.42 + 0.4],
        [0.39, 0.19, 0.48],
        0.4,
        1.4,
        0.3,
      ),
      a.box("wood_weathered", [-13 + 1.3, 0.07, 55.42 - 1.6], [1.2, 0.14, 1], {
        rotY: 0.2,
      }));
  }
  const d = (k, C, O, V, F) => {
    const q = Math.cos(O),
      I = Math.sin(O),
      H = mo((k * 13 + C * 7) | 0),
      L = (D, U, Y) => [k + D * q + Y * I, U, C - D * I + Y * q];
    for (const D of [-F * 0.35, 0, F * 0.35])
      a.box("wood_weathered", L(D, 0.06, 0), [0.1, 0.12, 1.3], {
        rotY: O,
        noCollide: !0,
        sub: !1,
      });
    for (let D = 0; D < V; D++)
      for (let U = 0; U < 6; U++)
        a.box(
          "timber_pale",
          L((H() - 0.5) * 0.15, 0.12 + 0.03 + D * 0.065, -0.55 + U * 0.22),
          [F - H() * 0.4, 0.05, 0.19],
          { rotY: O, noCollide: !0, localUV: !0 },
        );
    a.box(
      "timber_pale",
      L(0, 0.12 + (V * 0.065) / 2, 0),
      [F, V * 0.065 + 0.12, 1.3],
      { rotY: O, collideOnly: !0 },
    );
  };
  (d(5.6, 51.3, 0.08, 9, 4.2), d(9, 51.78, Math.PI / 2 - 0.04, 5, 3.6));
  for (let k = 0; k < 5; k++)
    a.box(
      "fence_panel",
      [10.2 + (k % 2) * 0.04, 0.16 + k * 0.065, 46.6],
      [2, 0.06, 0.5],
      { rotY: 0.03 * k, noCollide: !0, sub: !1 },
    );
  for (const k of [-0.7, 0.7])
    a.box("wood_weathered", [10.2 + k, 0.06, 46.6], [0.1, 0.12, 0.7], {
      noCollide: !0,
      sub: !1,
    });
  (a.box("fence_panel", [10.2, 0.25, 46.6], [2, 0.5, 0.6], { collideOnly: !0 }),
    Ms(a, "timber_pale", [1.6, 0.03, 54.3], [3.6, 0.05, 0.22], 0, 0.3, 0),
    Ms(a, "timber_pale", [1.9, 0.08, 54.58], [3.2, 0.05, 0.22], 0.02, 0.45, 0),
    Ms(a, "timber_pale", [12.5, 1.25, 54.55], [0.24, 2.7, 0.05], -0.32, 0, 0));
  {
    const k = new vo();
    (k.moveTo(-0.3, 0),
      k.lineTo(0.3, 0),
      k.lineTo(0.3, 0.12),
      k.lineTo(0.12, 0.72),
      k.lineTo(-0.12, 0.72),
      k.lineTo(-0.3, 0.12),
      k.lineTo(-0.3, 0));
    const C = new Ci(k, { depth: 3.4, bevelEnabled: !1 });
    (C.translate(0, 0, -1.7),
      C.rotateY(Math.PI / 2),
      a.geometry(
        "barrier_conc",
        C,
        new B().makeRotationY(0.02).setPosition(-9.8, 0, 51.4),
        { worldUV: !0, collide: !0 },
      ),
      Ms(a, "plywood_sheet", [-9.3, 0.6, 51], [2, 2, 0.03], 0.95, 0.06, 0, {
        collide: !0,
      }));
  }
  {
    const k = (C, O, V, F, q, I) => {
      const H = new Mo(1, 22, 9, 0, Math.PI * 2, 0, Math.PI / 2),
        L = H.attributes.position;
      for (let U = 0; U < L.count; U++) {
        const Y = L.getX(U);
        L.getY(U);
        const et = L.getZ(U),
          G =
            1 +
            0.16 * Math.sin(Y * 3.1 + I) * Math.cos(et * 2.7 - I) +
            0.08 * Math.sin(Y * 7.3 + et * 5.1 + I * 2),
          j = Math.min(1, Math.hypot(Y, et)),
          wt = j > 0.98 ? 1 : G;
        L.setXYZ(U, Y * wt, Math.pow(1 - j, 1.15) * (0.85 + 0.15 * G), et * wt);
      }
      (H.computeVertexNormals(),
        a.geometry(
          "yard_rubble",
          H,
          new B().makeScale(V, F, q).setPosition(C, -0.05, O),
          { worldUV: !0, collide: !0 },
        ));
      const D = mo(I * 31);
      for (let U = 0; U < 7; U++) {
        const Y = D() * Math.PI * 2,
          et = 0.3 + D() * 0.6,
          G = C + Math.cos(Y) * V * et,
          j = O + Math.sin(Y) * q * et,
          wt = F * Math.pow(1 - et, 1.15) - 0.02;
        Ms(
          a,
          "block_conc",
          [G, wt, j],
          [0.2 + D() * 0.35, 0.12 + D() * 0.12, 0.2 + D() * 0.3],
          D() * 0.8,
          D() * 3,
          D() * 0.8,
          { collide: !1 },
        );
      }
    };
    (k(21.5, 43, 3, 1, 2.3, 3), k(25.2, 45.4, 1.7, 0.6, 1.4, 7));
  }
  (X0(a, "yard_rubble", -12.5, 52.2, 1.8, 21, 0.008),
    X0(a, "yard_rubble", 2, 55.84, 1.5, 23, 0.008),
    X0(a, "yard_rubble", 24, 49.4, 2.2, 29, 0.008),
    K0(a, [
      [8, 32.8],
      [7.6, 40],
      [6.8, 46.5],
      [3.5, 49.75],
      [-3, 52.55],
      [-9, 53.6],
      [-16, 53],
    ]),
    K0(
      a,
      [
        [8.6, 32.8],
        [10, 42],
        [13, 50],
        [17, 53.2],
        [22, 54],
      ],
      1.75,
      0.34,
    ),
    K0(
      a,
      [
        [-19, 51.85],
        [-12, 50.8],
        [-5, 49.12],
        [-1, 48.2],
      ],
      1.6,
      0.3,
    ));
  const p = 5.95,
    f = ut.s + 1.4,
    g = [
      [27.5, f],
      [13.5, f],
      [-0.5, f],
      [-14, f],
    ];
  for (const [k, C] of g)
    i("modular_electricity_poles", k, 0, C, Math.PI / 2, {
      filter: "^preset_01_(?!fastener)",
    });
  i("modular_electricity_poles", -8.7, 0, 52.62, Math.PI / 2 + 0.5, {
    filter: "^preset_01_(?!fastener)",
  });
  const m = (k, C, O) => [k, p, C + O],
    w = [[48, f], ...g, [-40, f]];
  for (let k = 0; k < w.length - 1; k++)
    for (const C of [-0.45, 0, 0.45]) {
      const O = m(w[k][0], w[k][1], C),
        V = m(w[k + 1][0], w[k + 1][1], C);
      Ks(a, O, V, 0.55 + Math.abs(C) * 0.3, 0.014);
    }
  (Ks(a, m(-14, f, 0), [-8.7, p - 0.2, 52.62], 0.7, 0.014),
    Ks(a, [-8.7, p - 0.2, 52.62], [-9, ft - 0.6, Ve.z1 + 0.02], 0.5, 0.012),
    Ks(a, m(-0.5, f, 0.45), [-8.7, p - 0.4, 52.62], 0.8, 0.012));
  const y = [2.5, 88],
    x = Jr(a, y[0], y[1], 0);
  for (const k of x)
    (Ks(a, k, [k[0] + 90, k[1] + 1, k[2] + 30], 3, 0.03),
      Ks(a, k, [k[0] - 90, k[1] + 1, k[2] - 10], 3, 0.03));
  (i("covered_car", -16, 0, 50.7, 0.7),
    i("concrete_road_barrier_02", 18.5, 0, 53.95, 1.2),
    i("concrete_road_barrier_02", 26.5, 0, 36, 0.1));
  const b = { filter: "^metal_trash_can(_lid|_handle_left|_handle_right)?$" };
  (i("metal_trash_can", -7.35, 0, 51.15, 0.2, b),
    i("metal_trash_can", -7, 0, 51.75, 1.1, b),
    i("Barrel_01", 19.6, 0, 37.6, 0.2),
    i("barrel_03", 25.2, 0, 55.42, 0.9),
    i("barrel_03", 20.3, 0, 37, 0.5),
    i("cement_bag", 7.6, 0, 53.32, 0.3),
    i("cement_bag", 7.8, 0.18, 53.25, 1.1),
    i("wooden_crate_02", 27.2, 0, 56.12, 0.1),
    i("wooden_crate_01", 26, 0, 56.26, 0.4),
    i("old_tyre", -20.2, 0, 52.34, 0, { tilt: Math.PI / 2 }),
    i("old_tyre", 28.9, 0, 47.5, 0.6, { tilt: Math.PI / 2 }),
    i("industrial_pastic_container", 28.6, 0, 50.8, 0.3, {
      filter: "^industrial_pastic_container(_lid_a)?$",
    }),
    i("trashbag", 20.5, 0, 56.12, 0.6),
    i("metal_jerrycan", 1.7, 0, 53.32, 0.4),
    i("wooden_ladder", 2.2, 0, 50.15, 0, { tiltX: -0.2, fit: { h: 3.4 } }),
    i("dry_branches_medium_01", 29, 0, 56.12, 1.2, { filter: "_a$" }),
    i("dry_branches_medium_01", -20.8, 0, 50.8, 0.2, { filter: "_b$" }),
    i("portable_generator", 3.6, 0, 53.81, 2.4),
    i("wooden_crate_01", 15.6, 0, 37.2, 0.7));
  const v = mo(2024);
  let M = 1;
  const _ = (k, C, O) => {
      if (
        k > 44 ||
        k < -34 ||
        (Math.abs(k - y[0]) < 5 && Math.abs(C - y[1]) < 5)
      )
        return;
      const V = O ? v() < 0.45 : v() < 0.18;
      o.push({
        type: V ? "bare_young" : "bare",
        pos: [k, -0.02, C],
        scale: V ? 1.1 + v() * 0.5 : 0.75 + v() * 0.35,
        seed: M++,
      });
    },
    S = ut.s - 61,
    T = [
      [62.4, 1.7, !0],
      [64.2, 2, !0],
      [66.8, 2.5, !1],
      [70.5, 3, !1],
      [75.5, 3.6, !1],
    ].map((k) => [k[0] + S, k[1], k[2]]);
  T.push([82, 4.4, !1], [91, 5.2, !1]);
  for (const [k, C, O] of T)
    for (let V = -32 + v() * 2; V < 42; V += C * (0.75 + v() * 0.5))
      _(V + (v() - 0.5) * 1.2, k + (v() - 0.5) * 2, O);
  for (const [k, C, O] of [
    [33, 2.4, !0],
    [35.8, 3, !0],
    [39.5, 3.8, !1],
  ])
    for (let V = 34 + v() * 2; V < 62; V += C * (0.75 + v() * 0.5))
      _(k + (v() - 0.5) * 1.5, V, O);
  for (const [k, C, O] of [
    [-24, 3.4, !0],
    [-29.5, 4.6, !1],
  ])
    for (let V = 36 + v() * 2; V < 62; V += C * (0.75 + v() * 0.5))
      _(k + (v() - 0.5) * 1.5, V, O);
  for (const [k, C] of [
    [ut.s + 0.9, 1.1],
    [ut.s + 2.1, 1.3],
    [ut.s + 3.3, 1.6],
  ])
    for (let O = -30 + v(); O < 40; O += C * (0.7 + v() * 0.6))
      (Math.abs(O - y[0]) < 4 && Math.abs(k - y[1]) < 4) ||
        o.push({
          type: "bare_young",
          pos: [O + (v() - 0.5) * 0.6, -0.02, k + (v() - 0.5) * 0.8],
          scale: 0.5 + v() * 0.4,
          seed: M++,
        });
  for (let k = 34 + v(); k < ut.s + 1; k += 1.3 * (0.7 + v() * 0.6))
    o.push({
      type: "bare_young",
      pos: [31.8 + v() * 0.8, -0.02, k],
      scale: 0.5 + v() * 0.4,
      seed: M++,
    });
  for (let k = 44 + v(); k < ut.s + 1; k += 1.3 * (0.7 + v() * 0.6))
    o.push({
      type: "bare_young",
      pos: [-22.6 - v() * 0.8, -0.02, k],
      scale: 0.5 + v() * 0.4,
      seed: M++,
    });
  (o.push({ type: "bare_young", pos: [22, 0, 39.5], scale: 1, seed: 901 }),
    o.push({ type: "bare_young", pos: [27.5, 0, 42.5], scale: 0.9, seed: 902 }),
    o.push({ type: "bare_young", pos: [29.4, 0, 53.6], scale: 1.1, seed: 903 }),
    e.push({
      pos: [ut.e - 0.05, 1.15, 40],
      normal: [-1, 0, 0],
      size: [3.4, 1.5],
      wallKey: "fence_panel",
      spec: { style: "throwup", text: "DOPE", palette: 5, seed: 31 },
    }),
    e.push({
      pos: [22, 1, ut.s - 0.05],
      normal: [0, 0, -1],
      size: [2.8, 1.2],
      wallKey: "fence_panel",
      spec: { style: "scrawl", text: "KEEP OUT", palette: 2, seed: 4 },
    }),
    e.push({
      pos: [ut.w + 0.05, 1.1, 47],
      normal: [1, 0, 0],
      size: [3, 1.3],
      wallKey: "fence_panel",
      spec: { style: "piece", text: "YARD", palette: 4, seed: 18 },
    }));
  const A = [
      {
        name: "obra PB",
        type: "indoor",
        min: [Ve.x0, 0, Ve.z0],
        max: [Ve.x1, pt, Ve.z1],
      },
      {
        name: "obra P1",
        type: "indoor",
        min: [Ve.x0, pt, Ve.z0],
        max: [Ve.x1, ft, Ve.z1],
      },
      {
        name: "patio obra",
        type: "outdoor",
        min: [ut.w, 0, ut.n],
        max: [ut.e, 30, ut.s],
      },
    ],
    z = [
      {
        name: "obra cubierta (5.webp)",
        pos: [-6.2, ft + 0.04, 41.8],
        yaw: Math.PI - 0.04,
        pitch: -0.28,
      },
      { name: "obra suelo", pos: [11.5, 0, 40.5], yaw: 2.15, pitch: 0.06 },
    ];
  return {
    props: t,
    decals: e,
    trees: o,
    lights: s,
    zones: A,
    bench: z,
    materials: pn,
    notes:
      "OBRA (5.webp): patio x -21.6..30.8, z 32.4..61 cerrado por valla de paneles prefabricados (colisión invisible 4 m). Edificio 2 plantas (cubierta transitable 6.0) x -21.2..3 z 32.6..43.5: subida por torre de escalera de andamio (x 3..5.65, z 43..48.4, entrada por el sur en x 4.35..5.55) → plataforma 5.6 (x -3..3, z 43.9..49.9) → tablón inclinado en x≈-1.7 → cubierta. Fuera de la región asignada (desactivables con WEST_BELT / EAST_BELT / FAR_BELT al inicio de Yard.js): árboles y suelo exterior x -46..62, z hasta 118, y la torre de alta tensión en z=88 (con FAR_BELT=false va a z=73).",
  };
}

export { tl };
