// main.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { V as P, aC as M0, aH as Vr, aI as Br, aJ as Ir, ar as k0, j as Fr, l as Lr } from "three-vendor";
import { Gr } from "./core/engine.js";
import { LookPanel } from "./ui/lookpanel.js";
import { Atmosphere } from "./world/atmosphere.js";
import { autoGraffiti } from "./world/autograffiti.js";
import { forestFloor } from "./world/dressing.js";
import { enhanceViewmodel, updateGunFx } from "./weapon/gunfx.js";
import { Nr } from "./core/input.js";
import { Hr } from "./core/perf.js";
import { $i, Fa, zn } from "./level/area-urbex.js";
import { qs } from "./world/geometry-utils.js";
import { Bc } from "./world/world.js";
import { Uc } from "./player/player.js";
import { Nc, ne } from "./weapon/viewmodel.js";
import { Xc } from "./fx/particles.js";
import { uh } from "./weapon/weapons.js";
import { dh } from "./audio/audio.js";
import { F0, WG_UNIFORMS } from "./render/lightprobes.js";
import "./render/postprocess.js";
import "./level/builder.js";
import "./level/area-obra.js";
import "./level/area-callejon.js";
import "./level/area-bosque.js";
import "./world/trees.js";
import "./world/ground-scatter.js";
import "./world/graffiti.js";
import "./weapon/ballistics.js";
import "./style.css";

let wo = null;
const X = (a) => document.getElementById(a),
  Xa = new URLSearchParams(location.search),
  It = gh(),
  E = new Gr(X("game"), Xa.get("q") || It.quality || "medium"),
  Dt = new Nr(X("game")),
  Be = new dh(),
  J = new Hr(E),
  Ge = new Vr(E.renderer, (a) => us(a * 0.55, null));
Ge.aniso = E.quality.aniso;
let ue,
  _t,
  le,
  xt,
  de,
  fs,
  Nt = !1,
  er = !1;
