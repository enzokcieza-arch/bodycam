// render/postprocess.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { D as nr, F as rr, H as v0, L as $a, N as Fo, O as ar, U as ir, a as Rt, b as Ai, c as Ti, g as ht, o as B, p as Ke, q as Lo, r as Qe, s as Eo, t as lr, u as Pi, x as en, y as ur } from "three-vendor";
import { a5 as CanvasTexture, v as Te } from "three-vendor";
import { finalFrag, makeLensDirtCanvas } from "./lens-shader.js";
import { volFrag, VOL_MAX_LIGHTS } from "./volumetric.js";
import { ssrFrag } from "./ssr.js";
import { temporalFrag } from "./temporal.js";
import { Vector3, Color } from "../three.js";

const Ur =
  "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }";
function ts(a, t, e) {
  return new Pi({
    vertexShader: Ur,
    fragmentShader: a,
    uniforms: t,
    defines: e || {},
    depthTest: !1,
    depthWrite: !1,
  });
}
const G0 = `
  uniform vec2 clipNF; uniform vec4 projInfo;
  float linZ(float d){ float zn = d * 2.0 - 1.0; return 2.0 * clipNF.x * clipNF.y / (clipNF.y + clipNF.x - zn * (clipNF.y - clipNF.x)); }
  vec3 viewPos(vec2 uv, float z){ return vec3((uv * 2.0 - 1.0 + projInfo.zw) * z / projInfo.xy, -z); }
  float ign(vec2 px){ return fract(52.9829189 * fract(dot(px, vec2(0.06711056, 0.00583715)))); }
`,
  Dr = 16;
