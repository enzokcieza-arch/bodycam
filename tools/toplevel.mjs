import * as acorn from 'acorn'; import fs from 'node:fs';
const src = fs.readFileSync(process.argv[2], 'utf8');
const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
for (const n of ast.body) {
  let names = [];
  if (n.type === 'VariableDeclaration') names = n.declarations.map(d => d.id.name || '{…}');
  else if (n.id) names = [n.id.name];
  const L = n.loc.end.line - n.loc.start.line + 1;
  console.log(`${n.loc.start.line}\t${L}\t${n.type.replace('Declaration','')}\t${n.kind||''}\t${names.slice(0,14).join(',')}${names.length>14?'…+'+(names.length-14):''}`);
}
