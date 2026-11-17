// world/dressing.js — "set dressing" automático con modelos CC0 fotoescaneados de Poly Haven (v3.0).
//
// 1) urbanClutter(): desorden con intención en interiores y soportales — grupos apoyados contra los muros
//    (un objeto grande + basura pequeña alrededor), como en un edificio abandonado de verdad: nadie deja una silla
//    en el centro de la sala, todo acaba arrimado a las paredes y en las esquinas.
// 2) forestFloor(): sotobosque instanciado (helechos, ortigas, raíces, piedras, corteza) en los dos bosques,
//    con densidad distinta: el quemado lleva sobre todo corteza, raíces y piedras; el oscuro, helechos y ortigas.
//
// Determinista (semillas fijas) para que las capturas sean comparables entre builds.
import { Vector3, Matrix4, Quaternion, Euler, Box3, InstancedMesh } from "../three.js";

const CELL = 16;
const FOREST_CELLS = [];
// Descarte por distancia (además del frustum): de noche, más allá de ~40 m el sotobosque no se distingue.
// Llamar cada frame; barato (≈ cientos de comprobaciones).
export function updateDressingVisibility(camera, { forestDist = 40, smallDist = 22, bigDist = 55 } = {}) {
  const x = camera.position.x, z = camera.position.z;
  const f2 = (forestDist + CELL * 0.71) ** 2;
  for (const im of FOREST_CELLS) { const c = im.userData.cell; im.visible = (c[0] - x) ** 2 + (c[1] - z) ** 2 < f2; }
  for (const o of DRESS_PROPS) { const d = o.userData.small ? smallDist : bigDist; o.visible = (o.position.x - x) ** 2 + (o.position.z - z) ** 2 < d * d; }
}
export const DRESS_PROPS = [];
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const pick = (r, list) => { let t = r() * list.reduce((a, b) => a + b[1], 0); for (const e of list) if ((t -= e[1]) <= 0) return e; return list[0]; };

// [modelo, peso, radio de huella (m), objetos pequeños que lo acompañan]
const BIG_INDOOR = [
  ["worn_metal_rack", 3, 0.55], ["metal_office_desk", 3, 0.75], ["tool_cart", 2, 0.45], ["sofa_02", 1.5, 0.9],
  ["SchoolChair_01", 3, 0.3], ["wheelchair_01", 1.2, 0.45], ["industrial_storage_cart", 1.5, 0.55],
  ["plastic_crate_03", 3, 0.35], ["plastic_crate_02", 3, 0.3], ["television_02", 1.5, 0.3], ["metal_stool_02", 2, 0.25],
  ["Barrel_02", 0.5, 0.35], ["WetFloorSign_01", 0.6, 0.2], ["medical_box", 1, 0.2],
];
const BIG_SEMI = [
  ["plastic_crate_03", 3, 0.35], ["plastic_crate_02", 3, 0.3], ["Barrel_02", 2.5, 0.35], ["barrel_stove", 1.5, 0.35],
  ["rusted_wheel_rim_01", 2, 0.3], ["small_lpg_tank", 1.5, 0.25], ["metal_jerrycan_green", 2, 0.2],
  ["plastic_jerrycan", 2, 0.2], ["utility_box_02", 1, 0.3], ["SchoolChair_01", 1.5, 0.3], ["sofa_02", 0.8, 0.9],
];
const SMALL = [
  ["can_rusted", 4], ["plastic_bottle_gallon", 3], ["spray_paint_bottles_02", 1.5], ["metal_jerrycan_green", 1],
  ["plastic_jerrycan", 1], ["medical_box", 0.6],
];

