// render/volumetric.js — atmósfera barata en espacio de pantalla (½ resolución), v3.0
//
//   rgb = luz dispersada hacia la cámara (se SUMA a la escena, en unidades de escena, antes de la exposición)
//   a   = opacidad de la neblina con altura (la escena se mezcla hacia hazeColor)
//
// 1) Luces puntuales (fluorescentes, emergencia): integral analítica del "airlight" de una luz puntual en un medio
//    homogéneo a lo largo del rayo de vista, cortada en la profundidad de la escena:
//       ∫₀ᵀ dt / (h² + (t−b)²) = [atan((T−b)/h) − atan(−b/h)] / h
//    → halo/cono de luz correcto en perspectiva y ocluido por la geometría, sin raymarch (≈8 ops por luz).
// 2) Linterna: raymarch corto (VOL_STEPS pasos con jitter) dentro del cono del foco.
// 3) God rays: muestreo radial de "cielo visible" hacia la posición del sol en pantalla.
// 4) Neblina con altura: integral analítica de densidad exponencial en Y.
export const VOL_MAX_LIGHTS = 8;

export const volFrag = (common) => /* glsl */ `
  precision highp float;
  uniform sampler2D tDepth;
  uniform vec3 lPos[${VOL_MAX_LIGHTS}];      // espacio de vista
  uniform vec3 lCol[${VOL_MAX_LIGHTS}];      // color × intensidad
  uniform float lRange[${VOL_MAX_LIGHTS}];
  uniform float density;                     // coeficiente de dispersión (haze × volumetric)
  uniform vec3 torchPos; uniform vec3 torchDir; uniform vec3 torchCol; uniform vec2 torchCone;   // cos(outer), cos(inner)
  uniform vec3 sunUv;                        // xy = posición del sol en uv de escena, z = visibilidad (0 si está detrás)
  uniform vec3 sunCol; uniform float godrays;
  uniform vec3 upView;                       // eje Y del mundo en espacio de vista
  uniform float camY; uniform vec3 hazeParams;   // x = densidad base, y = altura de referencia, z = 1/H
  uniform float time;
  varying vec2 vUv;
  ${common}
  void main(){
    float d = textureLod(tDepth, vUv, 0.0).r;
    float z = linZ(d);
    vec3 P = viewPos(vUv, z);
    float T = length(P);
    vec3 dir = P / max(T, 1e-4);
    float Tm = min(T, 60.0);
    vec3 acc = vec3(0.0);

    #if VOL_LIGHTS > 0
    for (int i = 0; i < VOL_LIGHTS; i++) {
      vec3 L = lPos[i];
      float b = dot(L, dir);
      float h2 = max(dot(L, L) - b * b, 0.0);
      float h = sqrt(h2 + 0.02);                           // +ε: sin singularidad al mirar a la bombilla
      float R = lRange[i];
      // solo el tramo del rayo dentro del radio de la luz
      float half_ = sqrt(max(R * R - h2, 0.0));
      float t0 = max(b - half_, 0.0), t1 = min(b + half_, Tm);
      if (t1 > t0) {
        float I = (atan((t1 - b) / h) - atan((t0 - b) / h)) / h;
        float win = 1.0 - h2 / (R * R); win *= win;        // caída suave hacia el borde del radio
        acc += lCol[i] * I * win;
      }
    }
    #endif

    #if VOL_TORCH
    if (torchCol.r + torchCol.g + torchCol.b > 0.0) {
      float jit = ign(gl_FragCoord.xy + fract(time * 3.7) * 61.0);
      float Tt = min(T, 16.0), dt = Tt / float(VOL_STEPS);
      vec3 s = vec3(0.0);
      for (int i = 0; i < VOL_STEPS; i++) {
        vec3 p = dir * ((float(i) + jit) * dt);
        vec3 v = p - torchPos; float r2 = dot(v, v) + 0.05;
        float c = dot(v * inversesqrt(r2), torchDir);
        s += torchCol * smoothstep(torchCone.x, torchCone.y, c) / r2;
      }
      acc += s * dt;
    }
    #endif
    acc *= density * 0.0795775;                            // σs / 4π

    #if VOL_GODRAYS
    if (sunUv.z > 0.0 && godrays > 0.0) {
      vec2 delta = (sunUv.xy - vUv);
      float dist = length(delta);
      delta *= min(1.0, 0.55 / max(dist, 1e-3)) / 12.0;
      float jit = ign(gl_FragCoord.xy + 13.0);
      float sky = 0.0;
      for (int i = 0; i < 12; i++) {
        vec2 u = vUv + delta * (float(i) + jit);
        float ds = textureLod(tDepth, clamp(u, 0.001, 0.999), 0.0).r;
        sky += step(0.99999, ds) * (1.0 - float(i) / 14.0);
      }
      sky /= 12.0;
      // solo ilumina el medio delante de geometría (interior mirando a un hueco): en cielo abierto no añade nada
      float inAir = smoothstep(0.0, 6.0, min(T, 30.0));
      acc += sunCol * godrays * sky * sunUv.z * inAir * (1.0 - step(0.99999, d)) * exp(-dist * 2.2);
    }
    #endif

    // neblina con altura (más densa a ras de suelo)
    float dy = dot(dir, upView);
    float k = hazeParams.z;
    float base = hazeParams.x * exp(-(camY - hazeParams.y) * k);
    float a = abs(dy) * k;
    float od = base * (a > 1e-3 ? (1.0 - exp(-dy * k * Tm)) / (dy * k) : Tm);
    float fog = 1.0 - exp(-max(od, 0.0));
    gl_FragColor = vec4(acc, fog);
  }`;
