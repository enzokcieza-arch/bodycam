// Divide el bundle formateado en módulos ES por rangos de líneas, generando imports/exports automáticamente.
import * as acorn from 'acorn'; import fs from 'node:fs'; import path from 'node:path';
const [,, inFile, outDir, vendorRel = 'vendor/three-vendor.js'] = process.argv;
const src = fs.readFileSync(inFile, 'utf8');
const MODS = [
  ['render/postprocess.js', 95], ['core/engine.js', 707], ['core/input.js', 792], ['core/perf.js', 865],
  ['level/builder.js', 1172], ['level/area-obra.js', 1422], ['level/area-callejon.js', 3047], ['level/area-bosque.js', 4336],
  ['level/area-urbex.js', 5491], ['world/geometry-utils.js', 6126], ['world/trees.js', 7019], ['world/ground-scatter.js', 8606],
  ['world/graffiti.js', 10575], ['world/world.js', 12561], ['player/player.js', 13184], ['weapon/viewmodel.js', 13599],
  ['fx/particles.js', 14985], ['weapon/ballistics.js', 15957], ['weapon/weapons.js', 17074], ['audio/audio.js', 17417],
  ['render/lightprobes.js', 18180], ['main.js', 18569],
];
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
const modOf = (line) => { let m = 0; for (let i = 0; i < MODS.length; i++) if (line >= MODS[i][1]) m = i; return m; };
const vendor = new Map();   // local -> imported
const decl = new Map();     // name -> {mod, kind}
const stmts = MODS.map(() => []);
const pat = (p, out) => { if (!p) return; if (p.type === 'Identifier') out.push(p.name); else if (p.type === 'ObjectPattern') p.properties.forEach(q => pat(q.value || q.argument, out)); else if (p.type === 'ArrayPattern') p.elements.forEach(q => pat(q, out)); else if (p.type === 'AssignmentPattern') pat(p.left, out); else if (p.type === 'RestElement') pat(p.argument, out); };
for (const n of ast.body) {
  if (n.type === 'ImportDeclaration') { for (const s of n.specifiers) vendor.set(s.local.name, s.imported.name); continue; }
  const m = modOf(n.loc.start.line); stmts[m].push(n);
  const names = [];
  if (n.type === 'VariableDeclaration') n.declarations.forEach(d => pat(d.id, names)); else if (n.id) names.push(n.id.name);
  for (const nm of names) decl.set(nm, { mod: m, kind: n.kind || n.type });
}
// identificadores referenciados (sin claves de propiedad) y asignaciones
const refs = MODS.map(() => new Set()), assigns = MODS.map(() => new Set());
function walk(n, m, parent, key) {
  if (!n || typeof n.type !== 'string') return;
  if (n.type === 'Identifier') {
    const isProp = parent && ((parent.type === 'MemberExpression' && key === 'property' && !parent.computed) ||
      ((parent.type === 'Property' || parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && key === 'key' && !parent.computed));
    if (!isProp) refs[m].add(n.name);
    return;
  }
  if (n.type === 'AssignmentExpression') { const o = []; pat(n.left, o); o.forEach(x => assigns[m].add(x)); }
  if (n.type === 'UpdateExpression' && n.argument.type === 'Identifier') assigns[m].add(n.argument.name);
  for (const k of Object.keys(n)) { if (k === 'loc' || k === 'start' || k === 'end') continue; const v = n[k];
    if (Array.isArray(v)) v.forEach(c => walk(c, m, n, k)); else if (v && typeof v === 'object') walk(v, m, n, k); }
}
stmts.forEach((list, m) => list.forEach(n => walk(n, m, null, null)));
let problems = 0;
const exportsOf = MODS.map(() => new Set());
const out = MODS.map(([file], m) => {
  const vImp = [], mImp = new Map();
  for (const r of refs[m]) {
    if (vendor.has(r)) vImp.push(vendor.get(r) === r ? r : `${vendor.get(r)} as ${r}`);
    else if (decl.has(r) && decl.get(r).mod !== m) { const d = decl.get(r); if (!mImp.has(d.mod)) mImp.set(d.mod, []); mImp.get(d.mod).push(r); exportsOf[d.mod].add(r);
      if (assigns[m].has(r)) { problems++; console.warn(`!! ${file} asigna ${r} declarado en ${MODS[d.mod][0]} (${d.kind})`); } }
  }
  return { file, vImp, mImp };
});
out.forEach(({ file, vImp, mImp }, m) => {
  const rel = (to) => { let r = path.posix.relative(path.posix.dirname(file), to); return r.startsWith('.') ? r : './' + r; };
  let code = `// ${file} — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)\n`;
  if (vImp.length) code += `import { ${vImp.sort().join(', ')} } from "${rel(vendorRel)}";\n`;
  for (const [d, names] of [...mImp].sort((a, b) => a[0] - b[0])) code += `import { ${names.sort().join(', ')} } from "${rel(MODS[d][0])}";\n`;
  if (m === MODS.length - 1) { // main: evalúa en el orden original
    const have = new Set(mImp.keys()); MODS.forEach(([f], i) => { if (i < m && !have.has(i)) code += `import "${rel(f)}";\n`; }); }
  const list = stmts[m]; if (!list.length) return;
  code += '\n' + src.slice(list[0].start, list[list.length - 1].end) + '\n';
  if (exportsOf[m].size) code += `\nexport { ${[...exportsOf[m]].sort().join(', ')} };\n`;
  const f = path.join(outDir, file); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, code);
  console.log(file.padEnd(28), String(code.split('\n').length).padStart(6), 'líneas  imports←', [...mImp.keys()].map(d => MODS[d][0].split('/').pop().replace('.js','')).join(','));
});
console.log('problemas:', problems);
