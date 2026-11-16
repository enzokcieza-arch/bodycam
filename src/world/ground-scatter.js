// world/ground-scatter.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { B as Z, E as Ut, I as tt, Q, R as yo, V as P, Y as vt, Z as Ae, a as Rt, a3 as $t, a5 as fe, a9 as Oi, ae as Se, ah as br, ai as U0, aj as vr, ak as co, al as Va, am as fo, an as Mr, ao as $0, ap as _r, d as Tt, i as xo, k as zi, m as po, o as B, p as Ke, q as Lo, v as Te, z as Ga } from "three-vendor";
import { ms } from "../level/builder.js";

const tc = {
    ground_debris: {
      scale: 0.1,
      puddles: 0,
      macro: 0.5,
      cavity: 0.4,
      world: !0,
      stains: 0.35,
    },
    ground_rubble: {
      scale: 0.13,
      puddles: 0,
      macro: 0.45,
      cavity: 0.45,
      world: !0,
    },
    ground_mud: {
      scale: 0.07,
      puddles: 0.25,
      macro: 0.55,
      cavity: 0.35,
      world: !0,
    },
    concrete_floor: {
      scale: 0.025,
      puddles: 0.3,
      macro: 0.5,
      cavity: 0.3,
      world: !0,
      stains: 0.6,
    },
    ground_burnt: {
      scale: 0.09,
      puddles: 0.28,
      macro: 0.45,
      cavity: 0.4,
      world: !0,
    },
    ground_leaves: {
      scale: 0.06,
      puddles: 0,
      macro: 0.45,
      cavity: 0.45,
      world: !0,
    },
    ground_forest: {
      scale: 0.06,
      puddles: 0.2,
      macro: 0.45,
      cavity: 0.4,
      world: !0,
    },
    ground_asphalt: {
      scale: 0.02,
      puddles: 0.45,
      macro: 0.55,
      cavity: 0.3,
      world: !0,
      stains: 0.8,
    },
    ground_gravel_leaves: {
      scale: 0.07,
      puddles: 0,
      macro: 0.45,
      cavity: 0.45,
      world: !0,
    },
    brick_broken: {
      scale: 0.035,
      puddles: 0,
      macro: 0.3,
      cavity: 0.35,
      shadow: !1,
      antiTile: !1,
    },
    brick_wall: {
      scale: 0.025,
      puddles: 0,
      macro: 0.3,
      cavity: 0.3,
      shadow: !1,
      antiTile: !1,
    },
    plaster_damaged: {
      scale: 0.015,
      puddles: 0,
      macro: 0.35,
      cavity: 0.25,
      shadow: !1,
    },
  },
  $n = {
    low: { maxSteps: 6, minSteps: 3, fadeEnd: 10, shadow: !1 },
    medium: { maxSteps: 14, minSteps: 6, fadeEnd: 20, shadow: !0 },
    high: { maxSteps: 20, minSteps: 8, fadeEnd: 32, shadow: !0 },
  },
  ec = `
uniform sampler2D pomHeight;
uniform vec4 pomP0;   // x profundidad (m), y pasos máx, z pasos mín, w fin del fundido (m)
uniform vec4 pomP1;   // x anti-repetición (0/1), y charcos, z variación macro, w cavidad
uniform vec4 pomP2;   // x escala del ruido de anti-repetición (1/m), y auto-sombra (0/1), z sesgo de altura, w escala UV de altura
uniform float pomTile; // m por repetición (modo UV de mundo)
uniform vec4 pomP3;   // x manchas de aceite/humedad (0–1)
varying vec3 vPomWorld;
vec2 pomBaseUv; float pomStain;
varying vec3 vPomWN;
vec2 pomUv; vec2 pomOffA; vec2 pomOffB; float pomF; vec2 pomDx; vec2 pomDy;
float pomH; float pomWet; float pomWater;
vec3 pomT3; vec3 pomB3; vec3 pomN; float pomOk;

float pomHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float pomNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(pomHash(i), pomHash(i + vec2(1.0, 0.0)), f.x), mix(pomHash(i + vec2(0.0, 1.0)), pomHash(i + vec2(1.0)), f.x), f.y);
}
// peso de la copia B: transición por ruido + altura (la copia más alta gana)
float pomW(float ha, float hb) { return clamp((pomF - 0.5) * 4.0 + (hb - ha) * 9.0 + 0.5, 0.0, 1.0); }
float pomHeightAt(vec2 uv) {
  float a = textureGrad(pomHeight, (uv + pomOffA) * pomP2.w, pomDx * pomP2.w, pomDy * pomP2.w).r;
  if (pomP1.x < 0.5) return a;
  float b = textureGrad(pomHeight, (uv + pomOffB) * pomP2.w, pomDx * pomP2.w, pomDy * pomP2.w).r;
  return mix(a, b, pomW(a, b));
}
float pomMixW;
vec4 pomTex(sampler2D t) {
  vec4 a = textureGrad(t, pomUv + pomOffA, pomDx, pomDy);
  if (pomP1.x < 0.5) return a;
  vec4 b = textureGrad(t, pomUv + pomOffB, pomDx, pomDy);
  return mix(a, b, pomMixW);
}
// auto-sombra del relieve hacia la dirección de luz L (espacio de vista)
float pomSelfShadow(vec3 L) {
  if (pomOk < 0.5 || pomP2.y < 0.5) return 1.0;
  float ln = dot(L, pomN);
  if (ln <= 0.02) return 1.0;
  vec2 duv = vec2(dot(pomT3, L), dot(pomB3, L)) / max(ln, 0.25) * pomP0.x; // UV por "1 unidad" de altura
  float h0 = max(pomH, pomWater), occ = 0.0;
  for (int i = 1; i <= 4; i++) {
    float t = float(i) * 0.09;
    float h = pomHeightAt(pomUv + duv * t);
    occ = max(occ, (h - (h0 + t)) * 5.0);
  }
  return 1.0 - clamp(occ, 0.0, 0.85);
}
`,
  sc = `
{
  vec2 baseUv = vMapUv;
  #ifdef POM_WORLDUV
  {
    vec3 an = abs(vPomWN);
    vec2 w2 = an.y >= max(an.x, an.z) ? vec2(vPomWorld.x, -vPomWorld.z)
      : (an.x >= an.z ? vec2(-vPomWorld.z * sign(vPomWN.x), vPomWorld.y) : vec2(vPomWorld.x * sign(vPomWN.z), vPomWorld.y));
    baseUv = w2 / pomTile;
  }
  #endif
  pomBaseUv = baseUv;
  pomUv = baseUv; pomDx = dFdx(baseUv); pomDy = dFdy(baseUv);
  vec3 pN = normalize(vNormal);
  #ifdef DOUBLE_SIDED
    pN *= (gl_FrontFacing ? 1.0 : -1.0);
  #endif
  pomN = pN;
  // coordenadas de mundo 2D estables (suelo: xz; pared: horizontal+altura)
  vec2 wp = abs(vPomWN.y) > 0.6 ? vPomWorld.xz : vec2(vPomWorld.x + vPomWorld.z, vPomWorld.y);
  // anti-repetición: índice de variante por ruido de mundo
  float k = pomNoise(wp * pomP2.x) * 8.0;
  float ki = floor(k); pomF = k - ki;
  pomOffA = sin(vec2(3.0, 7.0) * ki);
  pomOffB = sin(vec2(3.0, 7.0) * (ki + 1.0));
  // sin anti-repetición: desplazamiento fijo (si no, el salto de variante dibujaba costuras curvas en los muros)
  if (pomP1.x < 0.5) { pomOffA = vec2(0.0); pomOffB = vec2(0.0); }
  // charcos: máscara de mundo de baja frecuencia → nivel de agua en unidades de altura
  float pm = pomP1.y > 0.0 ? smoothstep(0.58, 0.8, pomNoise(wp * 0.11 + 17.0) * 0.75 + pomNoise(wp * 0.37) * 0.25) : 0.0;
  pomWater = pm * pomP1.y * 0.75;
  // marco de gradientes UV (espacio de vista) a partir de derivadas de pantalla
  vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition);
  vec2 st0 = pomDx, st1 = pomDy;
  vec3 q1p = cross(q1, pN), q0p = cross(pN, q0);
  float D = dot(pN, cross(q0, q1));
  pomOk = abs(D) > 1e-14 ? 1.0 : 0.0;
  vec3 T = (q1p * st0.x + q0p * st1.x) / (pomOk > 0.5 ? D : 1.0);
  vec3 B = (q1p * st0.y + q0p * st1.y) / (pomOk > 0.5 ? D : 1.0);
  pomT3 = T; pomB3 = B;
  vec3 V = normalize(vViewPosition);
  float vn = dot(V, pN);
  float dist = length(vViewPosition);
  float depth = pomP0.x * (1.0 - smoothstep(pomP0.w * 0.6, pomP0.w, dist));
  pomH = 1.0;
  if (pomOk > 0.5 && depth > 0.0005 && vn > 0.02) {
    // UV recorrida por "1 unidad" de altura (0..1 → 0..depth metros) al bajar por el rayo
    vec2 duv = -vec2(dot(T, V), dot(B, V)) / max(vn, 0.2) * depth;
    // nº de pasos continuo (sin floor): con pasos enteros aparecían costuras curvas donde cambia el ángulo de visión
    float n = mix(pomP0.y, pomP0.z, vn);
    float stepD = 1.0 / n;
    float ld = 0.0;
    vec2 uv = baseUv;
    float hPrev = max(pomHeightAt(uv), pomWater) + pomP2.z, ldPrev = 0.0;
    float h = hPrev;
    for (int i = 0; i < 24; i++) {
      if (float(i) >= n + 1.0 || ld >= 1.0 - h) break;
      hPrev = h; ldPrev = ld;
      ld += stepD;
      uv = baseUv + duv * ld;
      h = max(pomHeightAt(uv), pomWater) + pomP2.z;
    }
    // refinamiento lineal entre la última capa por encima y la primera por debajo
    float a = (1.0 - hPrev) - ldPrev, b = ld - (1.0 - h);
    float t = clamp(a / max(a + b, 1e-5), 0.0, 1.0);
    float ldHit = mix(ldPrev, ld, t);
    pomUv = baseUv + duv * ldHit;
  }
  float ha = textureGrad(pomHeight, (pomUv + pomOffA) * pomP2.w, pomDx * pomP2.w, pomDy * pomP2.w).r;
  float hb = pomP1.x > 0.5 ? textureGrad(pomHeight, (pomUv + pomOffB) * pomP2.w, pomDx * pomP2.w, pomDy * pomP2.w).r : ha;
  pomMixW = pomP1.x > 0.5 ? pomW(ha, hb) : 0.0;
  pomH = mix(ha, hb, pomMixW);
  pomWet = pomWater > 0.0 ? smoothstep(pomWater + 0.16, pomWater - 0.02, pomH) : 0.0;
}
`;
function Js(a, t) {
  let e = Oi[a];
  for (const [o, s] of t)
    (e.includes(o) || console.warn("[GroundMaterial] chunk cambiado:", a, o),
      (e = e.split(o).join(s)));
  return e;
}
function oc(a, t = {}) {
  if (!a || a.userData.pom) return a;
  const e = $n[t.quality] || $n.medium,
    o = {
      pomHeight: { value: t.heightMap || null },
      pomP0: {
        value: new Lo(
          t.heightMap ? (t.scale ?? 0.04) : 0,
          t.maxSteps ?? e.maxSteps,
          t.minSteps ?? e.minSteps,
          t.fadeEnd ?? e.fadeEnd,
        ),
      },
      pomP1: {
        value: new Lo(
          t.antiTile === !1 ? 0 : 1,
          t.puddles ?? 0,
          t.macro ?? 0.5,
          t.cavity ?? 0.4,
        ),
      },
      pomP2: {
        value: new Lo(
          t.noiseScale ?? 0.22,
          (t.shadow ?? e.shadow) ? 1 : 0,
          t.bias ?? 0,
          1,
        ),
      },
      pomTile: { value: t.tile || 3 },
      pomP3: { value: new Lo(t.stains ?? 0, 0, 0, 0) },
    },
    s = !!(t.world && t.tile);
  a.userData.pom = o;
  const i = a.onBeforeCompile,
    n = a.customProgramCacheKey,
    r = !!t.heightMap;
  return (
    (a.onBeforeCompile = function (l, u) {
      (i && i.call(this, l, u),
        Object.assign(l.uniforms, o),
        s &&
          (l.fragmentShader =
            `#define POM_WORLDUV
` + l.fragmentShader),
        (l.vertexShader = l.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vPomWorld;
varying vec3 vPomWN;`,
          )
          .replace(
            "#include <project_vertex>",
            `#include <project_vertex>
vPomWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
vPomWN = normalize(mat3(modelMatrix) * objectNormal);`,
          )));
      const h = Js("map_fragment", [
          ["texture2D( map, vMapUv )", "pomTex( map )"],
        ]),
        c = Js("roughnessmap_fragment", [
          [
            "texture2D( roughnessMap, vRoughnessMapUv )",
            "pomTex( roughnessMap )",
          ],
        ]),
        d = Js("metalnessmap_fragment", [
          [
            "texture2D( metalnessMap, vMetalnessMapUv )",
            "pomTex( metalnessMap )",
          ],
        ]),
        p = Js("normal_fragment_maps", [
          ["texture2D( normalMap, vNormalMapUv )", "pomTex( normalMap )"],
        ]),
        f = "getDirectionalLightInfo( directionalLight, directLight );",
        g = Js("normal_fragment_begin", [
          [
            `#if defined( USE_NORMALMAP )
			vNormalMapUv`,
            `#if defined( USE_NORMALMAP )
			pomBaseUv`,
          ],
        ]),
        m = Js("lights_fragment_begin", [
          [
            f,
            f +
              `
		directLight.color *= pomSelfShadow( directLight.direction );`,
          ],
        ]);
      l.fragmentShader = l.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
` + ec,
        )
        .replace(
          "#include <clipping_planes_fragment>",
          `#include <clipping_planes_fragment>
` + sc,
        )
        .replace(
          "#include <map_fragment>",
          h +
            `
        {
          // variación macro (manchas de suciedad/humedad cada pocos metros) + cavidades más oscuras
          vec2 wpm = vPomWorld.xz + vPomWorld.y * 0.7;
          float m1 = pomNoise(wpm * 0.09), m2 = pomNoise(wpm * 0.31 + 5.0);
          float mac = (m1 * 0.65 + m2 * 0.35 - 0.5) * pomP1.z;
          diffuseColor.rgb *= 1.0 + mac * 0.55;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.92, 0.86, 0.76), clamp(mac * -1.6, 0.0, 1.0) * 0.6);
          diffuseColor.rgb *= mix(1.0 - pomP1.w, 1.0, smoothstep(0.0, 0.75, pomH));
          // manchas de aceite / humedad (oscuras y algo brillantes), sobre todo en zonas bajas
          pomStain = pomP3.x > 0.0 ? smoothstep(0.7, 0.82, pomNoise(wpm * 0.45 + 31.0) * 0.7 + pomNoise(wpm * 1.7) * 0.3) * pomP3.x * (1.15 - pomH * 0.5) : 0.0;
          diffuseColor.rgb *= mix(1.0, 0.5, clamp(pomStain, 0.0, 1.0));
          // charco: albedo húmedo oscuro
          diffuseColor.rgb *= mix(1.0, 0.42, pomWet);
        }`,
        )
        .replace(
          "#include <roughnessmap_fragment>",
          c +
            `
roughnessFactor = mix(mix(roughnessFactor, 0.32, clamp(pomStain, 0.0, 1.0)), 0.04, pomWet);`,
        )
        .replace("#include <metalnessmap_fragment>", d)
        .replace("#include <normal_fragment_begin>", g)
        .replace(
          "#include <normal_fragment_maps>",
          p +
            `
normal = normalize(mix(normal, nonPerturbedNormal, pomWet * 0.95));`,
        )
        .replace("#include <lights_fragment_begin>", m);
    }),
    (a.customProgramCacheKey = function () {
      return (
        (typeof n == "function" ? n.call(this) : "") +
        "|pom" +
        (r ? "H" : "") +
        (t.puddles ? "W" : "") +
        (s ? "U" : "")
      );
    }),
    (a.needsUpdate = !0),
    a
  );
}
function ac(a, t, e = "medium", o = tc, s = null) {
  const i = new Set();
  for (const n of a) {
    const r = Array.isArray(n.material) ? n.material : [n.material];
    for (const l of r) {
      if (!l || !l.isMeshStandardMaterial || !l.map || l.userData.pom) continue;
      const u = l.name,
        h = t.manifest.textures[u],
        c = o[u];
      if (!h || !h.disp || !c) continue;
      const d = t.texture(h.disp, !1),
        p = (n.name || "").replace(/^static:/, ""),
        f = ms[p] || ms[u] || 3;
      (oc(l, { heightMap: d, quality: e, tile: f, ...c, ...(s || {}) }),
        i.add(u));
    }
  }
  return [...i];
}
const ss = 8;
function bo(a) {
  let t = a >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let e = t;
    return (
      (e = Math.imul(e ^ (e >>> 15), e | 1)),
      (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
      ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
function uo(a, t) {
  const e = Math.sin(a * 127.1 + t * 311.7) * 43758.5453;
  return e - Math.floor(e);
}
function aa(a, t) {
  const e = Math.floor(a),
    o = Math.floor(t);
  let s = a - e,
    i = t - o;
  ((s = s * s * (3 - 2 * s)), (i = i * i * (3 - 2 * i)));
  const n = uo(e, o),
    r = uo(e + 1, o),
    l = uo(e, o + 1),
    u = uo(e + 1, o + 1);
  return n + (r - n) * s + (l - n) * i + (n - r - l + u) * s * i;
}
function Gn(a, t) {
  return (
    aa(a, t) * 0.6 +
    aa(a * 2.3 + 7.1, t * 2.3 - 3.7) * 0.3 +
    aa(a * 5.1 - 1.3, t * 5.1 + 9.2) * 0.1
  );
}
const Es = (a, t, e, o) =>
  uo(a * 13.13 + e * 7.77 + o, t * 17.17 - e * 3.31 + o * 0.5);
function ks(a, t, e, o = !0) {
  const s = a.attributes.position;
  for (let i = 0; i < s.count; i++) {
    const n = s.getX(i),
      r = s.getY(i),
      l = s.getZ(i),
      u =
        1 +
        (Es(Math.round(n * 1e3), Math.round(r * 1e3), Math.round(l * 1e3), e) -
          0.5) *
          2 *
          t;
    s.setXYZ(i, n * u, r * u, l * u);
  }
  return (a.index && o && (a = a.toNonIndexed()), a.computeVertexNormals(), a);
}
function o0(a, t, e, o = 0.18) {
  const s = bo(e),
    i = a.attributes.position,
    n = new P();
  for (let r = 0; r < t; r++) {
    n.set(s() - 0.5, (s() - 0.5) * 0.8, s() - 0.5).normalize();
    let l = -1 / 0;
    for (let h = 0; h < i.count; h++)
      l = Math.max(l, i.getX(h) * n.x + i.getY(h) * n.y + i.getZ(h) * n.z);
    const u = l * (1 - o - s() * o);
    for (let h = 0; h < i.count; h++) {
      const c = i.getX(h) * n.x + i.getY(h) * n.y + i.getZ(h) * n.z - u;
      c > 0 &&
        i.setXYZ(
          h,
          i.getX(h) - n.x * c,
          i.getY(h) - n.y * c,
          i.getZ(h) - n.z * c,
        );
    }
  }
  return a;
}
function ge(a) {
  a.computeBoundingBox();
  const t = a.boundingBox;
  return (
    a.translate(-(t.min.x + t.max.x) / 2, -t.min.y, -(t.min.z + t.max.z) / 2),
    a
  );
}
function ae(a, t, e = 0, o = 0) {
  const s = a.attributes.position,
    i = a.attributes.normal,
    n = new Float32Array(s.count * 2);
  for (let r = 0; r < s.count; r++) {
    const l = Math.abs(i.getX(r)),
      u = Math.abs(i.getY(r)),
      h = Math.abs(i.getZ(r));
    let c, d;
    (u >= l && u >= h
      ? ((c = s.getX(r)), (d = s.getZ(r)))
      : l >= h
        ? ((c = s.getZ(r)), (d = s.getY(r)))
        : ((c = s.getX(r)), (d = s.getY(r))),
      (n[r * 2] = c * t + e),
      (n[r * 2 + 1] = d * t + o));
  }
  return (a.setAttribute("uv", new Se(n, 2)), a);
}
function Wt(a, t) {
  const e = a.attributes.position,
    o = new Float32Array(e.count * 3);
  a.computeBoundingBox();
  const s = Math.max(1e-4, a.boundingBox.max.y - a.boundingBox.min.y);
  for (let i = 0; i < e.count; i++) {
    const n = t(
      e.getX(i),
      e.getY(i),
      e.getZ(i),
      (e.getY(i) - a.boundingBox.min.y) / s,
    );
    ((o[i * 3] = n[0]), (o[i * 3 + 1] = n[1]), (o[i * 3 + 2] = n[2]));
  }
  return (a.setAttribute("color", new Se(o, 3)), a);
}
const Ts =
  (a = 0.45) =>
  (t, e, o, s) => {
    const i = a + (1 - a) * Math.min(1, s * 2.2);
    return [i, i, i];
  };
function Nn(a) {
  const t = new Ut();
  for (const e of Object.keys(a[0].attributes)) {
    const o = a[0].attributes[e].itemSize;
    let s = 0;
    for (const r of a) s += r.attributes[e].count;
    const i = new Float32Array(s * o);
    let n = 0;
    for (const r of a) {
      const l = r.attributes[e].array;
      (i.set(l, n), (n += l.length));
    }
    t.setAttribute(e, new Se(i, o));
  }
  return t;
}
const As = (a) => (a.index ? a.toNonIndexed() : a),
  Yi = {
    gravel() {
      const a = new _r(0.5, 0);
      return (
        a.scale(1, 0.6, 0.8),
        o0(a, 3, 3, 0.15),
        Wt(ae(ge(ks(a, 0.25, 3)), 0.05), Ts(0.5))
      );
    },
    stone() {
      const a = new $0(0.5, 0);
      return (
        a.scale(1, 0.55, 0.85),
        o0(a, 6, 11, 0.24),
        Wt(ae(ge(ks(a, 0.12, 11)), 0.08), Ts(0.45))
      );
    },
    clump() {
      const a = new $0(0.5, 0);
      return (
        a.scale(1, 0.45, 0.9),
        Wt(ae(ge(ks(a, 0.32, 23)), 0.12), Ts(0.55))
      );
    },
    chunk(a = !1) {
      let t = new $0(0.6, 0);
      if (
        (t.scale(1, 0.5, 0.75),
        o0(t, 8, a ? 19 : 7, 0.26),
        (t = ks(t, 0.06, 7)),
        ae(t, 0.16),
        Wt(t, Ts(0.4)),
        !a)
      )
        return ge(t);
      const e = [];
      for (const [o, s, i, n] of [
        [0.2, 0.1, 0.5, 0.7],
        [-0.15, -0.12, 2.6, 0.45],
      ]) {
        const r = As(new vt(0.016, 0.016, n, 4, 2)),
          l = r.attributes.position;
        for (let u = 0; u < l.count; u++) {
          const h = l.getY(u) + n / 2;
          l.setX(u, l.getX(u) + h * h * 0.35);
        }
        (r.computeVertexNormals(),
          r.translate(0, n / 2, 0),
          r.rotateZ(-1.25),
          r.rotateY(i),
          r.translate(o, 0.18, s),
          ae(r, 0.02, 0.5, 0.5),
          Wt(r, () => [0.3, 0.15, 0.08]),
          e.push(r));
      }
      return ge(Nn([t, ...e]));
    },
    chunkRebar() {
      return Yi.chunk(!0);
    },
    slab() {
      let a = new Z(1, 0.12, 0.7, 3, 1, 2);
      return (
        o0(a, 4, 31, 0.15),
        (a = ks(a, 0.06, 31)),
        ae(a, 0.16),
        Wt(ge(a), Ts(0.55))
      );
    },
    brick() {
      let a = new Z(1, 0.32, 0.48, 3, 1, 1);
      const t = a.attributes.position;
      for (let e = 0; e < t.count; e++)
        t.getX(e) > 0.45 &&
          t.setX(
            e,
            t.getX(e) - Es(t.getY(e) * 10, t.getZ(e) * 10, 3, 5) * 0.35,
          );
      return ((a = ks(a, 0.05, 17)), ae(a, 0.11), Wt(ge(a), Ts(0.55)));
    },
    glass() {
      const a = bo(5),
        t = [],
        e = 4;
      for (let n = 0; n < e; n++) {
        const r = (n / e) * Math.PI * 2 + a() * 0.9,
          l = 0.3 + a() * 0.5;
        t.push([Math.cos(r) * l, Math.sin(r) * l]);
      }
      const o = [];
      for (let n = 1; n < e - 1; n++)
        for (const r of [0, n, n + 1]) o.push(t[r][0], 0.01, t[r][1]);
      for (let n = 1; n < e - 1; n++)
        for (const r of [0, n + 1, n]) o.push(t[r][0], 0, t[r][1]);
      const s = new Ut();
      return (
        s.setAttribute("position", new tt(o, 3)),
        s.computeVertexNormals(),
        s.attributes.normal.getY(0) < 0 &&
          (s.scale(1, -1, 1),
          s.translate(0, 0.01, 0),
          s.computeVertexNormals()),
        ae(s, 1),
        Wt(s, () => [1, 1, 1])
      );
    },
    leaf() {
      const a = new Ke(1, 1, 2, 2);
      a.rotateX(-Math.PI / 2);
      const t = a.attributes.position;
      for (let e = 0; e < t.count; e++) {
        const o = t.getX(e),
          s = t.getZ(e);
        t.setY(e, (o * o * 0.5 + s * s * 0.15) * 0.35 + Math.abs(o * s) * 0.05);
      }
      return (a.computeVertexNormals(), Wt(As(a), () => [1, 1, 1]));
    },
    paper() {
      const a = new Ke(1, 0.75, 4, 3);
      a.rotateX(-Math.PI / 2);
      const t = a.attributes.position;
      for (let o = 0; o < t.count; o++) {
        const s = t.getX(o),
          i = t.getZ(o);
        t.setY(
          o,
          0.008 + Es(s * 9, i * 9, 1, 9) * 0.05 + Math.max(0, s - 0.2) * 0.12,
        );
      }
      const e = As(a);
      return (e.computeVertexNormals(), Wt(e, () => [1, 1, 1]));
    },
    twig() {
      const a = [],
        t = (o, s, i, n, r, l) => {
          const u = As(new vt(i, s, o, 3, 3, !0)),
            h = u.attributes.position;
          for (let c = 0; c < h.count; c++) {
            const d = h.getY(c) / o + 0.5;
            h.setX(c, h.getX(c) + Math.sin(d * 3.1) * 0.03);
          }
          (u.rotateZ(Math.PI / 2 + r),
            u.translate(l + o / 2, 0, 0),
            u.rotateY(n),
            u.computeVertexNormals(),
            a.push(u));
        };
      (t(1, 0.02, 0.012, 0, 0, -0.5), t(0.35, 0.011, 0.005, 0.5, 0.15, 0.05));
      const e = Nn(a.map((o) => (o.deleteAttribute("uv"), o)));
      return (
        e.translate(0, 0.02, 0),
        Wt(e, (o, s, i, n) => {
          const r = 0.75 + Es(o * 30, 0, i * 30, 2) * 0.3;
          return [r, r, r];
        })
      );
    },
    can() {
      const a = new vt(0.33, 0.33, 1, 8, 2),
        t = a.attributes.position;
      for (let o = 0; o < t.count; o++) {
        const s = t.getY(o),
          i =
            1 - Math.abs(s) < 0.1
              ? 1
              : 0.55 + Es(t.getX(o) * 9, s, t.getZ(o) * 9, 4) * 0.4;
        t.setX(o, t.getX(o) * (Math.abs(s) < 0.3 ? i : 1));
      }
      let e = As(a);
      return (
        e.rotateZ(Math.PI / 2),
        e.computeVertexNormals(),
        (e = ge(e)),
        ae(e, 1),
        Wt(e, (o, s, i) =>
          Math.abs(o) > 0.46 ? [0.75, 0.75, 0.75] : [1, 1, 1],
        )
      );
    },
    butt() {
      let a = As(new vt(0.2, 0.2, 1, 5, 2));
      return (
        a.rotateZ(Math.PI / 2),
        a.computeVertexNormals(),
        (a = ge(a)),
        ae(a, 1),
        Wt(a, (t) =>
          t < -0.1
            ? [0.85, 0.55, 0.28]
            : t > 0.45
              ? [0.18, 0.16, 0.14]
              : [0.92, 0.9, 0.86],
        )
      );
    },
    bottle() {
      const a = [
        [0, 0],
        [0.32, 0.02],
        [0.33, 0.6],
        [0.28, 0.72],
        [0.12, 0.85],
        [0.11, 1],
        [0, 1],
      ].map(([o, s]) => new Rt(o, s - 0.5));
      let t = As(new Mr(a, 7));
      t.rotateZ(Math.PI / 2);
      const e = t.attributes.position;
      for (let o = 0; o < e.count; o++)
        e.setY(
          o,
          e.getY(o) * (0.8 + Es(e.getX(o) * 5, 0, e.getZ(o) * 5, 6) * 0.25),
        );
      return (
        t.computeVertexNormals(),
        (t = ge(t)),
        ae(t, 1),
        Wt(t, (o) => (o > 0.42 ? [0.6, 0.6, 0.6] : [1, 1, 1]))
      );
    },
    plank() {
      let a = new Z(1, 0.025, 0.12, 4, 1, 1);
      const t = a.attributes.position;
      for (let e = 0; e < t.count; e++)
        t.getX(e) > 0.45 &&
          t.setX(
            e,
            t.getX(e) - Es(t.getZ(e) * 30, t.getY(e) * 30, 1, 3) * 0.12,
          );
      return ((a = ks(a, 0.02, 41)), ae(a, 0.5), Wt(ge(a), Ts(0.6)));
    },
    weed() {
      const a = [],
        t = [],
        e = bo(77);
      for (let i = 0; i < 9; i++) {
        const n = e() * Math.PI * 2,
          r = 0.25 + e() * 0.55,
          l = 0.55 + e() * 0.45,
          u = 0.025 + e() * 0.02,
          h = Math.cos(n),
          c = Math.sin(n),
          d = -c * u,
          p = h * u,
          f = [h * r * 0.45 * l, l * 0.55, c * r * 0.45 * l],
          g = [h * r * l, l, c * r * l],
          m = [d, 0, p],
          w = [-d, 0, -p],
          y = [f[0] + d * 0.7, f[1], f[2] + p * 0.7],
          x = [f[0] - d * 0.7, f[1], f[2] - p * 0.7],
          b = e() < 0.35;
        for (const [v, M] of [
          [m, 0],
          [w, 0],
          [x, 0.55],
          [m, 0],
          [x, 0.55],
          [y, 0.55],
          [y, 0.55],
          [x, 0.55],
          [g, 1],
        ]) {
          a.push(...v);
          const _ = 0.35 + 0.65 * M;
          t.push(
            ...(b
              ? [0.62 * _, 0.55 * _, 0.33 * _]
              : [0.32 * _, 0.4 * _, 0.16 * _]),
          );
        }
      }
      const o = new Ut();
      (o.setAttribute("position", new tt(a, 3)),
        o.setAttribute("color", new tt(t, 3)),
        o.computeVertexNormals());
      const s = o.attributes.normal;
      for (let i = 0; i < s.count; i++)
        s.setXYZ(i, s.getX(i) * 0.3, 1, s.getZ(i) * 0.3);
      return (o.normalizeNormals(), o);
    },
  };
function nc() {
  const e = document.createElement("canvas");
  ((e.width = 512), (e.height = 256));
  const o = e.getContext("2d"),
    s = [
      "#a8703f",
      "#c08850",
      "#c9a060",
      "#8a5a34",
      "#b0663a",
      "#b8a070",
      "#7a5a3a",
      "#a89a55",
    ],
    i = bo(1234);
  for (let r = 0; r < 8; r++) {
    const l = (r % 4) * 128 + 64,
      u = Math.floor(r / 4) * 128 + 64;
    (o.save(), o.translate(l, u), o.rotate(-Math.PI / 4 + (i() - 0.5) * 0.3));
    const h = 54,
      c = r % 3 === 0 ? 30 : r % 3 === 1 ? 20 : 36;
    if ((o.beginPath(), r % 4 === 3)) {
      o.moveTo(0, -h);
      for (let p = 0; p <= 10; p++) {
        const f = p / 10,
          g = -h + f * 2 * h * 0.9,
          m = Math.sin(f * Math.PI) * c * (p % 2 ? 1 : 0.6);
        o.lineTo(m, g);
      }
      for (let p = 10; p >= 0; p--) {
        const f = p / 10,
          g = -h + f * 2 * h * 0.9,
          m = Math.sin(f * Math.PI) * c * (p % 2 ? 1 : 0.6);
        o.lineTo(-m, g);
      }
    } else
      (o.moveTo(0, -h),
        o.bezierCurveTo(c * 1.3, -h * 0.4, c * 0.9, h * 0.5, 0, h * 0.85),
        o.bezierCurveTo(-c * 0.9, h * 0.5, -c * 1.3, -h * 0.4, 0, -h));
    o.closePath();
    const d = o.createLinearGradient(-c, -h, c, h);
    (d.addColorStop(0, s[r]),
      d.addColorStop(1, s[(r + 3) % 8]),
      (o.fillStyle = d),
      o.fill(),
      o.save(),
      o.clip());
    for (let p = 0; p < 10; p++)
      ((o.fillStyle = `rgba(${50 + i() * 40},${30 + i() * 25},15,${0.1 + i() * 0.25})`),
        o.beginPath(),
        o.arc((i() - 0.5) * c * 2, (i() - 0.5) * h * 2, 2 + i() * 9, 0, 7),
        o.fill());
    (o.restore(),
      (o.strokeStyle = "rgba(60,38,18,0.5)"),
      (o.lineWidth = 2),
      o.beginPath(),
      o.moveTo(0, -h * 0.95),
      o.lineTo(0, h * 1),
      o.stroke(),
      (o.lineWidth = 1));
    for (let p = 1; p < 6; p++) {
      const f = -h + p * h * 0.32;
      (o.beginPath(),
        o.moveTo(0, f),
        o.lineTo(c * 0.7, f - 12),
        o.moveTo(0, f),
        o.lineTo(-c * 0.7, f - 12),
        o.stroke());
    }
    ((o.lineWidth = 3),
      o.beginPath(),
      o.moveTo(0, h * 0.8),
      o.lineTo(0, h + 6),
      o.stroke(),
      o.restore());
  }
  const n = new fe(e);
  return ((n.colorSpace = Te), (n.anisotropy = 4), n);
}
function ic() {
  const t = document.createElement("canvas");
  ((t.width = 512), (t.height = 512));
  const e = t.getContext("2d"),
    o = 512 / 2,
    s = bo(99),
    i = (r, l) => {
      for (let u = 0; u < 40; u++)
        ((e.fillStyle = `rgba(70,55,35,${s() * 0.12})`),
          e.beginPath(),
          e.arc(r + s() * o, l + s() * o, 4 + s() * 30, 0, 7),
          e.fill());
    };
  ((e.fillStyle = "#d8d3c4"),
    e.fillRect(0, 0, o, o),
    (e.fillStyle = "#2b2b2b"),
    e.fillRect(12, 12, o - 24, 22));
  for (let r = 0; r < 3; r++)
    for (let l = 0; l < 26; l++)
      ((e.fillStyle = `rgba(40,40,40,${0.35 + s() * 0.3})`),
        e.fillRect(12 + r * 78, 46 + l * 7.5, 66 * (0.6 + s() * 0.4), 3));
  ((e.fillStyle = "#777"),
    e.fillRect(96, 120, 64, 50),
    i(0, 0),
    (e.fillStyle = "#e9e6de"),
    e.fillRect(o, 0, o, o));
  for (let r = 0; r < 20; r++)
    ((e.fillStyle = "rgba(60,70,110,0.35)"),
      e.fillRect(o + 20, 30 + r * 11, (o - 40) * (0.4 + s() * 0.6), 2));
  (i(o, 0), (e.fillStyle = "#9b7a52"), e.fillRect(0, o, o, o));
  for (let r = 0; r < 64; r++)
    ((e.fillStyle = `rgba(80,60,35,${0.15 + (r % 2) * 0.1})`),
      e.fillRect(0, o + r * 4, o, 2));
  ((e.fillStyle = "rgba(40,30,20,0.6)"),
    (e.font = "bold 34px sans-serif"),
    e.fillText("FRAGILE", 30, o + 140),
    i(0, o),
    (e.fillStyle = "#e3ddd0"),
    e.fillRect(o, o, o, o),
    (e.fillStyle = "#b8402e"),
    e.fillRect(o + 14, o + 14, o - 28, 80),
    (e.fillStyle = "#2f5f8f"),
    e.fillRect(o + 14, o + 110, 100, 100));
  for (let r = 0; r < 10; r++)
    ((e.fillStyle = "rgba(30,30,30,0.5)"),
      e.fillRect(o + 130, o + 112 + r * 10, 100 * (0.5 + s() * 0.5), 3));
  i(o, o);
  const n = new fe(t);
  return ((n.colorSpace = Te), (n.anisotropy = 4), n);
}
const na = {
    gravel: {
      geo: "gravel",
      range: 7.5,
      scale: [0.014, 0.05],
      embed: 0.25,
      tilt: 0.6,
      tex: "ground_rubble",
      aniso: [0.7, 1.3],
    },
    stone: {
      geo: "stone",
      range: 12,
      scale: [0.04, 0.13],
      embed: 0.35,
      tilt: 0.3,
      tex: "ground_rubble",
      aniso: [0.7, 1.35],
    },
    clump: {
      geo: "clump",
      range: 20,
      scale: [0.05, 0.16],
      embed: 0.35,
      tilt: 0.3,
      tex: "ground_mud",
      aniso: [0.8, 1.3],
    },
    chunk: {
      geo: "chunk",
      range: 32,
      scale: [0.05, 0.26],
      embed: 0.25,
      tilt: 0.35,
      tex: "concrete_wall",
      normal: !0,
      aniso: [0.55, 1.4],
    },
    chunkRebar: {
      geo: "chunkRebar",
      range: 40,
      scale: [0.2, 0.45],
      embed: 0.2,
      tilt: 0.3,
      tex: "concrete_wall",
      normal: !0,
      aniso: [0.8, 1.2],
      stat: !0,
    },
    slab: {
      geo: "slab",
      range: 40,
      scale: [0.18, 0.6],
      embed: 0.3,
      tilt: 0.18,
      tex: "concrete_wall",
      normal: !0,
      aniso: [0.75, 1.3],
      stat: !0,
      tint: 11578534,
    },
    brick: {
      geo: "brick",
      range: 28,
      scale: [0.11, 0.23],
      embed: 0.15,
      tilt: 0.25,
      tex: "ground_rubble",
      normal: !0,
      aniso: [0.9, 1.1],
    },
    plank: {
      geo: "plank",
      range: 45,
      scale: [0.35, 1.3],
      embed: 0,
      tilt: 0.08,
      tex: "wood_weathered",
      normal: !0,
      aniso: [0.8, 1.6],
      stat: !0,
    },
    glass: {
      geo: "glass",
      range: 14,
      scale: [0.02, 0.07],
      embed: 0,
      tilt: 0.12,
      glass: !0,
      aniso: [0.6, 1.4],
    },
    leaf: {
      geo: "leaf",
      range: 17,
      scale: [0.07, 0.16],
      embed: 0,
      tilt: 0.25,
      atlas: "leaf",
      aniso: [0.85, 1.15],
    },
    paper: {
      geo: "paper",
      range: 30,
      scale: [0.12, 0.3],
      embed: 0,
      tilt: 0.06,
      atlas: "paper",
      aniso: [0.9, 1.1],
    },
    twig: {
      geo: "twig",
      range: 18,
      scale: [0.12, 0.5],
      embed: 0.2,
      tilt: 0.08,
      aniso: [0.9, 1.1],
    },
    can: {
      geo: "can",
      range: 20,
      scale: [0.1, 0.125],
      embed: 0.05,
      tilt: 0.15,
      metal: !0,
      aniso: [1, 1],
    },
    butt: {
      geo: "butt",
      range: 7,
      scale: [0.022, 0.03],
      embed: 0.1,
      tilt: 0.05,
      aniso: [1, 1],
    },
    bottle: {
      geo: "bottle",
      range: 24,
      scale: [0.2, 0.3],
      embed: 0.12,
      tilt: 0.1,
      bottle: !0,
      aniso: [1, 1],
    },
    weed: {
      geo: "weed",
      range: 24,
      scale: [0.12, 0.42],
      embed: 0,
      tilt: 0.15,
      weed: !0,
      upright: !0,
      aniso: [0.8, 1.3],
    },
  },
  rc = {
    gravel: {
      type: "gravel",
      pal: [
        [0.9, 0.88, 0.85],
        [0.72, 0.7, 0.66],
        [0.58, 0.55, 0.5],
        [1, 0.96, 0.9],
      ],
    },
    stone: {
      type: "stone",
      pal: [
        [1, 0.98, 0.94],
        [0.85, 0.82, 0.78],
        [1.12, 1.08, 1.02],
        [0.95, 0.86, 0.78],
      ],
    },
    brickbit: {
      type: "stone",
      pal: [
        [1.25, 0.7, 0.52],
        [1.05, 0.6, 0.46],
        [1.35, 0.88, 0.7],
        [0.95, 0.66, 0.54],
      ],
    },
    plaster: {
      type: "gravel",
      pal: [
        [1.15, 1.12, 1.06],
        [1.05, 1.02, 0.96],
        [1.22, 1.18, 1.1],
      ],
    },
    clump: {
      type: "clump",
      pal: [
        [1.5, 1.42, 1.32],
        [1.25, 1.15, 1.05],
        [1.7, 1.6, 1.48],
      ],
    },
    chunk: {
      type: "chunk",
      pal: [
        [1, 1.04, 1.24],
        [0.86, 0.89, 1.06],
        [1.12, 1.15, 1.36],
        [0.98, 0.96, 1.08],
      ],
    },
    rebar: {
      type: "chunkRebar",
      pal: [
        [1.12, 1.16, 1.38],
        [1, 1.03, 1.22],
      ],
    },
    slab: {
      type: "slab",
      pal: [
        [1.05, 1.1, 1.3],
        [0.88, 0.92, 1.08],
        [1.15, 1.18, 1.38],
      ],
    },
    brick: {
      type: "brick",
      pal: [
        [1.4, 0.62, 0.45],
        [1.2, 0.52, 0.38],
        [1.55, 0.78, 0.58],
        [0.95, 0.5, 0.4],
        [1.3, 1.02, 0.78],
      ],
    },
    plank: {
      type: "plank",
      pal: [
        [0.95, 0.9, 0.85],
        [0.75, 0.7, 0.62],
        [0.6, 0.55, 0.5],
      ],
    },
    glass: {
      type: "glass",
      pal: [
        [0.55, 0.68, 0.62],
        [0.7, 0.72, 0.7],
        [0.4, 0.48, 0.44],
      ],
    },
    leaf: {
      type: "leaf",
      pal: [
        [1, 1, 1],
        [0.9, 0.85, 0.8],
        [0.8, 0.75, 0.7],
        [1.05, 1, 0.92],
      ],
    },
    paper: {
      type: "paper",
      pal: [
        [0.85, 0.83, 0.78],
        [0.72, 0.7, 0.65],
        [0.6, 0.57, 0.5],
      ],
    },
    twig: {
      type: "twig",
      pal: [
        [0.36, 0.27, 0.19],
        [0.3, 0.24, 0.18],
        [0.45, 0.38, 0.3],
        [0.25, 0.2, 0.16],
      ],
    },
    charcoal: {
      type: "twig",
      pal: [
        [0.05, 0.05, 0.05],
        [0.08, 0.075, 0.07],
        [0.12, 0.11, 0.1],
      ],
    },
    ash: {
      type: "gravel",
      pal: [
        [0.55, 0.54, 0.52],
        [0.35, 0.34, 0.33],
        [0.7, 0.69, 0.67],
      ],
    },
    cinder: {
      type: "clump",
      pal: [
        [0.18, 0.17, 0.16],
        [0.12, 0.11, 0.1],
        [0.26, 0.24, 0.22],
      ],
    },
    can: {
      type: "can",
      pal: [
        [0.5, 0.16, 0.13],
        [0.6, 0.6, 0.62],
        [0.2, 0.3, 0.45],
        [0.25, 0.36, 0.24],
        [0.5, 0.42, 0.28],
      ],
    },
    butt: {
      type: "butt",
      pal: [
        [1, 1, 1],
        [0.85, 0.85, 0.82],
      ],
    },
    bottle: {
      type: "bottle",
      pal: [
        [0.5, 0.62, 0.68],
        [0.28, 0.38, 0.28],
        [0.38, 0.26, 0.14],
        [0.7, 0.72, 0.74],
      ],
    },
    weed: {
      type: "weed",
      pal: [
        [1, 1, 1],
        [0.9, 0.95, 0.8],
        [1.1, 1, 0.85],
      ],
    },
  },
  ji = [
    {
      match: /ground_debris/,
      cluster: 0.75,
      clusterItems: {
        chunk: 0.97,
        stone: 0.92,
        brick: 0.95,
        brickbit: 0.95,
        plaster: 0.85,
        gravel: 0.7,
        slab: 0.95,
        plank: 0.9,
        leaf: 0.8,
      },
      items: {
        gravel: 13,
        plaster: 3,
        stone: 1.8,
        brickbit: 0.9,
        chunk: 0.75,
        rebar: 0.02,
        slab: 0.05,
        brick: 0.35,
        glass: 0.9,
        paper: 0.08,
        butt: 0.35,
        leaf: 2.4,
        twig: 0.35,
        can: 0.025,
        bottle: 0.015,
        plank: 0.03,
        weed: 0.12,
        clump: 0.12,
      },
      wall: {
        chunk: 7,
        brick: 5,
        brickbit: 7,
        plaster: 5,
        gravel: 2.5,
        stone: 5,
        clump: 6,
        leaf: 4,
        paper: 2,
        weed: 8,
        glass: 1.5,
        plank: 2,
        can: 2,
        bottle: 2,
      },
    },
    {
      match: /ground_rubble/,
      cluster: 0.6,
      maxSlope: 55,
      items: {
        gravel: 20,
        plaster: 4,
        stone: 4.5,
        brickbit: 2,
        chunk: 1.6,
        rebar: 0.12,
        slab: 0.25,
        brick: 1,
        glass: 0.25,
        plank: 0.1,
        paper: 0.04,
        clump: 0.6,
        weed: 0.08,
        twig: 0.15,
      },
      wall: { chunk: 2, weed: 6, plank: 2 },
    },
    {
      match: /concrete_floor/,
      cluster: 0.8,
      clusterItems: { chunk: 0.97, stone: 0.92, brick: 0.95 },
      items: {
        gravel: 5,
        plaster: 3,
        brickbit: 0.4,
        stone: 0.9,
        chunk: 0.18,
        slab: 0.03,
        brick: 0.12,
        glass: 1.2,
        paper: 0.18,
        butt: 0.35,
        leaf: 0.5,
        plank: 0.04,
        can: 0.03,
        bottle: 0.02,
      },
      wall: {
        chunk: 4,
        brick: 4,
        brickbit: 4,
        plaster: 3,
        gravel: 1.5,
        stone: 2,
        leaf: 5,
        paper: 3,
        glass: 2,
        plank: 3,
        can: 2,
        bottle: 2,
      },
    },
    {
      match: /ground_mud/,
      cluster: 0.6,
      items: {
        leaf: 3.5,
        twig: 0.8,
        clump: 1.6,
        stone: 1.2,
        gravel: 5,
        weed: 0.5,
        paper: 0.04,
        can: 0.015,
        bottle: 0.02,
        butt: 0.1,
      },
      wall: { weed: 6, leaf: 2, can: 2, bottle: 2, paper: 2 },
    },
    {
      match: /ground_leaves|ground_forest/,
      cluster: 0.5,
      items: {
        leaf: 12,
        twig: 1.6,
        stone: 0.4,
        clump: 0.6,
        weed: 0.25,
        gravel: 2,
      },
      wall: { leaf: 2, weed: 3 },
    },
    {
      match: /ground_burnt/,
      cluster: 0.6,
      items: {
        charcoal: 4,
        ash: 8,
        cinder: 0.25,
        stone: 0.6,
        twig: 0.4,
        gravel: 2,
      },
      wall: { charcoal: 2 },
    },
    {
      match: /ground_asphalt/,
      cluster: 0.75,
      items: {
        leaf: 2.2,
        gravel: 5,
        stone: 0.4,
        can: 0.05,
        butt: 0.7,
        paper: 0.12,
        glass: 0.35,
        bottle: 0.025,
        weed: 0.12,
        twig: 0.15,
      },
      wall: {
        leaf: 5,
        weed: 10,
        paper: 3,
        can: 3,
        bottle: 3,
        butt: 2,
        gravel: 2,
      },
    },
    {
      match: /ground_gravel_leaves/,
      cluster: 0.55,
      items: { gravel: 14, leaf: 4.5, stone: 1.6, twig: 0.5, weed: 0.2 },
      wall: { leaf: 3, weed: 5 },
    },
  ];
function lc(a, t) {
  ((a.onBeforeCompile = (e) => {
    ((e.uniforms.scRange = { value: t.range }),
      (e.vertexShader = e.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
        uniform float scRange; attribute float scAO; varying float vScAO;`,
        )
        .replace(
          "#include <uv_vertex>",
          `#include <uv_vertex>
        {
          vec3 ip = instanceMatrix[3].xyz;
          float ih = fract(sin(dot(ip.xz, vec2(12.9898, 78.233))) * 43758.5453);
          #ifdef USE_MAP
            ${
              t.atlas
                ? `vec2 cell = vec2(mod(floor(ih * ${t.atlas[0] * t.atlas[1]}.0), ${t.atlas[0]}.0), floor(floor(ih * ${t.atlas[0] * t.atlas[1]}.0) / ${t.atlas[0]}.0));
              vMapUv = (uv * ${t.atlasScale.toFixed(3)} + 0.5 - ${(t.atlasScale / 2).toFixed(3)} + cell) / vec2(${t.atlas[0]}.0, ${t.atlas[1]}.0);`
                : "vMapUv += vec2(ih, fract(ih * 7.13));"
            }
          #endif
          #ifdef USE_NORMALMAP
            vNormalMapUv += vec2(ih, fract(ih * 7.13));
          #endif
        }`,
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
        vScAO = scAO;
        ${
          t.stat
            ? ""
            : `{
          vec3 ip2 = instanceMatrix[3].xyz;
          float fd = 1.0 - smoothstep(scRange * 0.72, scRange, distance(cameraPosition, ip2));
          transformed *= fd;
        }`
        }`,
        )),
      (e.fragmentShader = e.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
varying float vScAO;`,
        )
        .replace(
          "#include <aomap_fragment>",
          `
        reflectedLight.indirectDiffuse *= vScAO;
        reflectedLight.indirectSpecular *= vScAO * vScAO;`,
        )));
  }),
    (a.customProgramCacheKey = () =>
      "scatter|" + (t.atlas ? t.atlas.join("x") : "") + (t.stat ? "s" : "d")));
}
class cc {
  constructor(t, e = {}, o = null) {
    ((this.assets = t),
      (this.density = e.vegetation ?? 1),
      (this.rangeScale = Math.min(1.25, 0.7 + 0.3 * this.density)),
      (this.collider = o),
      (this.items = new Map()));
    for (const s of Object.keys(na))
      this.items.set(s, { m: [], c: [], ao: [], n: 0 });
    ((this.meshes = []),
      (this.lastStats = { instances: 0, triangles: 0, repacks: 0, byType: {} }),
      (this._frustum = new br()),
      (this._pv = new B()),
      (this._wallCache = new Map()));
  }
  scatterOnMeshes(t, e = ji, o = 1) {
    const s = bo(o * 9973 + 17),
      i = new U0();
    i.firstHitOnly = !1;
    const n = new P(0, -1, 0),
      r = new P(),
      l = new P(),
      u = new Ga(),
      h = new Q(),
      c = new Q(),
      d = new Ae(),
      p = new P(0, 1, 0),
      f = new B(),
      g = new P(),
      m = new P(),
      w = new vr(),
      y = new P(),
      x = new po(),
      b = [];
    this.stats = {
      candidates: 0,
      placed: 0,
      rays: 0,
      rejected: { slope: 0, solid: 0, miss: 0 },
    };
    for (const v of e) {
      const M = Math.cos(((v.maxSlope ?? 35) * Math.PI) / 180),
        _ = t.filter(
          (S) =>
            S.isMesh &&
            (v.match.test(S.name) || v.match.test(S.material?.name || "")),
        );
      for (const S of _) {
        (S.updateMatrixWorld(),
          S.geometry.boundingBox || S.geometry.computeBoundingBox(),
          x.copy(S.geometry.boundingBox).applyMatrix4(S.matrixWorld),
          u.getNormalMatrix(S.matrixWorld));
        const T = (x.max.x - x.min.x) * (x.max.z - x.min.z),
          A = S.geometry.attributes.bakedAO;
        for (const [z, R] of Object.entries(v.items)) {
          const k = rc[z];
          if (!k) continue;
          const C = na[k.type],
            O = v.wall?.[z] || 0,
            V = R * this.density,
            F = Math.round(T * V * 1.6),
            q = O > 0 ? Math.round(T * V * O * 2) : 0,
            I = uo(z.length * 3.7, R) * 100;
          for (let H = 0; H < F + q; H++) {
            const L = x.min.x + s() * (x.max.x - x.min.x),
              D = x.min.z + s() * (x.max.z - x.min.z);
            this.stats.candidates++;
            const U = H >= F,
              Y = v.clusterItems?.[z] ?? v.cluster ?? 0.6,
              et =
                Gn(L * 0.33 + I, D * 0.33 - I) * 0.6 +
                Gn(L * 0.33 + 3, D * 0.33 + 5) * 0.4,
              G =
                (1 - Y) * 0.625 +
                Y *
                  Math.max(
                    0,
                    Math.min(1, (et - 0.3 - Y * 0.12) * (2.2 + Y * 1.5)),
                  ) *
                  1;
            if (!U && s() > G) continue;
            if (
              (r.set(L, x.max.y + 0.5, D),
              i.set(r, n),
              (i.far = x.max.y - x.min.y + 1),
              (b.length = 0),
              S.raycast(i, b),
              this.stats.rays++,
              !b.length)
            ) {
              this.stats.rejected.miss++;
              continue;
            }
            b.sort((Vt, At) => Vt.distance - At.distance);
            const j = b[Math.floor(s() * b.length)];
            if ((l.copy(j.face.normal).applyMatrix3(u).normalize(), l.y < M)) {
              this.stats.rejected.slope++;
              continue;
            }
            const wt = j.point;
            if (this.collider && this._insideSolid(wt, l)) {
              this.stats.rejected.solid++;
              continue;
            }
            if (U) {
              const Vt = this._wallProximity(wt);
              if (s() > Vt * Vt) continue;
            }
            let me = 1;
            if (A && j.face) {
              const Vt = S.geometry.attributes.position;
              (w.a
                .fromBufferAttribute(Vt, j.face.a)
                .applyMatrix4(S.matrixWorld),
                w.b
                  .fromBufferAttribute(Vt, j.face.b)
                  .applyMatrix4(S.matrixWorld),
                w.c
                  .fromBufferAttribute(Vt, j.face.c)
                  .applyMatrix4(S.matrixWorld),
                w.getBarycoord(wt, y));
              const At =
                  A.getX(j.face.a) * y.x +
                  A.getX(j.face.b) * y.y +
                  A.getX(j.face.c) * y.z,
                Ht =
                  A.getY(j.face.a) * y.x +
                  A.getY(j.face.b) * y.y +
                  A.getY(j.face.c) * y.z;
              me = At * (0.16 + 0.84 * Ht);
            }
            this._place(z, k, C, wt, l, me, s, {
              q: h,
              q2: c,
              e: d,
              up: p,
              m4: f,
              sc: g,
              pp: m,
            });
          }
        }
      }
    }
    return this.stats;
  }
  _insideSolid(t, e) {
    const o = this.collider.bvh,
      s = this._ray || (this._ray = new yo());
    (s.origin.copy(t).addScaledVector(e, 0.02), s.direction.set(0, 1, 0));
    const i = o.raycastFirst(s, $t);
    return i ? (i.distance < 0.12 ? !0 : i.face && i.face.normal.y > 0.1) : !1;
  }
  _wallProximity(t) {
    const e =
      Math.round(t.x * 2) + "," + Math.round(t.z * 2) + "," + Math.round(t.y);
    if (this._wallCache.has(e)) return this._wallCache.get(e);
    let o = 1.6;
    if (this.collider) {
      const i = this._ray2 || (this._ray2 = new yo());
      for (let n = 0; n < 6; n++) {
        const r = (n / 6) * Math.PI * 2;
        (i.origin.set(t.x, t.y + 0.3, t.z),
          i.direction.set(Math.cos(r), 0, Math.sin(r)));
        const l = this.collider.bvh.raycastFirst(i, $t);
        l && l.distance < o && (o = l.distance);
      }
    }
    const s = Math.max(0, 1 - o / 1.6);
    return (this._wallCache.set(e, s), s);
  }
  _place(t, e, o, s, i, n, r, l) {
    const u = this.items.get(e.type),
      h = o.scale[0] + (o.scale[1] - o.scale[0]) * Math.pow(r(), 1.6),
      c = o.aniso[0],
      d = o.aniso[1];
    (l.sc.set(
      h * (c + r() * (d - c)),
      h * (c + r() * (d - c)),
      h * (c + r() * (d - c)),
    ),
      o.weed && (l.sc.x = l.sc.z = h * (0.8 + r() * 0.6)),
      o.upright
        ? l.q.setFromUnitVectors(l.up, l.pp.copy(i).lerp(l.up, 0.6).normalize())
        : l.q.setFromUnitVectors(l.up, i),
      l.e.set(
        (r() - 0.5) * 2 * o.tilt,
        r() * Math.PI * 2,
        (r() - 0.5) * 2 * o.tilt,
      ),
      l.q2.setFromEuler(l.e),
      l.q.multiply(l.q2),
      l.pp.copy(s).addScaledVector(i, -o.embed * l.sc.y * 0.5 + 0.002),
      l.m4.compose(l.pp, l.q, l.sc));
    for (let g = 0; g < 16; g++) u.m.push(l.m4.elements[g]);
    const p = e.pal[Math.floor(r() * e.pal.length)],
      f = 0.88 + r() * 0.24;
    (u.c.push(p[0] * f, p[1] * f, p[2] * f),
      u.ao.push(Math.max(0.12, n)),
      u.n++,
      this.stats.placed++);
  }
  build(t) {
    const e = this.assets,
      o = { leaf: nc(), paper: ic() },
      s = (c, d) => {
        const p = e.manifest?.textures?.[c];
        return p?.[d] ? e.texture(p[d], d === "diff") : null;
      },
      i = { types: {}, instances: 0, drawCalls: 0, trianglesAll: 0 };
    let n = 1 / 0,
      r = 1 / 0,
      l = -1 / 0,
      u = -1 / 0;
    for (const c of this.items.values())
      for (let d = 0; d < c.n; d++) {
        const p = c.m[d * 16 + 12],
          f = c.m[d * 16 + 14];
        (p < n && (n = p),
          p > l && (l = p),
          f < r && (r = f),
          f > u && (u = f));
      }
    (isFinite(n) || ((n = r = 0), (l = u = 1)),
      (this.gx0 = Math.floor(n / ss) * ss),
      (this.gz0 = Math.floor(r / ss) * ss),
      (this.nx = Math.max(1, Math.ceil((l - this.gx0 + 0.001) / ss))),
      (this.nz = Math.max(1, Math.ceil((u - this.gz0 + 0.001) / ss))));
    const h = this.nx * this.nz;
    this.cellBoxes = [];
    for (let c = 0; c < h; c++) this.cellBoxes.push(new po().makeEmpty());
    ((this.cellVis = new Float32Array(h)), (this.types = []));
    for (const [c, d] of this.items) {
      if (!d.n) continue;
      const p = na[c];
      let f = Yi[p.geo]();
      const g = (f.index ? f.index.count : f.attributes.position.count) / 3,
        m = {
          roughness: 0.95,
          metalness: 0,
          vertexColors: !!f.attributes.color,
        };
      (p.tex &&
        ((m.map = s(p.tex, "diff")),
        p.normal &&
          ((m.normalMap = s(p.tex, "nor")), (m.normalScale = new Rt(1, 1)))),
        p.atlas &&
          ((m.map = o[p.atlas]),
          (m.alphaTest = 0.5),
          (m.side = $t),
          (m.roughness = p.atlas === "paper" ? 0.85 : 0.75)),
        p.glass &&
          Object.assign(m, {
            roughness: 0.04,
            metalness: 0,
            envMapIntensity: 1.4,
            color: new xo(0.32, 0.37, 0.35),
          }),
        p.tint && (m.color = new xo(p.tint)),
        p.metal && Object.assign(m, { roughness: 0.38, metalness: 0.85 }),
        p.bottle &&
          Object.assign(m, {
            roughness: 0.12,
            metalness: 0.1,
            envMapIntensity: 1.3,
          }),
        p.weed && Object.assign(m, { side: $t, roughness: 0.8 }),
        p.geo === "twig" && (m.roughness = 0.9));
      const w = new Tt(m);
      (p.atlas === "leaf" && (w.alphaToCoverage = !0),
        (w.name = "scatter_" + c));
      const y = p.range * this.rangeScale;
      lc(w, {
        range: y,
        stat: !!p.stat,
        atlas:
          p.atlas === "leaf" ? [4, 2] : p.atlas === "paper" ? [2, 2] : null,
        atlasScale: p.atlas === "leaf" ? 1 : 0.92,
      });
      const x = d.n,
        b = new Int32Array(x),
        v = new Int32Array(x);
      for (let k = 0; k < x; k++) {
        const C = d.m[k * 16 + 12],
          O = d.m[k * 16 + 13],
          V = d.m[k * 16 + 14],
          F = Math.min(this.nx - 1, Math.floor((C - this.gx0) / ss)),
          q = Math.min(this.nz - 1, Math.floor((V - this.gz0) / ss));
        ((b[k] = q * this.nx + F), (v[k] = k));
        const I = this.cellBoxes[b[k]];
        (I.expandByPoint(new P(C, O - 0.5, V)),
          I.expandByPoint(new P(C, O + 1.5, V)));
      }
      v.sort((k, C) => b[k] - b[C]);
      const M = new Float32Array(x * 16),
        _ = new Float32Array(x * 3),
        S = new Float32Array(x),
        T = new Int32Array(h).fill(0),
        A = new Int32Array(h).fill(0);
      for (let k = 0; k < x; k++) {
        const C = v[k];
        for (let V = 0; V < 16; V++) M[k * 16 + V] = d.m[C * 16 + V];
        ((_[k * 3] = d.c[C * 3]),
          (_[k * 3 + 1] = d.c[C * 3 + 1]),
          (_[k * 3 + 2] = d.c[C * 3 + 2]),
          (S[k] = d.ao[C]));
        const O = b[C];
        (A[O] === 0 && (T[O] = k), A[O]++);
      }
      const z = new co(f, w, x);
      ((z.name = "scatter:" + c),
        z.instanceMatrix.array.set(M),
        (z.instanceColor = new Va(new Float32Array(_), 3)));
      const R = new Va(new Float32Array(S), 1);
      (f.setAttribute("scAO", R),
        (z.castShadow = !!p.stat),
        (z.receiveShadow = !0),
        (z.matrixAutoUpdate = !1),
        z.updateMatrix(),
        p.stat
          ? (z.computeBoundingSphere(), (z.frustumCulled = !0))
          : ((z.frustumCulled = !1),
            z.instanceMatrix.setUsage(fo),
            z.instanceColor.setUsage(fo),
            R.setUsage(fo),
            (z.count = 0)),
        t.add(z),
        this.meshes.push(z),
        this.types.push({
          name: c,
          im: z,
          T: p,
          range: y,
          srcM: M,
          srcC: _,
          srcA: S,
          cellStart: T,
          cellCount: A,
          aoAttr: R,
          sig: -1,
          tris: g,
          N: x,
          stat: !!p.stat,
        }),
        (i.types[c] = {
          instances: x,
          tris: g,
          range: +y.toFixed(1),
          static: !!p.stat,
        }),
        (i.instances += x),
        (i.trianglesAll += x * g),
        i.drawCalls++);
    }
    for (const c of this.cellBoxes)
      c.isEmpty() && c.set(new P(1e9, 1e9, 1e9), new P(1e9, 1e9, 1e9));
    return ((i.cells = h), (this.buildStats = i), i);
  }
  update(t, e = 22) {
    if (!this.types) return;
    t.updateMatrixWorld();
    const o = this._cam || (this._cam = new zi());
    ((o.fov = Math.min(170, (t.fov || 78) + e)),
      (o.aspect = t.aspect || 1.78),
      (o.near = 0.05),
      (o.far = 200),
      o.updateProjectionMatrix(),
      this._pv.multiplyMatrices(o.projectionMatrix, t.matrixWorldInverse),
      this._frustum.setFromProjectionMatrix(this._pv));
    const s = t.position,
      i = this.cellBoxes.length;
    for (let l = 0; l < i; l++) {
      const u = this.cellBoxes[l];
      if (!this._frustum.intersectsBox(u)) {
        this.cellVis[l] = 1 / 0;
        continue;
      }
      const h = Math.max(u.min.x - s.x, 0, s.x - u.max.x),
        c = Math.max(u.min.z - s.z, 0, s.z - u.max.z),
        d = Math.max(u.min.y - s.y, 0, s.y - u.max.y);
      this.cellVis[l] = Math.sqrt(h * h + d * d + c * c);
    }
    let n = 0,
      r = 0;
    for (let l = 0; l < this.types.length; l++) {
      const u = this.types[l];
      if (u.stat) {
        ((n += u.N),
          (r += u.N * u.tris),
          (this.lastStats.byType[u.name] = u.N * u.tris));
        continue;
      }
      let h = 0;
      for (let c = 0; c < i; c++)
        this.cellVis[c] <= u.range &&
          u.cellCount[c] > 0 &&
          (h = (Math.imul(h, 31) + c + 1) | 0);
      if (h !== u.sig) {
        u.sig = h;
        const c = u.im.instanceMatrix.array,
          d = u.im.instanceColor.array,
          p = u.aoAttr.array;
        let f = 0;
        for (let y = 0; y < i; y++) {
          if (!(this.cellVis[y] <= u.range) || u.cellCount[y] === 0) continue;
          const x = u.cellStart[y],
            b = x + u.cellCount[y];
          for (let v = x * 16, M = b * 16; v < M; v++)
            c[f * 16 + v - x * 16] = u.srcM[v];
          for (let v = x * 3, M = b * 3; v < M; v++)
            d[f * 3 + v - x * 3] = u.srcC[v];
          for (let v = x; v < b; v++) p[f + v - x] = u.srcA[v];
          f += b - x;
        }
        u.im.count = f;
        const g = u.im.instanceMatrix,
          m = u.im.instanceColor,
          w = u.aoAttr;
        (g.clearUpdateRanges(),
          g.addUpdateRange(0, f * 16),
          (g.needsUpdate = !0),
          m.clearUpdateRanges(),
          m.addUpdateRange(0, f * 3),
          (m.needsUpdate = !0),
          w.clearUpdateRanges(),
          w.addUpdateRange(0, f),
          (w.needsUpdate = !0),
          this.lastStats.repacks++);
      }
      ((n += u.im.count),
        (r += u.im.count * u.tris),
        (this.lastStats.byType[u.name] = u.im.count * u.tris));
    }
    ((this.lastStats.instances = n), (this.lastStats.triangles = r));
  }
  dispose(t) {
    for (const e of this.meshes)
      (t.remove(e),
        e.geometry.dispose(),
        e.material.map?.dispose?.(),
        e.material.dispose());
    ((this.meshes.length = 0), (this.types = null));
  }
}

export { ac, cc, ji };
