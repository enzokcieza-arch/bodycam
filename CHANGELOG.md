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

### Fase 4 — arma (`src/weapon/gunfx.js`)
- Mira de punto rojo procedural montada adelantada sobre el tubo de gases: punto colimado (sin paralaje, solo
  visible a través del cristal) emitido en HDR para que el bloom le dé halo. `?noreddot` la quita.
- Desgaste procedural (arañazos, grasa, borde gastado) en acero y madera; trama y pelusa en mangas y guantes.
- Linterna con cookie y dispersión volumétrica calibrada. La pose de apuntado canteada de v2.5 no se toca.
- Ya existían en v2.5 y se conservan: retroceso, casquillos, fogonazo con luz, humo.

### Ajustes tras la primera revisión
- Bosque quemado: exposición 0.34 en la zona (suelo oscuro, cielo quemado).
- Follaje: alpha afilado con fwidth → adiós al tramado de puntos.
- Balizas: menos alcance e intensidad; eliminada la del extremo este de la galería.

### Calibración contra las referencias (`tools/stats.py`)
- Se miden percentiles de luma, % de negros y saturación de las referencias y de las capturas.
- Exposición por tipo de zona, tope de ganancia de auto-exposición 3.4 (antes 8: los interiores subían a gris),
  niebla con el color de la luz ambiente local y 45 % menos densa, curva S más fuerte (`contrast`), saturación 1.25.
- Pasada automática de grafitis (`src/world/autograffiti.js`): 45 (media) / 80 (alta) pintadas extra por raycast.

### Set dressing con modelos CC0 (`src/world/dressing.js`, `tools/fetch-polyhaven.py`)
- Sketchfab necesita token para descargar; se usan modelos CC0 fotoescaneados de Poly Haven (sin cuenta).
- 38 modelos nuevos (≈23 MB, webp + meshopt): mobiliario de oficina/hospital, cajas, bidones, latas, garrafas,
  llantas, estufa de barril, carritos; helechos, ortigas, raíces, piedras, corteza, tocón.
- Desorden urbano: grupos apoyados contra los muros (objeto grande + basura pequeña), con capa de polvo.
- Sotobosque instanciado: helechos/ortigas en el bosque oscuro; troncos, ramas y raíces carbonizados en el quemado.
  Versiones `*_lod` simplificadas (~5k triángulos) + presupuesto de triángulos por zona (los originales tienen
  hasta 340k y, instanciados, hundían el rendimiento).
- Pliegues y costuras procedurales (bump) en mangas y guantes.
- Calidad: `clutter` 0.5/1/1.3 y `forest` 0.4/1/1.6 (baja/media/alta).

### Suelo fotorrealista
- Reflejos en espacio de pantalla (`src/render/ssr.js`) solo en superficies mojadas: los materiales de suelo
  escriben su humedad como alfa negativo en el render HDR (sin G-buffer extra); pase a ½ resolución con trazado
  contra la profundidad, refinamiento binario, ondas animadas en el agua y Fresnel. Los charcos reflejan troncos,
  columnas y luces en vez de ser manchas blancas de cielo. Calidad media 24 pasos, alta 40, baja desactivado.
- Charcos del bosque como espejo (rugosidad 0.05); suelo del bosque quemado aclarado a ceniza gris-parda;
  menos micro-charcos POM y bordes húmedos más anchos.
- Slider LOOK `reflections`; `sensorGain` 1.15 para que el cielo nublado se queme a blanco como en las referencias.
- Arma y brazos excluidos de los artefactos de compresión; relieve de tela de mangas y guantes a menor frecuencia.

### Noche de terror permanente
- Cielo nocturno nublado (Poly Haven `kloppenheim_07_puresky`, CC0), normalizado a una luminancia fija; luna
  fría y débil como única luz direccional con sombras; neblina casi negra más densa.
- Exposición nocturna de bodycam: luminancia objetivo 0.075 y ganancia máxima ×9 (más grano y croma, como una
  cámara real de noche). GI horneada de día atenuada al 3.5 %.
- `src/world/nightlights.js`: balizas rojas giratorias colocadas solas en los muros, carteles rojos de
  SALIDA/EXIT con neón que falla, bengalas rojas en el suelo de exteriores y bosques con llama parpadeante.
- Fluorescentes: ~25 % fundidos, ~45 % parpadeando, color frío, al 30 % de intensidad. Pool de luces 3/6/8.
- Linterna encendida al empezar, intensidad recalibrada, cookie más suave, dispersión en niebla sin patrón.
- Se retira el experimento de cielo soleado por zonas.

### Pendiente
- NPC/operadores y brazos/arma de alta calidad: los candidatos CC-BY están en Sketchfab (requiere token válido).
- Sombras de contacto en brazos.
- Fase 5: audio. Rebake de GI (el horneador no está en el repo). Medición real de fps en Mac.
