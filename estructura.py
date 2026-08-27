import os
import sys
from datetime import datetime
from collections import defaultdict

# ============================================================
# ANALIZADOR DE ESTRUCTURA DE PROYECTOS
# Compatible con Pydroid 3 / Android / Python 3
# ============================================================

# Carpeta raíz = carpeta donde está este script
ROOT = os.path.dirname(os.path.abspath(__file__))

# ------------------------------------------------------------
# CONFIGURACIÓN
# ------------------------------------------------------------

IGNORAR_CARPETAS = {
    ".git",
    ".svn",
    ".hg",
    "__pycache__",
    "node_modules",
    ".idea",
    ".vscode",
    "venv",
    ".venv",
    "env",
    ".env",
    "build",
    "dist",
    ".gradle",
    ".pytest_cache",
    ".mypy_cache",
    ".dart_tool",
}

# Extensión -> lenguaje
LENGUAJES = {
    ".py": "Python",
    ".pyw": "Python",
    ".pyx": "Cython",

    ".js": "JavaScript",
    ".jsx": "JavaScript/React",
    ".ts": "TypeScript",
    ".tsx": "TypeScript/React",

    ".html": "HTML",
    ".htm": "HTML",
    ".css": "CSS",
    ".scss": "SCSS",
    ".sass": "Sass",
    ".less": "Less",

    ".java": "Java",
    ".kt": "Kotlin",
    ".kts": "Kotlin",
    ".gradle": "Gradle",

    ".c": "C",
    ".h": "C/C++ Header",
    ".cpp": "C++",
    ".cc": "C++",
    ".cxx": "C++",
    ".hpp": "C++ Header",

    ".cs": "C#",
    ".fs": "F#",
    ".fsx": "F#",

    ".rs": "Rust",
    ".go": "Go",
    ".swift": "Swift",
    ".m": "Objective-C",
    ".mm": "Objective-C++",

    ".php": "PHP",
    ".rb": "Ruby",
    ".r": "R",
    ".lua": "Lua",
    ".pl": "Perl",

    ".sh": "Shell",
    ".bash": "Bash",
    ".zsh": "Zsh",
    ".fish": "Fish",
    ".bat": "Batch",
    ".cmd": "Batch",
    ".ps1": "PowerShell",

    ".sql": "SQL",

    ".json": "JSON",
    ".xml": "XML",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".toml": "TOML",
    ".ini": "INI",
    ".cfg": "Config",
    ".conf": "Config",

    ".md": "Markdown",
    ".txt": "Texto",
    ".rst": "reStructuredText",

    ".dart": "Dart",
    ".vue": "Vue",
    ".svelte": "Svelte",

    ".asm": "Assembly",
    ".s": "Assembly",

    ".dockerfile": "Docker",
}

# Archivos que no tienen extensión normal
NOMBRES_ESPECIALES = {
    "Dockerfile": "Docker",
    "Makefile": "Make",
    "CMakeLists.txt": "CMake",
    ".gitignore": "Git",
    ".gitattributes": "Git",
    ".editorconfig": "EditorConfig",
    "requirements.txt": "Python Dependencies",
    "package.json": "Node.js / JSON",
    "package-lock.json": "Node.js / JSON",
}


# ------------------------------------------------------------
# FUNCIONES
# ------------------------------------------------------------

def formato_tamano(bytes_size):
    """Convierte bytes a KB, MB, GB, etc."""
    unidades = ["B", "KB", "MB", "GB", "TB"]

    tamaño = float(bytes_size)

    for unidad in unidades:
        if tamaño < 1024:
            return f"{tamaño:.2f} {unidad}"
        tamaño /= 1024

    return f"{tamaño:.2f} PB"


def obtener_lenguaje(nombre):
    """Determina el lenguaje probable del archivo."""

    if nombre in NOMBRES_ESPECIALES:
        return NOMBRES_ESPECIALES[nombre]

    extension = os.path.splitext(nombre)[1].lower()

    if extension in LENGUAJES:
        return LENGUAJES[extension]

    if extension == "":
        return "Sin extensión"

    return "Desconocido"


def obtener_modificacion(ruta):
    """Obtiene fecha de última modificación."""

    try:
        timestamp = os.path.getmtime(ruta)
        return datetime.fromtimestamp(timestamp).strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    except Exception:
        return "No disponible"


def crear_linea(caracter="─", cantidad=80):
    return caracter * cantidad


# ------------------------------------------------------------
# VARIABLES DE ANÁLISIS
# ------------------------------------------------------------

total_archivos = 0
total_carpetas = 0
total_bytes = 0

archivos_por_lenguaje = defaultdict(int)
bytes_por_lenguaje = defaultdict(int)

errores = []

lineas_reporte = []


# ------------------------------------------------------------
# ENCABEZADO
# ------------------------------------------------------------

titulo = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ANALIZADOR DE PROYECTOS v1.0                             ║
║                         Compatible con Pydroid 3                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

print(titulo)

lineas_reporte.append(titulo)

print(f"📂 RAÍZ:")
print(f"   {ROOT}")
print()

lineas_reporte.append(f"📂 RAÍZ:")
lineas_reporte.append(f"   {ROOT}")
lineas_reporte.append("")


# ------------------------------------------------------------
# RECORRIDO
# ------------------------------------------------------------

print("🔍 Analizando estructura...\n")

