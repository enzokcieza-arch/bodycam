// fx/particles.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, E as Ut, Q, V as P, Y as vt, Z as Ae, aA as zr, aB as Cr, ae as Se, ak as co, al as Va, am as fo, av as Ya, ay as Pr, az as Bi, b as Ai, d as Tt, f as Ha, h as Fi, i as xo, o as B, p as Ke, u as Pi } from "three-vendor";
import { Il, K, Ul } from "../world/geometry-utils.js";
import { L0, Yc, ci } from "../weapon/viewmodel.js";

class hi {
  constructor(t, e, o) {
    ((this.max = t),
      (this.n = 0),
      (this.p = new Float32Array(t * 3)),
      (this.v = new Float32Array(t * 3)),
      (this.life = new Float32Array(t)),
      (this.maxLife = new Float32Array(t)),
      (this.size0 = new Float32Array(t)),
      (this.size1 = new Float32Array(t)),
      (this.col = new Float32Array(t * 4)),
      (this.drag = new Float32Array(t)),
      (this.grav = new Float32Array(t)),
      (this.alpha0 = new Float32Array(t)),
      (this.kind = new Float32Array(t)));
    const s = new Ut();
    ((this.aPos = new Se(new Float32Array(t * 3), 3).setUsage(fo)),
      (this.aCol = new Se(new Float32Array(t * 4), 4).setUsage(fo)),
      (this.aSize = new Se(new Float32Array(t * 2), 2).setUsage(fo)),
      s.setAttribute("position", this.aPos),
      s.setAttribute("pcolor", this.aCol),
      s.setAttribute("psize", this.aSize),
      (s.boundingSphere = new Bi(new P(), 1e5)),
      (this.mat = new Pi({
        uniforms: {
          tex: { value: o },
          scale: { value: 800 },
          ambient: { value: 1 },
        },
        vertexShader: `attribute vec4 pcolor; attribute vec2 psize; varying vec4 vC; varying float vK; varying float vR; uniform float scale;
        void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(psize.x * scale / max(-mv.z, 0.05), 1.0, 400.0); vC = pcolor; vK = psize.y; vR = fract(psize.y*13.7 + position.x*3.1) * 6.283; }`,
        fragmentShader: `uniform sampler2D tex; uniform float ambient; varying vec4 vC; varying float vK; varying float vR;
        void main(){ vec2 c = gl_PointCoord - 0.5; float s = sin(vR), co = cos(vR); c = vec2(c.x*co - c.y*s, c.x*s + c.y*co) + 0.5;
          vec2 uv = vec2((vK > 0.5 ? 0.5 : 0.0) + c.x * 0.5, 1.0 - c.y);
          vec4 t = texture2D(tex, uv);
          float a = (vK > 0.5 ? t.a : t.r * 2.5) * vC.a;
          vec3 col = vK > 0.5 ? vC.rgb * t.rgb * 3.0 : vC.rgb * ambient;
          gl_FragColor = vec4(col, clamp(a, 0.0, 1.0)); if (gl_FragColor.a < 0.004) discard; }`,
        transparent: !0,
        depthWrite: !1,
        blending: e ? Ya : zr,
      })),
      (this.points = new Cr(s, this.mat)),
      (this.points.frustumCulled = !1),
      (this.points.renderOrder = e ? 4 : 3));
  }
  spawn(t, e, o, s, i, n, r, l, u, h, c, d, p, f, g, m) {
    let w = this.n < this.max ? this.n++ : Math.floor(Math.random() * this.max);
    ((this.p[w * 3] = t),
      (this.p[w * 3 + 1] = e),
      (this.p[w * 3 + 2] = o),
      (this.v[w * 3] = s),
      (this.v[w * 3 + 1] = i),
      (this.v[w * 3 + 2] = n),
      (this.life[w] = 0),
      (this.maxLife[w] = r),
      (this.size0[w] = l),
      (this.size1[w] = u),
      (this.col[w * 4] = h),
      (this.col[w * 4 + 1] = c),
      (this.col[w * 4 + 2] = d),
      (this.alpha0[w] = p),
      (this.drag[w] = f),
      (this.grav[w] = g),
      (this.kind[w] = m));
  }
  update(t) {
    let e = this.n;
    for (let n = 0; n < e; n++) {
      if (((this.life[n] += t), this.life[n] >= this.maxLife[n])) {
        (e--, this._copy(e, n), n--);
        continue;
      }
      const r = Math.exp(-this.drag[n] * t);
      ((this.v[n * 3] *= r),
        (this.v[n * 3 + 1] = this.v[n * 3 + 1] * r - this.grav[n] * t),
        (this.v[n * 3 + 2] *= r),
        (this.p[n * 3] += this.v[n * 3] * t),
        (this.p[n * 3 + 1] += this.v[n * 3 + 1] * t),
        (this.p[n * 3 + 2] += this.v[n * 3 + 2] * t));
    }
    this.n = e;
    const o = this.aPos.array,
      s = this.aCol.array,
      i = this.aSize.array;
    for (let n = 0; n < e; n++) {
      const r = this.life[n] / this.maxLife[n];
      ((o[n * 3] = this.p[n * 3]),
        (o[n * 3 + 1] = this.p[n * 3 + 1]),
        (o[n * 3 + 2] = this.p[n * 3 + 2]),
        (s[n * 4] = this.col[n * 4]),
        (s[n * 4 + 1] = this.col[n * 4 + 1]),
        (s[n * 4 + 2] = this.col[n * 4 + 2]),
        (s[n * 4 + 3] =
          this.alpha0[n] *
          (this.kind[n] > 0.5
            ? 1 - r
            : Math.min(1, r * 8) * (1 - r) * (1 - r))),
        (i[n * 2] =
          this.size0[n] + (this.size1[n] - this.size0[n]) * Math.sqrt(r)),
        (i[n * 2 + 1] = this.kind[n]));
    }
    ((this.aPos.needsUpdate =
      this.aCol.needsUpdate =
      this.aSize.needsUpdate =
        !0),
      (this.aPos.updateRanges = []),
      this.points.geometry.setDrawRange(0, e));
  }
  _copy(t, e) {
    for (let o = 0; o < 3; o++)
      ((this.p[e * 3 + o] = this.p[t * 3 + o]),
        (this.v[e * 3 + o] = this.v[t * 3 + o]));
    for (let o = 0; o < 4; o++) this.col[e * 4 + o] = this.col[t * 4 + o];
    ((this.life[e] = this.life[t]),
      (this.maxLife[e] = this.maxLife[t]),
      (this.size0[e] = this.size0[t]),
      (this.size1[e] = this.size1[t]),
      (this.drag[e] = this.drag[t]),
      (this.grav[e] = this.grav[t]),
      (this.alpha0[e] = this.alpha0[t]),
      (this.kind[e] = this.kind[t]));
  }
}
const as = new B(),
  qe = new Q(),
  d0 = new P(),
  wa = new P(),
  ie = new P(),
  ya = new P(0, 0, 1),
  jc = new Q(),
  eo = new P(),
  Fs = new P(),
  p0 = new P(),
  xa = new xo(),
  ui = new Ae(),
  so = new P(),
  ns = new P();
