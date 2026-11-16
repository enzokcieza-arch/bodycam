// Bench relativo sin GPU: ms/frame con render por software (SwiftShader) en cámaras fijas.
// NO son fps reales: sirve para comparar builds/calidades entre sí (coste relativo de sombreado).
// Uso: node tools/bench.mjs <url> <quality> [frames]
import { chromium } from 'playwright'; import fs from 'node:fs';
const base = process.argv[2] || 'http://127.0.0.1:8765/', q = process.argv[3] || 'medium', N = +(process.argv[4] || 5);
const CAMS = JSON.parse(fs.readFileSync(new URL('./cams.json', import.meta.url))).filter(c => !c.extra).slice(0, +(process.env.NCAMS || 4));
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 960, height: 540 } });
await p.goto(`${base}?q=${q}&noloop`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 900000, polling: 1000 });
const rows = [];
for (const c of CAMS) {
  const r = await p.evaluate(({ c, N }) => { const g = window.__game; g.setRunning(true); g.player.spawn(c.pos, c.yaw, c.pitch || 0); g.step(6, 1 / 20);
    const gl = g.engine.renderer.getContext(); const px = new Uint8Array(4); const fin = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    fin(); const t0 = performance.now(); for (let i = 0; i < N; i++) { g.step(1, 1 / 60); fin(); } const ms = (performance.now() - t0) / N;
    const info = g.engine.renderer.info; return { ms, calls: info.render.calls, tris: info.render.triangles }; }, { c, N });
  rows.push({ cam: c.name, ...r }); console.log(q.padEnd(7), c.name.padEnd(20), r.ms.toFixed(0).padStart(7), 'ms/frame', String(r.calls).padStart(5), 'draws', String(r.tris).padStart(9), 'tris');
}
if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify({ base, q, rows }, null, 1));
await b.close();
