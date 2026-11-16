// level/area-callejon.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { $ as B0, B as Z, E as Ut, I as tt, K as vo, Q, V as P, X as Ci, Y as vt, Z as Ae, _ as Mo, a2 as I0, o as B, p as Ke } from "three-vendor";
import { ms } from "./builder.js";
import { $e } from "./area-urbex.js";

const ot = 16.15,
  xe = -19.7,
  be = -9.05,
  $ = 26.6,
  Ce = 30.7,
  Ct = [0, 3.3, 6.6],
  Jt = 9.9,
  N = 0.015,
  Ko = [21.35, 22.65],
  xn = {
    al_asphalt: {
      tex: "ground_asphalt",
      tint: 9407106,
      normal: 1.1,
      roughness: 1,
      tile: 4,
      surface: "gravel",
    },
    al_crack: {
      tex: "ground_asphalt",
      tint: 2762533,
      normal: 0.6,
      roughness: 1,
      tile: 1,
      surface: "gravel",
    },
    al_leaves: {
      tex: "ground_gravel_leaves",
      tint: 10521196,
      normal: 1,
      roughness: 1,
      tile: 2.2,
      surface: "dirt",
    },
    al_debris: {
      tex: "ground_debris",
      tint: 9276036,
      normal: 1.2,
      roughness: 1,
      tile: 2.5,
      surface: "gravel",
    },
    al_rubble: {
      tex: "ground_rubble",
      tint: 9736072,
      normal: 1.4,
      roughness: 1,
      tile: 2,
      surface: "gravel",
    },
    al_puddle: {
      tex: "ground_asphalt",
      tint: 1843236,
      roughness: 0.04,
      normal: 0.15,
      tile: 3,
      surface: "water",
    },
    al_walk: {
      tex: "concrete_floor",
      tint: 10262415,
      normal: 1,
      roughness: 1,
      tile: 2.5,
      surface: "concrete",
    },
    al_curb: {
      tex: "concrete_rough",
      tint: 11775653,
      normal: 1,
      roughness: 1,
      tile: 1.5,
      surface: "concrete",
    },
    al_wall_n: {
      tex: "concrete_wall",
      tint: 11578533,
      normal: 1,
      roughness: 1,
      tile: 3,
      surface: "concrete",
    },
    al_wall_s: {
      tex: "concrete_panel",
      tint: 11841705,
      normal: 1,
      roughness: 1,
      tile: 3,
      surface: "concrete",
    },
    al_brick: {
      tex: "brick_wall",
      tint: 9734016,
      normal: 1.2,
      roughness: 1,
      tile: 2.2,
      surface: "brick",
    },
    al_int: {
      tex: "plaster_damaged",
      tint: 7236196,
      normal: 1,
      roughness: 1,
      tile: 2.5,
      surface: "plaster",
    },
    al_conc: {
      tex: "concrete_rough",
      tint: 10394259,
      normal: 1,
      roughness: 1,
      tile: 2,
      surface: "concrete",
    },
    al_floor: {
      tex: "concrete_floor",
      tint: 9078141,
      normal: 1,
      roughness: 1,
      tile: 3,
      surface: "concrete",
    },
    al_frame: {
      tex: "metal_rust",
      tint: 4867908,
      metal: !1,
      roughness: 0.8,
      normal: 0.6,
      tile: 1,
      surface: "metal",
    },
    al_glass: {
      tex: "concrete_wall",
      tint: 2106922,
      roughness: 0.06,
      normal: 0.05,
      tile: 2,
      surface: "glass",
    },
    al_board: {
      tex: "plywood",
      tint: 9204570,
      roughness: 1,
      normal: 1,
      tile: 1.6,
      surface: "wood",
    },
    al_galv: {
      tex: "metal_galv",
      tint: 14014936,
      metal: !1,
      roughness: 0.55,
      normal: 0.4,
      tile: 1.1,
      surface: "metal",
    },
    al_dark: {
      tex: "metal_rust",
      tint: 3816508,
      metal: !0,
      roughness: 0.8,
      normal: 0.6,
      tile: 1,
      surface: "metal",
    },
    al_plank: {
      tex: "plywood",
      tint: 12891031,
      roughness: 1,
      normal: 1,
      tile: 1.2,
      surface: "wood",
    },
    al_pallet: {
      tex: "wood_weathered",
      tint: 11048316,
      roughness: 1,
      normal: 1,
      tile: 1.2,
      surface: "wood",
    },
    al_yellow: {
      tex: "concrete_rough",
      tint: 16765466,
      roughness: 0.5,
      normal: 0.3,
      tile: 0.7,
      surface: "metal",
    },
    al_rust: {
      tex: "metal_rust",
      tint: 8022618,
      metal: !0,
      roughness: 0.9,
      normal: 0.8,
      tile: 0.6,
      surface: "metal",
    },
    al_mesh: {
      tex: "concrete_rough",
      tint: 2246955,
      roughness: 0.95,
      normal: 0.9,
      tile: 0.25,
      surface: "soft",
    },
    al_barrier: {
      tex: "concrete_rough",
      tint: 10591380,
      roughness: 1,
      normal: 1.3,
      tile: 1.4,
      surface: "concrete",
    },
    al_block: {
      tex: "concrete_rough",
      tint: 10328724,
      roughness: 1,
      normal: 1.2,
      tile: 1,
      surface: "concrete",
    },
    al_brickbit: {
      tex: "brick_broken",
      tint: 10123884,
      roughness: 1,
      normal: 1,
      tile: 1,
      surface: "brick",
    },
  },
  el = new P(0, 1, 0),
  Z0 = new P(),
  J0 = new P(),
  Xo = new P(),
  bn = new P(),
  vn = new Q(),
  sl = new P(1, 1, 1),
  ol = new B();
