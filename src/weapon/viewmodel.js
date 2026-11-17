// weapon/viewmodel.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, G as Kt, Q, V as P, Y as vt, Z as Ae, _ as Mo, a as Rt, a3 as $t, a5 as fe, ar as k0, at as Sr, au as kr, av as Ya, aw as Tr, ax as Ar, d as Tt, f as Ha, g as ht, h as Fi, i as xo, m as po, o as B, p as Ke } from "three-vendor";
import { K } from "../world/geometry-utils.js";
import { Bt, Ee, Fe, Ps, Qi, hs, pa, ro } from "../world/world.js";
import { Co, Cs, Io, Oe, Po, Rs, ei, l0, ma, ps, r0, si, to, ve, we, zo, zs } from "../player/player.js";

class oi {
  constructor(t, e, o) {
    ((this.upper = t),
      (this.lower = e),
      (this.hand = o),
      (this.la = 0),
      (this.lb = 0),
      (this.reach = 0),
      (this.twistShare = 0.5));
  }
  measure() {
    return (
      this.upper.getWorldPosition(we),
      this.lower.getWorldPosition(Oe),
      this.hand.getWorldPosition(Po),
      (this.la = we.distanceTo(Oe)),
      (this.lb = Oe.distanceTo(Po)),
      this
    );
  }
  solve(t, e, o) {
    const { upper: s, lower: i, hand: n, la: r, lb: l } = this;
    (we.setFromMatrixPosition(s.matrixWorld),
      Oe.setFromMatrixPosition(i.matrixWorld),
      Po.setFromMatrixPosition(n.matrixWorld),
      zo.subVectors(t, we));
    let u = zo.length();
    const h = (r + l) * 0.9995,
      c = Math.abs(r - l) + 1e-4;
    ((this.reach = u / (r + l)),
      (u = Math.min(h, Math.max(c, u))),
      zs.copy(zo).normalize(),
      Cs.subVectors(o, we),
      Cs.addScaledVector(zs, -Cs.dot(zs)),
      Cs.lengthSq() < 1e-10 &&
        Cs.subVectors(Oe, we).addScaledVector(
          zs,
          -Co.subVectors(Oe, we).dot(zs),
        ),
      Cs.normalize());
    const d = Math.min(1, Math.max(-1, (r * r + u * u - l * l) / (2 * r * u))),
      p = Math.sqrt(1 - d * d);
    if (
      (ei
        .copy(we)
        .addScaledVector(zs, r * d)
        .addScaledVector(Cs, r * p),
      Co.subVectors(Oe, we).normalize(),
      r0.subVectors(ei, we).normalize(),
      this._rotateWorld(s, si.setFromUnitVectors(Co, r0)),
      s.updateMatrixWorld(!0),
      Oe.setFromMatrixPosition(i.matrixWorld),
      Po.setFromMatrixPosition(n.matrixWorld),
      zo.copy(we).addScaledVector(zs, u),
      Co.subVectors(Po, Oe).normalize(),
      r0.subVectors(zo, Oe).normalize(),
      this._rotateWorld(i, si.setFromUnitVectors(Co, r0)),
      i.updateMatrixWorld(!0),
      e)
    ) {
      (ps(i, Rs), ma.copy(Rs).invert().multiply(e), to.set(0, ma.y, 0, ma.w));
      const f = Math.hypot(to.y, to.w);
      (f > 1e-6 &&
        ((to.y /= f),
        (to.w /= f),
        l0.identity().slerp(to, this.twistShare),
        i.quaternion.multiply(l0),
        i.updateMatrixWorld(!0),
        ps(i, Rs)),
        n.quaternion.copy(Rs.invert()).multiply(e),
        n.updateMatrixWorld(!0));
    }
  }
  _rotateWorld(t, e) {
    (ps(t.parent, l0),
      ps(t, Rs),
      Rs.premultiply(e),
      t.quaternion.copy(l0.invert()).multiply(Rs));
  }
}
const ne = {
    hip: { p: [-0.02, 0.05, 0.14], r: [0.035, 0, 0] },
    ads: { p: [0.075, 0.045, -0.03], r: [0.075, 0.11, -0.04] },
    sprint: { p: [-0.03, 0.04, -0.06], r: [-0.13, 0.42, 0.62] },
    crouch: { p: [0, 0, -0.01], r: [0.02, 0, -0.04] },
    wall: { p: [0.02, -0.04, 0.05], r: [0.42, 0.35, -0.3] },
    air: { p: [0, 0.02, 0], r: [0.06, 0, 0] },
    inspect: { p: [-0.01, -0.01, -0.09], r: [0.15, -0.35, 0.65] },
    reload: { p: [0.02, -0.02, -0.08], r: [0.12, 0.32, -0.85] },
    throw: { p: [0.12, -0.13, 0], r: [-0.55, -0.4, -0.55] },
  },
  Ro = { ads: 11, sprint: 7, crouch: 8, wall: 10, air: 9 },
  W = {
    total: 2.3,
    cantIn: [0, 0.32],
    cantOut: [2.02, 2.3],
    reachMag: [0.02, 0.17],
    pullOut: [0.17, 0.42],
    drop: 0.5,
    toRig: [0.42, 0.78],
    newMag: 0.74,
    fromRig: [0.82, 1.12],
    insert: [1.12, 1.25],
    seat: [1.25, 1.33],
    toBolt: [1.36, 1.7],
    boltPull: [1.78, 1.88],
    boltRelease: [1.98, 2.04],
    toGuard: [2.02, 2.3],
  },
  Pt = {
    total: 0.9,
    gunOut: [0, 0.14],
    gunBack: [0.6, 0.9],
    toRig: [0, 0.12],
    grab: 0.1,
    up: [0.12, 0.22],
    pin: [0.17, 0.25],
    windup: [0.23, 0.31],
    release: 0.38,
    swing: [0.3, 0.38],
    follow: [0.38, 0.58],
    toGuard: [0.6, 0.9],
  },
  Wc = new P(0.03, -0.125, -0.78),
  rt = new P(),
  We = new P(),
  qc = new P();
new P();
const Oo = new P(),
  Os = new Q(),
  Vs = new Q(),
  ai = new Q(),
  $c = new Ae(0, 0, 0, "YXZ"),
  qt = new B(),
  Ls = new B(),
  os = new B(),
  ni = new B(),
  ii = new P(1, 1, 1),
  c0 = new P(),
  st = new P(),
  dt = new Q(),
  zt = new P(),
  Lt = new Q(),
  ga = new P(),
  ri = new P(),
  li = new P(),
  Gc = new P(1, 0, 0);
