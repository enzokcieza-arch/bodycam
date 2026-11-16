// weapon/gunfx.js — Fase 4 (v3.0): materiales creíbles para arma/guantes, mira red-dot colimada y linterna con cookie.
// Todo procedural (sin assets nuevos). Se aplica sobre el viewmodel ya cargado (weapon/viewmodel.js).
import {
  Vector3, Vector4, Group, Mesh, CylinderGeometry, BoxGeometry, CircleGeometry, MeshStandardMaterial, ShaderMaterial,
  CanvasTexture, AdditiveBlending, DoubleSide, SRGBColorSpace, LinearFilter,
} from "../three.js";

// ── desgaste procedural en espacio de objeto (posición de bind → estable aunque el arma se anime)
const WEAR_VERT_PARS = /* glsl */ `varying vec3 vObjPos;\n`;
const WEAR_FRAG_PARS = /* glsl */ `
  varying vec3 vObjPos;
  uniform float wearScale; uniform vec4 wearAmt;   // x = arañazos, y = grasa/manchas, z = borde gastado, w = tejido
  float wh(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float wn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(wh(i), wh(i + vec3(1,0,0)), f.x), mix(wh(i + vec3(0,1,0)), wh(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(wh(i + vec3(0,0,1)), wh(i + vec3(1,0,1)), f.x), mix(wh(i + vec3(0,1,1)), wh(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float wfbm(vec3 p){ return 0.5 * wn(p) + 0.25 * wn(p * 2.03) + 0.125 * wn(p * 4.01) + 0.0625 * wn(p * 8.1); }
`;

function addWear(mat, { scale = 60, scratches = 0, grease = 0, edge = 0, weave = 0 } = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.wearScale = { value: scale };
    sh.uniforms.wearAmt = { value: new Vector4(scratches, grease, edge, weave) };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\n" + WEAR_VERT_PARS)
      .replace("#include <begin_vertex>", "#include <begin_vertex>\n  vObjPos = position;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\n" + WEAR_FRAG_PARS)
      .replace("#include <normal_fragment_maps>", /* glsl */ `#include <normal_fragment_maps>
        // pliegues de tela / costuras (solo materiales con trama): bump procedural por derivadas de pantalla
        if (wearAmt.w > 0.0) {
          vec3 fp = vObjPos * wearScale;
          float hh = wfbm(vec3(fp.x * 0.45, fp.y * 0.45, fp.z * 2.2)) * 0.8 + wn(fp * 5.0) * 0.2;
          hh += smoothstep(0.92, 1.0, abs(sin(fp.z * 1.3))) * 0.35;                // costuras transversales
          vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
          float dhx = dFdx(hh), dhy = dFdy(hh);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
          normal = normalize(abs(det) * normal - grad * 0.9 * wearAmt.w);
        }`)
      .replace("#include <roughnessmap_fragment>", /* glsl */ `#include <roughnessmap_fragment>
        {
          vec3 wp = vObjPos * wearScale;
          float big = wfbm(wp * 0.35);                                  // manchas grandes de grasa / manoseo
          float fine = wfbm(wp * 3.0);
          // arañazos: ruido muy estirado a lo largo del arma
          float scr = wn(vec3(wp.x * 9.0, wp.y * 9.0, wp.z * 0.35)); scr = smoothstep(0.80, 0.96, scr);
          float worn = smoothstep(0.52, 0.80, big * 0.6 + fine * 0.5) * wearAmt.z;
          roughnessFactor = clamp(roughnessFactor + (big - 0.5) * 0.55 * wearAmt.y + (fine - 0.5) * 0.25 * wearAmt.y - scr * 0.25 * wearAmt.x - worn * 0.18, 0.08, 1.0);
          diffuseColor.rgb *= 1.0 + (fine - 0.5) * 0.35 * wearAmt.y;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 2.6 + 0.045, clamp(scr * wearAmt.x * 0.7 + worn, 0.0, 1.0));
          // tejido: trama cruzada + pelusa clara en ángulos rasantes
          if (wearAmt.w > 0.0) {
            float wv = wfbm(wp * 6.0) - 0.5;
            diffuseColor.rgb *= 1.0 + wv * 0.30 * wearAmt.w + (big - 0.5) * 0.5 * wearAmt.w;
            float fres = pow(1.0 - saturate(dot(normalize(vViewPosition), normalize(vNormal))), 3.0);
            diffuseColor.rgb += fres * 0.06 * wearAmt.w;
          }
        }`);
  };
  mat.customProgramCacheKey = () => `wear2|${scratches}|${grease}|${edge}|${weave}|${scale}`;
  mat.needsUpdate = true;
}

