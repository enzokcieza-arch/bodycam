// player/player.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { Q, V as P, ai as U0 } from "three-vendor";
import { Fe, Jn } from "../world/world.js";

class Io {
  constructor(t = 20, e = 0.6) {
    ((this.omega = t),
      (this.zeta = e),
      (this.x = new P()),
      (this.v = new P()),
      (this.target = new P()));
  }
  impulse(t, e, o) {
    return ((this.v.x += t), (this.v.y += e), (this.v.z += o), this);
  }
  update(t) {
    const e = this.omega * this.omega,
      o = 2 * this.zeta * this.omega;
    let s = Math.ceil(t / 0.006);
    s > 20 && (s = 20);
    const i = t / s,
      n = this.x,
      r = this.v,
      l = this.target;
    for (let u = 0; u < s; u++)
      ((r.x += (e * (l.x - n.x) - o * r.x) * i),
        (r.y += (e * (l.y - n.y) - o * r.y) * i),
        (r.z += (e * (l.z - n.z) - o * r.z) * i),
        (n.x += r.x * i),
        (n.y += r.y * i),
        (n.z += r.z * i));
    return this;
  }
}
class Qn {
  constructor(t = 20, e = 0.6) {
    ((this.omega = t),
      (this.zeta = e),
      (this.x = 0),
      (this.v = 0),
      (this.target = 0));
  }
  update(t) {
    const e = this.omega * this.omega,
      o = 2 * this.zeta * this.omega;
    let s = Math.ceil(t / 0.006);
    s > 20 && (s = 20);
    const i = t / s;
    for (let n = 0; n < s; n++)
      ((this.v += (e * (this.target - this.x) - o * this.v) * i),
        (this.x += this.v * i));
    return this;
  }
}
function ve(a, t = 0) {
  return (
    Math.sin(a * 1 + t * 1.7) * 0.5 +
    Math.sin(a * 2.31 + t * 3.1) * 0.3 +
    Math.sin(a * 4.79 + t * 5.3) * 0.2
  );
}
const Ic = new P(0, 1, 0),
  ti = new P(),
  fa = new P(),
  jt = {
    chest: 1.36,
    crouchDrop: 0.52,
    forward: 0.12,
    follow: { walk: 15, sprint: 10, ads: 24, zeta: 0.62, maxLag: 0.32 },
    walk: {
      freq: 1.85,
      bobY: 0.02,
      swayX: 0.016,
      roll: 0.012,
      yaw: 0.004,
      nod: 0.006,
      step: 0.45,
      jitter: 0.0016,
    },
    sprint: {
      freq: 2.9,
      bobY: 0.042,
      swayX: 0.03,
      roll: 0.032,
      yaw: 0.022,
      nod: 0.016,
      step: 1,
      jitter: 0.0045,
    },
    crouch: {
      freq: 1.45,
      bobY: 0.012,
      swayX: 0.012,
      roll: 0.008,
      yaw: 0.003,
      nod: 0.004,
      step: 0.3,
      jitter: 0.001,
    },
    lean: { side: 0.36, roll: 0.24, drop: 0.06 },
  };
