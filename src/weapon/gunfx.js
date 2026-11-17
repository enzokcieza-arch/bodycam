// weapon/gunfx.js — Fase 4 (v3.0): materiales creíbles para arma/guantes, mira red-dot colimada y linterna con cookie.
// Todo procedural (sin assets nuevos). Se aplica sobre el viewmodel ya cargado (weapon/viewmodel.js).
import {
  Vector3, Vector4, Vector2, Group, Mesh, LatheGeometry, CylinderGeometry, BoxGeometry, CircleGeometry, MeshStandardMaterial, ShaderMaterial,
  CanvasTexture, AdditiveBlending, DoubleSide, SRGBColorSpace, LinearFilter,
} from "../three.js";

// ── desgaste procedural en espacio de objeto (posición de bind → estable aunque el arma se anime)
const WEAR_VERT_PARS = /* glsl */ `varying vec3 vObjPos; varying vec3 vObjN;\n`;
// luz de rebote sobre el arma y los brazos: la linterna ilumina lo que tiene delante y eso devuelve algo de luz
// (sin esto, de noche el arma era una silueta negra). Lo actualiza updateGunFx cada frame.
export const VM_BOUNCE = { value: 0 };
const WEAR_FRAG_PARS = /* glsl */ `
  varying vec3 vObjPos; varying vec3 vObjN;
  uniform sampler2D detailMap; uniform vec3 detailP;   // x = metros por repetición (unid. objeto), y = fuerza, z = relieve
  vec3 detailTri(vec3 p, vec3 n){
    vec3 w = pow(abs(n), vec3(4.0)); w /= (w.x + w.y + w.z);
    return texture2D(detailMap, p.zy).rgb * w.x + texture2D(detailMap, p.xz).rgb * w.y + texture2D(detailMap, p.xy).rgb * w.z;
  }
  uniform float wearScale; uniform vec4 wearAmt; uniform float vmBounce;   // x = arañazos, y = grasa/manchas, z = borde gastado, w = tejido
  float wh(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float wn(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(wh(i), wh(i + vec3(1,0,0)), f.x), mix(wh(i + vec3(0,1,0)), wh(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(wh(i + vec3(0,0,1)), wh(i + vec3(1,0,1)), f.x), mix(wh(i + vec3(0,1,1)), wh(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float wfbm(vec3 p){ return 0.5 * wn(p) + 0.25 * wn(p * 2.03) + 0.125 * wn(p * 4.01) + 0.0625 * wn(p * 8.1); }
`;

