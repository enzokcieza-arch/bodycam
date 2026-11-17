// render/temporal.js — acumulación temporal para buffers ruidosos a ½ resolución (volumétrica, SSR). v3.0
//
// Cada frame: reproyecta el píxel al frame anterior con la profundidad (reprojFull: clip actual → clip previo),
// lee la historia, la recorta a la caja min/max de la vecindad 3×3 del frame actual (evita estelas cuando algo
// cambia) y mezcla. El ruido aleatorio por frame (jitter de raymarch) se promedia en ~8 frames.
// El arma y los brazos (< 0.9 m) se mueven con la cámara: para ellos la historia está en la misma uv.
export const temporalFrag = (common) => /* glsl */ `
  precision highp float;
  uniform sampler2D tCur; uniform sampler2D tHist; uniform sampler2D tDepth;
  uniform mat4 reprojFull; uniform vec2 texel; uniform float blend; uniform float valid;
  varying vec2 vUv;
  ${common}
  void main(){
    vec4 c = texture2D(tCur, vUv);
    vec4 mn = c, mx = c;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      if (x == 0 && y == 0) continue;
      vec4 s = texture2D(tCur, vUv + vec2(float(x), float(y)) * texel);
      mn = min(mn, s); mx = max(mx, s);
    }
    float d = textureLod(tDepth, vUv, 0.0).r;
    vec2 ndc = vUv * 2.0 - 1.0;
    vec2 prevUv = vUv;
    if (linZ(d) > 0.9) {
      vec4 pc = reprojFull * vec4(ndc, d * 2.0 - 1.0, 1.0);
      prevUv = pc.xy / pc.w * 0.5 + 0.5;
    }
    float inside = step(0.0, prevUv.x) * step(prevUv.x, 1.0) * step(0.0, prevUv.y) * step(prevUv.y, 1.0);
    vec4 h = clamp(texture2D(tHist, prevUv), mn, mx);
    float w = blend * inside * valid;
    gl_FragColor = mix(c, h, w);
  }`;
