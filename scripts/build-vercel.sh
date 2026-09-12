#!/usr/bin/env bash
# Script de build para Vercel: instala dependencias, compila Angular y copia
# el bundle del frontend en web/ para que FastAPI lo sirva junto a la API.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND="$ROOT/frontend/angular-app"
WEB="$ROOT/web"

echo "[vercel-build] Install de dependencias (raiz y frontend) ..."
npm ci --prefix "$ROOT"
npm ci --prefix "$FRONTEND"

echo "[vercel-build] Compilando Angular (produccion) ..."
npm run build --prefix "$FRONTEND"

echo "[vercel-build] Copiando bundle a $WEB ..."
rm -rf "$WEB"
mkdir -p "$WEB"
cp -r "$FRONTEND/dist/angular-app/browser/." "$WEB/"

echo "[vercel-build] Build completado."
ls "$WEB"