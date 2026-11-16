import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: 640, height: 360 } });
p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') console.log('[c]', m.type(), m.text().slice(0, 300)); });
p.on('pageerror', e => console.log('[pageerror]', e.message));
p.on('response', r => { if (r.status() >= 400) console.log('[http]', r.status(), r.url()); });
await p.goto('http://127.0.0.1:8765/?q=medium&noloop');
await p.waitForFunction(() => window.__ready === true, null, { timeout: 600000, polling: 1000 });
await b.close();
