// Capturas de efectos: ráfaga de disparos y granada (humo, chispas, explosión). Uso: node tools/fxshots.mjs <out> [url]
import { chromium } from 'playwright'; import fs from 'node:fs';
const out = process.argv[2] || 'shots/fx', base = process.argv[3] || 'http://127.0.0.1:8765/';
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +(process.env.W || 640), height: +(process.env.H || 360) } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message));
await p.goto(base + '?q=medium&noloop');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
// los pasos intermedios no dibujan (rápido); la foto dibuja 1 frame
await p.evaluate(() => { const g = window.__game, r = g.engine.post.render.bind(g.engine.post); g._realRender = r; g.engine.post.render = () => {}; });
const snap = async (name) => { const u = await p.evaluate(() => { const g = window.__game; g.engine.post.render = g._realRender; g.step(1, 1 / 30); const d = document.getElementById('game').toDataURL('image/png'); g.engine.post.render = () => {}; return d; }); fs.writeFileSync(`${out}/${name}.png`, Buffer.from(u.split(',')[1], 'base64')); console.log(name); };
// escena: soportal, mirando por el pasillo (oscuro, con la linterna)
await p.evaluate(() => { const g = window.__game; g.setRunning(true); g.player.spawn([13.5, 0, -12], 1.52, -0.05); if (!g.vm.torchOn) g.vm.toggleTorch(); g.step(20, 1 / 20); });
// ráfaga: 12 frames con el gatillo apretado
await p.evaluate(() => { const g = window.__game; g.weapons.setTrigger(true); g.step(10, 1 / 30); g.weapons.setTrigger(false); g.step(2, 1 / 30); });
await snap('1-rafaga');
await p.evaluate(() => window.__game.step(20, 1 / 30));
await snap('2-rafaga-0.7s');
// granada a ~8 m por el pasillo: esperar a la detonación real (retraso de lanzamiento + mecha de 3.6 s)
await p.evaluate(() => { const g = window.__game; g.step(30, 1 / 20); g.weapons.throwGrenade();
  for (let i = 0; i < 300 && !(g.fx.boomT > 0); i++) g.step(1, 1 / 30); g.step(2, 1 / 30); });
await snap('3-explosion');
await p.evaluate(() => window.__game.step(12, 1 / 30));
await snap('4-humo-0.5s');
await p.evaluate(() => window.__game.step(45, 1 / 30));
await snap('5-humo-2s');
await p.evaluate(() => window.__game.step(90, 1 / 30));
await snap('6-humo-5s');
await b.close();
