// world/nightlights.js — luces rojas de la noche (v3.0, modo terror)
//
//  · Balizas de pared: se colocan solas lanzando rayos contra los muros de interiores y soportales (2.3–2.7 m).
//  · Carteles de salida rojos (texto por canvas) sobre algunas puertas/paños de muro; luz roja tenue.
//  · Bengalas de carretera en el suelo (exteriores y bosques): llama roja muy intensa con parpadeo rápido, que
//    tiñe la neblina de rojo a varios metros (pase volumétrico) y proyecta luz dura alrededor.
// Todas entran en el pool de luces puntuales cercanas de World (las N más próximas al jugador se encienden de verdad;
// el resto se ve solo como emisivo + bloom). Determinista.
import {
  Vector3, Matrix4, Quaternion, Euler, Color, Group, Mesh, InstancedMesh, BoxGeometry, CylinderGeometry, PlaneGeometry,
  MeshBasicMaterial, MeshStandardMaterial, CanvasTexture, SRGBColorSpace, DoubleSide, AdditiveBlending,
} from "../three.js";

const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const _m = new Matrix4(), _q = new Quaternion(), _e = new Euler(), _v = new Vector3(), _s = new Vector3(), _c = new Color();

function exitTexture(text) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 96;
  const g = c.getContext("2d");
  g.fillStyle = "#1a0202"; g.fillRect(0, 0, 256, 96);
  g.fillStyle = "#ff2a14"; g.font = "bold 58px Arial, Helvetica, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, 128, 52);
  // tubo fundido a medias: un tramo más oscuro
  g.fillStyle = "rgba(20,0,0,0.65)"; g.fillRect(150 + Math.random() * 40, 20, 18, 60);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

export class NightLights {
  constructor(engine, world, { beacons = 14, exits = 6, flares = 10, seed = 6661 } = {}) {
    this.engine = engine;
    this.world = world;
    this.time = 0;
    this.specs = [];
    this.flares = [];
    this.exits = [];
    const r = rng(seed);
    const col = world.collider;
    const zones = world.zones;
    const wallSpots = this.findWallSpots(r, col, zones.filter((z) => (z.type === "indoor" || z.type === "semi") && !/bosque/.test(z.name)), beacons + exits);

    // balizas de pared
    const bGeo = new CylinderGeometry(0.055, 0.065, 0.11, 14);
    const bMat = new MeshBasicMaterial({ color: 0xffffff, fog: false });
    this.beaconMesh = new InstancedMesh(bGeo, bMat, Math.max(1, beacons));
    this.beaconMesh.count = 0;
    const capGeo = new BoxGeometry(0.13, 0.045, 0.1);
    const capMat = new MeshStandardMaterial({ color: 0x141416, roughness: 0.55, metalness: 0.4 });
    this.capMesh = new InstancedMesh(capGeo, capMat, Math.max(1, beacons));
    this.capMesh.count = 0;
    let bi = 0;
    for (const sp of wallSpots.slice(0, beacons)) {
      const p = sp.p.clone().addScaledVector(sp.n, 0.08);
      _m.makeTranslation(p.x, p.y, p.z);
      this.beaconMesh.setMatrixAt(bi, _m);
      this.capMesh.setMatrixAt(bi, _m.makeTranslation(p.x - sp.n.x * 0.03, p.y - 0.075, p.z - sp.n.z * 0.03));
      this.beaconMesh.setColorAt(bi, _c.setRGB(0, 0, 0));
      const spec = { pos: [p.x + sp.n.x * 0.1, p.y, p.z + sp.n.z * 0.1], color: 0xff1608, intensity: 0, distance: 7, flicker: 0, zone: "indoor", night: "beacon", base: 0.55, phase: r() * 6.28, rate: 1.6 + r() * 2.2, idx: bi };
      this.specs.push(spec);
      bi++;
    }
    this.beaconMesh.count = bi;
    this.capMesh.count = bi;
    this.beaconMesh.frustumCulled = this.capMesh.frustumCulled = false;
    engine.scene.add(this.beaconMesh, this.capMesh);

    // carteles de salida
    const words = ["EXIT", "SALIDA", "EXIT", "SALIDA"];
    for (const [i, sp] of wallSpots.slice(beacons, beacons + exits).entries()) {
      const mat = new MeshBasicMaterial({ map: exitTexture(words[i % words.length]), fog: false, color: new Color(1.4, 1.4, 1.4) });
      const m = new Mesh(new PlaneGeometry(0.42, 0.16), mat);
      const p = sp.p.clone().addScaledVector(sp.n, 0.035);
      m.position.copy(p);
      m.lookAt(p.clone().add(sp.n));
      const box = new Mesh(new BoxGeometry(0.46, 0.2, 0.05), capMat);
      box.position.copy(sp.p.clone().addScaledVector(sp.n, 0.008));
      box.quaternion.copy(m.quaternion);
      engine.scene.add(box, m);
      const spec = { pos: [p.x + sp.n.x * 0.25, p.y - 0.1, p.z + sp.n.z * 0.25], color: 0xff2410, intensity: 0, distance: 3.2, flicker: 0, zone: "indoor", night: "exit", base: 0.18, phase: r() * 6.28, mat };
      this.specs.push(spec);
      this.exits.push(spec);
    }

    // bengalas de carretera: exteriores urbanos + bosques
    const outZones = zones.filter((z) => z.type === "outdoor");
    const fGeo = new CylinderGeometry(0.018, 0.018, 0.26, 10);
    const fMat = new MeshStandardMaterial({ color: 0x7a0d0a, roughness: 0.7 });
    const flameMat = new MeshBasicMaterial({ color: new Color(9, 1.2, 0.45), fog: false, transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide });
    for (let i = 0, tries = 0; i < flares && tries < flares * 30; tries++) {
      const z = outZones[Math.floor(r() * outZones.length)];
      if (!z) break;
      const x = z.min[0] + 1 + r() * (z.max[0] - z.min[0] - 2), zz = z.min[2] + 1 + r() * (z.max[2] - z.min[2] - 2);
      const y = col.groundY(x, z.min[1] + 6, zz, 12);
      if (!isFinite(y) || y > z.min[1] + 2) continue;
      if (this.flares.some((f) => (f.x - x) ** 2 + (f.z - zz) ** 2 < 64)) continue;
      const g = new Group();
      const stick = new Mesh(fGeo, fMat);
      stick.rotation.z = Math.PI / 2 - 0.12;
      stick.position.y = 0.022;
      const flame = new Mesh(new PlaneGeometry(0.16, 0.2), flameMat);
      flame.position.set(0.13, 0.08, 0);
      const flame2 = flame.clone(); flame2.rotation.y = Math.PI / 2;
      g.add(stick, flame, flame2);
      g.position.set(x, y, zz);
      g.rotation.y = r() * 6.28;
      engine.scene.add(g);
      const fx = g.localToWorld(new Vector3(0.13, 0.12, 0));
      const spec = { pos: [fx.x, fx.y + 0.05, fx.z], color: 0xff2a0e, intensity: 0, distance: 5, flicker: 0, zone: "outdoor", night: "flare", base: 0.45, phase: r() * 100, flames: [flame, flame2] };
      this.specs.push(spec);
      this.flares.push({ x, z: zz, spec });
      i++;
    }
    world.lightSpecs.push(...this.specs);
    world._sorted = null;
    console.info(`[night] balizas ${bi}, carteles ${this.exits.length}, bengalas ${this.flares.length}`);
  }

