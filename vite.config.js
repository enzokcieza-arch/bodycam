import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

// El chunk vendor (Three.js r-build + loaders + buscador de modelos) se conserva tal cual del build v2.5:
// lo comparten el juego y asset-browser.html. El juego lo importa en runtime como ./AssetBrowser-CM6sHEBa.js.
const VENDOR = 'AssetBrowser-CM6sHEBa.js';

function vendorExternal() {
  return {
    name: 'bodycam-vendor-external',
    enforce: 'pre',
    resolveId(id) { if (id === 'three-vendor') return { id: './' + VENDOR, external: true }; },
  };
}
// Limpia los main-*.js/css de builds anteriores (los assets estáticos de game/assets no se tocan).
function cleanOldMain() {
  return {
    name: 'bodycam-clean-old-main',
    buildStart() {
      const dir = path.resolve('game/assets');
      for (const f of fs.readdirSync(dir)) if (/^main-[\w-]+\.(js|css|js\.map)$/.test(f)) fs.unlinkSync(path.join(dir, f));
    },
  };
}

export default defineConfig({
  base: './',
  publicDir: false,
  plugins: [vendorExternal(), cleanOldMain()],
  build: {
    outDir: 'game',
    emptyOutDir: false,
    target: 'es2022',
    modulePreload: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      input: 'index.html',
      output: { entryFileNames: 'assets/main-[hash].js', assetFileNames: 'assets/main-[hash][extname]' },
    },
  },
});