// ── cookie de linterna: núcleo caliente, corona, anillos del reflector y derrame tenue hasta el borde
function makeTorchCookie() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256);
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 126);
  gr.addColorStop(0.0, "rgb(255,255,255)");
  gr.addColorStop(0.16, "rgb(255,252,244)");
  gr.addColorStop(0.24, "rgb(150,146,138)");
  gr.addColorStop(0.40, "rgb(92,90,86)");
  gr.addColorStop(0.50, "rgb(108,106,100)");     // anillo del reflector
  gr.addColorStop(0.58, "rgb(40,39,38)");
  gr.addColorStop(0.92, "rgb(14,14,15)");        // derrame (spill)
  gr.addColorStop(1.0, "rgb(0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  // imperfecciones: sombra del LED y anillos finos
  g.globalCompositeOperation = "multiply";
  for (let i = 0; i < 5; i++) {
    g.strokeStyle = `rgba(${150 + i * 15},${150 + i * 15},${150 + i * 15},1)`;
    g.lineWidth = 1.5; g.beginPath(); g.arc(128 + (i % 2 ? 2 : -2), 128, 30 + i * 17, 0, 6.2832); g.stroke();
  }
  g.fillStyle = "rgba(170,170,170,1)"; g.fillRect(124, 122, 8, 12);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace; t.minFilter = t.magFilter = LinearFilter; t.generateMipmaps = false;
  return t;
}

