// three.js — nombres legibles para el chunk vendor (Three.js r170 ya compilado en game/assets/AssetBrowser-*.js).
// Los módulos nuevos (v3.0) importan de aquí; los extraídos del build v2.5 siguen usando los alias minificados.
// Mapa generado con tools/vendor-names.mjs.
export {
  V as Vector3, a as Vector2, q as Vector4, o as Matrix4, z as Matrix3, Q as Quaternion, Z as Euler, i as Color,
  m as Box3, b as MathUtils,
  c as Scene, G as Group, g as Mesh, ak as InstancedMesh, aB as Points,
  E as BufferGeometry, I as BufferAttribute, al as InstancedBufferAttribute,
  B as BoxGeometry, p as PlaneGeometry, Y as CylinderGeometry, _ as SphereGeometry, a2 as CircleGeometry, ax as TorusGeometry,
  d as MeshStandardMaterial, h as MeshBasicMaterial, u as ShaderMaterial, aG as Material,
  f as PointLight, aw as SpotLight, aI as DirectionalLight,
  k as PerspectiveCamera, O as OrthographicCamera,
  r as WebGLRenderTarget, D as DepthTexture, a5 as CanvasTexture, ab as DataTexture,
  a9 as ShaderChunk,
} from "three-vendor";

// constantes de Three.js r170 que el vendor no exporta con nombre
export const LinearFilter = 1006, NearestFilter = 1003, LinearMipmapLinearFilter = 1008;
export const HalfFloatType = 1016, FloatType = 1015, UnsignedByteType = 1009;
export const RepeatWrapping = 1000, ClampToEdgeWrapping = 1001;
export const AdditiveBlending = 2, NormalBlending = 1, CustomBlending = 5;
export const FrontSide = 0, BackSide = 1, DoubleSide = 2;
export const SRGBColorSpace = "srgb", NoColorSpace = "";