const Vo = [0, 0];
function us(a, t) {
  (a != null && (X("load-fill").style.width = (a * 100).toFixed(0) + "%"),
    t && (X("load-text").textContent = t));
}
function gh() {
  try {
    return JSON.parse(localStorage.getItem("bodycam-settings") || "{}");
  } catch {
    return {};
  }
}
function wh() {
  try {
    localStorage.setItem("bodycam-settings", JSON.stringify(It));
  } catch {}
}
const Wa = {
  update(a) {
    ((X("ammo-mag").textContent = a.mag),
      (X("ammo-res").textContent = a.reserve),
      (X("nades").textContent = "G×" + a.nades),
      (X("firemode").textContent = a.auto ? "AUTO" : "SEMI"));
  },
  hint(a, t = 2500) {
    ((X("hint").textContent = a),
      clearTimeout(this._h),
      (this._h = setTimeout(() => (X("hint").textContent = ""), t)));
  },
};
async function yh() {
  us(0.05, "Cielo HDRI (Poly Haven, CC0)…");
  const a = await Ge.loadHDRI(Ge.manifest.hdri.env),
    t = new Fr(E.renderer),
    e = t.fromEquirectangular(a).texture;
  ((E.scene.environment = e),
    (E.scene.background = a),
    (E.scene.backgroundIntensity = 1),
    (E.scene.environmentIntensity = 0.82),
    t.dispose());
  const { data: o, width: s, height: i } = a.image;
  let n = 0,
    r = 0;
  const l = o.length / (s * i),
    u = o instanceof Uint16Array ? M0.fromHalfFloat : (b) => b;
  for (let b = 0; b < s * i; b += 3) {
    const v =
      u(o[b * l]) * 0.2126 +
      u(o[b * l + 1]) * 0.7152 +
      u(o[b * l + 2]) * 0.0722;
    v > n && ((n = v), (r = b));
  }
  const h = r % s,
    c = Math.floor(r / s),
    d = (h + 0.5) / s,
    p = 1 - (c + 0.5) / i,
    f = (d - 0.5) * Math.PI * 2,
    g = (p - 0.5) * Math.PI;
  let m = new P(
    Math.cos(g) * Math.cos(f),
    Math.sin(g),
    Math.cos(g) * Math.sin(f),
  );
  ((m.y < 0.25 || n < 20) && m.set(0.45, 0.72, 0.35), m.normalize());
  const w = new Br(15002354, 0.5),
    y = new P(4.5, 0, 6);
  (w.position.copy(y).addScaledVector(m, 70),
    w.target.position.copy(y),
    (w.castShadow = !0));
  const x = 42;
  (Object.assign(w.shadow.camera, {
    left: -x,
    right: x,
    top: x,
    bottom: -x,
    near: 10,
    far: 150,
  }),
    w.shadow.mapSize.set(E.quality.shadow, E.quality.shadow),
    (w.shadow.bias = -4e-4),
    (w.shadow.normalBias = 0.03),
    (w.shadow.radius = 6),
    (w.shadow.autoUpdate = !1),
    E.scene.add(w, w.target),
    (E.sun = w),
    (E.scene.fog = new Ir(9344411, 0.014)),
    console.info(
      "[env] sol",
      m.toArray().map((b) => b.toFixed(2)),
      "pico HDR",
      n.toFixed(0),
    ));
}
async function xh() {
  try {
    (await Ge.loadManifest(),
      (X("credits").textContent =
        "Assets CC0: " +
        [...new Set(Ge.manifest.credits.map((t) => t.split(" · ")[0]))].join(
          ", ",
        ) +
        " · AK y brazos: modelo del usuario (akSAl.glb)"),
      await yh(),
      (ue = new Bc(E, Ge)),
      await ue.build((t) => us(null, t)),
      (ue.atmosphere = new Atmosphere(E, ue)),
      autoGraffiti(ue, E.quality.autoGraffiti || 0),
      us(null, "Sotobosque (Poly Haven, CC0)…"),
      await forestFloor(ue, Ge, { density: E.quality.forest ?? 1 }));
    try {
      wo = await F0.load(`${k0}bake/probes-${$i}.bin`);
    } catch (t) {
      console.warn("[gi] sin sondas", t.message);
    }
    (us(0.7, "Arma y brazos…"),
      (le = await new Nc(E, Ge).load()),
      (gfx = enhanceViewmodel(le, E, { redDot: !Xa.has("noreddot") })),
      (xt = new Xc(E, ue, Be)),
      (_t = new Uc(E, ue, Dt, Be)),
      (de = new uh(E, ue, _t, le, xt, Be, Wa)),
      Wa.update(de),
      _t.spawn(zn.pos, zn.yaw),
      E.post.resetAdaptation?.(),
      (fs = new Lr({
        engine: E,
        world: ue,
        player: _t,
        assets: Ge,
        input: Dt,
        onClose: () => bh(),
      })),
      await fs.loadSaved(),
      us(0.8, "Subiendo texturas a GPU…"),
      await new Promise((t) => setTimeout(t, 30)),
      Ge.uploadAll(),
      (() => {
        for (const m of ue.staticMeshes)
          m.name.startsWith("static:") && m.material && !m.material.transparent && (m.material.userData.wg = !0);
      })(),
      wo &&
        wo.patchScene(E.scene, {
          cheap: E.qualityKey === "low",
          resetEnvMapIntensity: !0,
        }),
      us(0.86, "Precompilando shaders/pipelines…"),
      (le.flash.visible = !0),
      (le.flashLight.intensity = 1),
      (xt.boomLight.intensity = 1),
      (le.torch.intensity = 1));
    for (const t of de.nadePool)
      ((t.obj.visible = !0), t.obj.position.set(0, -50, 0));
    const a = new P(0, -40, 0);
    (xt.explosion(a),
      xt.bulletImpact(a, new P(0, 1, 0), "metal", 1),
      xt.ejectShell(a, a, a, a, -41),
      xt.tracer(a, a.clone().add(new P(0, 0, 1))),
      xt.update(0.016, a, 1),
      _t.update(0.016),
      E.renderer.compileAsync &&
        (await E.renderer.compileAsync(E.scene, E.camera)),
      E.updateShadows());
    for (let t = 0; t < 3; t++)
      (E.camera.updateMatrixWorld(), E.post.render(E.scene, E.camera, 0.016));
    ((le.flash.visible = !1),
      (le.flashLight.intensity = 0),
      (xt.boomLight.intensity = 0),
      (xt.boomT = 0),
      (le.torch.intensity = 0));
    for (const t of de.nadePool) t.obj.visible = !1;
    ((xt.smoke.n = 0),
      (xt.sparks.n = 0),
      (xt.holes.count = 0),
      (xt.holeIdx = 0),
      (xt.shellMesh.count = 0),
      (xt.shellIdx = 0),
      (xt.debMesh.count = 0),
      (xt.debIdx = 0));
    for (const t of xt.shells) t.active = !1;
    for (const t of xt.debris) t.active = !1;
    (us(1, "Listo."),
      X("menu-options").classList.remove("hidden"),
      (X("btn-play").disabled = !1),
      (er = !0),
      or || requestAnimationFrame(Qa),
      (window.__ready = !0),
      Xa.has("bench") && Ja());
  } catch (a) {
    (console.error(a), us(null, "ERROR: " + (a.message || a)));
  }
}
X("opt-quality").value = E.qualityKey;
X("opt-fisheye").value = It.fisheye ?? 0.6;
X("opt-sens").value = It.sens ?? 1;
X("opt-vol").value = It.vol ?? 0.8;
X("opt-dynres").checked = !!It.dynres;
const look = new LookPanel(E, () => ue, J);
function Za() {
  ((It.quality = X("opt-quality").value),
    (It.fisheye = +X("opt-fisheye").value),
    (It.sens = +X("opt-sens").value),
    (It.vol = +X("opt-vol").value),
    (It.dynres = X("opt-dynres").checked),
    wh(),
    (E.post.params.fisheye = It.fisheye),
    (E.post.params.exposureBias = 0.66),
    (E.post.params.blackCrush = look?.saved?.blackCrush ?? 1.05),
    _t && (_t.sens = It.sens),
    Be.setVolume(It.vol),
    (E.dynres.enabled = It.dynres),
    It.quality !== E.qualityKey &&
      (E.setQuality(It.quality),
      E.sun &&
        (E.sun.shadow.mapSize.set(E.quality.shadow, E.quality.shadow),
        E.sun.shadow.map?.dispose(),
        (E.sun.shadow.map = null)),
      E.updateShadows()));
}
for (const a of [
  "opt-quality",
  "opt-fisheye",
  "opt-sens",
  "opt-vol",
  "opt-dynres",
])
  X(a).addEventListener("change", Za);
