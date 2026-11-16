// world/geometry-utils.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, E as Ut, J as Do, R as yo, V as P, Z as Ae, _ as Mo, a3 as $t, a4 as dr, a5 as fe, o as B, v as Te } from "three-vendor";
import { he } from "../level/area-urbex.js";

function _s(a, t, e, o, s, i, n = !1) {
  const r = Math.hypot(o - t, s - e),
    l = (o - t) / r,
    u = (s - e) / r,
    h = Math.atan2(-u, l),
    c = "metal_rust",
    d = Math.max(1, Math.round(r / 1.2));
  for (let g = 0; g <= d; g++) {
    const m = (g / d) * r;
    a.box(c, [t + l * m, i + 0.52, e + u * m], [0.05, 1.04, 0.05], {
      rotY: h,
      noCollide: !0,
      sub: !1,
    });
  }
  const p = (t + o) / 2,
    f = (e + s) / 2;
  (a.box(c, [p, i + 1.03, f], [r, 0.05, 0.06], {
    rotY: h,
    noCollide: !0,
    sub: !1,
  }),
    a.box(c, [p, i + 0.55, f], [r, 0.03, 0.03], {
      rotY: h,
      noCollide: !0,
      sub: !1,
    }),
    n ||
      a.box(c, [p, i + 0.12, f], [r, 0.03, 0.03], {
        rotY: h,
        noCollide: !0,
        sub: !1,
      }),
    a.box(c, [p, i + 0.6, f], [r, 1.2, 0.08], { rotY: h, collideOnly: !0 }));
}
function sa(a, t, e, o, s, i, n, r, l) {
  const u = Math.sign(i - s),
    h = Math.abs(i - s),
    c = (r - n) / l,
    d = h / l,
    p = o - e,
    f = (e + o) / 2;
  for (let y = 0; y < l; y++) {
    const x = n + c * (y + 1),
      b = s + u * d * (y + 0.5),
      v = n > 0.1 ? x - 0.35 : 0;
    a.box(t, [f, (x + v) / 2, b], [p, x - v, d], { noCollide: !0, sub: !1 });
  }
  const g = Math.atan2(r - n, h),
    m = Math.hypot(h, r - n),
    w = new Z(p, 0.1, m + 0.2);
  (he.makeRotationX(u > 0 ? -g : g),
    he.setPosition(f, (n + r) / 2 - 0.05 + 0.04, (s + i) / 2),
    a.geometry(t, w, he, { collideOnly: !0, collide: !0 }));
}
function Tl(a, t, e, o, s, i) {
  const n = Math.abs(o - e),
    r = Math.atan2(i - s, n),
    l = Math.hypot(n, i - s),
    u = Math.sign(o - e),
    h = 8;
  for (let d = 0; d <= h; d++) {
    const p = d / h,
      f = e + (o - e) * p,
      g = s + (i - s) * p;
    a.box("metal_rust", [t, g + 0.5, f], [0.05, 1, 0.05], {
      noCollide: !0,
      sub: !1,
    });
  }
  for (const [d, p] of [
    [1, 0.05],
    [0.5, 0.03],
  ]) {
    const f = new Z(p, p, l);
    (he.makeRotationX(u > 0 ? -r : r),
      he.setPosition(t, (s + i) / 2 + d, (e + o) / 2),
      a.geometry("metal_rust", f, he, { worldUV: !0 }));
  }
  const c = new Z(0.1, 2.4, l);
  (he.makeRotationX(u > 0 ? -r : r),
    he.setPosition(t, (s + i) / 2 + 0.6, (e + o) / 2),
    a.geometry("metal_rust", c, he, { collideOnly: !0, collide: !0 }));
}
function Al(a, t, e) {
  const o = "metal_rust";
  (a.box(o, [(t.x0 + t.x1) / 2, e + 0.1, t.z0], [t.x1 - t.x0, 0.2, 0.12], {
    noCollide: !0,
    sub: !1,
  }),
    a.box(o, [(t.x0 + t.x1) / 2, e + 0.1, t.z1], [t.x1 - t.x0, 0.2, 0.12], {
      noCollide: !0,
      sub: !1,
    }),
    a.box(o, [t.x0, e + 0.1, (t.z0 + t.z1) / 2], [0.12, 0.2, t.z1 - t.z0], {
      noCollide: !0,
      sub: !1,
    }),
    a.box(o, [t.x1, e + 0.1, (t.z0 + t.z1) / 2], [0.12, 0.2, t.z1 - t.z0], {
      noCollide: !0,
      sub: !1,
    }));
  for (let s = t.x0 + 1; s < t.x1 - 0.2; s += 1)
    a.box(o, [s, e + 0.08, (t.z0 + t.z1) / 2], [0.05, 0.08, t.z1 - t.z0], {
      noCollide: !0,
      sub: !1,
    });
}
function Cn(a, t, e, o, s, i, n, r = !1) {
  const l = r || Math.abs(o - t) > Math.abs(s - e),
    u = l ? t : e,
    h = l ? o : s,
    c = 2;
  for (let d = u; d < h - 0.01; d += c) {
    const p = Math.min(h, d + c),
      f = (d + p) / 2;
    if (n.some((m) => f > m.z0 && f < m.z1)) continue;
    const g = Math.sin(d * 3.1) * 0.05;
    l
      ? a.box(
          "metal_corrugated",
          [f, i / 2 + 0.05, e + g],
          [p - d, i - 0.1 + g, 0.05],
          {},
        )
      : a.box(
          "metal_corrugated",
          [t + g, i / 2 + 0.05, f],
          [0.05, i - 0.1 + g, p - d],
          {},
        );
  }
  for (let d = u; d <= h + 0.01; d += c)
    n.some((p) => d > p.z0 + 0.1 && d < p.z1 - 0.1) ||
      (l
        ? a.box("metal_rust", [d, i / 2, e + 0.06], [0.07, i, 0.07], {
            sub: !1,
          })
        : a.box("metal_rust", [t + 0.06, i / 2, d], [0.07, i, 0.07], {
            sub: !1,
          }));
}
function Pl(a, t, e, o, s) {
  const i = "metal_red";
  for (let n = t; n <= e + 0.01; n += 2.45)
    for (const r of [0, 1])
      a.box("metal_red", [n, s / 2, o + r], [0.05, s, 0.05], {
        noCollide: !0,
        sub: !1,
      });
  for (const n of [1, 2, 3.4, 5, 6.8])
    for (const r of [0, 1])
      a.box(i, [(t + e) / 2, n, o + r], [e - t, 0.05, 0.05], {
        noCollide: !0,
        sub: !1,
      });
  for (let n = t + 1.2; n < e; n += 2.45)
    a.box(i, [n, 3.4, o + 0.5], [0.05, 0.05, 1], { noCollide: !0, sub: !1 });
  a.box("wood_weathered", [(t + e) / 2, 3.47, o + 0.5], [e - t, 0.06, 0.9], {});
  for (let n = t; n < e - 1; n += 4.9) {
    const r = new Z(0.05, Math.hypot(2.45, 3.4), 0.05);
    (he.makeRotationZ(-Math.atan2(2.45, 3.4)),
      he.setPosition(n + 1.225, 1.7, o),
      a.geometry(i, r, he, { worldUV: !0 }));
  }
}
function zl(a, t, e) {
  for (const [s, i, n, r] of [
    [0, -3.4 / 2, 3.4, 0.25],
    [0, 3.4 / 2, 3.4, 0.25],
    [-3.4 / 2, 0, 0.25, 3.4],
    [3.4 / 2, 0, 0.25, 3.4],
  ]) {
    a.box(
      "concrete_rough",
      [t + s, 0.25, e + i],
      [n + 0.25, 0.5, r + 0.01],
      {},
    );
    const l = s === 0 ? n + 0.9 : 0.62,
      u = s === 0 ? 0.62 : r + 0.9;
    a.box(
      "wood_weathered",
      [t + s * 1.18, 0.48, e + i * 1.18],
      [l, 0.07, u],
      {},
    );
  }
  a.box("ground_mud", [t, 0.38, e], [3.4 - 0.2, 0.06, 3.4 - 0.2], {
    noCollide: !0,
  });
}
function Ao(a, t, e, o, s, i = 0) {
  const n = "wood_weathered",
    r = [];
  for (let c = -2; c <= 2; c++)
    r.push([
      [c * 0.27, 0.13, 0],
      [0.14, 0.02, 1.2],
    ]);
  for (const c of [-0.55, 0, 0.55])
    r.push([
      [0, 0.065, c],
      [1, 0.1, 0.1],
    ]);
  for (let c = -1; c <= 1; c++)
    r.push([
      [c * 0.4, 0.01, 0],
      [0.14, 0.02, 1.2],
    ]);
  const l = new B().makeRotationY(s).multiply(new B().makeRotationZ(i));
  for (const [c, d] of r) {
    const p = new Z(...d),
      f = new B()
        .makeTranslation(t, e, o)
        .multiply(l)
        .multiply(new B().makeTranslation(...c));
    a.geometry(n, p, f, { worldUV: !0 });
  }
  const u = new Z(1, 0.15, 1.2),
    h = new B()
      .makeTranslation(t, e, o)
      .multiply(l)
      .multiply(new B().makeTranslation(0, 0.075, 0));
  a.geometry(n, u, h, { collideOnly: !0, collide: !0 });
}
function Ss(a, t, e, o, s, i) {
  let n = i * 9301 + 49297;
  const r = () => (n = (n * 9301 + 49297) % 233280) / 233280,
    l = new Mo(1, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2),
    u = l.attributes.position;
  for (let h = 0; h < u.count; h++) {
    const c = u.getX(h),
      d = u.getY(h),
      p = u.getZ(h),
      f =
        0.78 +
        0.35 * Math.sin(c * 5.1 + i) * Math.cos(p * 4.3 + i) +
        r() * 0.12;
    u.setXYZ(h, c * o * f, Math.max(0, d) * s * f - 0.04, p * o * f);
  }
  (l.computeVertexNormals(),
    a.geometry("ground_rubble", l, new B().makeTranslation(t, 0, e), {
      worldUV: !0,
      collide: !0,
    }));
  for (let h = 0; h < 10; h++) {
    const c = r() * Math.PI * 2,
      d = o * (0.6 + r() * 0.7),
      p = 0.1 + r() * 0.35,
      f = r() > 0.5 ? "concrete_rough" : "brick_broken",
      g = new Z(p * (1 + r()), p * 0.6, p),
      m = new B()
        .makeRotationFromEuler(new Ae(r() * 0.6, r() * 3, r() * 0.6))
        .setPosition(t + Math.cos(c) * d, p * 0.2, e + Math.sin(c) * d);
    a.geometry(f, g, m, { worldUV: !0 });
  }
}
const Rn = 24,
  On = 1.3,
  Ia = 40,
  Cl = 0.42;
