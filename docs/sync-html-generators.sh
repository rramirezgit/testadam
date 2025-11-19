#!/bin/bash

###############################################################################
# Script de Sincronización de Generadores HTML
# 
# Este script copia la carpeta html-generators de adam-pro a otro proyecto
# Uso: ./sync-html-generators.sh [ruta-destino]
###############################################################################

set -e  # Salir si hay error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo ""
echo "=========================================="
echo "  Sincronización Generadores HTML"
echo "=========================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -d "src/components/newsletter-note/html-generators" ]; then
    print_error "No se encontró la carpeta html-generators"
    print_error "Asegúrate de ejecutar este script desde la raíz de adam-pro"
    exit 1
fi

# Origen
SOURCE_DIR="src/components/newsletter-note/html-generators"

# Destino (puede ser pasado como argumento)
if [ -z "$1" ]; then
    print_error "Debes especificar la ruta de destino"
    echo ""
    echo "Uso:"
    echo "  ./sync-html-generators.sh /ruta/al/otro-proyecto/src/lib/html-generators"
    echo ""
    exit 1
fi

TARGET_DIR="$1"

print_info "Origen: ${SOURCE_DIR}"
print_info "Destino: ${TARGET_DIR}"
echo ""

# Verificar si el destino existe
if [ -d "$TARGET_DIR" ]; then
    print_warning "El directorio destino ya existe"
    read -p "¿Deseas sobrescribirlo? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_info "Operación cancelada"
        exit 0
    fi
else
    print_info "Creando directorio destino..."
    mkdir -p "$TARGET_DIR"
fi

# Contar archivos a copiar
TOTAL_FILES=$(find "$SOURCE_DIR" -type f | wc -l | tr -d ' ')
print_info "Archivos a sincronizar: ${TOTAL_FILES}"
echo ""

# Copiar con rsync (más eficiente que cp)
if command -v rsync &> /dev/null; then
    print_info "Usando rsync para sincronización..."
    rsync -av --delete \
        --exclude="*.test.ts" \
        --exclude="*.spec.ts" \
        --exclude="node_modules" \
        --exclude=".DS_Store" \
        "$SOURCE_DIR/" "$TARGET_DIR/"
else
    print_warning "rsync no disponible, usando cp..."
    cp -R "$SOURCE_DIR"/* "$TARGET_DIR/"
fi

print_success "Sincronización completada"
echo ""

# Verificar estructura copiada
print_info "Verificando estructura copiada..."
echo ""

# Verificar archivos críticos
CRITICAL_FILES=(
    "index.ts"
    "types.ts"
    "utils/html-utils.ts"
    "utils/email-styles.ts"
    "utils/outlook-helpers.ts"
    "templates/newsletter.template.ts"
    "templates/single-note.template.ts"
)

ALL_OK=true
for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$TARGET_DIR/$file" ]; then
        print_success "$file"
    else
        print_error "Falta: $file"
        ALL_OK=false
    fi
done

echo ""

if [ "$ALL_OK" = true ]; then
    print_success "Todos los archivos críticos están presentes"
else
    print_error "Faltan algunos archivos críticos"
    exit 1
fi

# Contar generadores copiados
GENERATORS_COUNT=$(find "$TARGET_DIR/components" -name "*.generator.ts" 2>/dev/null | wc -l | tr -d ' ')
print_info "Generadores copiados: ${GENERATORS_COUNT}"

echo ""
echo "=========================================="
print_success "Sincronización exitosa"
echo "=========================================="
echo ""

# Instrucciones post-sincronización
print_info "Próximos pasos:"
echo ""
echo "1. Revisa los imports en tu proyecto"
echo "2. Crea el adaptador OBJDATAWEB (ver OBJDATAWEB_ADAPTER_EXAMPLE.ts)"
echo "3. Prueba la generación de HTML"
echo "4. Consulta HTML_GENERATORS_QUICK_REFERENCE.md para uso"
echo ""

# Opción para mostrar diferencias
if command -v tree &> /dev/null; then
    read -p "¿Deseas ver la estructura del directorio? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo ""
        tree -L 2 "$TARGET_DIR"
        echo ""
    fi
fi

print_success "¡Listo!"