export function urbanClutter(collider, zones, { density = 1, seed = 4242 } = {}) {
  const r = rng(seed), out = [], taken = [];
  const o = new Vector3(), d = new Vector3();
  const free = (x, z, rad) => !taken.some((t) => (t[0] - x) ** 2 + (t[1] - z) ** 2 < (t[2] + rad) ** 2);
  const floorAt = (x, y, z) => { const g = collider.groundY(x, y + 0.6, z, 1.4); return g > y - 0.25 && g < y + 0.35 ? g : null; };
  const zs = zones.filter((z) => (z.type === "indoor" || z.type === "semi") && !/bosque/.test(z.name));
  for (const z of zs) {
    const area = (z.max[0] - z.min[0]) * (z.max[2] - z.min[2]);
    const n = Math.round(Math.min(14, area / 16) * density);
    const y0 = z.min[1];
    for (let k = 0, tries = 0; k < n && tries < n * 12; tries++) {
      const px = z.min[0] + 0.6 + r() * (z.max[0] - z.min[0] - 1.2), pz = z.min[2] + 0.6 + r() * (z.max[2] - z.min[2] - 1.2);
      const fy = floorAt(px, y0, pz); if (fy == null) continue;
      // al muro más cercano en una de las 4 direcciones cardinales
      const a0 = Math.floor(r() * 4);
      let best = null;
      for (let i = 0; i < 4; i++) {
        const a = ((a0 + i) % 4) * Math.PI / 2;
        d.set(Math.cos(a), 0, Math.sin(a)); o.set(px, fy + 0.35, pz);
        const h = collider.raycast(o, d, 7);
        if (h && h.distance > 0.7 && (!best || h.distance < best.dist)) best = { dist: h.distance, a, dx: d.x, dz: d.z };
      }
      if (!best) continue;
      const big = pick(r, z.type === "indoor" ? BIG_INDOOR : BIG_SEMI);
      const rad = big[2];
      const back = rad + 0.06 + r() * 0.12;
      const bx = px + best.dx * (best.dist - back), bz = pz + best.dz * (best.dist - back);
      const by = floorAt(bx, fy, bz); if (by == null || !free(bx, bz, rad)) continue;
      // de espaldas al muro, con algo de descuido
      const rotY = Math.atan2(-best.dx, -best.dz) + (r() - 0.5) * 0.5 + (r() < 0.2 ? Math.PI / 2 : 0);
      out.push({ model: big[0], pos: [bx, by, bz], rotY, dress: 1 });
      taken.push([bx, bz, rad]);
      k++;
      // basura pequeña alrededor, también pegada al zócalo
      const m = Math.floor(r() * 4);
      for (let j = 0; j < m; j++) {
        const sm = pick(r, SMALL);
        const along = (r() - 0.5) * 2.2, off = 0.12 + r() * 0.5;
        const sx = bx - best.dz * along - best.dx * off * 0.5, sz = bz + best.dx * along - best.dz * off * 0.5;
        const sy = floorAt(sx, by, sz); if (sy == null || !free(sx, sz, 0.12)) continue;
        out.push({ model: sm[0], pos: [sx, sy, sz], rotY: r() * 6.283, collide: false, tiltX: sm[0] === "can_rusted" && r() < 0.5 ? Math.PI / 2 : 0, dress: 1 });
        taken.push([sx, sz, 0.12]);
      }
    }
  }
  return out;
}

// [modelo, peso, escala min, max, ¿alinear a la pendiente?]
// Las versiones *_lod son simplificaciones (~5k triángulos) de los originales de Poly Haven (60–340k): se instancian
// cientos de veces, así que cada zona tiene además un presupuesto de triángulos (TRI_BUDGET × density).
const TRI = { fern_02: 6232, nettle_plant_lod: 9386, shrub_04_lod: 8114 };
const TRI_BUDGET = { dark: 2.2e6, burnt: 2.4e6 };
const FOREST_BURNT = [["dry_branches_medium_01_lod", 7, 0.8, 1.3, 1], ["dead_tree_trunk_lod", 1.2, 0.8, 1.1, 1], ["dead_tree_trunk_02_lod", 1.2, 0.8, 1.1, 1], ["bark_debris_01_lod", 3, 0.7, 1.2, 1], ["single_root_lod", 2, 0.8, 1.3, 1], ["root_cluster_02_lod", 1, 0.6, 1.0, 1], ["stone_01_lod", 3, 0.6, 1.3, 1], ["rock_07_lod", 1, 0.3, 0.6, 0], ["rock_09_lod", 1, 0.3, 0.6, 0]];
const FOREST_DARK = [["fern_02", 9, 0.8, 1.4, 0], ["nettle_plant_lod", 4, 0.7, 1.2, 0], ["shrub_04_lod", 2, 0.5, 0.9, 0], ["single_root_lod", 2, 0.8, 1.3, 1], ["pine_roots_lod", 1, 0.7, 1.1, 1], ["stone_01_lod", 3, 0.6, 1.3, 1], ["rock_09_lod", 1.5, 0.3, 0.7, 0], ["tree_stump_02_lod", 0.6, 0.7, 1.1, 0], ["bark_debris_01_lod", 1.5, 0.7, 1.2, 1]];