Za();
X("btn-play").onclick = () => {
  (Za(), Be.init(), Dt.lock());
};
X("btn-assets").onclick = () => {
  (Be.init(), fs?.open(), X("menu").classList.add("hidden"), (Nt = !1));
};
Dt.onLock = (a) => {
  a
    ? (X("menu").classList.add("hidden"),
      (Nt = !0),
      Wa.hint(
        "Clic: disparar · R: recargar · G: granada · B: buscador de modelos · F3: rendimiento",
        4e3,
      ))
    : !fs?.isOpen &&
      !J.bench &&
      (X("menu").classList.remove("hidden"), (Nt = !1), de?.setTrigger(!1));
};
function bh() {
  Dt.lock();
}
Dt.on("F3", () => (J.toggle(), look.toggle(J.visible)));
Dt.on("KeyB", () => {
  er &&
    (fs.isOpen
      ? fs.close()
      : (document.exitPointerLock(), fs.open(), (Nt = !1)));
});
Dt.on("KeyR", () => Nt && de.reload());
Dt.on("KeyV", () => Nt && de.toggleMode());
Dt.on("KeyG", () => Nt && de.throwGrenade());
Dt.on("KeyF", () => {
  Nt && (le.toggleTorch(), Be.click(0.2, 2800));
});
Dt.onMouse = (a, t) => {
  Nt && a === 0 && de.setTrigger(t);
};
function Ja() {
  (X("menu").classList.add("hidden"),
    J.visible || J.toggle(),
    (Nt = !0),
    (Dt.enabled = !1),
    J.startBench(Fa, (a) => {
      (_t.spawn(a.pos, a.yaw, a.pitch),
        E.post.resetAdaptation?.(),
        (sr = a.yaw),
        (qa = 0));
    }),
    (J.onBenchDone = (a) => {
      ((Dt.enabled = !0),
        (Nt = !1),
        X("menu").classList.remove("hidden"),
        J.render(performance.now()),
        J.msg('Bench terminado. Pulsa "copiar informe" y pégamelo.'),
        (window.__benchReport = a));
    }));
}
J.onBench = Ja;
let sr = 0,
  qa = 0,
  _i = performance.now(),
  x0 = 0,
  za = 0,
  Ca = 1;
const Ra = 1 / 120,
  or = Xa.has("noloop");
