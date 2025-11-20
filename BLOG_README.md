# Blog con Integración de Notion

## Configuración

### 1. La integración ya está configurada

El blog se conecta directamente con Notion usando la API pública. No necesitas instalar nada adicional.

### 2. Estructura de la Base de Datos en Notion

Tu base de datos debe tener estas propiedades (nombres exactos):

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **Título** | Title | Título del artículo |
| **Slug** | Text | URL amigable (opcional, se usa el URL de Notion) |
| **Categoría** | Select | Estrategia, Diseño, Branding, Social Media, etc. |
| **Fecha** | Date | Fecha de publicación |
| **Lectura** | Text | Tiempo de lectura (ej: "5 min") |
| **Excerpt** | Text | Resumen corto del artículo |
| **Imagen** | Files & media | Imagen destacada |
| **Publicado** | Checkbox | ✓ para mostrar, ✗ para ocultar |

### 3. Crear un post en Notion

1. Abre tu base de datos en Notion
2. Click en "+ New" para crear un nuevo post
3. **Rellena todos los campos obligatorios:**
   - **Título**: El título del artículo
   - **Categoría**: Selecciona una (Estrategia, Diseño, etc.)
   - **Fecha**: Fecha de publicación
   - **Lectura**: Tiempo de lectura (ej: "5 min")
   - **Excerpt**: Resumen corto (se muestra en la lista)
   - **Imagen**: Sube una imagen destacada
   - **Publicado**: ✓ Marca este checkbox para que se muestre
4. ¡El post aparecerá automáticamente en tu web!

### 4. Escribir el contenido del artículo

**IMPORTANTE:** Para que el contenido se muestre completo en la web:

1. **Click en el título del post** en tu base de datos para abrirlo como página
2. **Escribe el contenido dentro de esa página** usando bloques de Notion:
   - Párrafos normales
   - Títulos (Heading 1, 2, 3)
   - Listas con bullets o numeradas
   - Citas
   - Bloques de código
   - Imágenes
   - Separadores

3. Todo el contenido que escribas dentro de la página se mostrará en tu web

**Tip:** Si solo llenas los campos de la base de datos sin escribir contenido en la página, el artículo mostrará solo el excerpt.

## Testing local

Simplemente abre `blog.html` en tu navegador o usa un servidor local:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx serve
```

## Despliegue

Solo necesitas subir los archivos a tu hosting. La conexión con Notion se hace directamente desde el navegador usando un proxy CORS público.

## Solución de Problemas

### Los posts no se cargan
1. Verifica que la integración esté conectada a la base de datos en Notion
2. Verifica que al menos un post tenga **Publicado** ✓
3. Abre la consola del navegador (F12) para ver errores
4. Verifica que los nombres de las propiedades sean exactos (Título, Categoría, Fecha, etc.)

### Error de CORS
El script usa https://corsproxy.io/ como proxy. Si este servicio está caído, puedes cambiar a otro proxy en `assets/js/blog.js`
