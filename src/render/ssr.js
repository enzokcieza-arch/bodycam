// render/ssr.js — reflejos en espacio de pantalla para suelos mojados y charcos (v3.0)
//
// Máscara: los materiales de suelo marcados con markReflective() escriben  alpha = −humedad  en el render HDR de la
// escena (RGBA16F). Ningún otro material escribe alfa negativo, y la mezcla de los transparentes encima solo puede
// acercarlo a ≥ 0 (= menos reflejo), así que la máscara es segura sin un G-buffer extra.
//
// Pase (½ resolución): para cada píxel mojado se refleja el rayo de vista sobre la normal horizontal (con ondas
// procedurales en el agua), se avanza en espacio de vista con pasos crecientes, se proyecta y se compara contra la
// profundidad de la escena; refinamiento binario al cruzar. Salida: rgb = color reflejado, a = peso (humedad ×
// Fresnel × confianza). El pase final hace  col = mix(col, rgb, a).
export const ssrFrag = (common) => /* glsl */ `
  precision highp float;
  uniform sampler2D tColor; uniform sampler2D tDepth;
  uniform mat4 projWide; uniform vec3 upView; uniform float time; uniform float strength;
  varying vec2 vUv;
  ${common}
  float h21(vec2 p){ return fract(sin(dot(p, vec2(41.31, 289.17))) * 15731.743); }
  float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
  vec2 project(vec3 q){ vec4 c = projWide * vec4(q, 1.0); return c.xy / c.w * 0.5 + 0.5; }
  void main(){
    vec4 c = textureLod(tColor, vUv, 0.0);
    float wet = clamp(-c.a, 0.0, 1.0);
    if (wet < 0.02) { gl_FragColor = vec4(0.0); return; }
    float d = textureLod(tDepth, vUv, 0.0).r;
    if (d >= 1.0) { gl_FragColor = vec4(0.0); return; }
    float z = linZ(d);
    vec3 P = viewPos(vUv, z);
    // la máscara solo es fiable en superficies casi horizontales: comprobarlo con la normal de profundidad
    vec3 nd = normalize(cross(dFdx(P), dFdy(P)));
    float horiz = smoothstep(0.80, 0.95, abs(dot(nd, upView)));
    if (horiz < 0.01) { gl_FragColor = vec4(0.0); return; }
    // normal: horizontal + ondas (agua: finas y animadas; suelo húmedo: rugosidad más ancha y estática)
    vec3 Pw = P;   // espacio de vista; para un ruido estable usamos la distancia a lo largo del plano
    vec3 ax = normalize(cross(upView, vec3(0.0, 0.0, 1.0)));
    vec3 az = cross(ax, upView);
    vec2 pp = vec2(dot(Pw, ax), dot(Pw, az));
    float water = smoothstep(0.85, 1.0, wet);
    float amp = mix(0.06, 0.012, water);
    vec2 g = vec2(n2(pp * 9.0 + time * 0.6 * water) - n2(pp * 9.0 + 3.1 - time * 0.5 * water),
                  n2(pp * 9.0 + 7.7 + time * 0.4 * water) - n2(pp * 9.0 + 1.3)) * amp
           + vec2(n2(pp * 2.3) - 0.5, n2(pp * 2.3 + 9.0) - 0.5) * amp * 0.6;
    vec3 N = normalize(upView + ax * g.x + az * g.y);
    vec3 V = normalize(P);
    vec3 R = reflect(V, N);
    float F = 0.02 + 0.98 * pow(1.0 - clamp(dot(-V, N), 0.0, 1.0), 5.0);
    // marcha
    float jit = ign(gl_FragCoord.xy + fract(time * 1.7) * 37.0);
    float t = 0.05 + 0.12 * jit, dt = 0.12;
    vec3 Q = P; vec2 uv = vUv; float hit = 0.0;
    float tPrev = 0.0;
    for (int i = 0; i < SSR_STEPS; i++) {
      Q = P + R * t;
      if (-Q.z < 0.05) break;
      uv = project(Q);
      if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) break;
      float sz = linZ(textureLod(tDepth, uv, 0.0).r);
      float qz = -Q.z;
      float thick = 0.35 + 0.08 * t;
      if (qz > sz + 0.01 && qz - sz < thick) {
        // refinamiento binario
        float a = tPrev, b = t;
        for (int k = 0; k < 5; k++) {
          float m = 0.5 * (a + b); vec3 Qm = P + R * m; vec2 um = project(Qm);
          float sm = linZ(textureLod(tDepth, um, 0.0).r);
          if (-Qm.z > sm + 0.01) b = m; else a = m;
        }
        uv = project(P + R * b);
        hit = 1.0;
        break;
      }
      tPrev = t;
      t += dt; dt *= 1.18;
      if (t > 60.0) break;
    }
    // reflejos que salen de la pantalla: el cielo/env ya está en el sombreado → peso 0
    vec2 e = min(uv, 1.0 - uv);
    float edge = smoothstep(0.0, 0.07, min(e.x, e.y));
    float conf = hit * edge * horiz;
    vec3 col = textureLod(tColor, uv, 0.0).rgb;
    gl_FragColor = vec4(col, clamp(wet * conf * mix(F, 0.15 + 0.85 * F, water) * strength, 0.0, 0.95));
  }`;

// Marca un material de suelo como reflectante: escribe −expr en el alfa de salida. expr es GLSL (0..1) que puede
// usar variables globales ya inyectadas por otros parches (pomWet, pomStain, wgRefl).
export function markReflective(mat, expr) {
  if (!mat || mat.userData.reflExpr) return;
  mat.userData.reflExpr = expr;
  const prev = mat.onBeforeCompile, prevKey = mat.customProgramCacheKey;
  mat.onBeforeCompile = function (sh, r) {
    prev && prev.call(this, sh, r);
    sh.fragmentShader = sh.fragmentShader.replace(
      "#include <dithering_fragment>",
      `#include <dithering_fragment>\n  gl_FragColor.a = -clamp(${expr}, 0.0, 1.0);`,
    );
  };
  mat.customProgramCacheKey = function () {
    return (typeof prevKey === "function" ? prevKey.call(this) : "") + "|refl:" + expr;
  };
  mat.needsUpdate = true;
}
