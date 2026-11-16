// weapon/ballistics.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { $ as B0, B as Z, G as Kt, J as Do, K as vo, Q, R as yo, V as P, a as Rt, a2 as I0, a3 as $t, a5 as fe, ai as U0, az as Bi, d as Tt, g as ht, o as B, p as Ke, v as Te, z as Ga } from "three-vendor";

const Zc = new Set(["foliage", "grass", "leaves", "twigs"]),
  Jc = {
    chainlink: {
      loss: 0.02,
      perM: 0,
      dev: 0.004,
      maxT: 0.03,
      wire: 0.22,
      shell: !0,
    },
    glass: { loss: 0.1, perM: 0, dev: 0.012, maxT: 0.04, shell: !0 },
    soft: { loss: 0.08, perM: 0, dev: 0.012, maxT: 0.9, shell: !0 },
    cardboard: { loss: 0.03, perM: 0, dev: 0.005, maxT: 0.6, shell: !0 },
    cloth: { loss: 0.02, perM: 0, dev: 0.004, maxT: 0.3, shell: !0 },
    plywood: { loss: 0.15, perM: 0, dev: 0.015, maxT: 0.05, shell: !0 },
    metal_thin: { loss: 0.24, perM: 0, dev: 0.03, maxT: 0.015, shell: !0 },
    wood: { loss: 0.12, perM: 4.5, dev: 0.02, maxT: 0.12 },
  },
  Qc = {
    concrete: 0.75,
    metal: 0.85,
    steel: 0.9,
    brick: 0.6,
    asphalt: 0.8,
    plaster: 0.4,
    metal_thin: 0.6,
    glass: 0,
    water: 0.9,
  },
  ba = new Set(["wood", "plywood", "metal_thin", "glass"]),
  di = {
    metal_corrugated: "metal_thin",
    plywood: "plywood",
    metal_galv: "metal",
    glass: "glass",
    chainlink: "chainlink",
    Fence006: "chainlink",
    ground_mud: "mud",
    ground_burnt: "dirt",
    ground_forest: "dirt",
    ground_leaves: "dirt",
    ground_gravel_leaves: "gravel",
    ground_asphalt: "asphalt",
  },
  pi = {
    cement_bag: "sand",
    cardboard_box_01: "cardboard",
    trashbag: "soft",
    old_tyre: "rubber",
    plastic_crate_01: "plastic",
    plastic_monobloc_chair_01: "plastic",
    SchoolDesk_01: "wood",
    wooden_ladder: "wood",
    covered_car: "metal_thin",
    metal_trash_can: "metal_thin",
    metal_jerrycan: "metal_thin",
    Barrel_01: "metal_thin",
    barrel_03: "metal_thin",
    exterior_aircon_unit: "metal_thin",
    rollershutter_door: "metal_thin",
  },
  th =
    /shrub|grass|weed|nettle|fern|ivy|bush|plant|leaves|twig|branch|dandelion|flower/i;
function f0(a) {
  const t = a.userData;
  if (t._bsurf) return t._bsurf;
  let e = t.surface || a.parent?.userData.surface || null,
    o = a;
  for (; o && !o.userData.model && o.parent;) o = o.parent;
  const s = o?.userData.model;
  if (
    (s && pi[s] ? (e = pi[s]) : s && th.test(s) && (e = "foliage"),
    a.name && a.name.startsWith("static:"))
  ) {
    const i = a.name.slice(7);
    di[i] && (e = di[i]);
  }
  return ((t._bsurf = e || "concrete"), t._bsurf);
}
function fi(a) {
  const t = a.userData;
  if (t._bsheet === void 0) {
    const e = a.geometry,
      o = e?.attributes?.position?.count ?? 99;
    t._bsheet =
      t.sheet !== void 0
        ? !!t.sheet
        : !!t.target || o <= 6 || e?.type === "PlaneGeometry";
  }
  return t._bsheet;
}
class eh {
  constructor() {
    ((this.point = new P()),
      (this.normal = new P()),
      (this.dir = new P()),
      (this.uv = new Rt()),
      (this.hasUV = !1),
      (this.distance = 0),
      (this.object = null),
      (this.surface = "concrete"),
      (this.target = null),
      (this.exit = !1),
      (this.graze = !1),
      (this.energy = 1),
      (this.thickness = 0),
      (this.zone = null));
  }
}
const va = new B(),
  m0 = new B(),
  mi = new Ga(),
  oo = new yo(),
  gi = new P(),
  Ma = new P(),
  ao = new Bi(),
  _a = new P(),
  no = new P(),
  Sa = new P(),
  g0 = 10;
