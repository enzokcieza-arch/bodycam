// world/atmosphere.js — Fase 2 (v3.0): luces de emergencia, luminarias emisivas, polvo en suspensión y
// datos para el pase volumétrico (render/volumetric.js). Todo generado por código, sin assets nuevos.
import {
  Vector3, Matrix4, Color, Quaternion, InstancedMesh, BoxGeometry, MeshBasicMaterial, MeshStandardMaterial,
  Points, BufferGeometry, BufferAttribute, ShaderMaterial, AdditiveBlending,
} from "../three.js";

// Balizas rojas de emergencia: [x, y, z, fase]. Colocadas en interiores y bocas de pasillo (ver docs/LOOK.md).
export const EMERGENCY_LIGHTS = [
  [5.2, 3.2, -17.6, 0.0],     // salas PB norte
  [-5.5, 6.75, -13.9, 1.7],   // galería P1 norte (fondo del pasillo superior)
  [-17.6, 6.75, -6.5, 2.3],   // galería P1 oeste
  [-19.9, 3.2, 6.5, 3.1],     // salas PB oeste / escalera
  [27.5, 2.9, -15.5, 0.9],    // edificio del callejón
  [-9.5, 2.75, 40.5, 1.2],    // obra PB
];

const DUST_LIGHTS = 4;
const _m = new Matrix4(), _q = new Quaternion(), _s = new Vector3(), _p = new Vector3(), _c = new Color();

export class Atmosphere {
  constructor(engine, world) {
    this.engine = engine;
    this.world = world;
    this.time = 0;
    this.params = { haze: 1, volumetric: 1, dust: 1, wetness: 1, grime: 1, emergency: 1, godrays: 1 };
    this.fogBase = engine.scene.fog ? engine.scene.fog.density : 0.014;
    this.ambient = 1;
    this.build();
  }