function Gi(a) {
  const t = [];
  for (let e = 0; e < a; e++) {
    const o = (e + 0.5) / a,
      s = e * 2.399963,
      i = Math.sqrt(o),
      n = Math.sqrt(1 - o);
    t.push(new P(Math.cos(s) * i, n, Math.sin(s) * i));
  }
  return t;
}
function Rl(a, t) {
  const e = [...a.values()].map((g) => {
      const m = new Ut();
      return (m.setAttribute("position", g.attributes.position), m);
    }),
    o = Do(e, !1),
    s = new dr(o, { maxLeafTris: 8 }),
    i = Gi(Rn),
    n = new yo(),
    r = new yo(),
    l = new P(),
    u = new P(),
    h = new P(),
    c = new P(),
    d = new Map();
  let p = 0;
  for (const g of a.values()) p += g.attributes.position.count;
  const f = new Map();
  for (const [g, m] of a) {
    const w = m.attributes.position,
      y = m.attributes.normal,
      x = new Uint8Array(w.count * 2);
    for (let b = 0; b < w.count; b++) {
      const v = w.getX(b),
        M = w.getY(b),
        _ = w.getZ(b);
      l.set(y.getX(b), y.getY(b), y.getZ(b));
      const S = `${v.toFixed(2)},${M.toFixed(2)},${_.toFixed(2)},${l.x.toFixed(1)},${l.y.toFixed(1)},${l.z.toFixed(1)}`;
      let T = f.get(S);
      if (!T) {
        (Math.abs(l.y) < 0.99
          ? u.set(0, 1, 0).cross(l).normalize()
          : u.set(1, 0, 0).cross(l).normalize(),
          h.crossVectors(l, u));
        let A = 0,
          z = 0,
          R = 0;
        for (const O of i) {
          (c
            .set(0, 0, 0)
            .addScaledVector(u, O.x)
            .addScaledVector(l, O.y)
            .addScaledVector(h, O.z)
            .normalize(),
            n.origin.set(v + l.x * 0.04, M + l.y * 0.04, _ + l.z * 0.04),
            n.direction.copy(c));
          const V = s.raycastFirst(n, $t, 0, Ia);
          V && V.distance < On && (A += 1 - V.distance / On);
          const F = Math.max(0.15, c.y + 0.35);
          ((R += F),
            V
              ? c.y < 0.2 &&
                V.distance > 0.6 &&
                (r.origin.copy(V.point),
                (r.origin.y += 0.05),
                r.direction.set(0, 1, 0),
                s.raycastFirst(r, $t, 0, Ia) || (z += F * Cl))
              : (z += F));
        }
        const k = Math.pow(1 - A / Rn, 1.4),
          C = Math.min(1, (z / R) * 1.6);
        ((T = [Math.round(k * 255), Math.round(C * 255)]), f.set(S, T));
      }
      ((x[b * 2] = T[0]), (x[b * 2 + 1] = T[1]));
    }
    d.set(g, x);
  }
  return d;
}
function qs(a, t, e = 24) {
  const o = qs.dirs || (qs.dirs = Gi(e)),
    s = qs.ray || (qs.ray = new yo());
  let i = 0,
    n = 0;
  for (const r of o) {
    (s.origin.copy(t), s.direction.set(r.x, r.y, r.z));
    const l = a.raycastFirst(s, $t, 0, Ia),
      u = r.y + 0.35;
    ((n += u), l || (i += u));
  }
  return Math.min(1, (i / n) * 1.6);
}
const Vn = [
  ["#e8e8e8", "#1b4fd1", "#0b0b0b", "#f2c200"],
  ["#ff3b30", "#ffd60a", "#141414", "#ffffff"],
  ["#3ad16b", "#0d5d2b", "#101010", "#f4f4f4"],
  ["#c04dff", "#41e0ff", "#121212", "#f8f8f8"],
];
function $o(a) {
  let t = a >>> 0 || 1;
  return () => (t = (t * 1664525 + 1013904223) >>> 0) / 4294967296;
}
function Ol(a, t, e, o, s, i, n) {
  a.fillStyle = s;
  for (let r = 0; r < i; r++) {
    const l = n() * Math.PI * 2,
      u = Math.pow(n(), 1.8) * o;
    ((a.globalAlpha = 0.08 + n() * 0.2),
      a.fillRect(t + Math.cos(l) * u, e + Math.sin(l) * u, 1.5, 1.5));
  }
  a.globalAlpha = 1;
}
function Ni(a, t, e, o, s, i, n, r = 90) {
  ((a.strokeStyle = s), (a.lineCap = "round"));
  for (let l = 0; l < i; l++) {
    const u = t + n() * (e - t),
      h = 10 + Math.pow(n(), 2) * r,
      c = 2 + n() * 4;
    ((a.lineWidth = c),
      (a.globalAlpha = 0.85),
      a.beginPath(),
      a.moveTo(u, o),
      a.lineTo(u + (n() - 0.5) * 2, o + h),
      a.stroke(),
      a.beginPath(),
      a.arc(u, o + h, c * 0.7, 0, Math.PI * 2),
      (a.fillStyle = s),
      a.fill());
  }
  a.globalAlpha = 1;
}
function Vl(a, t = 0) {
  const s = document.createElement("canvas");
  ((s.width = 2048), (s.height = 768));
  const i = s.getContext("2d"),
    [n, r, l, u] = Vn[t % Vn.length],
    h = $o(a.length * 977 + t * 31);
  i.clearRect(0, 0, 2048, 768);
  const c = Math.min(768 * 0.62, (2048 * 1.25) / a.length);
  ((i.font = `900 ${c}px Impact, "Arial Black", sans-serif`),
    (i.textAlign = "center"),
    (i.textBaseline = "middle"),
    (i.lineJoin = "round"));
  const d = 2048 / 2,
    p = 768 / 2;
  (i.save(),
    i.translate(d + 22, p + 22),
    i.rotate(-0.04),
    (i.lineWidth = c * 0.2),
    (i.strokeStyle = l),
    i.strokeText(a, 0, 0),
    (i.fillStyle = l),
    i.fillText(a, 0, 0),
    i.restore(),
    i.save(),
    i.translate(d, p),
    i.rotate(-0.04),
    (i.lineWidth = c * 0.22),
    (i.strokeStyle = l),
    i.strokeText(a, 0, 0),
    (i.lineWidth = c * 0.11),
    (i.strokeStyle = u),
    i.strokeText(a, 0, 0));
  const f = i.createLinearGradient(0, -c / 2, 0, c / 2);
  (f.addColorStop(0, n),
    f.addColorStop(0.55, r),
    f.addColorStop(1, n),
    (i.fillStyle = f),
    i.fillText(a, 0, 0),
    (i.globalAlpha = 0.6),
    (i.fillStyle = u));
  for (let m = 0; m < 18; m++)
    i.fillRect(
      -2048 * 0.4 + h() * 2048 * 0.8,
      -c * 0.3 + h() * c * 0.2,
      6 + h() * 30,
      5,
    );
  (i.restore(),
    (i.globalAlpha = 1),
    Ni(i, d - 2048 * 0.38, d + 2048 * 0.38, p + c * 0.36, r, 22, h, 140));
  for (let m = 0; m < 40; m++)
    Ol(i, h() * 2048, h() * 768, 30 + h() * 50, h() > 0.5 ? n : r, 120, h);
  i.globalCompositeOperation = "destination-out";
  for (let m = 0; m < 1600; m++) {
    i.globalAlpha = h() * 0.5;
    const w = 2 + h() * 14;
    i.fillRect(h() * 2048, h() * 768, w, w * (0.3 + h()));
  }
  ((i.globalCompositeOperation = "source-over"), (i.globalAlpha = 1));
  const g = new fe(s);
  return ((g.colorSpace = Te), g);
}
function Ll(a, t = "#b3191c") {
  const s = document.createElement("canvas");
  ((s.width = 1536), (s.height = 512));
  const i = s.getContext("2d"),
    n = $o(a.length * 131);
  ((i.font = `italic 700 ${512 * 0.42}px "Marker Felt", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`),
    (i.textAlign = "center"),
    (i.textBaseline = "middle"),
    i.save(),
    i.translate(1536 / 2, 512 / 2),
    i.rotate(-0.05));
  for (let l = 0; l < 3; l++)
    ((i.globalAlpha = l === 0 ? 0.35 : 0.9),
      (i.fillStyle = t),
      (i.strokeStyle = t),
      (i.lineWidth = l === 0 ? 18 : 3),
      i.strokeText(a, (n() - 0.5) * 3, (n() - 0.5) * 3),
      l && i.fillText(a, 0, 0));
  (i.restore(),
    Ni(i, 1536 * 0.12, 1536 * 0.88, 512 * 0.62, t, 26, n, 120),
    (i.globalCompositeOperation = "destination-out"));
  for (let l = 0; l < 900; l++) {
    i.globalAlpha = n() * 0.6;
    const u = 2 + n() * 8;
    i.fillRect(n() * 1536, n() * 512, u, u);
  }
  const r = new fe(s);
  return ((r.colorSpace = Te), r);
}
function Fl() {
  const t = document.createElement("canvas");
  t.width = t.height = 512;
  const e = t.getContext("2d"),
    o = $o(77);
  for (let i = 0; i < 140; i++) {
    const n = 256 + (o() - 0.5) * 512 * 0.85,
      r = 512 * 0.5 + (o() - 0.5) * 512 * 0.85;
    if (Math.hypot(n - 512 / 2, r - 512 / 2) > 512 * 0.46) continue;
    const l = o() * Math.PI * 2,
      u = 20 + o() * 26,
      h = u * 0.45,
      c = 70 + o() * 70,
      d = 40 + o() * 50,
      p = 20 + o() * 30;
    (e.save(),
      e.translate(n, r),
      e.rotate(l),
      (e.fillStyle = `rgb(${d},${c},${p})`),
      e.beginPath(),
      e.ellipse(0, 0, u, h, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = "rgba(20,30,10,.5)"),
      (e.lineWidth = 1.2),
      e.beginPath(),
      e.moveTo(-u, 0),
      e.lineTo(u, 0),
      e.stroke(),
      e.restore());
  }
  ((e.strokeStyle = "#3a2a1a"), (e.lineWidth = 3));
  for (let i = 0; i < 8; i++)
    (e.beginPath(),
      e.moveTo(512 / 2, 512 / 2),
      e.lineTo(
        512 / 2 + (o() - 0.5) * 512 * 0.8,
        512 / 2 + (o() - 0.5) * 512 * 0.8,
      ),
      e.stroke());
  const s = new fe(t);
  return ((s.colorSpace = Te), s);
}
function Bl(a, t) {
  const e = document.createElement("canvas");
  e.width = e.height = 512;
  const o = new fe(e),
    s = new Image();
  return (
    (s.onload = () => {
      const i = e.getContext("2d");
      i.drawImage(s, 0, 0, 512, 512);
      const n = i.getImageData(0, 0, 512, 512);
      for (let r = 0; r < n.data.length; r += 4) {
        const l = 255 - n.data[r],
          u = Math.min(255, l * 2.2);
        ((n.data[r] = n.data[r + 1] = n.data[r + 2] = u),
          (n.data[r + 3] = 255));
      }
      for (let r = 0; r < 512; r++)
        for (let l = 0; l < 512; l++) {
          const u = Math.min(l, 511 - l) / 60,
            h = Math.min(r, 511 - r) / 40,
            c = Math.min(1, u, h),
            d = (r * 512 + l) * 4;
          ((n.data[d] *= c), (n.data[d + 1] *= c), (n.data[d + 2] *= c));
        }
      (i.putImageData(n, 0, 0), (o.needsUpdate = !0), t?.initTexture?.(o));
    }),
    (s.src = a),
    o
  );
}
const K = {
  concrete: 0,
  brick: 1,
  plaster: 2,
  metal: 3,
  metalThin: 4,
  metalExit: 5,
  wood: 6,
  woodExit: 7,
  glass: 8,
  dirt: 9,
  gravel: 10,
  soft: 11,
  scorch: 12,
  concrete2: 13,
};
function Il() {
  const t = document.createElement("canvas");
  t.width = t.height = 256 * 4;
  const e = t.getContext("2d"),
    o = $o(5),
    s = (d, p, f, g, m = 18) => {
      e.beginPath();
      for (let w = 0; w <= m; w++) {
        const y = (w / m) * Math.PI * 2,
          x = f * (1 - g / 2 + o() * g);
        e.lineTo(d + Math.cos(y) * x, p + Math.sin(y) * x);
      }
      e.closePath();
    },
    i = (d, p, f, g, m) => {
      const w = e.createRadialGradient(d, p, f, d, p, g);
      for (const [y, x] of m) w.addColorStop(y, x);
      return w;
    },
    n = (d, p, f, g, m, w, y = 10) => {
      ((e.strokeStyle = m), (e.lineWidth = w), (e.lineCap = "round"));
      for (let x = 0; x < f; x++) {
        let b = o() * Math.PI * 2,
          v = d + Math.cos(b) * y,
          M = p + Math.sin(b) * y;
        (e.beginPath(), e.moveTo(v, M));
        const _ = (3 + o() * 4) | 0;
        for (let S = 0; S < _; S++) {
          b += (o() - 0.5) * 0.9;
          const T = (g * (0.4 + o() * 0.6)) / _;
          ((v += Math.cos(b) * T), (M += Math.sin(b) * T), e.lineTo(v, M));
        }
        e.stroke();
      }
    },
    r = (d, p, f, g, m, w = 2) => {
      e.fillStyle = m;
      for (let y = 0; y < g; y++) {
        const x = o() * 6.283,
          b = Math.pow(o(), 0.7) * f;
        e.fillRect(
          d + Math.cos(x) * b,
          p + Math.sin(x) * b,
          w * (0.5 + o()),
          w * (0.5 + o()),
        );
      }
    },
    l = (d, p) => {
      const f = (d % 4) * 256,
        g = Math.floor(d / 4) * 256;
      (e.save(),
        e.beginPath(),
        e.rect(f + 6, g + 6, 244, 244),
        e.clip(),
        p(f + 256 / 2, g + 256 / 2),
        e.restore());
    },
    u = (d, p, f, g, m, w) => {
      ((e.fillStyle = i(d, p, 10, 118, [
        [0, m],
        [1, "rgba(0,0,0,0)"],
      ])),
        e.fillRect(d - 128, p - 128, 256, 256),
        s(d, p, 62, 0.55, 22),
        (e.fillStyle = f),
        e.fill(),
        s(d, p, 48, 0.5, 18),
        (e.fillStyle = i(d - 6, p - 6, 4, 50, [
          [0, "rgba(20,18,16,.9)"],
          [0.55, "rgba(55,50,45,.55)"],
          [1, "rgba(0,0,0,0)"],
        ])),
        e.fill(),
        s(d, p, 21, 0.45, 12),
        (e.fillStyle = g),
        e.fill(),
        s(d, p, 30, 0.5, 14),
        (e.fillStyle = "rgba(25,22,20,.35)"),
        e.fill(),
        r(d, p, 90, 70, w, 3),
        n(d, p, 7, 55, w, 1.6, 34));
    };
  (l(K.concrete, (d, p) =>
    u(
      d,
      p,
      "rgba(160,154,145,.92)",
      "#0d0b0a",
      "rgba(140,136,128,.4)",
      "rgba(35,32,28,.6)",
    ),
  ),
    l(K.concrete2, (d, p) =>
      u(
        d,
        p,
        "rgba(160,156,148,.95)",
        "#100e0c",
        "rgba(130,126,120,.4)",
        "rgba(30,28,25,.55)",
      ),
    ),
    l(K.brick, (d, p) =>
      u(
        d,
        p,
        "rgba(160,98,76,.95)",
        "#140806",
        "rgba(150,100,80,.4)",
        "rgba(60,28,20,.6)",
      ),
    ),
    l(K.plaster, (d, p) => {
      (s(d + 10, p + 6, 70, 0.4, 16),
        (e.fillStyle = "rgba(170,164,152,.3)"),
        e.fill(),
        u(
          d,
          p,
          "rgba(168,161,149,.85)",
          "#16120f",
          "rgba(170,165,156,.3)",
          "rgba(60,55,48,.6)",
        ),
        n(d, p, 4, 60, "rgba(40,36,30,.45)", 1.3, 55));
    }),
    l(K.metal, (d, p) => {
      ((e.fillStyle = i(d, p, 2, 70, [
        [0, "rgba(70,70,72,.95)"],
        [0.25, "rgba(205,205,200,.95)"],
        [0.55, "rgba(150,150,148,.6)"],
        [1, "rgba(0,0,0,0)"],
      ])),
        s(d, p, 66, 0.35, 16),
        e.fill(),
        (e.strokeStyle = "rgba(40,40,40,.6)"),
        (e.lineWidth = 3),
        s(d, p, 30, 0.2, 14),
        e.stroke(),
        r(d, p, 80, 30, "rgba(200,200,195,.6)", 2));
    }),
    l(K.metalThin, (d, p) => {
      (s(d, p, 70, 0.6, 16),
        (e.fillStyle = "rgba(110,105,98,.55)"),
        e.fill(),
        (e.fillStyle = i(d, p, 10, 40, [
          [0, "rgba(215,215,210,1)"],
          [1, "rgba(150,150,145,.8)"],
        ])),
        s(d, p, 40, 0.25, 14),
        e.fill(),
        s(d, p, 22, 0.25, 12),
        (e.fillStyle = "#050505"),
        e.fill());
    }),
    l(K.metalExit, (d, p) => {
      ((e.fillStyle = "rgba(90,86,80,.55)"), s(d, p, 80, 0.6, 16), e.fill());
      for (let f = 0; f < 6; f++) {
        const g = (f / 6) * 6.283 + o() * 0.5,
          m = 50 + o() * 25;
        (e.beginPath(),
          e.moveTo(d + Math.cos(g - 0.35) * 22, p + Math.sin(g - 0.35) * 22),
          e.lineTo(d + Math.cos(g) * m, p + Math.sin(g) * m),
          e.lineTo(d + Math.cos(g + 0.35) * 22, p + Math.sin(g + 0.35) * 22),
          e.closePath(),
          (e.fillStyle = `rgba(${190 + o() * 40},${190 + o() * 40},${185 + o() * 40},.95)`),
          e.fill());
      }
      (s(d, p, 28, 0.4, 12), (e.fillStyle = "#040404"), e.fill());
    }));
  const h = (d, p, f) => {
    ((e.fillStyle = i(d, p, 5, 100, [
      [0, "rgba(60,40,20,.5)"],
      [1, "rgba(0,0,0,0)"],
    ])),
      e.fillRect(d - 128, p - 128, 256, 256));
    const g = f ? 26 : 14;
    for (let m = 0; m < g; m++) {
      const w = o() > 0.5 ? 1 : -1,
        y = (f ? 50 : 30) + o() * (f ? 70 : 45),
        x = 3 + o() * (f ? 9 : 5),
        b = p + (o() - 0.5) * (f ? 60 : 34);
      ((e.fillStyle = `rgba(${200 + o() * 40},${165 + o() * 35},${110 + o() * 30},.95)`),
        e.beginPath(),
        e.moveTo(d, b - x / 2),
        e.lineTo(d + w * y, b + (o() - 0.5) * 6),
        e.lineTo(d, b + x / 2),
        e.closePath(),
        e.fill());
    }
    (s(d, p, f ? 30 : 20, 0.5, 12), (e.fillStyle = "#0a0705"), e.fill());
  };
  (l(K.wood, (d, p) => h(d, p, !1)),
    l(K.woodExit, (d, p) => h(d, p, !0)),
    l(K.glass, (d, p) => {
      ((e.fillStyle = i(d, p, 2, 34, [
        [0, "rgba(235,240,240,.9)"],
        [1, "rgba(220,228,228,0)"],
      ])),
        e.fillRect(d - 40, p - 40, 80, 80),
        (e.strokeStyle = "rgba(235,240,240,.75)"),
        (e.lineWidth = 1.4),
        (e.lineCap = "round"));
      const f = 14;
      for (let g = 0; g < f; g++) {
        let m = (g / f) * 6.283 + o() * 0.3,
          w = d,
          y = p;
        (e.beginPath(), e.moveTo(w, y));
        const x = 70 + o() * 50;
        for (let b = 0; b < 5; b++)
          ((m += (o() - 0.5) * 0.25),
            (w += (Math.cos(m) * x) / 5),
            (y += (Math.sin(m) * x) / 5),
            e.lineTo(w, y));
        e.stroke();
      }
      e.lineWidth = 1;
      for (const g of [22, 40, 62]) {
        e.beginPath();
        for (let m = 0; m <= 28; m++) {
          const w = (m / 28) * 6.283,
            y = g * (0.85 + o() * 0.3);
          m
            ? e.lineTo(d + Math.cos(w) * y, p + Math.sin(w) * y)
            : e.moveTo(d + Math.cos(w) * y, p + Math.sin(w) * y);
        }
        o() > 0.2 && e.stroke();
      }
      (s(d, p, 7, 0.4, 10), (e.fillStyle = "rgba(10,12,12,.95)"), e.fill());
    }),
    l(K.dirt, (d, p) => {
      ((e.fillStyle = i(d, p, 4, 100, [
        [0, "rgba(18,12,8,.9)"],
        [0.3, "rgba(40,30,20,.75)"],
        [0.55, "rgba(95,78,58,.45)"],
        [1, "rgba(0,0,0,0)"],
      ])),
        s(d, p, 100, 0.4, 20),
        e.fill(),
        r(d, p, 95, 60, "rgba(30,22,15,.7)", 4));
    }),
    l(K.gravel, (d, p) => {
      ((e.fillStyle = i(d, p, 4, 90, [
        [0, "rgba(25,23,21,.85)"],
        [0.4, "rgba(70,66,60,.5)"],
        [1, "rgba(0,0,0,0)"],
      ])),
        s(d, p, 90, 0.5, 18),
        e.fill(),
        r(d, p, 85, 50, "rgba(150,145,138,.8)", 5),
        r(d, p, 70, 40, "rgba(20,18,16,.8)", 4));
    }),
    l(K.soft, (d, p) => {
      (s(d, p, 40, 0.6, 12),
        (e.fillStyle = "rgba(40,36,30,.35)"),
        e.fill(),
        s(d, p, 20, 0.7, 10),
        (e.fillStyle = "rgba(8,8,8,.95)"),
        e.fill());
    }),
    l(K.scorch, (d, p) => {
      ((e.fillStyle = i(d, p, 4, 122, [
        [0, "rgba(8,7,6,.95)"],
        [0.35, "rgba(18,16,14,.8)"],
        [0.75, "rgba(30,27,24,.35)"],
        [1, "rgba(0,0,0,0)"],
      ])),
        s(d, p, 122, 0.25, 26),
        e.fill(),
        (e.strokeStyle = "rgba(10,9,8,.22)"),
        (e.lineCap = "round"));
      for (let f = 0; f < 46; f++) {
        const g = o() * 6.283,
          m = 40 + o() * 40,
          w = m + 20 + o() * 45;
        ((e.lineWidth = 4 + o() * 10),
          e.beginPath(),
          e.moveTo(d + Math.cos(g) * m, p + Math.sin(g) * m),
          e.lineTo(d + Math.cos(g) * w, p + Math.sin(g) * w),
          e.stroke());
      }
      r(d, p, 110, 120, "rgba(70,64,58,.6)", 3);
    }));
  const c = new fe(t);
  return ((c.colorSpace = Te), c);
}
function Ul() {
  const t = document.createElement("canvas");
  ((t.width = 128 * 2), (t.height = 128));
  const e = t.getContext("2d"),
    o = $o(9);
  for (let n = 0; n < 60; n++) {
    const r = 64 + (o() - 0.5) * 128 * 0.5,
      l = 128 / 2 + (o() - 0.5) * 128 * 0.5,
      u = 128 * (0.12 + o() * 0.2),
      h = e.createRadialGradient(r, l, 0, r, l, u);
    (h.addColorStop(0, "rgba(255,255,255,.12)"),
      h.addColorStop(1, "rgba(255,255,255,0)"),
      (e.fillStyle = h),
      e.fillRect(0, 0, 128, 128));
  }
  const s = e.createRadialGradient(
    128 * 1.5,
    128 / 2,
    0,
    128 * 1.5,
    128 / 2,
    128 / 2,
  );
  return (
    s.addColorStop(0, "rgba(255,255,255,1)"),
    s.addColorStop(0.25, "rgba(255,220,160,.8)"),
    s.addColorStop(1, "rgba(255,120,30,0)"),
    (e.fillStyle = s),
    e.fillRect(128, 0, 128, 128),
    new fe(t)
  );
}

export { Al, Ao, Bl, Cn, Fl, Il, K, Ll, Pl, Rl, Ss, Tl, Ul, Vl, _s, qs, sa, zl };