class sh {
  constructor(t = []) {
    ((this.lists = t), (this.hits = []));
    for (let e = 0; e < g0; e++) this.hits.push(new eh());
    ((this.result = []),
      (this.rc = new U0()),
      (this.rc.firstHitOnly = !0),
      (this._tmp = []),
      (this.c = {
        obj: null,
        dist: 0,
        point: new P(),
        normal: new P(),
        uv: new Rt(),
        hasUV: !1,
        back: !1,
      }),
      (this.stats = { casts: 0, meshTests: 0 }),
      (this.rng = Math.random));
  }
  cast(t, e, o, s = !0, i = null) {
    const n = this.c;
    if (((n.obj = null), (n.dist = o), this.stats.casts++, i))
      return (this._castObj(i, t, e, n), n.obj ? n : null);
    for (let r = 0; r < this.lists.length; r++) {
      let l = this.lists[r];
      if ((typeof l == "function" && (l = l()), !!l))
        for (let u = 0; u < l.length; u++) {
          const h = l[u];
          !h.visible ||
            h.userData.noBullet ||
            (s && Zc.has(f0(h))) ||
            this._castObj(h, t, e, n);
        }
    }
    return n.obj ? n : null;
  }
  _castObj(t, e, o, s) {
    const i = t.geometry;
    if (!i) return;
    this.stats.meshTests++;
    const n = s.dist,
      r = i.boundsTree;
    if (r && !t.isInstancedMesh && !t.isBatchedMesh) {
      (i.boundingSphere || i.computeBoundingSphere(),
        ao.copy(i.boundingSphere).applyMatrix4(t.matrixWorld),
        Sa.subVectors(ao.center, e));
      const c = Sa.dot(o),
        d = Sa.lengthSq() - c * c,
        p = ao.radius * ao.radius;
      if (d > p || c + ao.radius < 0 || c - ao.radius > n) return;
      (va.copy(t.matrixWorld).invert(),
        oo.origin.copy(e).applyMatrix4(va),
        gi.copy(e).addScaledVector(o, n).applyMatrix4(va),
        oo.direction.subVectors(gi, oo.origin));
      const f = oo.direction.length();
      if (f < 1e-9) return;
      oo.direction.divideScalar(f);
      const g = r.raycastFirst(oo, $t, 0, f);
      if (!g) return;
      Ma.copy(g.point).applyMatrix4(t.matrixWorld);
      const m = Ma.distanceTo(e);
      if (m >= s.dist) return;
      ((s.obj = t),
        (s.dist = m),
        s.point.copy(Ma),
        s.normal
          .copy(g.face.normal)
          .applyMatrix3(mi.getNormalMatrix(t.matrixWorld))
          .normalize(),
        g.uv ? (s.uv.copy(g.uv), (s.hasUV = !0)) : (s.hasUV = !1));
      return;
    }
    const l = this.rc;
    (l.ray.origin.copy(e), l.ray.direction.copy(o), (l.near = 0), (l.far = n));
    const u = this._tmp;
    ((u.length = 0), t.raycast(l, u));
    let h = null;
    for (let c = 0; c < u.length; c++)
      u[c].distance < s.dist &&
        (!h || u[c].distance < h.distance) &&
        (h = u[c]);
    h &&
      ((s.obj = t),
      (s.dist = h.distance),
      s.point.copy(h.point),
      h.face
        ? (h.instanceId !== void 0 && t.isInstancedMesh
            ? (t.getMatrixAt(h.instanceId, m0), m0.premultiply(t.matrixWorld))
            : m0.copy(t.matrixWorld),
          s.normal
            .copy(h.face.normal)
            .applyMatrix3(mi.getNormalMatrix(m0))
            .normalize())
        : s.normal.copy(o).negate(),
      h.uv ? (s.uv.copy(h.uv), (s.hasUV = !0)) : (s.hasUV = !1),
      (u.length = 0));
  }
  probeExit(t, e, o, s, i) {
    _a.copy(e).addScaledVector(o, 0.001);
    const n = this.cast(_a, o, Math.max(3, s * 4), !1, t);
    return n && n.dist <= s
      ? (i.copy(n.point), n.dist + 0.001)
      : n && n.normal.dot(o) > 0
        ? -1
        : (i.copy(e), 0);
  }
  _push(t, e, o, s, i) {
    const n = this.hits[this.result.length];
    return (
      n.point.copy(t.point),
      n.normal.copy(t.normal),
      n.normal.dot(e) > 0 && n.normal.negate(),
      n.dir.copy(e),
      n.uv.copy(t.uv),
      (n.hasUV = t.hasUV),
      (n.distance = o),
      (n.object = t.obj),
      (n.surface = s),
      (n.target = t.obj.userData.target || null),
      (n.exit = !1),
      (n.graze = !1),
      (n.energy = i),
      (n.thickness = 0),
      (n.zone = null),
      this.result.push(n),
      n
    );
  }
  trace(t, e, o = 250, s = 1) {
    const i = this.result;
    i.length = 0;
    const n = _a.copy(t),
      r = no.copy(e).normalize();
    let l = s,
      u = 0,
      h = 0,
      c = !1;
    const d = this._exitP || (this._exitP = new P()),
      p = this._oo || (this._oo = new P()),
      f = this._dd || (this._dd = new P());
    (p.copy(n), f.copy(r));
    for (let g = 0; g < 16 && i.length < g0 - 1 && u < o; g++) {
      const m = this.cast(p, f, o - u, !0);
      if (!m) break;
      u += m.dist;
      const w = m.obj,
        y = w.userData.target;
      if (y && y.solidAt && m.hasUV && !y.solidAt(m.uv.x, m.uv.y)) {
        p.copy(m.point).addScaledVector(f, 0.002);
        continue;
      }
      const x = (y && y.surface) || f0(w),
        b = Jc[x];
      if (x === "chainlink" && this.rng() > b.wire) {
        p.copy(m.point).addScaledVector(f, 0.002);
        continue;
      }
      if (b && b.shell && m.normal.dot(f) > 0 && !fi(w)) {
        if (((l -= b.loss * 0.5), ba.has(x))) {
          const A = this._push(m, f, u, x, l);
          (A.normal.copy(m.normal), (A.exit = !0), (A.hasUV = !1));
        }
        if (l <= 0.1) {
          ((l = 0), (c = i.length > 0));
          break;
        }
        ((f.x += (this.rng() - 0.5) * b.dev),
          (f.y += (this.rng() - 0.5) * b.dev),
          (f.z += (this.rng() - 0.5) * b.dev),
          f.normalize(),
          p.copy(m.point).addScaledVector(f, 0.002));
        continue;
      }
      const v = this._push(m, f, u, x, l),
        M = -v.normal.dot(f),
        _ = Qc[x] || 0;
      if (_ > 0 && M < 0.2 && h < 2 && this.rng() < _ * (1 - M / 0.2)) {
        if (
          ((v.graze = !0),
          h++,
          f.addScaledVector(v.normal, 2 * M).normalize(),
          (f.x += (this.rng() - 0.5) * 0.08),
          (f.y += this.rng() * 0.05),
          (f.z += (this.rng() - 0.5) * 0.08),
          f.normalize(),
          f.dot(v.normal) < 0.02 &&
            f.addScaledVector(v.normal, 0.05).normalize(),
          (l *= 0.45),
          p.copy(v.point).addScaledVector(v.normal, 0.002),
          l < 0.08)
        ) {
          c = !0;
          break;
        }
        continue;
      }
      if (!b || l < 0.15) {
        c = !0;
        break;
      }
      let S = 0;
      if (b.shell) d.copy(v.point);
      else if (((S = this.probeExit(w, v.point, f, b.maxT, d)), S < 0)) {
        c = !0;
        break;
      }
      if (((v.thickness = S), (l -= b.loss + b.perM * S), l <= 0.1)) {
        ((l = 0), (c = !0));
        break;
      }
      if (!b.shell && ba.has(x) && i.length < g0 - 1) {
        const A = this.hits[i.length];
        (A.point.copy(d),
          A.normal.copy(f),
          A.dir.copy(f),
          A.uv.copy(m.uv),
          (A.hasUV = !1),
          (A.distance = u + S),
          (A.object = w),
          (A.surface = x),
          (A.target = null),
          (A.exit = !0),
          (A.graze = !1),
          (A.energy = l),
          (A.thickness = S),
          (A.zone = null),
          i.push(A));
      }
      if (b.shell && ba.has(x) && fi(w) && i.length < g0 - 1) {
        const A = this._push(m, f, u, x, l);
        (A.normal.copy(f), (A.exit = !0), (A.hasUV = !1));
      }
      u += S;
      const T = b.dev;
      ((f.x += (this.rng() - 0.5) * 2 * T),
        (f.y += (this.rng() - 0.5) * 2 * T),
        (f.z += (this.rng() - 0.5) * 2 * T),
        f.normalize(),
        p.copy(d).addScaledVector(f, 0.002));
    }
    return (
      (this.endPoint = this.endPoint || new P()),
      c && i.length
        ? this.endPoint.copy(i[i.length - 1].point)
        : this.endPoint
            .copy(p)
            .addScaledVector(f, Math.max(0, Math.min(200, o - u))),
      (this.finalEnergy = l),
      i
    );
  }
  losClear(t, e, o = null) {
    no.subVectors(e, t);
    let s = no.length();
    if (s < 1e-4) return !0;
    no.divideScalar(s);
    const i = this._lo || (this._lo = new P());
    i.copy(t);
    const n = o ? o.parent : null;
    for (let r = 0; r < 8; r++) {
      const l = this.cast(i, no, s, !0);
      if (!l) return !0;
      const u = l.obj,
        h = f0(u);
      if (
        u === o ||
        (n && u.parent === n) ||
        u.userData.target ||
        h === "chainlink" ||
        h === "cloth" ||
        h === "soft" ||
        h === "cardboard"
      ) {
        if (
          (i.copy(l.point).addScaledVector(no, 0.002),
          (s -= l.dist + 0.002),
          s <= 0)
        )
          return !0;
        continue;
      }
      return !1;
    }
    return !0;
  }
  segment(t, e, o) {
    return this.cast(t, e, o, !0);
  }
}
const ka = 0.01,
  wi = [
    [-11.5, 0],
    [11.5, 0],
    [23, 11.5],
    [23, 46],
    [15, 58],
    [7.5, 58],
    [7.5, 73.5],
    [5, 76],
    [-5, 76],
    [-7.5, 73.5],
    [-7.5, 58],
    [-15, 58],
    [-23, 46],
    [-23, 11.5],
  ],
  oh = [
    [-15, 9],
    [15, 9],
    [15, 51],
    [9, 57],
    [-9, 57],
    [-15, 51],
  ],
  Da = 46,
  Uo = 76,
  Ka = 6,
  Ws = Da * Ka,
  lo = Uo * Ka,
  Bs = 2,
  yi = { A: 5, B: 3, C: 3, D: 1 };