  findWallSpots(r, col, zones, n) {
    const out = [];
    const o = new Vector3(), d = new Vector3();
    for (let tries = 0; tries < n * 40 && out.length < n; tries++) {
      const z = zones[Math.floor(r() * zones.length)];
      if (!z) break;
      const px = z.min[0] + 0.5 + r() * (z.max[0] - z.min[0] - 1), pz = z.min[2] + 0.5 + r() * (z.max[2] - z.min[2] - 1);
      const fy = col.groundY(px, z.min[1] + 1.2, pz, 2);
      if (!isFinite(fy) || Math.abs(fy - z.min[1]) > 0.4) continue;
      const a = Math.floor(r() * 4) * Math.PI / 2;
      d.set(Math.cos(a), 0, Math.sin(a));
      o.set(px, fy + 2.3 + r() * 0.4, pz);
      const h = col.raycast(o, d, 9);
      if (!h || h.distance < 1.2 || !h.face) continue;
      const nrm = h.face.normal.clone();
      if (Math.abs(nrm.y) > 0.2) continue;
      nrm.y = 0; nrm.normalize();
      if (nrm.dot(d) > -0.7) continue;
      // techo por encima (no colgar balizas al aire libre en un soportal sin muro)
      const p = h.point.clone();
      if (out.some((q) => q.p.distanceToSquared(p) < 49)) continue;
      out.push({ p, n: nrm });
    }
    return out;
  }

  update(dt) {
    this.time += dt;
    const t = this.time;
    for (const s of this.specs) {
      if (s.night === "beacon") {
        // giratoria: destellos rápidos con respiración
        const k = Math.pow(0.5 + 0.5 * Math.sin(t * s.rate * 3.1 + s.phase), 6);
        s.intensity = s.base * (0.12 + 0.88 * k);
        this.beaconMesh.setColorAt(s.idx, _c.setRGB(1, 0.05, 0.02).multiplyScalar(0.8 + 4 * k));
      } else if (s.night === "exit") {
        // tubo de neón viejo: casi siempre encendido, con caídas de vez en cuando
        const flick = Math.sin(t * 13 + s.phase) + Math.sin(t * 31.7 + s.phase * 2) > 1.75 ? 0.15 : 1;
        s.intensity = s.base * flick;
        s.mat.color.setScalar(1.4 * flick + 0.1);
      } else if (s.night === "flare") {
        // llama: ruido rápido
        const n = 0.72 + 0.16 * Math.sin(t * 17 + s.phase) + 0.12 * Math.sin(t * 41.3 + s.phase * 1.7) + 0.08 * Math.sin(t * 93 + s.phase);
        s.intensity = s.base * n;
        for (const f of s.flames) { f.scale.set(0.85 + 0.3 * n, 0.8 + 0.5 * n, 1); }
      }
    }
    if (this.beaconMesh.instanceColor) this.beaconMesh.instanceColor.needsUpdate = true;
  }
}
