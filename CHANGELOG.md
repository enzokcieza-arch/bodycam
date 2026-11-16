# CHANGELOG

## v3.0 (en curso) — look "bodycam fotorrealista"

### Paso 0 — proyecto
- La rama solo traía el build minificado. Se formateó el bundle y se dividió automáticamente en 22 módulos ES
  (`src/`, nombres minificados conservados) con `tools/split.mjs`. Proyecto Vite (`npm run build` → `game/`).
- El chunk vendor (Three.js r170 + buscador de modelos) se conserva tal cual; `src/three.js` le da nombres legibles.
- Arnés de capturas deterministas (`tools/shots.mjs`, cámaras en `tools/cams.json`) y bench relativo (`tools/bench.mjs`).

### Fase 1 — lente / sensor / vídeo (`src/render/lens-shader.js`)
- Aberración cromática lateral visible desde el tercio exterior, viñeta natural cos⁴, halación rojiza, velo
  (veiling glare) y suciedad de lente procedural que se enciende con las luces fuertes.
- Ruido de sensor luma + croma dependiente de la ganancia, acento rojo/cálido en el grading, quemado de altas ajustable.
- Códec: croma 4:2:0, macrobloques 8×8 con movimiento/sombras, cuantización y bloques que "bailan" en oscuros.
- Rolling shutter (inclinación al girar + micro-ondulación con vibración), respiración de enfoque al apuntar.
- Motion blur por píxel con profundidad (rotación + traslación; arma y brazos excluidos).

### Fase 2 — luz y atmósfera (`src/render/volumetric.js`, `src/world/atmosphere.js`)
- Pase volumétrico a ½ resolución: halo analítico de luces puntuales, cono de linterna (raymarch corto),
  god rays hacia huecos al cielo y neblina con altura.
- 7 balizas rojas de emergencia pulsantes, luminarias emisivas en HDR, polvo en suspensión iluminado.
- Linterna con cookie (núcleo, anillos, derrame); sombras de linterna solo en calidad alta.

### Fase 3 — materiales (`src/render/lightprobes.js`, bloque WG)
- Humedad y mugre procedurales en espacio de mundo sobre la geometría estática: manchas mojadas brillantes en
  suelos, chorretones y hollín/moho en muros, variación macro que rompe el tileo.
- Desgaste procedural en arma, guantes y mangas (`src/weapon/gunfx.js`).

### Panel F3 → LOOK
Sliders en vivo (se guardan en localStorage) y botón "medir coste GPU de efectos":
fisheye, chroma, vignette, halation, veil, lensDirt, bloom, sharpen, exposureComp, sensorGain, blackCrush,
saturation, accent, grain, chromaGrain, compression, rollingShutter, motionBlurAmt, ao, haze, volumetric, dust,
godrays, wetness, grime, emergency.

### Calidad
- low: sin volumétrica, polvo, suciedad de lente, compresión ni humedad/mugre.
- medium / high: todo activo (high: más muestras, más polvo, sombras de linterna).

### Pendiente
- Fase 4: mira red-dot (prototipo tras `?reddot`, escala y montaje sin ajustar), NPC/operadores.
- Fase 5: audio. Rebake de GI (el horneador no está en el repo). Medición real de fps en Mac.