function tr(a) {
  let t = a >>> 0 || 1;
  return () => (t = (t * 1664525 + 1013904223) >>> 0) / 4294967296;
}
function ah(a, t) {
  return t >= 58
    ? Math.abs(a) <= 5 && t >= 63.5 && t <= 71
      ? "A"
      : "B"
    : Math.abs(a) <= 7.5 && t >= 27 && t <= 55
      ? "A"
      : t >= 9 && t <= 57 && Math.abs(a) <= 15 - Math.max(0, t - 51)
        ? "C"
        : "D";
}
const ye = new P(),
  Is = new P(),
  w0 = new P(),
  xi = new Q();
class nh {
  constructor(t, e, o, s = null, i = null) {
    ((this.engine = t),
      (this.world = e),
      (this.audio = o),
      (this.fx = s),
      (this.hud = i),
      (this.meshes = []),
      (this.solids = []),
      (this.list = []),
      (this.score = 0));
    const n = (l) => new Tt(l);
    ((this.mat = {
      frame: n({ color: 3026994, metalness: 0.75, roughness: 0.55 }),
      wood: n({ color: 8020032, roughness: 0.92 }),
      chain: n({ color: 5592922, metalness: 0.9, roughness: 0.4 }),
    }),
      (this.geo = {
        card: new Ke(Da * ka, Uo * ka).translate(0, (Uo * ka) / 2, 0),
        round: new I0(0.1, 32),
        rect: new Ke(0.25, 0.4),
        popper: ih(),
      }));
    const r = (l, u, h, c) => this.add(l, u, h, c);
    (r(-4, -6.5, 0.1, "plate"),
      r(-2.5, -7, 0, "popper"),
      r(-1, -6.6, -0.1, "rect"),
      r(5, -7.5, 0, "card"),
      r(7, -8.2, 0.2, "card"),
      r(22, -2, Math.PI / 2 + 0.3, "card"),
      r(24.5, 4.5, Math.PI, "plate"),
      r(-20.4, 0, Math.PI / 2, "card"),
      r(10, 25, Math.PI, "card"),
      r(-6, 28, Math.PI + 0.2, "popper"));
  }
  add(t, e, o, s) {
    const i = this.engine.scene;
    let n = 0;
    const r = this.world.collider?.groundY(t, 2.5, e, 4);
    r !== void 0 && r !== -1 / 0 && r < 1.5 && (n = r);
    const l = new Kt();
    (l.position.set(t, n, e), (l.rotation.y = o));
    const u = new Kt();
    l.add(u);
    const h = this.list.length + 1,
      c = {
        id: h,
        kind: s,
        root: l,
        pivot: u,
        mesh: null,
        board: null,
        steel: s !== "card",
        surface: s === "card" ? "cardboard" : "steel",
        angle: 0,
        vel: 0,
        sign: 1,
        down: 0,
        state: 0,
        idle: 0,
        holes: 0,
        splashes: 0,
        score: 0,
        hp: 3,
        canvas: null,
        ctx: null,
        base: null,
        tex: null,
        mask: null,
        baseMask: null,
        mw: 0,
        mh: 0,
        L: 0.3,
        hingeTop: !0,
        solidAt: null,
      },
      d = [];
    if (s === "card") {
      const p = this.makeCardTexture(c, h),
        f = new Tt({
          map: p,
          alphaTest: 0.5,
          side: $t,
          roughness: 0.95,
          metalness: 0,
        }),
        g = new ht(this.geo.card, f);
      g.position.set(0, 0.88, 0);
      const m = new Z(0.025, 1.5, 0.025),
        w = Do([
          m.clone().translate(-0.15, 0.75, -0.02),
          m.clone().translate(0.15, 0.75, -0.02),
        ]),
        y = new ht(w, this.mat.wood);
      (u.position.set(0, 0.06, 0),
        (g.position.y -= 0.06),
        (y.position.y = 0),
        u.add(g, y),
        d.push(
          new Z(0.7, 0.06, 0.09).translate(0, 0.03, -0.02),
          new Z(0.09, 0.06, 0.5).translate(-0.15, 0.03, -0.02),
          new Z(0.09, 0.06, 0.5).translate(0.15, 0.03, -0.02),
        ),
        (c.board = c.mesh = g),
        (c.hingeTop = !1),
        (c.L = 1.3),
        (c.solidAt = (x, b) =>
          c.mask[
            Math.min(c.mh - 1, Math.floor((1 - b) * c.mh)) * c.mw +
              Math.min(c.mw - 1, Math.floor(x * c.mw))
          ] === 1),
        (y.userData.surface = "wood"),
        (y.castShadow = !0),
        this.solids.push(y),
        (g.castShadow = !0),
        (g.receiveShadow = !0));
    } else {
      const p = this.geo[s === "plate" ? "round" : s],
        f = this.makeSteelTexture(c, s),
        g = new Tt({ map: f, side: $t, roughness: 0.62, metalness: 0.25 }),
        m = new ht(p, g);
      if (s === "popper")
        (u.position.set(0, 0.05, 0),
          m.position.set(0, 0, 0),
          d.push(
            new Z(0.42, 0.04, 0.34).translate(0, 0.02, -0.06),
            new Z(0.34, 0.05, 0.05).translate(0, 0.065, -0.03),
          ),
          (c.hingeTop = !1),
          (c.L = 0.6));
      else {
        const w = s === "plate" ? 1.55 : 1.7,
          y = s === "plate" ? 0.32 : 0.36;
        (u.position.set(0, w, -0.04), m.position.set(0, -y, 0.04));
        const x = new Z(0.008, y - (s === "plate" ? 0.08 : 0.2), 0.008),
          b = y - (s === "plate" ? 0.08 : 0.2),
          v = new ht(
            Do([
              x.clone().translate(-0.06, -b / 2, 0.02),
              x.clone().translate(0.06, -b / 2, 0.02),
            ]),
            this.mat.chain,
          );
        u.add(v);
        const M = (_) =>
          new Z(0.05, w + 0.03, 0.05).translate(_, (w + 0.03) / 2, -0.04);
        (d.push(
          M(-0.45),
          M(0.45),
          new Z(0.95, 0.05, 0.05).translate(0, w + 0.03, -0.04),
          new Z(0.08, 0.05, 0.6).translate(-0.45, 0.025, -0.04),
          new Z(0.08, 0.05, 0.6).translate(0.45, 0.025, -0.04),
        ),
          (c.hingeTop = !0),
          (c.L = y));
      }
      (u.add(m),
        (m.castShadow = !0),
        (m.receiveShadow = !0),
        (c.mesh = c.board = m));
    }
    if (d.length) {
      const p = new ht(
        Do(d.map((f) => f.toNonIndexed())),
        s === "card" ? this.mat.wood : this.mat.frame,
      );
      ((p.castShadow = !0),
        (p.receiveShadow = !0),
        (p.userData.surface = s === "card" ? "wood" : "metal"),
        l.add(p),
        this.solids.push(p));
    }
    ((c.mesh.userData.target = c), (c.mesh.userData.surface = c.surface));
    for (const p of this.solids)
      p.geometry &&
        !p.geometry.boundsTree &&
        p.geometry.computeBoundsTree &&
        p.geometry.computeBoundsTree();
    return (
      c.mesh.geometry.computeBoundsTree &&
        !c.mesh.geometry.boundsTree &&
        c.mesh.geometry.computeBoundsTree(),
      this.meshes.push(c.mesh),
      this.list.push(c),
      i.add(l),
      l.updateMatrixWorld(!0),
      c
    );
  }
  makeCardTexture(t, e) {
    const o = document.createElement("canvas");
    ((o.width = Ws), (o.height = lo));
    const s = document.createElement("canvas");
    ((s.width = Ws), (s.height = lo), rh(s.getContext("2d"), e));
    const i = o.getContext("2d", { willReadFrequently: !1 });
    i.drawImage(s, 0, 0);
    const n = Ws / Bs,
      r = lo / Bs,
      l = s.getContext("2d").getImageData(0, 0, Ws, lo).data,
      u = new Uint8Array(n * r);
    for (let c = 0; c < r; c++)
      for (let d = 0; d < n; d++)
        u[c * n + d] =
          l[((c * Bs + 1) * Ws + d * Bs + 1) * 4 + 3] > 128 ? 1 : 0;
    Object.assign(t, {
      canvas: o,
      ctx: i,
      base: s,
      mask: u,
      baseMask: u.slice(),
      mw: n,
      mh: r,
    });
    const h = new fe(o);
    return ((h.colorSpace = Te), (h.anisotropy = 4), (t.tex = h), h);
  }
  makeSteelTexture(t, e) {
    const s = e === "popper" ? 256 : e === "rect" ? 200 : 128,
      i = document.createElement("canvas");
    ((i.width = 128), (i.height = s));
    const n = document.createElement("canvas");
    ((n.width = 128), (n.height = s));
    const r = n.getContext("2d"),
      l = tr(e.length * 17 + this.list.length * 7);
    ((r.fillStyle = "#e6e3da"), r.fillRect(0, 0, 128, s));
    for (let c = 0; c < 26; c++) {
      const d = l() * 128,
        p = l() * s,
        f = 2 + l() * 6;
      ((r.fillStyle = `rgba(150,148,140,${0.08 + l() * 0.1})`),
        r.beginPath(),
        r.arc(d, p, f, 0, 6.283),
        r.fill());
    }
    for (let c = 0; c < 900; c++)
      ((r.fillStyle = `rgba(${l() > 0.5 ? "255,255,250" : "170,168,160"},${0.05 + l() * 0.08})`),
        r.fillRect(l() * 128, l() * s, 1 + l() * 2, 1 + l() * 2));
    r.fillStyle = "rgba(240,238,230,.8)";
    for (let c = 0; c < 6; c++) {
      const d = l() * 128;
      r.fillRect(d, s * (0.85 + l() * 0.1), 1.5, 4 + l() * 10);
    }
    const u = i.getContext("2d");
    (u.drawImage(n, 0, 0), Object.assign(t, { canvas: i, ctx: u, base: n }));
    const h = new fe(i);
    return ((h.colorSpace = Te), (h.anisotropy = 4), (t.tex = h), h);
  }
  punch(t, e, o, s = 3.1) {
    const i = t.ctx,
      n = e * Ws,
      r = (1 - o) * lo;
    ((i.globalCompositeOperation = "destination-out"),
      (i.fillStyle = "#000"),
      i.beginPath(),
      i.arc(n, r, s, 0, 6.283),
      i.fill(),
      (i.globalCompositeOperation = "source-atop"),
      (i.strokeStyle = "rgba(22,17,12,.92)"),
      (i.lineWidth = 3),
      i.beginPath(),
      i.arc(n, r, s + 1.4, 0, 6.283),
      i.stroke(),
      (i.fillStyle = "rgba(120,95,62,.8)"));
    for (let c = 0; c < 5; c++) {
      const d = Math.random() * 6.283,
        p = s + 1 + Math.random() * 2;
      i.fillRect(n + Math.cos(d) * p, r + Math.sin(d) * p, 1, 1);
    }
    i.globalCompositeOperation = "source-over";
    const l = (s + 0.4) / Bs,
      u = n / Bs,
      h = r / Bs;
    for (let c = Math.floor(h - l); c <= Math.ceil(h + l); c++)
      for (let d = Math.floor(u - l); d <= Math.ceil(u + l); d++) {
        if (d < 0 || c < 0 || d >= t.mw || c >= t.mh) continue;
        const p = d + 0.5 - u,
          f = c + 0.5 - h;
        p * p + f * f <= l * l && (t.mask[c * t.mw + d] = 0);
      }
    ((t.tex.needsUpdate = !0), t.holes++);
  }
  splash(t, e, o) {
    const s = t.ctx,
      i = t.canvas.width,
      n = t.canvas.height,
      r = e * i,
      l = (1 - o) * n;
    ((s.strokeStyle = "rgba(70,72,74,.85)"), (s.lineCap = "round"));
    const u = (10 + Math.random() * 8) | 0;
    for (let h = 0; h < u; h++) {
      const c = Math.random() * 6.283,
        d = 4 + Math.random() * 13;
      ((s.lineWidth = 0.6 + Math.random() * 1.4),
        s.beginPath(),
        s.moveTo(r, l),
        s.lineTo(r + Math.cos(c) * d, l + Math.sin(c) * d),
        s.stroke());
    }
    ((s.fillStyle = "rgba(110,112,114,.95)"),
      s.beginPath(),
      s.arc(r, l, 3.2 + Math.random() * 1.5, 0, 6.283),
      s.fill(),
      (s.fillStyle = "rgba(55,56,58,.95)"),
      s.beginPath(),
      s.arc(r, l, 1.6, 0, 6.283),
      s.fill(),
      (t.tex.needsUpdate = !0),
      t.splashes++);
  }
  resetSurface(t) {
    ((t.ctx.globalCompositeOperation = "copy"),
      t.ctx.drawImage(t.base, 0, 0),
      (t.ctx.globalCompositeOperation = "source-over"),
      t.mask && t.mask.set(t.baseMask),
      (t.holes = 0),
      (t.splashes = 0),
      (t.score = 0),
      (t.tex.needsUpdate = !0));
  }
  hit(t, e, o, s = 1) {
    const i = this.fx,
      n = e.distance ?? 10,
      r = this._pan(e.point);
    ((t.idle = 0),
      ye.set(0, 0, 1).applyQuaternion(t.root.getWorldQuaternion(xi)));
    const l = (o || e.dir).dot(ye) < 0 ? 1 : -1,
      u = e.hasUV ? e.uv.x : 0.5,
      h = e.hasUV ? e.uv.y : 0.5;
    if (t.kind === "card") {
      this.punch(t, u, h);
      const c = ah((u - 0.5) * Da, h * Uo),
        d = h * Uo >= 58;
      return (
        (t.score += yi[c]),
        (this.score += yi[c]),
        i?.bulletImpact(e.point, e.normal, "cardboard", n, e.dir, 2, s),
        this.audio.impact("soft", n, r),
        d
          ? (t.state === 0 &&
              ((t.state = 1), (t.down = 4), (t.sign = l), (t.vel = 1.2 * l)),
            this.hud?.hint(
              `T${t.id} · CABEZA ${c}  (${t.score} pts · ${t.holes} imp.)`,
              1500,
            ))
          : (t.state === 0 && (t.vel += (c === "A" ? 0.5 : 0.3) * l * s),
            this.hud?.hint(
              `T${t.id} · ${c}  (${t.score} pts · ${t.holes} imp.)`,
              1200,
            )),
        (e.zone = (d ? "head-" : "torso-") + c),
        e.zone
      );
    }
    if (
      (this.splash(t, u, h),
      this.audio.steelRing(n, r),
      this.audio.impact("metal", n, r),
      i?.bulletImpact(e.point, e.normal, "steel", n, e.dir, 2, s),
      t.kind === "popper")
    ) {
      const c = h > 0.45;
      (t.state === 0 &&
        (c && s > 0.35
          ? ((t.state = 1), (t.down = 4.5), (t.sign = l), (t.vel = 2.2 * l))
          : (t.vel += 0.6 * l)),
        (e.zone = c ? "steel-calib" : "steel-low"));
    } else {
      const c = 0.6 + (1 - h) * 0.6;
      ((t.vel += 7.5 * s * c * l), (e.zone = "steel"));
    }
    return e.zone;
  }
  blast(t, e, o = null) {
    for (const s of this.list) {
      (s.board.getWorldPosition(ye),
        s.kind === "card"
          ? (ye.y += 0.38)
          : s.kind === "popper" && (ye.y += 0.4),
        Is.subVectors(ye, t));
      const i = Is.length();
      if (i > 8 || i < 0.001) continue;
      if (
        (Is.divideScalar(i),
        w0.copy(t),
        (w0.y += 0.25),
        o
          ? !o.losClear(w0, ye, s.mesh)
          : e && e.raycast(w0, Is, Math.max(0.05, i - 0.15)))
      ) {
        s.lastBlastBlocked = !0;
        continue;
      }
      ((s.lastBlastBlocked = !1),
        ye.set(0, 0, 1).applyQuaternion(s.root.getWorldQuaternion(xi)));
      const r = Is.dot(ye) < 0 ? 1 : -1,
        l = 1 / (1 + i * i * 0.15);
      if (((s.idle = 0), s.kind === "card")) {
        const u = Math.round(22 * l);
        for (let h = 0; h < u; h++) {
          const c = Math.random(),
            d = Math.random();
          s.solidAt(c, d) && this.punch(s, c, d, 1.6 + Math.random() * 2.2);
        }
        i < 4 && s.state === 0
          ? ((s.state = 1), (s.down = 5), (s.sign = r), (s.vel = 3 * r))
          : (s.vel += 1.5 * l * r);
      } else {
        const u = Math.round(10 * l);
        for (let h = 0; h < u; h++)
          this.splash(
            s,
            0.15 + Math.random() * 0.7,
            0.15 + Math.random() * 0.7,
          );
        s.kind === "popper"
          ? i < 5 &&
            s.state === 0 &&
            ((s.state = 1), (s.down = 5), (s.sign = r), (s.vel = 3 * r))
          : (s.vel += 14 * l * r);
      }
    }
  }
  update(t) {
    for (let e = 0; e < this.list.length; e++) {
      const o = this.list[e];
      ((o.idle += t),
        o.kind === "card" && o.holes > 0 && o.idle > 45 && this.resetSurface(o),
        o.steel && o.splashes > 0 && o.idle > 30 && this.resetSurface(o));
      let s;
      (o.hingeTop
        ? (s = -35 * Math.sin(o.angle) - 1.1 * o.vel)
        : o.state === 1
          ? ((s = ((1.5 * 9.8) / o.L) * Math.sin(o.angle) + 2.2 * o.sign),
            (o.down -= t),
            o.down <= 0 && (o.state = 2))
          : o.state === 2
            ? ((s = -26 * o.angle - 9 * o.vel),
              Math.abs(o.angle) < 0.01 &&
                Math.abs(o.vel) < 0.05 &&
                ((o.state = 0), (o.angle = 0), (o.vel = 0)))
            : (s =
                -(o.kind === "card" ? 140 : 300) * o.angle -
                (o.kind === "card" ? 7 : 25) * o.vel),
        (o.vel += s * t),
        (o.angle += o.vel * t),
        !o.hingeTop &&
          o.state === 1 &&
          Math.abs(o.angle) > 1.45 &&
          ((o.angle = 1.45 * Math.sign(o.angle)), (o.vel *= -0.25)),
        o.hingeTop && (o.angle = Math.max(-2.4, Math.min(2.4, o.angle))),
        (o.pivot.rotation.x = o.hingeTop ? o.angle : -o.angle));
    }
  }
  _pan(t) {
    const e = this.engine.camera;
    return (
      ye.set(1, 0, 0).applyQuaternion(e.quaternion),
      Is.subVectors(t, e.position).normalize(),
      Is.dot(ye)
    );
  }
}
function ih() {
  const a = new vo();
  (a.moveTo(-0.15, 0),
    a.lineTo(0.15, 0),
    a.lineTo(0.06, 0.6),
    a.lineTo(0.05, 0.66),
    a.absarc(0, 0.75, 0.1, -Math.PI / 2 + 0.52, Math.PI * 1.5 - 0.52, !1),
    a.lineTo(-0.06, 0.6),
    a.lineTo(-0.15, 0));
  const t = new B0(a, 16);
  t.computeBoundingBox();
  const e = t.boundingBox,
    o = t.attributes.position,
    s = t.attributes.uv;
  for (let i = 0; i < o.count; i++)
    s.setXY(
      i,
      (o.getX(i) - e.min.x) / (e.max.x - e.min.x),
      (o.getY(i) - e.min.y) / (e.max.y - e.min.y),
    );
  return t;
}
function rh(a, t) {
  const e = Ws,
    o = lo,
    s = Ka,
    i = (l, u) => [e / 2 + l * s, o - u * s],
    n = (l) => {
      (a.beginPath(),
        l.forEach(([u, h], c) => {
          const [d, p] = i(u, h);
          c ? a.lineTo(d, p) : a.moveTo(d, p);
        }),
        a.closePath());
    },
    r = tr(t * 7919 + 13);
  (a.clearRect(0, 0, e, o),
    a.save(),
    n(wi),
    a.clip(),
    (a.fillStyle = "#8c6b40"),
    a.fillRect(0, 0, e, o));
  for (let l = 0; l < e; l += 5)
    ((a.fillStyle = `rgba(80,55,25,${0.025 + 0.02 * Math.sin(l * 0.7)})`),
      a.fillRect(l, 0, 2, o));
  for (let l = 0; l < 2600; l++) {
    const u = r() > 0.5;
    ((a.fillStyle = u
      ? `rgba(215,190,145,${0.08 + r() * 0.12})`
      : `rgba(70,48,22,${0.06 + r() * 0.12})`),
      a.fillRect(r() * e, r() * o, 1 + r() * 3, 1));
  }
  for (let l = 0; l < 5; l++) {
    const u = r() * e,
      h = r() * o,
      c = 15 + r() * 45,
      d = a.createRadialGradient(u, h, 0, u, h, c);
    (d.addColorStop(0, "rgba(90,62,30,.16)"),
      d.addColorStop(1, "rgba(90,62,30,0)"),
      (a.fillStyle = d),
      a.fillRect(u - c, h - c, c * 2, c * 2));
  }
  ((a.strokeStyle = "rgba(20,15,10,.92)"),
    (a.lineWidth = 2.2),
    (a.lineJoin = "round"),
    n(oh),
    a.stroke(),
    n([
      [-7.5, 27],
      [7.5, 27],
      [7.5, 55],
      [-7.5, 55],
    ]),
    a.stroke(),
    n([
      [-5, 63.5],
      [5, 63.5],
      [5, 71],
      [-5, 71],
    ]),
    a.stroke(),
    a.beginPath(),
    a.moveTo(...i(-7.5, 58)),
    a.lineTo(...i(7.5, 58)),
    a.stroke(),
    (a.fillStyle = "rgba(20,15,10,.9)"),
    (a.textAlign = "center"),
    (a.textBaseline = "middle"),
    (a.font = `bold ${2.6 * s}px Arial, Helvetica, sans-serif`),
    a.fillText("A", ...i(0, 52)),
    a.fillText("C", ...i(-11.5, 47)),
    a.fillText("C", ...i(11.5, 47)),
    a.fillText("D", ...i(-19, 40)),
    a.fillText("D", ...i(19, 40)),
    a.fillText("D", ...i(0, 4.5)),
    (a.font = `bold ${2 * s}px Arial, Helvetica, sans-serif`),
    a.fillText("A", ...i(0, 69.2)),
    a.fillText("B", ...i(0, 61)),
    a.fillText("C", ...i(0, 12)),
    (a.font = `bold ${3.8 * s}px Arial, Helvetica, sans-serif`),
    (a.fillStyle = "rgba(28,22,16,.7)"),
    a.fillText(String(t), ...i(-17, 18)),
    (a.font = `${1.5 * s}px Arial, Helvetica, sans-serif`),
    a.fillText("IPSC · USPSA", ...i(8, 3)));
  for (let l = 0; l < 9; l++) {
    const u = (r() - 0.5) * 36,
      h = 10 + r() * 50,
      c = 1.6 * s,
      [d, p] = i(u, h);
    ((a.fillStyle =
      r() > 0.88
        ? "rgba(30,27,24,.8)"
        : `rgba(${146 + r() * 12},${112 + r() * 10},${70 + r() * 8},.55)`),
      a.save(),
      a.translate(d, p),
      a.rotate((r() - 0.5) * 0.6),
      a.fillRect(-c / 2, -c / 2, c, c),
      a.restore());
  }
  a.fillStyle = "rgba(140,140,140,.9)";
  for (const l of [-15, 15])
    for (const u of [4, 20, 38, 52]) {
      const [h, c] = i(l, u);
      a.fillRect(h - 4, c, 8, 1.5);
    }
  (a.restore(),
    (a.strokeStyle = "rgba(85,60,30,.9)"),
    (a.lineWidth = 2),
    n(wi),
    a.stroke());
}
const io = new P(),
  Us = new P(),
  is = new P(),
  bi = new P(),
  rs = new P(),
  Ft = new P(),
  vi = new P(),
  Mi = new P(),
  y0 = new P(),
  Ta = new P(),
  lh = {
    metal: "metal",
    metal_thin: "metal",
    steel: "metal",
    chainlink: "metal",
    glass: "metal",
    concrete: "concrete",
    asphalt: "concrete",
    brick: "brick",
    plaster: "plaster",
    wood: "wood",
    plywood: "wood",
    plastic: "wood",
    gravel: "gravel",
    dirt: "dirt",
    mud: "dirt",
    sand: "dirt",
    water: "dirt",
    soft: "soft",
    cardboard: "soft",
    cloth: "soft",
    rubber: "soft",
  },
  ch = new P(),
  ls = new P(),
  Ds = new P();