class Uc {
  constructor(t, e, o, s) {
    ((this.engine = t),
      (this.world = e),
      (this.input = o),
      (this.audio = s),
      (this.pos = new P()),
      (this.vel = new P()),
      (this.yaw = 0),
      (this.pitch = 0),
      (this.camYaw = 0),
      (this.camPitch = 0),
      (this.camYawV = 0),
      (this.camPitchV = 0),
      (this.radius = 0.3),
      (this.height = 1.78),
      (this.crouch = 0),
      (this.lean = 0),
      (this.onGround = !1),
      (this.bobPhase = 0),
      (this.bobAmp = 0),
      (this.stepSide = 1),
      (this.landKick = 0),
      (this.landVel = 0),
      (this.sprint = !1),
      (this.speed = 0),
      (this.ads = !1),
      (this.shake = 0),
      (this.shakeT = 0),
      (this.recoilPitch = 0),
      (this.recoilYaw = 0),
      (this.sens = 1),
      (this.surface = "gravel"),
      (this.stamina = 1),
      (this.fatigue = 0),
      (this.breathPhase = 0),
      (this.stepSpring = new Qn(26, 0.38)),
      (this.shotSpring = new Io(30, 0.32)),
      (this.landSpring = new Qn(15, 0.42)),
      (this.sprintMix = 0),
      (this.crouchMix = 0),
      (this.leanMax = 1),
      (this._corr = new P()),
      (this._wish = new P()),
      (this._f = new P()),
      (this._r = new P()),
      (this.camOffset = new P()),
      (this.camRoll = 0),
      (this._t = 0),
      (this._prevVy = 0),
      (this._sm = 0),
      (this._cm = 0),
      (this._mixFn = (i) => this._mixKey(i)));
  }
  spawn(t, e = 0, o = 0) {
    (this.pos.set(t[0], t[1] + 0.05, t[2]),
      this.vel.set(0, 0, 0),
      (this.yaw = this.camYaw = e),
      (this.pitch = this.camPitch = o),
      (this.camYawV = this.camPitchV = 0));
  }
  look(t, e) {
    const o = 0.0022 * this.sens * (this.ads ? 0.7 : 1);
    ((this.yaw -= t * o),
      (this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch - e * o))));
  }
  fixedUpdate(t) {
    const e = this.input,
      o = e.down("KeyC") || e.down("ControlLeft");
    this.crouch += ((o ? 1 : 0) - this.crouch) * Math.min(1, t * 10);
    const s = this.height - this.crouch * 0.6;
    this.sprint = e.down("ShiftLeft") && e.down("KeyW") && !o && !this.ads;
    const i = this.sprint ? 5.4 : o ? 1.5 : this.ads ? 1.9 : 2.9,
      n = this._f.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
      r = this._r.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw)),
      l = this._wish.set(0, 0, 0);
    (e.down("KeyW") && l.add(n),
      e.down("KeyS") && l.sub(n),
      e.down("KeyD") && l.add(r),
      e.down("KeyA") && l.sub(r),
      l.lengthSq() > 0 && l.normalize().multiplyScalar(i));
    const u = this.onGround ? (l.lengthSq() > 0 ? 9 : 11) : 1.5;
    ((this.vel.x += (l.x - this.vel.x) * Math.min(1, u * t)),
      (this.vel.z += (l.z - this.vel.z) * Math.min(1, u * t)),
      this.onGround &&
        e.pressed("Space") &&
        this.crouch < 0.5 &&
        ((this.vel.y = 4.3), (this.onGround = !1), (this.landSpring.v += 0.35)),
      (this.vel.y -= 18 * t),
      this.vel.y < -30 && (this.vel.y = -30));
    const h = this.vel.y;
    this.pos.addScaledVector(this.vel, t);
    const c = this.world.collider.resolveCapsule(
        this.pos,
        this.radius,
        s,
        this._corr,
      ),
      d = this.onGround;
    if (
      ((this.onGround =
        c.y > 1e-4 && c.y > Math.abs(c.x) + Math.abs(c.z) - 0.001),
      this.pos.add(c),
      this.onGround)
    )
      (!d &&
        h < -3 &&
        ((this.landVel = Math.min(0.16, -h * 0.016)),
        (this.landSpring.v -= Math.min(2.2, -h * 0.28)),
        (this.shotSpring.v.x -= Math.min(1.2, -h * 0.1)),
        (this.shotSpring.v.z += (Math.random() - 0.5) * Math.min(1, -h * 0.08)),
        this.audio.footstep(this.surface, !0)),
        (this.vel.y = Math.max(0, this.vel.y * 0)));
    else if (c.lengthSq() > 1e-8) {
      const p = c.normalize(),
        f = this.vel.dot(p);
      f < 0 && this.vel.addScaledVector(p, -f);
    }
    if (d && !this.onGround && this.vel.y <= 0) {
      const p = this.world.collider.groundY(
        this.pos.x,
        this.pos.y + 0.3,
        this.pos.z,
        0.75,
      );
      p > this.pos.y - 0.45 &&
        p !== -1 / 0 &&
        ((this.pos.y = p + 0.002), (this.onGround = !0), (this.vel.y = 0));
    }
    (this.pos.y < -20 && this.spawn([3.5, 0, 16.5], 0),
      (this.speed = Math.hypot(this.vel.x, this.vel.z)));
  }
  update(t) {
    const e = this.input;
    ((t = Math.min(t, 0.1)), (this._t += t));
    const o = (e.down("KeyE") ? 1 : 0) - (e.down("KeyQ") ? 1 : 0);
    if (o !== 0 && this.world?.collider) {
      (ti.set(Math.cos(this.camYaw) * o, 0, -Math.sin(this.camYaw) * o),
        fa.copy(this.pos),
        (fa.y += jt.chest - this.crouch * jt.crouchDrop));
      const At = this.world.collider.raycast(fa, ti, jt.lean.side + 0.25);
      this.leanMax = At ? Math.max(0, (At.distance - 0.22) / jt.lean.side) : 1;
    } else this.leanMax = 1;
    const s = o * Math.min(1, this.leanMax);
    this.lean += (s - this.lean) * Math.min(1, t * 7);
    const i = jt.follow,
      n = this.sprint ? i.sprint : this.ads ? i.ads : i.walk,
      r = 2 * i.zeta * n,
      l = n * n;
    let u = Math.ceil(t / 0.005);
    u > 24 && (u = 24);
    const h = t / u;
    for (let At = 0; At < u; At++) {
      const Ht = Jn(this.yaw + this.recoilYaw - this.camYaw),
        ys = this.pitch + this.recoilPitch - this.camPitch;
      ((this.camYawV += (l * Ht - r * this.camYawV) * h),
        (this.camYaw += this.camYawV * h),
        (this.camPitchV += (l * ys - r * this.camPitchV) * h),
        (this.camPitch += this.camPitchV * h));
    }
    let c = Jn(this.yaw - this.camYaw);
    Math.abs(c) > i.maxLag &&
      (this.camYaw = this.yaw - Math.sign(c) * i.maxLag);
    const d = this.pitch - this.camPitch;
    (Math.abs(d) > i.maxLag &&
      (this.camPitch = this.pitch - Math.sign(d) * i.maxLag),
      (this.recoilPitch *= Math.exp(-t * 6)),
      (this.recoilYaw *= Math.exp(-t * 6)));
    const p = this.onGround ? Math.min(1, this.speed / 2.9) : 0;
    (this.sprint && this.speed > 3
      ? (this.stamina = Math.max(0, this.stamina - t * 0.11))
      : (this.stamina = Math.min(
          1,
          this.stamina + t * (p > 0.3 ? 0.06 : 0.12),
        )),
      (this.fatigue = Fe(this.fatigue, 1 - this.stamina, 1.2, t)));
    const f = 0.27 + 0.55 * this.fatigue + p * 0.12;
    ((this.breathPhase += t * f * Math.PI * 2),
      (this.sprintMix = Fe(
        this.sprintMix,
        this.sprint && this.speed > 3 ? 1 : 0,
        6,
        t,
      )),
      (this.crouchMix = Fe(this.crouchMix, this.crouch, 8, t)),
      (this.bobAmp = Fe(this.bobAmp, p * (this.ads ? 0.75 : 1), 6, t)));
    const g = this.sprintMix,
      m = this.crouchMix * (1 - g);
    ((this._sm = g), (this._cm = m));
    const w = this._mixFn,
      y = w("freq"),
      x = this.bobPhase;
    if (
      ((this.bobPhase += t * y * Math.PI * (0.35 + 0.65 * p)),
      this.onGround &&
        this.speed > 0.6 &&
        Math.floor(x / Math.PI) !== Math.floor(this.bobPhase / Math.PI))
    ) {
      this.audio.footstep(this.surface, this.sprint);
      const At = w("step") * Math.min(1, this.speed / 2.9);
      ((this.stepSpring.v -= 0.55 * At),
        (this.stepSide = -this.stepSide),
        (this.shotSpring.v.x -= 0.18 * At),
        (this.shotSpring.v.z += 0.12 * At * this.stepSide));
    }
    (this.stepSpring.update(t),
      this.shotSpring.update(t),
      this.landSpring.update(t),
      (this.landKick += this.landVel),
      (this.landVel -= this.landKick * t * 120),
      (this.landVel *= Math.exp(-t * 10)),
      (this.landKick *= Math.exp(-t * 4)));
    const b = this.bobAmp,
      v = this.bobPhase,
      M = Math.sin(v),
      _ = Math.abs(M),
      S = (_ - 0.64) * w("bobY") * b,
      T = M * w("swayX") * b,
      A = w("jitter") * b,
      z = ve(this._t * 23, 1) * A,
      R = ve(this._t * 27, 2) * A,
      k = M * w("roll") * b,
      C = Math.sin(v - 0.4) * w("yaw") * b,
      O = (_ - 0.64) * w("nod") * b,
      V = 0.0028 + 0.011 * this.fatigue,
      F = Math.sin(this.breathPhase) * V,
      q = Math.sin(this.breathPhase) * (0.002 + 0.008 * this.fatigue),
      I = 1 - b * 0.6,
      H = ve(this._t * 0.45, 4) * 0.0035 * I,
      L = ve(this._t * 0.38, 5) * 0.004 * I,
      D = ve(this._t * 0.33, 6) * 0.004 * I;
    ((this.shakeT += t), (this.shake *= Math.exp(-t * 8)));
    const U = ve(this.shakeT * 61, 7) * this.shake,
      Y = ve(this.shakeT * 53, 8) * this.shake,
      et = ve(this.shakeT * 47, 9) * this.shake;
    this.camRoll =
      k - this.lean * jt.lean.roll + D + this.shotSpring.x.z + et * 0.012;
    const G = jt.chest - this.crouch * jt.crouchDrop,
      j = this.engine.camera,
      wt = this._r.set(Math.cos(this.camYaw), 0, -Math.sin(this.camYaw)),
      me = this._f.set(-Math.sin(this.camYaw), 0, -Math.cos(this.camYaw)),
      Vt =
        G +
        S +
        R +
        q +
        this.stepSpring.x * 0.03 +
        this.landSpring.x * 0.05 -
        this.landKick;
    (j.position
      .copy(this.pos)
      .addScaledVector(Ic, Vt)
      .addScaledVector(wt, T + z + this.lean * jt.lean.side)
      .addScaledVector(me, jt.forward),
      (j.position.y -= Math.abs(this.lean) * jt.lean.drop),
      j.rotation.set(
        this.camPitch +
          O +
          F +
          H +
          this.shotSpring.x.x +
          Y * 0.022 -
          this.landKick * 0.6 +
          this.landSpring.x * 0.05,
        this.camYaw + C + L + this.shotSpring.x.y + U * 0.022,
        this.camRoll,
        "YXZ",
      ),
      (this._st = (this._st || 0) + t) > 0.2 &&
        ((this._st = 0), (this.surface = this.surfaceBelow())));
  }
  _mixKey(t) {
    const e = jt.walk,
      o = jt.sprint,
      s = jt.crouch,
      i = this._sm,
      n = this._cm;
    return (e[t] * (1 - i) + o[t] * i) * (1 - n) + s[t] * n;
  }
  surfaceBelow() {
    const t = this._rc || (this._rc = new U0());
    return (
      (this._o = this._o || new P()),
      (this._d = this._d || new P(0, -1, 0)),
      t.set(this._o.set(this.pos.x, this.pos.y + 0.3, this.pos.z), this._d),
      (t.far = 1),
      (t.firstHitOnly = !0),
      t.intersectObjects(this.world.staticMeshes, !1)[0]?.object.userData
        .surface || "concrete"
    );
  }
  addShake(t) {
    this.shake = Math.min(1.5, this.shake + t);
    const e = Math.min(0.6, t);
    ((this.shotSpring.v.x += e * (2.2 + Math.random() * 1)),
      (this.shotSpring.v.y += e * (Math.random() - 0.5) * 1.4),
      (this.shotSpring.v.z += e * (Math.random() - 0.5) * 2.2));
  }
}
const we = new P(),
  Oe = new P(),
  Po = new P(),
  zo = new P(),
  zs = new P(),
  Cs = new P(),
  ei = new P(),
  Co = new P(),
  r0 = new P(),
  si = new Q(),
  l0 = new Q(),
  Rs = new Q(),
  ma = new Q(),
  to = new Q(),
  Dc = new P(),
  Ec = new P();
function ps(a, t) {
  return (a.matrixWorld.decompose(Ec, t, Dc), t);
}

export { Co, Cs, Io, Oe, Po, Rs, Uc, ei, l0, ma, ps, r0, si, to, ve, we, zo, zs };
