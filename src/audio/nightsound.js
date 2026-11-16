// audio/nightsound.js — diseño de sonido nocturno de terror (v3.0). Todo sintetizado (Web Audio), sin assets.
//
//  · Fuentes 3D (PannerNode HRTF) en las luces cercanas: zumbido de fluorescentes que chisporrotea al parpadear,
//    relé + zumbido de balizas rojas, neón de los carteles de SALIDA, siseo crepitante de bengalas. Un pool de
//    voces se reasigna a las fuentes más cercanas (las luces apagadas/fundidas callan).
//  · Capa ambiental por tipo de zona: grillos y ráfagas de viento que silban en exteriores, búho en el bosque,
//    goteo con eco en interiores.
//  · Sustos raros (cada 25–70 s): portazo lejano, tres golpes en una pared, pasos corriendo en otra planta,
//    radio policial distorsionada, gemido metálico del edificio.
// Se engancha a la instancia de audio existente (audio/audio.js): usa su contexto, su reverb y su compresor.

const VOICES = 4;
const RANGE = 14;

export class NightSound {
  constructor(audio, world, night, camera) {
    this.a = audio;
    this.world = world;
    this.night = night;
    this.camera = camera;
    this.started = false;
    this.zoneType = "outdoor";
    this.forest = false;
    this.t = 0;
    this._fwd = { x: 0, y: 0, z: -1 };
  }

  start() {
    const a = this.a, ctx = a.ctx;
    if (!ctx || this.started) return;
    this.started = true;
    // bus propio (pasa por master → compresor; con envío a la reverb del motor)
    this.bus = ctx.createGain();
    this.bus.gain.value = 1;
    this.bus.connect(a.master);
    this.rev = ctx.createGain();
    this.rev.gain.value = 0.5;
    this.bus.connect(this.rev);
    this.rev.connect(a.send);
    this.noise = a.noise;
    this.voices = [];
    for (let i = 0; i < VOICES; i++) this.voices.push(this.makeVoice());
    this.startWind();
    this.schedule("crickets", 0.3, () => this.crickets());
    this.schedule("drip", 2, () => this.drip());
    this.schedule("owl", 18, () => this.owl());
    this.schedule("scare", 25 + Math.random() * 20, () => this.scare());
    // los pájaros del ambiente diurno de v2.5 no tienen sentido de noche
    a.noBirds = true;
  }

  schedule(name, delay, fn) {
    setTimeout(() => {
      let next = 5;
      try { next = fn() ?? 5; } catch (e) { console.warn("[nightsound]", name, e); }
      this.schedule(name, next, fn);
    }, delay * 1000);
  }

  // ── voz 3D reutilizable: oscilador "eléctrico" + ruido filtrado → panner
  makeVoice() {
    const ctx = this.a.ctx;
    const pan = ctx.createPanner();
    Object.assign(pan, { panningModel: "HRTF", distanceModel: "inverse", refDistance: 1.2, maxDistance: 40, rolloffFactor: 1.6 });
    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(pan);
    pan.connect(this.bus);
    // zumbido: diente de sierra a 2× la red (100/120 Hz) → paso banda
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = 120;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.8;
    const og = ctx.createGain();
    og.gain.value = 0;
    osc.connect(bp); bp.connect(og); og.connect(out);
    osc.start();
    // ruido (siseo de bengala / chisporroteo)
    const ns = ctx.createBufferSource();
    ns.buffer = this.noise; ns.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = "highpass"; nf.frequency.value = 2500;
    const ng = ctx.createGain();
    ng.gain.value = 0;
    ns.connect(nf); nf.connect(ng); ng.connect(out);
    ns.start(0, Math.random());
    return { pan, out, osc, bp, og, ng, nf, spec: null, kind: null };
  }

  setZone(z) {
    this.zoneType = z ? z.type : "outdoor";
    this.forest = !!(z && /bosque/.test(z.name));
  }

