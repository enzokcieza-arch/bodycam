// core/perf.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { rn } from "./input.js";

class Hr {
  constructor(t) {
    ((this.engine = t),
      (this.el = document.getElementById("perf")),
      (this.visible = !1),
      (this.frames = new Float32Array(2400)),
      (this.frameT = new Float64Array(2400)),
      (this.fi = 0),
      (this.fn = 0),
      (this.phase = {}),
      (this.phaseAvg = {}));
    for (const e of rn) ((this.phase[e] = 0), (this.phaseAvg[e] = 0));
    ((this.cpuAvg = 0),
      (this.gpuMs = null),
      (this.gpuAvg = null),
      (this.stats = { calls: 0, tris: 0 }),
      (this.lastPanel = 0),
      (this._t0 = 0),
      (this._cur = null),
      this.initGPUTimer(),
      (this.bench = null));
  }
  initGPUTimer() {
    const t = this.engine.renderer.getContext();
    ((this.gl = t),
      (this.ext = t.getExtension("EXT_disjoint_timer_query_webgl2")),
      (this.queries = []),
      (this.activeQuery = null),
      (this.gpuSupport = !!this.ext));
  }
  beginGPU() {
    if (!this.ext || this.activeQuery) return;
    const t = this.gl.createQuery();
    (this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, t), (this.activeQuery = t));
  }
  endGPU() {
    if (!this.activeQuery) return;
    (this.gl.endQuery(this.ext.TIME_ELAPSED_EXT),
      this.queries.push(this.activeQuery),
      (this.activeQuery = null));
    const t = this.gl;
    for (; this.queries.length;) {
      const e = this.queries[0];
      if (!t.getQueryParameter(e, t.QUERY_RESULT_AVAILABLE)) break;
      const o = t.getParameter(this.ext.GPU_DISJOINT_EXT),
        s = t.getQueryParameter(e, t.QUERY_RESULT);
      (t.deleteQuery(e),
        this.queries.shift(),
        o ||
          ((this.gpuMs = s / 1e6),
          (this.gpuAvg =
            this.gpuAvg == null
              ? this.gpuMs
              : this.gpuAvg * 0.95 + this.gpuMs * 0.05)));
    }
    if (this.queries.length > 8) {
      for (const e of this.queries) t.deleteQuery(e);
      this.queries.length = 0;
    }
  }
  frameStart(t) {
    ((this._frameStart = performance.now()), this.engine.renderer.info.reset());
  }
  begin(t) {
    ((this._cur = t), (this._t0 = performance.now()));
  }
  end(t = this._cur) {
    this.phase[t] = (this.phase[t] || 0) + performance.now() - this._t0;
  }
  frameEnd(t, e) {
    const o = performance.now() - this._frameStart;
    this.cpuAvg = this.cpuAvg * 0.95 + o * 0.05;
    for (const i of rn)
      ((this.phaseAvg[i] = this.phaseAvg[i] * 0.95 + this.phase[i] * 0.05),
        (this.phase[i] = 0));
    ((this.frames[this.fi] = t),
      (this.frameT[this.fi] = e),
      (this.fi = (this.fi + 1) % this.frames.length),
      (this.fn = Math.min(this.fn + 1, this.frames.length)));
    const s = this.engine.renderer.info;
    ((this.stats.calls = s.render.calls),
      (this.stats.tris = s.render.triangles),
      (this.stats.geos = s.memory.geometries),
      (this.stats.texs = s.memory.textures),
      this.bench && this.benchSample(t, o),
      this.visible &&
        e - this.lastPanel > 250 &&
        ((this.lastPanel = e), this.render(e)));
  }
  window(t, e = 1e4) {
    const o = [];
    for (let n = 0; n < this.fn; n++)
      t - this.frameT[n] <= e && o.push(this.frames[n]);
    o.sort((n, r) => n - r);
    const s = (n) =>
        o.length ? o[Math.min(o.length - 1, Math.floor(o.length * n))] : 0,
      i = o.reduce((n, r) => n + r, 0) / Math.max(1, o.length);
    return {
      n: o.length,
      fps: 1e3 / Math.max(0.01, i),
      avg: i,
      p50: s(0.5),
      p95: s(0.95),
      p99: s(0.99),
      worst: o[o.length - 1] || 0,
      hitches: o.filter((n) => n > 25).length,
    };
  }
  snapshot(t = performance.now()) {
    const e = this.window(t),
      o = this.engine.dynres,
      s = performance.memory
        ? (performance.memory.usedJSHeapSize / 1048576).toFixed(0) + " MB"
        : "n/d (Safari)";
    return {
      ...e,
      cpu: this.cpuAvg,
      gpu: this.gpuAvg,
      phases: { ...this.phaseAvg },
      calls: this.stats.calls,
      tris: this.stats.tris,
      geos: this.stats.geos,
      texs: this.stats.texs,
      mem: s,
      backend:
        this.engine.backend +
        (this.gpuSupport ? " (timer GPU ✓)" : " (sin timer GPU)"),
      quality: this.engine.quality.name,
      res: `${this.engine.width}×${this.engine.height}`,
      scale: this.engine.pixelScale().toFixed(2),
      dynres: o.enabled ? `ON paso ${o.steps[o.idx]}` : "OFF",
      dynChanges30s: o.changes.filter((i) => t - i < 3e4).length,
      ua: navigator.userAgent.replace(/^Mozilla\/5.0 /, ""),
    };
  }
  report(t) {
    const e = this.snapshot(t),
      o = [];
    if (
      (o.push(
        `BODYCAM TACTICAL · informe de rendimiento · ${new Date().toISOString()}`,
      ),
      o.push(
        `Backend: ${e.backend} · Calidad: ${e.quality} · Render: ${e.res} (escala ${e.scale}) · ResDin: ${e.dynres}, cambios 30 s: ${e.dynChanges30s}`,
      ),
      o.push(
        `FPS medio: ${e.fps.toFixed(1)} · frame p50 ${e.p50.toFixed(1)} / p95 ${e.p95.toFixed(1)} / p99 ${e.p99.toFixed(1)} ms · peor 10 s: ${e.worst.toFixed(1)} ms · frames >25 ms: ${e.hitches}`,
      ),
      o.push(
        `CPU frame: ${e.cpu.toFixed(2)} ms · GPU: ${e.gpu != null ? e.gpu.toFixed(2) + " ms" : "n/d"}`,
      ),
      o.push(
        "CPU por fase (ms): " +
          Object.entries(e.phases)
            .map(([s, i]) => `${s} ${i.toFixed(2)}`)
            .join(" · "),
      ),
      o.push(
        `Draw calls: ${e.calls} · Triángulos: ${e.tris.toLocaleString()} · Geometrías: ${e.geos} · Texturas: ${e.texs} · Memoria JS: ${e.mem}`,
      ),
      this.benchResults?.length)
    ) {
      (o.push(
        "",
        "BENCH (?bench) — 10 s por posición, 1.5 s de calentamiento descartado",
      ),
        o.push(
          "posición            | FPS   | p50   | p95   | p99   | peor  | >25ms | draws | tris     | CPU ms | GPU ms",
        ));
      for (const s of this.benchResults)
        o.push(
          `${s.name.padEnd(19)} | ${s.fps.toFixed(1).padStart(5)} | ${s.p50.toFixed(1).padStart(5)} | ${s.p95.toFixed(1).padStart(5)} | ${s.p99.toFixed(1).padStart(5)} | ${s.worst.toFixed(1).padStart(5)} | ${String(s.hitches).padStart(5)} | ${String(Math.round(s.calls)).padStart(5)} | ${String(Math.round(s.tris)).padStart(8)} | ${s.cpu.toFixed(2).padStart(6)} | ${s.gpu != null ? s.gpu.toFixed(2).padStart(6) : "   n/d"}`,
        );
    }
    return (
      o.push(`UA: ${e.ua}`),
      o.join(`
`)
    );
  }
  toggle() {
    ((this.visible = !this.visible),
      this.el.classList.toggle("hidden", !this.visible),
      this.visible && this.render(performance.now()));
  }
  render(t) {
    const e = this.snapshot(t),
      o = (r, l, u) => (r > u ? "bad" : r > l ? "warn" : "ok"),
      s = (r, l, u = "") =>
        `<div class="row"><span>${r}</span><span class="${u}">${l}</span></div>`;
    ((this.el.innerHTML = `
      <h3>RENDIMIENTO (F3)</h3>
      ${s("FPS medio (10 s)", e.fps.toFixed(1), e.fps < 30 ? "bad" : e.fps < 55 ? "warn" : "ok")}
      ${s("frame p50 / p95 / p99", `${e.p50.toFixed(1)} / ${e.p95.toFixed(1)} / ${e.p99.toFixed(1)} ms`, o(e.p99, 18, 25))}
      ${s("peor frame 10 s · frames >25 ms", `${e.worst.toFixed(1)} ms · ${e.hitches}`, o(e.worst, 25, 40))}
      <canvas id="perf-graph" width="400" height="50"></canvas>
      <h3>CPU / GPU</h3>
      ${s("CPU frame", e.cpu.toFixed(2) + " ms", o(e.cpu, 8, 14))}
      ${s("GPU", e.gpu != null ? e.gpu.toFixed(2) + " ms" : "n/d (sin EXT_disjoint_timer_query)", e.gpu != null ? o(e.gpu, 12, 16) : "")}
      ${Object.entries(e.phases)
        .map(([r, l]) => s("· " + r, l.toFixed(2) + " ms"))
        .join("")}
      <h3>ESCENA</h3>
      ${s("draw calls", e.calls, o(e.calls, 250, 500))}${s("triángulos", e.tris.toLocaleString())}
      ${s("geometrías / texturas vivas", `${e.geos} / ${e.texs}`)}${s("memoria JS", e.mem)}
      <h3>BACKEND</h3>
      ${s("backend", e.backend)}${s("calidad", e.quality)}${s("resolución interna", `${e.res} (×${e.scale})`)}
      ${s("resolución dinámica", e.dynres)}${s("cambios últimos 30 s", e.dynChanges30s, e.dynChanges30s > 2 ? "warn" : "ok")}
      <div><button id="perf-copy">copiar informe</button><button id="perf-bench">ejecutar bench</button><button id="perf-dyn">res. dinámica on/off</button></div>
      <div id="perf-msg" style="opacity:.7;margin-top:4px"></div>`),
      (this.el.querySelector("#perf-copy").onclick = () => this.copy()),
      (this.el.querySelector("#perf-bench").onclick = () => this.onBench?.()),
      (this.el.querySelector("#perf-dyn").onclick = () => {
        ((this.engine.dynres.enabled = !this.engine.dynres.enabled),
          (this.engine.dynres.idx = 0),
          this.engine.resize());
      }));
    const i = this.el.querySelector("#perf-graph"),
      n = i.getContext("2d");
    ((n.fillStyle = "#000"),
      n.fillRect(0, 0, 400, 50),
      (n.strokeStyle = "#335"),
      n.beginPath(),
      n.moveTo(0, 50 - 16.7),
      n.lineTo(400, 50 - 16.7),
      n.moveTo(0, 50 - 33.3),
      n.lineTo(400, 50 - 33.3),
      n.stroke());
    for (let r = 0; r < 400; r++) {
      const l = (this.fi - 400 + r + this.frames.length) % this.frames.length,
        u = this.frames[l];
      u &&
        ((n.fillStyle = u > 25 ? "#f55" : u > 17.5 ? "#fd5" : "#5f8"),
        n.fillRect(r, 50 - Math.min(50, u), 1, Math.min(50, u)));
    }
  }
  async copy() {
    const t = this.report(performance.now());
    try {
      (await navigator.clipboard.writeText(t),
        this.msg("Informe copiado al portapapeles ✓"));
    } catch {
      const o = document.createElement("textarea");
      ((o.value = t), document.body.appendChild(o), o.select());
      try {
        (document.execCommand("copy"), this.msg("Informe copiado ✓"));
      } catch {
        this.msg("No se pudo copiar: está en la consola");
      }
      o.remove();
    }
    console.log(t);
  }
  msg(t) {
    const e = this.el.querySelector("#perf-msg");
    e && (e.textContent = t);
  }
  startBench(t, e) {
    ((this.bench = { points: t, teleport: e, idx: -1, t: 0, samples: null }),
      (this.benchResults = []),
      this.nextBenchPoint());
  }
  nextBenchPoint() {
    const t = this.bench;
    if (t.samples) {
      const e = t.samples.frames.sort((n, r) => n - r),
        o = (n) => e[Math.min(e.length - 1, Math.floor(e.length * n))],
        s = e.reduce((n, r) => n + r, 0) / e.length,
        i = (n) =>
          t.samples[n].reduce((r, l) => r + l, 0) /
          Math.max(1, t.samples[n].length);
      this.benchResults.push({
        name: t.points[t.idx].name,
        fps: 1e3 / s,
        p50: o(0.5),
        p95: o(0.95),
        p99: o(0.99),
        worst: e[e.length - 1],
        hitches: e.filter((n) => n > 25).length,
        calls: i("calls"),
        tris: i("tris"),
        cpu: i("cpu"),
        gpu: t.samples.gpu.length ? i("gpu") : null,
      });
    }
    if ((t.idx++, t.idx >= t.points.length)) {
      this.bench = null;
      const e = this.report(performance.now());
      (console.log(e), this.onBenchDone?.(e));
      return;
    }
    ((t.t = 0),
      (t.samples = { frames: [], calls: [], tris: [], cpu: [], gpu: [] }),
      t.teleport(t.points[t.idx]));
  }
  benchSample(t, e) {
    const o = this.bench;
    ((o.t += t / 1e3),
      !(o.t < 1.5) &&
        (o.samples.frames.push(t),
        o.samples.calls.push(this.stats.calls),
        o.samples.tris.push(this.stats.tris),
        o.samples.cpu.push(e),
        this.gpuMs != null && o.samples.gpu.push(this.gpuMs),
        o.t >= 11.5 && this.nextBenchPoint()));
  }
}

export { Hr };