  build() {
    const { world, engine } = this;
    const q = engine.quality;
    // ── luces de emergencia: entran en el mismo pool de luces puntuales cercanas que los fluorescentes
    this.emergency = EMERGENCY_LIGHTS.map(([x, y, z, ph]) => {
      const spec = { pos: [x, y - 0.12, z], color: 0xff1a0c, intensity: 0, distance: 5.5, flicker: 0, zone: "indoor", emergency: true, base: 0.6, phase: ph };
      world.lightSpecs.push(spec);
      return spec;
    });
    world._sorted = null;
    {
      let sd = 99;
      const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
      for (const s of world.lightSpecs) {
        if (s.emergency) continue;
        const u = rr();
        if (u < 0.25) { s.dead = true; s.intensity = 0; }
        else if (u < 0.7) s.flicker = 1;
        s.color = 0xd6efe6;
        s.intensity *= 0.3;   // calibradas de día: de noche, con la ganancia del sensor, se quemaban
      }
    }

    // ── luminarias emisivas (alimentan bloom, halación y suciedad de lente): un tubo por fluorescente,
    //    una carcasa roja por baliza. InstancedMesh + instanceColor en HDR.
    const specs = world.lightSpecs.slice();   // copia: las luces nocturnas se añaden después y tienen su propia malla
    this.fixtureSpecs = specs;
    const geo = new BoxGeometry(1, 1, 1);
    const mat = new MeshBasicMaterial({ color: 0xffffff, fog: false });
    const inst = new InstancedMesh(geo, mat, specs.length);
    inst.frustumCulled = false;
    specs.forEach((s, i) => {
      const em = !!s.emergency;
      _p.set(s.pos[0], s.pos[1] + (em ? 0.1 : 0.085), s.pos[2]);
      if (em) _s.set(0.11, 0.07, 0.11);
      else if (s.zone === "semi") _s.set(0.09, 0.09, 0.09);
      else _s.set(1.16, 0.022, 0.05);
      inst.setMatrixAt(i, _m.compose(_p, _q, _s));
      inst.setColorAt(i, _c.setRGB(0, 0, 0));
    });
    inst.instanceMatrix.needsUpdate = true;
    engine.scene.add(inst);
    this.fixtures = inst;
    // base oscura de las balizas
    const baseGeo = new BoxGeometry(0.16, 0.035, 0.16);
    const baseMat = new MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.6, metalness: 0.3 });
    const bases = new InstancedMesh(baseGeo, baseMat, this.emergency.length);
    this.emergency.forEach((s, i) => bases.setMatrixAt(i, _m.makeTranslation(s.pos[0], s.pos[1] + 0.15, s.pos[2])));
    engine.scene.add(bases);

    // ── polvo en suspensión: puntos que envuelven a la cámara; solo brillan dentro de una luz o del haz de la linterna
    this.dustCount = q.dust || 0;
    if (this.dustCount > 0) {
      const n = this.dustCount, pos = new Float32Array(n * 3), seed = new Float32Array(n);
      let s = 1234;
      const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < n; i++) { pos[i * 3] = rnd() * 10; pos[i * 3 + 1] = rnd() * 5; pos[i * 3 + 2] = rnd() * 10; seed[i] = rnd(); }
      const g = new BufferGeometry();
      g.setAttribute("position", new BufferAttribute(pos, 3));
      g.setAttribute("seed", new BufferAttribute(seed, 1));
      const u = {
        time: { value: 0 }, camPos: { value: new Vector3() }, amount: { value: 1 }, pxScale: { value: 500 },
        lPos: { value: Array.from({ length: DUST_LIGHTS }, () => new Vector3()) },
        lCol: { value: Array.from({ length: DUST_LIGHTS }, () => new Vector3()) },
        torchPos: { value: new Vector3() }, torchDir: { value: new Vector3(0, 0, -1) }, torchCol: { value: new Vector3() },
        torchCone: { value: new Vector3(0.8, 0.95, 0) }, ambient: { value: new Vector3(0.02, 0.02, 0.02) },
      };
      const m = new ShaderMaterial({
        uniforms: u, transparent: true, depthWrite: false, blending: AdditiveBlending,
        vertexShader: /* glsl */ `
          attribute float seed;
          uniform float time; uniform vec3 camPos; uniform float pxScale;
          uniform vec3 lPos[${DUST_LIGHTS}]; uniform vec3 lCol[${DUST_LIGHTS}];
          uniform vec3 torchPos; uniform vec3 torchDir; uniform vec3 torchCol; uniform vec3 torchCone; uniform vec3 ambient;
          varying vec3 vCol;
          void main(){
            const vec3 BOX = vec3(10.0, 5.0, 10.0);
            vec3 drift = vec3(sin(time * 0.11 + seed * 40.0), -0.035 * time + 0.2 * sin(time * 0.23 + seed * 17.0), cos(time * 0.09 + seed * 29.0)) * 0.35;
            vec3 p = mod(position + drift - camPos + BOX * 0.5, BOX) - BOX * 0.5 + camPos;
            vec3 c = ambient;
            for (int i = 0; i < ${DUST_LIGHTS}; i++) { vec3 v = lPos[i] - p; c += lCol[i] / (1.0 + dot(v, v) * 1.6); }
            vec3 tv = p - torchPos; float r2 = dot(tv, tv) + 0.05;
            c += torchCol * smoothstep(torchCone.x, torchCone.y, dot(tv * inversesqrt(r2), torchDir)) / r2;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float dist = -mv.z;
            float fade = smoothstep(0.25, 0.9, dist) * (1.0 - smoothstep(3.5, 5.0, dist));
            float tw = 0.6 + 0.4 * sin(time * (1.0 + seed * 3.0) + seed * 90.0);     // la mota gira y destella
            vCol = c * fade * tw;
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp((0.006 + 0.010 * seed) * pxScale / max(dist, 0.1), 1.0, 9.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform float amount; varying vec3 vCol;
          void main(){
            vec2 d = gl_PointCoord - 0.5; float a = smoothstep(0.25, 0.0, dot(d, d));
            gl_FragColor = vec4(vCol * a * amount, 1.0);
          }`,
      });
      const pts = new Points(g, m);
      pts.frustumCulled = false;
      pts.renderOrder = 5;
      engine.scene.add(pts);
      this.dust = pts;
    }
  }

  // llamar DESPUÉS de world.updateLights(): lee el pool de luces activas
  update(dt, camera, vm, ambient = 1) {
    this.time += dt;
    this.ambient = ambient;
    const { world, engine, params } = this;
    // pulso de las balizas (respiración lenta, nunca del todo apagadas)
    for (const s of this.emergency) {
      const k = 0.5 + 0.5 * Math.sin(this.time * 2.6 + s.phase);
      s.intensity = s.base * params.emergency * (0.35 + 0.65 * k * k);
    }
    // luminarias: color HDR = color de la luz × nivel (parpadeo incluido)
    const specs = this.fixtureSpecs;
    for (let i = 0; i < specs.length; i++) {
      const s = specs[i];
      const lvl = s.dead ? 0 : s.emergency ? s.intensity / s.base : (s.flicker ? (s._lvl ?? 1) : 1);
      _c.setHex(s.color).multiplyScalar(s.emergency ? 3 * lvl : 2.5 * lvl);
      this.fixtures.setColorAt(i, _c);
      if (s.flicker) s._lvl = 1;     // se recalcula solo mientras está en el pool
    }
    this.fixtures.instanceColor.needsUpdate = true;

    // neblina global (FogExp2 de Three) escalada por "haze"
    // la niebla de Three añade su color aunque no haya luz: en interiores oscuros levantaba los negros a gris.
    // Ahora su color sigue a la luz ambiente del punto donde está la cámara y la densidad base baja un 45 %.
    if (engine.scene.fog) {
      this.fogColor0 || (this.fogColor0 = engine.scene.fog.color.clone());
      engine.scene.fog.density = this.fogBase * (0.30 + 0.25 * params.haze);
      engine.scene.fog.color.copy(engine.post.atmo.skyFog || this.fogColor0).multiplyScalar(0.10 + 0.90 * ambient);
    }

    // datos para el pase volumétrico
    const atmo = engine.post.atmo;
    atmo.enabled = params.haze > 0 || params.volumetric > 0;
    atmo.density = 0.09 * params.volumetric * (0.4 + 0.6 * params.haze);
    atmo.lights = world.dynamicLights;
    atmo.haze = 0.005 * params.haze;
    atmo.godrays = params.godrays;
    atmo.ambient = ambient;
    const fog = engine.scene.fog;
    if (fog) atmo.hazeColor.copy(fog.color);
    if (engine.sun) atmo.sunDir.copy(engine.sun.position).sub(engine.sun.target.position).normalize();
    atmo.torch = vm && vm.torch && vm.torch.intensity > 0.5 ? vm.torch : null;

    if (this.dust) {
      const u = this.dust.material.uniforms;
      this.dust.visible = params.dust > 0;
      u.time.value = this.time;
      u.camPos.value.copy(camera.position);
      u.amount.value = 0.55 * params.dust;
      u.pxScale.value = engine.height;
      const L = world.dynamicLights;
      for (let i = 0; i < DUST_LIGHTS; i++) {
        const l = L[i];
        if (l && l.intensity > 0) { u.lPos.value[i].copy(l.position); u.lCol.value[i].set(l.color.r, l.color.g, l.color.b).multiplyScalar(l.intensity * 0.16); }
        else u.lCol.value[i].set(0, 0, 0);
      }
      if (atmo.torch) {
        const t = atmo.torch;
        t.getWorldPosition(u.torchPos.value);
        t.target.getWorldPosition(_p);
        u.torchDir.value.copy(_p).sub(u.torchPos.value).normalize();
        u.torchCol.value.set(t.color.r, t.color.g, t.color.b).multiplyScalar(t.intensity * 0.05);
        u.torchCone.value.set(Math.cos(t.angle), Math.cos(t.angle * (1 - t.penumbra)), 0);
      } else u.torchCol.value.set(0, 0, 0);
      const a = 0.012 * ambient;
      u.ambient.value.set(a, a, a);
    }
  }
}
