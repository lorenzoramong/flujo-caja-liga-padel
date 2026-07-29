# Flujo de Caja — Liga de Padel del Atlántico

Aplicación web progresiva (PWA) para uso personal desde el celular. Usa el logo oficial de la Liga de Padel del Atlántico tanto dentro de la aplicación como en el icono que aparece al instalarla en la pantalla de inicio.

## Funciones incluidas

- Balance inicial editable.
- Balance disponible actualizado automáticamente.
- Registro de ingresos y egresos.
- Categorías y subcategorías ilimitadas.
- La lista de subcategorías depende de la categoría seleccionada.
- Historial con buscador y eliminación de movimientos.
- Exportación de movimientos a Excel.
- Estadísticas con filtros por año y mes.
- Totales de ingresos, egresos y utilidad.
- Gráfico circular de ingresos frente a egresos.
- Instalación en Android o iPhone como PWA.
- Funcionamiento sin conexión después de la primera carga.
- Pantalla inicial y encabezado con el logo oficial.

## Archivos importantes

```text
liga-padel-flujo-caja/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── logo-lpa.png
│   ├── favicon-64.png
│   ├── apple-touch-icon.png
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── pwa-maskable-512x512.png
├── src/
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

Debes subir los archivos y carpetas conservando exactamente esta estructura. No subas la carpeta contenedora como un único archivo sin descomprimir.

## Publicar en GitHub Pages desde el navegador

### 1. Crear el repositorio

1. Entra a GitHub.
2. Pulsa **New repository**.
3. Escribe un nombre, por ejemplo: `flujo-caja-liga-padel`.
4. Puede ser público. Un repositorio privado requiere un plan de GitHub que permita Pages en repositorios privados.
5. No marques la opción de crear README, `.gitignore` o licencia, porque ya están incluidos.
6. Pulsa **Create repository**.

### 2. Subir los archivos

1. Descomprime el ZIP descargado.
2. Abre la carpeta `liga-padel-flujo-caja`.
3. En el repositorio vacío, pulsa **uploading an existing file** o **Add file → Upload files**.
4. Arrastra **todo el contenido que está dentro de la carpeta**, incluyendo:
   - `.github`
   - `public`
   - `src`
   - los archivos de la raíz
5. Comprueba antes de guardar que `package.json` aparece directamente en la raíz del repositorio.
6. En el campo del commit escribe: `Subir aplicación inicial`.
7. Pulsa **Commit changes**.

> En Windows, la carpeta `.github` puede verse normalmente dentro del ZIP. Debe quedar en la ruta exacta `.github/workflows/deploy.yml`.

### 3. Activar GitHub Pages

1. Dentro del repositorio, entra a **Settings**.
2. En el menú lateral entra a **Pages**.
3. En **Build and deployment → Source**, selecciona **GitHub Actions**.
4. No selecciones `Deploy from a branch`.

### 4. Ejecutar y revisar el workflow

El workflow se ejecuta automáticamente al subir cambios a la rama `main`.

1. Abre la pestaña **Actions**.
2. Selecciona **Publicar app en GitHub Pages**.
3. Espera a que los trabajos `build` y `deploy` aparezcan en verde.
4. Al terminar, entra de nuevo a **Settings → Pages** para ver la dirección publicada.

La dirección normalmente tendrá esta forma:

```text
https://TU-USUARIO.github.io/flujo-caja-liga-padel/
```

Cada vez que cambies cualquier archivo y hagas un nuevo commit en `main`, GitHub volverá a construir y publicar la app automáticamente.

## Instalarla en el celular

### Android con Chrome

1. Abre la dirección de la app en Chrome.
2. Pulsa el menú de los tres puntos.
3. Selecciona **Instalar aplicación** o **Agregar a pantalla principal**.
4. El icono usará el emblema oficial de LPA.

### iPhone con Safari

1. Abre la dirección en Safari.
2. Pulsa **Compartir**.
3. Selecciona **Agregar a pantalla de inicio**.
4. Confirma el nombre **Flujo LPA**.

## Datos y respaldo

Los datos se guardan en `localStorage`, es decir, dentro del navegador del celular donde utilices la aplicación.

- No se sincronizan automáticamente entre dispositivos.
- No borres los datos del navegador sin exportar primero los movimientos.
- Exporta el Excel periódicamente como respaldo.
- Si abres la app en otro navegador o en otro celular, se considera una instalación diferente y empezará sin información.

## Ejecutar localmente, opcional

Debes tener Node.js instalado.

```bash
npm install
npm run dev
```

Para probar la versión de producción:

```bash
npm run build
npm run preview
```

## Solución de errores frecuentes

### El workflow no aparece

Verifica que el archivo esté exactamente en:

```text
.github/workflows/deploy.yml
```

### El workflow dice que no encuentra `package.json`

Los archivos quedaron dentro de una carpeta adicional. `package.json`, `index.html` y `vite.config.js` deben estar directamente en la raíz del repositorio.

### La página abre en blanco

1. Revisa que el workflow haya terminado en verde.
2. Comprueba que en **Settings → Pages** esté seleccionada la opción **GitHub Actions**.
3. Haz una recarga completa del navegador.
4. Si ya habías instalado una versión anterior, elimina el acceso de la pantalla de inicio y vuelve a instalarlo para actualizar iconos y caché.

### El logo anterior sigue apareciendo en el celular

Los celulares suelen guardar el icono anterior en caché. Elimina la app de la pantalla de inicio, abre nuevamente la dirección en el navegador y vuelve a agregarla.