  update(dt) {
    const a = this.a, ctx = a.ctx;
    if (!ctx) return;
    if (!this.started) { if (ctx.state === "running") this.start(); else return; }
    this.t += dt;
    const now = ctx.currentTime;
    // oyente = cámara
    const c = this.camera, L = ctx.listener;
    c.getWorldDirection(this._dir || (this._dir = c.position.clone()));
    const d = this._dir;
    if (L.positionX) {
      L.positionX.setTargetAtTime(c.position.x, now, 0.02); L.positionY.setTargetAtTime(c.position.y, now, 0.02); L.positionZ.setTargetAtTime(c.position.z, now, 0.02);
      L.forwardX.setTargetAtTime(d.x, now, 0.02); L.forwardY.setTargetAtTime(d.y, now, 0.02); L.forwardZ.setTargetAtTime(d.z, now, 0.02);
      L.upX.value = 0; L.upY.value = 1; L.upZ.value = 0;
    } else { L.setPosition(c.position.x, c.position.y, c.position.z); L.setOrientation(d.x, d.y, d.z, 0, 1, 0); }

    // reasignar voces a las fuentes más cercanas cada ~0.3 s
    if ((this._re = (this._re || 0) - dt) <= 0) {
      this._re = 0.3;
      const p = c.position, cand = [];
      for (const s of this.world.lightSpecs) {
        if (s.dead) continue;
        const kind = s.night || (s.emergency ? "beacon" : "fluo");
        const d2 = (s.pos[0] - p.x) ** 2 + (s.pos[1] - p.y) ** 2 + (s.pos[2] - p.z) ** 2;
        if (d2 < RANGE * RANGE) cand.push([d2, s, kind]);
      }
      cand.sort((x, y) => x[0] - y[0]);
      const want = cand.slice(0, VOICES).map((x) => x[1]);
      // liberar voces cuyas fuentes ya no están entre las elegidas
      for (const v of this.voices) if (v.spec && !want.includes(v.spec)) { v.spec = null; v.out.gain.setTargetAtTime(0, now, 0.15); }
      for (const [, s, kind] of cand.slice(0, VOICES)) {
        if (this.voices.some((v) => v.spec === s)) continue;
        const v = this.voices.find((x) => !x.spec);
        if (!v) break;
        v.spec = s; v.kind = kind;
        const [x, y, z] = s.pos;
        if (v.pan.positionX) { v.pan.positionX.value = x; v.pan.positionY.value = y; v.pan.positionZ.value = z; } else v.pan.setPosition(x, y, z);
        // timbre por tipo
        if (kind === "flare") { v.osc.frequency.value = 60; v.og.gain.value = 0; v.nf.frequency.value = 1800; }
        else if (kind === "beacon") { v.osc.frequency.value = 50 + Math.random() * 10; v.bp.frequency.value = 300; }
        else if (kind === "exit") { v.osc.frequency.value = 120; v.bp.frequency.value = 2400; v.bp.Q.value = 3; }
        else { v.osc.frequency.value = Math.random() < 0.5 ? 100 : 120; v.bp.frequency.value = 700 + Math.random() * 600; v.bp.Q.value = 0.9; }
      }
    }
    // modulación por frame según el estado de cada luz
    for (const v of this.voices) {
      const s = v.spec;
      if (!s) continue;
      const base = s.base || s.intensity || 1;
      const lvl = Math.max(0, Math.min(1.5, (s.intensity || 0) / base));
      let hum = 0, hiss = 0, vol = 1;
      if (v.kind === "flare") { hum = 0; hiss = 0.10 * (0.6 + 0.6 * Math.random()); vol = 1; }
      else if (v.kind === "beacon") { hum = 0.025 + 0.02 * lvl; hiss = lvl > 0.9 ? 0.02 : 0; vol = 0.9; }
      else if (v.kind === "exit") { hum = 0.012 * lvl; hiss = lvl < 0.5 ? 0.05 : 0; vol = 0.8; }
      else {
        // fluorescente: zumbido constante; al caer (parpadeo) chasquido de arco
        const flick = s.flicker ? (s._lvl ?? 1) : 1;
        hum = 0.03 * flick;
        hiss = flick < 0.5 ? 0.09 : 0;
        if (flick < 0.5 && !v._wasOff) this.zap(v);
        v._wasOff = flick < 0.5;
      }
      v.og.gain.setTargetAtTime(hum, now, 0.03);
      v.ng.gain.setTargetAtTime(hiss, now, 0.015);
      v.out.gain.setTargetAtTime(vol, now, 0.1);
    }
    // viento: más fuerte fuera, apagado dentro
    if (this.windG) {
      const w = this.zoneType === "indoor" ? 0.18 : this.zoneType === "semi" ? 0.5 : 1;
      this.windG.gain.setTargetAtTime(w, now, 0.8);
    }
  }

