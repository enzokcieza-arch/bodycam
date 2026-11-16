// ui/lookpanel.js — panel LOOK (se abre con F3 junto al de rendimiento): sliders en vivo para afinar la cámara.
// Los valores se guardan en localStorage ("bodycam-look") y se aplican al arrancar.
// Pulsa Esc para liberar el ratón y mover los sliders; "medir coste" apaga cada efecto 1,2 s y mide el Δ de GPU.

const KEY = "bodycam-look";

// [clave, etiqueta, min, max, paso, destino]   destino: "post" → engine.post.params · "atmo" → world.atmosphere.params
export const LOOK_CONTROLS = [
  ["LENTE"],
  ["fisheye", "ojo de pez (barril)", 0, 1, 0.01, "post"],
  ["chroma", "aberración cromática", 0, 3, 0.05, "post"],
  ["vignette", "viñeta", 0, 2, 0.05, "post"],
  ["halation", "halación (halo rojizo)", 0, 4, 0.05, "post"],
  ["veil", "velo / veiling glare", 0, 4, 0.05, "post"],
  ["lensDirt", "suciedad de lente", 0, 4, 0.05, "post"],
  ["bloom", "bloom", 0, 3, 0.05, "post"],
  ["sharpen", "nitidez", 0, 2, 0.05, "post"],
  ["SENSOR"],
  ["exposureComp", "compensación de exposición", 0.3, 2.5, 0.01, "post"],
  ["sensorGain", "quemado de altas luces", 0.5, 2, 0.01, "post"],
  ["blackCrush", "negros aplastados", 0, 1.5, 0.01, "post"],
  ["saturation", "saturación", 0, 1.6, 0.01, "post"],
  ["accent", "acento rojo/cálido", 0, 2, 0.05, "post"],
  ["grain", "grano (luma)", 0, 3, 0.05, "post"],
  ["chromaGrain", "ruido de croma", 0, 3, 0.05, "post"],
  ["VÍDEO"],
  ["compression", "compresión (macrobloques)", 0, 2, 0.05, "post"],
  ["rollingShutter", "rolling shutter", 0, 3, 0.05, "post"],
  ["motionBlurAmt", "motion blur", 0, 2, 0.05, "post"],
  ["ao", "oclusión ambiental (SSAO)", 0, 1.5, 0.05, "post"],
  ["ATMÓSFERA"],
  ["haze", "neblina / haze", 0, 3, 0.05, "atmo"],
  ["volumetric", "conos de luz volumétricos", 0, 3, 0.05, "atmo"],
  ["dust", "polvo en suspensión", 0, 3, 0.05, "atmo"],
  ["godrays", "god rays (huecos al cielo)", 0, 3, 0.05, "atmo"],
  ["wetness", "humedad de superficies", 0, 1.5, 0.05, "atmo"],
  ["grime", "mugre / hollín en muros", 0, 1.5, 0.05, "atmo"],
  ["emergency", "luces de emergencia rojas", 0, 3, 0.05, "atmo"],
];

// efectos que "medir coste" apaga uno a uno (clave → valor apagado)
const COST_TESTS = [
  ["compression", 0], ["lensDirt", 0], ["motionBlurAmt", 0], ["ao", 0], ["bloom", 0],
  ["volumetric", 0], ["dust", 0], ["haze", 0],
];

