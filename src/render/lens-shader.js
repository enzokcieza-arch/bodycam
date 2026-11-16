// render/lens-shader.js — pase final "bodycam": lente gran angular + sensor + códec de vídeo (v3.0)
//
// Orden físico de la cadena:
//   escena HDR → [obturador: rolling shutter + motion blur por píxel] → [lente: barril estereográfico, aberración
//   cromática lateral, blur radial, viñeta cos⁴, halación, velo, suciedad] → [sensor: exposición, recorte a blanco,
//   grading, negros] → [códec: submuestreo de croma, macrobloques, cuantización] → [ruido de sensor luma+croma]
//
// Defines (por nivel de calidad, ver QUALITY en postprocess.js):
//   USE_AO        0/1  compone el SSAO de ½ resolución
//   MB_N          nº de muestras del motion blur / aberración
//   MB_DEPTH      0/1  velocidad por píxel con profundidad (traslación + rotación); 0 = solo rotación
//   LENS_DIRT     0/1  textura de suciedad de lente que se enciende con las luces fuertes
//   USE_SSR       0/1  compone los reflejos de suelos mojados (render/ssr.js)
//   VOLUMETRIC    0/1  compone el pase de atmósfera (render/volumetric.js)
//   COMPRESSION   0/1  artefactos de códec (croma 4:2:0, macrobloques 8×8, cuantización en sombras)
export const finalFrag = (common) => /* glsl */ `
  precision highp float;
  uniform sampler2D tScene; uniform sampler2D tBloom; uniform sampler2D tBloomWide; uniform sampler2D tAdapt;
  uniform sampler2D tAO; uniform sampler2D tDepth; uniform sampler2D tDirt;
  uniform vec2 res; uniform vec2 aoRes; uniform float aspect; uniform float time; uniform float fisheye; uniform float grainAmt;
  uniform float fR; uniform float fO; uniform float rimR;
  uniform mat4 reproj; uniform mat4 reprojFull; uniform float mblur; uniform float flash; uniform float tinnitus;
  uniform float blackCrush; uniform float damage; uniform float expBias;
  uniform float aoAmt; uniform float bloomAmt; uniform float dbg; uniform float vmOcc;
  // v3.0
  uniform float chroma;        // aberración cromática lateral (1 = lente barata)
  uniform float vignette;      // viñeta natural cos⁴ + caída del borde
  uniform float halation;      // halo rojizo alrededor de las altas luces quemadas
  uniform float veil;          // velo (veiling glare): lavado lechoso al mirar a una luz fuerte
  uniform float lensDirt;      // suciedad/huellas en la lente
  uniform float compression;   // artefactos de códec
  uniform float rsAmt;         // rolling shutter
  uniform float shake;         // vibración de cámara (0..1) → micro-ondulación del rolling shutter
  uniform float breath;        // respiración de enfoque (escala ~1 ± 0.015)
  uniform float chromaGrain;   // ruido de croma
  uniform float satAmt;        // saturación global
  uniform float accent;        // cuánto conservan su color los rojos/cálidos (luz de emergencia, óxido)
  uniform float sensorGain;    // pendiente del sensor: >1 quema antes las altas luces
  uniform float sharpen; uniform float contrast;
  uniform sampler2D tVol; uniform vec3 hazeColor; uniform sampler2D tSSR;
  varying vec2 vUv;
  ${common}

  float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
  float hash21(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  // respuesta de sensor de vídeo: casi lineal en medios, hombro corto y RECORTE a blanco puro (cielo quemado)
  vec3 sensor(vec3 x){ x = max(x, 0.0); return min((1.0 - exp(-x * 1.75 * sensorGain)) / 0.95, 1.0); }

  // pantalla → plano de imagen rectilíneo (el render es más ancho que el encuadre: no hay píxeles vacíos)
  vec2 lens(vec2 uv, out float rho, out float th){
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * breath;
    rho = length(p);
    th = 2.0 * atan(rho / (2.0 * fO));                 // proyección estereográfica (barril real)
    float rs = fR * tan(min(th, 1.45));
    float rr = mix(rho, rs, fisheye);
    return p * (rr / max(rho, 1e-5));
  }

  void main(){
    // ── obturador: rolling shutter (las filas se leen en instantes distintos → la imagen se inclina al girar)
    vec4 prC = reproj * vec4(0.0, 0.0, 1.0, 1.0);
    vec2 velC = -(prC.xy / prC.w) * 0.5;               // velocidad angular en el centro (uv/frame)
    vec2 vuv = vUv;
    vuv.x += rsAmt * (clamp(velC.x, -0.05, 0.05) * 1.4 * (vUv.y - 0.5)
                    + shake * 0.0016 * sin(vUv.y * 41.0 + time * 67.0));

    // ── lente
    float rho, th;
    vec2 q = lens(vuv, rho, th);
    vec2 uvC = q / vec2(aspect, 1.0) + 0.5;
    float t = rho / rimR;                               // 1 = borde del círculo de imagen
    vec2 dir = q / max(length(q), 1e-4);
    vec2 dirUv = dir / vec2(aspect, 1.0);
    float edge2 = t * t;
    // aberración cromática lateral: ya visible en el tercio exterior y fuerte en el borde
    float ca = ((0.0020 + 0.0095 * fisheye) * (0.30 * edge2 + 0.70 * edge2 * edge2) + 0.0008) * chroma;
    float rad = 0.050 * fisheye * smoothstep(0.30, 1.0, t) * edge2;

    // ── motion blur
    vec2 ndc = uvC * 2.0 - 1.0;
    float dRaw = textureLod(tDepth, uvC, 0.0).r;
    float zc = linZ(dRaw);
    #if MB_DEPTH
      // velocidad por píxel: reproyección completa (rotación + traslación) con la profundidad de la escena.
      // El arma y los brazos (< 0.9 m) viajan con la cámara: velocidad 0.
      vec4 pr = reprojFull * vec4(ndc, dRaw * 2.0 - 1.0, 1.0);
      vec2 vel = (ndc - pr.xy / pr.w) * 0.5 * mblur * smoothstep(0.5, 0.9, zc);
    #else
      vec4 pr = reproj * vec4(ndc, 1.0, 1.0);
      vec2 vel = (ndc - pr.xy / pr.w) * 0.5 * mblur;
    #endif
    vel = clamp(vel, vec2(-0.04), vec2(0.04));
    float jit = ign(gl_FragCoord.xy) - 0.5;            // reparte las muestras: sin escalones visibles
    vec3 col = vec3(0.0);
    for (int i = 0; i < MB_N; i++) {
      float s = (float(i) + 0.5 + jit) / float(MB_N) - 0.5;
      vec2 o = vel * s + dirUv * (rad * s);
      col.r += texture2D(tScene, uvC + dirUv * ca + o).r;
      col.g += texture2D(tScene, uvC + o).g;
      col.b += texture2D(tScene, uvC - dirUv * ca + o).b;
    }
    col /= float(MB_N);
    // nitidez (bodycam sobre-afilada), se apaga en los bordes borrosos
    vec2 tx = 1.0 / res;
    vec3 nb = texture2D(tScene, uvC + vec2(tx.x,0.0)).rgb + texture2D(tScene, uvC - vec2(tx.x,0.0)).rgb + texture2D(tScene, uvC + vec2(0.0,tx.y)).rgb + texture2D(tScene, uvC - vec2(0.0,tx.y)).rgb;
    col = max(col + (col - nb * 0.25) * 0.45 * sharpen * (1.0 - smoothstep(0.4, 0.8, t)), 0.0);

    float exposure = texture2D(tAdapt, vec2(0.5)).g * expBias;

    // ── códec (1/2): croma 4:2:0 + macrobloques. Más fuerte con movimiento y en sombras (el bitrate no llega).
    #if COMPRESSION
    float mv = length(vel) * 55.0 + length(velC) * 18.0;
    {
      vec2 bsz = vec2(8.0) / res;
      vec2 buv = (floor(vuv / bsz) + 0.5) * bsz;
      float r2, t2; vec2 qb = lens(buv, r2, t2);
      vec2 uvB = qb / vec2(aspect, 1.0) + 0.5;
      vec2 o4 = bsz * 0.25;
      vec3 cb = 0.25 * (texture2D(tScene, uvB + o4).rgb + texture2D(tScene, uvB - o4).rgb
                      + texture2D(tScene, uvB + vec2(o4.x, -o4.y)).rgb + texture2D(tScene, uvB + vec2(-o4.x, o4.y)).rgb);
      float lc = luma(col), lb = luma(cb);
      float dark = 1.0 - smoothstep(0.0, 0.22, lc * exposure);
      float k = compression * clamp(0.10 + 0.45 * dark + mv, 0.0, 1.0);
      vec3 cc = cb * clamp(lc / max(lb, 1e-4), 0.0, 3.0);          // croma del bloque, luma propia
      col = mix(col, cc, min(1.0, k * 1.3));
      col = mix(col, cb, k * 0.40 * smoothstep(0.25, 1.0, mv + dark * 0.5));
    }
    #endif

    // arma/brazos (< 1 m): el cuerpo del jugador les tapa medio cielo → reciben ~la mitad de luz ambiente
    col *= mix(vmOcc, 1.0, smoothstep(0.55, 1.0, zc));
    // AO: upsample bilateral (4 texeles a ½ resolución comparando la distancia de vista)
    #if USE_AO
    {
      vec2 ap = uvC * aoRes - 0.5; vec2 f = fract(ap); vec2 b = (floor(ap) + 0.5) / aoRes; vec2 at = 1.0 / aoRes;
      vec2 a00 = textureLod(tAO, b, 0.0).rg, a10 = textureLod(tAO, b + vec2(at.x, 0.0), 0.0).rg;
      vec2 a01 = textureLod(tAO, b + vec2(0.0, at.y), 0.0).rg, a11 = textureLod(tAO, b + at, 0.0).rg;
      float tol = 0.05 * zc + 0.02;
      vec4 w = vec4((1.0 - f.x) * (1.0 - f.y), f.x * (1.0 - f.y), (1.0 - f.x) * f.y, f.x * f.y)
             * (vec4(1e-3) + max(vec4(0.0), 1.0 - abs(vec4(a00.g, a10.g, a01.g, a11.g) - zc) / tol));
      float ao = dot(w, vec4(a00.r, a10.r, a01.r, a11.r)) / dot(w, vec4(1.0));
      // la luz directa intensa recibe menos AO (aprox. de "solo indirecta")
      float le = luma(col) * exposure;
      col *= mix(1.0, ao, aoAmt * (1.0 - 0.45 * smoothstep(0.5, 1.6, le)));
      if (dbg > 0.5) { gl_FragColor = vec4(vec3(ao), 1.0); return; }
    }
    #endif
    // ── atmósfera: neblina con altura + luz dispersada por fluorescentes, balizas, linterna y huecos al cielo
    // reflejos en suelos mojados / charcos (render/ssr.js)
    #if USE_SSR
    {
      vec4 rf = texture2D(tSSR, uvC);
      col = mix(col, rf.rgb, rf.a);
    }
    #endif
    #if VOLUMETRIC
    {
      vec4 vol = texture2D(tVol, uvC);
      col = mix(col, hazeColor, vol.a) + vol.rgb;
    }
    #endif
    col *= exposure;

    // ── lente: luz dispersa. bloom (óptica) + halación (rojiza, capa del sensor) + velo + suciedad
    vec3 bl = texture2D(tBloom, uvC).rgb;
    vec3 wide = texture2D(tBloomWide, uvC).rgb;
    col += bl * bloomAmt;
    col += wide * vec3(1.0, 0.30, 0.16) * halation;
    col += wide * vec3(0.92, 0.97, 1.0) * veil;
    #if LENS_DIRT
    {
      vec3 dirt = texture2D(tDirt, vUv).rgb;
      col += dirt * (wide * 1.5 + bl * 0.35) * lensDirt;
    }
    #endif
    col += flash * vec3(6.0, 5.6, 5.0);

    // ── sensor
    col = sensor(col);
    // grading: desaturado y frío-neutro; sombras ligeramente azuladas; los rojos/cálidos conservan su acento
    float l = luma(col);
    float sat = (0.70 * satAmt - damage * 0.5) * (1.0 - 0.35 * smoothstep(0.55, 1.0, t));
    float warm = clamp((col.r - max(col.g, col.b)) * 3.5, 0.0, 1.0);
    sat = mix(sat, min(1.05, sat + 0.38), warm * accent);
    col = mix(vec3(l), col, sat);
    col *= mix(vec3(0.96, 0.995, 1.04), vec3(1.0), smoothstep(0.0, 0.45, l));
    col = mix(col, col * col * (3.0 - 2.0 * col), clamp(0.55 * contrast, 0.0, 1.0));       // leve S en medios
    // negros profundos: punto de negro bajado + pie de curva más hondo; las altas no se tocan
    {
      float bp = 0.022 * blackCrush;
      col = max(col - bp, 0.0) / (1.0 - bp);
      col = mix(col, col * col / (col + 0.045), 0.55 * blackCrush);
      // las sombras profundas conservan algo de color (barro, corteza) en vez de volverse gris plano
      float ls = luma(col);
      col = mix(col, mix(vec3(ls), col, 1.25), (1.0 - smoothstep(0.02, 0.25, ls)) * blackCrush * 0.6);
      col = max(col, 0.0);
    }
    // viñeta natural (cos⁴ del ángulo de campo) + caída del borde + círculo de imagen con franja cálida
    {
      float cv = cos(min(th * 0.58, 1.5)); cv *= cv;
      col *= mix(1.0, cv * cv, clamp(0.80 * vignette, 0.0, 1.0));
      col *= 1.0 - min(0.42 * vignette, 0.9) * pow(smoothstep(0.50, 1.0, t), 1.6);
    }
    float u = (t - 0.955) / 0.10;
    vec3 rim = vec3(1.0 - smoothstep(0.10, 0.55, u), 1.0 - smoothstep(-0.02, 0.40, u), 1.0 - smoothstep(-0.08, 0.30, u));
    float glow = exp(-pow((u - 0.18) / 0.22, 2.0));
    col = col * rim + glow * vec3(0.20, 0.075, 0.02) * (0.25 + min(dot(bl, vec3(0.33)), 1.5));
    vec2 oob = abs(uvC - 0.5);
    col *= 1.0 - smoothstep(0.495, 0.505, max(oob.x, oob.y));
    col *= 1.0 - damage * 0.3 * smoothstep(0.3, 0.9, t);
    col = mix(col, col * vec3(1.0, 0.4, 0.35), damage * smoothstep(0.4, 0.95, t));
    // tinnitus: lavado blanquecino leve
    col = mix(col, vec3(dot(col, vec3(0.33))), tinnitus * 0.6);
    vec3 o = pow(clamp(col, 0.0, 1.0), vec3(1.0 / 2.2));
    float lo = dot(o, vec3(0.333));
    float fr = fract(time * 7.31) * 64.0;

    // ── códec (2/2): bloques que "bailan" y bandas de cuantización en las sombras
    #if COMPRESSION
    {
      vec2 bid = floor(vUv * res / 8.0);
      float dk = 1.0 - smoothstep(0.0, 0.24, lo);
      float bn = hash21(bid + floor(time * 15.0) * 7.13) - 0.5;
      o += bn * 0.014 * compression * dk * (0.6 + min(mv, 1.0));
      float L = mix(56.0, 255.0, smoothstep(0.0, 0.30, lo));
      o = mix(o, floor(o * L + 0.5) / L, clamp(compression * 0.8 * dk, 0.0, 1.0));
    }
    #endif

    // ── ruido de sensor (temporal): luma fino + croma en manchas de 2 px; crece con la ganancia (escenas oscuras)
    float g = ign(gl_FragCoord.xy + vec2(fr * 5.588, fr * 3.11)) - 0.5;
    vec2 cp = floor(gl_FragCoord.xy * 0.5);
    float c1 = ign(cp + vec2(fr * 2.31, fr * 7.7)) - 0.5;
    float c2 = ign(cp.yx * 1.37 + vec2(fr * 4.9, fr * 1.9) + 31.0) - 0.5;
    float gain = mix(0.8, 1.9, smoothstep(0.7, 4.0, exposure));
    float amp = grainAmt * gain * (0.008 + 0.042 * (1.0 - smoothstep(0.0, 0.55, lo))) * (0.35 + 0.65 * smoothstep(0.0, 0.06, lo));
    o += g * amp + vec3(c1, -0.5 * (c1 + c2), c2) * amp * chromaGrain;
    gl_FragColor = vec4(o, 1.0);
  }`;

