// level/area-urbex.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)
import { o as B } from "three-vendor";
import { tl } from "./area-obra.js";
import { hl } from "./area-callejon.js";
import { Sl } from "./area-bosque.js";
import { Al, Ao, Cn, Pl, Ss, Tl, _s, sa, zl } from "../world/geometry-utils.js";

const $i = "urbex-v2.4",
  lt = 3.7,
  Le = 7,
  Fa = [
    { name: "patio", pos: [1.5, 0, 9.5], yaw: 0.15, pitch: 0.02 },
    {
      name: "pasillo superior",
      pos: [12.5, lt, -11.2],
      yaw: -Math.PI / 2 + 0.05 + Math.PI,
      pitch: -0.05,
    },
    { name: "escalera", pos: [-13.15, 0, 9.9], yaw: 0, pitch: 0.18 },
    {
      name: "soportal",
      pos: [13.5, 0, -12],
      yaw: Math.PI / 2 - 0.05,
      pitch: 0,
    },
  ],
  zn = { pos: [3.5, 0, 16.5], yaw: 0 },
  Ba = [
    {
      name: "salas PB norte",
      type: "indoor",
      min: [-22, 0, -20],
      max: [16, 3.4, -14],
    },
    {
      name: "soportal norte",
      type: "semi",
      min: [-17.5, 0, -14],
      max: [16, 3.4, -10],
    },
    {
      name: "salas P1 norte",
      type: "indoor",
      min: [-22, 3.4, -20],
      max: [16, 7, -12.5],
    },
    {
      name: "galería norte",
      type: "semi",
      min: [-16.5, 3.4, -12.5],
      max: [16, 7, -10],
    },
    {
      name: "salas PB oeste",
      type: "indoor",
      min: [-22, 0, -10],
      max: [-17.5, 3.4, 12],
    },
    {
      name: "soportal oeste",
      type: "semi",
      min: [-17.5, 0, -10],
      max: [-14, 3.4, 12],
    },
    {
      name: "salas P1 oeste",
      type: "indoor",
      min: [-22, 3.4, -12.5],
      max: [-16.5, 7, 12],
    },
    {
      name: "galería oeste",
      type: "semi",
      min: [-16.5, 3.4, -10],
      max: [-14, 7, 12],
    },
    { name: "estructura", type: "semi", min: [18, 0, -8], max: [28, 7.3, 6.5] },
  ],
  he = new B();
