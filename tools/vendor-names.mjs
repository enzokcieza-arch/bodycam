// Identifica qué exporta el chunk vendor minificado (clases de Three.js por .type / flags is*).
import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('http://127.0.0.1:8765/asset-browser.html');
const r = await p.evaluate(async () => {
  const m = await import('/assets/AssetBrowser-CM6sHEBa.js'); const out = {};
  for (const [k, v] of Object.entries(m)) {
    let d = typeof v;
    if (typeof v === 'function') { try { const o = new v(); d = o.type && typeof o.type === 'string' ? o.type : Object.keys(o).filter(x => /^is[A-Z]/.test(x)).join('|') || Object.getOwnPropertyNames(Object.getPrototypeOf(o)).filter(x => /^is[A-Z]/.test(x)).join('|') || ('fn:' + Object.getOwnPropertyNames(v.prototype || {}).slice(0, 6).join(',')); } catch (e) { d = 'fn(err):' + Object.getOwnPropertyNames(v.prototype || {}).slice(0, 6).join(','); } }
    else if (typeof v === 'number' || typeof v === 'string') d = JSON.stringify(v);
    else if (v && typeof v === 'object') d = 'obj:' + Object.keys(v).slice(0, 6).join(',');
    out[k] = d;
  }
  return { out, rev: window.__THREE__ };
});
console.log('REV', r.rev); for (const [k, v] of Object.entries(r.out)) console.log(k.padEnd(4), v);
await b.close();
