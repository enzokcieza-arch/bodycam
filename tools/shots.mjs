// Arnés de capturas: node tools/shots.mjs <outDir> [quality] [url] [names,comma]
// Usa ?noloop + __game.step() para que las capturas sean deterministas (mismas 4+ cámaras siempre).
import { chromium } from 'playwright'; import fs from 'node:fs';
const out = process.argv[2] || 'shots/before', q = process.argv[3] || 'medium', base = process.argv[4] || 'http://127.0.0.1:8765/';
const only = process.argv[5] ? process.argv[5].split(',') : null;
export const CAMS = JSON.parse(fs.readFileSync(new URL('./cams.json', import.meta.url)));
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: +(process.env.W || 960), height: +(process.env.H || 540) } });
const errs = [];
p.on('console', m => { if (m.type() === 'error' || process.env.VERBOSE) { errs.push(m.text()); console.log('[c]', m.type(), m.text().slice(0, 400)); } });
p.on('pageerror', e => { errs.push(e.message); console.log('[pageerror]', e.message); });
await p.goto(`${base}?q=${q}&noloop${process.env.QS || ""}`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
if (process.env.DUMP) console.log(await p.evaluate(process.env.DUMP));
for (const c of CAMS) {
  if (only && !only.includes(c.name)) continue;
  const t0 = Date.now();
  await p.evaluate((c) => { const g = window.__game; g.setRunning(true); g.player.spawn(c.pos, c.yaw, c.pitch || 0);
    const wantTorch = c.torch !== false; if (wantTorch !== !!g.vm.torchOn) g.vm.toggleTorch?.();
    g.input.buttons = c.ads ? 4 : 0; g.engine.post.resetAdaptation?.(); g.step(c.steps || 12, 1 / 20); g.step(4, 1 / 60); }, c);
  // la captura de página se cuelga con render por software: leemos el canvas en la misma tarea que el render
  const url = await p.evaluate(() => { window.__game.step(1, 1 / 60); return document.getElementById('game').toDataURL('image/png'); });
  fs.writeFileSync(`${out}/${c.name}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log(c.name, ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
console.log('errors:', errs.length);
await b.close();
