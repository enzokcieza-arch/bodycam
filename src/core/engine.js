// core/engine.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { W as cr, c as Ti, k as zi, v as Te, w as hr } from "three-vendor";
import { Er, nn } from "../render/postprocess.js";

class Gr {
  constructor(t, e = "medium") {
    ((this.canvas = t),
      (this.renderer = new cr({
        canvas: t,
        antialias: !1,
        powerPreference: "high-performance",
        stencil: !1,
        alpha: !1,
      })),
      (this.renderer.outputColorSpace = Te),
      (this.renderer.toneMapping = hr),
      (this.renderer.shadowMap.enabled = !0),
      // v3.0: sombras por luz (shadow.autoUpdate): antes, con la linterna con sombras, se re-renderizaba cada frame
      // también el mapa de la luna (4096², ~1250 objetos). Ahora la luna solo se actualiza bajo demanda.
      (this.renderer.shadowMap.autoUpdate = !0),
      (this.renderer.info.autoReset = !1),
      (this.backend = "WebGL2"),
      (this.scene = new Ti()),
      (this.camera = new zi(78, 16 / 9, 0.03, 400)),
      (this.camera.rotation.order = "YXZ"),
      this.scene.add(this.camera),
      (this.qualityKey = e),
      (this.quality = nn[e]),
      (this.dynres = {
        enabled: !1,
        steps: [1, 0.85, 0.7],
        idx: 0,
        changes: [],
        lastChange: 0,
        window: [],
        combatUntil: 0,
      }),
      (this.post = new Er(this)),
      this.resize(),
      addEventListener("resize", () => this.resize()));
  }
  setQuality(t) {
    ((this.qualityKey = t),
      (this.quality = nn[t]),
      (this.renderer.shadowMap.type = this.quality.shadowType),
      this.resize(),
      this.post.rebuild());
  }
  pixelScale() {
    return (
      Math.min(devicePixelRatio || 1, this.quality.maxDpr) *
      this.quality.scale *
      (this.dynres.enabled ? this.dynres.steps[this.dynres.idx] : 1)
    );
  }
  resize() {
    const t = innerWidth,
      e = innerHeight;
    (this.renderer.setPixelRatio(1),
      this.renderer.setSize(t, e, !1),
      (this.canvas.style.width = t + "px"),
      (this.canvas.style.height = e + "px"));
    const o = this.pixelScale();
    ((this.width = Math.max(320, Math.round(t * o))),
      (this.height = Math.max(180, Math.round(e * o))),
      this.renderer.setSize(
        Math.round(t * Math.min(devicePixelRatio || 1, this.quality.maxDpr)),
        Math.round(e * Math.min(devicePixelRatio || 1, this.quality.maxDpr)),
        !1,
      ),
      (this.camera.aspect = t / e),
      this.camera.updateProjectionMatrix(),
      this.post.setSize(this.width, this.height));
  }
  updateDynamicResolution(t, e) {
    const o = this.dynres;
    if (!o.enabled || (o.window.push(t), o.window.length < 180)) return;
    const s = [...o.window].sort((l, u) => l - u);
    o.window.length = 0;
    const i = s[Math.floor(s.length * 0.9)];
    if (e < o.combatUntil || e - o.lastChange < 8e3) return;
    const n = 1e3 / 60;
    let r = o.idx;
    (i > n * 1.25 && r < o.steps.length - 1 ? r++ : i < n * 0.7 && r > 0 && r--,
      r !== o.idx &&
        ((o.idx = r), (o.lastChange = e), o.changes.push(e), this.resize()));
  }
  updateShadows() {
    this.renderer.shadowMap.needsUpdate = !0;
    this.sun && (this.sun.shadow.needsUpdate = !0);
  }
}

export { Gr };