function Qa(a) {
  or || requestAnimationFrame(Qa);
  const t = Math.min(250, a - _i);
  _i = a;
  const e = Math.min(0.1, t / 1e3);
  if (
    (J.frameStart(a),
    J.begin("input"),
    Dt.consumeMouse(Vo),
    Nt && !J.bench && (_t.look(Vo[0], Vo[1]), (_t.ads = Dt.mouse(2))),
    J.bench &&
      ((qa += e), (_t.yaw = sr + Math.sin(qa * 0.6) * 0.35), (_t.ads = !1)),
    J.end(),
    Nt)
  ) {
    (J.begin("física"), (x0 = Math.min(x0 + e, 0.1)));
    let s = 0;
    for (; x0 >= Ra && s < 8;) (_t.fixedUpdate(Ra), (x0 -= Ra), s++);
    (J.end(), Dt.endFrame());
  }
  if (
    (J.begin("jugador"),
    _t.update(e),
    E.camera.updateMatrixWorld(),
    J.end(),
    J.begin("armas"),
    Nt && de.update(e, a),
    J.end(),
    J.begin("mundo/luces"),
    ue.updateLights(E.camera.position, e),
    ue.atmosphere.update(e, E.camera, le, Ca),
    WG_UNIFORMS.wgParams.value.set(ue.atmosphere.params.wetness, ue.atmosphere.params.grime, 0),
    ue.trees?.update?.(E.camera, e),
    (Oa -= e),
    Oa <= 0)
  ) {
    Oa = 0.25;
    const s = _t.fatigue ?? (_t.sprint ? 0.7 : 0);
    ((b0 = Math.max(
      b0 * 0.93,
      Math.min(1, (de?.burst || 0) * 0.12),
      E.post.params.tinnitus || 0,
    )),
      Be.setStress?.(Math.min(1, b0 + s * 0.4), Math.min(1, s + b0 * 0.3)));
  }
  if (((za -= e), za <= 0)) {
    ((za = 0.2),
      (Ca = wo
        ? Math.min(1, 0.08 + 1.5 * wo.ambientAt(E.camera.position))
        : 0.08 + 0.92 * qs(ue.collider.bvh, E.camera.position, 24)));
    const s = ue.zoneAt(_t.pos);
    (Be.setEnvironment(s ? s.type : "outdoor"),
      (E.post.params.exposureBias = !s ? 0.66 : /oscuro/.test(s.name) ? 0.34 : /quemado/.test(s.name) ? 0.34 : s.type === "indoor" ? 0.8 : s.type === "semi" ? 0.85 : 0.66));
  }
  (le.update(e, _t, Vo[0], Vo[1], wo ? 1 : Ca),
    updateGunFx(gfx, le, E.camera),
    E.quality.torchShadow && le.torch.intensity > 0.5 && (E.renderer.shadowMap.needsUpdate = !0),
    J.end(),
    J.begin("partículas"),
    xt.update(e, E.camera.position, Ca),
    J.end());
  const o = E.post.params;
  if (
    ((o.flash = Math.max(0, o.flash - e * 2.5)),
    (o.tinnitus = Math.max(0, o.tinnitus - e * 0.18)),
    (o.motionBlur = _t.sprint ? 1.3 : 1),
    (o.shake = Math.min(1, (_t.shake || 0) + (_t.sprint ? 0.25 : 0))),
    (breathV += (Math.abs(le.ads - adsPrev) / Math.max(e, 1e-3) - breathV) * Math.min(1, e * 9)),
    (adsPrev = le.ads),
    (o.breath = 1 + Math.min(0.02, breathV * 0.004) * Math.sin(a * 0.021)),
    (E.camera.fov = 78 - le.ads * 8 + (_t.sprint ? 3 : 0)),
    E.camera.updateProjectionMatrix(),
    (X("flash").style.opacity = Math.min(0.85, o.flash * 0.6).toFixed(3)),
    ue.scatter?.update(E.camera),
    J.begin("render submit"),
    J.beginGPU(),
    E.post.render(E.scene, E.camera, e),
    J.endGPU(),
    J.end(),
    E.updateDynamicResolution(t, a),
    J.frameEnd(t, a),
    (Si -= e) <= 0)
  ) {
    Si = 1;
    const s = new Date();
    X("stamp-time").textContent =
      s.toISOString().slice(0, 19).replace("T", " T") + "Z";
  }
}
let gfx = null;
let breathV = 0,
  adsPrev = 0;
let Si = 0,
  Oa = 0,
  b0 = 0,
  ki = performance.now();
window.__game = {
  engine: E,
  perf: J,
  step(a = 1, t = 1 / 60) {
    for (let e = 0; e < a; e++) ((ki += t * 1e3), Qa(ki));
  },
  setRunning(a) {
    ((Nt = a), X("menu").classList.toggle("hidden", a));
  },
  get fx() {
    return xt;
  },
  get audio() {
    return Be;
  },
  get browser() {
    return fs;
  },
  get world() {
    return ue;
  },
  get player() {
    return _t;
  },
  get weapons() {
    return de;
  },
  look,
  input: Dt,
  get gfx() {
    return gfx;
  },
  get vm() {
    return le;
  },
  startBench: Ja,
};
xh();