function hh(a, t, e, o) {
  const i = Math.max(3, Math.ceil((a.v.length() * t) / 0.03)),
    n = t / i;
  for (let r = 0; r < i; r++) {
    ((a.v.y -= 9.8 * n), ls.copy(a.v).multiplyScalar(n));
    const l = ls.length();
    let u = null;
    if (l > 1e-6) {
      ls.divideScalar(l);
      const h = e.raycast(a.p, ls, l + 0.04);
      if (h) {
        (Ds.copy(h.face.normal), Ds.dot(ls) > 0 && Ds.negate());
        const c = Math.max(0.2, -Ds.dot(ls));
        (a.p.addScaledVector(ls, Math.max(0, h.distance - 0.04 / c)), (u = Ds));
      } else a.p.addScaledVector(ls, l);
    }
    if ((!u && e.resolveSphere(a.p, 0.04, Ds) && (u = Ds), u)) {
      const h = a.v.dot(u);
      (h < 0 &&
        (o && -h > 1.2 && o(-h),
        a.v.addScaledVector(u, -h * 1.35),
        a.v.multiplyScalar(u.y > 0.6 ? 0.72 : 0.85),
        a.w.multiplyScalar(0.7)),
        e.resolveSphere(a.p, 0.04, ch));
    }
  }
}

export { Ft, Mi, Ta, Us, bi, hh, io, is, lh, nh, rs, sh, vi, y0 };
