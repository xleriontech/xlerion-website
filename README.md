# Xlerion Website

Sitio web corporativo de Xlerion - Landing page y portal de servicios.

## Descripción

Este proyecto corresponde al sitio web institucional de Xlerion, desarrollado con React, Vite y Tailwind CSS. El sitio incluye:

- Página principal corporativa
- Sección de casos de éxito
- Generador de cotizaciones
- Portafolio de servicios
- Animaciones 3D con Three.js

## Tecnologías

- **React 19**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **Three.js** (animaciones 3D)
- **Chart.js** (gráficos)
- **Mermaid** (diagramas)

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:5174` |
| `npm run build` | Genera la build de producción |
| `npm run lint` | Ejecuta el linter ESLint |
| `npm run format` | Formatea el código con Prettier |

## Estructura relevante

```
src/          ← Código fuente de React
public/       ← Assets estáticos y HTML
scripts/      ← Scripts de mantenimiento y migración
package.json  ← Dependencias y scripts
```

## Seguridad

Se eliminaron las contraseñas hardcodeadas del código fuente. Las credenciales ahora se leen de variables de entorno (`VITE_TECHNICAL_DOC_PASSWORD`, `VITE_SELLER_PASSWORD`) mediante `.env.example`.

## Despliegue

El sitio está desplegado en `GitHub Pages`/`Cloudflare Pages` bajo el repositorio `xleriontech/xlerion-website`.