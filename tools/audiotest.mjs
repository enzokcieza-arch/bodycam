// Verifica el audio nocturno: arranca el contexto, recorre zonas, dispara cada susto y mide el nivel (RMS) a la salida.
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage({ viewport: { width: 320, height: 180 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); if (/nightsound/.test(m.text())) errs.push(m.text()); });
await p.goto((process.argv[2] || 'http://127.0.0.1:8765/') + '?q=low&noloop');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
const res = await p.evaluate(async () => {
  const g = window.__game, A = g.audio;
  g.engine.post.render = () => {};
  A.init(); await A.ctx.resume();
  const an = A.ctx.createAnalyser(); an.fftSize = 4096; A.comp.connect(an);
  const buf = new Float32Array(an.fftSize);
  const rms = () => { an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; return Math.sqrt(s / buf.length); };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = {};
  const at = async (name, pos, yaw, ms = 1500) => { g.setRunning(true); g.player.spawn(pos, yaw, 0); let mx = 0; const t0 = performance.now(); while (performance.now() - t0 < ms) { g.step(2, 1 / 30); await wait(40); mx = Math.max(mx, rms()); } out[name] = { rms: +mx.toFixed(4), voces: g.nightSound.voices.filter((v) => v.spec).map((v) => v.kind).join(',') }; };
  await at('patio', [1.5, 0, 9.5], 0.15);
  await at('pasillo', [12.5, 3.7, -11.2], 4.76);
  await at('callejon', [19, 0.3, -13], -1.4);
  await at('bosque', [-50, 8, 59.6], 2.5);
  for (const k of ['slam', 'knock', 'running', 'radio', 'groan']) { g.nightSound[k](); let mx = 0; for (let i = 0; i < 25; i++) { await wait(60); mx = Math.max(mx, rms()); } out['susto:' + k] = +mx.toFixed(4); }
  out.started = g.nightSound.started; out.ctx = A.ctx.state;
  return out;
});
console.log(JSON.stringify(res, null, 1)); console.log('errores:', errs.length, errs.slice(0, 5));
await b.close();