export class LookPanel {
  constructor(engine, getWorld, perf) {
    this.engine = engine;
    this.getWorld = getWorld;
    this.perf = perf;
    this.visible = false;
    this.saved = {};
    try { this.saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch {}
    this.el = document.createElement("div");
    this.el.id = "look";
    this.el.className = "hidden";
    document.body.appendChild(this.el);
    this.defaults = null;
  }
  target(dest) {
    return dest === "post" ? this.engine.post.params : this.getWorld()?.atmosphere?.params;
  }
  // aplica lo guardado (llamar cuando ya existen post y atmósfera)
  applySaved() {
    this.defaults = {};
    for (const c of LOOK_CONTROLS) {
      if (c.length < 2) continue;
      const [k, , , , , dest] = c, t = this.target(dest);
      if (!t) continue;
      this.defaults[k] = t[k];
      if (k !== "fisheye" && typeof this.saved[k] === "number") t[k] = this.saved[k];
    }
  }
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.saved)); } catch {}
  }
  toggle(v = !this.visible) {
    this.visible = v;
    this.el.classList.toggle("hidden", !v);
    if (v) this.render();
  }
  render() {
    const rows = LOOK_CONTROLS.map((c) => {
      if (c.length < 2) return `<h3>${c[0]}</h3>`;
      const [k, label, min, max, step, dest] = c, t = this.target(dest);
      if (!t || t[k] == null) return "";
      return `<label class="row"><span>${label}</span><input type="range" data-k="${k}" data-d="${dest}" min="${min}" max="${max}" step="${step}" value="${t[k]}"><b id="lk-${k}">${(+t[k]).toFixed(2)}</b></label>`;
    }).join("");
    this.el.innerHTML = `<h3>LOOK — cámara corporal (F3) · Esc libera el ratón</h3>${rows}
      <div><button id="lk-reset">restablecer</button><button id="lk-copy">copiar JSON</button><button id="lk-cost">medir coste GPU de efectos</button></div>
      <pre id="lk-msg"></pre>`;
    this.el.querySelectorAll("input[type=range]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const k = inp.dataset.k, t = this.target(inp.dataset.d), v = +inp.value;
        t[k] = v; this.saved[k] = v;
        this.el.querySelector("#lk-" + k).textContent = v.toFixed(2);
        if (k === "fisheye") {            // el ojo de pez también vive en el menú principal
          const m = document.getElementById("opt-fisheye");
          if (m) { m.value = v; m.dispatchEvent(new Event("change")); }
        }
        this.save();
      });
    });
    this.el.querySelector("#lk-reset").onclick = () => {
      for (const c of LOOK_CONTROLS) {
        if (c.length < 2) continue;
        const t = this.target(c[5]);
        if (t && this.defaults && this.defaults[c[0]] != null && c[0] !== "fisheye") t[c[0]] = this.defaults[c[0]];
      }
      this.saved = {}; this.save(); this.render();
    };
    this.el.querySelector("#lk-copy").onclick = async () => {
      const out = {};
      for (const c of LOOK_CONTROLS) if (c.length > 1) { const t = this.target(c[5]); if (t && t[c[0]] != null) out[c[0]] = +(+t[c[0]]).toFixed(3); }
      const txt = JSON.stringify(out, null, 1);
      try { await navigator.clipboard.writeText(txt); this.msg("copiado ✓"); } catch { this.msg(txt); }
      console.log("[look]", txt);
    };
    this.el.querySelector("#lk-cost").onclick = () => this.measureCosts();
  }
  msg(t) {
    const e = this.el.querySelector("#lk-msg");
    if (e) e.textContent = t;
  }
  // Coste por efecto: mide la GPU media con todo activo y con cada efecto apagado (necesita Chrome: timer de GPU).
  async measureCosts() {
    const perf = this.perf;
    if (!perf.gpuSupport) return this.msg("Sin EXT_disjoint_timer_query (usa Chrome): no puedo medir ms de GPU.");
    const sample = async (ms = 1200) => {
      await new Promise((r) => setTimeout(r, 250));
      const acc = []; const t0 = performance.now();
      while (performance.now() - t0 < ms) { await new Promise((r) => requestAnimationFrame(r)); if (perf.gpuMs != null) acc.push(perf.gpuMs); }
      acc.sort((a, b) => a - b);
      return acc.length ? acc[Math.floor(acc.length / 2)] : NaN;
    };
    this.msg("midiendo… (no muevas la cámara)");
    const base = await sample();
    const lines = [`GPU base: ${base.toFixed(2)} ms  (calidad ${this.engine.qualityKey}, ${this.engine.width}×${this.engine.height})`];
    for (const [k, off] of COST_TESTS) {
      const c = LOOK_CONTROLS.find((x) => x[0] === k); if (!c) continue;
      const t = this.target(c[5]); if (!t || t[k] == null) continue;
      const old = t[k]; t[k] = off;
      const v = await sample();
      t[k] = old;
      lines.push(`${c[1].padEnd(30)} ${(base - v >= 0 ? "+" : "") + (base - v).toFixed(2)} ms`);
      this.msg(lines.join("\n"));
    }
    lines.push("(Δ = lo que cuesta el efecto encendido; ±0,1 ms es ruido)");
    this.msg(lines.join("\n"));
    this.costReport = lines.join("\n");
    console.log(this.costReport);
  }
}