function addWear(mat, { scale = 60, scratches = 0, grease = 0, edge = 0, weave = 0, detail = null } = {}) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.wearScale = { value: scale };
    sh.uniforms.vmBounce = VM_BOUNCE;
    sh.uniforms.detailMap = { value: detail?.map || null };
    sh.uniforms.detailP = { value: new Vector3(detail?.tile || 1, detail ? detail.k : 0, detail?.bump || 0) };
    sh.uniforms.wearAmt = { value: new Vector4(scratches, grease, edge, weave) };
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\n" + WEAR_VERT_PARS)
      .replace("#include <begin_vertex>", "#include <begin_vertex>\n  vObjPos = position; vObjN = normal;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\n" + WEAR_FRAG_PARS)
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n  totalEmissiveRadiance += diffuseColor.rgb * vmBounce * (0.55 + 0.45 * max(0.0, -normalize(vNormal).z));")
      .replace("#include <normal_fragment_maps>", /* glsl */ `#include <normal_fragment_maps>
        // micro-relieve de la textura real (luminancia como altura), por derivadas de pantalla
        if (detailP.y > 0.0 && detailP.z > 0.0) {
          vec3 dt = detailTri(vObjPos / detailP.x, normalize(vObjN));
          float hh = dot(dt, vec3(0.33));
          vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 grad = sign(det) * (dFdx(hh) * r1 + dFdy(hh) * r2);
          normal = normalize(abs(det) * normal - grad * detailP.z);
        }
        // pliegues de tela / costuras (solo materiales con trama): bump procedural por derivadas de pantalla
        if (wearAmt.w > 0.0) {
          vec3 fp = vObjPos * wearScale * 0.035;
          float hh = wfbm(vec3(fp.x * 0.6, fp.y * 0.6, fp.z * 2.4));
          hh += smoothstep(0.94, 1.0, abs(sin(fp.z * 1.1))) * 0.25;                // costuras transversales
          vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
          float dhx = dFdx(hh), dhy = dFdy(hh);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
          normal = normalize(abs(det) * normal - grad * 0.22 * wearAmt.w);
        }`)
      .replace("#include <roughnessmap_fragment>", /* glsl */ `#include <roughnessmap_fragment>
        {
          vec3 wp = vObjPos * wearScale;
          // detalle fotográfico (textura PBR real de Poly Haven) proyectado sin UVs
          if (detailP.y > 0.0) {
            vec3 dt = detailTri(vObjPos / detailP.x, normalize(vObjN));
            float dl = dot(dt, vec3(0.2126, 0.7152, 0.0722));
            diffuseColor.rgb *= mix(vec3(1.0), dt / max(0.32, 0.001) * 0.9, detailP.y);
            roughnessFactor = clamp(roughnessFactor + (0.4 - dl) * 0.5 * detailP.y, 0.06, 1.0);
          }
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
            float wv = wfbm(wp * 0.035) - 0.5;
            diffuseColor.rgb *= 1.0 + wv * 0.22 * wearAmt.w;
            float fres = pow(1.0 - saturate(dot(normalize(vViewPosition), normalize(vNormal))), 3.0);
            diffuseColor.rgb += fres * 0.06 * wearAmt.w;
          }
        }`);
  };
  mat.customProgramCacheKey = () => `wear4|${detail ? 1 : 0}|${scratches}|${grease}|${edge}|${weave}|${scale}`;
  mat.needsUpdate = true;
}

