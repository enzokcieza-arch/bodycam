// weapon/weapons.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, G as Kt, V as P, Y as vt, _ as Mo, ai as U0, d as Tt, g as ht } from "three-vendor";
import { Ft, Mi, Ta, Us, bi, hh, io, is, lh, nh, rs, sh, vi, y0 } from "./ballistics.js";

class uh {
  constructor(t, e, o, s, i, n, r) {
    (Object.assign(this, {
      engine: t,
      world: e,
      player: o,
      vm: s,
      fx: i,
      audio: n,
      hud: r,
    }),
      (this.mag = 30),
      (this.magSize = 30),
      (this.reserve = 120),
      (this.auto = !0),
      (this.cooldown = 0),
      (this.burst = 0),
      (this.triggerHeld = !1),
      (this.triggerPressed = !1),
      (this.nades = 3),
      (this.nadeCooldown = 0),
      (this.grenades = []),
      (this.rc = new U0()),
      (this.rc.firstHitOnly = !0),
      (this.rc.far = 250),
      (this.targets = new nh(t, e, n, i, r)),
      (this.ballistics = new sh([
        () => this.world.staticMeshes,
        this.targets.meshes,
        this.targets.solids,
      ])),
      i && (i.ballistics = this.ballistics),
      (this.shotsFired = 0),
      (this.lastHits = 0),
      this.buildGrenadeMesh());
  }
  buildGrenadeMesh() {
    const t = new Mo(0.032, 14, 10);
    t.scale(1, 1.2, 1);
    const e = new vt(0.012, 0.014, 0.022, 10);
    e.translate(0, 0.044, 0);
    const o = new Z(0.01, 0.06, 0.004);
    (o.translate(0.02, 0.02, 0),
      (this.nadeMat = new Tt({
        color: 4870710,
        roughness: 0.6,
        metalness: 0.4,
      })),
      (this.nadeTop = new Tt({
        color: 7829367,
        roughness: 0.4,
        metalness: 0.9,
      })),
      (this.nadeGeo = [t, e, o]),
      (this.nadePool = []));
    for (let s = 0; s < 4; s++) {
      const i = new Kt();
      (i.add(
        new ht(t, this.nadeMat),
        new ht(e, this.nadeTop),
        new ht(o, this.nadeTop),
      ),
        (i.visible = !1),
        this.engine.scene.add(i),
        this.nadePool.push({
          obj: i,
          p: new P(),
          v: new P(),
          w: new P(),
          fuse: 0,
          active: !1,
          lastBounce: 0,
        }));
    }
  }
  setTrigger(t) {
    (t && !this.triggerHeld && (this.triggerPressed = !0),
      (this.triggerHeld = t));
  }
  toggleMode() {
    ((this.auto = !this.auto),
      this.audio.click(0.3, 2e3),
      this.hud.update(this));
  }
  reload() {
    this.vm.reloading ||
      this.mag >= this.magSize + 1 ||
      this.reserve <= 0 ||
      (this.vm.startReload(), this.audio.reload(), (this.reloadPending = 2.1));
  }
  throwGrenade() {
    this.nades <= 0 ||
      this.nadeCooldown > 0 ||
      this.vm.reloading ||
      (this.nades--,
      (this.nadeCooldown = 1.2),
      this.vm.startThrow(),
      this.audio.pin(),
      (this.throwPending = 0.38),
      this.hud.update(this));
  }
  update(t, e) {
    if (
      ((this.cooldown -= t),
      (this.nadeCooldown -= t),
      this.reloadPending > 0 &&
        ((this.reloadPending -= t), this.reloadPending <= 0))
    ) {
      const s = this.magSize + (this.mag > 0 ? 1 : 0) - this.mag,
        i = Math.min(s, this.reserve);
      ((this.mag += i), (this.reserve -= i), this.hud.update(this));
    }
    (this.throwPending > 0 &&
      ((this.throwPending -= t), this.throwPending <= 0 && this.spawnGrenade()),
      !this.vm.reloading &&
        this.vm.throwT < 0 &&
        !this.player.sprint &&
        this.cooldown <= 0 &&
        (this.triggerPressed || (this.auto && this.triggerHeld)) &&
        (this.mag > 0
          ? (this.fire(e), (this.cooldown = 0.1))
          : this.triggerPressed &&
            (this.audio.dryFire(), (this.cooldown = 0.25))),
      this.triggerHeld || (this.burst = Math.max(0, this.burst - t * 6)),
      (this.triggerPressed = !1),
      this.updateGrenades(t),
      this.targets.update(t));
  }
  fire(t) {
    (this.mag--,
      this.shotsFired++,
      this.burst++,
      (this.engine.dynres.combatUntil = t + 4e3),
      this.vm.fire());
    const e = Math.min(this.burst, 10),
      o = this.player.ads ? 0.65 : 1,
      s = this.player.crouch > 0.5 ? 0.75 : 1;
    ((this.player.pitch +=
      (0.0105 + e * 0.0011) * o * s * (0.8 + Math.random() * 0.4)),
      (this.player.yaw += (Math.random() - 0.45) * 0.009 * (1 + e * 0.12) * o),
      (this.player.recoilPitch += 0.018 * o),
      (this.player.recoilYaw += (Math.random() - 0.5) * 0.01),
      this.player.addShake(0.32 * o),
      this.audio.gunshot(0, 0),
      this.vm.getMuzzle(io, Us));
    const i =
      (this.player.ads ? 0.002 : 0.006) +
      this.player.speed * 0.004 +
      (this.player.onGround ? 0 : 0.03) +
      e * 6e-4;
    ((Us.x += (Math.random() - 0.5) * 2 * i),
      (Us.y += (Math.random() - 0.5) * 2 * i),
      (Us.z += (Math.random() - 0.5) * 2 * i),
      Us.normalize());
    const n = this.engine.camera;
    (Ta.copy(n.position), Ft.copy(io).sub(Ta));
    const r = Ft.length();
    Ft.normalize();
    const l = r > 1e-4 ? this.ballistics.segment(Ta, Ft, r + 0.03) : null;
    (l && io.copy(l.point).addScaledVector(Ft, -0.015),
      (this.muzzleBlocked = !!l));
    const u = this.ballistics.trace(io, Us, 250, 1);
    this.lastHits = u.length;
    const h = this.ballistics.endPoint;
    (this.shotsFired % 3 === 0 && this.fx.tracer(io, h),
      l || this.fx.muzzleSmoke(io, Us));
    let c = 0;
    for (let p = 0; p < u.length; p++) {
      const f = u[p];
      if (f.target) {
        (this.targets.hit(f.target, f, f.dir, f.energy), c++);
        continue;
      }
      if (
        (this.fx.bulletImpact(
          f.point,
          f.normal,
          f.surface,
          f.distance,
          f.dir,
          (f.exit ? 1 : 0) | (f.graze ? 4 : 0),
          f.energy,
        ),
        !f.exit && c < 2)
      ) {
        const g = this.panOf(f.point);
        (this.audio.impact(lh[f.surface] || "concrete", f.distance, g),
          f.graze &&
            this.audio.ctx &&
            f.surface !== "metal" &&
            f.surface !== "steel" &&
            this.audio.ricochet(
              this.audio.ctx.currentTime + f.distance / 343,
              1 / (1 + f.distance * 0.15),
              g,
            ),
          c++);
      }
    }
    (this.vm.getEject(Ft),
      is.set(1, 0, 0).applyQuaternion(n.quaternion),
      bi.set(0, 1, 0).applyQuaternion(n.quaternion),
      rs.set(0, 0, -1).applyQuaternion(n.quaternion));
    const d = this.world.collider.groundY(
      Ft.x + is.x * 0.5,
      Ft.y + 0.2,
      Ft.z + is.z * 0.5,
      4,
    );
    (this.fx.ejectShell(Ft, is, bi, rs, d === -1 / 0 ? this.player.pos.y : d),
      this.hud.update(this));
  }
  raycastAll(t) {
    const e = this.ballistics.cast(t.ray.origin, t.ray.direction, t.far, !0);
    return e
      ? {
          object: e.obj,
          point: e.point.clone(),
          distance: e.dist,
          face: { normal: e.normal.clone() },
          uv: e.hasUV ? e.uv.clone() : void 0,
        }
      : null;
  }
  panOf(t) {
    const e = this.engine.camera;
    return (
      is.set(1, 0, 0).applyQuaternion(e.quaternion),
      Mi.subVectors(t, e.position).normalize(),
      Mi.dot(is)
    );
  }
  spawnGrenade() {
    let t = null;
    for (const s of this.nadePool)
      if (!s.active) {
        t = s;
        break;
      }
    if (!t) return;
    const e = this.engine.camera;
    (rs.set(0, 0, -1).applyQuaternion(e.quaternion),
      is.set(1, 0, 0).applyQuaternion(e.quaternion),
      t.p
        .copy(e.position)
        .addScaledVector(rs, 0.3)
        .addScaledVector(is, 0.12)
        .add(Ft.set(0, 0.25, 0)),
      y0.subVectors(t.p, e.position));
    const o = y0.length();
    (y0.divideScalar(o),
      this.world.collider.raycast(e.position, y0, o + 0.05) &&
        t.p.copy(e.position),
      rs.set(
        -Math.sin(this.player.yaw) * Math.cos(this.player.pitch),
        Math.sin(this.player.pitch),
        -Math.cos(this.player.yaw) * Math.cos(this.player.pitch),
      ),
      t.v
        .copy(rs)
        .multiplyScalar(13)
        .add(Ft.set(0, 3, 0))
        .addScaledVector(this.player.vel, 0.8),
      t.w.set(Math.random() * 10, Math.random() * 10, Math.random() * 10),
      (t.fuse = 3.6),
      (t.active = !0),
      (t.obj.visible = !0),
      (t.lastBounce = 0),
      t.obj.position.copy(t.p));
  }
  updateGrenades(t) {
    const e = this.world.collider;
    for (const o of this.nadePool)
      o.active &&
        ((o.fuse -= t),
        (this._bg = o),
        hh(
          o,
          t,
          e,
          this._onBounce ||
            (this._onBounce = (s) => {
              const i = this._bg,
                n = performance.now();
              n - i.lastBounce > 80 &&
                (this.audio.bounce(
                  s,
                  i.p.distanceTo(this.engine.camera.position),
                ),
                (i.lastBounce = n));
            }),
        ),
        o.obj.position.copy(o.p),
        (o.obj.rotation.x += o.w.x * t),
        (o.obj.rotation.y += o.w.y * t),
        (o.obj.rotation.z += o.w.z * t),
        o.fuse <= 0 && this.explode(o));
  }
  explode(t) {
    ((t.active = !1), (t.obj.visible = !1));
    const e = t.p;
    this.fx.explosion(e);
    const o = this.engine.camera,
      s = e.distanceTo(o.position);
    (this.audio.explosion(s, this.panOf(e)),
      Ft.subVectors(e, o.position).normalize(),
      rs.set(0, 0, -1).applyQuaternion(o.quaternion));
    const i = !this.world.collider.raycast(
      o.position,
      Ft,
      Math.max(0.1, s - 0.3),
    );
    (this.player.addShake(Math.max(0, 1.5 - s * 0.06) * (i ? 1 : 0.6)),
      i &&
        Ft.dot(rs) > 0.2 &&
        (this.engine.post.params.flash = Math.max(
          this.engine.post.params.flash,
          Math.min(0.6, 4 / (s + 2)),   // v3.0: a la mitad (antes dejaba la pantalla en blanco ~0.4 s)
        )),
      s < 14 &&
        (this.engine.post.params.tinnitus = Math.max(
          this.engine.post.params.tinnitus,
          (1 - s / 14) * (i ? 1 : 0.6),
        )));
    const n = this.world.collider.groundY(e.x, e.y + 0.3, e.z, 1.5);
    if (n !== -1 / 0)
      if (this.fx.scorch) this.fx.scorch(Ft.set(e.x, n, e.z), vi.set(0, 1, 0));
      else
        for (let r = 0; r < 6; r++)
          this.fx.bulletImpact(
            Ft.set(
              e.x + (Math.random() - 0.5) * 1.2,
              n,
              e.z + (Math.random() - 0.5) * 1.2,
            ),
            vi.set(0, 1, 0),
            "concrete",
            s,
          );
    (this.targets.blast(e, this.world.collider, this.ballistics),
      (this.engine.dynres.combatUntil = performance.now() + 5e3));
  }
}

export { uh };
