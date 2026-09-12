"""Genera informe de perfilamiento completo del dataset de PQRS."""

import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "src"))

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent / "salidas"
OUT.mkdir(exist_ok=True)

from data_loader import load_raw, profile

df = load_raw()
lines = []


def p(text: str = ""):
    """Acumula línea en el informe y en consola."""
    lines.append(str(text))
    print(text)


p("# Perfilamiento del dataset BASE.xlsx")
p(f"\nRegistros: {df.shape[0]}")
p(f"Columnas: {df.shape[1]}")
p(f"\n## Perfil por columna\n")
prof = profile(df)
p(prof.to_string(index=False))

# Categorías únicas de las columnas categóricas clave
categoricas = [
    "Estado",
    "Tipo de Solicitud",
    "Tipo de Usuario",
    "Mes",
    "Ambito",
    "Programa",
    "Aseguradora",
    "Regional",
    "Sede",
    "Vencimiento",
    "Clasificacion",
    "Area de Solicitud",
    "Servicios",
    "Medio de Transmision",
    "Tipo de Solicitud",
]
for col in categoricas:
    try:
        p("\n" + "=" * 60)
        p(f"### {col}")
        p(vc := df[col].value_counts(dropna=False).to_string() if True else "")
        if df[col].dtype == object:
            p(df[col].value_counts(dropna=False).head(40).to_string())
    except KeyError:
        p(f"\n### {col}: NO ENCONTRADA")

# Verificación temporal
p("\n" + "=" * 60)
p("### Verificación Fecha del Reporte vs Mes")
reporte = pd.to_datetime(df["Fecha del Reporte"])

dfc = df.copy()
dfc["_reporte_mes_num"] = reporte.dt.month
dfc["_reporte_mes_nombre"] = reporte.dt.strftime("%B")
mes_dec = {"Julio": 7, "Agosto": 8, "Septiembre": 9, "Octubre": 10, "Noviembre": 11, "Diciembre": 12}
dfc["_mes_num"] = dfc["Mes"].map(mes_dec)
p(f"Consistencia Mes vs Fecha del Reporte: {(dfc['_mes_num'] == dfc['_reporte_mes_num']).sum()} de {len(dfc)} ({((dfc['_mes_num'] == dfc['_reporte_mes_num']).sum()/len(dfc))*100:.1f}%)")
p(f"Rango de Fecha del Reporte: {reporte.min()} a {reporte.max()}")

# Tiempo de respuesta
p("\n### Cálculo de tiempo de respuesta (Fecha de Cierre - Fecha del Reporte)")
cierre = pd.to_datetime(df["Fecha de Cierre"].str.split(" ").str[0], format="%Y-%m-%d", errors="coerce")
dias = (cierre - reporte).dt.days
p(f"Registros con fecha de cierre válida: {cierre.notna().sum()}")
p(f"Media días de respuesta: {dias.mean():.1f}")
p(f"Mediana días: {dias.median():.1f}")
p(f"Min/Max días: {dias.min()} / {dias.max()}")
dfc["dias_respuesta"] = dias

p("\n" + "=" * 60)
p("### Distribución de días de respuesta")
for lab, lo, hi in [
    ("0-1 días", -1, 1),
    ("2-7 días", 1, 7),
    ("8-15 días", 7, 15),
    ("16-30 días", 15, 30),
    ("31-60 días", 30, 60),
    ("61-90 días", 60, 90),
    (">90 días", 90, 10**9),
]:
    cnt = ((dias > lo) & (dias <= hi)).sum()
    p(f"{lab}: {cnt} ({cnt/len(dias)*100:.1f}%)")

out_file = OUT / "informe_perfilamiento.txt"
out_file.write_text("\n".join(lines), encoding="utf-8")
p(f"\nInforme guardado en: {out_file}")