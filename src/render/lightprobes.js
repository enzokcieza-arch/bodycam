// render/lightprobes.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { H as v0, N as Fo, V as P, aC as M0, aD as on, aE as Rr, aF as Or, aG as an, ac as Vi, aq as Li, i as xo, s as Eo } from "three-vendor";
import { $s, Ea } from "../audio/audio.js";

class F0 {
  constructor(t, e, o) {
    ((this.header = t),
      (this.dims = t.dims),
      (this.origin = t.origin),
      (this.spacing = t.spacing),
      (this.distMax = t.distMax),
      (this.sh = e),
      (this.vis = o),
      (this.skySH = t.skySH),
      (this.textures = null),
      (this.uniforms = null),
      (this.patched = new Set()));
  }
  static async load(t) {
    const e = await fetch(t);
    if (!e.ok) throw new Error("probes no encontrados: " + t);
    return F0.parse(await e.arrayBuffer());
  }
  static parse(t) {
    const o = new DataView(t).getUint32(0, !0),
      s = JSON.parse(new TextDecoder().decode(new Uint8Array(t, 4, o)));
    let i = (4 + o + 3) & -4;
    const n = s.dims[0] * s.dims[1] * s.dims[2],
      r = new Uint16Array(t, i, n * 12);
    i += n * 24;
    const l = new Uint16Array(t, i, n * 4),
      u = new Float32Array(n * 12);
    for (let c = 0; c < u.length; c++) u[c] = M0.fromHalfFloat(r[c]);
    const h = new F0(s, u, l);
    return ((h.halfSH = r), h);
  }
  static serialize(t, e, o) {
    const s = new TextEncoder().encode(JSON.stringify(t)),
      i = (4 + s.length + 3) & -4,
      n = t.dims[0] * t.dims[1] * t.dims[2],
      r = new ArrayBuffer(i + n * 24 + n * 8);
    (new DataView(r).setUint32(0, s.length, !0),
      new Uint8Array(r, 4, s.length).set(s));
    const l = new Uint16Array(r, i, n * 12);
    for (let u = 0; u < l.length; u++)
      l[u] = M0.toHalfFloat(Math.max(-65e3, Math.min(65e3, e[u])));
    return (new Uint16Array(r, i + n * 24, n * 4).set(o), r);
  }
  sampleAt(t, e, o) {
    const [s, i, n] = this.dims,
      [r, l, u] = this.spacing,
      h = this.origin,
      c = e ? 0.15 : 0,
      d = t.x + (e ? e.x * c : 0),
      p = t.y + (e ? e.y * c : 0),
      f = t.z + (e ? e.z * c : 0);
    let g = (d - h[0]) / r,
      m = (p - h[1]) / l,
      w = (f - h[2]) / u;
    ((g = Math.min(Math.max(g, 0), s - 1)),
      (m = Math.min(Math.max(m, 0), i - 1)),
      (w = Math.min(Math.max(w, 0), n - 1)));
    const y = Math.min(Math.floor(g), s - 2),
      x = Math.min(Math.floor(m), i - 2),
      b = Math.min(Math.floor(w), n - 2),
      v = g - y,
      M = m - x,
      _ = w - b,
      S = this.distMax / 255,
      T = 0.12;
    let A = 0;
    const z = this.sh,
      R = this.vis,
      k = this._acc || (this._acc = new Float64Array(12));
    k.fill(0);
    for (let q = 0; q < 8; q++) {
      const I = q & 1,
        H = (q >> 1) & 1,
        L = (q >> 2) & 1,
        D = y + I,
        U = x + H,
        Y = b + L,
        et = D + s * (U + i * Y),
        G = (I ? v : 1 - v) * (H ? M : 1 - M) * (L ? _ : 1 - _),
        j = h[0] + D * r,
        wt = h[1] + U * l,
        me = h[2] + Y * u,
        Vt = d - j,
        At = p - wt,
        Ht = f - me,
        ys = R[et * 4],
        Ys = R[et * 4 + 1],
        Je = R[et * 4 + 2],
        No = R[et * 4 + 3],
        xs = (Vt > 0 ? ys & 255 : ys >> 8) * S,
        bs = (At > 0 ? Ys & 255 : Ys >> 8) * S,
        vs = (Ht > 0 ? Je & 255 : Je >> 8) * S;
      let Pe =
        Pa((xs + T - Math.abs(Vt)) * 5) *
        Pa((bs + T - Math.abs(At)) * 5) *
        Pa((vs + T - Math.abs(Ht)) * 5);
      if (((Pe *= No / 255), e)) {
        const ze = Math.hypot(Vt, At, Ht) || 1,
          Ho = (-(Vt * e.x + At * e.y + Ht * e.z) / ze) * 0.5 + 0.5;
        Pe *= Ho * Ho + 0.05;
      }
      Pe = G * (Pe + 0.001);
      const tn = et * 12;
      for (let ze = 0; ze < 12; ze++) k[ze] += Pe * z[tn + ze];
      A += Pe;
    }
    const C = A > 0 ? 1 / A : 0;
    let O, V, F;
    return (
      e
        ? ((O = Aa(k, 0, e, C)), (V = Aa(k, 1, e, C)), (F = Aa(k, 2, e, C)))
        : ((O = k[0] * $s * C), (V = k[1] * $s * C), (F = k[2] * $s * C)),
      o.isColor ? o.setRGB(O, V, F) : o.set(O, V, F),
      o
    );
  }
  ambientAt(t) {
    const e = this._tmpC || (this._tmpC = new xo());
    this.sampleAt(t, null, e);
    const o = this.skySH,
      s = (o[0] * 0.2126 + o[1] * 0.7152 + o[2] * 0.0722) * $s;
    return Math.min(
      1,
      (e.r * 0.2126 + e.g * 0.7152 + e.b * 0.0722) / Math.max(1e-5, s),
    );
  }
  createTexture() {
    if (this.textures) return this.textures;
    const [t, e, o] = this.dims,
      s = t * e * o,
      i =
        this.halfSH ||
        (() => {
          const c = new Uint16Array(s * 12);
          for (let d = 0; d < c.length; d++) c[d] = M0.toHalfFloat(this.sh[d]);
          return c;
        })(),
      n = [
        new Uint16Array(s * 4),
        new Uint16Array(s * 4),
        new Uint16Array(s * 4),
      ];
    for (let c = 0; c < s; c++)
      for (let d = 0; d < 12; d++) n[d >> 2][c * 4 + (d & 3)] = i[c * 12 + d];
    const r = (c) => {
        const d = new on(c, t, e, o);
        return (
          (d.format = Vi),
          (d.type = v0),
          (d.minFilter = d.magFilter = Eo),
          (d.wrapS = d.wrapT = d.wrapR = Li),
          (d.generateMipmaps = !1),
          (d.unpackAlignment = 1),
          (d.needsUpdate = !0),
          d
        );
      },
      l = new on(new Uint16Array(this.vis), t, e, o);
    ((l.format = Rr),
      (l.type = Or),
      (l.internalFormat = "RGBA16UI"),
      (l.minFilter = l.magFilter = Fo),
      (l.generateMipmaps = !1),
      (l.unpackAlignment = 1),
      (l.needsUpdate = !0),
      (this.textures = { sh0: r(n[0]), sh1: r(n[1]), sh2: r(n[2]), vis: l }));
    const u = this.skySH,
      h = new P(u[0], u[1], u[2]);
    return (
      (this.uniforms = {
        lpSH0: { value: this.textures.sh0 },
        lpSH1: { value: this.textures.sh1 },
        lpSH2: { value: this.textures.sh2 },
        lpVis: { value: this.textures.vis },
        lpOrigin: { value: new P(...this.origin) },
        lpSpacing: { value: new P(...this.spacing) },
        lpDims: { value: new P(...this.dims) },
        lpDistK: { value: this.distMax / 255 },
        lpSky: {
          value: [
            h,
            new P(u[3], u[4], u[5]),
            new P(u[6], u[7], u[8]),
            new P(u[9], u[10], u[11]),
          ],
        },
        lpIntensity: { value: 1 },
        lpMix: { value: 1 },
        lpSpecFloor: { value: 0.06 },
      }),
      (this.memoryBytes = s * 8 * 3 + s * 8),
      this.textures
    );
  }
  patchMaterial(t, e = {}) {
    if (!t || !t.isMeshStandardMaterial || t.userData.lightProbes) return t;
    this.createTexture();
    const o = this.uniforms,
      s = !!e.cheap,
      i = t.onBeforeCompile,
      n = t.customProgramCacheKey,
      r = i !== an.prototype.onBeforeCompile;
    return (
      (t.userData.lightProbes = !0),
      (t.onBeforeCompile = function (l, u) {
        (r && i.call(this, l, u),
          Object.assign(l.uniforms, o),
          (l.vertexShader = l.vertexShader
            .replace(
              "#include <common>",
              `#include <common>
varying vec3 vLpWorld;`,
            )
            .replace(
              "#include <project_vertex>",
              `#include <project_vertex>
          {
            vec4 lpW = vec4( transformed, 1.0 );
            #ifdef USE_BATCHING
              lpW = batchingMatrix * lpW;
            #endif
            #ifdef USE_INSTANCING
              lpW = instanceMatrix * lpW;
            #endif
            vLpWorld = ( modelMatrix * lpW ).xyz;
          }`,
            )));
        let h = l.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
` + fh(s),
          )
          .replace("#include <lights_fragment_maps>", mh);
        this.userData.wg &&
          !s &&
          (Object.assign(l.uniforms, WG_UNIFORMS),
          (h = h
            .replace("#include <common>", "#include <common>\n" + WG_PARS)
            .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n" + WG_BLOCK)));
        ((h = h.replace(
          /vBakedAO\.x \* mix\(0\.16, 1\.0, vBakedAO\.y\)/,
          "vBakedAO.x * mix( mix(0.16, 1.0, vBakedAO.y), mix(LP_VTX_SKY, 1.0, vBakedAO.y), lpInsideG )",
        )),
          (l.fragmentShader = h));
      }),
      (t.customProgramCacheKey = function () {
        return (
          (r || n !== an.prototype.customProgramCacheKey ? n.call(this) : "") +
          "|lp1" +
          (s ? "c" : "") +
          (this.userData.wg && !s ? "|wg" : "")
        );
      }),
      (t.needsUpdate = !0),
      this.patched.add(t),
      t
    );
  }
  patchScene(t, e = {}) {
    let o = 0;
    return (
      t.traverse((s) => {
        if (!s.material) return;
        const i = Array.isArray(s.material) ? s.material : [s.material];
        for (const n of i)
          !n.isMeshStandardMaterial ||
            n.userData.lightProbes ||
            (e.skip && e.skip(n, s)) ||
            (e.resetEnvMapIntensity &&
              !n.transparent &&
              n.envMapIntensity < 1 &&
              (n.envMapIntensity = 1),
            this.patchMaterial(n, e),
            o++);
      }),
      o
    );
  }
  dispose() {
    if (this.textures)
      for (const t of Object.values(this.textures)) t.dispose();
    this.textures = null;
  }
}
// ── Fase 3 (v3.0): humedad y mugre procedurales en espacio de mundo para la geometría estática del nivel.
//    wgParams.x = humedad (manchas mojadas oscuras y brillantes en suelos, chorretones en muros)
//    wgParams.y = mugre (hollín/moho en paredes, variación macro que rompe la repetición de la textura)
const WG_UNIFORMS = { wgParams: { value: new P(1, 1, 0) } };
const WG_PARS = `
uniform vec3 wgParams;
float wgH( vec2 p ) { vec3 p3 = fract( vec3( p.xyx ) * 0.1031 ); p3 += dot( p3, p3.yzx + 33.33 ); return fract( ( p3.x + p3.y ) * p3.z ); }
float wgN( vec2 p ) { vec2 i = floor( p ), f = fract( p ); f = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( wgH( i ), wgH( i + vec2( 1.0, 0.0 ) ), f.x ), mix( wgH( i + vec2( 0.0, 1.0 ) ), wgH( i + vec2( 1.0, 1.0 ) ), f.x ), f.y ); }
float wgF( vec2 p ) { return 0.55 * wgN( p ) + 0.30 * wgN( p * 2.13 + 5.1 ) + 0.15 * wgN( p * 4.37 + 11.7 ); }
`;
const WG_BLOCK = `
{
  vec3 wgNw = inverseTransformDirection( normalize( vNormal ), viewMatrix );
  vec3 wgP = vLpWorld;
  float wgUp = smoothstep( 0.55, 0.92, wgNw.y );
  float wgWall = 1.0 - smoothstep( 0.25, 0.6, abs( wgNw.y ) );
  // variación macro (rompe el tileo): manchas grandes claras/oscuras
  float wgMacro = wgF( wgP.xz * 0.13 + wgP.y * 0.21 );
  diffuseColor.rgb *= mix( 1.0, 0.80 + 0.40 * wgMacro, min( wgParams.y, 1.0 ) );
  // suelos: zonas húmedas (más oscuras y lisas → reflejan el cielo y las luces)
  float wgDamp = wgUp * smoothstep( 0.46, 0.66, wgF( wgP.xz * 0.42 + 3.7 ) ) * wgParams.x;
  // muros: chorretones verticales de humedad + velo de hollín/moho
  vec2 wgUv = vec2( dot( wgP.xz, vec2( wgNw.z, -wgNw.x ) ), wgP.y );
  float wgStreak = smoothstep( 0.52, 0.78, wgF( vec2( wgUv.x * 2.6, wgUv.y * 0.17 ) ) ) * wgWall;
  float wgSoot = smoothstep( 0.42, 0.78, wgF( wgUv * 0.55 + 9.3 ) ) * wgWall;
  diffuseColor.rgb *= 1.0 - min( wgParams.y, 1.5 ) * ( 0.30 * wgStreak + 0.26 * wgSoot );
  diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * vec3( 0.78, 0.86, 0.70 ), wgSoot * wgStreak * min( wgParams.y, 1.0 ) * 0.7 );
  diffuseColor.rgb *= 1.0 - 0.42 * clamp( wgDamp, 0.0, 1.0 );
  roughnessFactor = mix( roughnessFactor, 0.10, clamp( wgDamp, 0.0, 1.0 ) * 0.88 );
  roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.55, clamp( wgStreak * wgParams.x, 0.0, 1.0 ) * 0.7 );
}
`;
const ph = 0.15;
function Aa(a, t, e, o) {
  const s = a[t] * $s * o,
    i = s + Ea * o * (a[3 + t] * e.y + a[6 + t] * e.z + a[9 + t] * e.x);
  return Math.max(i, s * ph, 0);
}
function Pa(a) {
  return a < 0 ? 0 : a > 1 ? 1 : a;
}
const fh = (a) => `
${a ? "#define LP_CHEAP" : ""}
uniform highp sampler3D lpSH0;
uniform highp sampler3D lpSH1;
uniform highp sampler3D lpSH2;
uniform highp usampler3D lpVis;
uniform vec3 lpOrigin;
uniform vec3 lpSpacing;
uniform vec3 lpDims;
uniform float lpDistK;
uniform vec3 lpSky[4];
uniform float lpIntensity;
uniform float lpMix;
uniform float lpSpecFloor;
varying vec3 vLpWorld;
float lpInsideG = 0.0;
#define LP_FLOOR 0.15
#define LP_VTX_SKY 0.6
float lpLum( vec3 c ) { return dot( c, vec3( 0.2126, 0.7152, 0.0722 ) ); }
vec3 lpEvalSH( vec4 a, vec4 b, vec4 c, vec3 n ) {
  // a=(c0.rgb, c1.r) b=(c1.gb, c2.rg) c=(c2.b, c3.rgb)   c1=y, c2=z, c3=x
  vec3 c0 = a.rgb, c1 = vec3( a.a, b.rg ), c2 = vec3( b.ba, c.r ), c3 = c.gba;
  vec3 l0 = c0 * ${$s.toFixed(6)};
  // suelo relativo a la media (ver LP_FLOOR en JS): evita el anillado del L1 a negro/un solo canal
  return max( l0 + ${Ea.toFixed(6)} * ( c1 * n.y + c2 * n.z + c3 * n.x ), l0 * LP_FLOOR );
}
vec3 lpSkyIrr( vec3 n ) { return max( vec3( 0.0 ), lpSky[0] * ${$s.toFixed(6)} + ${Ea.toFixed(6)} * ( lpSky[1] * n.y + lpSky[2] * n.z + lpSky[3] * n.x ) ); }
// devuelve irradiancia (unidades HDRI) y en w el factor "dentro del volumen" 0..1
vec4 lpIrradiance( vec3 wp, vec3 n, vec3 ng ) {
  vec3 p = wp + ng * 0.15;
  vec3 g = ( p - lpOrigin ) / lpSpacing;
  vec3 outD = max( -g, g - ( lpDims - 1.0 ) );
  float inside = 1.0 - clamp( max( max( outD.x, outD.y ), outD.z ) - 0.5, 0.0, 1.0 );
  vec3 gc = clamp( g, vec3( 0.0 ), lpDims - 1.0 );
#ifdef LP_CHEAP
  vec3 uvw = ( gc + 0.5 ) / lpDims;
  vec3 e = lpEvalSH( texture( lpSH0, uvw ), texture( lpSH1, uvw ), texture( lpSH2, uvw ), n );
  return vec4( max( e, vec3( 0.0 ) ), inside );
#else
  ivec3 i0 = min( ivec3( floor( gc ) ), ivec3( lpDims ) - 2 );
  vec3 f = gc - vec3( i0 );
  vec4 accA = vec4( 0.0 ), accB = vec4( 0.0 ), accC = vec4( 0.0 ); float ws = 0.0;
  for ( int k = 0; k < 8; k ++ ) {
    ivec3 o = ivec3( k & 1, ( k >> 1 ) & 1, ( k >> 2 ) & 1 );
    ivec3 ii = i0 + o;
    vec3 fo = vec3( o );
    vec3 t3 = mix( 1.0 - f, f, fo );
    float tri = t3.x * t3.y * t3.z;
    vec3 d = p - ( lpOrigin + vec3( ii ) * lpSpacing );
    uvec4 v = texelFetch( lpVis, ii, 0 );
    vec3 fr = vec3(
      float( d.x > 0.0 ? ( v.r & 255u ) : ( v.r >> 8u ) ),
      float( d.y > 0.0 ? ( v.g & 255u ) : ( v.g >> 8u ) ),
      float( d.z > 0.0 ? ( v.b & 255u ) : ( v.b >> 8u ) ) ) * lpDistK;
    vec3 vv = clamp( ( fr + 0.12 - abs( d ) ) * 5.0, 0.0, 1.0 );
    float w = vv.x * vv.y * vv.z * ( float( v.a ) / 255.0 );
    float c = dot( -normalize( d + 1e-4 ), ng ) * 0.5 + 0.5;
    w *= c * c + 0.05;
    w = tri * ( w + 1e-3 );
    accA += w * texelFetch( lpSH0, ii, 0 ); accB += w * texelFetch( lpSH1, ii, 0 ); accC += w * texelFetch( lpSH2, ii, 0 );
    ws += w;
  }
  float iw = 1.0 / max( ws, 1e-6 );
  // SH es lineal → se interpola el coeficiente y se evalúa una sola vez
  return vec4( max( lpEvalSH( accA * iw, accB * iw, accC * iw, n ), vec3( 0.0 ) ), inside );
#endif
}
`,
  mh = `
float lpSpec = 1.0;
#if defined( RE_IndirectDiffuse )
  #ifdef USE_LIGHTMAP
    vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
    vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
    irradiance += lightMapIrradiance;
  #endif
  #if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
  {
    vec3 lpN = inverseTransformDirection( geometryNormal, viewMatrix );
    vec3 lpNg = inverseTransformDirection( nonPerturbedNormal, viewMatrix );
    vec4 lpE = lpIrradiance( vLpWorld, lpN, lpNg );
    float lpK = lpE.w * lpMix;
    lpInsideG = lpK;
    vec3 iblE = getIBLIrradiance( geometryNormal );
    iblIrradiance += mix( iblE, lpE.rgb * envMapIntensity * lpIntensity, lpK );
    float lpRatio = clamp( lpLum( lpE.rgb ) / max( lpLum( lpSkyIrr( lpN ) ), 1e-4 ), 0.0, 1.0 );
    lpSpec = mix( 1.0, max( lpSpecFloor, lpRatio ), lpK );
  }
  #endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
  #ifdef USE_ANISOTROPY
    radiance += lpSpec * getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
  #else
    radiance += lpSpec * getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
  #endif
  #ifdef USE_CLEARCOAT
    clearcoatRadiance += lpSpec * getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
  #endif
#endif
`;

export { F0, WG_UNIFORMS };