function Kc(a, t, e, o) {
  if (a.rest) return !1;
  ((a.v.y -= 9.8 * t), so.copy(a.v).multiplyScalar(t));
  const s = so.length();
  if (((a.r.x += a.w.x * t), (a.r.y += a.w.y * t), s < 1e-7)) return !0;
  so.divideScalar(s);
  const i = 0.0062,
    n = e.segment(a.p, so, s + i);
  if (!n)
    return (a.p.addScaledVector(so, s), a.p.y < -60 && (a.active = !1), !0);
  (ns.copy(n.normal),
    ns.dot(so) > 0 && ns.negate(),
    a.p.copy(n.point).addScaledVector(ns, i));
  const r = a.v.dot(ns),
    l = -r;
  return (
    o && l > 0.4 && a.bounced < 3 && o(l, n.obj),
    a.bounced++,
    a.v.addScaledVector(ns, -r * 1.35).multiplyScalar(0.55),
    a.w.multiplyScalar(0.5),
    ((l < 0.6 && ns.y > 0.55) || a.bounced > 6) &&
      (a.v.set(0, 0, 0),
      (a.rest = !0),
      a.r.set(0, a.r.y, 0),
      a.p.copy(n.point).addScaledVector(ns, i)),
    !0
  );
}
class Xc {
  constructor(t, e, o) {
    ((this.engine = t),
      (this.world = e),
      (this.audio = o),
      (this.ballistics = null));
    const s = t.scene,
      i = Ul();
    ((this.smoke = new hi(1600, !1, i)),
      (this.sparks = new hi(700, !0, i)),
      s.add(this.smoke.points, this.sparks.points));
    const n = Il();
    ((n.anisotropy = 4), (this.holeMax = 500), (this.holeIdx = 0));
    const r = new Ke(1, 1);
    ((this.holeAtlas = new Va(new Float32Array(this.holeMax * 2), 2)),
      r.setAttribute("atlas", this.holeAtlas));
    const l = new Tt({
      map: n,
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      roughness: 0.92,
    });
    ((l.onBeforeCompile = (g) => {
      g.vertexShader = g.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
attribute vec2 atlas;`,
        )
        .replace(
          "#include <uv_vertex>",
          `#include <uv_vertex>
vMapUv = uv * 0.25 + atlas;`,
        );
    }),
      (l.customProgramCacheKey = () => "bulletHoles4x4"),
      (this.holes = new co(r, l, this.holeMax)),
      (this.holes.count = 0),
      (this.holes.frustumCulled = !1),
      (this.holes.renderOrder = 2),
      (this.holes.receiveShadow = !0),
      s.add(this.holes),
      (this.tracerMax = 12),
      (this.tracers = []));
    const u = new Z(0.012, 0.012, 1);
    u.translate(0, 0, -0.5);
    const h = new Fi({
      color: new xo(8, 6, 3),
      transparent: !0,
      blending: Ya,
      depthWrite: !1,
    });
    ((this.tracerMesh = new co(u, h, this.tracerMax)),
      (this.tracerMesh.count = 0),
      (this.tracerMesh.frustumCulled = !1),
      s.add(this.tracerMesh));
    for (let g = 0; g < this.tracerMax; g++)
      this.tracers.push({ life: 0, from: new P(), to: new P() });
    ((this.shellMax = 60), (this.shellIdx = 0), (this.shells = []));
    const c = new vt(0.0057, 0.0062, 0.039, 8);
    c.rotateX(Math.PI / 2);
    const d = new Tt({ color: 9071162, metalness: 0.9, roughness: 0.35 });
    ((this.shellMesh = new co(c, d, this.shellMax)),
      (this.shellMesh.count = 0),
      (this.shellMesh.frustumCulled = !1),
      (this.shellMesh.castShadow = !1),
      s.add(this.shellMesh));
    for (let g = 0; g < this.shellMax; g++)
      this.shells.push({
        p: new P(),
        v: new P(),
        r: new Ae(),
        w: new P(),
        floor: 0,
        active: !1,
        bounced: 0,
        rest: !1,
      });
    ((this.debMax = 160), (this.debIdx = 0), (this.debris = []));
    const p = new Pr(0.05, 0),
      f = new Tt({ color: 16777215, roughness: 1 });
    ((this.debMesh = new co(p, f, this.debMax)),
      (this.debMesh.count = 0),
      (this.debMesh.frustumCulled = !1),
      (this.debMesh.castShadow = !1));
    for (let g = 0; g < this.debMax; g++)
      this.debMesh.setColorAt(g, xa.setRGB(0.48, 0.45, 0.42));
    s.add(this.debMesh);
    for (let g = 0; g < this.debMax; g++)
      this.debris.push({
        p: new P(),
        v: new P(),
        r: new Ae(),
        s: 1,
        sx: 1,
        sy: 0.7,
        sz: 1,
        floor: -1e9,
        simple: !1,
        active: !1,
        rest: !1,
      });
    ((this.boomLight = new Ha(16752720, 0, 26, 2)),
      s.add(this.boomLight),
      (this.boomT = 0),
      (this.ambient = 1));
  }
  _decal(t, e, o, s, i = Math.random() * 6.283) {
    const n = this.holeIdx++ % this.holeMax;
    (qe.setFromUnitVectors(ya, e),
      qe.multiply(jc.setFromAxisAngle(ya, i)),
      as.compose(wa.copy(t).addScaledVector(e, 0.0025), qe, d0.set(s, s, s)),
      this.holes.setMatrixAt(n, as),
      this.holeAtlas.setXY(n, (o % 4) * 0.25, 0.75 - Math.floor(o / 4) * 0.25),
      (this.holeAtlas.needsUpdate = !0),
      (this.holes.instanceMatrix.needsUpdate = !0),
      (this.holes.count = Math.min(
        this.holeMax,
        Math.max(this.holes.count, n + 1),
      )));
  }
  _chip(t, e, o, s, i, n, r, l, u, h, c, d) {
    const p = this.debris[this.debIdx % this.debMax];
    (this.debMesh.setColorAt(
      this.debIdx % this.debMax,
      xa.setRGB(r[0], r[1], r[2]),
    ),
      this.debIdx++,
      p.p.set(t, e, o),
      p.v.set(s, i, n),
      (p.active = !0),
      (p.rest = !1),
      (p.simple = !0),
      (p.floor = d),
      p.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      (p.s = l),
      (p.sx = u),
      (p.sy = h),
      (p.sz = c),
      (this.debMesh.instanceColor.needsUpdate = !0),
      (this.debMesh.count = Math.min(
        this.debMax,
        Math.max(this.debMesh.count, this.debIdx),
      )));
  }
  bulletImpact(t, e, o, s, i = null, n = 0, r = 1) {
    const l = L0[o] || L0.concrete,
      u = (n & 1) !== 0,
      h = (n & 4) !== 0,
      c = this.ambient;
    if (!(n & 2) && l.size > 0) {
      const b = u ? l.exitCell : l.cell;
      b >= 0 &&
        this._decal(
          t,
          e,
          b,
          l.size *
            (h ? 0.7 : 1) *
            (u ? 1.25 : 1) *
            (0.8 + Math.random() * 0.45),
        );
    }
    if (i)
      if (u) eo.copy(i);
      else {
        const b = i.dot(e);
        eo.copy(i)
          .addScaledVector(e, -2 * b)
          .multiplyScalar(0.5)
          .add(e)
          .normalize();
      }
    else eo.copy(e);
    const d = eo.x,
      p = eo.y,
      f = eo.z,
      g = l.dust,
      m = u ? 0.5 : 1,
      w = l.puffSize,
      y = Yc * c,
      x = Math.random;
    for (let b = 0; b < l.puffs * m; b++) {
      const v = 0.5 + x() * 2;
      this.smoke.spawn(
        t.x,
        t.y,
        t.z,
        d * v + (x() - 0.5) * 1,
        p * v + (x() - 0.25) * 0.9,
        f * v + (x() - 0.5) * 1,
        0.8 + x() * 1.6,
        0.04 * w,
        (0.3 + x() * 0.45) * w,
        g[0] * y,
        g[1] * y,
        g[2] * y,
        l.kind === "ground" ? ci * 1.2 : ci,
        3.5,
        0.12,
        0,
      );
    }
    if (l.kind !== "metal" && l.kind !== "steel" && l.kind !== "water")
      for (let b = 0; b < 6 * m; b++) {
        const v = 2 + x() * 4;
        this.smoke.spawn(
          t.x,
          t.y,
          t.z,
          d * v + (x() - 0.5) * 3,
          p * v + x() * 2.5,
          f * v + (x() - 0.5) * 3,
          0.45 + x() * 0.4,
          0.02,
          0.016,
          g[0] * 0.6 * c,
          g[1] * 0.6 * c,
          g[2] * 0.6 * c,
          1,
          0.4,
          9.8,
          0,
        );
      }
    if (l.chip && l.chips > 0) {
      const b = this._floorBelow(t, e),
        v = Math.max(1, Math.round(l.chips * m * (h ? 0.5 : 1)));
      for (let M = 0; M < v; M++) {
        const _ =
            (l.kind === "ground" ? 1.5 : 1.2) +
            x() * (l.kind === "ground" ? 3 : 2.5),
          S = d * _ + (x() - 0.5) * 1.6,
          T = p * _ + x() * (l.kind === "ground" ? 2.5 : 1.2),
          A = f * _ + (x() - 0.5) * 1.6;
        let z = (0.12 + x() * 0.22) * l.chipScale,
          R = 1,
          k = 0.7,
          C = 1;
        (l.kind === "wood"
          ? ((z = 0.09 + x() * 0.08), (R = 1), (k = 1), (C = 5 + x() * 4))
          : l.kind === "glass" &&
            ((z = 0.1 + x() * 0.15), (R = 1.2), (k = 0.12), (C = 1)),
          this._chip(
            t.x + e.x * 0.01,
            t.y + e.y * 0.01,
            t.z + e.z * 0.01,
            S,
            T,
            A,
            l.chip,
            z,
            R,
            k,
            C,
            b,
          ));
      }
    }
    if (l.kind === "ground" && !u)
      for (let b = 0; b < 8; b++) {
        const v = 1.5 + x() * 3.5;
        this.smoke.spawn(
          t.x,
          t.y + 0.02,
          t.z,
          (x() - 0.5) * 0.9 + d * 0.6,
          v,
          (x() - 0.5) * 0.9 + f * 0.6,
          0.5 + x() * 0.5,
          0.03,
          0.12 + x() * 0.12,
          g[0] * 0.7 * c,
          g[1] * 0.7 * c,
          g[2] * 0.7 * c,
          0.9,
          1.2,
          9.8,
          0,
        );
      }
    if (l.kind === "water") {
      for (let b = 0; b < 22; b++) {
        const v = x() * 6.283,
          M = 0.6 + x() * 1.6,
          _ = 2 + x() * 3.5;
        this.smoke.spawn(
          t.x,
          t.y + 0.01,
          t.z,
          Math.cos(v) * M,
          _,
          Math.sin(v) * M,
          0.45 + x() * 0.35,
          0.025,
          0.012,
          0.75 * c,
          0.78 * c,
          0.8 * c,
          1,
          0.2,
          9.8,
          0,
        );
      }
      for (let b = 0; b < 4; b++)
        this.smoke.spawn(
          t.x,
          t.y + 0.05,
          t.z,
          (x() - 0.5) * 0.6,
          0.6 + x() * 0.6,
          (x() - 0.5) * 0.6,
          0.7 + x() * 0.6,
          0.06,
          0.4,
          0.75 * c,
          0.78 * c,
          0.8 * c,
          0.3,
          2.5,
          0.5,
          0,
        );
      for (let b = 0; b < 6; b++)
        this.sparks.spawn(
          t.x,
          t.y + 0.02,
          t.z,
          (x() - 0.5) * 1.5,
          2 + x() * 3,
          (x() - 0.5) * 1.5,
          0.15 + x() * 0.2,
          0.012,
          0.006,
          0.4,
          0.42,
          0.45,
          0.6,
          0.3,
          9.8,
          1,
        );
    }
    if (l.kind === "leaf")
      for (let b = 0; b < 5; b++)
        this.smoke.spawn(
          t.x,
          t.y,
          t.z,
          (x() - 0.5) * 1.5,
          x() * 0.8,
          (x() - 0.5) * 1.5,
          1.2 + x(),
          0.03,
          0.025,
          g[0],
          g[1],
          g[2],
          1,
          1.5,
          2.5,
          0,
        );
    if (l.kind === "paper")
      for (let b = 0; b < 5; b++) {
        const v = 1 + x() * 2;
        this.smoke.spawn(
          t.x,
          t.y,
          t.z,
          d * v + (x() - 0.5),
          p * v + x() * 0.5,
          f * v + (x() - 0.5),
          0.6 + x() * 0.5,
          0.012,
          0.01,
          0.8 * c,
          0.7 * c,
          0.55 * c,
          1,
          1.2,
          4,
          0,
        );
      }
    if (l.kind === "glass")
      for (let b = 0; b < 10; b++) {
        const v = 1.5 + x() * 3;
        this.sparks.spawn(
          t.x,
          t.y,
          t.z,
          d * v + (x() - 0.5) * 2,
          p * v + x() * 1.5,
          f * v + (x() - 0.5) * 2,
          0.35 + x() * 0.4,
          0.012,
          0.008,
          0.55,
          0.6,
          0.62,
          0.7,
          0.6,
          9.8,
          1,
        );
      }
    if (l.sparks > 0) {
      const b = Math.round(l.sparks * (h ? 1.4 : 1) * (0.5 + 0.5 * r)),
        v = l.kind === "steel";
      v &&
        (Fs.set(0, 1, 0),
        Math.abs(e.y) > 0.9 && Fs.set(1, 0, 0),
        Fs.cross(e).normalize(),
        p0.crossVectors(e, Fs));
      for (let M = 0; M < b; M++) {
        let _, S, T;
        if (v) {
          const A = x() * 6.283,
            z = 6 + x() * 10,
            R = x() * 0.35 * z;
          ((_ = (Fs.x * Math.cos(A) + p0.x * Math.sin(A)) * z + e.x * R),
            (S = (Fs.y * Math.cos(A) + p0.y * Math.sin(A)) * z + e.y * R),
            (T = (Fs.z * Math.cos(A) + p0.z * Math.sin(A)) * z + e.z * R));
        } else {
          const A = 3 + x() * 7;
          ((_ = d * A + (x() - 0.5) * 4),
            (S = p * A + x() * 2.5),
            (T = f * A + (x() - 0.5) * 4));
        }
        this.sparks.spawn(
          t.x,
          t.y,
          t.z,
          _,
          S,
          T,
          0.12 + x() * 0.28,
          0.022,
          0.008,
          1,
          0.75,
          0.42,
          1,
          1.5,
          9.8,
          1,
        );
      }
      if (
        (this.sparks.spawn(
          t.x,
          t.y,
          t.z,
          0,
          0,
          0,
          0.05,
          v ? 0.18 : 0.1,
          0.05,
          1,
          0.85,
          0.6,
          1,
          0,
          0,
          1,
        ),
        v)
      )
        for (let M = 0; M < 6; M++) {
          const _ = 1 + x() * 2;
          this.smoke.spawn(
            t.x,
            t.y,
            t.z,
            e.x * _ + (x() - 0.5),
            e.y * _ + x(),
            e.z * _ + (x() - 0.5),
            0.6 + x() * 0.5,
            0.014,
            0.012,
            0.92 * c,
            0.91 * c,
            0.88 * c,
            1,
            0.8,
            9.8,
            0,
          );
        }
    }
  }
  _floorBelow(t, e) {
    if (e.y > 0.7) return t.y;
    const o = this.world.collider;
    if (!o) return t.y - 2;
    const s = o.groundY(t.x + e.x * 0.15, t.y + 0.05, t.z + e.z * 0.15, 6);
    return s === -1 / 0 ? t.y - 6 : s;
  }
  scorch(t, e) {
    this._decal(t, e, K.scorch, 1.6 + Math.random() * 0.6);
  }
  muzzleSmoke(t, e) {
    for (let o = 0; o < 2; o++)
      this.smoke.spawn(
        t.x,
        t.y,
        t.z,
        e.x * 1.5 + (Math.random() - 0.5) * 0.4,
        e.y * 1.5 + 0.3,
        e.z * 1.5 + (Math.random() - 0.5) * 0.4,
        0.9 + Math.random() * 0.6,
        0.04,
        0.35,
        0.5 * this.ambient,
        0.5 * this.ambient,
        0.5 * this.ambient,
        0.14,
        2.2,
        -0.3,
        0,
      );
    for (let o = 0; o < 3; o++) {
      const s = 6 + Math.random() * 8;
      this.sparks.spawn(
        t.x,
        t.y,
        t.z,
        e.x * s + (Math.random() - 0.5) * 2,
        e.y * s + (Math.random() - 0.5) * 2,
        e.z * s + (Math.random() - 0.5) * 2,
        0.05 + Math.random() * 0.06,
        0.02,
        0.005,
        1,
        0.7,
        0.35,
        1,
        0.5,
        0,
        1,
      );
    }
  }
  tracer(t, e) {
    let o = this.tracers[0];
    for (let s = 0; s < this.tracers.length; s++)
      if (this.tracers[s].life <= 0) {
        o = this.tracers[s];
        break;
      }
    ((o.life = 0.06), o.from.copy(t), o.to.copy(e));
  }
  ejectShell(t, e, o, s, i) {
    const n = this.shells[this.shellIdx++ % this.shellMax];
    (n.p.copy(t),
      (n.active = !0),
      (n.rest = !1),
      (n.bounced = 0),
      (n.floor = i),
      n.v
        .copy(e)
        .multiplyScalar(2.2 + Math.random() * 1.2)
        .addScaledVector(o, 1.6 + Math.random() * 0.8)
        .addScaledVector(s, (Math.random() - 0.3) * 0.6),
      n.r.set(Math.random() * 6, Math.random() * 6, 0),
      n.w.set(20 + Math.random() * 20, 10 + Math.random() * 30, 5),
      (this.shellMesh.count = Math.min(
        this.shellMax,
        Math.max(this.shellMesh.count, this.shellIdx),
      )));
  }
  explosion(t) {
    const e = this.ambient;
    (this.boomLight.position.copy(t).add(ie.set(0, 0.6, 0)),
      (this.boomT = 0.35));
    for (let o = 0; o < 40; o++) {
      const s = ie
          .set(Math.random() - 0.5, Math.random() * 0.8, Math.random() - 0.5)
          .normalize(),
        i = 3 + Math.random() * 7;
      this.sparks.spawn(
        t.x,
        t.y + 0.2,
        t.z,
        s.x * i,
        s.y * i,
        s.z * i,
        0.15 + Math.random() * 0.25,
        0.6,
        1.6,
        1,
        0.6,
        0.25,
        1,
        4,
        0,
        1,
      );
    }
    for (let o = 0; o < 60; o++) {
      const s = ie
          .set(Math.random() - 0.5, Math.random(), Math.random() - 0.5)
          .normalize(),
        i = 8 + Math.random() * 18;
      this.sparks.spawn(
        t.x,
        t.y + 0.1,
        t.z,
        s.x * i,
        s.y * i,
        s.z * i,
        0.3 + Math.random() * 0.6,
        0.04,
        0.01,
        1,
        0.8,
        0.4,
        1,
        1,
        9.8,
        1,
      );
    }
    for (let o = 0; o < 90; o++) {
      const s = ie
          .set(Math.random() - 0.5, Math.random() * 0.7, Math.random() - 0.5)
          .normalize(),
        i = 1 + Math.random() * 7,
        n = 0.18 + Math.random() * 0.2;
      this.smoke.spawn(
        t.x + s.x * 0.4,
        t.y + 0.3 + s.y * 0.4,
        t.z + s.z * 0.4,
        s.x * i,
        s.y * i * 0.8,
        s.z * i,
        3 + Math.random() * 6,
        0.6,
        3.5 + Math.random() * 3,
        n * e,
        n * 0.95 * e,
        n * 0.9 * e,
        0.55,
        1.6,
        -0.25,
        0,
      );
    }
    for (let o = 0; o < 40; o++) {
      const s = ie
          .set(Math.random() - 0.5, Math.random() * 0.3, Math.random() - 0.5)
          .normalize(),
        i = 3 + Math.random() * 6;
      this.smoke.spawn(
        t.x,
        t.y + 0.1,
        t.z,
        s.x * i,
        s.y * i,
        s.z * i,
        4 + Math.random() * 4,
        0.5,
        4,
        0.55 * e,
        0.5 * e,
        0.44 * e,
        0.35,
        1.2,
        -0.05,
        0,
      );
    }
    for (let o = 0; o < 30; o++) {
      const s = this.debIdx % this.debMax,
        i = this.debris[s];
      (this.debIdx++, this.debMesh.setColorAt(s, xa.setRGB(0.48, 0.45, 0.42)));
      const n = ie
        .set(Math.random() - 0.5, 0.4 + Math.random(), Math.random() - 0.5)
        .normalize();
      (i.p.copy(t).addScaledVector(n, 0.2),
        i.v.copy(n).multiplyScalar(4 + Math.random() * 9),
        (i.active = !0),
        (i.rest = !1),
        (i.simple = !1),
        i.r.set(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        (i.s = 0.4 + Math.random() * 1.4),
        (i.sx = 1),
        (i.sy = 0.7),
        (i.sz = 1));
    }
    ((this.debMesh.instanceColor.needsUpdate = !0),
      (this.debMesh.count = Math.min(
        this.debMax,
        Math.max(this.debMesh.count, this.debIdx),
      )));
  }
  update(t, e, o) {
    ((this.ambient = o), (this.smoke.mat.uniforms.ambient.value = 1));
    const s =
      this.engine.post.h /
      (2 * Math.tan(Ai.degToRad(this.engine.camera.fov / 2)));
    ((this.smoke.mat.uniforms.scale.value =
      this.sparks.mat.uniforms.scale.value =
        s),
      this.smoke.update(t),
      this.sparks.update(t));
    let i = 0;
    for (const h of this.tracers) {
      if (h.life <= 0) continue;
      h.life -= t;
      const c = h.from.distanceTo(h.to),
        d = 1 - Math.max(0, h.life) / 0.06;
      (wa.lerpVectors(h.from, h.to, Math.min(1, d * 1.4)),
        ie.subVectors(h.to, h.from).normalize(),
        qe.setFromUnitVectors(ya, ie.negate()),
        as.compose(wa, qe, d0.set(1, 1, Math.min(c, 6))),
        this.tracerMesh.setMatrixAt(i++, as));
    }
    ((this.tracerMesh.count = i),
      (this.tracerMesh.instanceMatrix.needsUpdate = !0));
    let n = !1;
    const r = this.ballistics;
    this._onLand ||
      (this._onLand = (h, c) => {
        const d = c?.userData?._bsurf || c?.userData?.surface;
        d !== "dirt" &&
          d !== "mud" &&
          d !== "soft" &&
          d !== "foliage" &&
          this.audio.casing(0);
      });
    for (let h = 0; h < this.shellMesh.count; h++) {
      const c = this.shells[h];
      c.active &&
        (c.rest ||
          ((n = !0),
          r
            ? Kc(c, Math.min(t, 1 / 30), r, this._onLand)
            : ((c.v.y -= 9.8 * t),
              c.p.addScaledVector(c.v, t),
              (c.r.x += c.w.x * t),
              (c.r.y += c.w.y * t),
              c.p.y < c.floor + 0.006 &&
                ((c.p.y = c.floor + 0.006),
                c.v.y < -0.4
                  ? (c.bounced++ < 2 && this.audio.casing(0),
                    (c.v.y *= -0.35),
                    (c.v.x *= 0.5),
                    (c.v.z *= 0.5),
                    c.w.multiplyScalar(0.5))
                  : (c.v.set(0, 0, 0), (c.rest = !0), (c.r.x = 0))))),
        qe.setFromEuler(c.r),
        as.compose(c.p, qe, d0.set(1, 1, 1)),
        this.shellMesh.setMatrixAt(h, as));
    }
    ((n || this._shellDirty) &&
      (this.shellMesh.instanceMatrix.needsUpdate = !0),
      (this._shellDirty = n));
    const l = this.world.collider;
    let u = !1;
    for (let h = 0; h < this.debMesh.count; h++) {
      const c = this.debris[h];
      if (c.active) {
        if (!c.rest) {
          if (
            ((u = !0),
            (c.v.y -= 9.8 * t),
            c.p.addScaledVector(c.v, t),
            (c.r.x += (Math.abs(c.v.x) + Math.abs(c.v.y)) * t * 3),
            (c.r.z += c.v.x * t * 2),
            c.simple)
          )
            c.p.y < c.floor + 0.004 &&
              ((c.p.y = c.floor + 0.004),
              c.v.y < -1.2
                ? ((c.v.y *= -0.3), (c.v.x *= 0.5), (c.v.z *= 0.5))
                : (c.v.set(0, 0, 0), (c.rest = !0), (c.r.x = 0), (c.r.z = 0)));
          else if (l.resolveSphere(c.p, 0.05 * c.s, ie)) {
            const d = c.v.dot(ie);
            (d < 0 && c.v.addScaledVector(ie, -d * 1.4),
              c.v.multiplyScalar(0.6),
              c.v.lengthSq() < 0.05 && ie.y > 0.5 && (c.rest = !0));
          }
        }
        (ui.copy(c.r),
          qe.setFromEuler(ui),
          as.compose(c.p, qe, d0.set(c.s * c.sx, c.s * c.sy, c.s * c.sz)),
          this.debMesh.setMatrixAt(h, as));
      }
    }
    ((u || this._debDirty) && (this.debMesh.instanceMatrix.needsUpdate = !0),
      (this._debDirty = u),
      this.boomT > 0
        ? ((this.boomT -= t),
          (this.boomLight.intensity =
            600 * Math.pow(Math.max(0, this.boomT / 0.35), 2)))
        : (this.boomLight.intensity = 0));
  }
}

export { Xc };