// ── mira de punto rojo: tubo corto con dos lentes. El punto está COLIMADO: se dibuja en el fragment shader de la
//    lente donde el rayo de vista es paralelo al eje del arma → sin paralaje al mover la cabeza y solo visible a
//    través del cristal. Emite en HDR para que el bloom le dé el halo.
function makeRedDot() {
  const grp = new Group();
  const body = new MeshStandardMaterial({ color: 0x151617, roughness: 0.46, metalness: 0.75 });
  addWear(body, { scale: 90, scratches: 0.8, grease: 0.7, edge: 0.5 });
  const R = 0.0175, L = 0.062;
  const tube = new Mesh(new CylinderGeometry(R, R, L, 28, 1, true), body);
  tube.rotation.x = Math.PI / 2; tube.material.side = DoubleSide;
  const ringF = new Mesh(new CylinderGeometry(R + 0.003, R + 0.003, 0.012, 28, 1, true), body);
  ringF.rotation.x = Math.PI / 2; ringF.position.z = -L / 2 + 0.006;
  const ringB = ringF.clone(); ringB.position.z = L / 2 - 0.006;
  const mount = new Mesh(new BoxGeometry(0.026, 0.016, 0.046), body); mount.position.y = -R - 0.007;
  const rail = new Mesh(new BoxGeometry(0.021, 0.008, 0.085), body); rail.position.y = -R - 0.019;
  const knobT = new Mesh(new CylinderGeometry(0.0075, 0.0075, 0.011, 14), body); knobT.position.set(0, R + 0.005, 0.004);
  const knobR = new Mesh(new CylinderGeometry(0.0075, 0.0075, 0.011, 14), body); knobR.rotation.z = Math.PI / 2; knobR.position.set(R + 0.005, 0, 0.004);
  const batt = new Mesh(new CylinderGeometry(0.0085, 0.0085, 0.02, 14), body); batt.rotation.z = Math.PI / 2; batt.position.set(-R - 0.008, -0.004, -0.008);
  grp.add(tube, ringF, ringB, mount, rail, knobT, knobR, batt);

  const lensMat = new ShaderMaterial({
    transparent: true, depthWrite: false, side: DoubleSide,
    uniforms: { axis: { value: new Vector3(0, 0, -1) }, dotOn: { value: 1 }, dotSize: { value: 0.0042 }, bright: { value: 1 } },
    vertexShader: /* glsl */ `varying vec3 vView; varying vec3 vN; varying vec2 vUv2;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vView = mv.xyz; vN = normalMatrix * normal; vUv2 = uv; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: /* glsl */ `uniform vec3 axis; uniform float dotOn; uniform float dotSize; uniform float bright;
      varying vec3 vView; varying vec3 vN; varying vec2 vUv2;
      void main(){
        vec3 v = normalize(vView);
        float ang = acos(clamp(dot(v, axis), -1.0, 1.0));
        float core = exp(-pow(ang / dotSize, 2.0));
        float halo = exp(-pow(ang / (dotSize * 4.5), 2.0)) * 0.10;
        vec3 dotc = vec3(1.0, 0.07, 0.03) * (core * 26.0 + halo * 5.0) * dotOn * bright;
        // tratamiento antirreflejo: tinte ámbar/azulado tenue, más visible en ángulo y hacia el borde
        float fres = pow(1.0 - abs(dot(v, normalize(vN))), 2.0);
        float rr = length(vUv2 - 0.5) * 2.0;
        vec3 coat = mix(vec3(0.20, 0.09, 0.03), vec3(0.03, 0.07, 0.16), fres) * (0.20 + 0.8 * fres + 0.35 * rr * rr);
        float a = 0.10 + 0.30 * fres + 0.18 * rr * rr;
        gl_FragColor = vec4(coat * 0.5 + dotc, min(1.0, a + core + halo));
      }`,
  });
  const lens = new Mesh(new CircleGeometry(R * 0.96, 28), lensMat);
  lens.position.z = -L / 2 + 0.01;
  lens.renderOrder = 6;
  grp.add(lens);
  grp.traverse((o) => { if (o.isMesh) { o.frustumCulled = false; o.castShadow = false; o.receiveShadow = o !== lens; } });
  return { group: grp, lensMat, radius: R, length: L };
}

// Mide el arma (malla skinned, sin brazos) en el espacio de gunOff: techo del cajón de mecanismos y línea de miras.
function measureGun(vm) {
  const inv = vm.gunOff.matrixWorld.clone().invert();
  const v = new Vector3();
  const isArm = (m) => /^arm/.test(m.name) || /^arm/.test(m.parent?.name || "");
  let zMin = Infinity, zMax = -Infinity;
  const pts = [];
  vm.model.traverse((m) => {
    if (!m.isSkinnedMesh || isArm(m)) return;
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 2) {
      m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld).applyMatrix4(inv);
      pts.push(v.x, v.y, v.z);
      if (v.z < zMin) zMin = v.z;
      if (v.z > zMax) zMax = v.z;
    }
  });
  return { pts, zMin, zMax };       // zMin = boca (el arma apunta a −z)
}

export function enhanceViewmodel(vm, engine, opts = {}) {
  const out = {};
  // 1) materiales
  vm.model.traverse((m) => {
    if (!m.isMesh || !m.material) return;
    const mat = m.material;
    switch (mat.name) {
      case "ak_receiver": mat.color.setHex(0x232527); mat.roughness = 0.44; mat.metalness = 0.82; addWear(mat, { scale: 70, scratches: 1, grease: 1, edge: 0.75 }); break;
      case "ak_steel": mat.color.setHex(0x1a1b1d); mat.roughness = 0.36; mat.metalness = 0.9; addWear(mat, { scale: 70, scratches: 1.2, grease: 0.8, edge: 1 }); break;
      case "ak_wood": mat.color.setHex(0x4a2c18); mat.roughness = 0.52; addWear(mat, { scale: 38, scratches: 0.5, grease: 1.2, edge: 0.25 }); break;
      case "sleeve": mat.color.setHex(0x30343a); mat.roughness = 0.95; addWear(mat, { scale: 85, weave: 1, grease: 0.6 }); break;
      case "glove": mat.color.setHex(0x17181a); mat.roughness = 0.62; addWear(mat, { scale: 95, weave: 0.55, grease: 1.1, edge: 0.3 }); break;
    }
  });

  // 2) linterna: cookie + cono algo más abierto (núcleo + derrame en una sola luz)
  if (vm.torch) {
    vm.torch.map = makeTorchCookie();
    vm.torch.angle = 0.60;
    vm.torch.penumbra = 0.25;
    vm.torch.color.setHex(0xfff2dc);
    if (engine.quality.torchShadow) {
      vm.torch.castShadow = true;
      vm.torch.shadow.mapSize.set(1024, 1024);
      vm.torch.shadow.camera.near = 0.35;
      vm.torch.shadow.camera.far = 30;
      vm.torch.shadow.bias = -0.002;
      vm.torch.shadow.normalBias = 0.02;
    }
  }

  // 3) mira red-dot sobre la tapa del cajón de mecanismos (?noreddot la quita)
  if (opts.redDot) try {
    vm.root.updateMatrixWorld(true);
    const g = measureGun(vm);
    const len = g.zMax - g.zMin;
    const zc = g.zMin + len * 0.36;                      // montaje adelantado sobre el tubo de gases (lejos de la bodycam)
    let top = -Infinity, xs = 0, n = 0;
    for (let i = 0; i < g.pts.length; i += 3) {
      const z = g.pts[i + 2];
      if (Math.abs(z - zc) < 0.045 && Math.abs(g.pts[i]) < 0.05) { top = Math.max(top, g.pts[i + 1]); xs += g.pts[i]; n++; }
    }
    // línea de miras de hierro = punto más alto del arma en el tercio delantero (punto de mira)
    let sight = -Infinity;
    for (let i = 0; i < g.pts.length; i += 3) if (g.pts[i + 2] < g.zMin + len * 0.35) sight = Math.max(sight, g.pts[i + 1]);
    const rd = makeRedDot();
    const cx = n ? xs / n : 0;
    const cy = top + 0.019 + rd.radius;
    rd.group.position.set(cx, cy, zc);
    vm.gunOff.add(rd.group);
    out.redDot = rd;
    out.sightRise = cy - sight;                          // cuánto hay que bajar el arma al apuntar para mirar por el tubo
    out.mount = { cx, cy, zc, top, sight, len };
  } catch (e) {
    console.warn("[gunfx] sin red-dot:", e.message);
  }
  return out;
}

// por frame: eje del arma en espacio de vista para el punto colimado
const _a = new Vector3(), _b = new Vector3();
export function updateGunFx(fx, vm, camera) {
  if (!fx?.redDot) return;
  vm.gunOff.getWorldPosition(_a);
  _b.set(0, 0, -1).transformDirection(vm.gunOff.matrixWorld);
  _b.transformDirection(camera.matrixWorldInverse);
  fx.redDot.lensMat.uniforms.axis.value.copy(_b);
}
