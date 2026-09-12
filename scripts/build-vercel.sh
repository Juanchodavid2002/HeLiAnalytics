#!/usr/bin/env bash
# Script de build para Vercel: instala dependencias, compila Angular y copia
# el bundle del frontend en public/ para que Vercel lo sirva desde su CDN.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/frontend/angular-app"
PUBLIC="$ROOT/public"

echo "[vercel-build] Install de dependencias (raiz y frontend) ..."
npm ci --prefix "$ROOT"
npm ci --prefix "$FRONTEND"

echo "[vercel-build] Compilando Angular (produccion) ..."
npm run build --prefix "$FRONTEND"

echo "[vercel-build] Copiando bundle a $PUBLIC ..."
rm -rf "$PUBLIC"
mkdir -p "$PUBLIC"
cp -r "$FRONTEND/dist/angular-app/browser/." "$PUBLIC/"

echo "[vercel-build] Build completado."
ls "$PUBLIC"