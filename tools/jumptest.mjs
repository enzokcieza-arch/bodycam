// Simula un salto a distintos fps y mide la cámara (altura relativa al jugador y cabeceo) → detecta tirones y
// dependencia del framerate. Uso: node tools/jumptest.mjs [url]
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:8765/';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 320, height: 180 } });
await p.goto(base + '?q=low&noloop');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
for (const fps of [60, 144, 75]) {
  const r = await p.evaluate((fps) => {
    const g = window.__game, pl = g.player, cam = g.engine.camera, inp = g.input;
    g.engine.post.render = () => {};   // solo física y cámara: sin dibujar (rápido)
    g.setRunning(true); pl.spawn([1.5, 0, 9.5], 0.15, 0); g.step(60, 1 / 60);
    const out = []; let jumped = false;
    // dt real con algo de variación (como un navegador): ±8 %
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < fps * 1.6; i++) {
      if (i === 5) { inp.keys.add('Space'); inp.edge.add('Space'); jumped = true; }
      if (i === 7) inp.keys.delete('Space');
      const dt = (1 / fps) * (0.92 + 0.16 * rnd());
      g.step(1, dt);
      out.push([+(cam.position.y - pl.pos.y).toFixed(4), +cam.rotation.x.toFixed(4), +pl.pos.y.toFixed(4), +cam.position.y.toFixed(4), dt]);
    }
    return out;
  }, fps);
  // métricas: hundimiento máximo de la cámara al aterrizar, cabeceo máx., y "tirones" = segunda derivada de la altura
  const rel = r.map((x) => x[0]), pit = r.map((x) => x[1]), cy = r.map((x) => x[3]);
  const base0 = rel[2];
  const dip = Math.min(...rel) - base0;
  const pmax = Math.max(...pit.map((v) => Math.abs(v - pit[2])));
  let jerk = 0;
  for (let i = 2; i < cy.length; i++) { const a = (cy[i] - cy[i - 1]) / r[i][4], b0 = (cy[i - 1] - cy[i - 2]) / r[i - 1][4]; jerk = Math.max(jerk, Math.abs(a - b0)); }
  const apex = Math.max(...r.map((x) => x[2]));
  console.log(`${String(fps).padStart(3)} fps  altura salto ${apex.toFixed(3)} m · hundimiento cámara al aterrizar ${(dip * 100).toFixed(1)} cm · cabeceo máx ${(pmax * 57.3).toFixed(2)}° · salto de velocidad vertical máx ${jerk.toFixed(2)} m/s`);
}
await b.close();