function ke(a) {
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
function al(a, t) {
  (Z0.set(...a), J0.set(...t), Xo.subVectors(J0, Z0));
  const e = Xo.length();
  return (
    Xo.divideScalar(e),
    vn.setFromUnitVectors(el, Xo),
    bn.addVectors(Z0, J0).multiplyScalar(0.5),
    { m: ol.compose(bn, vn, sl), len: e }
  );
}
function re(a, t, e, o, s = 0.024, i = 6, n = {}) {
  const { m: r, len: l } = al(e, o);
  a.geometry(t, new vt(s, s, l, i, 1, !0), r, { worldUV: !0, ...n });
}
function se(a, t, e, o, s = 0, i = 0, n = 0, r = {}) {
  const l = new B()
    .makeRotationFromEuler(new Ae(s, i, n, "YXZ"))
    .setPosition(...e);
  a.geometry(t, new Z(...o), l, { worldUV: !0, ...r });
}
const Mn = (a, t, e) => a.box("al_conc", t, e, { collideOnly: !0 });
function Yt(a, t, e, o, s, i, n = N + 0.004, r = 1.5) {
  const l = ke(i),
    u = new vo(),
    h = 16;
  for (let d = 0; d < h; d++) {
    const p = (d / h) * Math.PI * 2,
      f = s * (0.65 + l() * 0.5),
      g = Math.cos(p) * f * r,
      m = Math.sin(p) * f;
    d === 0 ? u.moveTo(g, m) : u.lineTo(g, m);
  }
  const c = new B0(u);
  (c.rotateX(-Math.PI / 2),
    a.geometry(t, c, new B().makeTranslation(e, n, o), { worldUV: !0 }));
}
function nl(a, t, e, o, s, i, n = 0.045) {
  const r = ke(i),
    l = [],
    u = [],
    h = [],
    c = (p, f, g, m, w, y) => {
      let x = p,
        b = f,
        v = 0;
      const M = 0.18;
      let _ = null,
        S = null;
      for (let T = 0; T <= m / M; T++) {
        g += (r() - 0.5) * 0.9;
        const A = -Math.sin(g),
          z = Math.cos(g),
          R = w * (0.5 + r() * 0.7) * (1 - (T / (m / M)) * 0.6),
          k = [x + A * R, N + 0.003, b + z * R],
          C = [x - A * R, N + 0.003, b - z * R];
        if (_) {
          (l.push(..._, ...S, ...C, ..._, ...C, ...k),
            h.push(0, v, 0.1, v, 0.1, v + 0.2, 0, v, 0.1, v + 0.2, 0, v + 0.2));
          for (let O = 0; O < 6; O++) u.push(0, 1, 0);
          v += 0.2;
        }
        if (
          ((_ = k),
          (S = C),
          y < 1 &&
            r() < 0.12 &&
            c(x, b, g + (r() < 0.5 ? 0.9 : -0.9), m * 0.35, w * 0.6, y + 1),
          (x += Math.cos(g) * M),
          (b += Math.sin(g) * M),
          x < ot + 0.1 || x > $ - 0.1 || b < xe || b > be - 0.05)
        )
          break;
      }
    };
  c(t, e, o, s, n, 0);
  const d = new Ut();
  (d.setAttribute("position", new tt(l, 3)),
    d.setAttribute("normal", new tt(u, 3)),
    d.setAttribute("uv", new tt(h, 2)),
    a.geometry("al_crack", d, null, {}));
}
function il(a, t, e, o, s = 1, i = 0) {
  const n = ke(o),
    r = 0.06,
    l = new B().makeRotationZ(i).setPosition(t, N + s / 2, e);
  if (
    (a.geometry("al_yellow", new vt(r, r, s, 12, 1, !0), l, { worldUV: !0 }),
    s > 0.5)
  ) {
    const u = new Mo(r, 12, 4, 0, Math.PI * 2, 0, Math.PI / 2);
    a.geometry(
      "al_yellow",
      u,
      new B().makeRotationZ(i).setPosition(t - (Math.sin(i) * s) / 2, N + s, e),
      { worldUV: !0 },
    );
  } else
    a.geometry(
      "al_rust",
      new I0(r, 12).rotateX(-Math.PI / 2),
      new B().makeTranslation(t, N + s, e),
      { worldUV: !0 },
    );
  a.geometry(
    "al_rust",
    new vt(r + 0.002, r + 0.006, 0.09, 12, 1, !0),
    new B().makeTranslation(t, N + 0.045, e),
    { worldUV: !0 },
  );
  for (let u = 0; u < 3; u++) {
    if (n() < 0.35) continue;
    const h = 0.15 + n() * (s - 0.3),
      c = 0.02 + n() * 0.05,
      d = n() * Math.PI * 2,
      p = new vt(r + 0.0015, r + 0.0015, c, 8, 1, !0, d, 0.6 + n() * 1.6);
    a.geometry("al_rust", p, new B().makeTranslation(t, N + h, e), {
      worldUV: !0,
    });
  }
  a.box("al_yellow", [t, N + s / 2, e], [0.14, s, 0.14], { collideOnly: !0 });
}
function _n(a, t, e, o, s, i = 0) {
  const n = [];
  for (let l = -3; l <= 3; l++)
    n.push([
      [l * 0.19, 0.13, 0],
      [0.11, 0.022, 1.2],
    ]);
  for (const l of [-0.55, 0, 0.55])
    n.push([
      [0, 0.07, l],
      [1, 0.1, 0.1],
    ]);
  for (let l = -1; l <= 1; l++)
    n.push([
      [l * 0.43, 0.011, 0],
      [0.12, 0.022, 1.2],
    ]);
  const r = new B().makeRotationY(s).multiply(new B().makeRotationX(i));
  for (const [l, u] of n) {
    const h = new B()
      .makeTranslation(t, e, o)
      .multiply(r)
      .multiply(new B().makeTranslation(...l));
    a.geometry("al_pallet", new Z(...u), h, { worldUV: !0 });
  }
}
function Sn(a, t, e, o, s, i, n) {
  const r = Math.cos(o),
    l = Math.sin(o),
    u = ke(n),
    h = (c, d, p) => [t + c * r + p * l, d, e - c * l + p * r];
  for (const c of [-i * 0.35, 0, i * 0.35])
    a.box("al_pallet", h(c, N + 0.05, 0), [0.1, 0.1, 1.1], {
      rotY: o,
      noCollide: !0,
      sub: !1,
    });
  for (let c = 0; c < s; c++)
    for (let d = 0; d < 5; d++)
      (c === s - 1 && u() < 0.35) ||
        a.box(
          "al_plank",
          h((u() - 0.5) * 0.2, N + 0.1 + 0.026 + c * 0.055, -0.44 + d * 0.22),
          [i - u() * 0.5, 0.045, 0.2],
          { rotY: o, noCollide: !0, localUV: !0 },
        );
  a.box(
    "al_plank",
    h(0, N + 0.1 + (s * 0.055) / 2, 0),
    [i, s * 0.055 + 0.1, 1.1],
    { rotY: o, collideOnly: !0 },
  );
}
function Q0(a, t, e, o, s, i, n) {
  const r = new Mo(1, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2),
    l = r.attributes.position;
  for (let h = 0; h < l.count; h++) {
    const c = l.getX(h),
      d = l.getZ(h),
      p =
        1 +
        0.16 * Math.sin(c * 3.1 + n) * Math.cos(d * 2.7 - n) +
        0.08 * Math.sin(c * 7.3 + d * 5.1 + n * 2),
      f = Math.min(1, Math.hypot(c, d)),
      g = f > 0.98 ? 1 : p;
    l.setXYZ(h, c * g, Math.pow(1 - f, 1.15) * (0.85 + 0.15 * p), d * g);
  }
  (r.computeVertexNormals(),
    a.geometry(
      "al_rubble",
      r,
      new B().makeScale(o, s, i).setPosition(t, -0.03, e),
      { worldUV: !0, collide: !0 },
    ));
  const u = ke(n * 31);
  for (let h = 0; h < 9; h++) {
    const c = u() * Math.PI * 2,
      d = 0.25 + u() * 0.7,
      p = t + Math.cos(c) * o * d,
      f = e + Math.sin(c) * i * d,
      g = s * Math.pow(1 - d, 1.15) - 0.01,
      m = u() < 0.5;
    se(
      a,
      m ? "al_brickbit" : "al_block",
      [p, g, f],
      m
        ? [0.22, 0.065, 0.1]
        : [0.15 + u() * 0.3, 0.08 + u() * 0.1, 0.15 + u() * 0.25],
      u() * 0.8,
      u() * 3,
      u() * 0.8,
    );
  }
}
function kn(a, t, e, o) {
  a.box("al_dark", [t, e, o], [0.08, 0.08, 0.08], { noCollide: !0, sub: !1 });
}
function rl(a) {
  const t = "al_galv",
    e = [25.2, 26.35],
    o = [-19.45, -17.35, -15.25],
    s = [1.65, 3.3, 4.95, 6.6, 8.25],
    i = 8.9,
    n = e[0],
    r = e[1],
    l = o[0],
    u = o[o.length - 1];
  for (const h of e)
    for (const c of o)
      (re(a, t, [h, 0.04, c], [h, i, c], 0.026, 6),
        a.box("al_dark", [h, N + 0.015, c], [0.16, 0.03, 0.16], {
          noCollide: !0,
          sub: !1,
        }),
        a.box("al_pallet", [h, N + 0.035, c], [0.24, 0.04, 0.24], {
          noCollide: !0,
          sub: !1,
        }),
        a.box(t, [h, i / 2, c], [0.08, i, 0.08], { collideOnly: !0 }));
  for (const h of s) {
    for (const c of e) {
      re(a, t, [c - 0.05, h, l - 0.2], [c - 0.05, h, u + 0.2], 0.024, 6);
      for (const d of o) kn(a, c - 0.05, h, d);
    }
    for (const c of o) {
      re(
        a,
        t,
        [n - 0.2, h + 0.07, c + 0.05],
        [r + 0.15, h + 0.07, c + 0.05],
        0.024,
        6,
      );
      for (const d of e) kn(a, d, h + 0.07, c + 0.05);
    }
  }
  for (let h = 0; h < o.length - 1; h++) {
    const c = h % 2 ? s[1] : 0.25,
      d = h % 2 ? 0.25 : s[1];
    (re(a, t, [n - 0.1, c, o[h]], [n - 0.1, d, o[h + 1]], 0.024, 6),
      re(
        a,
        t,
        [n - 0.1, s[1] + (h % 2 ? s[2] - s[1] : 0.1), o[h]],
        [n - 0.1, s[3] - (h % 2 ? 0.1 : s[3] - s[2]), o[h + 1]],
        0.024,
        6,
      ));
  }
  re(a, t, [n - 0.1, s[3], l], [n - 0.1, i - 0.1, o[1]], 0.024, 6);
  for (const h of [s[1], s[3]]) {
    const c = Math.floor((r - n + 0.1) / 0.25);
    for (let d = 0; d < c; d++) {
      const p = n - 0.02 + 0.125 + d * 0.25,
        f = Math.sin(d * 7.1 + h) * 0.012;
      a.box(
        "al_plank",
        [p, h + 0.12 + f * 0.3, (l + u) / 2 + f * 4],
        [0.24, 0.045, u - l + 0.4],
        { noCollide: !0 },
      );
    }
    a.box(
      "al_plank",
      [n - 0.03, h + 0.24, (l + u) / 2],
      [0.03, 0.17, u - l + 0.3],
      { noCollide: !0, sub: !1 },
    );
    for (const d of [0.62, 1.12])
      re(
        a,
        t,
        [n - 0.08, h + d, l - 0.2],
        [n - 0.08, h + d, u + 0.2],
        0.024,
        6,
      );
    for (const d of [l, u])
      for (const p of [0.62, 1.12])
        re(a, t, [n - 0.1, h + p, d - 0.06], [r, h + p, d - 0.06], 0.022, 6);
    a.box(
      t,
      [(n + r) / 2, h + 0.07, (l + u) / 2],
      [r - n + 0.1, 0.1, u - l + 0.3],
      { collideOnly: !0 },
    );
  }
  se(
    a,
    "al_plank",
    [25.75, s[3] + 0.2, -16.3],
    [0.22, 0.04, 2.6],
    0,
    0.15,
    0.05,
  );
}
function ll(a, t, e) {
  const s = $ + 0.15,
    i = -8.75,
    n = -20,
    r = "al_brick",
    l = i - n,
    u = [
      { at: 1.6, w: 1.4, y: 0.9, h: 1.6 },
      { at: 6, w: 1.3, y: 0, h: 2.3 },
      { at: 9, w: 1.6, y: 0.9, h: 1.6 },
    ],
    h = [
      { at: 1.7, w: 1.6 },
      { at: 4.3, w: 2 },
      { at: 7, w: 2 },
      { at: 9.7, w: 1.8 },
    ].map((m) => ({ ...m, y: 0.8, h: 1.8 }));
  (a.wall(r, s, i, s, n, Ct[0], Ct[1], 0.3, u),
    a.wall(r, s, i, s, n, Ct[1], Ct[2] - Ct[1], 0.3, h),
    a.wall(r, s, i, s, n, Ct[2], Jt - Ct[2], 0.3, h),
    a.wall(r, s, i, s, n, Jt, 0.6, 0.3, []),
    a.box(
      r,
      [($ + 31) / 2, (Jt + 0.6) / 2, n + 0.3 / 2],
      [31 - $, Jt + 0.6, 0.3],
      {},
    ),
    a.box(
      r,
      [($ + 31) / 2, (Jt + 0.6) / 2, i - 0.3 / 2],
      [31 - $, Jt + 0.6, 0.3],
      {},
    ),
    a.box(
      r,
      [Ce + 0.15, (Jt + 0.6) / 2, (i + n) / 2],
      [0.3, Jt + 0.6, l - 2 * 0.3],
      {},
    ),
    a.box(
      "al_floor",
      [($ + 0.3 + Ce) / 2, 0.02, (i + n) / 2],
      [Ce - $ - 0.3, 0.05, l - 2 * 0.3],
      {},
    ));
  for (const m of [Ct[1], Ct[2], Jt])
    $e(a, "al_conc", $ + 0.3, Ce, n + 0.3, i - 0.3, m - 0.25, 0.25, []);
  for (let m = 0; m < 3; m++) {
    const w = Ct[m] + (m ? 0 : 0.05),
      y = (Ct[m + 1] ?? Jt) - 0.25;
    (a.box(
      "al_int",
      [Ce - 0.01, (w + y) / 2, (i + n) / 2],
      [0.02, y - w, l - 2 * 0.3],
      { noCollide: !0 },
    ),
      a.box(
        "al_int",
        [($ + Ce) / 2 + 0.15, (w + y) / 2, n + 0.3 + 0.01],
        [Ce - $ - 0.3, y - w, 0.02],
        { noCollide: !0 },
      ),
      a.box(
        "al_int",
        [($ + Ce) / 2 + 0.15, (w + y) / 2, i - 0.3 - 0.01],
        [Ce - $ - 0.3, y - w, 0.02],
        { noCollide: !0 },
      ),
      a.box(
        "al_int",
        [$ + 0.3 + 0.01, (w + y) / 2 + (y - w) * 0.3, (i + n) / 2],
        [0.02, (y - w) * 0.4, l - 2 * 0.3],
        { noCollide: !0 },
      ));
  }
  a.wall("al_int", $ + 0.3, -16.4, Ce, -16.4, 0, Ct[1] - 0.25, 0.15, [
    { at: 2.6, w: 0.9, y: 0, h: 2.05 },
  ]);
  for (const m of [Ct[1], Ct[2]])
    a.box("al_conc", [$ - 0.03, m - 0.1, (i + n) / 2], [0.06, 0.22, l], {
      noCollide: !0,
      sub: !1,
    });
  a.box(
    "al_conc",
    [$ + (31 - $) / 2 - 0.05, Jt + 0.64, (i + n) / 2],
    [31 - $ + 0.1, 0.08, l + 0.1],
    { noCollide: !0, sub: !1 },
  );
  const c = ke(77),
    d = (m, w, y, x, b) => {
      const v = $ + 0.12,
        M = 0.05,
        _ = (R, k) => a.box("al_frame", R, k, { noCollide: !0, sub: !1 });
      if (
        (a.box("al_conc", [$ - 0.04, w - 0.035, m], [0.16, 0.07, y + 0.12], {
          noCollide: !0,
          sub: !1,
        }),
        b === "boarded")
      ) {
        a.box(
          "al_board",
          [$ - 0.015, w + x / 2, m],
          [0.02, x + 0.12, y + 0.16],
          { noCollide: !0, localUV: !0 },
        );
        for (const R of [0.25, x - 0.25])
          a.box("al_pallet", [$ - 0.035, w + R, m], [0.03, 0.09, y + 0.25], {
            noCollide: !0,
            sub: !1,
          });
        return;
      }
      if (b === "empty") {
        _([v, w + x - M / 2, m], [0.07, M, y]);
        return;
      }
      (_([v, w + x - M / 2, m], [0.07, M, y]),
        _([v, w + M / 2, m], [0.07, M, y]),
        _([v, w + x / 2, m - y / 2 + M / 2], [0.07, x, M]),
        _([v, w + x / 2, m + y / 2 - M / 2], [0.07, x, M]));
      const S = y > 1.7 ? 4 : 3,
        T = 4,
        A = y / S,
        z = x / T;
      for (let R = 1; R < S; R++)
        _([v, w + x / 2, m - y / 2 + R * A], [0.04, x, 0.025]);
      for (let R = 1; R < T; R++) {
        if (b === "bent" && R === 2) {
          se(
            a,
            "al_frame",
            [v - 0.08, w + R * z - 0.1, m + 0.1],
            [0.025, 0.04, y * 0.9],
            0,
            0,
            0,
            {},
          );
          continue;
        }
        _([v, w + R * z, m], [0.04, 0.025, y]);
      }
      for (let R = 0; R < S; R++)
        for (let k = 0; k < T; k++) {
          const C = b === "glass" ? 0.55 : 0.12;
          if (c() > C) continue;
          const O = m - y / 2 + (R + 0.5) * A,
            V = w + (k + 0.5) * z;
          if (c() < 0.6)
            a.box("al_glass", [v + 0.01, V, O], [0.006, z - 0.03, A - 0.03], {
              noCollide: !0,
              sub: !1,
            });
          else {
            const F = new vo();
            (F.moveTo(-A / 2, -z / 2),
              F.lineTo(A / 2, -z / 2),
              F.lineTo(-A / 2 + c() * A, -z / 2 + z * (0.4 + c() * 0.5)),
              F.lineTo(-A / 2, -z / 2));
            const q = new B0(F);
            (q.rotateY(-Math.PI / 2),
              a.geometry(
                "al_glass",
                q,
                new B().makeTranslation(v - 0.005, V, O),
                {},
              ));
          }
        }
    },
    p = (m) => i - m;
  (d(p(1.6), 0.9, 1.4, 1.6, "boarded"), d(p(9), 0.9, 1.6, 1.6, "broken"));
  const f = [
    ["glass", "broken", "bent", "broken"],
    ["broken", "boarded", "glass", "empty"],
  ];
  [Ct[1], Ct[2]].forEach((m, w) =>
    h.forEach((y, x) => d(p(y.at), m + y.y, y.w, y.h, f[w][x])),
  );
  const g = p(6);
  a.box("al_frame", [$ + 0.05, 2.3 - 0.04, g], [0.12, 0.08, 1.3], {
    noCollide: !0,
    sub: !1,
  });
  for (const m of [-1, 1])
    a.box("al_frame", [$ + 0.05, 1.15, g + m * 0.62], [0.12, 2.3, 0.06], {
      noCollide: !0,
      sub: !1,
    });
  se(a, "al_frame", [$ + 1.1, 0.04, g + 0.4], [0.9, 0.05, 2], 0, 0.3, 0.02, {
    collide: !0,
  });
  for (let m = 0; m < 10; m++)
    se(
      a,
      c() < 0.5 ? "al_brickbit" : "al_block",
      [$ + 0.6 + c() * 3.2, 0.06, -9.5 - c() * 6.5],
      [0.22, 0.065, 0.1 + c() * 0.15],
      c() * 0.4,
      c() * 3,
      c() * 0.4,
    );
  re(
    a,
    "al_rust",
    [$ - 0.12, 0.05, i - 0.45],
    [$ - 0.12, Jt + 0.4, i - 0.45],
    0.05,
    8,
  );
  for (let m = 1.5; m < Jt; m += 2.4)
    a.box("al_rust", [$ - 0.06, m, i - 0.45], [0.12, 0.04, 0.14], {
      noCollide: !0,
      sub: !1,
    });
  return (
    e.push({
      pos: [28.6, Ct[1] - 0.45, -13],
      color: 14214399,
      intensity: 2.2,
      distance: 7,
      flicker: 1,
      zone: "indoor",
    }),
    { doorZ: g }
  );
}
function ta(a, t, e, o, s, i) {
  const n = new vo();
  (n.moveTo(-0.3, 0),
    n.lineTo(0.3, 0),
    n.lineTo(0.3, 0.075),
    n.lineTo(0.11, 0.3),
    n.lineTo(0.08, 0.81),
    n.lineTo(-0.08, 0.81),
    n.lineTo(-0.11, 0.3),
    n.lineTo(-0.3, 0.075),
    n.lineTo(-0.3, 0));
  const r = new Ci(n, { depth: s, bevelEnabled: !1 });
  (r.translate(0, 0, -s / 2), r.rotateY(Math.PI / 2));
  const l = new B().makeRotationY(o).setPosition(t, N, e);
  a.geometry("al_barrier", r, l, { worldUV: !0, collide: !0 });
  const u = ke(i),
    h = Math.cos(o),
    c = Math.sin(o);
  for (const d of [-s * 0.3, s * 0.3])
    re(
      a,
      "al_rust",
      [t + d * h - 0.04 * c, N + 0.8, e - d * c - 0.04 * h],
      [t + d * h - 0.04 * c, N + 0.86, e - d * c - 0.04 * h],
      0.012,
      4,
    );
  se(
    a,
    "al_block",
    [
      t + (u() - 0.5) * s * h + 0.35 * c,
      N + 0.03,
      e - (u() - 0.5) * s * c + 0.35 * h,
    ],
    [0.16, 0.06, 0.12],
    u(),
    u() * 3,
    u(),
  );
}
function cl(a, t, e, o, s, i, n, r) {
  const l = ke(r),
    u = e - t,
    h = Math.max(8, Math.round(u * 9)),
    c = 7,
    d = new Ke(u, i - s, h, c),
    p = d.attributes.position,
    f = l() * 6,
    g = l() * 6;
  for (let x = 0; x < p.count; x++) {
    const b = p.getX(x),
      v = p.getY(x),
      M = (b + u / 2) / u,
      _ = (v + (i - s) / 2) / (i - s),
      S = (M * n) % 1,
      T = Math.sin(S * Math.PI),
      A =
        Math.sin(M * u * 15 + f + Math.sin(M * u * 4 + g) * 1.4) *
        (0.012 + 0.03 * T * (1 - _ * 0.7));
    (p.setZ(x, -A - 0.02 * T),
      p.setY(
        x,
        v - T * (0.07 * _ + 0.04 * (1 - _)) - (_ < 0.01 ? l() * 0.05 : 0),
      ));
  }
  (d.computeVertexNormals(),
    d.translate((t + e) / 2, (s + i) / 2, o),
    a.geometry("al_mesh", d, null, { worldUV: !0 }));
  const m = d.toNonIndexed(),
    w = m.attributes.position.array,
    y = m.attributes.normal.array;
  for (let x = 0; x < w.length; x += 9)
    for (let b = 0; b < 3; b++) {
      const v = w[x + 3 + b];
      ((w[x + 3 + b] = w[x + 6 + b]), (w[x + 6 + b] = v));
      const M = y[x + 3 + b];
      ((y[x + 3 + b] = y[x + 6 + b]), (y[x + 6 + b] = M));
    }
  for (let x = 0; x < y.length; x++) y[x] = -y[x];
  a.geometry("al_mesh", m, new B().makeTranslation(0, 0, 0.004), {
    worldUV: !0,
  });
}
function Tn(a, t, e, o, s, i) {
  for (let l = 0; l <= i; l++) {
    const u = e + ((o - e) * l) / i;
    (re(a, "al_galv", [u, 0, s], [u, 2.42 + 0.05, s], 0.03, 8),
      a.box("al_conc", [u, N + 0.04, s], [0.22, 0.08, 0.22], {
        noCollide: !0,
        sub: !1,
      }));
  }
  re(a, "al_galv", [e - 0.05, 2.42, s], [o + 0.05, 2.42, s], 0.02, 6);
  const r = o - e;
  (cl(a, e + 0.03, o - 0.03, s - 0.06, 0.1, 2.28, i, Math.round(e * 7)),
    se(
      a,
      "al_mesh",
      [e + r * 0.7, 2.12, s - 0.12],
      [r * 0.3, 0.2, 0.008],
      -0.35,
      0,
      0.05,
    ));
  for (let l = 0; l < i; l++) {
    const u = e + ((o - e) * (l + 0.5)) / i;
    t.push({
      model: "modular_chainlink_fence",
      pos: [u, 0, s - 0.02],
      rotY: 0,
      filter: "^modular_chainlink_fence_double$",
      collide: !1,
    });
  }
  a.box("al_galv", [(e + o) / 2, 1.2, s + 0.02], [r, 2.4, 0.1], {
    collideOnly: !0,
  });
}
function hl(a) {
  for (const [M, _] of Object.entries(xn)) ms[M] = _.tile;
  const t = [],
    e = [],
    o = [],
    s = [],
    i = (M, _, S, T, A = 0, z = {}) =>
      t.push({ model: M, pos: [_, S, T], rotY: A, ...z });
  (a.box(
    "al_asphalt",
    [(ot + $) / 2, N - 0.05, (-18.4 + be) / 2],
    [$ - ot, 0.1, be + 18.4],
    {},
  ),
    a.box(
      "al_walk",
      [(ot + 25) / 2, 0.08, (xe - 18.5) / 2],
      [25 - ot, 0.16, 18.5 - xe + 0],
      {},
    ),
    a.box(
      "al_asphalt",
      [(25 + $) / 2, N - 0.05, (xe - 18.4) / 2],
      [$ - 25, 0.1, 18.4 - xe + 0],
      {},
    ),
    a.box("al_curb", [(ot + 25) / 2, 0.085, -18.45], [25 - ot, 0.17, 0.14], {
      noCollide: !0,
    }),
    se(a, "al_curb", [25.35, 0.06, -18.7], [0.6, 0.14, 0.14], 0.1, 0.6, 0.2));
  const n = ke(5);
  for (let M = 0; M < 14; M++)
    nl(
      a,
      ot + 0.5 + n() * ($ - ot - 1),
      -18.2 + n() * 8.8,
      n() * Math.PI * 2,
      1.5 + n() * 3.5,
      100 + M,
    );
  (Yt(a, "al_leaves", 17.2, -17, 0.9, 11, N + 0.004, 1),
    Yt(a, "al_leaves", 18.6, -9.6, 0.55, 12, N + 0.004, 3),
    Yt(a, "al_leaves", 24, -9.55, 0.5, 13, N + 0.004, 3.2),
    Yt(a, "al_leaves", 23.6, -18, 0.7, 14, N + 0.004, 1.8),
    Yt(a, "al_leaves", 20.5, -13.2, 0.9, 15, N + 0.004, 1.6),
    Yt(a, "al_leaves", 21, -19.15, 0.45, 16, 0.165, 4),
    Yt(a, "al_debris", 25.5, -12.6, 0.8, 21, N + 0.003, 1.2),
    Yt(a, "al_debris", 18.4, -14.4, 0.7, 22, N + 0.003, 1.6),
    Yt(a, "al_debris", 25.7, -17.3, 0.9, 23, N + 0.003, 1));
  for (const [M, _, S, T, A] of [
    [22.4, -16.6, 0.6, 17, 2],
    [19.2, -11.4, 0.5, 18, 2.2],
    [24.8, -14.2, 0.45, 19, 1.4],
    [17.9, -15.6, 0.5, 20, 1.2],
    [21.8, -10.9, 0.4, 24, 2.5],
  ])
    Yt(a, "al_leaves", M, _, S, T, N + 0.004, A);
  const r = ke(77);
  for (let M = 0; M < 22; M++) {
    const _ = ot + 0.5 + r() * ($ - ot - 1),
      S = -18.1 + r() * 8.6;
    Yt(
      a,
      M % 3 ? "al_leaves" : "al_debris",
      _,
      S,
      0.18 + r() * 0.32,
      300 + M,
      N + 0.0035 + (M % 4) * 2e-4,
      0.8 + r() * 1.6,
    );
  }
  (Yt(a, "al_puddle", 19.6, -15.6, 0.75, 31, N + 0.006, 1.7),
    Yt(a, "al_puddle", 23.4, -12.4, 0.45, 32, N + 0.006, 1.5),
    Yt(a, "al_puddle", 17.4, -12.9, 0.35, 33, N + 0.006, 1.3),
    a.box("al_wall_n", [(ot + $) / 2, 2.8, xe - 0.15], [$ - ot, 5.6, 0.3], {}),
    a.box("al_conc", [(ot + $) / 2, 5.64, xe - 0.12], [$ - ot, 0.08, 0.38], {
      noCollide: !0,
      sub: !1,
    }),
    a.wall("al_wall_s", ot, be + 0.15, $, be + 0.15, 0, 4.6, 0.3, [
      { at: (Ko[0] + Ko[1]) / 2 - ot, w: Ko[1] - Ko[0], y: 0, h: 2.2 },
    ]),
    a.box("al_conc", [(ot + $) / 2, 4.64, be + 0.12], [$ - ot, 0.08, 0.38], {
      noCollide: !0,
      sub: !1,
    }));
  for (const M of [18.8, 25])
    a.box("al_wall_s", [M, 2.3, be - 0.06], [0.35, 4.6, 0.12], {
      noCollide: !0,
    });
  (Mn(a, [(ot + $) / 2, 7.5, xe - 0.15], [$ - ot, 4, 0.3]),
    Mn(a, [(ot + $) / 2, 6.5, be + 0.15], [$ - ot, 4, 0.3]),
    ll(a, e, s),
    rl(a),
    i("wooden_ladder", 24.7, 0.16, -19.15, 0.15, { fit: { h: 2.2 } }),
    [
      [-17.4, 1, 0],
      [-15.8, 1, 0.02],
      [-14.2, 1, 0],
      [-12.6, 0.97, -0.04],
      [-11, 0.32, 0],
    ].forEach(([M, _, S], T) => il(a, 21.2 + (T % 2) * 0.05, M, 40 + T, _, S)),
    ta(a, 24.4, -12.95, Math.PI / 2 + 0.08, 2, 1),
    ta(a, 24.3, -10.95, Math.PI / 2 - 0.12, 2, 2),
    ta(a, 20.6, -17.85, 0.12, 2, 3),
    Sn(a, 23, -17.55, 0.04, 7, 3.4, 61),
    Sn(a, 25.65, -18.4, Math.PI / 2, 4, 2.4, 62),
    _n(a, 22.7, N, -15.3, 0.35),
    _n(a, 19.9, 0.62, -19.55, 0, -1.32),
    se(a, "al_plank", [17.8, 0.9, -19.58], [0.22, 1.9, 0.04], -0.15, 0, 0.12),
    se(a, "al_plank", [18.15, 0.9, -19.55], [0.2, 1.85, 0.04], -0.18, 0, -0.05),
    se(a, "al_plank", [20.6, N + 0.025, -13.9], [2.6, 0.04, 0.21], 0, 0.42, 0),
    se(
      a,
      "al_board",
      [25.9, 1.1, -10.2],
      [1.2, 2.3, 0.02],
      0,
      Math.PI / 2 + 0.1,
      -0.35,
    ),
    Tn(a, t, 16.5, 20.5, -10.2, 2),
    Tn(a, t, 23.3, 26.3, -10.2, 2),
    Q0(a, 17.3, -9.8, 0.9, 0.45, 0.55, 3),
    Q0(a, 19.4, -18.95, 0.85, 0.35, 0.5, 5),
    Q0(a, 26, -15.9, 0.55, 0.28, 0.6, 9));
  const l = ke(99);
  for (let M = 0; M < 26; M++) {
    const _ = ot + 0.6 + l() * ($ - ot - 1.2),
      S = -18.2 + l() * 8.6;
    if (Math.abs(_ - 21.2) < 0.3) continue;
    const T = l() < 0.45;
    se(
      a,
      T ? "al_brickbit" : "al_block",
      [_, N + 0.03, S],
      T
        ? [0.22, 0.065, 0.1]
        : [0.06 + l() * 0.22, 0.05 + l() * 0.07, 0.06 + l() * 0.2],
      l() * 0.3,
      l() * 3,
      l() * 0.3,
    );
  }
  for (const [M, _, S] of [
    [20, -9.55, 0.3],
    [20.4, -9.7, 1.4],
    [16.9, -10.9, 0.8],
    [26.1, -9.6, 2],
    [23.9, -19.2, 0.4],
  ])
    i("trashbag", M, N, _, S);
  (i("metal_trash_can", 26.15, N, -12, 0.7, {
    filter: "^metal_trash_can_rust(_handle_left|_handle_right)?$",
  }),
    i("cardboard_box_01", 26.2, N, -11.4, 0.3),
    i("cardboard_box_01", 16.75, N, -18, 1.1, { tilt: 0.2 }),
    i("old_tyre", 18.2, N, -14, 0.4, { tilt: Math.PI / 2 }),
    i("Barrel_01", 16.7, 0.16, -19.15, 0.2),
    i("wooden_crate_01", 17.8, 0.16, -19.1, 0.4),
    i("spray_paint_bottles", 20.6, 0.16, -19.25, 0.6),
    i("cement_bag", 24.4, N, -16.4, 0.3),
    i("dry_branches_medium_01", 25.9, N, -9.65, 1.2, { filter: "_a$" }),
    i("exterior_aircon_unit", $ - 0.02, Ct[1] + 0.6, -12.2, -Math.PI / 2, {
      filter: "^exterior_aircon_unit_rusted$",
      mount: !0,
    }),
    o.push({ type: "bare_young", pos: [18.4, 0, -9.55], scale: 1, seed: 701 }),
    o.push({
      type: "bare_young",
      pos: [24.6, 0, -9.6],
      scale: 0.85,
      seed: 702,
    }),
    o.push({
      type: "bare_young",
      pos: [16.7, 0, -16.4],
      scale: 0.7,
      seed: 703,
    }));
  for (const [M, _, S, T] of [
    [17.6, -22.4, 1.15, 711],
    [20.9, -23.1, 1.3, 712],
    [23.8, -22.2, 1.05, 713],
    [27.5, -23.4, 1.25, 714],
  ])
    o.push({ type: "bare", pos: [M, 0, _], scale: S, seed: T });
  const u = (M, _, S, T, A) =>
      e.push({ pos: M, normal: _, size: S, wallKey: T, spec: A }),
    h = [0, 0, 1],
    c = [0, 0, -1],
    d = [1, 0, 0],
    p = [-1, 0, 0],
    f = xe + 0.01,
    g = be - 0.01,
    m = ot + 0.01,
    w = $ - 0.01;
  (u([20.3, 2, f], h, [8.2, 3], "al_wall_n", {
    style: "tagwall",
    palette: 11,
    seed: 3,
  }),
    u([18.6, 3.9, f], h, [4, 1.6], "al_wall_n", {
      style: "piece",
      text: "KAOS",
      palette: 1,
      seed: 7,
      wear: 0.6,
    }),
    u([23.6, 1.35, f], h, [2.6, 1.3], "al_wall_n", {
      style: "throwup",
      text: "OMS",
      palette: 11,
      seed: 8,
    }),
    u([22.6, 4, f], h, [2.2, 1], "al_wall_n", {
      style: "tag",
      text: "ZEK",
      palette: 7,
      seed: 9,
    }),
    u([17.3, 1, f], h, [1.6, 0.8], "al_wall_n", {
      style: "tag",
      text: "NYX",
      palette: 11,
      seed: 10,
    }),
    u([24.9, 2.7, f], h, [3.2, 2.6], "al_wall_n", {
      style: "tagwall",
      palette: 11,
      seed: 4,
    }),
    u([21, 4.75, f], h, [5, 1.3], "al_wall_n", {
      style: "tagwall",
      palette: 0,
      seed: 5,
    }),
    u([25.3, 4.4, f], h, [1.8, 0.8], "al_wall_n", {
      style: "throwup",
      text: "GOR",
      palette: 1,
      seed: 6,
    }),
    u([18.3, 3.15, g], c, [4.6, 2.6], "al_wall_s", {
      style: "piece",
      text: "SKY",
      palette: 1,
      seed: 21,
      wear: 0.2,
    }),
    u([24.4, 3.1, g], c, [4.6, 2.7], "al_wall_s", {
      style: "piece",
      text: "YKL",
      palette: 5,
      seed: 22,
      wear: 0.2,
    }),
    u([22, 3.4, g], c, [2.4, 1.2], "al_wall_s", {
      style: "throwup",
      text: "ZOE",
      palette: 5,
      seed: 23,
    }),
    u([20.3, 1.2, g], c, [1.6, 0.8], "al_wall_s", {
      style: "tag",
      text: "RAW",
      palette: 7,
      seed: 24,
    }),
    u([25.9, 0.9, g], c, [1, 0.6], "al_wall_s", {
      style: "tag",
      text: "K2",
      palette: 2,
      seed: 25,
    }),
    u([21, 4.1, g], c, [1.6, 0.6], "al_wall_s", {
      style: "tag",
      text: "pez",
      palette: 7,
      seed: 26,
    }),
    u([21.6, 1.1, g], c, [3.6, 1.6], "al_wall_s", {
      style: "tagwall",
      palette: 11,
      seed: 27,
      wear: 0.5,
    }),
    u([m, 2.1, -17], d, [4.4, 2.3], "brick_wall", {
      style: "piece",
      text: "RIOT",
      palette: 4,
      seed: 31,
    }),
    u([m, 3.1, -12], d, [2.6, 0.8], "brick_wall", {
      style: "scrawl",
      text: "NO EXIT",
      palette: 2,
      seed: 32,
    }),
    u([w, 1.35, -12.55], p, [2.8, 1.8], "al_brick", {
      style: "piece",
      text: "ARG",
      palette: 6,
      seed: 41,
    }),
    u([w, 1.3, -16.15], p, [1.4, 1.7], "al_brick", {
      style: "throwup",
      text: "SN",
      palette: 8,
      seed: 42,
    }),
    u([w, 2.75, -14.75], p, [1.4, 0.5], "al_brick", {
      style: "tag",
      text: "DEAD",
      palette: 7,
      seed: 43,
    }),
    u([w, 3, -10.3], p, [1.2, 0.6], "al_brick", {
      style: "tag",
      text: "OZ",
      palette: 0,
      seed: 44,
    }),
    u([w, 2.55, -12.4], p, [2.2, 0.7], "al_brick", {
      style: "tag",
      text: "jinx",
      palette: 7,
      seed: 45,
    }),
    u([w, 0.75, -18.1], p, [2.6, 1.3], "al_brick", {
      style: "tagwall",
      palette: 11,
      seed: 46,
      wear: 0.5,
    }));
  const y = (M, _, S, T, A, z, R) =>
    e.push({ kind: "leak", pos: [M, _, S], normal: T, size: [A, z], index: R });
  (y($ - 0.012, 8.4, -11.5, p, 2, 3.2, 0),
    y($ - 0.012, 5, -18.6, p, 1.6, 2.6, 1),
    y(20, 4.4, xe + 0.012, h, 2.4, 2.4, 1),
    y(24, 3.6, be - 0.012, c, 1.8, 2.2, 0));
  const x = [
      { name: "callejón", type: "outdoor", min: [ot, 0, xe], max: [$, 12, be] },
      {
        name: "callejón PB edificio",
        type: "indoor",
        min: [$, 0, -20],
        max: [31, Ct[1], -8.75],
      },
    ],
    b = [
      { name: "callejón (7.jpg)", pos: [19, N, -13], yaw: -1.4, pitch: 0 },
      {
        name: "callejón hacia el oeste (bolardos, valla verde)",
        pos: [23.4, N, -14.6],
        yaw: Math.PI / 2 + 0.05,
        pitch: -0.04,
      },
    ];
  return {
    props: t,
    decals: e,
    trees: o,
    lights: s,
    zones: x,
    bench: b,
    materials: xn,
    notes:
      'CALLEJÓN (7.jpg): x 16.15..26.6 + edificio x 26.6..31 (z -20..-8.75). Forros de hormigón delante del muro norte (5.6 m) y sur (4.6 m, con hueco alineado a la puerta x 21.35..22.65 y que cierra el hueco x 16..17.5 del muro de ladrillo). La puerta oeste existente (x=16, z -13.2..-10.8) también da al callejón. Andamio en la fachada (x 25.2..26.35, z -19.45..-15.25) con plataformas a 3.3 y 6.6 (sin acceso). Malla: modelo modular_chainlink_fence (segmentos) + lona verde opaca por el lado del callejón (al_mesh). Grafitis: wallKey es la clave de material de la zona (al_*); su textura de manifest está en materials[wallKey].tex. Leaks con kind:"leak".',
  };
}

export { hl };
