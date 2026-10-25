# Level Up Gamer

## 📁 Estructura del proyecto

El proyecto está organizado en carpetas para separar los componentes visuales, las páginas, los datos, la lógica de negocio y los estilos.

| Carpeta | Descripción |
|---|---|
| `components/` | Componentes de interfaz reutilizables, como `Layout`, tarjetas, botones y otros elementos de UI. |
| `pages/` | Código de las páginas de la aplicación, como `Blog.jsx`, `ArticuloN1.jsx`, `Carrito.jsx`, etc. |
| `data/` | Datos estáticos utilizados por la aplicación, como `articulosBlog.js`. |
| `services/` | Lógica de negocio y operaciones de la aplicación, como `tienda.js`. |
| `hooks/` | Hooks personalizados de React, como `useBodyClass.js`. |
| `assets/` | Imágenes y otros recursos importados directamente en los componentes. Las imágenes utilizadas desde rutas públicas se encuentran en `public/img`. |
| `css/` | Hojas de estilo CSS del proyecto. **Todos los archivos CSS originales ya fueron migrados a esta carpeta.** |

## 🔄 Estado de la migración a React

Se está migrando el proyecto original de HTML, CSS y JavaScript a React. La siguiente lista permite identificar las páginas que ya fueron migradas y las que todavía están pendientes.

### ✅ Páginas migradas

| Archivo HTML original | Componente React |
|---|---|
| `articulo.html` | `ArticuloN1.jsx` |
| `blog.html` | `Blog.jsx` |
| `carrito.html` | `Carrito.jsx` |
| `catalogo.html` | `Catalogo.jsx` |
| `support.html` | `Soporte.jsx` |
| `detalle.html` | `DetalleProducto.jsx` |
| `error.html` | `PaginaError.jsx` |
| `index.html` | `Inicio.jsx` |

**Progreso:** 8 de 16 páginas migradas.

### ⏳ Páginas pendientes de migración

- [ ] `login.html`
- [ ] `pago.html`
- [ ] `pedidos.html`
- [ ] `perfil.html`
- [ ] `puntos.html`
- [ ] `registro.html`
- [ ] `confirmacion.html`
- [ ] `admin.html`

## 📝 Consideraciones

- Las páginas migradas deben implementarse como componentes de React dentro de `pages/`.
- Los elementos visuales que puedan reutilizarse entre varias páginas deben ubicarse en `components/`.
- Los datos estáticos deben mantenerse separados del código de presentación en `data/`.
- La lógica de negocio debe centralizarse en `services/` cuando corresponda.
- Los hooks personalizados deben ubicarse en `hooks/`.
- Los estilos CSS se encuentran centralizados en `css/`.
- Las imágenes importadas directamente por los componentes deben ubicarse en `assets/`; las imágenes accesibles mediante rutas públicas deben mantenerse en `public/img`.

## Ejecución del proyecto

Para iniciar el servidor de desarrollo, ejecuta los siguientes comandos desde la carpeta raíz del proyecto:

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

---