class Er {
  constructor(t) {
    ((this.engine = t),
      (this.renderer = t.renderer),
      (this.quad = new ht(new Ke(2, 2))),
      (this.quad.frustumCulled = !1),
      (this.fsScene = new Ti()),
      this.fsScene.add(this.quad),
      (this.fsCam = new ar(-1, 1, 1, -1, 0, 1)),
      (this.params = {
        fisheye: 0.6,
        exposureBias: 1,
        grain: 1,
        motionBlur: 1,
        flash: 0,
        tinnitus: 0,
        damage: 0,
        ao: 1,
        bloom: 1,
        blackCrush: 0.65,
        ...LOOK_DEFAULTS,
      }),
      (this.prevVP = new B()),
      (this.prevVPFull = new B()),
      // datos de atmósfera: los rellena world/atmosphere.js cada frame
      (this.atmo = {
        enabled: !1,
        density: 0,
        lights: [],
        haze: 0,
        hazeHeight: 0.5,
        hazeFalloff: 0.55,
        hazeColor: new Color(0.5, 0.52, 0.55),
        sunDir: new Vector3(0.4, 0.8, 0.4),
        sunCol: new Vector3(1, 0.97, 0.92),
        godrays: 1,
        torch: null,
        ambient: 1,
      }),
      (this.sunUv = new Vector3()),
      (this.reprojFull = new B()),
      (this.reproj = new B()),
      (this.hasPrev = !1),
      (this.time = 0),
      (this.frame = 0),
      (this.snapAdapt = !0),
      (this.clipNF = new Rt(0.03, 400)),
      (this.projInfo = new Lo(1, 1, 0, 0)));
    const e = () => ({
      clipNF: { value: this.clipNF },
      projInfo: { value: this.projInfo },
    });
    ((this.aoMat = ts(
      `
      precision highp float;
      uniform sampler2D tDepth; uniform vec2 fullTexel; uniform vec2 aoRes;
      uniform float radius; uniform float intensity; uniform float pxScale; uniform float maxPx;
      varying vec2 vUv;
      ${G0}
      void main(){
        // todas las posiciones se reconstruyen en el CENTRO del texel de profundidad leído (si no, en superficies
        // rasantes el error de medio texel saca el punto del plano y aparece auto-oclusión en franjas)
        vec2 fullRes = 1.0 / fullTexel;
        vec2 uv0 = (floor(vUv * fullRes) + 0.5) * fullTexel;
        float d = textureLod(tDepth, uv0, 0.0).r;
        if (d >= 1.0) { gl_FragColor = vec4(1.0, 30000.0, 0.0, 1.0); return; }
        float z = linZ(d);
        vec3 P = viewPos(uv0, z);
        vec2 dx = vec2(fullTexel.x, 0.0), dy = vec2(0.0, fullTexel.y);
        vec3 pr = viewPos(uv0 + dx, linZ(textureLod(tDepth, uv0 + dx, 0.0).r));
        vec3 pl = viewPos(uv0 - dx, linZ(textureLod(tDepth, uv0 - dx, 0.0).r));
        vec3 pu = viewPos(uv0 + dy, linZ(textureLod(tDepth, uv0 + dy, 0.0).r));
        vec3 pd = viewPos(uv0 - dy, linZ(textureLod(tDepth, uv0 - dy, 0.0).r));
        vec3 ddx = abs(pr.z - P.z) < abs(P.z - pl.z) ? pr - P : P - pl;
        vec3 ddy = abs(pu.z - P.z) < abs(P.z - pd.z) ? pu - P : P - pd;
        vec3 n = normalize(cross(ddx, ddy));
        float rpx = min(radius * pxScale / z, maxPx);
        float ao = 1.0;
        if (rpx > 1.5) {
          // ruido entrelazado (IGN) estático en pantalla: sin parpadeo temporal; el blur 7×7 lo elimina
          float n1 = ign(gl_FragCoord.xy), n2 = ign(gl_FragCoord.yx + 17.0);
          float a0 = n1 * 6.2831853;
          vec2 dir = vec2(cos(a0), sin(a0));
          const float GA_C = -0.7373688, GA_S = 0.6754903;   // ángulo áureo (2.39996 rad)
          float r2 = radius * radius, sum = 0.0;
          for (int i = 0; i < SAMPLES; i++) {
            float a = (float(i) + n2) / float(SAMPLES);
            vec2 suv = (floor((uv0 + dir * (rpx * a) / aoRes) * fullRes) + 0.5) * fullTexel;
            vec3 S = viewPos(suv, linZ(textureLod(tDepth, suv, 0.0).r));
            vec3 v = S - P;
            float vv = dot(v, v), vn = dot(v, n);
            float f = max(r2 - vv, 0.0);
            sum += f * f * f * max((vn - 0.012 * z - 0.01) / (0.02 + vv), 0.0);
            dir = vec2(dir.x * GA_C - dir.y * GA_S, dir.x * GA_S + dir.y * GA_C);
          }
          ao = max(0.0, 1.0 - sum * intensity / (r2 * r2 * r2) * (5.0 / float(SAMPLES)));
          // sin AO en el arma/brazos (z < 1 m) ni a lo lejos
          ao = mix(1.0, ao, smoothstep(0.55, 1.0, z) * (1.0 - smoothstep(45.0, 90.0, z)));
        }
        gl_FragColor = vec4(ao, z, 0.0, 1.0);
      }`,
      {
        tDepth: { value: null },
        fullTexel: { value: new Rt() },
        aoRes: { value: new Rt() },
        radius: { value: 0.75 },
        intensity: { value: 1.6 },
        pxScale: { value: 1 },
        maxPx: { value: 60 },
        ...e(),
      },
      { SAMPLES: 12 },
    )),
      (this.aoBlurMat = ts(
        `
      precision highp float;
      uniform sampler2D tAO; uniform vec2 dir; varying vec2 vUv;
      void main(){
        vec2 c = textureLod(tAO, vUv, 0.0).rg;
        float tol = 0.04 * c.g + 0.03;
        float s = c.r, w = 1.0;
        for (int i = 1; i <= 3; i++) {
          float g = exp(-float(i * i) / 8.0);
          vec2 a = textureLod(tAO, vUv + dir * float(i), 0.0).rg;
          vec2 b = textureLod(tAO, vUv - dir * float(i), 0.0).rg;
          float wa = g * max(0.0, 1.0 - abs(a.g - c.g) / tol), wb = g * max(0.0, 1.0 - abs(b.g - c.g) / tol);
          s += a.r * wa + b.r * wb; w += wa + wb;
        }
        gl_FragColor = vec4(s / w, c.g, 0.0, 1.0);
      }`,
        { tAO: { value: null }, dir: { value: new Rt() } },
      )),
      (this.lumMat = ts(
        `
      precision highp float;
      uniform sampler2D tScene; uniform sampler2D tDepth; uniform vec2 cell; varying vec2 vUv;
      ${G0}
      void main(){
        vec3 c = texture2D(tScene, vUv + cell * vec2(-0.25, -0.25)).rgb + texture2D(tScene, vUv + cell * vec2(0.25, -0.25)).rgb
               + texture2D(tScene, vUv + cell * vec2(-0.25, 0.25)).rgb + texture2D(tScene, vUv + cell * vec2(0.25, 0.25)).rgb;
        float l = dot(c * 0.25, vec3(0.2126, 0.7152, 0.0722));
        float d = textureLod(tDepth, vUv, 0.0).r;
        float w = d >= 1.0 ? 0.12 : mix(0.15, 1.0, smoothstep(0.6, 1.4, linZ(d)));
        vec2 p = vUv - 0.5; w *= 1.0 - 1.4 * dot(p, p);
        gl_FragColor = vec4(log(clamp(l, 1e-4, 64.0)) * w, w, 0.0, 1.0);
      }`,
        {
          tScene: { value: null },
          tDepth: { value: null },
          cell: { value: new Rt(1 / 64, 1 / 64) },
          ...e(),
        },
      )),
      (this.adaptMat = ts(
        `
      precision highp float;
      uniform sampler2D tLum; uniform sampler2D tPrev; uniform float dt; uniform float lod; uniform float snap;
      uniform float key; uniform vec2 expRange; varying vec2 vUv;
      void main(){
        vec2 m = textureLod(tLum, vec2(0.5), lod).rg;
        float cur = log(max(exp(m.r / max(m.g, 1e-4)), 1e-4));
        float prev = texture2D(tPrev, vec2(0.5)).r;
        if (snap > 0.5 || prev != prev || prev < -20.0 || prev > 20.0) prev = cur;
        float speed = cur > prev ? 2.2 : 1.1;      // a la luz más rápido que a la sombra (como una bodycam real)
        float a = prev + (cur - prev) * (1.0 - exp(-dt * speed));
        float e = clamp(key / exp(a), expRange.x, expRange.y);
        gl_FragColor = vec4(a, e, 0.0, 1.0);
      }`,
        {
          tLum: { value: null },
          tPrev: { value: null },
          dt: { value: 0.016 },
          lod: { value: 6 },
          snap: { value: 1 },
          key: { value: 0.21 },
          expRange: { value: new Rt(0.25, 3.4) },
        },
      )),
      (this.brightMat = ts(
        `
      precision highp float;
      uniform sampler2D tScene; uniform sampler2D tAdapt; uniform vec2 texel; uniform float threshold; varying vec2 vUv;
      void main(){ vec3 c = texture2D(tScene, vUv + texel*vec2(-1.0,-1.0)).rgb + texture2D(tScene, vUv + texel*vec2(1.0,-1.0)).rgb
        + texture2D(tScene, vUv + texel*vec2(-1.0,1.0)).rgb + texture2D(tScene, vUv + texel*vec2(1.0,1.0)).rgb;
        c *= 0.25 * texture2D(tAdapt, vec2(0.5)).g;            // en unidades expuestas
        float l = max(c.r, max(c.g, c.b));
        const float K = 0.35;                                   // rodilla suave
        float s = clamp(l - threshold + K, 0.0, 2.0 * K); s = s * s / (4.0 * K);
        float k = max(s, l - threshold) / max(l, 1e-4);
        gl_FragColor = vec4(min(c * k, vec3(24.0)), 1.0); }`,
        {
          tScene: { value: null },
          tAdapt: { value: null },
          texel: { value: new Rt() },
          threshold: { value: 1 },
        },
      )),
      (this.downMat = ts(
        `uniform sampler2D tSrc; uniform vec2 texel; varying vec2 vUv;
      void main(){ vec3 s = texture2D(tSrc, vUv).rgb * 4.0;
        s += texture2D(tSrc, vUv + texel*vec2(-1.0,-1.0)).rgb + texture2D(tSrc, vUv + texel*vec2(1.0,-1.0)).rgb
          + texture2D(tSrc, vUv + texel*vec2(-1.0,1.0)).rgb + texture2D(tSrc, vUv + texel*vec2(1.0,1.0)).rgb;
        gl_FragColor = vec4(s / 8.0, 1.0); }`,
        { tSrc: { value: null }, texel: { value: new Rt() } },
      )),
      (this.upMat = ts(
        `uniform sampler2D tSrc; uniform sampler2D tBase; uniform vec2 texel; varying vec2 vUv;
      void main(){ vec3 s = texture2D(tSrc, vUv + texel*vec2(-2.0,0.0)).rgb + texture2D(tSrc, vUv + texel*vec2(2.0,0.0)).rgb
        + texture2D(tSrc, vUv + texel*vec2(0.0,-2.0)).rgb + texture2D(tSrc, vUv + texel*vec2(0.0,2.0)).rgb;
        s += (texture2D(tSrc, vUv + texel*vec2(-1.0,-1.0)).rgb + texture2D(tSrc, vUv + texel*vec2(1.0,-1.0)).rgb
          + texture2D(tSrc, vUv + texel*vec2(-1.0,1.0)).rgb + texture2D(tSrc, vUv + texel*vec2(1.0,1.0)).rgb) * 2.0;
        gl_FragColor = vec4(s / 12.0 + texture2D(tBase, vUv).rgb, 1.0); }`,
        {
          tSrc: { value: null },
          tBase: { value: null },
          texel: { value: new Rt() },
        },
      )),
      (this.projWide = new B()),
      (this.taaMat = ts(
        temporalFrag(G0),
        {
          tCur: { value: null },
          tHist: { value: null },
          tDepth: { value: null },
          reprojFull: { value: this.reprojFull },
          texel: { value: new Rt() },
          blend: { value: 0.88 },
          valid: { value: 0 },
          ...e(),
        },
      )),
      (this.ssrMat = ts(
        ssrFrag(G0),
        {
          tColor: { value: null },
          tDepth: { value: null },
          projWide: { value: this.projWide },
          upView: { value: new Vector3(0, 1, 0) },
          time: { value: 0 },
          strength: { value: 1 },
          ...e(),
        },
        { SSR_STEPS: 24 },
      )),
      (this.volMat = ts(
        volFrag(G0),
        {
          tDepth: { value: null },
          lPos: { value: Array.from({ length: VOL_MAX_LIGHTS }, () => new Vector3()) },
          lCol: { value: Array.from({ length: VOL_MAX_LIGHTS }, () => new Vector3()) },
          lRange: { value: new Array(VOL_MAX_LIGHTS).fill(1) },
          density: { value: 0 },
          torchPos: { value: new Vector3() },
          torchDir: { value: new Vector3(0, 0, -1) },
          torchCol: { value: new Vector3() },
          torchCone: { value: new Rt(0.8, 0.95) },
          sunUv: { value: this.sunUv },
          sunCol: { value: new Vector3(1, 1, 1) },
          godrays: { value: 0 },
          upView: { value: new Vector3(0, 1, 0) },
          camY: { value: 0 },
          hazeParams: { value: new Vector3(0, 0, 1) },
          time: { value: 0 },
          ...e(),
        },
        { VOL_LIGHTS: 4, VOL_TORCH: 1, VOL_GODRAYS: 1, VOL_STEPS: 8 },
      )),
      (this.finalMat = ts(
        finalFrag(G0),
        {
          tScene: { value: null },
          tBloom: { value: null },
          tAdapt: { value: null },
          tAO: { value: null },
          tDepth: { value: null },
          res: { value: new Rt() },
          aoRes: { value: new Rt(1, 1) },
          aspect: { value: 1 },
          time: { value: 0 },
          fisheye: { value: 0.6 },
          grainAmt: { value: 1 },
          reproj: { value: new B() },
          mblur: { value: 1 },
          fR: { value: 0.6 },
          fO: { value: 0.7 },
          rimR: { value: 1 },
          flash: { value: 0 },
          tinnitus: { value: 0 },
          blackCrush: { value: 0.65 },
          damage: { value: 0 },
          expBias: { value: 1 },
          aoAmt: { value: 1 },
          bloomAmt: { value: 0.16 },
          dbg: { value: 0 },
          vmOcc: { value: 0.5 },
          tBloomWide: { value: null },
          tVol: { value: null },
          tSSR: { value: null },
          hazeColor: { value: new Color() },
          tDirt: { value: null },
          reprojFull: { value: new B() },
          chroma: { value: 1 },
          vignette: { value: 1 },
          halation: { value: 0 },
          veil: { value: 0 },
          lensDirt: { value: 0 },
          compression: { value: 0 },
          rsAmt: { value: 0 },
          shake: { value: 0 },
          breath: { value: 1 },
          chromaGrain: { value: 0.8 },
          satAmt: { value: 1 },
          accent: { value: 1 },
          sensorGain: { value: 1 },
          sharpen: { value: 1 },
          contrast: { value: 1 },
          ...e(),
        },
        { USE_AO: 0, MB_N: 6, MB_DEPTH: 0, LENS_DIRT: 0, COMPRESSION: 0, VOLUMETRIC: 0, USE_SSR: 0 },
      )),
      this.rebuild());
  }
  rebuild() {
    const t = this.engine.quality;
    this.dispose();
    const e = { type: v0, minFilter: Eo, magFilter: Eo, depthBuffer: !1 },
      o = new nr(4, 4, ir);
    ((this.sceneRT = new Qe(4, 4, {
      type: v0,
      samples: t.msaa,
      depthBuffer: !0,
      depthTexture: o,
    })),
      (this.lumRT = new Qe(64, 64, {
        ...e,
        generateMipmaps: !0,
        minFilter: $a,
      })));
    const s = { ...e, type: rr, minFilter: Fo, magFilter: Fo };
    ((this.adaptRT = [new Qe(1, 1, s), new Qe(1, 1, s)]),
      (this.adaptIdx = 0),
      (this.snapAdapt = !0),
      (this.down = []),
      (this.up = []));
    for (let n = 0; n < t.bloomLevels; n++)
      (this.down.push(new Qe(4, 4, e)), this.up.push(new Qe(4, 4, e)));
    if (
      ((this.ssao = !!t.ssao),
      (this.aoRT = null),
      (this.aoRT2 = null),
      this.ssao)
    ) {
      const n = {
        type: v0,
        format: lr,
        minFilter: Fo,
        magFilter: Fo,
        depthBuffer: !1,
      };
      ((this.aoRT = new Qe(4, 4, n)),
        (this.aoRT2 = new Qe(4, 4, n)),
        (this.aoMat.defines.SAMPLES = t.ssaoSamples || 12),
        (this.aoMat.needsUpdate = !0));
    }
    const i = this.ssao ? 1 : 0;
    this.ssrRT = null;
    if (t.ssr) {
      this.ssrRT = new Qe(4, 4, { type: v0, minFilter: Eo, magFilter: Eo, depthBuffer: !1 });
      this.ssrHist = [this.ssrRT.clone(), this.ssrRT.clone()];
      this.ssrMat.defines.SSR_STEPS = t.ssrSteps || 24;
      this.ssrMat.needsUpdate = !0;
    }
    this.volRT = null;
    if (t.volumetric) {
      this.volRT = new Qe(4, 4, { type: v0, minFilter: Eo, magFilter: Eo, depthBuffer: !1 });
      this.volHist = [this.volRT.clone(), this.volRT.clone()];
      const vd = this.volMat.defines;
      vd.VOL_LIGHTS = Math.min(t.pointLights, VOL_MAX_LIGHTS);
      vd.VOL_TORCH = 1;
      vd.VOL_GODRAYS = t.godrays ? 1 : 0;
      vd.VOL_STEPS = t.volSteps || 8;
      this.volMat.needsUpdate = !0;
    }
    this.syncDefines();
    if (t.lensDirt && !this.dirtTex) {
      this.dirtTex = new CanvasTexture(makeLensDirtCanvas());
      this.dirtTex.colorSpace = Te;
      this.dirtTex.generateMipmaps = !1;
      this.dirtTex.minFilter = this.dirtTex.magFilter = Eo;
    }
    this.w && this.setSize(this.w, this.h);
  }
  // defines del pase final = calidad ∧ parámetro > 0 (un efecto a 0 no cuesta nada: así "medir coste" es real)
  syncDefines() {
    const t = this.engine.quality,
      p = this.params,
      fd = this.finalMat.defines,
      nd = {
        USE_AO: this.ssao && (p.ao ?? 1) > 0 ? 1 : 0,
        MB_N: (p.motionBlurAmt ?? 1) > 0 ? t.mbSamples || 6 : 3,
        MB_DEPTH: t.mbDepth ? 1 : 0,
        LENS_DIRT: t.lensDirt && p.lensDirt > 0 ? 1 : 0,
        COMPRESSION: t.compression && p.compression > 0 ? 1 : 0,
        VOLUMETRIC: this.volRT && this.atmo.enabled ? 1 : 0,
        USE_SSR: this.ssrRT && (p.reflections ?? 1) > 0 ? 1 : 0,
      };
    for (const k in nd)
      fd[k] !== nd[k] && ((fd[k] = nd[k]), (this.finalMat.needsUpdate = !0));
  }
  dispose() {
    for (const t of [
      this.sceneRT,
      this.lumRT,
      this.aoRT,
      this.aoRT2,
      this.volRT,
      this.ssrRT,
      ...(this.ssrHist || []),
      ...(this.volHist || []),
      ...(this.adaptRT || []),
      ...(this.down || []),
      ...(this.up || []),
    ])
      t && (t.depthTexture?.dispose(), t.dispose());
  }
  setSize(t, e) {
    ((this.w = t), (this.h = e), this.sceneRT.setSize(t, e));
    let o = Math.max(1, t >> 1),
      s = Math.max(1, e >> 1);
    for (let i = 0; i < this.down.length; i++)
      (this.down[i].setSize(o, s),
        this.up[i].setSize(o, s),
        (o = Math.max(1, o >> 1)),
        (s = Math.max(1, s >> 1)));
    if (this.aoRT) {
      const i = this.engine.quality.ssaoScale || 0.5,
        n = Math.max(1, Math.round(t * i)),
        r = Math.max(1, Math.round(e * i));
      (this.aoRT.setSize(n, r), this.aoRT2.setSize(n, r));
    }
    for (const r of [this.volRT, this.ssrRT, ...(this.volHist || []), ...(this.ssrHist || [])]) r && r.setSize(Math.max(1, t >> 1), Math.max(1, e >> 1));
    this.histValid = 0;
    this.resizeCount = (this.resizeCount || 0) + 1;
  }
  // v3.0: exposición nocturna de bodycam (luminancia objetivo baja y más ganancia máxima → oscuro con grano)
  setNight(N) {
    this.adaptMat.uniforms.key.value = N.key;
    this.adaptMat.uniforms.expRange.value.set(0.25, N.maxExp);
    this.atmo.sunCol.set(0.35, 0.42, 0.6).multiplyScalar(N.moon);
    this.night = N;
    // de día el cuerpo le tapa medio cielo al arma (×0.4); de noche la luz viene de la linterna y las luces locales
    this.params.viewmodelOcclusion = 0.85;
  }
  // acumulación temporal de un buffer ruidoso (ver render/temporal.js); devuelve la textura resuelta
  temporal(cur, hist, depth, key) {
    if (!hist || (this.params.temporal ?? 1) <= 0) return cur.texture;
    this._ti = this._ti || {};
    const i = (this._ti[key] = 1 - (this._ti[key] || 0));
    const T = this.taaMat.uniforms;
    T.tCur.value = cur.texture;
    T.tHist.value = hist[1 - i].texture;
    T.tDepth.value = depth;
    T.texel.value.set(1 / cur.width, 1 / cur.height);
    T.valid.value = (this.histValid & (key === "vol" ? 1 : 2)) ? 1 : 0;
    this.histValid |= key === "vol" ? 1 : 2;
    this.pass(this.taaMat, hist[i]);
    return hist[i].texture;
  }
  resetAdaptation() {
    this.snapAdapt = !0;
    this.histValid = 0;   // teletransporte/cambio brusco: no reutilizar historia temporal
  }
  pass(t, e) {
    ((this.quad.material = t),
      this.renderer.setRenderTarget(e),
      this.renderer.render(this.fsScene, this.fsCam));
  }
  render(t, e, o) {
    const s = this.renderer,
      i = this.params,
      n = this.engine.quality;
    ((this.time += o), this.frame++);
    const r = Math.min(1, Math.max(0, i.fisheye)),
      l = e.fov,
      u = e.isPerspectiveCamera ? Dr * r : 0;
    (u > 0 && ((e.fov = l + u), e.updateProjectionMatrix()),
      s.setRenderTarget(this.sceneRT),
      s.render(t, e));
    const b0 = this.finalMat.uniforms;
    const h = this.sceneRT.texture,
      c = this.sceneRT.depthTexture,
      d = e.projectionMatrix.elements;
    (this.projInfo.set(d[0], d[5], d[8], d[9]), this.clipNF.set(e.near, e.far));
    this.projWide.copy(e.projectionMatrix);
    const p = Wr.multiplyMatrices(
      e.projectionMatrix,
      qr.extractRotation(e.matrixWorldInverse),
    );
    (this.hasPrev
      ? this.reproj.multiplyMatrices(this.prevVP, $r.copy(p).invert())
      : this.reproj.identity(),
      this.prevVP.copy(p));
    const pf = WrF.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse);
    (this.hasPrev
      ? this.reprojFull.multiplyMatrices(this.prevVPFull, $rF.copy(pf).invert())
      : this.reprojFull.identity(),
      this.prevVPFull.copy(pf),
      (this.hasPrev = !0));
    {
      const sv = _v3.copy(this.atmo.sunDir).multiplyScalar(1e4).add(e.position).applyMatrix4(e.matrixWorldInverse);
      if (sv.z < 0) {
        sv.applyMatrix4(e.projectionMatrix);
        const m = Math.max(Math.abs(sv.x), Math.abs(sv.y));
        this.sunUv.set(sv.x * 0.5 + 0.5, sv.y * 0.5 + 0.5, 1 - Math.min(1, Math.max(0, (m - 1.2) / 0.8)));
      } else this.sunUv.set(0.5, 0.5, 0);
    }
    const f = Ai.degToRad(e.isPerspectiveCamera ? e.fov : 70);
    this.syncDefines();
    if ((u > 0 && ((e.fov = l), e.updateProjectionMatrix()), this.ssao && (i.ao ?? 1) > 0)) {
      const z = this.aoMat.uniforms,
        R = this.aoRT.width,
        k = this.aoRT.height;
      ((z.tDepth.value = c),
        z.fullTexel.value.set(1 / this.w, 1 / this.h),
        z.aoRes.value.set(R, k),
        (z.pxScale.value = d[5] * 0.5 * k),
        (z.maxPx.value = k * 0.12),
        this.pass(this.aoMat, this.aoRT));
      const C = this.aoBlurMat.uniforms;
      ((C.tAO.value = this.aoRT.texture),
        C.dir.value.set(1 / R, 0),
        this.pass(this.aoBlurMat, this.aoRT2),
        (C.tAO.value = this.aoRT2.texture),
        C.dir.value.set(0, 1 / k),
        this.pass(this.aoBlurMat, this.aoRT));
    }
    if (this.ssrRT && (i.reflections ?? 1) > 0) {
      const S = this.ssrMat.uniforms;
      S.tColor.value = h;
      S.tDepth.value = c;
      S.upView.value.set(0, 1, 0).transformDirection(e.matrixWorldInverse);
      S.time.value = this.time;
      S.strength.value = i.reflections ?? 1;
      this.pass(this.ssrMat, this.ssrRT);
      b0.tSSR.value = this.temporal(this.ssrRT, this.ssrHist, c, "ssr");
    }
    if (this.volRT && this.atmo.enabled) {
      const A = this.atmo, V = this.volMat.uniforms, vi = e.matrixWorldInverse;
      let n = 0;
      const maxL = this.volMat.defines.VOL_LIGHTS;
      for (const L of A.lights) {
        if (n >= maxL) break;
        if (!(L.intensity > 0.01)) continue;
        V.lPos.value[n].copy(L.position).applyMatrix4(vi);
        V.lCol.value[n].set(L.color.r, L.color.g, L.color.b).multiplyScalar(L.intensity);
        V.lRange.value[n] = L.distance || 8;
        n++;
      }
      for (; n < maxL; n++) V.lCol.value[n].set(0, 0, 0);
      V.density.value = A.density;
      if (A.torch) {
        const T = A.torch;
        T.getWorldPosition(V.torchPos.value);
        T.target.getWorldPosition(_v3);
        V.torchDir.value.copy(_v3).sub(V.torchPos.value).normalize().transformDirection(vi);
        V.torchPos.value.applyMatrix4(vi);
        V.torchCol.value.set(T.color.r, T.color.g, T.color.b).multiplyScalar(T.intensity * 0.025);
        V.torchCone.value.set(Math.cos(T.angle), Math.cos(T.angle * (1 - T.penumbra)));
      } else V.torchCol.value.set(0, 0, 0);
      V.sunCol.value.copy(A.sunCol);
      V.godrays.value = 0.5 * A.godrays * (i.godrays ?? 1) * A.density * 12;
      V.upView.value.set(0, 1, 0).transformDirection(vi);
      V.camY.value = e.position.y;
      V.hazeParams.value.set(A.haze, A.hazeHeight, A.hazeFalloff);
      V.time.value = this.time;
      V.tDepth.value = c;
      this.pass(this.volMat, this.volRT);
      b0.tVol.value = this.temporal(this.volRT, this.volHist, c, "vol");
      b0.hazeColor.value.copy(A.hazeColor);
    }
    ((this.lumMat.uniforms.tScene.value = h),
      (this.lumMat.uniforms.tDepth.value = c),
      this.pass(this.lumMat, this.lumRT));
    const g = this.adaptRT[this.adaptIdx],
      m = this.adaptRT[1 - this.adaptIdx],
      w = this.adaptMat.uniforms;
    ((w.tLum.value = this.lumRT.texture),
      (w.tPrev.value = g.texture),
      (w.dt.value = Math.min(o, 0.1)),
      (w.snap.value = this.snapAdapt ? 1 : 0),
      (this.snapAdapt = !1),
      this.pass(this.adaptMat, m),
      (this.adaptIdx = 1 - this.adaptIdx));
    const y = this.down.length;
    ((this.brightMat.uniforms.tScene.value = h),
      (this.brightMat.uniforms.tAdapt.value = m.texture),
      this.brightMat.uniforms.texel.value.set(1 / this.w, 1 / this.h),
      this.pass(this.brightMat, this.down[0]));
    for (let z = 1; z < y; z++)
      ((this.downMat.uniforms.tSrc.value = this.down[z - 1].texture),
        this.downMat.uniforms.texel.value.set(
          1 / this.down[z - 1].width,
          1 / this.down[z - 1].height,
        ),
        this.pass(this.downMat, this.down[z]));
    let x = this.down[y - 1];
    for (let z = y - 2; z >= 0; z--)
      ((this.upMat.uniforms.tSrc.value = x.texture),
        (this.upMat.uniforms.tBase.value = this.down[z].texture),
        this.upMat.uniforms.texel.value.set(1 / x.width, 1 / x.height),
        this.pass(this.upMat, this.up[z]),
        (x = this.up[z]));
    const b = this.finalMat.uniforms,
      v = this.w / this.h,
      M = 0.5 / Math.tan(f / 2),
      _ = v / 2,
      S = Math.atan(_ / M),
      T = _ / (2 * Math.tan(S / 2)),
      A = Math.sqrt(_ * _ + 0.25);
    ((b.fR.value = M),
      (b.fO.value = T),
      (b.rimR.value = A * (1.12 - 0.33 * r)),
      (b.tScene.value = h),
      (b.tBloom.value = x.texture),
      (b.tAdapt.value = m.texture),
      (b.tDepth.value = c),
      this.ssao &&
        ((b.tAO.value = this.aoRT.texture),
        b.aoRes.value.set(this.aoRT.width, this.aoRT.height)),
      (b.aoAmt.value = i.ao ?? 1),
      (b.dbg.value = i.debug || 0),
      (b.vmOcc.value = i.viewmodelOcclusion ?? 0.4),
      (b.bloomAmt.value = 0.11 * (i.bloom ?? 1)),
      b.res.value.set(this.w, this.h),
      (b.aspect.value = v),
      (b.time.value = this.time),
      (b.fisheye.value = r),
      (b.grainAmt.value = i.grain),
      b.reproj.value.copy(this.reproj),
      (b.mblur.value = n.motionBlur ? i.motionBlur * (i.motionBlurAmt ?? 1) : 0),
      (b.flash.value = i.flash),
      (b.tinnitus.value = i.tinnitus),
      (b.blackCrush.value = i.blackCrush ?? 0.65),
      (b.damage.value = i.damage),
      (b.expBias.value = i.exposureBias * (i.exposureComp ?? 1)),
      (b.tBloomWide.value = this.down[y - 1].texture),
      (b.tDirt.value = this.dirtTex || null),
      b.reprojFull.value.copy(this.reprojFull),
      (b.chroma.value = i.chroma),
      (b.vignette.value = i.vignette),
      (b.halation.value = 0.035 * i.halation),
      (b.veil.value = 0.012 * i.veil),
      (b.lensDirt.value = 0.3 * i.lensDirt),
      (b.compression.value = i.compression),
      (b.rsAmt.value = i.rollingShutter),
      (b.shake.value = i.shake || 0),
      (b.breath.value = i.breath || 1),
      (b.chromaGrain.value = i.chromaGrain),
      (b.satAmt.value = i.saturation),
      (b.accent.value = i.accent),
      (b.sensorGain.value = i.sensorGain),
      (b.sharpen.value = i.sharpen),
      (b.contrast.value = i.contrast),
      this.pass(this.finalMat, null));
  }
}
const _v3 = new Vector3();
const WrF = new B(),
  $rF = new B();