// ── cookie de linterna: núcleo caliente, corona, anillos del reflector y derrame tenue hasta el borde
function makeTorchCookie() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 256);
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 126);
  // v3.0b: punto central ~1/4 del cono + derrame amplio y visible (antes casi negro: la sala quedaba a oscuras
  // salvo un círculo en la pared). Proporciones típicas de una linterna táctica: hotspot 8–10°, derrame 55–60°.
  gr.addColorStop(0.0, "rgb(255,255,255)");
  gr.addColorStop(0.10, "rgb(255,252,246)");
  gr.addColorStop(0.20, "rgb(200,196,188)");
  gr.addColorStop(0.30, "rgb(120,118,112)");
  gr.addColorStop(0.36, "rgb(88,86,82)");       // borde del hotspot (suave)
  gr.addColorStop(0.44, "rgb(62,61,58)");
  gr.addColorStop(0.75, "rgb(46,45,44)");       // meseta del derrame
  gr.addColorStop(0.93, "rgb(30,30,29)");
  gr.addColorStop(1.0, "rgb(0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  // imperfección: sombra tenue del LED (los anillos dibujados se marcaban demasiado en las paredes)
  g.globalCompositeOperation = "multiply";
  g.fillStyle = "rgba(215,215,215,1)"; g.fillRect(124, 122, 8, 12);
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
  body.side = DoubleSide;   // el perfil torneado se ve por dentro y por fuera
  // v3.0b: silueta tipo micro red-dot real (antes: tubo sin grosor + 4 salientes simétricos = una "cruz" en
  // el centro de la pantalla). Tubo torneado con pared y parasol, torreta superior adelantada, torreta+batería a la
  // derecha más baja, montaje bajo y ancho. Nada a la izquierda.
  const R = 0.0175, L = 0.062;
  const prof = [
    [R - 0.0028, L / 2], [R + 0.0012, L / 2], [R + 0.0012, L / 2 - 0.006], [R, L / 2 - 0.008],            // aro trasero
    [R, -L / 2 + 0.014], [R + 0.0006, -L / 2 + 0.01], [R + 0.0016, -L / 2], [R - 0.0004, -L / 2],         // parasol delantero
    [R - 0.0028, -L / 2 + 0.004], [R - 0.0028, L / 2],
  ].map(([r, z]) => new Vector2(r, z));
  const tube = new Mesh(new LatheGeometry(prof, 40), body);
  tube.rotation.x = Math.PI / 2;
  const turret = (r, h, x, y, z, rotZ) => {
    const g = new Group();
    const c = new Mesh(new CylinderGeometry(r, r * 1.08, h, 20), body);
    const cap = new Mesh(new CylinderGeometry(r * 0.82, r, h * 0.35, 20), body);
    cap.position.y = h * 0.65;
    g.add(c, cap);
    g.position.set(x, y, z); g.rotation.z = rotZ;
    return g;
  };
  const top = turret(0.0062, 0.007, 0, R + 0.0035, -0.006, 0);
  const side = turret(0.0068, 0.009, R + 0.0042, -0.003, -0.004, -Math.PI / 2);
  const mount = new Mesh(new BoxGeometry(0.03, 0.011, 0.038), body); mount.position.set(0, -R - 0.0045, 0.002);
  const base = new Mesh(new BoxGeometry(0.024, 0.006, 0.052), body); base.position.set(0, -R - 0.012, 0.002);
  grp.add(tube, top, side, mount, base);

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
  // textura de detalle desde el manifest (ya en los assets; CC0)
  const det = (name, tile, k, bump) => {
    const t = vm.assets?.manifest?.textures?.[name];
    if (!t) return null;
    const map = vm.assets.texture(t.diff, true);
    map.wrapS = map.wrapT = 1000;   // RepeatWrapping
    map.needsUpdate = true;
    return { map, tile, k, bump };
  };
  // 1) materiales
  vm.model.traverse((m) => {
    if (!m.isMesh || !m.material) return;
    const mat = m.material;
    switch (mat.name) {
      case "ak_receiver": mat.color.setHex(0x26282b); mat.roughness = 0.44; mat.metalness = 0.82; addWear(mat, { scale: 70, scratches: 1, grease: 1, edge: 0.75, detail: det("metal_galv", 1.2, 0.55, 0.012) }); break;
      case "ak_steel": mat.color.setHex(0x1c1d1f); mat.roughness = 0.36; mat.metalness = 0.9; addWear(mat, { scale: 70, scratches: 1.2, grease: 0.8, edge: 1, detail: det("metal_galv", 1.0, 0.45, 0.01) }); break;
      case "ak_wood": mat.color.setHex(0x5a3520); mat.roughness = 0.5; addWear(mat, { scale: 38, scratches: 0.5, grease: 1.2, edge: 0.25, detail: det("wood_weathered", 1.8, 0.85, 0.018) }); break;
      case "sleeve": mat.color.setHex(0x30343a); mat.roughness = 0.95; addWear(mat, { scale: 85, weave: 1, grease: 0.6 }); break;
      case "glove": mat.color.setHex(0x17181a); mat.roughness = 0.62; addWear(mat, { scale: 95, weave: 0.55, grease: 1.1, edge: 0.3 }); break;
    }
  });

  // 2) linterna: cookie + cono algo más abierto (núcleo + derrame en una sola luz)
  if (vm.torch) {
    vm.torch.map = makeTorchCookie();
    vm.torch.angle = 0.85;
    vm.torch.penumbra = 0.15;
    vm.torch.color.setHex(0xfff2dc);
    if (engine.quality.torchShadow) {
      vm.torch.castShadow = true;
      vm.torch.shadow.autoUpdate = true;     // la linterna se mueve con el arma: cada frame (la luna no)
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
  VM_BOUNCE.value += ((vm.torch && vm.torch.intensity > 0.5 ? 0.05 : 0.004) - VM_BOUNCE.value) * 0.2;
  if (!fx?.redDot) return;
  vm.gunOff.getWorldPosition(_a);
  _b.set(0, 0, -1).transformDirection(vm.gunOff.matrixWorld);
  _b.transformDirection(camera.matrixWorldInverse);
  fx.redDot.lensMat.uniforms.axis.value.copy(_b);
}