export async function forestFloor(world, assets, { density = 1, seed = 777 } = {}) {
  const r = rng(seed);
  const zones = world.zones.filter((z) => /bosque/.test(z.name));
  if (!zones.length || density <= 0) return 0;
  const trunks = world.trees?.colliders || [];
  const groups = new Map();   // modelo → [matrices]
  const q = new Quaternion(), e = new Euler(), up = new Vector3(0, 1, 0), nrm = new Vector3(), sc = new Vector3(), p = new Vector3();
  const qt = new Quaternion();
  for (const z of zones) {
    const dark = /oscuro/.test(z.name);
    const list = dark ? FOREST_DARK : FOREST_BURNT;
    const area = (z.max[0] - z.min[0]) * (z.max[2] - z.min[2]);
    const n = Math.round(area * (dark ? 0.32 : 0.16) * density);
    let tris = 0;
    const budget = (dark ? TRI_BUDGET.dark : TRI_BUDGET.burnt) * density;
    for (let i = 0; i < n && tris < budget; i++) {
      // agrupado: la mitad de los objetos nace junto a un tronco (raíces, helechos al pie del árbol)
      let x, zz;
      if (trunks.length && r() < 0.5) { const t = trunks[Math.floor(r() * trunks.length)]; const a = r() * 6.283, d = t.r + 0.2 + r() * 1.6; x = t.x + Math.cos(a) * d; zz = t.z + Math.sin(a) * d; }
      else { x = z.min[0] + r() * (z.max[0] - z.min[0]); zz = z.min[2] + r() * (z.max[2] - z.min[2]); }
      if (x < z.min[0] || x > z.max[0] || zz < z.min[2] || zz > z.max[2]) continue;
      if (trunks.some((t) => (t.x - x) ** 2 + (t.z - zz) ** 2 < (t.r + 0.1) ** 2)) continue;
      const y = world.collider.groundY(x, 40, zz, 80); if (!isFinite(y)) continue;
      const it = pick(r, list);
      tris += TRI[it[0]] || 5000;
      const s = it[2] + r() * (it[3] - it[2]);
      e.set(0, r() * 6.283, 0); q.setFromEuler(e);
      if (it[4]) {   // inclinar según la pendiente del terreno
        const h = 0.4, gx = world.collider.groundY(x + h, y + 2, zz, 4) - world.collider.groundY(x - h, y + 2, zz, 4), gz = world.collider.groundY(x, y + 2, zz + h, 4) - world.collider.groundY(x, y + 2, zz - h, 4);
        if (isFinite(gx) && isFinite(gz)) { nrm.set(-gx / (2 * h), 1, -gz / (2 * h)).normalize(); qt.setFromUnitVectors(up, nrm); q.premultiply(qt); }
      }
      p.set(x, y - 0.03 * s, zz); sc.setScalar(s);
      const key = (dark ? "" : "burnt:") + it[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(new Matrix4().compose(p.clone(), q.clone(), sc.clone()));
    }
  }
  let count = 0;
  const box = new Box3(), m = new Matrix4(), local = new Matrix4();
  const charred = new Map();
  for (const [key, mats] of groups) {
    const burnt = key.startsWith("burnt:"), model = key.replace("burnt:", "");
    let gltf;
    try { gltf = await assets.loadModel(model); } catch { continue; }
    const root = gltf.scene.clone(true);
    root.updateMatrixWorld(true);
    // mismo anclaje que World.instantiate: centrado en xz, base en y = 0
    box.setFromObject(root);
    const c = box.getCenter(new Vector3());
    const fix = new Matrix4().makeTranslation(-c.x, -box.min.y, -c.z);
    root.traverse((o) => {
      if (!o.isMesh) return;
      local.multiplyMatrices(fix, o.matrixWorld);
      let mat = o.material;
      if (burnt) {   // carbonizado: casi negro, mate, con un leve tono pardo
        if (!charred.has(mat)) { const c = mat.clone(); c.color.multiplyScalar(0.22).lerp({ r: 0.03, g: 0.028, b: 0.026, isColor: true }, 0.4); c.roughness = Math.min(1, (c.roughness ?? 1) * 1.15); charred.set(mat, c); }
        mat = charred.get(mat);
      }
      // v3.0 rendimiento: un InstancedMesh por celda de CELL m (antes uno por modelo para todo el bosque: su
      // esfera envolvente lo cubría todo y se dibujaban 4.4 M triángulos aunque el jugador estuviera en el patio).
      const cells = new Map();
      for (const M of mats) {
        const k = Math.floor(M.elements[12] / CELL) + "," + Math.floor(M.elements[14] / CELL);
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push(M);
      }
      for (const [k, list] of cells) {
        const im = new InstancedMesh(o.geometry, mat, list.length);
        list.forEach((M, i) => im.setMatrixAt(i, m.multiplyMatrices(M, local)));
        im.instanceMatrix.needsUpdate = true;
        im.castShadow = !/fern|nettle|shrub/.test(model);
        im.receiveShadow = true;
        im.computeBoundingSphere();
        im.userData.surface = /stone|rock/.test(model) ? "concrete" : "soft";
        im.name = "forest:" + key;
        const [cx, cz] = k.split(",").map((v) => (+v + 0.5) * CELL);
        im.userData.cell = [cx, cz];
        world.scene.add(im);
        FOREST_CELLS.push(im);
      }
    });
    count += mats.length;
  }
  console.info(`[dressing] sotobosque: ${count} instancias de ${groups.size} modelos`);
  return count;
}