// Textura de suciedad de lente generada por código (sin assets): huellas, velos de grasa, motas de polvo y
// arañazos finos. Va en espacio de pantalla y solo se ve donde hay luz fuerte dispersa (bloom ancho).
export function makeLensDirtCanvas(w = 512, h = 288, seed = 7) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = "lighter";
  const blob = (x, y, r, a, col = [255, 250, 240]) => {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${a})`);
    gr.addColorStop(0.6, `rgba(${col[0]},${col[1]},${col[2]},${a * 0.35})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  };
  // velos de grasa grandes (más hacia los bordes)
  for (let i = 0; i < 26; i++) {
    const a = rnd() * 6.2832, d = 0.25 + rnd() * 0.75;
    blob(w / 2 + Math.cos(a) * d * w * 0.55, h / 2 + Math.sin(a) * d * h * 0.55, 30 + rnd() * 90, 0.035 + rnd() * 0.05);
  }
  // huellas: arcos concéntricos tenues
  for (let i = 0; i < 3; i++) {
    const cx = rnd() * w, cy = rnd() * h, r0 = 18 + rnd() * 30;
    g.lineWidth = 1.2;
    for (let k = 0; k < 14; k++) {
      g.strokeStyle = `rgba(255,250,240,${0.02 + rnd() * 0.035})`;
      g.beginPath(); g.ellipse(cx, cy, r0 + k * 3.2, (r0 + k * 3.2) * 0.72, 0.6, rnd() * 2, 2.5 + rnd() * 3); g.stroke();
    }
  }
  // barridos (pasar el dedo/tela)
  for (let i = 0; i < 9; i++) {
    const x = rnd() * w, y = rnd() * h, a = -0.5 + rnd(), L = 60 + rnd() * 160;
    g.lineWidth = 2 + rnd() * 7; g.lineCap = "round";
    g.strokeStyle = `rgba(255,248,235,${0.012 + rnd() * 0.022})`;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 + (rnd() - 0.5) * 30, x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  // motas de polvo y gotas secas
  for (let i = 0; i < 150; i++) {
    const r = 0.8 + rnd() * rnd() * 7;
    blob(rnd() * w, rnd() * h, r, 0.10 + rnd() * 0.30, [255, 244 + rnd() * 10, 225 + rnd() * 30]);
  }
  // arañazos finos
  for (let i = 0; i < 16; i++) {
    const x = rnd() * w, y = rnd() * h, a = rnd() * 6.2832, L = 8 + rnd() * 40;
    g.lineWidth = 0.6; g.strokeStyle = `rgba(255,255,255,${0.06 + rnd() * 0.10})`;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); g.stroke();
  }
  return c;
}