// Parámetros de look v3.0 (ajustables en vivo en el panel F3 → LOOK; se guardan en localStorage)
const LOOK_DEFAULTS = {
  chroma: 1.3,
  vignette: 1,
  halation: 1,
  veil: 1,
  lensDirt: 1,
  compression: 0.35,
  rollingShutter: 1,
  chromaGrain: 0.8,
  saturation: 1.25,
  accent: 1,
  sensorGain: 1.15,
  sharpen: 1,
  contrast: 1,
  reflections: 1,
  exposureComp: 1,
  motionBlurAmt: 1,
};
const Wr = new B(),
  qr = new B(),
  $r = new B(),
  nn = {
    low: {
      name: "Baja",
      scale: 0.75,
      maxDpr: 1,
      msaa: 0,
      shadow: 1024,
      bloomLevels: 3,
      pointLights: 2,
      dressDist: { forestDist: 26, smallDist: 14, bigDist: 40 },
      night: { beacons: 8, exits: 4, flares: 6 },
      vegetation: 0.4,
      aniso: 2,
      motionBlur: !1,
      shadowType: ur,
      ssao: !1,
      ssaoScale: 0.5,
      ssaoSamples: 0,
      mbSamples: 4,
      mbDepth: !1,
      lensDirt: !1,
      compression: !1,
      volumetric: !1,
      godrays: !1,
      ssr: !1,
      ssrSteps: 0,
      volSteps: 0,
      dust: 0,
      clutter: 0.5,
      forest: 0.4,
      torchShadow: !1,
    },
    medium: {
      name: "Media",
      scale: 1,
      maxDpr: 1,
      msaa: 4,
      shadow: 2048,
      bloomLevels: 4,
      pointLights: 4,
      dressDist: { forestDist: 40, smallDist: 22, bigDist: 55 },
      night: { beacons: 14, exits: 6, flares: 10 },
      vegetation: 1,
      aniso: 4,
      motionBlur: !0,
      shadowType: en,
      ssao: !0,
      ssaoScale: 0.5,
      ssaoSamples: 10,
      mbSamples: 6,
      mbDepth: !0,
      lensDirt: !0,
      compression: !0,
      volumetric: !0,
      godrays: !0,
      volSteps: 14,
      ssr: !0,
      ssrSteps: 24,
      dust: 450,
      clutter: 1,
      forest: 1,
      autoGraffiti: 45,
      torchShadow: !1,
    },
    high: {
      name: "Alta",
      scale: 1,
      maxDpr: 1.5,
      msaa: 4,
      shadow: 4096,
      bloomLevels: 5,
      pointLights: 6,
      dressDist: { forestDist: 60, smallDist: 32, bigDist: 80 },
      night: { beacons: 18, exits: 8, flares: 14 },
      vegetation: 1.5,
      aniso: 8,
      motionBlur: !0,
      shadowType: en,
      ssao: !0,
      ssaoScale: 0.5,
      ssaoSamples: 16,
      mbSamples: 10,
      mbDepth: !0,
      lensDirt: !0,
      compression: !0,
      volumetric: !0,
      godrays: !0,
      volSteps: 20,
      ssr: !0,
      ssrSteps: 40,
      dust: 1100,
      clutter: 1.3,
      forest: 1.6,
      autoGraffiti: 80,
      torchShadow: !0,
    },
  };

export { LOOK_DEFAULTS, Er, nn };
