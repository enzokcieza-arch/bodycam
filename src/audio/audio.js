// audio/audio.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)

class dh {
  constructor() {
    ((this.ctx = null), (this.volume = 0.8), (this.env = "outdoor"));
  }
  init() {
    if (this.ctx) {
      this.ctx.resume();
      return;
    }
    const t = window.AudioContext || window.webkitAudioContext,
      e = (this.ctx = new t({ latencyHint: "interactive" }));
    ((this.master = e.createGain()),
      (this.master.gain.value = this.volume),
      (this.muffle = e.createBiquadFilter()),
      (this.muffle.type = "lowpass"),
      (this.muffle.frequency.value = 2e4),
      (this.shaper = e.createWaveShaper()),
      (this.shaper.curve = this.makeCurve(2.2)),
      (this.shaper.oversample = "2x"),
      (this.comp = e.createDynamicsCompressor()),
      (this.comp.threshold.value = -14),
      (this.comp.ratio.value = 6),
      (this.comp.attack.value = 0.002),
      (this.comp.release.value = 0.25),
      this.master.connect(this.muffle),
      this.muffle.connect(this.shaper),
      this.shaper.connect(this.comp),
      this.comp.connect(e.destination),
      (this.dry = e.createGain()),
      this.dry.connect(this.master),
      (this.reverbOut = e.createConvolver()),
      (this.reverbIn = e.createConvolver()),
      (this.wetOut = e.createGain()),
      (this.wetIn = e.createGain()),
      (this.reverbOut.buffer = this.makeIR(3.6, 2.2, !0)),
      (this.reverbIn.buffer = this.makeIR(1.3, 3.5, !1)),
      this.reverbOut.connect(this.wetOut),
      this.reverbIn.connect(this.wetIn),
      this.wetOut.connect(this.master),
      this.wetIn.connect(this.master),
      (this.send = e.createGain()),
      this.send.connect(this.reverbOut),
      this.send.connect(this.reverbIn),
      (this.echo = e.createDelay(2)),
      (this.echo.delayTime.value = 0.42),
      (this.echoFb = e.createGain()),
      (this.echoFb.gain.value = 0.28),
      (this.echoLP = e.createBiquadFilter()),
      (this.echoLP.type = "lowpass"),
      (this.echoLP.frequency.value = 1400),
      (this.echoGain = e.createGain()),
      (this.echoGain.gain.value = 0.35),
      (this.echoSend = e.createGain()),
      this.echoSend.connect(this.echo),
      this.echo.connect(this.echoLP),
      this.echoLP.connect(this.echoFb),
      this.echoFb.connect(this.echo),
      this.echoLP.connect(this.echoGain),
      this.echoGain.connect(this.reverbOut),
      this.echoGain.connect(this.master),
      (this.noise = this.makeNoise(2)),
      this.setEnvironment("outdoor", !0),
      this.startAmbience(),
      this.startTension());
  }
  setVolume(t) {
    ((this.volume = t), this.master && (this.master.gain.value = t));
  }
  setEnvironment(t, e = !1) {
    if (!this.ctx || (t === this.env && !e)) return;
    this.env = t;
    const o = this.ctx.currentTime,
      s = e ? 0.01 : 0.6,
      i = t === "outdoor" ? 0.55 : t === "semi" ? 0.35 : 0.12,
      n = t === "indoor" ? 0.75 : t === "semi" ? 0.4 : 0.05;
    (this.wetOut.gain.setTargetAtTime(i, o, s),
      this.wetIn.gain.setTargetAtTime(n, o, s),
      this.echoGain.gain.setTargetAtTime(t === "indoor" ? 0.08 : 0.35, o, s));
  }
  makeCurve(t) {
    const o = new Float32Array(2048);
    for (let s = 0; s < 2048; s++) {
      const i = (s / 2048) * 2 - 1;
      o[s] = Math.tanh(t * i) / Math.tanh(t);
    }
    return o;
  }
  makeNoise(t) {
    const e = this.ctx.createBuffer(
        1,
        this.ctx.sampleRate * t,
        this.ctx.sampleRate,
      ),
      o = e.getChannelData(0);
    for (let s = 0; s < o.length; s++) o[s] = Math.random() * 2 - 1;
    return e;
  }
  makeIR(t, e, o) {
    const s = this.ctx.sampleRate,
      i = Math.floor(s * t),
      n = this.ctx.createBuffer(2, i, s);
    for (let r = 0; r < 2; r++) {
      const l = n.getChannelData(r);
      let u = 0;
      for (let h = 0; h < i; h++) {
        const c = h / s,
          d = Math.pow(1 - c / t, e) * (c < 0.008 ? c / 0.008 : 1),
          p = Math.random() * 2 - 1;
        ((u += (p - u) * (0.25 + 0.6 * (1 - c / t))), (l[h] = u * d * 0.6));
      }
      if (o)
        for (const [h, c] of [
          [0.045, 0.5],
          [0.11, 0.42],
          [0.19, 0.35],
          [0.31, 0.3],
          [0.52, 0.22],
          [0.8, 0.14],
          [1.25, 0.08],
        ]) {
          const d = Math.floor((h + r * 0.007 + Math.random() * 0.004) * s);
          for (let p = 0; p < 400 && d + p < i; p++)
            l[d + p] += (Math.random() * 2 - 1) * c * Math.exp(-p / 80);
        }
    }
    return n;
  }
  _noiseSrc(t, e, o = 1) {
    const s = this.ctx.createBufferSource();
    return (
      (s.buffer = this.noise),
      (s.playbackRate.value = o),
      s.start(t, Math.random() * 1.5, e),
      s
    );
  }
  _out(t, e, o = 0, s = 1, i = 0) {
    const n = this.ctx.createGain();
    n.gain.value = e;
    const r = this.ctx.createStereoPanner();
    if (
      ((r.pan.value = Math.max(-1, Math.min(1, o))),
      t.connect(n),
      n.connect(r),
      r.connect(this.dry),
      s > 0)
    ) {
      const l = this.ctx.createGain();
      ((l.gain.value = s), r.connect(l), l.connect(this.send));
    }
    if (i > 0) {
      const l = this.ctx.createGain();
      ((l.gain.value = i), r.connect(l), l.connect(this.echoSend));
    }
    return n;
  }
  gunshot(t = 0, e = 0) {
    if (!this.ctx) return;
    const o = this.ctx,
      s = o.currentTime,
      i = 1 / (1 + t * 0.06),
      n = this._noiseSrc(s, 0.03, 1.4),
      r = o.createBiquadFilter();
    ((r.type = "highpass"), (r.frequency.value = 2500));
    const l = o.createGain();
    (l.gain.setValueAtTime(1, s),
      l.gain.exponentialRampToValueAtTime(0.001, s + 0.03),
      n.connect(r),
      r.connect(l),
      this._out(l, 0.9 * i, e, 0.6));
    const u = this._noiseSrc(s, 0.25, 0.8),
      h = o.createBiquadFilter();
    ((h.type = "bandpass"),
      (h.frequency.value = 900 + Math.random() * 300),
      (h.Q.value = 0.6));
    const c = o.createGain();
    (c.gain.setValueAtTime(1.6, s),
      c.gain.exponentialRampToValueAtTime(0.002, s + 0.22),
      u.connect(h),
      h.connect(c),
      this._out(c, 1 * i, e, 1.1, 0.8));
    const d = o.createOscillator();
    ((d.type = "sine"),
      d.frequency.setValueAtTime(110, s),
      d.frequency.exponentialRampToValueAtTime(38, s + 0.16));
    const p = o.createGain();
    if (
      (p.gain.setValueAtTime(1.4, s),
      p.gain.exponentialRampToValueAtTime(0.001, s + 0.2),
      d.connect(p),
      d.start(s),
      d.stop(s + 0.22),
      this._out(p, 1 * i, e, 0.5, 0.5),
      t < 1)
    ) {
      const f = this._noiseSrc(s + 0.035, 0.02, 2.5),
        g = o.createBiquadFilter();
      ((g.type = "bandpass"), (g.frequency.value = 4200), (g.Q.value = 4));
      const m = o.createGain();
      (m.gain.setValueAtTime(0.25, s + 0.035),
        m.gain.exponentialRampToValueAtTime(0.001, s + 0.06),
        f.connect(g),
        g.connect(m),
        this._out(m, 0.6, 0.15, 0.1));
    }
  }
  dryFire() {
    this.click(0.25, 3e3);
  }
  click(t = 0.3, e = 2500, o = 0) {
    if (!this.ctx) return;
    const s = this.ctx.currentTime + o,
      i = this._noiseSrc(s, 0.03, 2),
      n = this.ctx.createBiquadFilter();
    ((n.type = "bandpass"), (n.frequency.value = e), (n.Q.value = 3));
    const r = this.ctx.createGain();
    (r.gain.setValueAtTime(t, s),
      r.gain.exponentialRampToValueAtTime(0.001, s + 0.04),
      i.connect(n),
      n.connect(r),
      this._out(r, 1, 0.1, 0.15));
  }
  reload() {
    (this.click(0.35, 1800, 0.15),
      this.click(0.2, 900, 0.5),
      this.click(0.5, 2200, 1.25),
      this.click(0.4, 1400, 1.3),
      this.click(0.5, 3200, 1.85),
      this.click(0.6, 2600, 2.05));
  }
  casing(t = 0) {
    if (!this.ctx) return;
    const e = this.ctx.currentTime + t;
    for (let o = 0; o < 3; o++) {
      const s = this.ctx.createOscillator();
      ((s.type = "triangle"),
        (s.frequency.value = 3800 + Math.random() * 2600));
      const i = this.ctx.createGain(),
        n = e + o * (0.07 + Math.random() * 0.06);
      (i.gain.setValueAtTime(0, e),
        i.gain.setValueAtTime(0.05 / (o + 1), n),
        i.gain.exponentialRampToValueAtTime(5e-4, n + 0.08),
        s.connect(i),
        s.start(n),
        s.stop(n + 0.1),
        this._out(i, 1, 0.3, 0.2));
    }
  }
  impact(t, e, o = 0) {
    if (!this.ctx) return;
    const s = this.ctx.currentTime + e / 343,
      i = 1 / (1 + e * 0.15),
      n =
        {
          metal: 3e3,
          concrete: 1600,
          brick: 1400,
          plaster: 1200,
          wood: 700,
          gravel: 1100,
          dirt: 500,
          soft: 300,
        }[t] || 1200,
      r = this._noiseSrc(s, 0.08, 1),
      l = this.ctx.createBiquadFilter();
    ((l.type = "bandpass"), (l.frequency.value = n), (l.Q.value = 1.2));
    const u = this.ctx.createGain();
    (u.gain.setValueAtTime(0.5, s),
      u.gain.exponentialRampToValueAtTime(
        0.001,
        s + (t === "metal" ? 0.25 : 0.09),
      ),
      r.connect(l),
      l.connect(u),
      this._out(u, i, o, 0.4),
      (t === "metal" ||
        (Math.random() < 0.12 && t !== "dirt" && t !== "soft")) &&
        this.ricochet(s, i, o));
  }
  ricochet(t, e, o) {
    const s = this.ctx.createOscillator();
    s.type = "sine";
    const i = 2400 + Math.random() * 1800;
    (s.frequency.setValueAtTime(i, t),
      s.frequency.exponentialRampToValueAtTime(i * 0.45, t + 0.35));
    const n = this.ctx.createGain();
    (n.gain.setValueAtTime(0, t),
      n.gain.linearRampToValueAtTime(0.09, t + 0.02),
      n.gain.exponentialRampToValueAtTime(0.001, t + 0.38),
      s.connect(n),
      s.start(t),
      s.stop(t + 0.4),
      this._out(n, e, o, 0.6));
  }
  steelRing(t, e) {
    if (!this.ctx) return;
    const o = this.ctx.currentTime + t / 343;
    for (const [s, i] of [
      [820, 0.25],
      [1650, 0.12],
      [2470, 0.08],
      [3310, 0.04],
    ]) {
      const n = this.ctx.createOscillator();
      n.frequency.value = s * (0.98 + Math.random() * 0.04);
      const r = this.ctx.createGain();
      (r.gain.setValueAtTime(i, o),
        r.gain.exponentialRampToValueAtTime(5e-4, o + 1.4),
        n.connect(r),
        n.start(o),
        n.stop(o + 1.5),
        this._out(r, 1 / (1 + t * 0.08), e, 0.7, 0.4));
    }
  }
  footstep(t, e) {
    if (!this.ctx) return;
    const o = this.ctx.currentTime,
      s =
        {
          gravel: 1800,
          dirt: 500,
          concrete: 900,
          plaster: 900,
          metal: 1500,
          wood: 600,
          brick: 1e3,
          soft: 400,
        }[t] || 900,
      i = this._noiseSrc(o, 0.12, t === "gravel" ? 1.2 : 0.7),
      n = this.ctx.createBiquadFilter();
    ((n.type = t === "gravel" ? "highpass" : "bandpass"),
      (n.frequency.value = s),
      (n.Q.value = 0.8));
    const r = this.ctx.createGain(),
      l = (e ? 0.22 : 0.12) * (t === "gravel" ? 1.2 : 1);
    if (
      (r.gain.setValueAtTime(0, o),
      r.gain.linearRampToValueAtTime(l, o + 0.01),
      r.gain.exponentialRampToValueAtTime(
        0.001,
        o + (t === "gravel" ? 0.14 : 0.08),
      ),
      i.connect(n),
      n.connect(r),
      this._out(r, 1, (Math.random() - 0.5) * 0.2, 0.15),
      t === "metal")
    ) {
      const u = this.ctx.createOscillator();
      u.frequency.value = 340;
      const h = this.ctx.createGain();
      (h.gain.setValueAtTime(0.05, o),
        h.gain.exponentialRampToValueAtTime(0.001, o + 0.3),
        u.connect(h),
        u.start(o),
        u.stop(o + 0.3),
        this._out(h, 1, 0, 0.3));
    }
  }
  explosion(t, e) {
    if (!this.ctx) return;
    const o = this.ctx,
      s = o.currentTime + t / 343,
      i = 1 / (1 + t * 0.05),
      n = this._noiseSrc(s, 1.8, 0.5),
      r = o.createBiquadFilter();
    ((r.type = "lowpass"),
      r.frequency.setValueAtTime(5e3, s),
      r.frequency.exponentialRampToValueAtTime(300, s + 1.2));
    const l = o.createGain();
    (l.gain.setValueAtTime(2.5, s),
      l.gain.exponentialRampToValueAtTime(0.001, s + 1.8),
      n.connect(r),
      r.connect(l),
      this._out(l, i, e, 1.6, 1));
    const u = o.createOscillator();
    ((u.type = "sine"),
      u.frequency.setValueAtTime(70, s),
      u.frequency.exponentialRampToValueAtTime(22, s + 0.9));
    const h = o.createGain();
    (h.gain.setValueAtTime(3, s),
      h.gain.exponentialRampToValueAtTime(0.001, s + 1),
      u.connect(h),
      u.start(s),
      u.stop(s + 1.1),
      this._out(h, i, e, 0.6, 0.6));
    for (let c = 0; c < 14; c++) {
      const d = s + 0.3 + Math.random() * 1.6,
        p = this._noiseSrc(d, 0.05, 1.5),
        f = o.createBiquadFilter();
      ((f.type = "bandpass"), (f.frequency.value = 900 + Math.random() * 2500));
      const g = o.createGain();
      (g.gain.setValueAtTime(0.12 * Math.random(), d),
        g.gain.exponentialRampToValueAtTime(0.001, d + 0.06),
        p.connect(f),
        f.connect(g),
        this._out(g, i, e + (Math.random() - 0.5) * 0.6, 0.4));
    }
    t < 14 && this.tinnitus(1 - t / 14);
  }
  tinnitus(t) {
    const e = this.ctx,
      o = e.currentTime;
    (this.muffle.frequency.cancelScheduledValues(o),
      this.muffle.frequency.setValueAtTime(350 + (1 - t) * 1500, o + 0.05),
      this.muffle.frequency.exponentialRampToValueAtTime(2e4, o + 1.5 + 4 * t));
    const s = e.createOscillator();
    s.frequency.value = 3900 + Math.random() * 400;
    const i = e.createGain();
    (i.gain.setValueAtTime(0, o),
      i.gain.linearRampToValueAtTime(0.05 * t, o + 0.1),
      i.gain.exponentialRampToValueAtTime(5e-4, o + 2 + 4 * t),
      s.connect(i),
      i.connect(this.comp),
      s.start(o),
      s.stop(o + 6.5));
  }
  pin() {
    (this.click(0.4, 3500), this.click(0.3, 2600, 0.12));
  }
  bounce(t, e) {
    t < 0.6 ||
      this.click(
        Math.min(0.35, t * 0.05) / (1 + e * 0.1),
        1700 + Math.random() * 700,
      );
  }
  startAmbience() {
    const t = this.ctx,
      e = t.createBufferSource();
    ((e.buffer = this.makeNoise(4)), (e.loop = !0));
    const o = t.createBiquadFilter();
    ((o.type = "lowpass"), (o.frequency.value = 380));
    const s = t.createGain();
    s.gain.value = 0.05;
    const i = t.createOscillator();
    i.frequency.value = 0.07;
    const n = t.createGain();
    ((n.gain.value = 0.03),
      i.connect(n),
      n.connect(s.gain),
      i.start(),
      e.connect(o),
      o.connect(s),
      s.connect(this.master),
      e.start(),
      (this.ambGain = s));
    const r = () => {
      if (!this.noBirds && this.env === "outdoor" && Math.random() < 0.15) {
        const l = t.currentTime;
        for (let u = 0; u < 3 + Math.random() * 4; u++) {
          const h = t.createOscillator(),
            c = l + u * 0.12,
            d = 2800 + Math.random() * 1500;
          (h.frequency.setValueAtTime(d, c),
            h.frequency.exponentialRampToValueAtTime(d * 1.3, c + 0.06));
          const p = t.createGain();
          (p.gain.setValueAtTime(0, c),
            p.gain.linearRampToValueAtTime(0.012, c + 0.02),
            p.gain.exponentialRampToValueAtTime(1e-4, c + 0.08),
            h.connect(p),
            h.start(c),
            h.stop(c + 0.1),
            this._out(p, 1, Math.random() * 2 - 1, 0.8));
        }
      }
      setTimeout(r, 3e3 + Math.random() * 9e3);
    };
    setTimeout(r, 4e3);
  }
  startTension() {
    const t = this.ctx,
      e = t.createGain();
    ((e.gain.value = 0), e.connect(this.master));
    for (const m of [41.2, 43.65, 61.7]) {
      const w = t.createOscillator();
      ((w.type = "sine"), (w.frequency.value = m));
      const y = t.createGain();
      ((y.gain.value = m > 60 ? 0.25 : 0.5),
        w.connect(y),
        y.connect(e),
        w.start());
    }
    const o = t.createBufferSource();
    ((o.buffer = this.makeNoise(5)), (o.loop = !0));
    const s = t.createBiquadFilter();
    ((s.type = "bandpass"), (s.frequency.value = 160), (s.Q.value = 3));
    const i = t.createGain();
    ((i.gain.value = 0.6), o.connect(s), s.connect(i), i.connect(e), o.start());
    const n = t.createOscillator();
    n.frequency.value = 0.035;
    const r = t.createGain();
    ((r.gain.value = 0.018),
      n.connect(r),
      r.connect(e.gain),
      n.start(),
      e.gain.setTargetAtTime(0.03, t.currentTime, 4),
      (this.droneGain = e));
    const l = t.createBufferSource();
    ((l.buffer = this.makeNoise(6)), (l.loop = !0));
    const u = t.createBiquadFilter();
    ((u.type = "bandpass"), (u.frequency.value = 600), (u.Q.value = 1.5));
    const h = t.createGain();
    ((h.gain.value = 0),
      l.connect(u),
      u.connect(h),
      h.connect(this.master),
      l.start());
    const c = () => {
      const m = t.currentTime,
        w = 2 + Math.random() * 5,
        y = 0.02 + Math.random() * 0.05;
      (h.gain.cancelScheduledValues(m),
        h.gain.setTargetAtTime(y, m, w * 0.3),
        h.gain.setTargetAtTime(0.004, m + w, w * 0.4),
        u.frequency.setTargetAtTime(400 + Math.random() * 900, m, w * 0.5),
        setTimeout(c, (w + 3 + Math.random() * 10) * 1e3));
    };
    setTimeout(c, 2500);
    const d = [
        () => {
          const m = 1 + Math.floor(Math.random() * 5);
          for (let w = 0; w < m; w++)
            setTimeout(
              () =>
                this.gunshot(180 + Math.random() * 250, Math.random() * 2 - 1),
              w * (90 + Math.random() * 160),
            );
        },
        () => this.dogBark(),
        () => this.metalCreak(),
        () => this.metalCreak(),
        () => this.distantThud(),
        () => this.radioStatic(),
        () => this.helicopter(),
        () => this.debrisFall(),
        () => this.footstepsElsewhere(),
      ],
      p = () => {
        (this.ctx.state === "running" &&
          d[Math.floor(Math.random() * d.length)](),
          setTimeout(p, 9e3 + Math.random() * 26e3));
      };
    (setTimeout(p, 6e3 + Math.random() * 6e3),
      (this.stress = 0),
      (this.breath = 0));
    const f = () => {
      const m = this.stress;
      if (m > 0.08) {
        const w = t.currentTime;
        for (const [y, x] of [
          [0, 1],
          [0.16, 0.7],
        ]) {
          const b = t.createOscillator();
          ((b.type = "sine"),
            b.frequency.setValueAtTime(58, w + y),
            b.frequency.exponentialRampToValueAtTime(34, w + y + 0.12));
          const v = t.createGain();
          (v.gain.setValueAtTime(0, w + y),
            v.gain.linearRampToValueAtTime(0.32 * m * x, w + y + 0.015),
            v.gain.exponentialRampToValueAtTime(5e-4, w + y + 0.18),
            b.connect(v),
            v.connect(this.comp),
            b.start(w + y),
            b.stop(w + y + 0.2));
        }
      }
      setTimeout(f, 6e4 / (62 + 70 * m));
    };
    f();
    const g = () => {
      const m = this.breath;
      if (m > 0.1) {
        const w = t.currentTime;
        for (const [y, x, b] of [
          [0, 0.55, 900],
          [0.7, 0.75, 650],
        ]) {
          const v = this._noiseSrc(w + y, x, 1),
            M = t.createBiquadFilter();
          ((M.type = "bandpass"), (M.frequency.value = b), (M.Q.value = 0.9));
          const _ = t.createGain();
          (_.gain.setValueAtTime(0, w + y),
            _.gain.linearRampToValueAtTime(0.05 * m, w + y + x * 0.4),
            _.gain.linearRampToValueAtTime(0, w + y + x),
            v.connect(M),
            M.connect(_),
            _.connect(this.comp));
        }
      }
      setTimeout(g, 1e3 * (2.6 - 1.3 * m));
    };
    g();
  }
  setStress(t, e) {
    this.ctx &&
      ((this.stress = t),
      (this.breath = e),
      this.droneGain?.gain.setTargetAtTime(
        0.03 + 0.05 * t,
        this.ctx.currentTime,
        1.5,
      ));
  }
  dogBark() {
    const t = this.ctx,
      e = 2 + Math.floor(Math.random() * 4),
      o = Math.random() * 2 - 1,
      s = 0.25 + Math.random() * 0.3;
    for (let i = 0; i < e; i++) {
      const n = t.currentTime + i * (0.32 + Math.random() * 0.2),
        r = t.createOscillator();
      ((r.type = "sawtooth"),
        r.frequency.setValueAtTime(420 + Math.random() * 80, n),
        r.frequency.exponentialRampToValueAtTime(230, n + 0.14));
      const l = t.createBiquadFilter();
      ((l.type = "bandpass"), (l.frequency.value = 900), (l.Q.value = 2));
      const u = t.createBiquadFilter();
      ((u.type = "lowpass"), (u.frequency.value = 1400));
      const h = t.createGain();
      (h.gain.setValueAtTime(0, n),
        h.gain.linearRampToValueAtTime(0.06 * s, n + 0.02),
        h.gain.exponentialRampToValueAtTime(5e-4, n + 0.17),
        r.connect(l),
        l.connect(u),
        u.connect(h),
        r.start(n),
        r.stop(n + 0.2),
        this._out(h, 1, o, 1.4, 0.8));
    }
  }
  metalCreak() {
    const t = this.ctx,
      e = t.currentTime,
      o = 1.2 + Math.random() * 2,
      s = t.createOscillator();
    s.type = "sawtooth";
    const i = 90 + Math.random() * 140;
    (s.frequency.setValueAtTime(i, e),
      s.frequency.linearRampToValueAtTime(
        i * (0.7 + Math.random() * 0.6),
        e + o,
      ));
    const n = t.createOscillator();
    n.frequency.value = 9 + Math.random() * 14;
    const r = t.createGain();
    ((r.gain.value = i * 0.08),
      n.connect(r),
      r.connect(s.frequency),
      n.start(e),
      n.stop(e + o));
    const l = t.createBiquadFilter();
    ((l.type = "bandpass"),
      (l.frequency.value = 700 + Math.random() * 900),
      (l.Q.value = 6));
    const u = t.createGain();
    (u.gain.setValueAtTime(0, e),
      u.gain.linearRampToValueAtTime(0.03, e + o * 0.3),
      u.gain.linearRampToValueAtTime(0, e + o),
      s.connect(l),
      l.connect(u),
      s.start(e),
      s.stop(e + o),
      this._out(u, 1, Math.random() * 2 - 1, 1.5, 0.6));
  }
  distantThud() {
    const t = this.ctx,
      e = t.currentTime,
      o = t.createOscillator();
    (o.frequency.setValueAtTime(55, e),
      o.frequency.exponentialRampToValueAtTime(28, e + 0.6));
    const s = t.createGain();
    (s.gain.setValueAtTime(0.25, e),
      s.gain.exponentialRampToValueAtTime(5e-4, e + 0.9),
      o.connect(s),
      o.start(e),
      o.stop(e + 1),
      this._out(s, 1, Math.random() * 2 - 1, 1.8, 1));
  }
  radioStatic() {
    const t = this.ctx,
      e = t.currentTime,
      o = 0.6 + Math.random() * 1.6,
      s = this._noiseSrc(e, o, 1.3),
      i = t.createBiquadFilter();
    ((i.type = "bandpass"), (i.frequency.value = 1800), (i.Q.value = 1.2));
    const n = t.createGain();
    n.gain.setValueAtTime(0, e);
    for (let r = 0; r < o; r += 0.06)
      n.gain.setValueAtTime(Math.random() < 0.6 ? 0.025 : 0, e + r);
    (n.gain.setValueAtTime(0, e + o),
      s.connect(i),
      i.connect(n),
      this._out(n, 1, (Math.random() - 0.5) * 0.6, 0.4));
  }
  helicopter() {
    const t = this.ctx,
      e = t.currentTime,
      o = 9 + Math.random() * 8,
      s = t.createBufferSource();
    ((s.buffer = this.noise), (s.loop = !0));
    const i = t.createBiquadFilter();
    ((i.type = "lowpass"), (i.frequency.value = 220));
    const n = t.createGain();
    n.gain.value = 0.5;
    const r = t.createOscillator();
    ((r.type = "square"), (r.frequency.value = 11 + Math.random() * 3));
    const l = t.createGain();
    ((l.gain.value = 0.5), r.connect(l), l.connect(n.gain));
    const u = t.createGain();
    (u.gain.setValueAtTime(0, e),
      u.gain.linearRampToValueAtTime(0.12, e + o * 0.45),
      u.gain.linearRampToValueAtTime(0, e + o));
    const h = t.createStereoPanner();
    (h.pan.setValueAtTime(-1, e),
      h.pan.linearRampToValueAtTime(1, e + o),
      s.connect(i),
      i.connect(n),
      n.connect(u),
      u.connect(h),
      h.connect(this.master),
      s.start(e),
      s.stop(e + o),
      r.start(e),
      r.stop(e + o));
  }
  debrisFall() {
    const t = this.ctx,
      e = Math.random() * 2 - 1;
    for (let o = 0; o < 6 + Math.random() * 8; o++) {
      const s = t.currentTime + o * (0.05 + Math.random() * 0.15),
        i = this._noiseSrc(s, 0.05, 1.4),
        n = t.createBiquadFilter();
      ((n.type = "bandpass"), (n.frequency.value = 900 + Math.random() * 2e3));
      const r = t.createGain();
      (r.gain.setValueAtTime(0.06 * Math.random(), s),
        r.gain.exponentialRampToValueAtTime(5e-4, s + 0.06),
        i.connect(n),
        n.connect(r),
        this._out(r, 1, e, 1.2));
    }
  }
  footstepsElsewhere() {
    const t = this.ctx,
      e = Math.random() < 0.5 ? -0.8 : 0.8,
      o = 4 + Math.floor(Math.random() * 6);
    for (let s = 0; s < o; s++) {
      const i = t.currentTime + s * (0.42 + Math.random() * 0.08),
        n = this._noiseSrc(i, 0.1, 0.7),
        r = t.createBiquadFilter();
      ((r.type = "bandpass"), (r.frequency.value = 700), (r.Q.value = 1));
      const l = t.createGain();
      (l.gain.setValueAtTime(0, i),
        l.gain.linearRampToValueAtTime(0.035, i + 0.01),
        l.gain.exponentialRampToValueAtTime(5e-4, i + 0.09),
        n.connect(r),
        r.connect(l),
        this._out(l, 1, e, 1.6));
    }
  }
}
const $s = 0.886227,
  Ea = 2 * 0.511664;

export { $s, Ea, dh };