class h0 {
  constructor() {
    ((this.p = new P()), (this.q = new Q()));
  }
  copy(t) {
    return (this.p.copy(t.p), this.q.copy(t.q), this);
  }
}
const u0 = (a, t, e, o = new Q()) => o.setFromEuler($c.set(a, t, e, "YXZ"));
class Nc {
  constructor(t, e) {
    ((this.engine = t),
      (this.assets = e),
      (this.root = new Kt()),
      (this.body = new Kt()),
      (this.aim = new Kt()),
      (this.kick = new Kt()),
      (this.gunOff = new Kt()),
      this.root.add(this.body, this.aim),
      this.aim.add(this.kick),
      this.kick.add(this.gunOff),
      t.camera.add(this.root),
      (this.recoilPos = new Io(24, 0.5)),
      (this.recoilRot = new Io(20, 0.42)),
      (this.lagPos = new Io(13, 0.45)),
      (this.lagRot = new Io(11, 0.5)),
      (this.sway = new Rt()),
      (this.swayV = new Rt()),
      (this.w = { ads: 0, sprint: 0, crouch: 0, wall: 0, air: 0, inspect: 0 }),
      (this.ads = 0),
      (this.sprint = 0),
      (this.lower = 0),
      (this.reloadT = -1),
      (this.throwT = -1),
      (this.inspectT = -1),
      (this.throwRelease = Pt.release),
      (this.reloadTotal = W.total),
      (this.muzzleLocal = new P()),
      (this.ejectLocal = new P()),
      (this.muzzleDirLocal = new P(0, 0, -1)),
      (this.envIntensity = 1),
      (this.time = 0),
      (this.poses = ne),
      (this.curlL = 1),
      (this.curlR = 1),
      (this.wallDist = 9),
      (this._wasGround = !0),
      (this._prevVy = 0),
      (this._iKey = !1),
      (this._prevHand = new P()),
      (this.handVel = new P()),
      (this.magState = 0),
      (this.boltTravel = 0),
      (this.nadePos = new P()),
      (this._acc = new Float64Array(6)));
  }
  async load() {
    const t = await Sr().loadAsync(k0 + "weapons/ak.glb"),
      e = t.scene;
    if (
      (e.getObjectByName("Cube")?.removeFromParent(),
      e.traverse((L) => {
        if (!L.isMesh) return;
        ((L.frustumCulled = !1), (L.castShadow = !1), (L.receiveShadow = !0));
        const D = L.material;
        let U;
        switch (D.name) {
          case "ASHMETAL.001":
            U = new Tt({
              name: "ak_receiver",
              color: 2829358,
              metalness: 0.85,
              roughness: 0.42,
              roughnessMap: D.metalnessMap || null,
            });
            break;
          case "METAL.002":
            U = new Tt({
              name: "ak_steel",
              color: 1908256,
              metalness: 0.9,
              roughness: 0.35,
              roughnessMap: D.metalnessMap || null,
            });
            break;
          case "coloredbody":
            U = new Tt({
              name: "ak_wood",
              color: 5974550,
              metalness: 0,
              roughness: 0.5,
              roughnessMap: D.metalnessMap || null,
            });
            break;
          case "cloth":
            U = new Tt({
              name: "sleeve",
              color: 2435114,
              metalness: 0,
              roughness: 1,
            });
            break;
          case "CURVATURE":
            U = new Tt({
              name: "glove",
              color: 1710619,
              metalness: 0,
              roughness: 0.68,
            });
            break;
          default:
            U = D;
        }
        if (
          this.assets.manifest?.textures.fabric &&
          (U.name === "sleeve" || U.name === "glove")
        ) {
          const Y = this.assets.manifest.textures.fabric;
          ((U.normalMap = this.assets.texture(Y.nor)),
            (U.normalScale = new Rt(0.6, 0.6)),
            (U.roughnessMap = this.assets.texture(Y.arm)));
        }
        L.material = U;
      }),
      t.animations[0])
    ) {
      const L = new kr(e);
      (L.clipAction(t.animations[0]).play(), L.update(0.01));
    }
    e.updateMatrixWorld(!0);
    const o = [];
    e.traverse((L) => {
      L.isSkinnedMesh && o.push(L);
    });
    const s = (L) => /^arm/.test(L.name) || /^arm/.test(L.parent?.name || ""),
      i = o.filter((L) => !s(L)),
      n = new P();
    let r = -1 / 0,
      l = 1 / 0;
    const u = new P();
    for (const L of i) {
      const D = L.geometry.attributes.position;
      for (let U = 0; U < D.count; U += 3)
        (L.getVertexPosition(U, n),
          n.applyMatrix4(L.matrixWorld),
          n.z > r && ((r = n.z), u.copy(n)),
          n.z < l && (l = n.z));
    }
    let h = 0,
      c = 0,
      d = 0;
    for (const L of i) {
      const D = L.geometry.attributes.position;
      for (let U = 0; U < D.count; U += 2)
        (L.getVertexPosition(U, n),
          n.applyMatrix4(L.matrixWorld),
          n.z > r - 0.35 && ((h += n.x), (c += n.y), d++));
    }
    (d && ((u.x = h / d), (u.y = c / d)), (this.gunLength = r - l));
    const p = 0.88 / this.gunLength,
      f = new Kt();
    (f.add(e), (e.rotation.y = Math.PI), e.scale.setScalar(p));
    const g = u.clone().multiplyScalar(p);
    (g.set(-g.x, g.y, -g.z),
      (this.muzzleTarget = Wc.clone()),
      e.position.copy(this.muzzleTarget).sub(g),
      this.body.add(f),
      (this.model = e),
      (this.holder = f));
    const m = (L) =>
      e.getObjectByName(L) || e.getObjectByName(L.replace(/\./g, ""));
    ((this.armature = m("Armature")),
      (this.akBone = m("akbody")),
      (this.magBone = m("magholder")),
      (this.boltBone = m("boltholder")),
      (this.magMesh = m("AKMAG")));
    const w = { up: m("upperarm.L"), lo: m("lowerarm.L"), hand: m("holder.L") },
      y = { up: m("upperarm.R"), lo: m("lowerarm.R"), hand: m("holder.R") };
    ((this.armBones = [w.up, w.lo, w.hand, y.up, y.lo, y.hand]),
      (this.armRest = this.armBones.map((L) => L.quaternion.clone())),
      (this.armRestP = this.armBones.map((L) => L.position.clone())));
    const x = (L) => {
      const D = [];
      return (
        L.children.forEach((U) =>
          U.traverse((Y) => {
            Y !== U && Y.isBone && D.push({ b: Y, rest: Y.quaternion.clone() });
          }),
        ),
        D
      );
    };
    ((this.fingersL = x(w.hand)),
      (this.fingersR = x(y.hand)),
      (this.handL = w.hand),
      (this.handR = y.hand),
      (this.fingerTipsL = [
        m("Bone.010"),
        m("Bone.014"),
        m("Bone.006"),
        m("Bone.022"),
      ].filter(Boolean)),
      this.root.updateMatrixWorld(!0));
    const b = this.gunOff.matrixWorld.clone().invert(),
      v = (L) => new B().multiplyMatrices(b, L.matrixWorld),
      M = (L) => {
        const D = new h0();
        return (v(L).decompose(D.p, D.q, c0), D);
      };
    ((this.HG_R = M(y.hand)),
      (this.HG_L = M(w.hand)),
      (this.PIVOT = this.HG_R.p.clone().add(new P(0, 0.03, -0.05))),
      this.kick.position.copy(this.PIVOT),
      this.gunOff.position.copy(this.PIVOT).negate(),
      this.root.updateMatrixWorld(!0));
    const _ = this.gunOff.matrixWorld.clone().invert();
    ((this.AKREL = new B().multiplyMatrices(_, this.akBone.matrixWorld)),
      (this.BOLTREL = new B().multiplyMatrices(_, this.boltBone.matrixWorld)),
      (this.MAGREL = new B().multiplyMatrices(_, this.magBone.matrixWorld)));
    const S = (L, D) => {
        const U = new po();
        for (const Y of L) {
          const et = Y.geometry.attributes.position;
          for (let G = 0; G < et.count; G++)
            (Y.getVertexPosition(G, n),
              n.applyMatrix4(Y.matrixWorld).applyMatrix4(_),
              (!D || D(n)) && U.expandByPoint(n));
        }
        return U;
      },
      T = [];
    this.magMesh?.traverse((L) => L.isSkinnedMesh && T.push(L));
    const A = [];
    m("AKBOLT")?.traverse((L) => L.isSkinnedMesh && A.push(L));
    const z = i.filter((L) => !T.includes(L) && !A.includes(L)),
      R = S(T),
      k = R.max.y,
      C = S(T, (L) => L.y > k - 0.03);
    ((this.magBox = R),
      (this.M0 = new P((C.min.x + C.max.x) / 2, k, (C.min.z + C.max.z) / 2)),
      (this.LUG = new P(this.M0.x, k, C.min.z)));
    const O = S(A);
    this.boltBox = O;
    let V = new P(),
      F = -1 / 0;
    for (const L of A) {
      const D = L.geometry.attributes.position;
      for (let U = 0; U < D.count; U++)
        (L.getVertexPosition(U, n),
          n.applyMatrix4(L.matrixWorld).applyMatrix4(_),
          n.x > F && ((F = n.x), V.copy(n)));
    }
    this.BOLT_HANDLE = V;
    const q = this.HG_L.p.z,
      I = S(z, (L) => Math.abs(L.z - q) < 0.025);
    ((this.GUARD_C = I.getCenter(new P())),
      (this.H_MAG = new h0()),
      this.H_MAG.p.set(-0.05, -0.06, 0),
      this.H_MAG.q.copy(u0(0.25, 0, -1.35)).multiply(this.HG_L.q),
      (this.H_MAG_INV = new B()
        .compose(this.H_MAG.p, this.H_MAG.q, ii)
        .invert()),
      (this.MAGREL_F = new B()
        .makeTranslation(-this.M0.x, -this.M0.y, -this.M0.z)
        .multiply(this.MAGREL)),
      (this.H_BOLT = new h0()),
      this.H_BOLT.p
        .copy(this.BOLT_HANDLE)
        .add(rt.subVectors(this.HG_L.p, this.GUARD_C))
        .add(new P(-0.005, -0.005, 0)),
      this.H_BOLT.q.copy(u0(0, 0.25, 0.15)).multiply(this.HG_L.q));
    const H = (L, D, U, Y, et, G) => {
      const j = new h0();
      return (j.p.set(L, D, U), u0(Y, et, G, j.q).multiply(this.HG_L.q), j);
    };
    ((this.RIG = H(-0.06, -0.5, -0.12, -1, 0.2, 0.2)),
      (this.N_RIG = H(-0.2, -0.5, -0.1, -1, 0.3, 0.3)),
      (this.N_SHOW = H(-0.1, -0.24, -0.34, 0.15, 0.35, 0.2)),
      (this.N_PIN = H(-0.07, -0.22, -0.33, 0.1, 0.1, 0.85)),
      (this.N_WIND = H(-0.36, 0.03, -0.14, 1.2, 0.6, 0.4)),
      (this.N_REL = H(-0.04, 0.12, -0.6, -0.2, 0.15, 0)),
      (this.N_FOL = H(0.04, -0.2, -0.48, -0.7, -0.1, 0)),
      (this.ikL = new oi(w.up, w.lo, w.hand).measure()),
      (this.ikR = new oi(y.up, y.lo, y.hand).measure()),
      (this.ikR.twistShare = 0.35),
      (this.shoulderL = w.up),
      (this.shoulderR = y.up),
      this.muzzleLocal.copy(this.muzzleTarget).sub(this.PIVOT),
      this.ejectLocal
        .set(O.max.x - 0.01, O.max.y - 0.01, (O.min.z + O.max.z) / 2 - 0.02)
        .sub(this.PIVOT));
    {
      const L = ne.hip,
        D = u0(L.r[0], L.r[1], L.r[2]),
        U = rt
          .copy(this.muzzleLocal)
          .applyQuaternion(D)
          .add(this.PIVOT)
          .add(We.fromArray(L.p));
      this.muzzleDirLocal
        .set(0, 0, -15)
        .sub(U)
        .normalize()
        .applyQuaternion(D.invert());
    }
    return (
      this.buildMuzzleFlash(),
      this.buildFlashlight(),
      this.buildProps(T),
      (this.materials = []),
      e.traverse((L) => L.isMesh && this.materials.push(L.material)),
      this.update(1 / 60, null, 0, 0, 1),
      this
    );
  }
  buildMuzzleFlash() {
    const t = document.createElement("canvas");
    t.width = t.height = 128;
    const e = t.getContext("2d"),
      o = e.createRadialGradient(64, 64, 0, 64, 64, 64);
    (o.addColorStop(0, "rgba(255,250,230,1)"),
      o.addColorStop(0.2, "rgba(255,200,110,.9)"),
      o.addColorStop(0.5, "rgba(255,120,30,.35)"),
      o.addColorStop(1, "rgba(255,80,0,0)"),
      (e.fillStyle = o),
      e.fillRect(0, 0, 128, 128),
      (e.globalCompositeOperation = "lighter"),
      (e.strokeStyle = "rgba(255,220,150,.8)"),
      (e.lineWidth = 6));
    for (let u = 0; u < 5; u++) {
      const h = (u / 5) * Math.PI * 2;
      (e.beginPath(),
        e.moveTo(64, 64),
        e.lineTo(64 + Math.cos(h) * 62, 64 + Math.sin(h) * 62),
        e.stroke());
    }
    const s = new fe(t),
      i = new Fi({
        map: s,
        transparent: !0,
        blending: Ya,
        depthWrite: !1,
        color: new xo(4, 3.2, 2.2),
        side: $t,
        toneMapped: !1,
      });
    this.flash = new Kt();
    const n = new ht(new Ke(0.16, 0.16), i),
      r = new ht(new Ke(0.34, 0.11), i);
    ((r.rotation.y = Math.PI / 2), (r.position.z = -0.12));
    const l = r.clone();
    ((l.rotation.z = Math.PI / 2),
      this.flash.add(n, r, l),
      this.flash.position.copy(this.muzzleTarget),
      (this.flash.position.z -= 0.02),
      (this.flash.visible = !1),
      this.gunOff.add(this.flash),
      (this.flashLight = new Ha(16756848, 0, 9, 2)),
      this.flashLight.position.copy(this.muzzleTarget),
      this.gunOff.add(this.flashLight));
  }
  buildFlashlight() {
    ((this.torch = new Tr(16773596, 0, 32, 0.42, 0.45, 1.6)),
      this.torch.position.set(-0.05, -0.08, -0.55),
      this.torch.target.position.set(-0.05, -0.08, -6),
      this.gunOff.add(this.torch, this.torch.target),
      (this.torchOn = !1));
  }
  toggleTorch() {
    this.torchOn = !this.torchOn;
  }
  buildProps(t) {
    const e = this.engine.scene;
    this.drops = [];
    const o = new Q();
    this.magBone.matrixWorld.decompose(rt, o, c0);
    const s = ps(this.gunOff, new Q());
    this.magAxisLocal = new P(0, -1, 0)
      .applyQuaternion(s)
      .applyQuaternion(o.invert())
      .normalize();
    for (let c = 0; c < 3; c++) {
      const d = new Kt();
      d.position.set(0, -1e3, 0);
      for (const p of t) {
        const f = p.skeleton.bones.indexOf(this.magBone),
          g = new ht(p.geometry, p.material);
        ((g.matrixAutoUpdate = !1),
          g.matrix.multiplyMatrices(p.skeleton.boneInverses[f], p.bindMatrix),
          (g.castShadow = !0),
          (g.receiveShadow = !0),
          d.add(g));
      }
      (e.add(d),
        this.drops.push({
          obj: d,
          v: new P(),
          w: new P(),
          floor: 0,
          active: !1,
          rest: !1,
        }));
    }
    this.dropIdx = 0;
    const i = new Mo(0.032, 14, 10);
    i.scale(1, 1.2, 1);
    const n = new vt(0.012, 0.014, 0.022, 10);
    n.translate(0, 0.044, 0);
    const r = new Z(0.01, 0.06, 0.004);
    r.translate(0.02, 0.02, 0);
    const l = new Ar(0.012, 0.0022, 6, 16);
    l.translate(-0.016, 0.05, 0);
    const u = new Tt({ color: 4870710, roughness: 0.6, metalness: 0.4 }),
      h = new Tt({ color: 7829367, roughness: 0.4, metalness: 0.9 });
    ((this.nade = new Kt()),
      (this.nadeRing = new ht(l, h)),
      this.nade.add(new ht(i, u), new ht(n, h), new ht(r, h), this.nadeRing),
      this.nade.traverse((c) => {
        c.isMesh && ((c.frustumCulled = !1), (c.receiveShadow = !0));
      }),
      (this.nade.visible = !1),
      e.add(this.nade));
  }
  fire() {
    const t = 1 - this.ads * 0.3;
    (this.recoilPos.impulse(
      (Math.random() - 0.5) * 0.18 * t,
      (0.22 + Math.random() * 0.1) * t,
      (1.5 + Math.random() * 0.35) * t,
    ),
      this.recoilRot.impulse(
        (2.4 + Math.random() * 0.9) * t,
        (Math.random() - 0.5) * 0.9 * t,
        (Math.random() - 0.5) * 1.6 * t,
      ),
      (this.flashT = 0.045),
      (this.flash.visible = !0),
      (this.flash.rotation.z = Math.random() * Math.PI),
      this.flash.scale.setScalar(0.7 + Math.random() * 0.6),
      (this.boltKick = 1));
  }
  startReload() {
    this.reloadT < 0 &&
      this.throwT < 0 &&
      ((this.reloadT = 0),
      (this.inspectT = -1),
      (this._dropped = !1),
      (this._newMag = !1));
  }
  get reloading() {
    return this.reloadT >= 0;
  }
  startThrow() {
    this.throwT < 0 &&
      this.reloadT < 0 &&
      ((this.throwT = 0), (this.inspectT = -1), (this._released = !1));
  }
  startInspect() {
    this.inspectT < 0 &&
      this.reloadT < 0 &&
      this.throwT < 0 &&
      (this.inspectT = 0);
  }
  getMuzzle(t, e) {
    return (
      this.kick.updateWorldMatrix(!0, !1),
      t.copy(this.muzzleLocal).applyMatrix4(this.kick.matrixWorld),
      e.copy(this.muzzleDirLocal).transformDirection(this.kick.matrixWorld),
      t
    );
  }
  getThrowPoint(t) {
    return this.throwT < 0 ? null : t.copy(this.nadePos);
  }
  getEject(t) {
    return (
      this.kick.updateWorldMatrix(!0, !1),
      t.copy(this.ejectLocal).applyMatrix4(this.kick.matrixWorld)
    );
  }
  update(t, e, o, s, i) {
    if (!this.model) return;
    ((t = Math.min(t, 0.05)), (this.time += t));
    const n = e || Hc,
      r = this.w,
      l = n.input?.down?.("KeyI") || !1;
    (l && !this._iKey && this.startInspect(), (this._iKey = l));
    const u = this.reloadT >= 0 || this.throwT >= 0;
    ((r.ads = Fe(r.ads, n.ads && !u && !n.sprint ? 1 : 0, Ro.ads, t)),
      (r.sprint = Fe(r.sprint, n.sprint && !u ? 1 : 0, Ro.sprint, t)),
      (r.crouch = Fe(r.crouch, n.crouch || 0, Ro.crouch, t)),
      (r.air = Fe(r.air, n.onGround === !1 ? 1 : 0, Ro.air, t)),
      (this.ads = r.ads),
      (this.sprint = r.sprint));
    let h = 0;
    const c = n.world?.collider;
    if (((this._col = c), c)) {
      const G = this.engine.camera;
      (ri.set(
        -Math.sin(n.yaw) * Math.cos(n.pitch),
        Math.sin(n.pitch),
        -Math.cos(n.yaw) * Math.cos(n.pitch),
      ),
        li.copy(G.position));
      const j = c.raycast(li, ri, 1.2);
      ((this.wallDist = j ? j.distance : 9),
        (h = Qi((1.02 - this.wallDist) / 0.5)));
    }
    r.wall = Fe(r.wall, h, Ro.wall, t);
    let d = 0;
    (this.inspectT >= 0 &&
      ((this.inspectT += t),
      (n.ads || n.sprint) && (this.inspectT = Math.max(this.inspectT, 2.7)),
      (d = hs(0, 0.45, this.inspectT) * (1 - hs(2.6, 3.1, this.inspectT))),
      this.inspectT > 3.1 && (this.inspectT = -1)),
      (r.inspect = d));
    let p = (n.yaw || 0) - (n.camYaw || 0);
    p = Math.atan2(Math.sin(p), Math.cos(p));
    const f = (n.pitch || 0) - (n.camPitch || 0);
    (this.aim.rotation.set(f, p, 0, "YXZ"),
      (this.swayV.x += (-o * 35e-5 - this.sway.x) * Math.min(1, t * 14)),
      (this.swayV.y += (s * 35e-5 - this.sway.y) * Math.min(1, t * 14)),
      (this.sway.x += this.swayV.x * t * 18),
      (this.sway.y += this.swayV.y * t * 18),
      this.swayV.multiplyScalar(Math.exp(-t * 10)),
      this.sway.clampScalar(-0.06, 0.06));
    const g = n.onGround !== !1;
    if (g && !this._wasGround && this._prevVy < -2.5) {
      const G = Math.min(1.6, -this._prevVy * 0.22);
      (this.lagPos.impulse(0, -0.55 * G, 0.12 * G),
        this.lagRot.impulse(-1.6 * G, 0, (Math.random() - 0.5) * 0.8 * G));
    }
    (!g &&
      this._wasGround &&
      (n.vel?.y || 0) > 2 &&
      (this.lagPos.impulse(0, -0.35, 0), this.lagRot.impulse(-0.9, 0, 0)),
      (this._wasGround = g),
      (this._prevVy = n.vel?.y || 0),
      this.recoilPos.update(t),
      this.recoilRot.update(t),
      this.lagPos.update(t),
      this.lagRot.update(t));
    const m = this._acc;
    m.fill(0);
    const w =
        this.reloadT >= 0
          ? Ee(
              this.reloadT,
              W.cantIn[0],
              W.cantIn[1],
              W.cantOut[0],
              W.cantOut[1],
            )
          : 0,
      y =
        this.throwT >= 0
          ? Ee(
              this.throwT,
              Pt.gunOut[0],
              Pt.gunOut[1],
              Pt.gunBack[0],
              Pt.gunBack[1],
            )
          : 0,
      x = Math.max(w, y),
      b = r.wall * (1 - x) * (1 - r.sprint);
    (this._addPose(ne.hip, 1),
      this._addPose(ne.ads, r.ads * (1 - b)),
      this._addPose(ne.sprint, r.sprint * (1 - x)),
      this._addPose(ne.crouch, r.crouch),
      this._addPose(ne.air, r.air * (1 - x)),
      this._addPose(ne.wall, b),
      this._addPose(ne.inspect, r.inspect),
      this._addPose(ne.reload, w),
      this._addPose(ne.throw, y),
      (this.lower = y));
    let v = m[0],
      M = m[1],
      _ = m[2],
      S = m[3],
      T = m[4],
      A = m[5];
    if (r.inspect > 0) {
      const G = hs(1.2, 1.9, this.inspectT);
      ((T += 0.6 * G * r.inspect), (A -= 1.05 * G * r.inspect));
    }
    const z = n.bobPhase || 0,
      R = n.bobAmp || 0,
      k = R * (1 - r.ads * 0.65) * (1 - r.sprint);
    ((v += Math.sin(z) * 0.011 * k),
      (M += (Math.abs(Math.cos(z)) - 0.5) * 0.012 * k),
      (A += Math.sin(z) * 0.03 * k),
      (T += Math.sin(z) * 0.012 * k),
      (S += (Math.abs(Math.sin(z)) - 0.6) * 0.02 * k));
    const C = R * r.sprint;
    ((v += Math.sin(z) * 0.028 * C),
      (M += Math.cos(z * 2) * 0.018 * C),
      (_ += Math.sin(z) * 0.012 * C),
      (A += Math.sin(z) * 0.1 * C),
      (S += Math.cos(z * 2) * 0.045 * C),
      (T += Math.sin(z) * 0.06 * C));
    const O = n.fatigue || 0,
      V = n.breathPhase ?? this.time * 1.6,
      F = (0.0025 + 0.006 * O) * (1 - r.ads * 0.5);
    if (
      ((M += Math.sin(V) * F),
      (S += Math.sin(V - 0.6) * F * 1.6),
      (v += ve(this.time * 0.7, 3) * 0.0015),
      (T += ve(this.time * 0.6, 7) * 0.004),
      (S += ve(this.time * 0.5, 11) * 0.003),
      n.vel)
    ) {
      const G = Math.cos(n.camYaw || 0),
        j = Math.sin(n.camYaw || 0),
        wt = n.vel.x * G - n.vel.z * j;
      ((A += -wt * 0.018), (v += -wt * 0.004));
    }
    if (
      ((v += this.sway.x * 0.45 + this.recoilPos.x.x * 1 + this.lagPos.x.x),
      (M += this.sway.y * 0.45 + this.recoilPos.x.y + this.lagPos.x.y),
      (_ += this.recoilPos.x.z + this.lagPos.x.z),
      (S += this.sway.y * 1.1 + this.recoilRot.x.x + this.lagRot.x.x),
      (T += this.sway.x * 1.4 + this.recoilRot.x.y + this.lagRot.x.y),
      (A +=
        this.sway.x * 1.8 +
        this.recoilRot.x.z +
        this.lagRot.x.z -
        (n.lean || 0) * 0.12),
      this.reloadT >= 0)
    ) {
      const G = this.reloadT,
        j = Ee(G, W.seat[0], W.seat[0] + 0.04, W.seat[1], W.seat[1] + 0.12);
      ((M += j * 0.012), (S += j * 0.05));
      const wt = Ee(
        G,
        W.boltPull[0],
        W.boltPull[1],
        W.boltRelease[0],
        W.boltRelease[1] + 0.06,
      );
      ((A -= wt * 0.06), (_ += wt * 0.01));
      const me = Ee(
        G,
        W.pullOut[0],
        W.pullOut[0] + 0.06,
        W.pullOut[0] + 0.1,
        W.pullOut[1],
      );
      ((M -= me * 0.01), (A += me * 0.04));
    }
    (this.kick.position.set(
      this.PIVOT.x + v,
      this.PIVOT.y + M,
      this.PIVOT.z + _,
    ),
      this.kick.rotation.set(S, T, A, "YXZ"));
    let q = 0;
    if (this.throwT >= 0) {
      const G = this.throwT;
      q =
        0.22 * hs(Pt.windup[0], Pt.windup[1], G) -
        0.42 * hs(Pt.swing[0], Pt.swing[1], G) +
        0.2 * hs(Pt.follow[1], Pt.total, G);
    }
    const I = ne.hip.p;
    (this.body.position.set(
      I[0] + (v - I[0]) * 0.35,
      I[1] + (M - I[1]) * 0.3 + Math.sin(V) * F * 0.6,
      I[2] + (_ - I[2]) * 0.3 + r.sprint * 0.02,
    ),
      this.body.rotation.set(
        0,
        q + Math.sin(z) * 0.05 * C,
        Math.sin(z) * 0.04 * C,
        "YXZ",
      ));
    const H = this.armBones,
      L = this.armRest,
      D = this.armRestP;
    for (let G = 0; G < H.length; G++)
      (H[G].quaternion.copy(L[G]), H[G].position.copy(D[G]));
    (this.root.updateMatrixWorld(!0),
      ni.copy(this.armature.matrixWorld).invert());
    const U = this.gunOff.matrixWorld;
    (ps(this.gunOff, Vs),
      ps(this.root, ai),
      this._setBoneWorld(this.akBone, qt.multiplyMatrices(U, this.AKREL)),
      (this.boltKick = Math.max(0, (this.boltKick || 0) - t * 22)));
    let Y =
      this.boltKick > 0
        ? Math.sin(Math.min(1, 1 - this.boltKick) * Math.PI) * 0.07
        : 0;
    (this.reloadT >= 0 &&
      (Y = Math.max(
        Y,
        0.078 *
          (pa(Bt(this.reloadT, W.boltPull[0], W.boltPull[1])) *
            (1 - Bt(this.reloadT, W.boltRelease[0], W.boltRelease[1]))),
      )),
      (this.boltTravel = Y),
      Ls.makeTranslation(0, 0, Y),
      this._setBoneWorld(
        this.boltBone,
        qt.multiplyMatrices(U, Ls).multiply(this.BOLTREL),
      ),
      zt.copy(this.HG_R.p).applyMatrix4(U),
      Lt.copy(Vs).multiply(this.HG_R.q),
      this._rootPoint(Oo, 0.75, -0.75, 0.25),
      this.ikR.solve(zt, Lt, Oo));
    const et = this._leftHandTarget(t, U);
    if ((this._rootPoint(Oo, -0.75, -0.6, 0.15), this.throwT >= 0)) {
      const G = Ee(
        this.throwT,
        Pt.up[1],
        Pt.windup[1],
        Pt.follow[0],
        Pt.follow[1],
      );
      Oo.lerp(this._rootPoint(qc, -0.9, 0.2, 0.1), G);
    }
    (this.ikL.solve(st, dt, Oo),
      this._updateMag(et, U),
      this._curl(this.fingersL, this.curlL),
      this._curl(this.fingersR, this.curlR),
      this.handL.updateMatrixWorld(!0),
      this.handL.getWorldPosition(ga),
      t > 0 && this.handVel.subVectors(ga, this._prevHand).divideScalar(t),
      this._prevHand.copy(ga),
      this._updateNade(),
      this._updateDrops(t),
      this.flashT > 0 &&
        ((this.flashT -= t),
        (this.flashLight.intensity = 30 * Math.max(0, this.flashT / 0.045)),
        this.flashT <= 0 &&
          ((this.flash.visible = !1), (this.flashLight.intensity = 0))),
      (this.torch.intensity +=
        ((this.torchOn ? 14 : 0) - this.torch.intensity) * Math.min(1, t * 20)),
      (this.envIntensity += (i - this.envIntensity) * Math.min(1, t * 3)));
    for (const G of this.materials) G.envMapIntensity = this.envIntensity;
    (this.reloadT >= 0 &&
      ((this.reloadT += t), this.reloadT > W.total && (this.reloadT = -1)),
      this.throwT >= 0 &&
        ((this.throwT += t), this.throwT > Pt.total && (this.throwT = -1)));
  }
  _addPose(t, e) {
    if (e < 1e-4) return;
    const o = this._acc;
    for (let s = 0; s < 3; s++)
      ((o[s] += t.p[s] * e), (o[s + 3] += t.r[s] * e));
  }
  _guard(t) {
    (st.copy(this.HG_L.p).applyMatrix4(t), dt.copy(Vs).multiply(this.HG_L.q));
  }
  _blendTo(t, e) {
    (this._rootPose(t, zt, Lt), st.lerp(zt, e), dt.slerp(Lt, e));
  }
  _leftHandTarget(t, e) {
    let o = 1,
      s = 0;
    if ((this._guard(e), this.reloadT >= 0)) {
      const i = this.reloadT;
      if (i < W.pullOut[0]) {
        const n = Ps(Bt(i, W.reachMag[0], W.reachMag[1]));
        (this._magFrame(qt, e, 0, 0, 0),
          this._handOnMag(qt, zt, Lt),
          this._lerpPose(zt, Lt, n),
          (o = 1 - 0.75 * Math.sin(n * Math.PI)));
      } else if (i < W.pullOut[1]) {
        const n = ro(Bt(i, W.pullOut[0], W.pullOut[1])),
          r = Math.min(1, n * 2.2);
        (this._magFrame(qt, e, r * 0.42, -n * 0.13, -n * 0.05, -n * 0.03),
          this._handOnMag(qt, st, dt));
      } else if (i < W.fromRig[0]) {
        (this._magFrame(qt, e, 0.42, -0.13, -0.05, -0.03),
          this._handOnMag(qt, zt, Lt));
        const n = ro(Bt(i, W.toRig[0], W.toRig[1]));
        (this._rootPose(this.RIG, st, dt),
          st.lerpVectors(zt, st, n),
          dt.slerpQuaternions(Lt, dt, n));
        const r = Ee(i, W.drop - 0.06, W.drop, W.drop + 0.02, W.drop + 0.12);
        (this._rootPoint(rt, -0.06 * r, 0.02 * r, 0),
          rt.sub(this._rootPoint(We, 0, 0, 0)),
          st.add(rt),
          (s = i < W.drop ? 1 : 2),
          i >= W.drop &&
            !this._dropped &&
            ((this._dropped = !0), this._spawnDrop()),
          (o = i < W.drop - 0.04 ? 1 : i < W.newMag ? 0.25 : 1),
          i >= W.newMag && ((s = 1), (this._newMag = !0)));
      } else if (i < W.insert[0]) {
        const n = Ps(Bt(i, W.fromRig[0], W.fromRig[1]));
        (this._rootPose(this.RIG, zt, Lt),
          this._magFrame(qt, e, 0.38, -0.06, -0.03, -0.015),
          this._handOnMag(qt, st, dt),
          st.lerpVectors(zt, st, n),
          dt.slerpQuaternions(Lt, dt, n),
          (s = 1));
      } else if (i < W.seat[1]) {
        const n = ro(Bt(i, W.insert[0], W.insert[1])),
          r = pa(Bt(i, W.seat[0], W.seat[1]));
        (this._magFrame(
          qt,
          e,
          0.38 * (1 - n * 0.3) * (1 - r),
          -0.06 * (1 - n),
          -0.03 * (1 - n),
          -0.015 * (1 - n),
        ),
          this._handOnMag(qt, st, dt));
      } else if (i < W.toGuard[0]) {
        (this._magFrame(qt, e, 0, 0, 0),
          this._handOnMag(qt, zt, Lt),
          st.copy(this.H_BOLT.p),
          (st.z += this.boltTravel),
          st.applyMatrix4(e),
          dt.copy(Vs).multiply(this.H_BOLT.q));
        const n = Ps(Bt(i, W.toBolt[0], W.toBolt[1]));
        if (
          (zt.lerp(st, n),
          Lt.slerp(dt, n),
          this._rootPoint(rt, 0, -0.06 * Math.sin(n * Math.PI), 0),
          rt.sub(this._rootPoint(We, 0, 0, 0)),
          zt.add(rt),
          st.copy(zt),
          dt.copy(Lt),
          (o =
            i < W.toBolt[1] - 0.05
              ? 1 - 0.7 * Math.sin(n * Math.PI)
              : i > W.boltRelease[0]
                ? 0.35
                : 1),
          i > W.boltRelease[0])
        ) {
          const r = Ee(
            i,
            W.boltRelease[0],
            W.boltRelease[1],
            W.boltRelease[1],
            W.toGuard[0] + 0.05,
          );
          st.addScaledVector(rt.set(0, 0, 1).applyQuaternion(Vs), 0.03 * r);
        }
      } else {
        const n = Ps(Bt(i, W.toGuard[0], W.toGuard[1]));
        (zt.copy(this.H_BOLT.p).applyMatrix4(e),
          Lt.copy(Vs).multiply(this.H_BOLT.q),
          this._guard(e),
          zt.lerp(st, n),
          Lt.slerp(dt, n),
          st.copy(zt),
          dt.copy(Lt),
          (o = 0.35 + 0.65 * n));
      }
    } else if (this.throwT >= 0) {
      const i = this.throwT,
        n = Pt;
      if (i < n.toRig[1])
        (this._blendTo(this.N_RIG, Ps(Bt(i, n.toRig[0], n.toRig[1]))),
          (o = 0.5));
      else if (i < n.windup[0])
        (this._rootPose(this.N_RIG, st, dt),
          this._blendTo(this.N_SHOW, Ps(Bt(i, n.up[0], n.up[1]))),
          this._blendTo(
            this.N_PIN,
            Ee(i, n.pin[0], n.pin[0] + 0.05, n.pin[1], n.windup[0] + 0.02),
          ),
          (o = 0.95));
      else if (i < n.swing[0])
        (this._rootPose(this.N_SHOW, st, dt),
          this._blendTo(this.N_WIND, ro(Bt(i, n.windup[0], n.windup[1]))),
          (o = 0.95));
      else if (i < n.follow[0])
        (this._rootPose(this.N_WIND, st, dt),
          this._blendTo(this.N_REL, ro(Bt(i, n.swing[0], n.swing[1]))),
          (o = i < n.release ? 0.95 : 0.1));
      else if (i < n.toGuard[0])
        (this._rootPose(this.N_REL, st, dt),
          this._blendTo(this.N_FOL, pa(Bt(i, n.follow[0], n.follow[1]))),
          (o = 0.15));
      else {
        (this._rootPose(this.N_FOL, st, dt),
          zt.copy(this.HG_L.p).applyMatrix4(e),
          Lt.copy(Vs).multiply(this.HG_L.q));
        const r = Ps(Bt(i, n.toGuard[0], n.toGuard[1]));
        (st.lerp(zt, r), dt.slerp(Lt, r), (o = 0.15 + 0.85 * r));
      }
      i >= n.release && !this._released && (this._released = !0);
    } else o = 1;
    return ((this.curlL = Fe(this.curlL, o, 25, t)), s);
  }
  _magFrame(t, e, o, s, i, n = 0) {
    const r = this.LUG,
      l = this.M0;
    return (
      os.makeTranslation(r.x + n, r.y + s, r.z + i),
      Ls.makeRotationAxis(Gc, o),
      os.multiply(Ls),
      Ls.makeTranslation(l.x - r.x, l.y - r.y, l.z - r.z),
      os.multiply(Ls),
      t.multiplyMatrices(e, os)
    );
  }
  _handOnMag(t, e, o) {
    (e.copy(this.H_MAG.p).applyMatrix4(t),
      t.decompose(rt, o, c0),
      o.multiply(this.H_MAG.q));
  }
  _rootPose(t, e, o) {
    (e.copy(t.p).applyMatrix4(this.root.matrixWorld), o.copy(ai).multiply(t.q));
  }
  _rootPoint(t, e, o, s) {
    return t.set(e, o, s).applyMatrix4(this.root.matrixWorld);
  }
  _lerpPose(t, e, o) {
    (st.lerp(t, o), dt.slerp(e, o));
  }
  _setBoneWorld(t, e) {
    (Ls.multiplyMatrices(ni, e).decompose(t.position, t.quaternion, t.scale),
      t.updateMatrixWorld(!0));
  }
  _updateMag(t, e) {
    const o = this.reloadT;
    if (o < 0 || t === 0) {
      (o >= 0 && o < W.seat[1] && o >= W.reachMag[1]
        ? this._setBoneWorld(
            this.magBone,
            os.multiplyMatrices(qt, this.MAGREL_F),
          )
        : this._setBoneWorld(this.magBone, os.multiplyMatrices(e, this.MAGREL)),
        this.magMesh && (this.magMesh.visible = !0));
      return;
    }
    if (t === 2) {
      this.magMesh && (this.magMesh.visible = !1);
      return;
    }
    (this.handL.matrixWorld.decompose(rt, Os, c0),
      os.compose(rt, Os, ii).multiply(this.H_MAG_INV).multiply(this.MAGREL_F),
      this._setBoneWorld(this.magBone, os),
      this.magMesh && (this.magMesh.visible = !0));
  }
  _curl(t, e) {
    for (let o = 0; o < t.length; o++)
      t[o].b.quaternion.copy(Os.identity()).slerp(t[o].rest, e);
  }
  _spawnDrop() {
    const t = this.drops[this.dropIdx++ % this.drops.length];
    (this.magBone.matrixWorld.decompose(
      t.obj.position,
      t.obj.quaternion,
      t.obj.scale,
    ),
      t.v.copy(this.handVel).multiplyScalar(0.6),
      (t.v.y -= 0.6),
      t.w.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 6,
      ));
    const e = this._col,
      o = e
        ? e.groundY(
            t.obj.position.x,
            t.obj.position.y + 0.2,
            t.obj.position.z,
            4,
          )
        : -1 / 0;
    ((t.floor = o === -1 / 0 ? t.obj.position.y - 1.3 : o),
      (t.active = !0),
      (t.rest = !1),
      (t.bounces = 0));
  }
  _updateDrops(t) {
    for (const e of this.drops) {
      if (!e.active || e.rest) continue;
      const o = e.obj;
      ((e.v.y -= 9.8 * t), o.position.addScaledVector(e.v, t));
      const s = e.w.length();
      (s > 1e-4 &&
        (Os.setFromAxisAngle(rt.copy(e.w).divideScalar(s), s * t),
        o.quaternion.premultiply(Os)),
        o.position.y < e.floor + 0.03 &&
          ((o.position.y = e.floor + 0.03),
          e.v.y < -0.8 && e.bounces < 3
            ? ((e.v.y = -e.v.y * 0.28),
              (e.v.x *= 0.55),
              (e.v.z *= 0.55),
              e.w.multiplyScalar(0.5),
              e.bounces++)
            : (e.v.set(0, 0, 0),
              e.w.set(0, 0, 0),
              (e.rest = !0),
              rt.copy(this.magAxisLocal).applyQuaternion(o.quaternion),
              We.set(rt.x, 0, rt.z),
              We.lengthSq() < 1e-6 && We.set(1, 0, 0),
              We.normalize(),
              Os.setFromUnitVectors(rt.normalize(), We),
              o.quaternion.premultiply(Os),
              (o.position.y = e.floor + 0.018))));
    }
  }
  _updateNade() {
    const t = this.throwT,
      e = t >= Pt.grab && t < Pt.release;
    if (((this.nade.visible = e), !e)) {
      t >= 0 && this.handL.getWorldPosition(this.nadePos);
      return;
    }
    const o = this.fingerTipsL;
    (this.handL.getWorldPosition(rt), rt.multiplyScalar(0.8));
    for (let s = 0; s < o.length; s++) rt.add(o[s].getWorldPosition(We));
    (rt.divideScalar(0.8 + o.length),
      this.nade.position.copy(rt),
      this.nadePos.copy(rt),
      ps(this.handL, this.nade.quaternion),
      (this.nadeRing.visible = t < Pt.pin[0] + 0.05));
  }
}
const Hc = {
    yaw: 0,
    pitch: 0,
    camYaw: 0,
    camPitch: 0,
    bobPhase: 0,
    bobAmp: 0,
    crouch: 0,
    lean: 0,
    onGround: !0,
  },
  yt = (a) => ({
    dust: [0.6, 0.58, 0.55],
    chip: null,
    cell: K.concrete,
    exitCell: -1,
    size: 0.05,
    puffs: 8,
    chips: 3,
    sparks: 0,
    kind: "solid",
    chipScale: 1,
    puffSize: 1,
    ...a,
  }),
  Yc = 0.6,
  ci = 0.32,
  L0 = {
    concrete: yt({
      dust: [0.64, 0.62, 0.58],
      chip: [0.56, 0.54, 0.5],
      cell: K.concrete,
      size: 0.055,
      chips: 4,
    }),
    asphalt: yt({
      dust: [0.42, 0.41, 0.4],
      chip: [0.2, 0.2, 0.2],
      cell: K.gravel,
      size: 0.05,
      chips: 3,
    }),
    brick: yt({
      dust: [0.62, 0.4, 0.3],
      chip: [0.52, 0.25, 0.17],
      cell: K.brick,
      size: 0.06,
      chips: 4,
    }),
    plaster: yt({
      dust: [0.84, 0.81, 0.76],
      chip: [0.82, 0.79, 0.74],
      cell: K.plaster,
      size: 0.06,
      puffs: 10,
      chips: 3,
    }),
    gravel: yt({
      dust: [0.56, 0.53, 0.49],
      chip: [0.42, 0.4, 0.37],
      cell: K.gravel,
      size: 0.06,
      chips: 4,
      kind: "ground",
    }),
    dirt: yt({
      dust: [0.42, 0.35, 0.27],
      chip: [0.22, 0.17, 0.12],
      cell: K.dirt,
      size: 0.08,
      chips: 6,
      chipScale: 1.4,
      kind: "ground",
    }),
    mud: yt({
      dust: [0.3, 0.25, 0.2],
      chip: [0.13, 0.1, 0.08],
      cell: K.dirt,
      size: 0.08,
      puffs: 3,
      chips: 7,
      chipScale: 1.3,
      kind: "ground",
    }),
    sand: yt({
      dust: [0.72, 0.68, 0.6],
      chip: null,
      cell: K.soft,
      size: 0.04,
      puffs: 12,
      chips: 0,
    }),
    wood: yt({
      dust: [0.58, 0.47, 0.33],
      chip: [0.66, 0.53, 0.36],
      cell: K.wood,
      exitCell: K.woodExit,
      size: 0.035,
      puffs: 4,
      chips: 4,
      kind: "wood",
    }),
    plywood: yt({
      dust: [0.62, 0.52, 0.38],
      chip: [0.7, 0.58, 0.4],
      cell: K.wood,
      exitCell: K.woodExit,
      size: 0.032,
      puffs: 4,
      chips: 4,
      kind: "wood",
    }),
    metal: yt({
      dust: [0.42, 0.41, 0.4],
      cell: K.metal,
      size: 0.03,
      puffs: 2,
      chips: 0,
      sparks: 14,
      kind: "metal",
      puffSize: 0.5,
    }),
    metal_thin: yt({
      dust: [0.42, 0.41, 0.4],
      cell: K.metalThin,
      exitCell: K.metalExit,
      size: 0.03,
      puffs: 2,
      chips: 0,
      sparks: 9,
      kind: "metal",
      puffSize: 0.5,
    }),
    steel: yt({
      dust: [0.62, 0.62, 0.6],
      cell: -1,
      size: 0,
      puffs: 2,
      chips: 0,
      sparks: 18,
      kind: "steel",
      puffSize: 0.35,
    }),
    chainlink: yt({
      dust: [0.5, 0.5, 0.5],
      cell: -1,
      size: 0,
      puffs: 0,
      chips: 0,
      sparks: 4,
      kind: "metal",
    }),
    glass: yt({
      dust: [0.8, 0.84, 0.85],
      chip: [0.55, 0.62, 0.62],
      cell: K.glass,
      exitCell: K.glass,
      size: 0.15,
      puffs: 2,
      chips: 5,
      kind: "glass",
    }),
    soft: yt({
      dust: [0.3, 0.3, 0.28],
      cell: K.soft,
      size: 0.03,
      puffs: 3,
      chips: 0,
    }),
    cardboard: yt({
      dust: [0.68, 0.57, 0.42],
      cell: K.soft,
      size: 0.022,
      puffs: 2,
      chips: 0,
      kind: "paper",
      puffSize: 0.4,
    }),
    cloth: yt({
      dust: [0.5, 0.5, 0.48],
      cell: -1,
      size: 0,
      puffs: 2,
      chips: 0,
    }),
    rubber: yt({
      dust: [0.2, 0.2, 0.2],
      chip: [0.08, 0.08, 0.08],
      cell: K.soft,
      size: 0.03,
      puffs: 2,
      chips: 2,
    }),
    plastic: yt({
      dust: [0.6, 0.6, 0.58],
      chip: [0.3, 0.32, 0.36],
      cell: K.soft,
      size: 0.025,
      puffs: 2,
      chips: 2,
    }),
    water: yt({
      dust: [0.82, 0.85, 0.88],
      cell: -1,
      size: 0,
      puffs: 0,
      chips: 0,
      kind: "water",
    }),
    foliage: yt({
      dust: [0.3, 0.36, 0.2],
      chip: [0.32, 0.4, 0.18],
      cell: -1,
      size: 0,
      puffs: 1,
      chips: 3,
      kind: "leaf",
    }),
  };
L0.grass = L0.foliage;

export { L0, Nc, Yc, ci, ne };
