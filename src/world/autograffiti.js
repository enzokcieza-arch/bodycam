// world/autograffiti.js — pasada automática de "vandalismo": lanza rayos desde las zonas transitables, busca paños
// de muro libres y los cubre con grafitis del generador procedural (tags, throw-ups, piezas, plantillas).
// Objetivo: la densidad de pintadas de las referencias sin colocar cada una a mano. Determinista (semilla fija).
import { Vector3 } from "../three.js";
import { ai as Raycaster } from "three-vendor";

const STYLES = [
  // [estilo, peso, ancho min, ancho max, alto/ancho, altura del centro min, max]
  ["tag", 34, 0.5, 1.1, 0.55, 0.9, 1.9],
  ["scrawl", 10, 0.8, 1.5, 0.4, 1.1, 1.8],
  ["throwup", 22, 1.3, 2.2, 0.62, 0.9, 1.5],
  ["piece", 16, 2.4, 3.8, 0.5, 1.0, 1.4],
  ["tagwall", 12, 2.0, 3.0, 0.42, 1.0, 1.7],
  ["stencil", 6, 0.5, 0.9, 0.5, 1.2, 1.7],
];

export function autoGraffiti(world, count, seed = 20261) {
  if (!count) return 0;
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const meshes = world.staticMeshes.filter((m) => m.name.startsWith("static:") && !m.material.transparent);
  const rc = new Raycaster();
  rc.firstHitOnly = true;
  const zones = world.zones.filter((z) => !/bosque/.test(z.name));
  const totalW = STYLES.reduce((a, b) => a + b[1], 0);
  const o = new Vector3(), d = new Vector3(), n = new Vector3(), t = new Vector3();
  const cast = (ox, oy, oz, dx, dz, far) => {
    o.set(ox, oy, oz); d.set(dx, 0, dz);
    rc.set(o, d); rc.far = far;
    const h = rc.intersectObjects(meshes, false)[0];
    return h && h.face ? h : null;
  };
  const placed = [], out = [];
  const t0 = performance.now();
  for (let tries = 0; tries < count * 14 && out.length < count && performance.now() - t0 < 2500; tries++) {
    const z = zones[Math.floor(rnd() * zones.length)];
    const floorY = z.min[1];
    const px = z.min[0] + rnd() * (z.max[0] - z.min[0]), pz = z.min[2] + rnd() * (z.max[2] - z.min[2]);
    const a = Math.floor(rnd() * 4) * Math.PI / 2 + (rnd() - 0.5) * 0.5;
    const dx = Math.cos(a), dz = Math.sin(a);
    let r = rnd() * totalW, st = STYLES[0];
    for (const c of STYLES) { if ((r -= c[1]) <= 0) { st = c; break; } }
    const w = st[2] + rnd() * (st[3] - st[2]), h = w * st[4], cy = floorY + st[5] + rnd() * (st[6] - st[5]);
    const hit = cast(px, cy, pz, dx, dz, 14);
    if (!hit || hit.distance < 0.6) continue;
    n.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
    if (Math.abs(n.y) > 0.15 || n.x * dx + n.z * dz > -0.6) continue;         // solo muros verticales de frente
    n.y = 0; n.normalize();
    const key = hit.object.name.slice(7);
    if (/water|glass|fence|rust|metal|wood|bark|log/.test(key)) continue;
    // el paño debe ser plano y continuo en las 4 esquinas del grafiti
    t.set(-n.z, 0, n.x);
    const P = hit.point.clone();
    let ok = true;
    for (const [su, sv] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      const cx = P.x + t.x * su * w * 0.5 + n.x * 0.5, cz = P.z + t.z * su * w * 0.5 + n.z * 0.5;
      const hh = cast(cx, cy + sv * h * 0.5, cz, -n.x, -n.z, 0.6);
      if (!hh || Math.abs(hh.distance - 0.5) > 0.03 || hh.object !== hit.object) { ok = false; break; }
    }
    if (!ok) continue;
    if (placed.some((q) => Math.abs(q.y - cy) < (q.h + h) * 0.5 && Math.hypot(q.x - P.x, q.z - P.z) < (q.w + w) * 0.45)) continue;
    placed.push({ x: P.x, y: cy, z: P.z, w, h });
    out.push({
      pos: [P.x, cy, P.z], normal: [n.x, 0, n.z], size: [w, h], wallKey: key,
      spec: { style: st[0], palette: Math.floor(rnd() * 12), seed: 1000 + out.length * 7, wear: 0.25 + rnd() * 0.5 },
    });
  }
  if (out.length) world.buildDecals(out);
  console.info(`[autograffiti] ${out.length}/${count} grafitis en ${(performance.now() - t0).toFixed(0)} ms`);
  return out.length;
}
