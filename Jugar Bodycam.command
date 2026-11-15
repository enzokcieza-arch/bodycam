#!/bin/bash
# Doble clic para jugar. Abre el juego en el navegador (Chrome si está instalado).
cd "$(dirname "$0")"
xattr -dr com.apple.quarantine . 2>/dev/null
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then BIN=./server/bodycam-server-arm64; else BIN=./server/bodycam-server-amd64; fi
chmod +x "$BIN"
echo "Iniciando Bodycam Tactical ($ARCH)…"
exec "$BIN" -dir ./game -open
