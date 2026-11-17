// Radiografía de rendimiento por cámara: draw calls, triángulos, programas, luces activas, coste por pase
// (render por software: ms relativos, NO fps reales). Uso: node tools/perfprobe.mjs [quality] [url]
import { chromium } from 'playwright'; import fs from 'node:fs';
const q = process.argv[2] || 'medium', base = process.argv[3] || 'http://127.0.0.1:8765/';
const CAMS = JSON.parse(fs.readFileSync(new URL('./cams.json', import.meta.url))).filter((c) => ['1-pasillo', '2-bosque-quemado', '3-patio', '4-bosque-oscuro', '6-callejon'].includes(c.name));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 480, height: 270 } });
await p.goto(`${base}?q=${q}&noloop`);
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
const scene = await p.evaluate(() => {
  const g = window.__game, s = g.engine.scene; let meshes = 0, inst = 0, instCount = 0, mats = new Set(), lights = 0, shadowCasters = 0;
  s.traverse((o) => { if (o.isInstancedMesh) { inst++; instCount += o.count; } else if (o.isMesh) meshes++; if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => mats.add(m)); if (o.isLight) lights++; if (o.isMesh && o.castShadow) shadowCasters++; });
  return { meshes, inst, instCount, materials: mats.size, lights, shadowCasters, programs: g.engine.renderer.info.programs?.length };
});
console.log('escena:', JSON.stringify(scene));
for (const c of CAMS) {
  const r = await p.evaluate((c) => {
    const g = window.__game, E = g.engine, R = E.renderer, gl = R.getContext(); g.setRunning(true); g.player.spawn(c.pos, c.yaw, c.pitch || 0); g.step(4, 1 / 20);
    const px = new Uint8Array(4), fin = () => gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
    // coste de la escena sola vs. frame completo
    fin(); let t0 = performance.now(); R.info.reset(); R.setRenderTarget(E.post.sceneRT); R.render(E.scene, E.camera); fin(); const sceneMs = performance.now() - t0;
    const calls = R.info.render.calls, tris = R.info.render.triangles;
    t0 = performance.now(); g.step(1, 1 / 60); fin(); const frameMs = performance.now() - t0;
    const lit = g.world.dynamicLights.filter((l) => l.intensity > 0.01).length;
    return { sceneMs: Math.round(sceneMs), frameMs: Math.round(frameMs), calls, tris, lit };
  }, c);
  console.log(c.name.padEnd(18), `escena ${String(r.sceneMs).padStart(5)} ms · frame ${String(r.frameMs).padStart(5)} ms · post ≈${String(r.frameMs - r.sceneMs).padStart(5)} ms · draws ${String(r.calls).padStart(4)} · tris ${(r.tris / 1e6).toFixed(2)}M · luces ${r.lit}`);
}
await b.close();
