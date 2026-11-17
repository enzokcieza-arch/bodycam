// world/world.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { E as Ut, G as Kt, I as tt, Q, V as P, Y as vt, Z as Ae, a3 as $t, a6 as S0, ae as Se, ak as co, ar as k0, as as sn, d as Tt, f as Ha, g as ht, m as po, o as B } from "three-vendor";
import { dn } from "../level/builder.js";
import { $i, Ba, Le, kl } from "../level/area-urbex.js";
import { Bl, Fl, Ll, Rl, Vl, qs } from "./geometry-utils.js";
import { Jl, Ql } from "./trees.js";
import { urbanClutter, DRESS_PROPS } from "./dressing.js";
import { ac, cc, ji } from "./ground-scatter.js";
import { Cc, Fc, Oc, Rc, Vc, Xn, Zn, da } from "./graffiti.js";

class Bc {
  constructor(t, e) {
    ((this.engine = t),
      (this.assets = e),
      (this.scene = t.scene),
      (this.staticMeshes = []),
      (this.dynamicLights = []),
      (this.lightSpecs = []),
      (this.zones = Ba),
      (this.time = 0));
  }
  async build(t = () => {}) {
    const e = this.assets,
      o = new dn(),
      s = kl(o);
    this.level = s;
    const { visual: i, collision: n } = o.build();
    t("Oclusión ambiental horneada…");
    let r = null;
    try {
      const f = await fetch(`${k0}bake/ao-${$i}.bin`);
      if (f.ok) {
        const g = await f.arrayBuffer(),
          m = new DataView(g).getUint32(0, !0),
          w = JSON.parse(new TextDecoder().decode(new Uint8Array(g, 4, m)));
        let y = 4 + m;
        ((r = new Map()),
          w.keys.forEach((x, b) => {
            (r.set(x, new Uint8Array(g, y, w.counts[b])), (y += w.counts[b]));
          }));
        for (const [x, b] of i)
          if (
            !r.has(x) ||
            r.get(x).length !== b.attributes.position.count * 2
          ) {
            r = null;
            break;
          }
      }
    } catch {
      r = null;
    }
    r ||
      (console.warn(
        "[World] AO no horneado o desactualizado → horneando en el navegador",
      ),
      (r = Rl(i)));
    for (const [f, g] of i) {
      (g.setAttribute("bakedAO", new Se(r.get(f), 2, !0)),
        Zn[f] && Fc(g, Zn[f]),
        g.computeBoundingSphere(),
        g.computeBoundingBox(),
        g.computeBoundsTree());
      const m = s.materials?.[f],
        w = m
          ? e.pbr(m.tex, {
              tint: m.tint,
              metal: m.metal,
              roughness: m.roughness,
              normal: m.normal,
            })
          : e.pbr(f, da[f] || {});
      (Xn[f] && !w.userData.wet && (Ql(w, Xn[f]), (w.userData.wet = !0)),
        m?.surface === "water" &&
          ((w.roughness = 0.05),
          (w.envMapIntensity = 0.55),
          w.color.setRGB(0.03, 0.032, 0.035),
          (w.needsUpdate = !0)));
      const y = new ht(g, w);
      ((y.castShadow = !0),
        (y.receiveShadow = !0),
        (y.matrixAutoUpdate = !1),
        y.updateMatrix(),
        (y.userData.surface = m?.surface || Oc[f] || "concrete"),
        (y.name = "static:" + f),
        this.scene.add(y),
        this.staticMeshes.push(y));
    }
    t("Props fotoescaneados (Poly Haven)…");
    const l = [],
      u = new sn(n);
    this.propRoots = [];
    this.engine.quality.clutter > 0 &&
      s.props.push(...urbanClutter(u, this.zones, { density: this.engine.quality.clutter }));
    const h = [...new Set(s.props.map((f) => f.model))],
      c = new Map();
    await Promise.all(
      h.map(async (f) => {
        try {
          c.set(f, await e.loadModel(f));
        } catch (g) {
          console.warn("modelo", f, g);
        }
      }),
    );
    const d = new Map();
    for (const f of s.props) {
      const g = c.get(f.model);
      if (!g) continue;
      const m = this.instantiate(g.scene, f);
      (f.dress && ((m.userData.small = f.collide === !1), DRESS_PROPS.push(m)),
      (m.userData.surface = Vc[f.model] || "wood"),
        (m.userData.model = f.model),
        this.scene.add(m),
        m.updateMatrixWorld(!0));
      const w = m.userData.localBox,
        y = new P();
      (new po().setFromObject(m).getCenter(y), (y.y += 0.25));
      const x = qs(u.bvh, y),
        b = Math.round(Math.min(1, 0.06 + x) * 6) / 6;
      m.traverse((M) => {
        if (!M.isMesh) return;
        M.userData.surface = m.userData.surface;
        const S = (Array.isArray(M.material) ? M.material : [M.material]).map(
          (T) => {
            const A = T.uuid + "|" + b + (f.dress ? "|d" : "");
            if (!d.has(A)) {
              const z = T.clone();
              ((z.envMapIntensity = b), d.set(A, z));
              // desorden añadido (dressing.js): polvo y abandono → menos saturado, más oscuro y mate
              if (f.dress && z.color) {
                const lum = z.color.r * 0.2126 + z.color.g * 0.7152 + z.color.b * 0.0722;
                z.color.lerp({ r: lum, g: lum, b: lum, isColor: !0 }, 0.45).multiplyScalar(0.72);
                z.roughness = Math.min(1, (z.roughness ?? 1) * 1.2 + 0.08);
              }
            }
            return d.get(A);
          },
        );
        ((M.material = Array.isArray(M.material) ? S : S[0]),
          M.geometry.boundsTree || M.geometry.computeBoundsTree(),
          (M.matrixAutoUpdate = !1),
          M.updateMatrix(),
          this.staticMeshes.push(M));
      });
      const v = w.getSize(new P());
      if (
        f.collide !== !1 &&
        !f.ceiling &&
        Math.max(v.x, v.y, v.z) > 0.3 &&
        !/shrub|grass|weed|nettle|lamp|fluorescent/.test(f.model)
      ) {
        const M = w.getCenter(new P()),
          _ = m.matrixWorld
            .clone()
            .multiply(new B().makeTranslation(M.x, M.y, M.z));
        l.push({ size: v, matrix: _ });
      }
      this.propRoots.push(m);
    }
    (t("Árboles…"), (this.trees = new Jl(e, this.engine.quality)));
    const p = Math.min(1, 0.6 * (this.engine.quality.vegetation ?? 1));
    for (const f of s.trees || [])
      (f.pos[0] > -24 || ((f.seed ?? 1) * 0.6180339) % 1 < p) &&
        this.trees.add(
          f.type,
          f.pos[0],
          f.pos[1],
          f.pos[2],
          f.scale ?? 1,
          f.seed ?? 1,
        );
    (this.trees.add("leafy", 1.5, 0.35, 1.5, 0.42, 3),
      this.trees.build(this.scene));
    for (const f of this.trees.colliders)
      l.push({
        size: new P(f.r * 2, f.h, f.r * 2),
        matrix: new B().makeTranslation(f.x, (f.y ?? 0) + f.h / 2, f.z),
      });
    return (
      (this.collider = new sn(n, l)),
      t("Relieve del suelo y escombros…"),
      (this.groundPOM = ac(
        this.staticMeshes,
        e,
        this.engine.qualityKey || "medium",
      )),
      (this.scatter = new cc(e, this.engine.quality, this.collider)),
      this.scatter.scatterOnMeshes(this.staticMeshes, ji),
      (this.scatterStats = this.scatter.build(this.scene)),
      this.scatter.update(this.engine.camera),
      t("Grafitis, humedad y decals…"),
      this.buildDecals(s.decals),
      this.buildSkylightGlass(s.skylights),
      this.buildVegetation(c),
      this.setupLights(s.lights),
      this
    );
  }
  instantiate(t, e) {
    const o = new Kt(),
      s = t.clone(!0);
    if (e.filter) {
      const d = new RegExp(e.filter);
      for (const p of [...s.children]) d.test(p.name) || s.remove(p);
    }
    const i = new Kt();
    (i.add(s),
      e.tilt && (i.rotation.x = e.tilt),
      e.tiltX && (i.rotation.x = e.tiltX),
      i.updateMatrixWorld(!0));
    const n = new po().setFromObject(i),
      r = n.getSize(new P());
    let l = 1;
    (e.fit?.h && (l = e.fit.h / r.y),
      e.fit?.w && (l = e.fit.w / Math.max(r.x, r.z)));
    const u = n.getCenter(new P()),
      h = new P(-u.x, -n.min.y, -u.z);
    (e.mount && h.set(-u.x, -u.y, -n.min.z),
      e.ceiling && h.set(-u.x, -n.max.y, -u.z),
      i.position.copy(h).multiplyScalar(l),
      i.scale.setScalar(l),
      o.add(i),
      o.position.set(...e.pos),
      (o.rotation.y = e.rotY || 0),
      o.updateMatrixWorld(!0));
    const c = new po().setFromObject(i);
    return (
      c.applyMatrix4(new B().copy(o.matrixWorld).invert()),
      (o.userData.localBox = c),
      (o.userData.fitScale = new P(1, 1, 1)),
      o
    );
  }
  buildDecals(t) {
    const e = this.assets,
      o = (g) => qs(this.collider.bvh, new P(...g).add(new P(0, 0.05, 0))),
      s = (g, m, w, y) => {
        const x = new P(...g.normal).normalize(),
          b = Math.abs(x.y) > 0.9 ? new P(0, 0, -1) : new P(0, 1, 0),
          v = new P().crossVectors(b, x).normalize(),
          M = new P().crossVectors(x, v).normalize();
        g.rot && (v.applyAxisAngle(x, g.rot), M.applyAxisAngle(x, g.rot));
        const [_, S] = g.size,
          T = new P(...g.pos).addScaledVector(x, 0.012),
          A = (k, C) =>
            T.clone()
              .addScaledVector(v, (k * _) / 2)
              .addScaledVector(M, (C * S) / 2),
          z = [A(-1, -1), A(1, -1), A(1, 1), A(-1, -1), A(1, 1), A(-1, 1)],
          R = [
            [m[0], m[1]],
            [w[0], m[1]],
            [w[0], w[1]],
            [m[0], m[1]],
            [w[0], w[1]],
            [m[0], w[1]],
          ];
        return { pts: z, n: x, uvs: R, ao: y };
      },
      i = (g) => {
        const m = [],
          w = [],
          y = [],
          x = [];
        for (const v of g)
          for (let M = 0; M < 6; M++)
            (m.push(v.pts[M].x, v.pts[M].y, v.pts[M].z),
              w.push(v.n.x, v.n.y, v.n.z),
              y.push(...v.uvs[M]),
              x.push(255, Math.round(v.ao * 255)));
        const b = new Ut();
        return (
          b.setAttribute("position", new tt(m, 3)),
          b.setAttribute("normal", new tt(w, 3)),
          b.setAttribute("uv", new tt(y, 2)),
          b.setAttribute("bakedAO", new Se(new Uint8Array(x), 2, !0)),
          b
        );
      },
      n = (g) => {
        const m = new Tt({
          transparent: !0,
          depthWrite: !1,
          polygonOffset: !0,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
          ...g,
        });
        return (S0(m), m);
      },
      r = t
        .filter((g) => g.kind === "graffiti")
        .map((g) => {
          const m = g.index % 16,
            w = m % 4,
            y = Math.floor(m / 4);
          return s(
            g,
            [w / 4 + 0.004, 1 - (y + 1) / 4 + 0.004],
            [(w + 1) / 4 - 0.004, 1 - y / 4 - 0.004],
            o(g.pos),
          );
        }),
      l = this.assets.manifest.decals.GraffitiSet001,
      u = n({
        map: e.texture(
          l.find((g) => /Color/.test(g)),
          !0,
          !1,
        ),
        alphaMap: e.texture(
          l.find((g) => /Opacity/.test(g)),
          !1,
          !1,
        ),
        roughness: 0.75,
        metalness: 0,
        color: 14540253,
      }),
      h = new ht(i(r), u);
    ((h.receiveShadow = !0), (h.renderOrder = 1), this.scene.add(h));
    const c = t
        .filter((g) => g.kind === "leak")
        .map((g) => s(g, [0, 0], [1, 1], o(g.pos))),
      d = this.assets.manifest.decals.Leaking019A.find((g) => /Color/.test(g)),
      p = n({
        color: 3024669,
        roughness: 0.35,
        opacity: 0.6,
        alphaMap: Bl(k0 + d, this.engine.renderer),
      }),
      f = new ht(i(c), p);
    ((f.receiveShadow = !0), (f.renderOrder = 1), this.scene.add(f));
    for (const g of t.filter((m) => m.spec)) {
      const m = Cc({
        ...g.spec,
        width: g.size[0],
        height: g.size[1],
        floor: g.spec.floor ?? g.normal[1] > 0.5,
      });
      m.anisotropy = this.assets.aniso;
      const w = this.level.materials?.[g.wallKey]?.tex || g.wallKey,
        y = Rc(m, {
          assets: e,
          wallKey: w,
          tile: this.level.materials?.[g.wallKey]?.tile ?? g.tile,
          floor: g.normal[1] > 0.5,
          normalScale: da[g.wallKey]?.normal ?? 1.2,
        }),
        x = new ht(i([s(g, [0, 0], [1, 1], o(g.pos))]), y);
      ((x.receiveShadow = !0),
        (x.renderOrder = 1),
        (x.matrixAutoUpdate = !1),
        x.updateMatrix(),
        (x.name = "graffiti:" + g.spec.style),
        this.scene.add(x));
    }
    for (const g of t.filter((m) => m.kind === "mural" || m.kind === "text")) {
      const m =
        g.kind === "mural" ? Vl(g.text, g.palette || 0) : Ll(g.text, g.color);
      m.anisotropy = this.assets.aniso;
      const w = n({
          map: m,
          roughness: g.kind === "mural" && g.normal[1] > 0.5 ? 0.9 : 0.7,
          alphaTest: 0.02,
        }),
        y = new ht(i([s(g, [0, 0], [1, 1], o(g.pos))]), w);
      ((y.receiveShadow = !0), (y.renderOrder = 1), this.scene.add(y));
    }
  }
  buildSkylightGlass(t) {
    const e = [];
    let o = 7;
    const s = () => (o = (o * 16807) % 2147483647) / 2147483647;
    for (const l of t) {
      for (let h = 0; h < 9; h++) {
        const c = l.x0 + 0.1 + s() * (l.x1 - l.x0 - 0.2),
          d = s() > 0.5 ? l.z0 + 0.05 : l.z1 - 0.05,
          p = Le + 0.25,
          f = new P(c - 0.25 - s() * 0.3, p, d),
          g = new P(c + 0.25 + s() * 0.3, p, d),
          m = new P(
            c + (s() - 0.5) * 0.4,
            p - 0.15 - s() * 0.45,
            d + (s() - 0.5) * 0.3,
          );
        e.push(f, g, m);
      }
      const u = (l.x0 < -17, 3.71);
      for (let h = 0; h < 40; h++) {
        const c = l.x0 + s() * (l.x1 - l.x0),
          d = l.z0 + s() * (l.z1 - l.z0),
          p = 0.02 + s() * 0.06,
          f = s() * 6;
        for (let g = 0; g < 3; g++)
          e.push(
            new P(
              c + Math.cos(f + g * 2.1) * p,
              u + 0.004,
              d + Math.sin(f + g * 2.1) * p * (0.5 + s()),
            ),
          );
      }
    }
    const i = new Ut().setFromPoints(e);
    i.computeVertexNormals();
    const n = new Tt({
        color: 3818562,
        roughness: 0.04,
        metalness: 0,
        transparent: !0,
        opacity: 0.45,
        side: $t,
        depthWrite: !1,
        envMapIntensity: 0.8,
      }),
      r = new ht(i, n);
    this.scene.add(r);
  }
  buildVegetation(t) {
    const e = t.get("grass_medium_01");
    if (!e) return;
    const o = ["tall_a", "tall_b", "mid_b", "small_a"],
      s = this.engine.quality.vegetation ?? 1;
    let i = 99;
    const n = () => (i = (i * 16807) % 2147483647) / 2147483647,
      r = [];
    for (let c = 0; c < 300 * s; c++) {
      const d = n();
      let p, f;
      if (d < 0.45) ((p = -21 + n() * 51), (f = 13 + n() * 18.5));
      else if (d < 0.6) ((p = -13.5 + n() * 29), (f = 11.2 + n() * 0.6));
      else if (d < 0.7) ((p = 15.3 + n() * 0.5), (f = -9 + n() * 20));
      else if (d < 0.85) ((p = 17.5 + n() * 13), (f = -8 + n() * 18));
      else if (
        ((p = -13 + n() * 28),
        (f = -9 + n() * 20),
        Math.abs(p - 1.5) < 2.2 && Math.abs(f - 1.5) < 2.2)
      )
        continue;
      const g = this.collider.groundY(p, 2, f, 4);
      g === -1 / 0 ||
        g > 0.6 ||
        r.push([
          p,
          g,
          f,
          n() * 6.28,
          0.7 + n() * 0.7,
          Math.floor(n() * o.length),
        ]);
    }
    for (let c = 0; c < 26; c++)
      r.push([
        0.1 + n() * 2.8,
        0.41,
        0.1 + n() * 2.8,
        n() * 6.28,
        0.9 + n() * 0.6,
        Math.floor(n() * 2),
      ]);
    const l = new B(),
      u = new Q(),
      h = new Ae();
    o.forEach((c, d) => {
      const p = e.scene.children.find((b) => b.name.includes(c));
      if (!p || !p.isMesh) return;
      const f = r.filter((b) => b[5] === d),
        g = p.geometry.clone();
      g.computeBoundingBox();
      const m = g.boundingBox,
        w = (m.min.x + m.max.x) / 2,
        y = (m.min.z + m.max.z) / 2;
      g.translate(-w, -m.min.y, -y);
      const x = new co(g, p.material, f.length);
      (f.forEach((b, v) => {
        (h.set(0, b[3], 0),
          u.setFromEuler(h),
          l.compose(new P(b[0], b[1], b[2]), u, new P(b[4], b[4], b[4])),
          x.setMatrixAt(v, l));
      }),
        (x.castShadow = !1),
        (x.receiveShadow = !0),
        x.computeBoundingSphere(),
        this.scene.add(x));
    });
  }
  buildTree(t, e) {
    let o = 4242;
    const s = () => (o = (o * 16807) % 2147483647) / 2147483647,
      i = [],
      n = [],
      r = new P(0, 1, 0),
      l = (x, b, v, M, _) => {
        const S = x.clone().addScaledVector(b, v),
          T = new vt(M * 0.7, M, v, 7, 1, !0),
          A = new Q().setFromUnitVectors(r, b);
        if (
          (T.applyMatrix4(
            new B().compose(
              x.clone().addScaledVector(b, v / 2),
              A,
              new P(1, 1, 1),
            ),
          ),
          i.push(T),
          _ === 0 || M < 0.02)
        ) {
          for (let R = 0; R < 3; R++)
            n.push(
              S.clone().add(
                new P((s() - 0.5) * 1.2, (s() - 0.3) * 0.8, (s() - 0.5) * 1.2),
              ),
            );
          return;
        }
        const z = _ > 2 ? 2 : 3;
        for (let R = 0; R < z; R++) {
          const k = b
            .clone()
            .add(new P((s() - 0.5) * 1.6, s() * 0.5, (s() - 0.5) * 1.6))
            .normalize();
          l(S, k, v * (0.6 + s() * 0.2), M * 0.62, _ - 1);
        }
      };
    l(new P(t, 0.35, e), new P(0.05, 1, 0.02).normalize(), 2.6, 0.17, 4);
    const u = new dn();
    for (const x of i) u.geometry("bark", x, null, { uvScale: 1 });
    const h = u.build().visual.get("bark"),
      c = new Uint8Array(h.attributes.position.count * 2).fill(255);
    for (let x = 0; x < c.length; x += 2) c[x + 1] = 200;
    h.setAttribute("bakedAO", new Se(c, 2, !0));
    const d = new ht(h, this.assets.pbr("bark", da.bark));
    ((d.castShadow = d.receiveShadow = !0),
      this.scene.add(d),
      (d.userData.surface = "wood"),
      h.computeBoundsTree(),
      this.staticMeshes.push(d));
    const p = [],
      f = [],
      g = [];
    for (const x of n) {
      const b = 0.9 + s() * 0.7,
        v = s() * Math.PI;
      for (const M of [v, v + Math.PI / 2]) {
        const _ = (Math.cos(M) * b) / 2,
          S = (Math.sin(M) * b) / 2,
          T = [
            [x.x - _, x.y - b / 2, x.z - S],
            [x.x + _, x.y - b / 2, x.z + S],
            [x.x + _, x.y + b / 2, x.z + S],
            [x.x - _, x.y + b / 2, x.z - S],
          ];
        for (const A of [0, 1, 2, 0, 2, 3]) (p.push(...T[A]), g.push(0, 1, 0));
        f.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
      }
    }
    const m = new Ut();
    (m.setAttribute("position", new tt(p, 3)),
      m.setAttribute("normal", new tt(g, 3)),
      m.setAttribute("uv", new tt(f, 2)));
    const w = new Tt({
        map: Fl(),
        alphaTest: 0.45,
        side: $t,
        roughness: 0.8,
        color: 12108960,
      }),
      y = new ht(m, w);
    ((y.castShadow = !0),
      (y.receiveShadow = !0),
      this.scene.add(y),
      (this.leaves = y));
  }
  setupLights(t) {
    this.lightSpecs = t;
    const e = this.engine.quality.pointLights;
    for (let o = 0; o < e; o++) {
      const s = new Ha(16777215, 0, 8, 2);
      ((s.castShadow = !1), this.scene.add(s), this.dynamicLights.push(s));
    }
  }
  updateLights(t, e) {
    this.time += e;
    const o = this.lightSpecs;
    ((!this._sorted || (this._lt = (this._lt || 0) + e) > 0.25) &&
      ((this._lt = 0),
      (this._sorted = o
        .map((s, i) => [
          i,
          (s.pos[0] - t.x) ** 2 +
            (s.pos[1] - t.y) ** 2 * 4 +
            (s.pos[2] - t.z) ** 2,
        ])
        .sort((s, i) => s[1] - i[1]))),
      this.dynamicLights.forEach((s, i) => {
        const n = this._sorted[i];
        if (!n) {
          s.intensity = 0;
          return;
        }
        const r = o[n[0]];
        (s.position.set(...r.pos),
          s.color.setHex(r.color),
          (s.distance = r.distance));
        let l = 1;
        if (r.flicker) {
          const u = this.time * 7 + n[0];
          l =
            Math.sin(u * 3.1) + Math.sin(u * 7.7) > 1.2
              ? 0.05
              : Math.random() < 0.03
                ? 0.2
                : 1;
        }
        s.intensity = r.intensity * (r._lvl = l);
      }));
  }
  zoneAt(t) {
    for (const e of this.zones)
      if (
        t.x >= e.min[0] &&
        t.x <= e.max[0] &&
        t.y >= e.min[1] - 0.2 &&
        t.y <= e.max[1] &&
        t.z >= e.min[2] &&
        t.z <= e.max[2]
      )
        return e;
    return null;
  }
}
const Qi = (a) => (a < 0 ? 0 : a > 1 ? 1 : a),
  Bt = (a, t, e) => Qi((a - t) / (e - t)),
  ro = (a) => a * a * (3 - 2 * a),
  Ps = (a) => a * a * a * (a * (a * 6 - 15) + 10),
  hs = (a, t, e) => ro(Bt(e, a, t)),
  Ee = (a, t, e, o, s) => hs(t, e, a) * (1 - hs(o, s, a)),
  pa = (a) => 1 - (1 - a) * (1 - a) * (1 - a),
  Fe = (a, t, e, o) => a + (t - a) * (1 - Math.exp(-e * o)),
  Jn = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export { Bc, Bt, Ee, Fe, Jn, Ps, Qi, hs, pa, ro };