  zap(v) {
    const ctx = this.a.ctx, t = ctx.currentTime;
    const s = ctx.createBufferSource();
    s.buffer = this.noise;
    const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3200; f.Q.value = 1.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.05);
    s.connect(f); f.connect(g); g.connect(v.out);
    s.start(t, Math.random(), 0.06);
  }

  // ── viento con ráfagas y silbido (resonancia que se mueve)
  startWind() {
    const ctx = this.a.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.a.makeNoise(6); src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 500;
    const howl = ctx.createBiquadFilter(); howl.type = "bandpass"; howl.frequency.value = 700; howl.Q.value = 14;
    const gBody = ctx.createGain(); gBody.gain.value = 0.05;
    const gHowl = ctx.createGain(); gHowl.gain.value = 0.0;
    this.windG = ctx.createGain(); this.windG.gain.value = 1;
    src.connect(lp); lp.connect(gBody); gBody.connect(this.windG);
    src.connect(howl); howl.connect(gHowl); gHowl.connect(this.windG);
    this.windG.connect(this.bus);
    src.start();
    const gust = () => {
      const t = ctx.currentTime, dur = 3 + Math.random() * 6, peak = 0.05 + Math.random() * 0.09;
      gBody.gain.cancelScheduledValues(t);
      gBody.gain.setTargetAtTime(peak, t, dur * 0.25);
      gBody.gain.setTargetAtTime(0.035, t + dur * 0.6, dur * 0.3);
      lp.frequency.setTargetAtTime(400 + Math.random() * 700, t, dur * 0.3);
      // silbido: solo en algunas ráfagas, con el tono deslizándose (esquinas, ventanas rotas)
      if (Math.random() < 0.45) {
        const f0 = 450 + Math.random() * 500;
        howl.frequency.setValueAtTime(f0, t);
        howl.frequency.linearRampToValueAtTime(f0 * (1.2 + Math.random() * 0.5), t + dur * 0.5);
        howl.frequency.linearRampToValueAtTime(f0 * 0.9, t + dur);
        gHowl.gain.cancelScheduledValues(t);
        gHowl.gain.setTargetAtTime(0.035 + Math.random() * 0.04, t, dur * 0.2);
        gHowl.gain.setTargetAtTime(0, t + dur * 0.55, dur * 0.25);
      }
      setTimeout(gust, (dur + Math.random() * 5) * 1000);
    };
    gust();
  }

  // ── grillos (exteriores): trenes de chirridos a ~4.6 kHz, varios individuos a distintas distancias
  crickets() {
    if (this.zoneType === "indoor") return 1.5;
    const ctx = this.a.ctx, t0 = ctx.currentTime;
    const f = 4300 + Math.random() * 700, pan = Math.random() * 2 - 1, vol = (this.forest ? 0.012 : 0.007) * (0.4 + Math.random());
    const trains = 2 + Math.floor(Math.random() * 3);
    for (let k = 0; k < trains; k++) {
      const tk = t0 + k * (0.42 + Math.random() * 0.1);
      for (let i = 0; i < 4; i++) {
        const t = tk + i * 0.032;
        const o = ctx.createOscillator(); o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.026);
        o.connect(g); o.start(t); o.stop(t + 0.03);
        this.a._out(g, 1, pan, 0.3);
      }
    }
    return 0.25 + Math.random() * 1.2;
  }

  owl() {
    if (!this.forest) return 12;
    const ctx = this.a.ctx, t0 = ctx.currentTime, pan = Math.random() * 2 - 1;
    for (const [dt, len, f] of [[0, 0.25, 390], [0.45, 0.18, 370], [0.7, 0.5, 380]]) {
      const t = t0 + dt, o = ctx.createOscillator();
      o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.92, t + len);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.05); g.gain.linearRampToValueAtTime(0, t + len);
      o.connect(g); o.start(t); o.stop(t + len + 0.05);
      this.a._out(g, 1, pan, 1.6);
    }
    return 20 + Math.random() * 30;
  }

  // ── goteo en interiores (gota + resonancia del charco, con mucha reverb)
  drip() {
    if (this.zoneType === "outdoor" && !this.forest) return 3;
    const ctx = this.a.ctx, t = ctx.currentTime, pan = Math.random() * 1.6 - 0.8;
    const n = this.zoneType === "indoor" ? 1 + Math.floor(Math.random() * 2) : 1;
    for (let i = 0; i < n; i++) {
      const ti = t + i * (0.3 + Math.random() * 0.5);
      const o = ctx.createOscillator(), f = 900 + Math.random() * 900;
      o.frequency.setValueAtTime(f, ti); o.frequency.exponentialRampToValueAtTime(f * 2.2, ti + 0.05);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, ti); g.gain.linearRampToValueAtTime(0.03, ti + 0.003); g.gain.exponentialRampToValueAtTime(1e-4, ti + 0.09);
      o.connect(g); o.start(ti); o.stop(ti + 0.1);
      this.a._out(g, 1, pan, 2.2, 0.4);
    }
    return 0.8 + Math.random() * 3.5;
  }

  // ── sustos (raros): nunca dos seguidos iguales
  scare() {
    if (this.a.ctx.state !== "running") return 10;
    const all = ["slam", "knock", "running", "radio", "groan"];
    const opts = all.filter((x) => x !== this._lastScare);
    const k = opts[Math.floor(Math.random() * opts.length)];
    this._lastScare = k;
    this[k]();
    return 25 + Math.random() * 45;
  }
  slam() {
    const ctx = this.a.ctx, t = ctx.currentTime, pan = Math.random() * 2 - 1;
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.4);
    o.connect(g); o.start(t); o.stop(t + 0.45);
    const n = this.a._noiseSrc(t, 0.12, 0.6), f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1200;
    const gn = ctx.createGain(); gn.gain.setValueAtTime(0.25, t); gn.gain.exponentialRampToValueAtTime(1e-4, t + 0.15);
    n.connect(f); f.connect(gn);
    this.a._out(g, 1, pan, 2.4, 1); this.a._out(gn, 1, pan, 2.4, 1);
  }
  knock() {
    const ctx = this.a.ctx, t0 = ctx.currentTime, pan = Math.random() < 0.5 ? -0.7 : 0.7;
    for (let i = 0; i < 3; i++) {
      const t = t0 + i * (0.38 + (i === 2 ? 0.25 : 0));
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(70, t + 0.08);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.14);
      o.connect(g); o.start(t); o.stop(t + 0.15);
      this.a._out(g, 1, pan, 1.6);
    }
  }
  running() {
    const ctx = this.a.ctx, t0 = ctx.currentTime, p0 = Math.random() < 0.5 ? -1 : 1;
    const n = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i < n; i++) {
      const t = t0 + i * 0.27, s = this.a._noiseSrc(t, 0.08, 0.5);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380;   // a través del forjado: solo graves
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.008); g.gain.exponentialRampToValueAtTime(1e-4, t + 0.09);
      s.connect(f); f.connect(g);
      this.a._out(g, 1, p0 * (1 - (2 * i) / n), 1.2);
    }
  }
  radio() {
    // radio de la bodycam: chirrido de squelch + "voz" ininteligible (ruido con formantes) + squelch de cierre
    const ctx = this.a.ctx, t0 = ctx.currentTime;
    const beep = (t, f) => { const o = ctx.createOscillator(); o.frequency.value = f; const g = ctx.createGain(); g.gain.setValueAtTime(0.03, t); g.gain.setValueAtTime(0, t + 0.08); o.connect(g); o.start(t); o.stop(t + 0.1); this.a._out(g, 1, -0.1, 0.1); };
    beep(t0, 1650);
    const dur = 1.2 + Math.random() * 1.6, s = this.a._noiseSrc(t0 + 0.12, dur, 1);
    const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.Q.value = 4;
    const f2 = ctx.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1900; f2.Q.value = 2;
    const g = ctx.createGain(); g.gain.value = 0;
    for (let t = 0; t < dur; t += 0.09) {
      f1.frequency.setValueAtTime(400 + Math.random() * 700, t0 + 0.12 + t);
      g.gain.setValueAtTime(Math.random() < 0.75 ? 0.05 + Math.random() * 0.05 : 0.005, t0 + 0.12 + t);
    }
    g.gain.setValueAtTime(0, t0 + 0.12 + dur);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 350;
    s.connect(f1); s.connect(f2); f1.connect(hp); f2.connect(hp); hp.connect(g);
    this.a._out(g, 1, -0.1, 0.05);
    const sq = this.a._noiseSrc(t0 + 0.14 + dur, 0.18, 1.2), gs = ctx.createGain();
    gs.gain.setValueAtTime(0.04, t0 + 0.14 + dur); gs.gain.exponentialRampToValueAtTime(1e-4, t0 + 0.32 + dur);
    sq.connect(gs); this.a._out(gs, 1, -0.1, 0.05);
  }
  groan() {
    // el edificio "gime": metal y hormigón bajo tensión, muy grave y largo
    const ctx = this.a.ctx, t = ctx.currentTime, dur = 3 + Math.random() * 3;
    const o = ctx.createOscillator(); o.type = "sawtooth";
    const f = 38 + Math.random() * 20;
    o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 0.7, t + dur);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 260; lp.Q.value = 6;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + dur * 0.3); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp); lp.connect(g); o.start(t); o.stop(t + dur);
    this.a._out(g, 1, Math.random() * 2 - 1, 2.5, 0.5);
  }
}
