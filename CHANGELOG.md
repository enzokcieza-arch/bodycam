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

### Sonido de terror nocturno (`src/audio/nightsound.js`)
- Fuentes 3D (HRTF) en las luces cercanas: zumbido de fluorescentes con chasquido de arco al parpadear, relé y
  zumbido de balizas, neón de SALIDA, siseo de bengalas. Pool de 4 voces reasignado a las fuentes más próximas.
- Ambiente por zona: viento con ráfagas y silbidos (atenuado dentro), grillos en exteriores, búho en el bosque,
  goteo con eco en interiores. Se quitan los pájaros diurnos de v2.5.
- Sustos raros (25–70 s, sin repetir): portazo, tres golpes en la pared, pasos corriendo en otra planta,
  radio policial distorsionada, gemido estructural del edificio.
- `tools/audiotest.mjs`: mide el nivel real de salida por zona y por susto.

### Arreglos
- Cámara al saltar: vibraba ±6 cm a ~15 Hz al aterrizar (muelle integrado por frame); ahora un hundimiento suave
  de ~5 cm igual a 60/75/144 fps (`tools/jumptest.mjs`).
- Humo de balas y granada: se ilumina por la escena (antes brillaba solo en la oscuridad), sin cuadrados en los
  sprites; explosión de noche sin pantalla en blanco (luz 600→140, flash de cámara a la mitad).

### Rendimiento (`tools/perfprobe.mjs`)
- Sotobosque troceado en celdas de 16 m con descarte por frustum y por distancia (antes cada modelo era un único
  InstancedMesh que cubría todo el bosque y se dibujaba entero desde cualquier sitio).
- Plano lejano de cámara 400 → 150 m (la niebla nocturna ya oculta todo a esa distancia).
- Luces puntuales activas: baja 2, media 4, alta 6 (antes 3/6/8): cada luz se evalúa en todos los píxeles.
- Desorden pequeño oculto a más de 14/22/32 m y grande a 40/55/80 m (baja/media/alta).
- Sombras por luz: con la linterna con sombras (calidad alta) ya no se re-renderiza cada frame el mapa de la
  luna (4096², ~1250 objetos); la luna solo se actualiza bajo demanda.
- Triángulos por vista en calidad media: patio 7.63 M → 2.96 M, bosque quemado 4.85 M → 2.14 M,
  bosque oscuro 4.34 M → 1.79 M; pasillo y callejón sin cambios (0.54 M / 0.34 M).

### Auditoría de puntos débiles (v3.3)
- Filtro temporal (`src/render/temporal.js`) para la volumétrica y los reflejos SSR: reproyección con profundidad
  + recorte a la vecindad 3×3; elimina el grano del haz de la linterna y de los conos de luz sin estelas.
- Linterna: punto central + derrame amplio y visible (ángulo 0.60 → 0.85 rad, cookie con meseta de derrame,
  intensidad 9 → 14, anillos más suaves). Antes solo se veía un círculo en la pared y la sala quedaba en negro.
- Mira red-dot rediseñada: tubo torneado con pared y parasol, torreta arriba adelantada y torreta+batería a la
  derecha; nada a la izquierda. Antes, 4 salientes simétricos formaban una "cruz" en el centro de la pantalla.
- Rebote de la linterna sobre el arma y los brazos (dejan de ser una silueta negra).
- Noche: luna 0.16 → 0.28, GI residual 3.5 % → 5 %, cielo más oscuro (sin negro absoluto en medio encuadre).

### Puntos débiles (v3.4)
- Arma: micro-detalle fotográfico con texturas PBR reales de Poly Haven ya incluidas (metal galvanizado en cajón y
  cañón, madera envejecida en culata y guardamanos), proyectadas en triplanar sin UVs y con relieve por derivadas.
- Arma y brazos de noche: rebote de la linterna ×4 y sin la oclusión diurna del viewmodel (×0.4 → ×0.85).
- Linterna sin anillos dibujados en el cookie (se marcaban en las paredes); borde del hotspot suave.
- Cielo visible separado de la luz que aporta (`bgK` 0.4): ya no se ve azul crepuscular en interiores oscuros.

### Pendiente
- NPC/operadores y brazos/arma de alta calidad: los candidatos CC-BY están en Sketchfab (requiere token válido).
- Sombras de contacto en brazos.
- Fase 5: audio. Rebake de GI (el horneador no está en el repo). Medición real de fps en Mac.