lineas_reporte.append("ESTRUCTURA DEL PROYECTO")
lineas_reporte.append(crear_linea())

for ruta_actual, carpetas, archivos in os.walk(ROOT):

    # Evitar carpetas ignoradas
    carpetas[:] = sorted(
        [
            carpeta
            for carpeta in carpetas
            if carpeta not in IGNORAR_CARPETAS
        ]
    )

    archivos.sort()

    # Nivel de profundidad
    relativa = os.path.relpath(ruta_actual, ROOT)

    if relativa == ".":
        nivel = 0
    else:
        nivel = relativa.count(os.sep) + 1

    # --------------------------------------------------------
    # CARPETA
    # --------------------------------------------------------

    if relativa == ".":
        nombre_carpeta = os.path.basename(ROOT)

        if not nombre_carpeta:
            nombre_carpeta = ROOT

        prefijo = ""

    else:
        nombre_carpeta = os.path.basename(ruta_actual)
        prefijo = "│   " * nivel

    if relativa == ".":
        print(f"📁 {nombre_carpeta}")
        lineas_reporte.append(f"📁 {nombre_carpeta}")
    else:
        print(f"{prefijo}📁 {nombre_carpeta}")
        lineas_reporte.append(f"{prefijo}📁 {nombre_carpeta}")

    total_carpetas += 1

    # --------------------------------------------------------
    # ARCHIVOS
    # --------------------------------------------------------

    for archivo in archivos:

        ruta_archivo = os.path.join(ruta_actual, archivo)

        try:
            tamaño = os.path.getsize(ruta_archivo)
            modificacion = obtener_modificacion(ruta_archivo)
            lenguaje = obtener_lenguaje(archivo)

        except Exception as e:
            errores.append(
                f"{ruta_archivo} -> {str(e)}"
            )
            continue

        total_archivos += 1
        total_bytes += tamaño

        archivos_por_lenguaje[lenguaje] += 1
        bytes_por_lenguaje[lenguaje] += tamaño

        prefijo_archivo = "│   " * (nivel + 1)

        informacion = (
            f"{prefijo_archivo}📄 {archivo} "
            f"| {formato_tamano(tamaño)} "
            f"| {lenguaje} "
            f"| Modificado: {modificacion}"
        )

        print(informacion)
        lineas_reporte.append(informacion)


# ------------------------------------------------------------
# RESUMEN
# ------------------------------------------------------------

print()
print(crear_linea("═"))
print("📊 RESUMEN DEL PROYECTO")
print(crear_linea("═"))

resumen = [
    "",
    crear_linea("═"),
    "📊 RESUMEN DEL PROYECTO",
    crear_linea("═"),
]

datos_resumen = [
    f"📁 Carpetas analizadas : {total_carpetas}",
    f"📄 Archivos encontrados: {total_archivos}",
    f"💾 Tamaño total        : {formato_tamano(total_bytes)}",
]

for linea in datos_resumen:
    print(linea)
    resumen.append(linea)


# ------------------------------------------------------------
# LENGUAJES
# ------------------------------------------------------------

print()
print("💻 ARCHIVOS POR LENGUAJE")
print(crear_linea())

resumen.append("")
resumen.append("💻 ARCHIVOS POR LENGUAJE")
resumen.append(crear_linea())

ordenados = sorted(
    archivos_por_lenguaje.items(),
    key=lambda x: x[1],
    reverse=True
)

for lenguaje, cantidad in ordenados:

    tamaño = bytes_por_lenguaje[lenguaje]

    linea = (
        f"  {lenguaje:<25} "
        f"{cantidad:>6} archivos   "
        f"{formato_tamano(tamaño):>12}"
    )

    print(linea)
    resumen.append(linea)


# ------------------------------------------------------------
# ERRORES
# ------------------------------------------------------------

if errores:

    print()
    print("⚠️ ARCHIVOS QUE NO PUDIERON SER LEÍDOS")
    print(crear_linea())

    resumen.append("")
    resumen.append("⚠️ ARCHIVOS QUE NO PUDIERON SER LEÍDOS")
    resumen.append(crear_linea())

    for error in errores:
        print("  " + error)
        resumen.append("  " + error)


# ------------------------------------------------------------
# GUARDAR REPORTE
# ------------------------------------------------------------

lineas_reporte.extend(resumen)

nombre_reporte = "reporte_estructura.txt"

ruta_reporte = os.path.join(
    ROOT,
    nombre_reporte
)

try:

    with open(
        ruta_reporte,
        "w",
        encoding="utf-8"
    ) as archivo_salida:

        archivo_salida.write(
            "\n".join(lineas_reporte)
        )

    print()
    print(crear_linea("═"))
    print("✅ ANÁLISIS COMPLETADO")
    print(crear_linea("═"))

    print(f"📄 Reporte guardado en:")
    print(f"   {ruta_reporte}")

except Exception as e:

    print()
    print("❌ No se pudo guardar el reporte:")
    print(e)


# ------------------------------------------------------------
# FINAL
# ------------------------------------------------------------

print()
print(f"📁 Carpetas : {total_carpetas}")
print(f"📄 Archivos : {total_archivos}")
print(f"💾 Tamaño   : {formato_tamano(total_bytes)}")
print()
print("Presiona ENTER para salir...")

try:
    input()
except:
    pass