// Alinea la pose de apuntado (ADS) para que el centro de la lente de la mira caiga en el eje de la cámara,
// con el arma recta. Itera midiendo la lente en espacio de cámara. Uso: node tools/adsalign.mjs
import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 320, height: 180 } });
await p.goto('http://127.0.0.1:8765/?q=low&noloop');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
const r = await p.evaluate((target) => {
  const g = window.__game, E = g.engine, cam = E.camera, vm = g.vm, fx = g.gfx;
  E.post.render = () => {};
  g.setRunning(true); g.player.spawn([1.5, 0, 9.5], 0.15, 0); g.step(10, 1 / 30);
  const pose = vm.poses?.ads || window.__adsPose;
  const lens = fx.redDot.group.children.find((c) => c.material?.isShaderMaterial);
  const V = cam.position.clone();
  const measure = () => {
    g.input.buttons = 4; g.player.ads = true; g.step(45, 1 / 30);
    cam.updateMatrixWorld(); lens.updateMatrixWorld();
    const w = lens.getWorldPosition(V.clone());
    const c = w.clone().applyMatrix4(cam.matrixWorldInverse);
    // eje del tubo en espacio de cámara
    const ax = V.clone().set(0, 0, -1).transformDirection(fx.redDot.group.matrixWorld).transformDirection(cam.matrixWorldInverse);
    return { c: c.toArray().map((v) => +v.toFixed(4)), ax: ax.toArray().map((v) => +v.toFixed(3)) };
  };
  const log = [];
  pose.r = [0, 0, 0];
  for (let it = 0; it < 6; it++) {
    const m = measure();
    log.push({ it, p: pose.p.map((v) => +v.toFixed(4)), lens: m.c, axis: m.ax });
    // corregir posición: llevar la lente a (0, 0, target)
    pose.p[0] -= m.c[0];
    pose.p[1] -= m.c[1];
    pose.p[2] += (target - m.c[2]);   // lente más lejos/cerca del ojo (p.z positivo la acerca)
    // corregir rotación para que el eje del tubo mire a -z
    pose.r[0] -= Math.asin(Math.max(-1, Math.min(1, m.ax[1]))) * 0.9;
    pose.r[1] -= Math.asin(Math.max(-1, Math.min(1, m.ax[0]))) * 0.9;
  }
  log.push({ final: { p: pose.p.map((v) => +v.toFixed(4)), r: pose.r.map((v) => +v.toFixed(4)) }, lens: measure() });
  return log;
}, -0.24);
for (const x of r) console.log(JSON.stringify(x));
await b.close();