function kl(a) {
  const t = [],
    e = [],
    o = [],
    s = (m, w, y, x, b = 0, v = {}) =>
      t.push({ model: m, pos: [w, y, x], rotY: b, ...v }),
    i = (m, w, y, x, b, v, M, _, S, T = {}) =>
      e.push({
        kind: m,
        pos: [w, y, x],
        normal: [b, v, M],
        size: [_, S],
        ...T,
      }),
    n = (m, w, y, x, b, v, M, _, S, T, A = {}) =>
      e.push({
        kind: "graffiti2",
        pos: [m, w, y],
        normal: [x, b, v],
        size: [M, _],
        spec: S,
        wallKey: T,
        ...A,
      });
  (a.box("ground_mud", [4.5, -0.15, 22], [54, 0.3, 20.6], { noCollide: !1 }),
    a.box("ground_debris", [1, -0.15, 1], [30, 0.3, 22], {}),
    a.box("concrete_floor", [-3, -0.15, -15], [38, 0.3, 10], {}),
    a.box("concrete_floor", [-18, -0.15, 1], [8, 0.3, 22], {}),
    a.box("ground_rubble", [23.5, -0.15, 1.75], [15, 0.3, 21.5], {}),
    a.box("ground_mud", [23.5, -0.15, -14.25], [15, 0.3, 11.5], {}));
  const r = [];
  for (let m = 0; m < 8; m++) r.push(-13.75 + m * (29.5 / 7));
  for (const m of r)
    a.box("concrete_wall", [m, 1.7, -10.25], [0.55, 3.4, 0.55], {});
  (a.wall("plaster_damaged", -17.5, -14, 16, -14, 0, 3.4, 0.3, [
    { at: 7.5, w: 1.2, y: 0, h: 2.25 },
    { at: 12.5, w: 1.5, y: 0.95, h: 1.3 },
    { at: 17.5, w: 1.2, y: 0, h: 2.25 },
    { at: 22, w: 1.5, y: 0.95, h: 1.3 },
    { at: 26.5, w: 1.2, y: 0, h: 2.25 },
    { at: 30.6, w: 1.5, y: 0.95, h: 1.3 },
  ]),
    a.wall("brick_wall", -22, -20.15, 16, -20.15, 0, 7.3, 0.3, [
      { at: 6, w: 1.4, y: 4.6, h: 1.3 },
      { at: 16, w: 1.4, y: 4.6, h: 1.3 },
      { at: 27, w: 1.4, y: 4.6, h: 1.3 },
      { at: 13, w: 1.2, y: 1, h: 1.1 },
    ]),
    a.wall("brick_wall", 16, -20.15, 16, -14, 0, 7.3, 0.3, []),
    a.wall("brick_wall", 16, -14, 16, -10, 0, 3.4, 0.3, [
      { at: 2, w: 2.4, y: 0, h: 2.4 },
    ]),
    a.wall("plaster_peeling", 16, -14, 16, -10, 3.7, 3.3, 0.3, []));
  for (const m of [-5, 5])
    a.wall("plaster_pink", m, -14, m, -20, 0, 3.4, 0.2, [
      { at: 3, w: 1, y: 0, h: 2.2 },
    ]);
  (a.wall("plaster_peeling", -17.5, -14, -17.5, -20, 0, 3.4, 0.2, [
    { at: 3, w: 1, y: 0, h: 2.2 },
  ]),
    $e(a, "concrete_wall", -22, 16, -20, -10, 3.4, 0.3, []),
    _s(a, -14, -10.05, 16, -10.05, lt),
    a.wall("plaster_peeling", -16.5, -12.5, 16, -12.5, lt, 3.3, 0.25, [
      { at: 7.5, w: 1.1, y: 0, h: 2.2 },
      { at: 12.5, w: 1.5, y: 0.9, h: 1.4 },
      { at: 17.5, w: 1.1, y: 0, h: 2.2 },
      { at: 22.5, w: 1.5, y: 0.9, h: 1.4 },
      { at: 27.5, w: 1.1, y: 0, h: 2.2 },
      { at: 31, w: 1.4, y: 0.9, h: 1.4 },
    ]));
  for (const m of [-5, 5])
    a.wall("plaster_mossy", m, -12.5, m, -20, lt, 3.3, 0.2, [
      { at: 4, w: 1, y: 0, h: 2.2 },
    ]);
  const l = [
    { x0: -2.5, x1: 2.5, z0: -18.5, z1: -14.5 },
    { x0: 8, x1: 12, z0: -18.5, z1: -14.5 },
    { x0: -21, x1: -18, z0: 2, z1: 6 },
  ];
  $e(a, "concrete_rough", -22, 16, -20, -10, Le, 0.3, l.slice(0, 2));
  for (const m of l) Al(a, m, Le + 0.3);
  a.box("concrete_wall", [-3, Le + 0.55, -9.95], [38, 0.5, 0.2], {});
  for (const m of [-6, -2, 2, 6, 10])
    a.box("concrete_wall", [-14.25, 1.7, m], [0.55, 3.4, 0.55], {});
  (a.wall(
    "plaster_damaged",
    -17.5,
    -14,
    -17.5,
    12,
    0,
    3.4,
    0.3,
    [
      { at: 8, w: 1.2, y: 0, h: 2.25 },
      { at: 14, w: 1.5, y: 0.95, h: 1.3 },
      { at: 20, w: 1.2, y: 0, h: 2.25 },
      { at: 23.5, w: 1.5, y: 0.95, h: 1.3 },
    ].map((m) => ({ ...m, at: m.at })),
  ),
    a.wall("brick_wall", -22.15, -20.15, -22.15, 32, 0, 7.3, 0.3, [
      { at: 30, w: 1.4, y: 4.6, h: 1.3 },
      { at: 22, w: 1.4, y: 4.6, h: 1.3 },
      { at: 42.15, w: 4, y: 0, h: 3.2 },
    ]),
    a.wall("brick_broken", -22, 12.1, -14, 12.1, 0, 7.3, 0.3, [
      { at: 6.2, w: 2.2, y: 0, h: 2.6 },
      { at: 2.5, w: 1.4, y: 4.6, h: 1.3 },
    ]));
  for (const m of [-4, 5])
    a.wall("plaster_pink", -22, m, -17.5, m, 0, 3.4, 0.2, [
      { at: 2.3, w: 1, y: 0, h: 2.2 },
    ]);
  ($e(a, "concrete_wall", -22, -14, -10, 12, 3.4, 0.3, [
    { x0: -14.1, x1: -12.3, z0: -0.8, z1: 1 },
  ]),
    _s(a, -14.05, -10, -14.05, -0.8, lt),
    _s(a, -14.05, 1, -14.05, 12, lt),
    a.wall("plaster_peeling", -16.5, -12.5, -16.5, 12, lt, 3.3, 0.25, [
      { at: 5.5, w: 1.1, y: 0, h: 2.2 },
      { at: 10.5, w: 1.5, y: 0.9, h: 1.4 },
      { at: 15.5, w: 1.1, y: 0, h: 2.2 },
      { at: 20.5, w: 1.5, y: 0.9, h: 1.4 },
    ]));
  for (const m of [-2, 6])
    a.wall("plaster_mossy", -22, m, -16.5, m, lt, 3.3, 0.2, [
      { at: 2.8, w: 1, y: 0, h: 2.2 },
    ]);
  ($e(a, "concrete_rough", -22, -14, -10, 12, Le, 0.3, [l[2]]),
    a.box("concrete_wall", [-13.95, Le + 0.55, 1], [0.2, 0.5, 22], {}),
    sa(a, "concrete_wall", -13.9, -12.4, 10.5, 1, 0, lt, 22),
    a.box("concrete_wall", [-13.2, lt - 0.15, 0.1], [1.8, 0.3, 1.8], {}),
    a.box(
      "concrete_wall",
      [-13.2, (lt - 0.3) / 2, 0.1],
      [1.4, lt - 0.3, 0.3],
      {},
    ),
    Tl(a, -12.35, 10.5, 1, 0, lt),
    _s(a, -12.35, 1, -12.35, -0.8, lt),
    _s(a, -12.35, -0.85, -14.1, -0.85, lt),
    a.wall("brick_wall", -14, 12.15, 16, 12.15, 0, 3.6, 0.35, [
      { at: 19, w: 4.2, y: 0, h: 3.6 },
    ]),
    a.box("concrete_wall", [2.85, 1.9, 12.15], [0.5, 3.8, 0.5], {}),
    a.box("concrete_wall", [7.15, 1.9, 12.15], [0.5, 3.8, 0.5], {}),
    a.wall("brick_wall", -22, 32.2, 31, 32.2, 0, 4, 0.3, [
      { at: 30, w: 4, y: 0, h: 4 },
    ]),
    a.wall("brick_broken", 31.15, -20.15, 31.15, 32, 0, 4, 0.3, []),
    a.wall("brick_wall", 16, -20.15, 31, -20.15, 0, 5, 0.3, []),
    Cn(a, 16.1, -10, 16.1, 12, 2.3, [{ z0: 1.6, z1: 4.4 }]),
    a.box("metal_corrugated", [17.4, 0.03, 3], [1.9, 0.05, 2.6], {
      rotY: 0.2,
      noCollide: !0,
    }),
    Cn(a, 16, 10.3, 31, 10.3, 2.3, [{ z0: 21.5, z1: 24.5 }], !0));
  const u = [18.5, 23, 27.5],
    h = [-7.5, -3, 1.5, 6];
  for (const m of u)
    for (const w of h)
      (a.box("concrete_rebar", [m, 1.7, w], [0.4, 3.4, 0.4], {}),
        m < 27
          ? a.box("concrete_rebar", [m, 3.65 + 1.7, w], [0.4, 3.4, 0.4], {})
          : a.box("concrete_rebar", [m, 3.65 + 0.8, w], [0.4, 1.6, 0.4], {}));
  ($e(a, "concrete_rebar", 18.2, 27.8, -7.8, 6.3, 3.4, 0.25, [
    { x0: 18.2, x1: 21, z0: -7.8, z1: -4 },
    { x0: 25.3, x1: 27.3, z0: -1.9, z1: 5.9 },
  ]),
    $e(a, "concrete_rebar", 18.2, 23.2, -7.8, 6.3, 7.05, 0.25, [
      { x0: 18.8, x1: 20.7, z0: -3.9, z1: 3.6 },
    ]));
  for (const m of h)
    a.box("concrete_rebar", [23, 3.25, m], [9.6, 0.35, 0.3], { noCollide: !0 });
  (sa(a, "concrete_rough", 25.4, 27.1, 5.8, -1.9, 0, 3.65, 21),
    sa(a, "concrete_rough", 18.9, 20.6, -3.8, 3.5, 3.65, 7.3, 21),
    _s(a, 18.25, 6.25, 27.8, 6.25, 3.65, !0),
    _s(a, 18.25, 6.25, 23.2, 6.25, 7.3, !0),
    a.wall("brick_broken", 17.5, -8.6, 30.8, -8.6, 0, 4.2, 0.3, [
      { at: 4.5, w: 1.3, y: 0, h: 2.2 },
    ]),
    Pl(a, 18.2, 28, 6.9, 7),
    n(
      22.6,
      2.2,
      -8.43,
      0,
      0,
      1,
      3,
      1,
      {
        style: "scrawl",
        text: "Do not enter",
        palette: 2,
        seed: 7,
        wear: 0.35,
      },
      "brick_broken",
    ),
    n(
      26.7,
      1.4,
      -8.43,
      0,
      0,
      1,
      1.9,
      0.7,
      { style: "stencil", text: "NO PASAR", palette: 7, seed: 8, wear: 0.5 },
      "brick_broken",
    ),
    zl(a, 1.5, 1.5),
    Ss(a, -10.5, 8.5, 2.2, 0.75, 11),
    Ss(a, 12.5, -6.5, 2.6, 0.9, 22),
    Ss(a, 23.5, -5.5, 3, 1.2, 33),
    Ss(a, 20.5, 3.5, 1.8, 0.6, 44),
    Ss(a, -19.5, -17.5, 1.4, 0.5, 55),
    Ss(a, 9.5, -17.5, 1.6, 0.55, 66),
    Ss(a, -8, 26, 3.2, 0.9, 77),
    Ao(a, -7.5, 0, 7.6, 0.3),
    Ao(a, -7.5, 0.14, 7.6, 0.35),
    Ao(a, -6.6, 0, 9.3, 1.2),
    Ao(a, 14.6, 0.6, 7, 0.1, Math.PI / 2 - 0.25),
    Ao(a, 21, 0, 0.5, 0.7),
    s("covered_car", 9.5, 0, 6.2, 0.35),
    s("covered_car", 22, 0, 22, -1.2),
    s("wooden_crate_02", -9.6, 0, 5.6, 0.1),
    s("wooden_crate_02", -9.6, 0.46, 5.5, 0.2),
    s("wooden_crate_01", -8.6, 0, 4.7, 0.6),
    s("wooden_military_crate", -10.8, 0, 3.9, 1.4),
    s("old_military_crate", 13.2, 0, -8.2, -0.2, { filter: "_a" }),
    s("wooden_crate_02", 13.6, 0, 9.5, 1.2),
    s("wooden_crate_01", 12.9, 0, 10.6, 0.2),
    s("concrete_road_barrier", 4, 0, 13.5, 0.05),
    s("concrete_road_barrier_02", 6.1, 0, 13.9, -0.15),
    s("concrete_road_barrier_02", 14.2, 0, 1, Math.PI / 2 + 0.1),
    s("concrete_road_barrier_02", 14.3, 0, -1.4, Math.PI / 2),
    s("concrete_road_barrier_02", -3, 0, 18, 0.6),
    s("Barrel_01", 15.2, 0, 11.2, 0),
    s("barrel_03", 14.4, 0, 11.4, 1),
    s("Barrel_01", 19.2, 0, -6.6, 0.4),
    s("barrel_03", -12.2, 0, -12.6, 0.3),
    s("metal_trash_can", -6.2, 0, -12.9, 0.1, { filter: "rust" }),
    s("metal_trash_can", 6, 0, -13.1, -0.1, { filter: "rust" }),
    s("trashbag", -5.3, 0, -12.6, 0.4),
    s("trashbag", -4.8, 0, -13.2, 1.9),
    s("trashbag", 7, 0, -12.4, 2.4),
    s("trashbag", -12.6, 0, 11, 0.9),
    s("old_tyre", 18.6, 0.08, 9.3, 0, { tilt: Math.PI / 2 }),
    s("old_tyre", 18.6, 0.24, 9.3, 0.3, { tilt: Math.PI / 2 }),
    s("old_tyre", -1, 0.3, 24, 0.8, { tilt: 0.3 }),
    s("cement_bag", 21.2, 0, -1.2, 0.3),
    s("cement_bag", 21.4, 0.18, -1, 0.1),
    s("cement_bag", 26.3, 3.65, -5.4, 1.2),
    s("propane_tank", 19.8, 0, -4.2, 0),
    s("metal_jerrycan", 20.1, 0, -3.6, 0.6),
    s("plastic_crate_01", -11.8, 0, 9.6, 0.2),
    s("cardboard_box_01", 3.5, 0, -16.5, 0.4),
    s("cardboard_box_01", 3.3, 0.34, -16.6, 1.1),
    s("cardboard_box_01", -19.6, lt, 9.5, 0.2),
    s("utility_box_01", -16.9, 1, -9, Math.PI / 2, { mount: !0 }),
    s("power_box_01", 15.82, 1.6, -11.5, -Math.PI / 2, { mount: !0 }),
    s("exterior_aircon_unit", -12.85, 5.1, 8.5, Math.PI, {
      mount: !0,
      rotY2: 0,
    }),
    s("security_light", 0, 3.1, -13.83, 0, { mount: !0 }),
    s("security_light", -17.33, 3.1, 4, Math.PI / 2, { mount: !0 }),
    s("rollershutter_door", 16, 0, -10.8, -Math.PI / 2, {
      filter: "graffiti",
      fit: { h: 2.4 },
    }),
    s("water_manhole_cover", -3.5, 0.01, 4.5, 0.3),
    s("wooden_ladder", 22.7, 0, 6.35, Math.PI, {
      tiltX: -0.25,
      fit: { h: 3.6 },
    }),
    s("spray_paint_bottles", -2.2, 0, -13.6, 0.2),
    s("steel_frame_shelves_01", -8.5, 0, -19.4, 0, { fit: { h: 2 } }),
    s("steel_frame_shelves_01", 12.5, lt, -19.4, 0, { fit: { h: 2 } }),
    s("SchoolDesk_01", -1.5, lt, -16.5, 0.2),
    s("SchoolDesk_01", 0.3, lt, -17.4, -0.4),
    s("SchoolDesk_01", 1.5, lt, -15.5, 1.7, { tilt: 1.57 }),
    s("plastic_monobloc_chair_01", -1.2, lt, -15.4, 2.6),
    s("plastic_monobloc_chair_01", 2.5, lt, -17.8, 0.8, { tilt: 1.4 }),
    s("old_bed_frame", -19.5, lt, -5.6, 0),
    s("ammo_box", -1, lt + 0.77, -16.5, 0.3),
    s("cement_bag", -12, 0, -18.6, 0.2),
    s("cement_bag", -11.6, 0, -18, 1.1),
    s("cement_bag", -11.8, 0.18, -18.4, 0.5),
    s("wooden_crate_01", -20, 0, 8.6, 0.3),
    s("trashbag", -20.6, 0, 9.6, 0.3),
    s("Barrel_01", -20.8, 0, -8.4, 0),
    s("dead_tree_trunk", -4, 0.1, 21, 0.7),
    s("rock_moss_set_01", -14, 0, 27, 0.4, { filter: "rock01" }),
    s("rock_moss_set_01", 26, 0, 28, 2, { filter: "rock03" }),
    s("boulder_01", 27.5, 0, 18, 0.5),
    s("shrub_02", -18.5, 0, 22, 0.3, { filter: "shrub_02_a" }),
    s("shrub_02", 28.5, 0, 14, 1.2, { filter: "shrub_02_c" }),
    s("shrub_02", 15, 0, 30.5, 0.2, { filter: "shrub_02_b" }),
    s("shrub_02", -12.8, 0, -8.5, 0.2, {
      filter: "shrub_02_d",
      fit: { h: 1 },
    }));
  const c = (m, w, y, x = 0, b = "indoor") => {
    (o.push({
      pos: [m, w - 0.12, y],
      color: 14674175,
      intensity: 5,
      distance: 9,
      flicker: x,
      zone: b,
    }),
      s("mounted_fluorescent_lights", m, w, y, 0, {
        ceiling: !0,
        collide: !1,
        filter: "lights_a$",
      }));
  };
  (c(-10, 3.38, -17, 0),
    c(0, 3.38, -17, 1),
    c(10, 3.38, -17, 0),
    c(-10, Le - 0.02, -16, 0),
    c(10, Le - 0.02, -16.5, 1),
    c(-19.8, 3.38, 0, 0),
    c(-19.5, Le - 0.02, 2, 0),
    s("hanging_industrial_lamp", -2, 3.4, -12, 0, { collide: !1 }),
    s("hanging_industrial_lamp", 8.5, 3.4, -12, 0, { collide: !1 }),
    o.push({
      pos: [-2, 2.1, -12],
      color: 16766624,
      intensity: 3,
      distance: 8,
      flicker: 0,
      zone: "semi",
    }));
  let d = 0;
  const p = (m, w, y, x, b, v, M) =>
    i("graffiti", m, w, y, x, 0, b, v, M, { index: (d++ * 7) % 16 });
  for (let m = 0; m < r.length; m++)
    m % 2 === 0 && p(r[m], 1.6, -9.96, 0, 1, 0.9, 0.9);
  (p(-9, 1.7, -13.84, 0, 1, 2.4, 2.4),
    p(3, 1.5, -13.84, 0, 1, 2.6, 2.6),
    p(12, 1.6, -13.84, 0, 1, 2, 2),
    p(-17.34, 1.5, 0, 1, 0, 2.6, 2.6),
    p(-17.34, 1.6, 10, 1, 0, 2.2, 2.2),
    p(-8, 1.6, 11.96, 0, -1, 3, 3),
    p(-2, 1.3, 11.96, 0, -1, 2.2, 2.2),
    p(12, 1.5, 11.96, 0, -1, 2.6, 2.6),
    p(-3, 5.3, -12.37, 0, 1, 2, 2),
    p(9, 5, -12.37, 0, 1, 1.6, 1.6),
    p(-16.37, 5.3, 4, 1, 0, 2, 2),
    p(20, 1.5, -8.43, 0, 1, 2, 2),
    p(-10, 2, 32.03, 0, -1, 3, 3),
    p(10, 2, 32.03, 0, -1, 3, 3),
    p(-4, 1.8, -19.98, 0, 1, 2, 2),
    p(6, 1.5, -19.98, 0, 1, 2.2, 2.2),
    p(-19.5, 5.2, -19.98, 0, 1, 1.8, 1.8),
    n(
      -1,
      0,
      6.5,
      0,
      1,
      0,
      6,
      2.4,
      {
        style: "piece",
        text: "SKOR",
        palette: 11,
        seed: 3,
        wear: 0.65,
        floor: !0,
      },
      "ground_debris",
      { rot: 0.08 },
    ),
    n(
      -3.5,
      1.65,
      -13.84,
      0,
      0,
      1,
      5.5,
      2.3,
      { style: "piece", text: "DEADYARD", palette: 1, seed: 2, wear: 0.4 },
      "plaster_damaged",
    ),
    n(
      9.5,
      1.7,
      11.96,
      0,
      0,
      -1,
      5,
      2.2,
      { style: "piece", text: "KAOS", palette: 5, seed: 4, wear: 0.45 },
      "brick_wall",
    ),
    n(
      -17.34,
      1.6,
      -5.5,
      1,
      0,
      0,
      3.4,
      1.7,
      { style: "throwup", text: "DIP", palette: 7, seed: 5, wear: 0.45 },
      "plaster_damaged",
    ),
    n(
      2.5,
      1.5,
      11.96,
      0,
      0,
      -1,
      4.2,
      2.4,
      { style: "tagwall", palette: 11, seed: 21, wear: 0.5 },
      "brick_wall",
    ),
    n(
      -10.5,
      1.5,
      11.96,
      0,
      0,
      -1,
      3.2,
      1.6,
      { style: "throwup", text: "NOX", palette: 0, seed: 22, wear: 0.5 },
      "brick_wall",
    ),
    n(
      7.5,
      1.4,
      -13.84,
      0,
      0,
      1,
      3.8,
      2.2,
      { style: "tagwall", palette: 11, seed: 23, wear: 0.55 },
      "plaster_damaged",
    ),
    n(
      -12.5,
      1.5,
      -13.84,
      0,
      0,
      1,
      3,
      1.5,
      { style: "throwup", text: "ZEK", palette: 3, seed: 24, wear: 0.5 },
      "plaster_damaged",
    ),
    n(
      -17.34,
      1.5,
      6.5,
      1,
      0,
      0,
      3.6,
      2,
      { style: "tagwall", palette: 11, seed: 25, wear: 0.5 },
      "plaster_damaged",
    ),
    n(
      -9,
      5.1,
      -12.37,
      0,
      0,
      1,
      3.2,
      1.6,
      { style: "throwup", text: "RIP", palette: 2, seed: 26, wear: 0.5 },
      "plaster_peeling",
    ),
    n(
      22.5,
      1,
      -8.43,
      0,
      0,
      1,
      1.2,
      0.6,
      { style: "tag", palette: 11, seed: 27 },
      "brick_broken",
    ),
    n(
      -4,
      1.3,
      -19.98,
      0,
      0,
      1,
      3.2,
      1.8,
      { style: "tagwall", palette: 11, seed: 28, wear: 0.5 },
      "brick_wall",
    ));
  for (const m of [-12, -6, 0, 6, 12])
    i("leak", m, Le - 1.4, -9.85, 0, 0, 1, 2.4, 2.8, { index: m & 1 });
  for (const m of [-15, 4.5, 14])
    i("leak", m, 2.1, -13.84, 0, 0, 1, 1.8, 2.4, { index: 1 });
  for (const m of [-5, 3, 9])
    i("leak", -17.34, 2.2, m, 1, 0, 0, 2, 2.4, { index: 0 });
  for (const m of [-15, -4, 7])
    i("leak", m, 2, 11.96, 0, 0, -1, 2.6, 3.2, { index: 0 });
  const f = [],
    g = {};
  for (const m of [tl, hl, Sl]) {
    const w = m(a) || {};
    (t.push(...(w.props || [])),
      e.push(...(w.decals || [])),
      o.push(...(w.lights || [])),
      f.push(...(w.trees || [])),
      Object.assign(g, w.materials || {}));
    for (const y of w.zones || [])
      Ba.some((x) => x.name === y.name) || Ba.push(y);
    for (const y of w.bench || [])
      Fa.some((x) => x.name === y.name) || Fa.push(y);
  }
  return {
    props: t,
    decals: e,
    lights: o,
    skylights: l,
    trees: f,
    materials: g,
  };
}
function $e(a, t, e, o, s, i, n, r, l) {
  const u = new Set([e, o]);
  for (const c of l)
    (u.add(Math.max(e, Math.min(o, c.x0))),
      u.add(Math.max(e, Math.min(o, c.x1))));
  const h = [...u].sort((c, d) => c - d);
  for (let c = 0; c < h.length - 1; c++) {
    const d = h[c],
      p = h[c + 1],
      f = (d + p) / 2,
      g = l
        .filter((w) => w.x0 <= f && w.x1 >= f)
        .map((w) => [w.z0, w.z1])
        .sort((w, y) => w[0] - y[0]);
    let m = s;
    for (const [w, y] of g)
      (w > m && a.box(t, [f, n + r / 2, (m + w) / 2], [p - d, r, w - m], {}),
        (m = Math.max(m, y)));
    i > m && a.box(t, [f, n + r / 2, (m + i) / 2], [p - d, r, i - m], {});
  }
}

export { $e, $i, Ba, Fa, Le, he, kl, zn };
